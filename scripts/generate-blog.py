#!/usr/bin/env python3
"""Generate readable, progressively enhanced blog pages from editorial source files."""
import hashlib
import html
import json
import math
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote

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
CONTRACT = '''<!-- BLOG-READ-2026: THESIS: Practical answers within an immediately searchable, categorized knowledge library with published articles and honest announcements.
OWN-WORLD: Existing Optimism navy #061d31, cyan #37c6f4, Joanna typography, white reading ground, rounded illustrations.
STORY: Find a business problem; read an answer, example and checklist; continue to a related guide.
FIRST VIEWPORT: Compact brand navigation, large blog title beside a short purpose, visible search and topics, searchable illustrated entries, readiness filter and five topics.
FORM: User-pinned TexTerra editorial methods within the established Optimism world; code-first, no new visual identity. Signature: search and topic state survives article navigation and browser Back.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->'''

ARTICLE_CONTRACT = """<!-- BLOG-READ-2026 / ARTICLE-INSTRUCTIONS-2026:
THESIS: A reader can repeat a useful SEO task, inspect real screenshots and choose relevant help.
OWN-WORLD: Existing Optimism navy/cyan/Joanna identity on a white reading surface.
STORY: Prerequisites; numbered actions and expected outcomes; source screenshots; worksheet; contextual service.
FIRST VIEWPORT: Wide desktop composition: article heading and generated cover; contents, readable main column and same-category recommendations. Mobile prioritizes the instruction.
FORM: Sticky desktop and mobile contents, preserved deep links, original-size screenshot inspection with keyboard exit, ordinary commercial links, same-category reading on the right and cross-category recommendations below.
FINISH: unreviewed and undocumented is unfinished; retain verified image provenance, finish review and scoped DESIGN.md. -->"""

ANNOUNCEMENT_CONTRACT = """<!-- BLOG-READ-2026 / ANNOUNCEMENT-2026:
THESIS: Explain a planned topic honestly and direct readers to available instructions.
OWN-WORLD: Existing Optimism navy/cyan/Joanna with a distinct generated editorial cover.
STORY: Topic; explicit unpublished status; brief outline; working links to existing articles.
FIRST VIEWPORT: Title and clear announcement notice, without invented author, date, reading time or popularity.
FORM: Responsive preview inside the knowledge library; no fabricated full article.
FINISH: Scope review, accessible navigation, image provenance and documentation are required. -->"""

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
<link rel="canonical" href="{PUBLIC}{path}"><meta property="og:type" content="{'article' if schema.get('@type')=='BlogPosting' else 'website'}"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(description)}"><meta property="og:url" content="{PUBLIC}{path}"><meta name="theme-color" content="#061d31">
<link rel="icon" href="/local/templates/optimism/img/favicon.svg"><link rel="preload" href="/fonts/JoannaSansNova/JoannaSansNova.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="/assets/blog.css?v={version('assets/blog.css')}"><link rel="stylesheet" href="/assets/library.css?v={version('assets/library.css')}"><script defer src="/assets/blog.js?v={version('assets/blog.js')}"></script>
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False).replace('</', '<\\/')}</script></head><body class="{'article-page library-article' if article else 'blog-page library-page'}">{ARTICLE_CONTRACT if schema.get('@type')=='BlogPosting' else ANNOUNCEMENT_CONTRACT if schema.get('@type')=='WebPage' else CONTRACT}{header()}{main}{footer()}</body></html>'''

def cover(a, eager=False):
    return f'<img src="/assets/blog/covers/{a["cover"]}.webp" srcset="/assets/blog/covers/{a["cover"]}-600.webp 600w, /assets/blog/covers/{a["cover"]}.webp 1200w" sizes="(max-width: 650px) 100vw, (max-width: 1100px) 50vw, 33vw" width="1200" height="800" alt="" {"fetchpriority=\"high\"" if eager else "loading=\"lazy\""}>'

def metadata(a):
    status = f'<span class="ready-state">Читать · {a["readingMinutes"]} мин</span>' if a['status']=='published' else '<span class="planned-state">Готовится</span>'
    return f'<div class="article-meta"><span>{E(a["category"])}</span>{status}</div>'

def card(a, heading='h2', eager=False):
    return f'''<article class="story" data-slug="{a['slug']}" data-status="{a['status']}"><a class="story-cover" href="/blog/{a['slug']}/" tabindex="-1" aria-hidden="true">{cover(a,eager)}</a><div class="story-body">{metadata(a)}<{heading}><a class="story-link" href="/blog/{a['slug']}/">{E(a['title'])}{ARROW}</a></{heading}><p>{E(a['summary'])}</p></div></article>'''

def same_category(a, articles):
    others=[x for x in articles if x['slug']!=a['slug'] and x['category']==a['category']]
    items=''.join(f'<li><a href="/blog/{x["slug"]}/">{cover(x)}<span>{E(x["title"])}<small>{"Читать · "+str(x["readingMinutes"])+" мин" if x["status"]=="published" else "Готовится · анонс"}</small></span></a></li>' for x in others)
    return f'<aside class="read-also" aria-labelledby="read-also-title"><h2 id="read-also-title">Читайте также</h2><p>В рубрике «{E(a["category"])}»</p><ul>{items}</ul><a class="category-link" href="/blog/?topic={quote(a["category"])}">Все материалы рубрики {ARROW}</a></aside>'

def recommendations(a, articles):
    chosen=[]; seen=set()
    for x in articles:
        if x['category']!=a['category'] and x['category'] not in seen:
            chosen.append(x);seen.add(x['category'])
        if len(chosen)==3:break
    return f'<section class="recommendations" aria-labelledby="recommendations-title"><div class="section-heading"><div><h2 id="recommendations-title">Вам может быть интересно</h2><p>Материалы из других рубрик. Анонсы отмечены словом «Готовится».</p></div><a href="/blog/">Вся библиотека {ARROW}</a></div><div class="recommendation-grid">{"".join(card(x,"h3") for x in chosen)}</div></section>'

def main():
    published=json.loads((CONTENT/'articles.json').read_text())
    planned=json.loads((CONTENT/'planned.json').read_text())
    categories=json.loads((CONTENT/'categories.json').read_text())
    articles=published+planned
    assert len({a['slug'] for a in articles})==len(articles)
    for a in published:
        a['body']=(CONTENT/a['bodyFile']).read_text()
        outline=Outline();outline.feed(a['body']);a['outline']=outline.headings
        assert all(x['id'] for x in outline.headings)
        a['searchText']=' '.join(outline.text)
        a['readingMinutes']=max(1,math.ceil(len(a['searchText'].split())/180))
        a['searchText'] += (' заявки лиды конверсия обращения продажи аналитика' if a['cover']=='traffic-leads' else ' метатеги метатегов тайтл тайтлы дескрипшн сниппет title description')
    for a in planned:a['searchText']=' '.join(a['outlineTopics'])+' '+a['keywords']
    BLOG.mkdir(exist_ok=True)
    filters=f'<button type="button" data-topic="" aria-pressed="true">Все рубрики <span>{len(articles)}</span></button>'+''.join(f'<button type="button" data-topic="{E(c["name"])}" aria-pressed="false">{E(c["name"])} <span>{sum(a["category"]==c["name"] for a in articles)}</span></button>' for c in categories)
    searchdata=[{k:a[k] for k in ['slug','title','summary','topics','category','status','searchText']} for a in articles]
    index=f'''<main id="main" class="blog-main shell"><section class="library-intro"><div><h1>Библиотека знаний<span class="title-dot">.</span></h1><p>Разобраться в маркетинге. Найти решение для бизнеса.</p></div><p class="library-note"><strong>{len(published)} готовые статьи</strong> · {len(planned)} анонсов</p></section>
