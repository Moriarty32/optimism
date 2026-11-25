#!/usr/bin/env python3
"""Build a portable static site for a GitHub Pages project path."""
import argparse,re,shutil,subprocess,sys
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--base',default='/optimism/');p.add_argument('--output',default='dist');args=p.parse_args()
root=Path(__file__).resolve().parents[1]
subprocess.run([sys.executable,str(root/'scripts/generate-blog.py')],check=True)
base='/'+args.base.strip('/')+'/' if args.base.strip('/') else '/'
out=Path(args.output).resolve()
if out==root or root in out.parents and out.name!='dist':raise SystemExit('Use dist or an output directory outside the site source.')
if out.exists():shutil.rmtree(out)
out.mkdir(parents=True)
for name in ['assets','bitrix','fonts','local','upload','widget','blog']:
 shutil.copytree(root/name,out/name,ignore=shutil.ignore_patterns('*.mp4','original.html','__pycache__'))
for name in ['index.html','local-preview.js','local-cookie.js']:shutil.copy2(root/name,out/name)
prefixes=r'(?:assets|bitrix|fonts|local|upload|widget|blog|index\.html|local-preview\.js|local-cookie\.js)'
for file in out.rglob('*'):
 if file.suffix not in {'.html','.css','.js'}:continue
 text=file.read_text()
 # Only root-relative asset URLs; leave remote business links and protocol URLs intact.
 text=re.sub(r'(?<=["\'(\s=])/('+prefixes+r')(?=[/.?#"\')\s])',lambda m:base+m[1],text)
 text=re.sub(r'(?<=&quot;)/('+prefixes+r')(?=[/.?])',lambda m:base+m[1],text)
 # Bitrix's JSON-escaped resource registry.
 text=re.sub(r'(?<=["\'])\\/('+prefixes+r')(?=\\/)',lambda m:base.replace('/','\\/')+m[1],text)
 file.write_text(text)
(out/'.nojekyll').touch()
print(f'Built {sum(x.is_file() for x in out.rglob("*"))} files in {out}; base {base}')
