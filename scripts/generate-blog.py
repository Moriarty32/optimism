#!/usr/bin/env python3
"""Generate readable, progressively enhanced blog pages from editorial source files."""
import hashlib
import html
import json
import math
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'content/blog'
BLOG = ROOT / 'blog'
PUBLIC = 'https://moriarty32.github.io/optimism'
E = html.escape

class Outline(HTMLParser):
    def __init__(self):
        super().__init__(); self.headings=[]; self.text=[]; self.current=None
    def handle_starttag(self, tag, attrs):
        if tag == 'h2': self.current = {'id':dict(attrs).get('id',''), 'text':''}
    def handle_data(self, data):
        self.text.append(data)
        if self.current is not None: self.current['text'] += data
    def handle_endtag(self, tag):
        if tag == 'h2' and self.current is not None:
            self.headings.append(self.current); self.current=None

ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.5"/></svg>'
SEARCH = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 5 5" stroke="currentColor" stroke-width="1.7"/></svg>'
CONTRACT = '''<!-- BLOG-READ-2026: THESIS: Practical answers within an immediately searchable, two-article editorial index.
OWN-WORLD: Existing Optimism navy #061d31, cyan #37c6f4, Joanna typography, white reading ground, rounded illustrations.
STORY: Find a business problem; read an answer, example and checklist; continue to a related guide.
FIRST VIEWPORT: Compact brand navigation, large blog title beside a short purpose, visible search and topics, two editorial entries with explanatory illustrations.
FORM: User-pinned TexTerra editorial methods within the established Optimism world; code-first, no new visual identity. Signature: search and topic state survives article navigation and browser Back.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->'''

ARTICLE_CONTRACT = """<!-- BLOG-READ-2026 / ARTICLE-INSTRUCTIONS-2026:
THESIS: A reader can repeat a useful SEO task, inspect real screenshots and choose relevant help.
OWN-WORLD: Existing Optimism navy/cyan/Joanna identity on a white reading surface.
STORY: Prerequisites; numbered actions and expected outcomes; source screenshots; worksheet; contextual service.
FIRST VIEWPORT: Compact title and specific summary, reading tools, accessible contents and start of instructions; no decorative hero image.
FORM: Sticky desktop and mobile contents, preserved deep links, original-size screenshot inspection with keyboard exit, ordinary commercial links as progressive enhancement.
FINISH: unreviewed and undocumented is unfinished; retain verified image provenance, finish review and scoped DESIGN.md. -->"""

def version(file):
    return hashlib.sha256((ROOT/file).read_bytes()).hexdigest()[:12]

def header():
    return f'''<a class="skip-link" href="#main">К содержанию</a>
<header class="site-header"><div class="header-inner">
<a class="brand" href="/index.html" aria-label="Оптимизм — на главную"><img src="/local/templates/optimism/img/logo_new.svg" width="206" height="36" alt="Оптимизм.ру"></a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" hidden>Меню<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8h16M4 16h16" stroke="currentColor" stroke-width="1.5"/></svg></button>
<nav id="site-nav" aria-label="Основная навигация"><a href="/index.html">Главная</a><a href="/index.html#directions">Услуги</a><a href="/index.html#projects">Кейсы</a><a href="/blog/" aria-current="page">Блог</a></nav>
<a class="header-contact" href="https://optimism.ru/howtofind/">Обсудить задачу{ARROW}</a></div></header>'''

def footer():
    return f'''<footer class="site-footer"><div class="footer-inner"><div><a class="footer-brand" href="/index.html">Оптимизм.</a><p>Разбираемся в маркетинге.<br>Находим решения для бизнеса.</p></div><nav aria-label="Навигация в подвале"><a href="/blog/">Все статьи</a><a href="/index.html#directions">Наши услуги</a><a href="https://optimism.ru/howtofind/">Контакты</a></nav><div class="footer-contact"><a href="mailto:go@optimism.ru">go@optimism.ru{ARROW}</a><a href="tel:+74951182098">+7 (495) 118-20-98</a></div></div><div class="footer-bottom"><span>© Оптимизм, 2026</span><a href="https://optimism.ru/blog/soglasie/">Обработка персональных данных</a></div></footer>'''

