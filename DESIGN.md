---
name: Optimism Blog
description: The existing Optimism identity extended to a searchable knowledge library.
colors:
  ink: "#092d40"
  navy: "#061d31"
  muted: "#516c7c"
  blue: "#006d98"
  cyan: "#37c6f4"
  pale: "#edf6fb"
  line: "#cfdee6"
  paper: "#fff"
typography:
  display:
    fontFamily: "Joanna, Arial, sans-serif"
    fontSize: "clamp(44px,4.6vw,76px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-.035em"
  article-title:
    fontFamily: "Joanna, Arial, sans-serif"
    fontSize: "clamp(42px,3.6vw,66px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Joanna, Arial, sans-serif"
    fontSize: "37px"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "-.025em"
  title:
    fontFamily: "Joanna, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-.02em"
  body:
    fontFamily: "Joanna, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  reading:
    fontFamily: "Joanna, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Joanna, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  button: "8px"
  field: "12px"
  cover: "18px"
  topic: "30px"
components:
  button-primary:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    padding: "12px 17px"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.blue}"
    padding: "10px 0"
  button-outline:
    textColor: "{colors.ink}"
    rounded: "50px"
    padding: "12px 19px"
  search-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "7px 8px 7px 19px"
  topic:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.topic}"
    padding: "10px 17px"
  topic-selected:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.topic}"
    padding: "10px 17px"
  readiness-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "14px 36px 14px 16px"
  planned-notice:
    backgroundColor: "{colors.pale}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "18px 22px"
  reading-rail:
    textColor: "{colors.ink}"
  story:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  navigation:
    textColor: "{colors.ink}"
  contents:
    textColor: "{colors.muted}"
  download-link:
    textColor: "{colors.blue}"
    rounded: "{rounded.button}"
    padding: "10px 18px"
  service-next:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "16px"
    padding: "30px 32px"
  takeaway:
    backgroundColor: "{colors.pale}"
    textColor: "{colors.ink}"
    rounded: "18px"
    padding: "30px 34px"
---

# Design System: Optimism Blog

## Overview

**Creative North Star: "Practical guides in the Optimism identity"**

This is a scoped record of the implemented knowledge library: `blog/index.html`, two complete guides and nine announcement pages across five rubrics (SEO, Контент, SMM, Реклама, GEO / AEO). Source authority is `assets/blog.css` followed by `assets/library.css`, `assets/blog.js`, `scripts/generate-blog.py`, and the illustration assets. It does not define or redesign the homepage. Product context is in `docs/blog-product-context.md`; the current library composition and evidence are recorded in `docs/library-structure.txt`. This reconciles the shipped library with the established identity; it introduces no new visual concept.

The existing logo, Joanna type, navy and cyan anchor a light editorial surface. Regular-weight headings and colorful topic covers support scanning; quiet status labels distinguish readable guides from planned material. TexTerra informs editorial mechanics within this identity. Generated covers are original illustrations, while instructional figures identify their source or teaching-example status; neither represents invented client results. This documentation records source behavior after the finish review; it does not claim fresh browser testing or user research.

**Key Characteristics:**

- White reading ground, navy structure, blue interactive text and restrained cyan accents.
- Regular Joanna headings, generous article leading and a bounded reading column.
- Open editorial entries with rounded illustrations, rather than enclosed card panels.
- Search, rubric and readiness controls progressively enhance static guides and honest announcements.

## Colors

### Primary

**Deep navy (`navy`)** anchors the footer, selected topics, submit button and the funnel illustration. **Action blue (`blue`)** distinguishes links, markers, reading progress and active navigation. **Bright cyan (`cyan`)** supplies illustration emphasis and text selection; it is not the ordinary reading-text color.

### Neutral

