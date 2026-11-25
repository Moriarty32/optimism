#!/usr/bin/env python3
"""Build the refined homepage, preserving the original header and footer."""
import re
import hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
raw=(ROOT/'source.html').read_text()
# Tracking and remote CRM widgets are not part of the local static frontend.
remote=('googletagmanager.com','go.optimism.ru','vk.com/js/api/openapi')
def script(m):
    return '' if any(host in m[0] for host in remote) else m[0]
raw=re.sub(r'<script\b[^>]*>.*?</script>',script,raw,flags=re.S|re.I)
raw=re.sub(r'<noscript\b[^>]*>.*?</noscript>','',raw,flags=re.S|re.I)
raw=re.sub(r'<link\b[^>]*rel="(?:preconnect|dns-prefetch)"[^>]*>','',raw)
# Links to other pages still lead to the original site. Local assets retain paths.
def link(m):
    tag=m[0]
    def href(h):
        value=h[2]
        if value=='/':value='./index.html'
        elif value in ('/blog/', 'https://optimism.ru/blog/'):value='./blog/'
        elif value.startswith('/') and not value.startswith('//'):value='https://optimism.ru'+value
        return h[1]+value+h[3]
    return re.sub(r'(\bhref=[\"\'])([^\"\']*)([\"\'])',href,tag)
raw=re.sub(r'<a\b[^>]*>',link,raw,flags=re.I)
raw=raw.replace('https://optimism.ru/local/','/local/')
cookie=(ROOT/'local/templates/optimism/js/cookie-stroka.js').read_text()
cookie=cookie.replace("; domain=' + domen + '; path=/; SameSite=Lax; Secure; max-age=", "; path=/; SameSite=Lax; max-age=")
(ROOT/'local-cookie.js').write_text(cookie)
raw=re.sub(r'/local/templates/optimism/js/cookie-stroka\.js(?:\?[^\"]*)?', '/local-cookie.js', raw)
widget=(ROOT/'widget/original.html').read_text().replace('https://go.optimism.ru/upload/resize_cache/crm/d42/100_100_1/d4291bee86804ebec0d87b36cf2b1774.png', '/widget/avatar.png')
raw=raw.replace('</body>', '<template id="local-widget-template">'+widget+'</template><script defer src="/widget/local-widget.js"></script></body>')
raw=raw.replace('</body>', '<script defer src="/local-preview.js"></script></body>')
main=(ROOT/'partials/homepage.html').read_text()
raw=re.sub(r'<main\b[^>]*>.*?</main>',lambda _: main,raw,count=1,flags=re.S|re.I)
# This published preview must not compete with the original domain in search.
raw=re.sub(r'<meta\b[^>]*name=["\']robots["\'][^>]*>','',raw,flags=re.I)
raw=raw.replace('</head>', '<meta name="robots" content="noindex, nofollow"><link rel="stylesheet" href="/assets/homepage.css"><link rel="stylesheet" href="/assets/hero.css"><link rel="stylesheet" href="/assets/studio.css"><link rel="stylesheet" href="/assets/resources-contact.css"><link rel="stylesheet" href="/assets/editorial.css"><link rel="stylesheet" href="/assets/ui-refinements.css"><link rel="stylesheet" href="/assets/visual-system.css"></head>')
raw=raw.replace('</body>', '<script defer src="/assets/homepage.js"></script><script defer src="/assets/hero.js"></script><script defer src="/assets/solutions.js"></script><script defer src="/assets/studio.js"></script><script defer src="/assets/services-motion.js"></script></body>')
# A new page must never reuse an older cached UI stylesheet or script.
# Content-derived URLs change automatically whenever one of these files changes.
for asset in ('assets/homepage.css','assets/hero.css','assets/studio.css','assets/resources-contact.css','assets/editorial.css','assets/ui-refinements.css','assets/visual-system.css','assets/studio.js','assets/services-motion.js','assets/homepage.js','assets/hero.js','assets/solutions.js'):
    revision=hashlib.sha256((ROOT/asset).read_bytes()).hexdigest()[:12]
    raw=raw.replace('/'+asset+'"','/'+asset+'?v='+revision+'"')
(ROOT/'index.html').write_text(raw)
print('Prepared index.html:',len(raw),'characters')
