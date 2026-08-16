# EEA Design System — Governance

> This document is the authoritative record of design system decisions, tier assignments, and the token contract. The [README](README.md) covers quick-start usage.

---

## Tier model

Three tiers define how much of the design system each EEA web property adopts.

| Tier | Name | What it means |
|---|---|---|
| **A** | Brand | Full system — tokens + base + nav + components. Unified dark/light theming via `data-theme`. |
| **B** | Product | Tokens only. Sites keep their own layout and component CSS; `--eea-*` variables are mapped into local var names via a bridge block. |
| **C** | Isolated | **Permanently excluded.** These sites have regulatory, security, or UX constraints that make design system coupling unsafe. Do not add `tokens.css` imports to these repos, ever. |

---

## Adopted sites (as of 2026-07-22)

### Tier A — Brand

| Repo | PR | Merged | What changed |
|---|---|---|---|
| [ops-finance](https://github.com/EntEthAlliance/ops-finance) | [#5](https://github.com/EntEthAlliance/ops-finance/pull/5) | 2026-07-22 | Full system import; ethereum-101 panel redesign (eliminated floating white container, all panels on `--eea-bg`) |
| [EntEthAlliance.github.io](https://github.com/EntEthAlliance/EntEthAlliance.github.io) | [#16](https://github.com/EntEthAlliance/EntEthAlliance.github.io/pull/16) | 2026-07-22 | tokens.css + IBM Plex Sans; accent `#9ad1ff` → `#627eea`; card radius 18px → 12px |
| [pages-index](https://github.com/EntEthAlliance/pages-index) | [#1](https://github.com/EntEthAlliance/pages-index/pull/1) | 2026-07-22 | tokens.css; `--bg` `#0b1220` → `#0a0a0f`; accent + badge + font aligned |

### Tier B — Product

| Repo | PR | Merged | What changed |
|---|---|---|---|
| [wg-ethereum-institute](https://github.com/EntEthAlliance/wg-ethereum-institute) | [#1](https://github.com/EntEthAlliance/wg-ethereum-institute/pull/1) | 2026-07-22 | tokens.css + bridge block; `--bg/--surface/--text-*` mapped to `--eea-*`; all domain semantic colours (gold, emerald, amber, indigo, teal, violet, flywheel) untouched |
| [rnd-rwa-erc3643-eas](https://github.com/EntEthAlliance/rnd-rwa-erc3643-eas) (Shibui static + app) | [#100](https://github.com/EntEthAlliance/rnd-rwa-erc3643-eas/pull/100) | 2026-07-22 | `--brand` `#61A8FF` → `#627eea`; `--brand2` → `#8fa8ff`; `--ok/--warn` aligned; body gradient rgba values updated to match new brand channels; IBM Plex Sans added |
| [ops-solution-catalog](https://github.com/EntEthAlliance/ops-solution-catalog) | [#21](https://github.com/EntEthAlliance/ops-solution-catalog/pull/21) | 2026-07-22 | Tailwind font stack → IBM Plex Sans primary; `brand.DEFAULT` `#4f46e5` → `#627eea`; `dist/output.css` rebuilt and committed (CI deploys static) |

### Tier C — Permanently isolated

| Repo | Reason |
|---|---|
| [eea-board-portal](https://github.com/EntEthAlliance/eea-board-portal) | Member-only governance tool; auth-gated; visual consistency with board portal conventions takes precedence |
| [wg-privacy](https://github.com/EntEthAlliance/wg-privacy) | WG-maintained; external CDN dependency would require WG sign-off on every token update; intentionally self-contained |

**Rule:** No PR that adds `tokens.css` or any `entethalliance.github.io/eea-design-system/*` import to a Tier C repo should ever be merged.

---

## Editorial family

> **Status: proposed.** `editorial.css` is on `main` as a library addition.
> No site has been migrated to it, and the tier question below is unresolved.

### What it is

A second design language, used by EEA's published-editorial properties. It is
not a theme of the core system, and the two are not reconcilable by tuning
tokens:

| | Core system | Editorial |
|---|---|---|
| Ground | Dark-first `#0a0a0f` | Light-only warm paper `#EDEAE3` |
| Type | IBM Plex Sans / Mono | Inter / Kode Mono |
| Accent | `#627eea` | `#1F5C4A` |
| Edges | 12px radii, shadows | Hard rules, no shadows |
| Theming | `data-theme` dark/light | None — light only |
| For | App and product surfaces | Broadsheet / publication surfaces |

The core system is right for tools people operate. The editorial family is
right for things people read. Collapsing them into one would flatten both, so
they are kept as siblings with separate files and separate prefixes.

### Why it does not violate the token contract

| Guarantee | How `editorial.css` stays inside it |
|---|---|
| Names are stable | Adds only new names; renames nothing |
| Accent is `#627eea` | Does not touch `--eea-accent`. `--eea-ed-accent` is a different token in a different family |
| Prefix is `--eea-` | All tokens are `--eea-ed-*` |
| **Dark is default** | Never writes `:root`'s theme tokens and never sets `color-scheme` on `:root`. Linking the file has **no visual effect** — a page opts in with `<body class="eea-editorial">` |
| Load-order safe | No `@import`, no network calls, no JS |

The "no visual effect until opt-in" property is the important one: it is what
lets a second family live in this repo without putting the dark default at
risk. Any future change to `editorial.css` must preserve it.

### Provenance

The palette, the pillar system and its contrast reasoning originate at
**intelligence.entethalliance.org**. Two further properties have since
reproduced it by hand:

| Property | How it carries the family today |
|---|---|
| [intelligence.entethalliance.org](https://intelligence.entethalliance.org/) | Origin. Inline `<style>`, local names (`--page`, `--ink`, `--mid`, `--accent`) |
| [ops-policy-friday](https://github.com/EntEthAlliance/ops-policy-friday) | Hand copy. Local names (`--paper`, `--ink`, `--shop-*`) |
| [ops-business-scanner](https://github.com/EntEthAlliance/ops-business-scanner) | Hand copy of the copy, via PR #19 |

All three ship the same site bar — same markup, same 36px mark, same three
pillar bars, same mono links — as three independent copies. That is the
duplication `editorial.css` is meant to end.

Drift is already measurable. The mono label role (uppercase Kode Mono, used for
every tag, badge, kicker and table head) had spread across **nine font sizes
and nine tracking values** between the copies before being collapsed onto the
three-step scale now in `--eea-ed-label-*` / `--eea-ed-track-*`.

### Open question — tier assignment

The editorial properties fit none of the three existing tiers:

- **Not Tier A** — Tier A means the full core system, which is dark-first and
  ships `.eea-unified-nav` with a theme toggle. Editorial sites are light-only
  and use a different header.
- **Not Tier B** — Tier B means mapping `--eea-*` core tokens into local names
  via a bridge. Editorial sites consume none of the core tokens.
- **Not Tier C** — Tier C is a permanent exclusion for regulatory or security
  reasons. Nothing excludes these sites; they simply speak a different language.

Two ways forward, for maintainer decision:

1. **Add a Tier E — Editorial**, parallel to A/B/C, adopting `editorial.css`
   and nothing else.
2. **Widen Tier B** to mean "adopts a token layer from this repo", with the
   layer named per site.

Option 1 is the clearer read — the distinction is which *family* a site
belongs to, which is a different axis from how *much* of a family it adopts.
But this is a governance call, not a technical one, so nothing here assumes it.

### Not yet done

Adoption is deliberately out of scope for this change. Migrating the three
sites onto `editorial.css` means, per site: swapping local token names for
`--eea-ed-*`, renaming `.site-bar` → `.eea-site-bar` in markup, and removing
the duplicated rules. Each is its own PR with its own screenshots, following
[Adding a new site](#adding-a-new-site).

---

## Token contract

The following guarantees apply to all core `--eea-*` tokens on `main`. The
editorial family (`--eea-ed-*`) is a separate namespace — see
[Editorial family](#editorial-family) for how it stays inside these rules.

| Guarantee | Detail |
|---|---|
| **Names are stable** | No token will be renamed without a deprecation period. Old name kept as alias for one release cycle. |
| **Accent is `#627eea`** | `--eea-accent` will not change hue. Lightness adjustments (hover, tinted fills) are allowed. |
| **Prefix is `--eea-`** | No new tokens without the prefix. Avoids collision with any site's local vars. |
| **Dark is default** | `:root` always sets the dark theme. Light is applied via `[data-theme="light"]`. Never reverse this. |
| **`tokens.css` is load-order safe** | No `@import`, no external network calls, no JS. Can be linked first in `<head>` without side effects. |

### What is NOT guaranteed

- Order of declarations within `tokens.css`
- Exact shadow offsets and blur radii — these are tuning values
- Additions of new tokens (additions are always non-breaking)

---

## Bridge pattern (Tier B reference)

Tier B sites should not rename every CSS callsite. Instead, add a single bridge block after the `tokens.css` link:

```css
/* EEA token bridge — maps local var names to --eea-* */
:root {
  --bg:               var(--eea-bg);
  --surface:          var(--eea-bg-raised);
  --surface-elevated: var(--eea-bg-card);
  --border:           var(--eea-border-solid);
  --border-subtle:    var(--eea-border);
  --text-primary:     var(--eea-text);
  --text-secondary:   var(--eea-text-2);
  --text-muted:       var(--eea-text-3);
}
```

This pattern keeps site-local CSS unchanged while pulling values from the canonical token set.

For sites using hardcoded `rgba()` values in gradients, ensure the RGB channels match the current canonical values:

| Token | Hex | RGB channels |
|---|---|---|
| `--eea-accent` | `#627eea` | `98, 126, 234` |
| `--eea-accent-hover` | `#8fa8ff` | `143, 168, 255` |
| `--eea-success` | `#00d4aa` | `0, 212, 170` |
| `--eea-warning` | `#fbbf24` | `251, 191, 36` |

---

## Versioning

`tokens.css` is served live from `main`. All adopted sites link to `main`, so token updates propagate automatically.

To pin to a specific version, link to a commit SHA:
```
https://raw.githubusercontent.com/EntEthAlliance/eea-design-system/<sha>/tokens.css
```

When a breaking token change is needed (name removal, value shift > 10%), a new major path will be added (`/v2/tokens.css`) and sites will be migrated explicitly via PR.

**Current version:** `1.0.0` — initial rollout across 6 sites, 2026-07-22.

---

## Adding a new site

1. Determine tier (A/B/C) based on the criteria above
2. For Tier A: add full system links + nav HTML + `data-theme` on `<html>`
3. For Tier B: add `tokens.css` link + bridge block; update any hardcoded rgba values
4. Run Playwright smoke tests: body bg, font, `--eea-accent` resolution, old accent colours absent
5. Take screenshots, upload to Drive under the relevant phase folder
6. Open PR with test results and screenshots in the description
7. After merge, update the adoption table in this document