def page(title, description, path, main, schema, article=False):
    return f'''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(title)}</title><meta name="description" content="{E(description)}"><meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="{PUBLIC}{path}"><meta property="og:type" content="{'article' if article else 'website'}"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(description)}"><meta property="og:url" content="{PUBLIC}{path}"><meta name="theme-color" content="#061d31">
<link rel="icon" href="/local/templates/optimism/img/favicon.svg"><link rel="preload" href="/fonts/JoannaSansNova/JoannaSansNova.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="/assets/blog.css?v={version('assets/blog.css')}"><script defer src="/assets/blog.js?v={version('assets/blog.js')}"></script>
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False).replace('</', '<\\/')}</script></head><body class="{'article-page' if article else 'blog-page'}">{ARTICLE_CONTRACT if article else CONTRACT}{header()}{main}{footer()}</body></html>'''

def metadata(a):
    return f'<div class="article-meta"><span>{E(" · ".join(a["topics"]))}</span><time datetime="{a["date"]}">25 ноября 2026</time><span>{a["readingMinutes"]} мин чтения</span></div>'

def card(a, related=False):
    return f'''<article class="story{' related-story' if related else ''}" data-slug="{a['slug']}"><a class="story-cover" href="/blog/{a['slug']}/" tabindex="-1" aria-hidden="true"><img src="/assets/blog/{a['cover']}.svg" width="960" height="580" alt="" {'loading="lazy"' if related else 'fetchpriority="high"'}></a><div class="story-body"><h2><a class="story-link" href="/blog/{a['slug']}/">{E(a['title'])}{ARROW}</a></h2>{metadata(a)}<p>{E(a['summary'])}</p></div></article>'''