**Navy ink (`ink`)** is the default text. **Slate blue (`muted`)** supports summaries and metadata. **Pale blue (`pale`)** sets off takeaways and selected interaction surfaces. **Blue-gray rule (`line`)** divides sections and outlines quiet controls. **White paper (`paper`)** is the main reading background. The frontmatter owns these primitives; small state-specific shades stay in component CSS in the sidecar.

**The Reading Ground Rule.** Keep the long-form reading column on white; use pale panels for bounded supporting material.

## Typography

Joanna Sans Nova is self-hosted as the CSS family `Joanna`, in regular and bold weights (400 and 700), with Arial and sans-serif fallbacks. Both headings and body copy use Joanna. Bold is reserved for emphasis and table headers; headings are regular. SVG diagram labels use Arial locally for portability; that is not a second site display family. Code uses the browser's monospace stack.

The frontmatter records desktop base roles. Catalogue and article display sizes are fluid; library card titles are 28px with 1.2 leading and -.02em tracking (25px at 1000–1279px, 27px on mobile). Article section headings are 37px with 1.16 leading and subsections 27px with 1.25 leading; navigation and controls sit mostly between 14px and 17px. There is no mathematical global type scale in the CSS.

At widths up to 999px, the catalogue heading is 54px, article title 42px and article section heading 34px. At widths up to 650px, the final catalogue override is 34px, article title 36px with 1.12 leading and -.025em tracking, section heading 30px, subsection heading 25px, and reading text 19px with unchanged 1.65 leading. At widths up to 360px, the catalogue heading is 30px and article title 32px. The article summary is 21px on desktop and 18px on mobile. Announcement titles use clamp(36px,3.8vw,62px), then 40px at tablet, 36px on mobile and 32px on small phones. The right reading rail uses 25px headings and 19px links; mobile uses 28px and 18px. Final rules in `library.css` take precedence over earlier blog declarations.

**The Quiet Heading Rule.** Keep Joanna headings regular and use size, whitespace and placement for hierarchy before adding weight.

## Layout

Library pages use the available viewport width with no fixed maximum shell width. Header and footer align with the same fluid gutter, `clamp(20px,2.5vw,48px)`; the later library stylesheet overrides the earlier mobile gutter values. Their branding and navigation behavior remain unchanged. Spacing is contextual rather than an invented universal scale.

The catalogue pairs its introduction with a quiet inventory note. Search and readiness selection occupy one row; the five rubric filters span the next. The open catalogue grid has three equal columns with 42px row and 28px column gaps, four columns from 1800px, two below 1000px and one below 651px. Single results retain this grid rather than becoming a separate horizontal card. Covers use a 1.65 aspect ratio with cropped artwork, 18px corners and 17px spacing above metadata. On mobile, search, readiness and wrapping rubric pills stack; the readiness label and select share a compact row.

Guide openings pair text with a generated cover; the cover is hidden on mobile. The title remains bounded to 29ch. The full-width desktop reading layout has left contents (210px), a flexible center and right related reading (260px), with 36px gaps. Main text is centered within its track and bounded to 76ch. From 1800px, rails become 240px and 320px with 56px gaps. At 1000–1279px, a 190px contents rail and 32px gap remain, while related reading moves beneath the main text. Below 1000px, the sequence becomes contents, reading text and same-rubric recommendations, each bounded to 760px. The bottom cross-rubric selection uses three columns, becoming one on mobile.

Contents and the right reading rail stick at 112px on desktop. Below 1000px contents remain sticky beneath the header at 76px, or 72px on mobile; the recommendation rail becomes static. Expanded mobile contents scroll within 50dvh. The header minimum height remains 88px, reduced to 76px and 72px at these breakpoints. Root scroll padding remains 105px, reduced to 88px on mobile; heading targets add margins of 16px on desktop, 85px on tablet and 80px on mobile.

Announcement pages pair an explicit planned-status notice, summary and three intended topics with a large generated cover. On mobile this becomes a single column. Links lead to ready guides and back to the library; available guides appear below in two columns, then one on mobile. These pages are previews of future content, not incomplete instructions disguised as articles.

