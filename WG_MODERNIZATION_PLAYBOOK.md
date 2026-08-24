# EEA Working Group Modernization Playbook

Operational playbook for bringing an EEA Working Group's web presence onto the
EEA design system. Distilled from the **EthTrust Security Levels** modernization
(2026-08-24, reference implementation:
[wg-ethtrust-site](https://github.com/EntEthAlliance/wg-ethtrust-site), live at
<https://entethalliance.github.io/wg-ethtrust-site/>).

Invocation contract: *"Modernize this Working Group: [URL / repo]. Follow the
EEA Working Group Modernization Playbook."* An agent with the inputs in §1
should be able to execute §3–§9 without further explanation.

---

## 1. Inputs the agent needs before starting

| Input | Where it lives |
|---|---|
| WG live URL and/or repo | From the requester |
| GitHub org access (repo create, PR, Pages admin) | `gh auth status` — must be an EntEthAlliance member (Claudy: `claudyfaucant`) |
| WordPress REST admin | `WP_URL`/`WP_USER`/`WP_APP_PASSWORD` in the ops host's `secrets/shared/crm.env` (user `arlo`, administrator). **Never commit these.** |
| Design system | This repo's Pages URLs (see README Quick start); editorial family for WG pages |
| Analytics tag | `GT-PL9524M` — the shared EEA Pages Google tag (GA4 property 355501273); snippet in §7, canonical copy in `pages-index/dist/index.html` |
| WG facts | `ops-admin/active-groups.md` (leadership, Telegram links, repo pointers); the WG's charter/spec repos; the live page itself |
| Rendering QA | Playwright + cached Chromium on the ops host (`~/.cache/ms-playwright`) — no installs needed |
| EEA logo asset | `eea-logo.webp` — copy from `wg-ethtrust-site/docs/` or `ops-policy-friday/static/` |

## 2. Approvals — what needs a human, and when

**Hard gates (never skip):**

1. **Design preview approval** before anything user-visible changes: build the
   full site on GitHub Pages first, send the URL + screenshots, get an explicit
   go. (EthTrust: preview approved by Redwan before the WordPress link flip.)
2. **Any edit to entethalliance.org** (WordPress) = explicit instruction from
   Redwan per page touched. A link repoint is a page edit; treat it as one.
3. **Content decisions are not the agent's**: status labels (see §8 —
   "(inactive)" prefixes), leadership/chair lists, adding or removing people or
   companies. Surface discrepancies; do not resolve them. When crediting
   people/companies, transcribe **verbatim from a published source** (spec head
   matter, charter) and cite it — never compile a roster from git history or
   guesswork (GitHub handles ≠ publishable names).
4. **Never delete or overwrite** the old static files on the WP host; the
   go-live swap (§9) is done by whoever holds WP Engine SFTP (historically
   chaals), with a backup taken first.
5. Standard engineering rules apply: branch + PR for every change (the only
   exception is the initial scaffold commit on a brand-new empty repo), PR
   contract sections, one PR = one concern.

**Explicitly fine without asking:** creating a new `EntEthAlliance/wg-<name>-site`
repo, enabling Pages on it, iterating on the preview, opening PRs.

## 3. Audit the existing WG presence (read-only)

Lessons from EthTrust — check all of these, the answers will surprise you:

```bash
# Is the live page WordPress content or a static file tree?
# /groups/* pages are STATIC FILES on the WP Engine host — no repo behind them,
# not editable via the WP REST API. (EthTrust/crosschain/DRAMA all share
# /groups/css/ — a 2022 "templatemo Nomad Force" Bootstrap template.)
curl -sI https://entethalliance.org/groups/<Name>/

# Find candidate repos + their state. Gotchas found in practice:
gh repo list EntEthAlliance --limit 100 --json name,description,isArchived
# - the "obvious" repo may be ARCHIVED (wg-eta-registry was — read-only, can't PR)
# - its GH Pages index.html may be a REDIRECT STUB to the WP page (check
#   `git log -- docs/index.html` for "redirect" commits; chaals did this Feb 2025)
# - repos may have been renamed (active-groups.md links old names)

# Does any repo actually contain the live site's source?
gh search code --owner EntEthAlliance "<distinctive string from the live HTML>"
# EthTrust answer: NO repo had it. Expect the same for other /groups/ pages.

# The WordPress groups listing (the "click on the working group" surface):
# page ID 70, /eea-groups/ — ACF-block Gutenberg content; group entries live in
# the block JSON inside content.raw (title, text, link, member list per group).
```

Also collect: live page full text (content inventory), all outbound links,
`ops-admin/active-groups.md` entry, charter, spec URLs and their format
(ReSpec/W3C TR documents are restyled by overlay, §6), spec head matter
(may contain an official "Contributors to this version" list — EthTrust v3 did:
23 names + affiliations, which became the credits section).

Cloudflare email obfuscation: `/cdn-cgi/l/email-protection#<hex>` decodes as
XOR with the first byte (`key=b[0]; ''.join(chr(c^key) for c in b[1:])`).
Decode it — don't guess the contact address.

## 4. Repository setup (repeat for every WG)

- New repo: `EntEthAlliance/wg-<name>-site`, public, description
  "`<WG name> page — source for <live URL> (EEA editorial design family)`".
- Layout: `docs/` = the site (GitHub Pages source, branch `main`, path `/docs`),
  `README.md` = purpose, provenance history, and the §9 deploy runbook.
- Enable Pages via `gh api -X POST repos/EntEthAlliance/wg-<name>-site/pages
  -f "source[branch]=main" -f "source[path]=/docs"`.
- The Pages URL is the permanent **staging** environment and the interim public
  home until the WP swap.

## 5. Build the WG page (the design pattern)

Use the **editorial family** (this repo's `editorial.css`) — not the core dark
system. One self-contained `index.html`; only assets are `eea-logo.webp` and the
generated `og-card.png`.

Head loads (exact order): Google Fonts preconnects + Inter/Kode Mono,
`https://entethalliance.github.io/eea-design-system/editorial.css`, then
page-local `<style>` written **only** against `--eea-ed-*` tokens.
`<body class="eea-editorial">`.

Canonical structure (copy from the reference implementation rather than
re-deriving):

1. `.eea-site-bar` — canonical markup from `editorial.css` §6 comments; site-id
   name `EEA <SHORT WG NAME>` (uppercase mono); anchor nav.
2. Masthead — mono kicker (`EEA Working Group`), display h1, standfirst
   (≤62ch), mono meta strip between a 2px top rule and hairline (version,
   key facts, active strands).
3. Numbered sections — kicker pattern `NN SECTION NAME` + dotted leader.
   Typical set: Focus (with concept "plates" — hard-bordered grid cells on
   `--eea-ed-ground`, e.g. EthTrust's [S]/[M]/[Q] level plates with depth
   bars), Resources (featured current doc in a bordered panel + tag, previous
   versions as dotted-rule list rows), Contributors (see below), Contribute /
   Contact (border-top cards).
4. `.eea-colophon` — canonical markup; trademark sentence, social links, © line.

Contributors section (decided pattern, Redwan 2026-08-24): **companies, not
individuals** — "The companies behind the standard", firm names in display type
(~2rem, border-top 2px rows, auto-fill grid), individuals covered by one intro
sentence. Names verbatim from the published credit source; expand short names
the requester flags (e.g. "Diligence" → "Consensys Diligence").

Content rules: **content parity** — same facts, links, and contact paths as the
old page; keep every outbound URL; do not invent descriptions beyond what the
spec/charter supports; preserve old URLs (link them, never break them).

## 6. Restyle specs / large documents (the overlay method)

For ReSpec / W3C-TR-style publications (they link
`w3.org/StyleSheets/TR/2016/base.css`): **never rebuild the document**. Copies
must stay content-identical — this is the integrity story for a standards doc.

- Add exactly two things: one `<link rel="stylesheet">` injected **before
  `</head>`** (must come after the document's inline `<style>` blocks, which
  otherwise win the cascade), and a slim sticky "← back to the WG page" return
  bar after `<body>`.
- The skin: start from `wg-ethtrust-site/docs/spec/ethtrust-editorial-spec.css`
  (~300 lines). It maps onto editorial tokens: TR base typography, `.head`
  matter, `.toc`, `.rfc2119`, `.note`/`.example`/`.warning`, hljs code palette,
  tables — **plus the document's own inline styles**, which you must inventory
  (`grep`-extract every rule setting background/border/color) and override:
  EthTrust had cyan/purple requirement boxes (`*[id^=req-N]`, `.reqEx-N` —
  keep per-level border distinctions, move the palette), W3C-blue `.simple`
  tables, orange `code`. Follow-up worth doing: promote this skin into the
  design system as a shared file instead of per-WG copies.
- Serve at `docs/spec/<vN>/`; point the WG page's buttons at these copies
  *for now* (flip back to canonical URLs after the §9 swap).
- SEO: these copies `<link rel="canonical">` to the **official
  entethalliance.org URL** — they must never compete with the canonical spec.
- QA: screenshot top matter, a requirements-heavy mid-section, and the
  checklist's interactive controls.

## 7. SEO + analytics (identical for every WG)

Analytics — this exact snippet, first thing in `<head>` on **every** page
(main, spec, checklist). Same tag as all EEA Pages properties; traffic lands in
GA4 355501273 and the existing bi-weekly EEA Pages digest automatically — no
GA-side setup:

```html
<!-- EEA-PAGES Analytics (GT-PL9524M) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-PL9524M"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GT-PL9524M');
</script>
```

SEO checklist (all shipped in the reference implementation — copy the head
block and adapt):

- `<meta name="description">` (≤160 chars), `<meta name="author" content="EEA Inc.">`
- Canonicals: main page → itself (Pages URL) **until** the WP swap, then flip
  to the entethalliance.org URL; document copies → official URLs (§6).
- Open Graph + Twitter card (`summary_large_image`, `@EntEthAlliance`) with a
  generated 1200×630 `og-card.png` — render a small editorial-style HTML card
  (pillar bars, kicker, display title, mono footer) with Playwright at exactly
  1200×630. Template: `wg-ethtrust-site` PR #3.
- JSON-LD: `WebPage` + `publisher` Organization (EEA, with `sameAs` socials).
- `robots.txt` (allow all + Sitemap line), `sitemap.xml` (every page, real
  lastmod), favicon (`eea-logo.webp`), `<meta name="theme-color" content="#EDEAE3">`.

## 8. WordPress integration

The **only** WP-API-editable surface is page content. The groups listing is
page **70** (`/eea-groups/`), ACF-block Gutenberg: each group's
title/text/link/members live in block JSON inside `content.raw`.

Procedure (used successfully for EthTrust):

1. `GET /wp-json/wp/v2/pages/70?context=edit&_fields=content.raw` → **save the
   full raw as a dated backup file first**.
2. Verify your target string occurs exactly once
   (`raw.count(old_url) == 1`), replace by plain string substitution — do not
   re-serialize the block JSON.
3. `POST /wp-json/wp/v2/pages/70` with `{"content": <new raw>}`.
4. Re-fetch raw and assert byte-equality with the expected result; then check
   the **rendered** page for the new href.

Cloudflare quirks (they will bite): GET works with curl's default UA but
returns a JS-challenge page with a browser UA; POST is 403 from python-urllib
but works via curl + full browser UA. If any response starts `<!DOCTYPE html>`,
you got the challenge page — switch UA, don't debug WordPress.

Conventions on page 70: group titles carry status prefixes — `"2026 - "`
(active) / `"(inactive) - "`. Changing a status label is a §2 content decision.
Set the new link's target to the Pages URL; after the §9 swap it should return
to the entethalliance.org URL.

## 9. Go-live on entethalliance.org (needs a human with WP Engine SFTP)

The old `/groups/<Name>/` and `/specs/...` trees are server filesystem — the
swap is manual, by whoever holds WP Engine access (historically **chaals**):

1. Preview approved (§2) and WP listing link flipped (§8) — the new site is
   already the only navigable path; the swap is then zero-deadline.
2. Back up the current `/groups/<Name>/` directory (rollback = re-upload it).
3. Upload the contents of `docs/` to `/groups/<Name>/` — keep `index.html` at
   the same path; **leave the shared `/groups/css|js/` folders alone** (sibling
   group pages still use them).
4. Same for restyled spec copies over `/specs/<...>/` if approved (they are
   content-identical, so this is a styling-only change at the canonical URL).
5. Purge WP Engine + Cloudflare cache for the paths; smoke-check live vs
   preview side by side.
6. Repo follow-up PR: flip canonicals + spec buttons to the canonical URLs.

## 10. QA gate (run before reporting done)

- [ ] Playwright screenshots: desktop 1440px + mobile 390px, full page — check
      site-bar wrap, grids collapse, plates stack; spec top/mid/checklist.
- [ ] Zero JS `pageerror`s on load (Playwright `page.on('pageerror')`).
- [ ] Every link on the page resolves (spec versions, Telegram, GitHub, socials,
      mailto decoded correctly).
- [ ] Served HTML (not local) contains: `GT-PL9524M`, canonical, `og:image`;
      `og-card.png`, `robots.txt`, `sitemap.xml` all return 200.
- [ ] WP listing rendered page links to the new site (default-UA curl).
- [ ] Content parity diff vs the old page: nothing lost, nothing invented.
- [ ] README documents layout + deploy runbook; every change went through a PR
      with the standard contract; report to the requester includes preview URL,
      screenshots, what changed, and the open human items (§2/§9).

## 11. Per-WG tracking issue

Open one issue in the WG's `wg-<name>-site` repo titled
`Modernization: <WG name>`, body = the checklist below; check items as PRs
land, close on §9 completion. This is the durable per-WG status record; the
playbook stays generic.

```markdown
- [ ] §3 audit complete (hosting, repos, content inventory) — findings posted
- [ ] Inputs verified (§1) — access, tag, assets
- [ ] Repo + Pages up; preview URL posted
- [ ] Page built (design pattern §5), content parity checked
- [ ] Specs restyled via overlay (§6) — or N/A, stated why
- [ ] SEO + analytics (§7) verified in served HTML
- [ ] **APPROVAL: design preview** (requester) — link to message
- [ ] WP listing link flipped (§8) — backup file recorded
- [ ] QA gate (§10) passed
- [ ] **HUMAN: WP Engine swap (§9)** — owner, date, rollback path
- [ ] Canonicals/buttons flipped to canonical URLs; issue closed
```

## 12. EthTrust-specific things the next run should NOT copy blindly

- The `[S]/[M]/[Q]` level plates and depth bars — EthTrust's core concept;
  find the equivalent load-bearing concept for the next WG (or omit).
- The contributors data source (v3 spec head matter) — each WG's authoritative
  credit source differs; some have none (then skip the section, don't invent).
- The STIX-for-DeFi second strand — WG-specific.
- `wg-eta-registry` being archived — check, don't assume, for the next repo.
- Open items EthTrust still carries: WP Engine swap not done; "(inactive)"
  label and Opal Graham co-chair status awaiting EEA staff; spec-skin CSS not
  yet promoted into this repo.
