#!/usr/bin/env python3
"""Download homepage assets, preserving the original HTML and asset paths."""
import concurrent.futures, hashlib, html, json, re, time
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote, quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://optimism.ru/'
CSS_URL = re.compile(r'url\(\s*([\'\"]?)(.*?)\1\s*\)', re.I)
ASSET = re.compile(r'[\'\"]((?:https://optimism\.ru)?/(?:local|upload|fonts|bitrix)/[^\'\"<>\s]+\.(?:svg|png|jpe?g|gif|webp|woff2?|ttf|eot|mp4|webm|css|js)(?:\?[^\'\"<>\s]*)?)[\'\"]', re.I)
seen = set()
manifest = []

def normalize(value, base):
    value = html.unescape(value.strip()).strip("'\"").replace('\\/', '/')
    if '<' in value or '>' in value: return None
    if not value or value.startswith(('data:', '#', 'javascript:')): return None
    url = urljoin(base, value)
    p = urlsplit(url)
    if p.hostname != 'optimism.ru': return None
    return p._replace(fragment='').geturl()

def target(url):
    path = unquote(urlsplit(url).path).lstrip('/')
    dest = (ROOT / path).resolve()
    if not dest.is_relative_to(ROOT): raise ValueError(path)
    return dest

class Assets(HTMLParser):
    def __init__(self): super().__init__(); self.urls=set()
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        for key in ('src', 'data-src', 'data-lazy', 'poster'):
            if d.get(key): self.urls.add(d[key])
        if tag == 'link' and d.get('rel') in ('stylesheet','preload','icon'):
            self.urls.add(d['href'])
        for m in CSS_URL.finditer(d.get('style','')): self.urls.add(m[2])

def fetch(url):
    dest = target(url)
    try:
        if dest.exists(): data=dest.read_bytes()
        else:
            p=urlsplit(url); safe=p._replace(path=quote(unquote(p.path),safe='/@:+')).geturl()
            for attempt in range(3):
                try:
                    with urlopen(Request(safe,headers={'User-Agent':'Mozilla/5.0'}), timeout=30) as r: data=r.read()
                    break
                except Exception:
                    if attempt==2:raise
                    time.sleep(1)
            dest.parent.mkdir(parents=True, exist_ok=True); dest.write_bytes(data)
        entry={'url':url,'file':str(dest.relative_to(ROOT)),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
        children=set()
        if dest.suffix.lower()=='.css':
            css=data.decode('utf-8',errors='replace')
            children.update(m[2] for m in CSS_URL.finditer(css))
            children.update(re.findall(r'@import\s+[\'\"]([^\'\"]+)',css))
        if dest.suffix.lower()=='.js':
            children.update(m[1] for m in ASSET.finditer(data.decode('utf-8',errors='replace').replace('\\/','/')))
        return entry, {u for v in children if (u:=normalize(v,url))}
    except Exception as e: return {'url':url,'error':str(e)},set()

def main():
    source=ROOT/'source.html'
    if not source.exists():
        with urlopen(ORIGIN,timeout=30) as r:source.write_bytes(r.read())
    raw=source.read_text(); parser=Assets();parser.feed(raw)
    parser.urls.update(m[2] for m in CSS_URL.finditer(raw))
    parser.urls.update(m[1] for m in ASSET.finditer(raw.replace('\\/','/')))
    pending={u for v in parser.urls if (u:=normalize(v,ORIGIN))}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        while pending:
            batch=pending-seen;seen.update(batch);pending=set()
            if not batch:break
            for entry,children in pool.map(fetch,sorted(batch)):
                manifest.append(entry);pending.update(children-seen)
                if 'error' in entry:print('FAILED',entry,flush=True)
            print('Downloaded/checked:',len(manifest),'; discovered:',len(pending),flush=True)
    (ROOT/'asset-manifest.json').write_text(json.dumps({'source':ORIGIN,'captured':'2026-11-24','assets':manifest},ensure_ascii=False,indent=2)+'\n')
    print('Assets:',len(manifest),'Failures:',sum('error' in x for x in manifest),flush=True)

if __name__=='__main__':main()