Wide tables scroll inside their own rounded wrapper; they retain a minimum width (500px) rather than shrinking cells beyond legibility. Inline code and long links can wrap. Print removes navigation, the image dialog, reading tools and related content, switches to black text, and uses a single reading column.

## Elevation & Depth

The blog uses flat surfaces, thin dividing rules, tonal contrast and rounded illustration frames. There are no resting or hover card shadows. The search field's focused one-pixel blue box-shadow reinforces its border; it is an interaction indicator, not elevation. A visible three-pixel blue outline with five-pixel offset serves ordinary keyboard focus. The field uses its enclosing focus-within treatment instead of an inner input outline.

**The Flat Surface Rule.** Separate editorial content with spacing and rules; reserve the existing box-shadow for search focus.

## Shapes

Catalogue and guide-opening cover frames use 18px corners; announcement artwork uses 20px, and right-rail thumbnails use 10px. Instructional screenshot links use a separate modest radius (12px); the image dialog uses 14px corners and its close button 7px. Search uses a rounded rectangle; topics and the header contact link are pills. Takeaways, quotes, table wrappers and code blocks use bounded rounded surfaces. Article entries themselves have no enclosing border or background. Directional icons are small stroke SVGs; checklist ticks are CSS strokes, not text glyph icons.

## Components

### Search, rubric and readiness filters

Search combines a visible label, stroke icon, flexible text input, conditional clear control and navy submit button. Submit hover uses a lighter navy-blue. The field changes its border and gains a matching focus ring. A topic's `aria-pressed` state switches from an outlined neutral pill to solid navy with white text; unselected hover uses pale blue.

A labeled native readiness select offers «Все материалы», «Можно прочитать» and «Анонсы». It uses a 62px minimum height on desktop and 48px on mobile. Rubric controls are left-aligned pills; their counts describe the inventory.

Typing filters after a short delay (160ms). Query, rubric and readiness combine; URL parameters `q`, `topic` and `status` preserve the combination, browser history restores it, and a session-scoped return link retains it from both guides and announcements. Search includes title, summary, rubric, authored aliases and complete guide text; announcements contribute their intended topics. Results show both matched items and how many are readable. Results and empty-state updates use a polite live region. The empty state provides a real reset action. Without JavaScript, all entries and their destinations remain available; a note explains that search requires JavaScript, and rubric/readiness filters stay hidden.

### Editorial entries and illustrations

Each entry groups a cover, rubric and readiness metadata, linked heading and short summary. Ready guides have a quiet green «Читать · N мин» badge; announcements have a neutral «Готовится» badge. These state-specific colors are component treatments, not additions to the brand palette. The image duplicates the destination of the heading, so its decorative link is excluded from the keyboard and accessibility tree. Heading hover changes to blue and moves its arrow slightly; hovering a story link gently scales the illustration (1.025). The scale transition is 650ms with `cubic-bezier(.16,1,.3,1)`; arrow motion is 250ms. Reduced-motion preference removes transitions and image scaling.

Eleven original generated covers give each topic its own composition and color treatment, without embedded text. Responsive WebP assets are supplied at 1200×800 and 600×400; generation prompts and provenance are retained beside them in `assets/blog/covers/*.json`. Original PNGs remain local source artifacts. The earlier conversion-path and illustrative search-result SVGs remain original assets but no longer define catalogue covers. Keep illustration-specific colors and composition separate from reusable UI tokens.

### Navigation and actions

The blog header uses the existing SVG logo and plain text links; the active destination has a blue underline. Its outlined contact link turns navy on hover and is hidden below 1000px. At widths up to 650px JavaScript exposes a menu control with `aria-expanded`; Escape closes it and returns focus. Without JavaScript the links remain available. The footer supplies a navy closing surface and standard contact links.

The reset action is a plain blue text button. Article copy and print actions use compact underlined text; clipboard success or failure appears in a polite status message. These actions are exposed only after enhancement. Their behavior is defined in the shipped JavaScript, not by the static sidecar previews.

