#!/usr/bin/env python3
"""Validate the generated GitHub Pages blog, local links and content contracts."""
import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote,urlsplit

class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=[];self.links=[];self.resources=[];self.h1=0;self.robots=[];self.lang=None;self.schema=[];self.script=None
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if a.get('id'):self.ids.append(a['id'])
        if tag=='h1':self.h1+=1
        if tag=='html':self.lang=a.get('lang')
        if tag=='a' and a.get('href'):self.links.append(a['href'])
        if tag in ('img','script') and a.get('src'):self.resources.append(a['src'])
        if tag=='link' and a.get('rel') in ('stylesheet','preload','icon'):self.resources.append(a['href'])
        if tag=='meta' and a.get('name')=='robots':self.robots.append(a.get('content',''))
        if tag=='script' and a.get('type')=='application/ld+json':self.script=''
    def handle_data(self,data):
        if self.script is not None:self.script+=data
    def handle_endtag(self,tag):
        if tag=='script' and self.script is not None:self.schema.append(json.loads(self.script));self.script=None

parser=argparse.ArgumentParser();parser.add_argument('--directory',default='dist');parser.add_argument('--base',default='/optimism/');args=parser.parse_args()
root=Path(args.directory).resolve();base=args.base
pages=list((root/'blog').rglob('index.html'));assert len(pages)==3
cache={}
def parsed(file):
    if file not in cache:
        p=Page();p.feed(file.read_text());cache[file]=p
    return cache[file]
checked=0
for file in pages:
    p=parsed(file)
    assert p.h1==1 and p.lang=='ru',file
    assert len(p.ids)==len(set(p.ids)),f'Duplicate id: {file}'
    assert p.robots==['noindex, nofollow'],f'Preview indexing policy: {file}'
    assert len(p.schema)==1 and p.schema[0]['@type'] in ('Blog','BlogPosting')
    assert 'BLOG-READ-2026' in file.read_text(), 'Missing direction contract'
    for url in p.links+p.resources:
        u=urlsplit(url)
        if u.scheme or u.netloc:continue
        path=unquote(u.path)
        if path.startswith('/'):
            assert path.startswith(base),f'Unprefixed root URL: {url}'
            dest=root/path[len(base):]
        elif path:dest=(file.parent/path).resolve()
        else:dest=file
        if dest.is_dir():dest=dest/'index.html'
        assert dest.is_file(),f'Broken link {file}: {url} -> {dest}'
        if u.fragment and dest.suffix=='.html':assert unquote(u.fragment) in parsed(dest).ids,f'Missing anchor {url}'
        checked+=1
home=parsed(root/'index.html')
assert any(x in ('./blog/',base+'blog/') for x in home.links),'Homepage must link to local blog'
print(f'PASS: {len(pages)} pages; {checked} local links/resources; headings, IDs, schema and preview directives.')