<section class="discovery" aria-label="Найти материал"><form class="search-form" role="search" action="/blog/"><label for="blog-search">Что хотите узнать?</label><div class="search-field">{SEARCH}<input id="blog-search" name="q" type="search" placeholder="Например, метатеги, отзывы или реклама" maxlength="160" autocomplete="off" aria-controls="stories"><button class="clear-search" type="button" aria-label="Очистить поиск" hidden><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.6"/></svg></button><button class="search-submit" type="submit">Найти</button></div></form><div class="availability-filter" hidden><label for="availability">Показывать</label><select id="availability"><option value="all">Все материалы</option><option value="published">Можно прочитать</option><option value="planned">Анонсы</option></select></div><div class="topic-filters" role="group" aria-label="Рубрика" hidden>{filters}</div><noscript><p>Все материалы доступны ниже. Для поиска и фильтров включите JavaScript.</p></noscript></section>
<section class="stories-section" aria-labelledby="stories-heading"><div class="section-heading"><div><h2 id="stories-heading">Все материалы</h2><p id="category-description">Готовые инструкции — в начале.</p></div><p id="results-count" role="status" aria-live="polite" aria-atomic="true">{len(articles)} материалов</p></div><div class="stories library-grid" id="stories">{''.join(card(a,eager=i<2) for i,a in enumerate(articles))}</div><div class="search-empty" hidden><h3>Подходящих материалов пока нет</h3><p id="empty-description"></p><p>Попробуйте изменить запрос или сбросить фильтры.</p><button class="text-button reset-search" type="button">Показать все материалы {ARROW}</button></div></section>
<aside class="library-help"><h2>От знания к действию</h2><p>Выберите инструкцию, выполните проверку и сохраните результат. Если нужна помощь команды, в готовых статьях есть ссылки на услуги по вашей задаче.</p><a href="/blog/?status=published">Показать готовые инструкции {ARROW}</a></aside><script id="blog-search-data" type="application/json">{json.dumps(searchdata,ensure_ascii=False).replace('</','<\\/')}</script><script id="blog-categories" type="application/json">{json.dumps(categories,ensure_ascii=False)}</script></main>'''
    schema={'@context':'https://schema.org','@type':'CollectionPage','name':'Библиотека знаний Оптимизма','url':PUBLIC+'/blog/','mainEntity':{'@type':'ItemList','itemListElement':[{'@type':'ListItem','position':i+1,'name':a['title'],'url':PUBLIC+'/blog/'+a['slug']+'/'} for i,a in enumerate(articles)]}}
    (BLOG/'index.html').write_text(page('Библиотека знаний Оптимизма — SEO, контент, SMM и реклама','Инструкции по маркетингу для бизнеса: поиск по материалам, рубрики, примеры и чек-листы. Готовые статьи и анонсы будущих тем.','/blog/',index,schema))
    for a in articles:
        crumbs=f'<nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="/index.html">Главная</a><span aria-hidden="true">/</span><a class="back-to-blog" href="/blog/">Библиотека</a><span aria-hidden="true">/</span><a href="/blog/?topic={quote(a["category"])}">{E(a["category"])}</a></nav>'
        if a['status']=='published':
            toc=''.join(f'<li><a href="#{E(h["id"])}">{E(h["text"])}</a></li>' for h in a['outline'])
            content=f'''<progress class="reading-progress" max="100" value="0" aria-label="Прогресс чтения" hidden></progress><main id="main" class="shell">{crumbs}<article><header class="article-heading"><div><h1>{E(a['title'])}</h1><p class="article-summary">{E(a['summary'])}</p><div class="article-meta"><span>{E(a['category'])}</span><time datetime="{a['date']}">25 ноября 2026</time><span>{a['readingMinutes']} мин чтения</span></div><div class="article-tools" hidden><button type="button" data-copy-link>Скопировать ссылку{ARROW}</button><button type="button" data-print>Распечатать</button><span class="copy-status" role="status" aria-live="polite"></span></div></div><figure class="article-cover">{cover(a,True)}</figure></header><div class="reading-layout"><aside class="article-sidebar"><details class="toc" open><summary>В этой статье <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.6"/></svg></summary><nav aria-label="Содержание статьи"><ol>{toc}</ol></nav></details><a class="back-to-blog sidebar-back" href="/blog/">В библиотеку {ARROW}</a></aside><div class="article-content" id="article-content">{a['body']}</div>{same_category(a,articles)}</div></article>{recommendations(a,articles)}</main>'''
            schema={'@context':'https://schema.org','@type':'BlogPosting','headline':a['title'],'description':a['description'],'datePublished':a['date'],'dateModified':a['updated'],'inLanguage':'ru','mainEntityOfPage':PUBLIC+'/blog/'+a['slug']+'/','image':PUBLIC+'/assets/blog/covers/'+a['cover']+'.webp','publisher':{'@type':'Organization','name':'Оптимизм','url':'https://optimism.ru/'},'citation':[s['url'] for s in a['sources']]}
            title=a['title']+' — Блог Оптимизма'
        else:
            content=f'''<main id="main" class="shell planned-page">{crumbs}<section class="planned-intro"><div><h1>{E(a['title'])}</h1><p class="planned-notice"><strong>Материал готовится.</strong> Это анонс темы. Полная статья пока не опубликована.</p><p class="article-summary">{E(a['summary'])}</p><h2>Что планируем разобрать</h2><ul>{''.join('<li>'+E(t)+'</li>' for t in a['outlineTopics'])}</ul><div class="planned-actions"><a class="primary-link" href="/blog/?status=published">Читать готовые статьи {ARROW}</a><a class="back-to-blog" href="/blog/">Вернуться в библиотеку</a></div></div><figure>{cover(a,True)}</figure></section><section class="available-now"><h2>Уже можно прочитать</h2><div class="recommendation-grid">{''.join(card(x,'h3') for x in published)}</div></section>{recommendations(a,articles)}</main>'''
            schema={'@context':'https://schema.org','@type':'WebPage','name':a['title']+' — анонс','description':'Анонс будущего материала. Полная статья пока не опубликована.','url':PUBLIC+'/blog/'+a['slug']+'/'}
            title=a['title']+' — анонс | Оптимизм'
        dest=BLOG/a['slug'];dest.mkdir(exist_ok=True)
        (dest/'index.html').write_text(page(title,a['description'],'/blog/'+a['slug']+'/',content,schema,True))
    print(f'Generated knowledge library: {len(published)} articles, {len(planned)} announcements, {len(categories)} categories')

if __name__=='__main__':main()
