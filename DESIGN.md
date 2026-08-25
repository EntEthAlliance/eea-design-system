# EEA Design System — Governance

> This document is the authoritative record of design system decisions, tier
> assignments, and the token contract. The [README](README.md) covers
> quick-start usage.

---

## The design language

**As of 2026-08-25 the EEA design system has one design language: the
editorial family** (`editorial.css`, tokens prefixed `--eea-ed-*`). Its design
principles — palette, type pairing, pillar system, and contrast reasoning —
originate at **[intelligence.entethalliance.org](https://intelligence.entethalliance.org/)**,
which is the canonical reference this repo aligns with. No other design
language is referenced by this repo.

| | Editorial family |
|---|---|
| Ground | Light-only warm paper `#EDEAE3` |
| Ink | `#16181A`, secondary `#5A645E` (5.11:1 on page) |
| Type | Inter / Kode Mono |
| Accent | `#1F5C4A` program green |
| Edges | Hard rules, no shadows |
| Pillars | Anticipate `#EE9BFC` · Work `#F3CF2B` · Connect `#FEABA0` — marks, never text |
| Theming | None — light only |

The former dark-first "core system" (`tokens.css` + `base.css` + `nav.css` +
`nav.js` + `components.css`) is **deprecated** — see
[Legacy core system](#legacy-core-system-deprecated--frozen). The 2026-08-16
position that the two were "siblings, not reconcilable" is superseded: the
editorial family is now the system; the core files are a frozen
compatibility layer, not a parallel language.

### Provenance

| Property | How it carries the language today |
|---|---|
| [intelligence.entethalliance.org](https://intelligence.entethalliance.org/) | **Origin and canonical reference.** Inline `<style>`, local names (`--page`, `--ink`, `--mid`, `--accent`) |
| [ops-policy-friday](https://github.com/EntEthAlliance/ops-policy-friday) | Hand copy. Local names (`--paper`, `--ink`, `--shop-*`) |
| [ops-business-scanner](https://github.com/EntEthAlliance/ops-business-scanner) | Hand copy of the copy, via PR #19; migration onto `editorial.css` in PR #22 |
| [wg-ethtrust-site](https://github.com/EntEthAlliance/wg-ethtrust-site) | Built directly on `editorial.css` (WG playbook reference implementation) |

`editorial.css` exists to end the hand-copy duplication: all three original
properties ship the same site bar — same markup, same 36px mark, same three
pillar bars, same mono links — as independent copies. Drift is already
measurable: the mono label role had spread across **nine font sizes and nine
tracking values** between the copies before being collapsed onto the
three-step scale in `--eea-ed-label-*` / `--eea-ed-track-*`.

If intelligence.entethalliance.org's design evolves, `editorial.css` follows
it — alignment PRs cite the site as the source of the change.

---

## Token contract

The following guarantees apply to all `--eea-ed-*` tokens on `main`.

| Guarantee | Detail |
|---|---|
| **Names are stable** | No token will be renamed without a deprecation period. Old name kept as alias for one release cycle. |
| **Accent is `#1F5C4A`** | `--eea-ed-accent` will not change hue unless intelligence.entethalliance.org itself changes; the site is the source of truth. |
| **Prefix is `--eea-ed-`** | No new tokens without the prefix. Avoids collision with any site's local vars. |
| **No visual effect until opt-in** | `editorial.css` never writes `:root`'s theme tokens and never sets `color-scheme` on `:root`. Linking the file changes nothing — a page opts in with `<body class="eea-editorial">`. This is what lets it be linked next to legacy stylesheets safely. Any change to `editorial.css` must preserve it. |
| **Load-order safe** | No `@import`, no external network calls, no JS. |
| **Pillar colours are semantic** | Never decorative, never text — none clears 4.5:1 on the page ground. Text uses the `-ink` partners. |

### What is NOT guaranteed

- Order of declarations within `editorial.css`
- Additions of new tokens (additions are always non-breaking)

---

## Adoption

### Editorial adoption record

| Repo | PR | Status | What changed |
|---|---|---|---|
| [wg-ethtrust-site](https://github.com/EntEthAlliance/wg-ethtrust-site) | — | live | Built on `editorial.css` from the start (playbook reference implementation, 2026-08-24) |
| [ops-business-scanner](https://github.com/EntEthAlliance/ops-business-scanner) | [#22](https://github.com/EntEthAlliance/ops-business-scanner/pull/22) | open | Links `editorial.css` from Pages; bridge block onto `--eea-ed-*`; canonical `.eea-site-bar` / `.eea-colophon` markup; ~160 lines of duplicated rules deleted |
| [ops-policy-friday](https://github.com/EntEthAlliance/ops-policy-friday) | — | not started | Still carries its hand copy |
| [intelligence.entethalliance.org](https://intelligence.entethalliance.org/) | — | not started | Origin site; still inline `<style>` (adopting the file it originated is optional — it is the reference either way) |

### Migrating a site

Migrating a site onto `editorial.css` means: swapping local token names for
`--eea-ed-*` (bridge block), renaming `.site-bar` → `.eea-site-bar` in markup,
and removing the duplicated rules. Each is its own PR with its own
screenshots, following [Adding a new site](#adding-a-new-site).

### Adding a new site

1. Link `editorial.css` per the README quick start; write page-local CSS only
   against `--eea-ed-*` tokens; use the canonical `.eea-site-bar` /
   `.eea-colophon` markup (WG playbook §5 has the full page pattern).
2. Never link any legacy core-system file from a new site.
3. Run Playwright smoke tests: body bg `#EDEAE3`, Inter/Kode Mono resolved,
   `--eea-ed-accent` resolution, no stray legacy accent `#627eea`.
4. Take screenshots, upload to Drive under the relevant phase folder.
5. Open PR with test results and screenshots in the description.
6. After merge, update the adoption record in this document.

### Isolated sites

Some sites remain permanently outside the design system for regulatory,
security, or UX reasons — do not add any design-system import to them, ever:

| Repo | Reason |
|---|---|
| [eea-board-portal](https://github.com/EntEthAlliance/eea-board-portal) | Member-only governance tool; auth-gated; board portal conventions take precedence |
| [wg-privacy](https://github.com/EntEthAlliance/wg-privacy) | WG-maintained; external CDN dependency would require WG sign-off on every token update; intentionally self-contained |

---

## Legacy core system (deprecated — frozen)

The repo previously maintained a dark-first design language: IBM Plex
Sans/Mono, accent `#627eea`, 12px radii, shadows, `data-theme` dark/light
theming. **Deprecated 2026-08-25.** Its files (`tokens.css`, `base.css`,
`nav.css`, `nav.js`, `components.css`) remain served from `main` because the
sites below hot-link them — removal would break live properties.

Rules for the legacy layer:

- **Frozen.** No new tokens, no value changes, except fixes required to keep
  the already-adopted sites rendering. The old core token contract
  (stable names, `--eea-` prefix, dark default, load-order safety) continues
  to hold in freeze — it just no longer grows.
- **No new adoptions.** The old tier model (A: full system, B: tokens-only
  bridge) is closed to new entries.
- **Migrate on touch.** Substantive design work on a legacy site moves it to
  `editorial.css` instead of extending core-system usage.

### Legacy adoption record (historical, 2026-07-22 rollout)

Kept as the record of which sites still consume the frozen files and are
pending migration to the editorial family.

| Repo | Former tier | PR | Notes |
|---|---|---|---|
| [ops-finance](https://github.com/EntEthAlliance/ops-finance) | A — full system | [#5](https://github.com/EntEthAlliance/ops-finance/pull/5) | Full system import; ethereum-101 panel redesign |
| [EntEthAlliance.github.io](https://github.com/EntEthAlliance/EntEthAlliance.github.io) | A — full system | [#16](https://github.com/EntEthAlliance/EntEthAlliance.github.io/pull/16) | tokens.css + IBM Plex Sans; accent → `#627eea` |
| [pages-index](https://github.com/EntEthAlliance/pages-index) | A — full system | [#1](https://github.com/EntEthAlliance/pages-index/pull/1) | tokens.css; bg/accent/badge/font aligned |
| [wg-ethereum-institute](https://github.com/EntEthAlliance/wg-ethereum-institute) | B — tokens bridge | [#1](https://github.com/EntEthAlliance/wg-ethereum-institute/pull/1) | tokens.css + bridge block |
| [rnd-rwa-erc3643-eas](https://github.com/EntEthAlliance/rnd-rwa-erc3643-eas) (Shibui) | B — tokens bridge | [#100](https://github.com/EntEthAlliance/rnd-rwa-erc3643-eas/pull/100) | Brand vars → `#627eea` family; IBM Plex Sans |
| [ops-solution-catalog](https://github.com/EntEthAlliance/ops-solution-catalog) | B — tokens bridge | [#21](https://github.com/EntEthAlliance/ops-solution-catalog/pull/21) | Tailwind font stack + brand colour |

---

## Versioning

`editorial.css` is served live from `main`. Adopting sites link to `main`, so
token updates propagate automatically.

To pin to a specific version, link to a commit SHA:
```
https://raw.githubusercontent.com/EntEthAlliance/eea-design-system/<sha>/editorial.css
```

When a breaking token change is needed (name removal, value shift > 10%), a
new major path will be added (`/v2/editorial.css`) and sites will be migrated
explicitly via PR.

**Current version:** `1.1.0`.

| Version / date | Change |
|---|---|
| 2026-08-25 | **Governance:** editorial family declared the sole design language, aligned with intelligence.entethalliance.org; core system deprecated and frozen. No served value changed. |
| `1.1.0` — 2026-08-16 | `editorial.css` added — editorial family tokens + `.eea-site-bar` / `.eea-colophon` ([#3](https://github.com/EntEthAlliance/eea-design-system/pull/3)) |
| `1.0.0` — 2026-07-22 | Initial core-system rollout across 6 sites (now the legacy layer) |
