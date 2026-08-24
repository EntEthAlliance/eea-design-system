# EEA Design System

> **Working Group modernization:** the operational playbook for bringing a WG's
> web presence onto this design system is [WG_MODERNIZATION_PLAYBOOK.md](WG_MODERNIZATION_PLAYBOOK.md).

Central design system for all Enterprise Ethereum Alliance web properties.

**Live URL:** `https://entethalliance.github.io/eea-design-system/`

---

## Files

| File | Purpose | Load order |
|---|---|---|
| `tokens.css` | All CSS custom properties (colors, typography, spacing, radius, shadows) | 1st — required by everything |
| `base.css` | Box-model reset, body defaults, scrollbar, focus, print | 2nd — optional but recommended |
| `nav.css` | Unified fixed navigation component | 3rd — only on pages with the nav |
| `nav.js` | Theme toggle + active link highlighting | After `nav.css` |
| `components.css` | Cards, icon chips, tags, badges, buttons, hero, footer, grids | As needed |
| `editorial.css` | **Separate family** — editorial/publication surfaces. Standalone; does not need `tokens.css` | On its own |

> `editorial.css` is not a theme of the core system — it is a second design
> language for EEA's published-editorial properties. See
> [Editorial family](#editorial-family) below and DESIGN.md.

---

## Quick start

### Tier A sites (full system)

```html
<head>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">

  <!-- EEA Design System -->
  <link rel="stylesheet" href="https://entethalliance.github.io/eea-design-system/tokens.css">
  <link rel="stylesheet" href="https://entethalliance.github.io/eea-design-system/base.css">
  <link rel="stylesheet" href="https://entethalliance.github.io/eea-design-system/nav.css">
  <link rel="stylesheet" href="https://entethalliance.github.io/eea-design-system/components.css">

  <!-- Theme script — must run before first paint -->
  <script src="https://entethalliance.github.io/eea-design-system/nav.js"></script>
</head>
```

### Tier B sites (tokens only)

```html
<link rel="stylesheet" href="https://entethalliance.github.io/eea-design-system/tokens.css">
<!-- Then reference --eea-* variables in your local CSS -->
```

### Editorial sites

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Kode+Mono:wght@400;500;600&display=swap">

  <link rel="stylesheet" href="https://entethalliance.github.io/eea-design-system/editorial.css">
</head>
<body class="eea-editorial">
```

Do **not** load `tokens.css` alongside it — the two families set different
grounds and fonts. Linking `editorial.css` without the `.eea-editorial` class
has no visual effect, so it is safe to add before you are ready to switch.

---

## Editorial family

A second, parallel design language for EEA's published-editorial properties.
It is not a theme of the core system and does not override it.

| | Core system | Editorial |
|---|---|---|
| Ground | Dark-first `#0a0a0f` | Light-only warm paper `#EDEAE3` |
| Type | IBM Plex Sans / Mono | Inter / Kode Mono |
| Accent | `#627eea` Ethereum blue | `#1F5C4A` program green |
| Edges | 12px radii, shadows | Hard rules, no shadows |
| For | App and product surfaces | Broadsheet / publication surfaces |

### Components

| Class | What it is |
|---|---|
| `.eea-editorial` | Opt-in page surface — put it on `<body>` |
| `.eea-site-bar` | Shared program header: EEA mark, wordmark, pillar bars, mono links |
| `.eea-colophon` | Deep-green closing panel with pillar bars |

The site bar has no JavaScript. Unlike `.eea-unified-nav` there is no theme
toggle and no runtime active-link detection — mark the current page with
`aria-current="page"` in the HTML.

### Editorial token reference

All editorial tokens are prefixed `--eea-ed-`.

| Token | Value | Use |
|---|---|---|
| `--eea-ed-page` | `#EDEAE3` | Page ground |
| `--eea-ed-ground` | `#F7F5F0` | Lifted sheet above the page |
| `--eea-ed-rule` | `#E3DFD7` | Filled rule / inset panel |
| `--eea-ed-line` | `#DAD6CD` | Hairline border |
| `--eea-ed-ink` | `#16181A` | Primary text |
| `--eea-ed-ink-soft` | `#5A645E` | Secondary text — 5.11:1 on page |
| `--eea-ed-ink-mute` | `#8A9088` | Non-text marks only |
| `--eea-ed-accent` | `#1F5C4A` | Links, kickers, current-page rule |
| `--eea-ed-accent-deep` | `#123A2E` | Pressed / dense accent fills |
| `--eea-ed-deep` | `#10231E` | Colophon ground |
| `--eea-ed-font` | `Inter, system-ui, …` | Prose |
| `--eea-ed-font-mono` | `'Kode Mono', ui-monospace, …` | Labels and data |
| `--eea-ed-label-lg` / `-label` / `-label-sm` | `.75` / `.7` / `.66rem` | Mono label scale |
| `--eea-ed-track-wide` / `-track` / `-track-tight` | `.2` / `.14` / `.06em` | Tracking, paired with the scale |
| `--eea-ed-measure` | `1200px` | Content column |
| `--eea-ed-measure-bar` | `1560px` | Site bar runs wider |
| `--eea-ed-shoulder` | `clamp(1.5rem, 4vw, 4rem)` | Page gutter |

### Pillars

Three program pillars, each owning one colour.

| Pillar | Colour | Ink partner |
|---|---|---|
| Anticipate | `--eea-ed-anticipate` `#EE9BFC` | `--eea-ed-anticipate-ink` `#794287` |
| Work | `--eea-ed-work` `#F3CF2B` | `--eea-ed-work-ink` `#765A00` |
| Connect | `--eea-ed-connect` `#FEABA0` | `--eea-ed-connect-ink` `#9B413C` |

**Pillar colours are semantic, never decorative, and never text.** None of the
three clears 4.5:1 on `--eea-ed-page`, so they appear as rules and marks only.
When a pillar has to be named in text, use its `-ink` partner.

---

## Nav HTML structure

```html
<nav class="eea-unified-nav">
  <a class="eea-unified-nav-brand" href="/">
    <span>EEA</span>
    <span>Enterprise <em>Ethereum</em> Alliance</span>
  </a>
  <div class="eea-unified-nav-links">
    <a href="/" class="active">Hub</a>
    <a href="/finance.html">Finance</a>
    <a href="/ethereum-101.html">Learn</a>
    <a href="/institutional-crypto-market.html">Institutional</a>
    <a href="/agents.html">Agents</a>
  </div>
  <button class="eea-unified-nav-toggle" aria-label="Toggle theme">🌙</button>
</nav>
```

nav.js handles `class="active"` automatically based on the current URL.

---

## Token reference

### Colors

| Token | Dark value | Light value | Use |
|---|---|---|---|
| `--eea-bg` | `#0a0a0f` | `#f8f9fc` | Page background |
| `--eea-bg-raised` | `#12121a` | `#f0f1f5` | Elevated surface |
| `--eea-bg-card` | `#1a1a24` | `#ffffff` | Card background |
| `--eea-bg-hover` | `#22222e` | `#eceef4` | Hover surface |
| `--eea-text` | `#ffffff` | `#0f0f14` | Primary text |
| `--eea-text-2` | `#a0a0b0` | `#4a4a5a` | Secondary text |
| `--eea-text-3` | `#6a6a7a` | `#8a8a9a` | Muted text |
| `--eea-accent` | `#627eea` | `#627eea` | Primary accent |
| `--eea-accent-hover` | `#8fa8ff` | `#4a66d8` | Accent on hover |
| `--eea-accent-bg` | `rgba(98,126,234,0.12)` | `rgba(98,126,234,0.08)` | Tinted chip |
| `--eea-border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` | Translucent border |
| `--eea-border-solid` | `#2a2a3a` | `#d8dae8` | Solid border |
| `--eea-success` | `#00d4aa` | — | Success state |
| `--eea-warning` | `#fbbf24` | — | Warning state |
| `--eea-danger` | `#ff6b6b` | — | Error / danger |

### Typography

| Token | Value | Use |
|---|---|---|
| `--eea-font` | `'IBM Plex Sans', system-ui, sans-serif` | Body / UI |
| `--eea-font-mono` | `'IBM Plex Mono', ui-monospace, monospace` | Code / labels |
| `--eea-text-xs` | `0.75rem` | Labels, captions |
| `--eea-text-sm` | `0.875rem` | Secondary copy |
| `--eea-text-base` | `1rem` | Body |
| `--eea-text-lg` | `1.125rem` | Card titles |
| `--eea-text-xl` | `1.5rem` | Section headings |
| `--eea-text-2xl` | `2rem` | Page subheadings |
| `--eea-text-3xl` | `2.5rem` | Page H1 |

### Layout

| Token | Value | Use |
|---|---|---|
| `--eea-container` | `1200px` | Standard max-width |
| `--eea-container-wide` | `1400px` | Data-heavy pages |
| `--eea-radius-sm` | `6px` | Buttons, tags |
| `--eea-radius-md` | `12px` | Cards (canonical) |
| `--eea-radius-lg` | `18px` | Large surface cards |
| `--eea-gap-md` | `1.5rem` | Standard grid gap |
| `--eea-shadow-md` | `0 4px 12px rgba(0,0,0,0.25)` | Card rest shadow |
| `--eea-shadow-lg` | `0 12px 32px rgba(0,0,0,0.35)` | Card hover shadow |

---

## Tier governance

| Tier | Sites | What they adopt |
|---|---|---|
| **A — Brand** | ops-finance, EntEthAlliance.github.io, pages-index | Full system |
| **B — Product** | Shibui, ops-solution-catalog, wg-ethereum-institute | tokens.css + selective layers |
| **C — App / WG** | eea-board-portal, wg-privacy | Isolated — do not import this system |

Editorial properties (intelligence.entethalliance.org, ops-policy-friday,
ops-business-scanner) sit outside this table — they run the editorial family,
not the core system. Their tier assignment is an open governance question; see
DESIGN.md § Editorial family.

---

## Versioning

Files are served directly from `main`. No versioned CDN paths yet.
To pin a version, link to a commit SHA:
```
https://raw.githubusercontent.com/EntEthAlliance/eea-design-system/<sha>/tokens.css
```

When a breaking change is needed, a new major directory will be added (`/v2/tokens.css`).

---

## Contributing

All token changes require a PR with:
1. Description of what changed and why
2. Which sites are affected
3. Visual diff screenshots if any rendered output changes
