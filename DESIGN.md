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

## Token contract

The following guarantees apply to all `--eea-*` tokens on `main`:

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
