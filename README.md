# EEA Design System

> **Working Group modernization:** the operational playbook for bringing a WG's
> web presence onto this design system is [WG_MODERNIZATION_PLAYBOOK.md](WG_MODERNIZATION_PLAYBOOK.md).

Central design system for all Enterprise Ethereum Alliance web properties.

The system has **one design language**: the **editorial family**, whose design
principles originate at — and stay aligned with —
[intelligence.entethalliance.org](https://intelligence.entethalliance.org/).
That site is the canonical reference for every token in `editorial.css`; no
other design language is referenced by this repo. (A legacy dark "core system"
remains served for previously-adopted sites only — see
[Legacy core system](#legacy-core-system-deprecated).)

**Live URL:** `https://entethalliance.github.io/eea-design-system/`

---

## Files

| File | Purpose | Status |
|---|---|---|
| `editorial.css` | **The design language** — tokens (`--eea-ed-*`), page surface, site bar, colophon. Standalone; no other file needed | Current |
| `tokens.css` | Legacy core-system custom properties | **Deprecated — frozen** |
| `base.css` | Legacy core-system reset / body defaults | **Deprecated — frozen** |
| `nav.css` | Legacy core-system fixed navigation | **Deprecated — frozen** |
| `nav.js` | Legacy theme toggle + active-link script | **Deprecated — frozen** |
| `components.css` | Legacy core-system components | **Deprecated — frozen** |

---

## Quick start

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Kode+Mono:wght@400;500;600&display=swap">

  <link rel="stylesheet" href="https://entethalliance.github.io/eea-design-system/editorial.css">
</head>
<body class="eea-editorial">
```

New sites need nothing else from this repo — the legacy core-system files are
deprecated (see [Legacy core system](#legacy-core-system-deprecated)). Linking
`editorial.css` is always safe, including next to those files: it only declares
`--eea-ed-*` tokens and has no visual effect until `.eea-editorial` is on
`<body>`, so it can be added before you are ready to switch. What a page should
not do is *apply* both families at once — `base.css` and `components.css` paint
the legacy dark ground and would fight the editorial surface, so drop them in
the same change that adds the `.eea-editorial` class.

---

## The design language

Design principles, per [intelligence.entethalliance.org](https://intelligence.entethalliance.org/):

| Aspect | Principle |
|---|---|
| Ground | Light-only warm paper `#EDEAE3` |
| Ink | Near-black `#16181A` |
| Type | Inter for prose, Kode Mono for labels and data |
| Accent | `#1F5C4A` program green |
| Edges | Hard rules, no shadows, no radii |
| Pillars | Three program pillars — Anticipate / Work / Connect — each owning one colour, used as marks, never as text |
| Theming | None — light only, print-broadsheet surfaces |

### Components

| Class | What it is |
|---|---|
| `.eea-editorial` | Opt-in page surface — put it on `<body>` |
| `.eea-site-bar` | Shared program header: EEA mark, wordmark, pillar bars, mono links |
| `.eea-colophon` | Deep-green closing panel with pillar bars |

The site bar has no JavaScript — no theme toggle, no runtime active-link
detection. Mark the current page with `aria-current="page"` in the HTML.

### Token reference

All tokens are prefixed `--eea-ed-`.

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

## Adoption

New EEA web properties adopt `editorial.css` — see the Quick start above and
the [WG modernization playbook](WG_MODERNIZATION_PLAYBOOK.md) §5 for the
canonical page pattern. Governance, the token contract, and the per-site
adoption record live in [DESIGN.md](DESIGN.md).

Properties already carrying the language — note that "carrying" and
"adopting `editorial.css`" are not the same thing:

| Property | How it carries the language |
|---|---|
| [intelligence.entethalliance.org](https://intelligence.entethalliance.org/) | Origin and canonical reference — its own inline CSS, not this file |
| [wg-ethtrust-site](https://github.com/EntEthAlliance/wg-ethtrust-site) | Links `editorial.css` |
| ops-business-scanner | Migrating onto `editorial.css` |
| ops-policy-friday | Hand copy under local names; not yet migrated |

DESIGN.md's adoption record is the authoritative per-site status.

---

## Legacy core system (deprecated)

The repo previously maintained a second, dark-first design language
("core system": `tokens.css`, `base.css`, `nav.css`, `nav.js`,
`components.css` — IBM Plex, accent `#627eea`). It is **deprecated as of
2026-08-25**: the editorial family is the only design language this repo
references going forward.

The legacy files remain served from `main` unchanged, because previously
adopted sites hot-link them — removing them would break live properties. The
rules are:

- **Frozen.** No new tokens, no value changes, except fixes needed to keep
  already-adopted sites rendering.
- **No new adoptions.** Do not link any legacy file from a new site.
- **Migrate on touch.** When a legacy-adopted site gets substantive design
  work, move it to `editorial.css` rather than extending its core-system
  usage. The migration record is in DESIGN.md.

---

## Versioning

Files are served directly from `main`. No versioned CDN paths yet.
To pin a version, link to a commit SHA:
```
https://raw.githubusercontent.com/EntEthAlliance/eea-design-system/<sha>/editorial.css
```

---

## Contributing

`editorial.css` changes must stay aligned with the design principles of
[intelligence.entethalliance.org](https://intelligence.entethalliance.org/) —
it is the canonical reference. All token changes require a PR with:
1. Description of what changed and why
2. Which sites are affected
3. Visual diff screenshots if any rendered output changes