def main():
    articles=json.loads((CONTENT/'articles.json').read_text())
    assert len(articles)==2 and len({a['slug'] for a in articles})==2
    for a in articles:
        a['body']=(CONTENT/a['bodyFile']).read_text()
        outline=Outline(); outline.feed(a['body']); a['outline']=outline.headings
        assert all(x['id'] for x in outline.headings), 'Every H2 needs a stable anchor'
        assert len({x['id'] for x in outline.headings})==len(outline.headings)
        a['searchText']=' '.join(outline.text)
        a['readingMinutes']=max(1, math.ceil(len(a['searchText'].split())/180))
        a['searchText'] += (' заявки лиды конверсия обращения продажи аналитика' if a['cover']=='funnel' else ' метатеги метатегов тайтл тайтлы дескрипшн сниппет заголовки описание title description')
    BLOG.mkdir(exist_ok=True)
    topics=[t for t in dict.fromkeys(t for a in articles for t in a['topics']) if not all(t in a['topics'] for a in articles)]
    filters='<button type="button" data-topic="" aria-pressed="true">Все статьи <span>2</span></button>'+''.join(f'<button type="button" data-topic="{E(t)}" aria-pressed="false">{E(t)} <span>{sum(t in a["topics"] for a in articles)}</span></button>' for t in topics)
    searchdata=[{k:a[k] for k in ['slug','title','summary','topics','searchText']} for a in articles]
    index=f'''<main id="main" class="blog-main shell"><section class="blog-intro" aria-labelledby="blog-title"><h1 id="blog-title">Блог Оптимизма<span class="title-dot">.</span></h1><p>О том, как привлекать клиентов<br class="desktop-break"> и понимать свой маркетинг.<br class="desktop-break"> С примерами и понятными шагами.</p></section>
<section class="discovery" aria-label="Найти статью"><form class="search-form" role="search" action="/blog/"><label for="blog-search">Поиск по статьям</label><div class="search-field">{SEARCH}<input id="blog-search" name="q" type="search" placeholder="Например, метатеги или заявки" maxlength="160" autocomplete="off" aria-controls="stories"><button class="clear-search" type="button" aria-label="Очистить поиск" hidden><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.6"/></svg></button><button class="search-submit" type="submit">Найти</button></div></form><div class="topic-filters" role="group" aria-label="Тема статьи" hidden>{filters}</div><noscript><p class="no-script">Поиск работает с JavaScript. Обе статьи доступны ниже.</p></noscript></section>
<section class="stories-section" aria-labelledby="stories-heading"><div class="section-heading"><h2 id="stories-heading">Разобраться и применить</h2><p id="results-count" role="status" aria-live="polite" aria-atomic="true">2 материала</p></div><div class="stories" id="stories">{''.join(card(a) for a in articles)}</div><div class="search-empty" hidden><h3>Такой статьи пока нет</h3><p id="empty-description"></p><p>Попробуйте «метатеги», «трафик» или «заявки».</p><button type="button" class="text-button reset-search">Показать все статьи {ARROW}</button></div></section>
<aside class="editorial-note"><h2>Меньше догадок.<br>Больше понимания.</h2><div><p>В каждом руководстве — конкретная задача, порядок действий и источники, которые можно проверить. Начните с вопроса, который важен вашему бизнесу сейчас.</p><a href="/index.html#directions">Нужна помощь с продвижением? {ARROW}</a></div></aside>
<script id="blog-search-data" type="application/json">{json.dumps(searchdata,ensure_ascii=False).replace('</','<\\/')}</script></main>'''
    schema={'@context':'https://schema.org','@type':'Blog','name':'Блог Оптимизма','url':PUBLIC+'/blog/','blogPost':[{'@type':'BlogPosting','headline':a['title'],'url':PUBLIC+'/blog/'+a['slug']+'/'} for a in articles]}
    (BLOG/'index.html').write_text(page('Блог Оптимизма — SEO и маркетинг для бизнеса','Практические руководства по SEO, контенту и аналитике: понятные шаги, примеры и чек-листы для владельцев бизнеса и маркетологов.','/blog/',index,schema))
    for a in articles:
        toc=''.join(f'<li><a href="#{E(h["id"])}">{E(h["text"])}</a></li>' for h in a['outline'])
        other=next(x for x in articles if x['slug']!=a['slug'])
        article=f'''<progress class="reading-progress" max="100" value="0" aria-label="Прогресс чтения" hidden></progress><main id="main" class="shell"><nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="/index.html">Главная</a><span aria-hidden="true">/</span><a class="back-to-blog" href="/blog/">Блог</a><span aria-hidden="true">/</span><span>{E(a['topics'][0])}</span></nav><article><header class="article-heading"><div><h1>{E(a['title'])}</h1><p class="article-summary">{E(a['summary'])}</p>{metadata(a)}<div class="article-tools" hidden><button type="button" data-copy-link>Скопировать ссылку{ARROW}</button><button type="button" data-print>Распечатать</button><span class="copy-status" role="status" aria-live="polite"></span></div></div></header><div class="reading-layout"><aside class="article-sidebar"><details class="toc" open><summary>В этой статье <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.6"/></svg></summary><nav aria-label="Содержание статьи"><ol>{toc}</ol></nav></details><a class="back-to-blog sidebar-back" href="/blog/">Все статьи {ARROW}</a></aside><div class="article-content" id="article-content">{a['body']}</div></div></article><section class="related" aria-labelledby="related-title"><div class="section-heading"><h2 id="related-title">Продолжить разбираться</h2><a class="back-to-blog" href="/blog/">Все статьи {ARROW}</a></div>{card(other,True)}</section></main>'''
        schema={'@context':'https://schema.org','@type':'BlogPosting','headline':a['title'],'description':a['description'],'datePublished':a['date'],'dateModified':a['updated'],'inLanguage':'ru','mainEntityOfPage':PUBLIC+'/blog/'+a['slug']+'/','publisher':{'@type':'Organization','name':'Оптимизм','url':'https://optimism.ru/'},'citation':[s['url'] for s in a['sources']]}
        dest=BLOG/a['slug'];dest.mkdir(exist_ok=True)
        (dest/'index.html').write_text(page(a['title']+' — Блог Оптимизма',a['description'],'/blog/'+a['slug']+'/',article,schema,True))
    print('Generated blog index and',len(articles),'complete articles')

if __name__=='__main__': main()