### Contents and reading support

Contents use native `details` and anchor links. JavaScript opens the contents by default from 1000px and collapses them below that threshold. The active section has a pale-blue background and blue text. Choosing an anchor on a smaller screen closes contents before focusing and scrolling to the heading. A thin blue progress indicator (3px) follows article position; it indicates scroll progress, not verified completion.

Takeaways are pale rounded panels (mobile padding 22px and text 19px); quotes are similarly quiet. Tables use pale headers and thin rules, with tabular numerals. Checklists use blue ticks and row dividers. Same-rubric «Читайте также» links occupy the right reading rail with thumbnails, honest readiness labels and a rubric link. Below the article, «Вам может быть интересно» reuses editorial entries across other rubrics. These are editorial selections, not measured popularity rankings. The static article body, headings and native contents remain usable without enhancement.


### Instructional evidence and downloads

Four retained source screenshots and four Russian teaching diagrams sit in the reading column, inside a thin outlined image link with a white background and zoom-in cursor. Muted captions (15px, 14px on mobile) explain what to inspect and identify the source or teaching example. Source attribution remains a real link where supplied. Documentation examples are not client results. Each new diagram supplies a 1080×600 landscape version and a 600×1080 portrait version selected at 650px through `picture`; the normal source link still opens the original landscape diagram. Existing screenshot origins and truthful captions remain intact.

A normal source-image link works without JavaScript. Enhancement opens a native modal dialog with an original-image link, autofocus close button, caption and keyboard-focusable scrolling image region. The image stays at original size without a maximum-width constraint; its viewport is bounded to 55dvh. The dialog is at most 1160px wide, leaves 16px around the viewport and uses a translucent navy backdrop. Escape uses native dismissal; closing restores body scrolling and focus to the opening image link. Modified clicks retain normal browser behavior. Static sidecar previews do not simulate modal behavior.

CSV worksheet links are ordinary anchors with `download`, explicit file-type labels, a blue outline, rounded corners and a 48px minimum height. They become full-width on mobile and need no JavaScript.

### Contextual service next step

The closing service block uses navy, a white heading, and light blue supporting text and link. It has 16px corners, desktop padding 30px 32px and mobile padding 24px; its heading is 29px, reduced to 26px on mobile. It explains the specific unresolved task and preparation needed, then links to analytics setup or site optimization. Relevant services also appear as ordinary inline links in the steps, including analytics, usability audit, copywriting and optimization. Preserve contextual destinations rather than substituting a generic contact prompt. The block prints with black text and a border. Service-click enhancement emits an interaction event with inline/end placement; it does not demonstrate collected analytics or conversions.

## Do's and Don'ts

### Do:

- **Do** preserve the existing Optimism logo, Joanna family and navy/cyan identity within the blog.
- **Do** keep the text column bounded and let illustrations and contents reflow at the observed breakpoints.
- **Do** preserve visible focus, labeled controls, active states, reduced-motion behavior and the static reading path.
- **Do** distinguish editorial metadata, source screenshots and teaching examples from client results.
- **Do** keep source-image links, CSV downloads and contextual service links usable without JavaScript.

### Don't:

- **Don't** apply this scoped blog document as authority to redesign the homepage.
- **Don't** turn the open story entries into raised panels or add decorative shadows to reading surfaces.
- **Don't** present planned topics as complete guides or editorial recommendations as measured popularity.
- **Don't** promote SVG-specific Arial labels or illustration-only tints into a new global type or color system.
- **Don't** stretch article prose beyond its measured reading column or turn artwork-specific colors into global brand tokens.

The accompanying `.impeccable/design.json` contains source-derived component previews, interaction extensions and synthetic color ramps for panel inspection. Those ramps are display aids, not additional shipped palette tokens. No source-code or generated-HTML changes are required by this record.
