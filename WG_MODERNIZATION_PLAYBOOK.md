# EEA Working Group Modernization Playbook

**Framework + operating logic** for bringing an EEA Working Group's web
presence onto the EEA design system — and, when the WG is producing a new
specification version, for running its public review cycle. Distilled from the
**EthTrust Security Levels** modernization and v4 review launch (2026-08-24,
reference implementation:
[wg-ethtrust-site](https://github.com/EntEthAlliance/wg-ethtrust-site), live at
<https://entethalliance.github.io/wg-ethtrust-site/>).

Invocation contract: *"Modernize this Working Group: [URL / repo]. Follow the
EEA Working Group Modernization Playbook."* An agent with the inputs in §1
should be able to execute §3–§9 without further explanation.

§0 is the framework: the principles every step derives from. When a situation
isn't covered by a numbered step, decide from §0 — that is what it is for.

## 0. The logic — ten principles the steps derive from

1. **Git becomes the source of truth; URLs keep their meaning.** Every WG
   surface ends up in a repo where change = PR, and every historical URL keeps
   resolving — **redirect, never remove** (years of inbound links are an
   asset). This is why go-live is redirect rules (§9), why the old files stay
   untouched on the host, and why rollback is always trivial.
2. **Content parity is sacred; design and content change separately.** A
   restyle ships the same facts, links and contact paths — byte-identical
   documents or verbatim transcription. Content changes (labels, rosters,
   wording) are separate, human-approved diffs. Never bundle the two.
3. **Standards documents keep their integrity.** A published spec is never
   rebuilt — restyling is a CSS overlay on an identical copy (§6). A copy
   defers canonically to the official URL until it *becomes* the official
   serving location, then self-canonicalizes (§9.4). Nothing may drift.
4. **Status must be legible on every surface.** Approved vs draft vs inactive
   is stated where the reader is: banners on drafts ("AI-generated — not an
   approved specification"), `noindex` on unapproved documents, pills and
   labels on listings, the approved baseline always named next to any draft.
   A draft that could be mistaken for a standard is a governance incident.
5. **Credit is transcribed, never composed.** People/company credits come
   verbatim from a published source (spec head matter, charter) and cite it.
   Companies lead when the question the page answers is "who stands behind
   this standard"; individuals are never invented from git handles.
6. **Meet reviewers where they are.** Review artifacts are designed for the
   intended audience, not for git-natives: rendered pages instead of PRs,
   requirement-level diffs instead of changelogs (§12.2), structured forms
   with dropdowns instead of blank issues (§12.3), one click from reading a
   requirement to typed feedback. Short labels; explanations in helper text.
7. **Every feedback channel is open, owned, and traced.** A promised comment
   channel that is archived, unanswered, or untriaged is a broken promise —
   audit it (§9b), reopen it, assign owners, and close stale items with a
   resolution that maps asks to outcomes. Outreach gets a tracker: who was
   asked, who answered, on which channel, and when to nudge (§12.4). Silence
   is a bug, in both directions.
8. **Humans decide meaning; agents execute mechanics.** The gate list (§2)
   is this principle applied: design approval, anything on entethalliance.org,
   status labels, rosters, repo administration, and every outbound email are
   human decisions. Building, verifying, tracing and reporting are agent work.
9. **Verify in the served artifact.** QA runs against live URLs and served
   HTML, not local files or assumptions — the misses this caught on the
   reference run (GA absent from later-built copies, Cloudflare-obfuscated
   emails dead off-host, broken relative logos) all passed local review.
   "Done" means checked where the user is.
10. **Every run improves the framework.** Each WG run ends by folding its
    corrections back into this document (the reference run corrected the
    go-live model within hours). A per-WG tracking issue (§11) records the
    run; this playbook stays generic and current.

---

## 1. Inputs the agent needs before starting

| Input | Where it lives |
|---|---|
| WG live URL and/or repo | From the requester |
| GitHub org access (repo create, PR, Pages admin) | `gh auth status` — must be an EntEthAlliance member (Claudy: `claudyfaucant`) |
| WordPress REST admin | `WP_URL`/`WP_USER`/`WP_APP_PASSWORD` in the ops host's `secrets/shared/crm.env` (user `arlo`, administrator). **Never commit these.** |
| WP Engine portal (redirect rules, files) | **Redwan only** — the agent prepares rule tables (§9), Redwan applies them |
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
4. **Never delete or overwrite** the old static files on the WP host; go-live
   is via redirect rules that only Redwan can add (WP Engine portal — §9).
5. **Repo administration changes** (un-archiving, adding/removing collaborators)
   only on Redwan's explicit instruction, named per repo and per person.
6. Standard engineering rules apply: branch + PR for every change (the only
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
- Serve at `docs/spec/<vN>/`; point the WG page's buttons at these copies.
- **Restyle every published version** (v1…vN), not just the current one — §9's
  redirects cover the whole `/specs/<spec>/` version tree, so every version
  needs a landing copy. Older versions may lack artifacts the current one has
  (EthTrust v1 has no checklist — curl-check before copying); older ReSpec
  builds carry extra chrome classes (`respec-tests-details` etc.) that render
  acceptably unthemed. Add each copy to the sitemap and the page's
  previous-versions list.
- SEO: until §9's redirects are live, these copies `<link rel="canonical">` to
  the **official entethalliance.org URL** — they must never compete with the
  canonical spec. After redirects, canonicals flip to self (§9.4).
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

## 9. Go-live on entethalliance.org (needs Redwan — WP Engine portal)

The old `/groups/<Name>/` and `/specs/...` trees are server filesystem.
**WP Engine access is held by Redwan** (not chaals — corrected 2026-08-24), and
the preferred mechanism is **301 redirect rules, not a file swap** (Redwan's
call on the EthTrust run: "I'd rather do a redirection"). Never recommend
removal — years of inbound links would 404; redirects preserve them and pass
SEO weight.

1. Preview approved (§2) and WP listing link flipped (§8) — the new site is
   already the only navigable path; go-live is then zero-deadline.
2. Agent prepares a **redirect rule table** for Redwan to paste in the
   WP Engine User Portal → Redirect rules (they act before static-file
   serving, so they work on these paths; Cloudflare Redirect Rules are an
   equivalent alternative). Pattern from the EthTrust run — all 301:

   | Source (regex) | Destination |
   |---|---|
   | `^/groups/<Name>/?.*` | Pages site root |
   | `^/specs/<spec>/vN/checklist\.html` | `…/spec/vN/checklist.html` |
   | `^/specs/<spec>/vN/?.*` | `…/spec/vN/` |
   | `^/specs/<spec>/?$` (latest-release URL) | newest `…/spec/vN/` |

   Rules for specific files (checklists) must sit **above** their broader
   version rule. Scope sources tightly — never a bare `/specs/` catch-all;
   other EEA specs live there. This implies **every published spec version
   needs a restyled copy first** (§6) so nothing redirects to a 404.
3. **Do not delete or overwrite** the old files; leave the shared
   `/groups/css|js/` folders alone (sibling group pages still use them).
   The redirect rules simply shadow the old tree — rollback = delete the rules.
4. After Redwan confirms the redirects are live: follow-up PR flips the
   canonical tags on all copies to **self** (they point at the
   entethalliance.org URLs until then — correct before, a redirect loop
   signal after) and removes "temporary routing" notes from READMEs/buttons.
5. Smoke-check every old URL follows its redirect to the right page.

(The old file-swap runbook — backup, upload `docs/`, purge caches — remains
valid if a WG ever prefers same-URL serving, but redirects are the default.)

## 9b. The WG's public-comment repo (check for one — EthTrust had one)

Specs often direct public feedback to a dedicated repo (EthTrust: the v3
spec's *Status* section says to raise issues in `EthTrust-public`). Audit it:

- **Is it archived?** An archived comment repo means the spec promises a
  channel the public cannot use — surface this immediately. Un-archiving is a
  §2 admin action (Redwan's explicit call; on EthTrust it was an oversight,
  not governance, and he ordered it reopened).
- After un-archiving, refresh it: repo **description + homepage** (point at
  the WG site), README rewrite (canonical spec links — old READMEs point at
  retired GH Pages addresses — the WG site, and a clear editorial-vs-
  substantive comment flow preserving the Non-Member Participation Agreement
  process), **issue-template assignees** (auto-assignees may name people who
  have left — align with current co-chairs), and any malformed links.
- Cross-link it from the WG page's Contribute section ("anyone may raise an
  issue — no membership required"); the old pages typically never surfaced it.
- Stale open issues are **WG business** — flag them to the co-chairs on the
  tracking issue; never answer spec questions yourself.

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
- [ ] Public-comment repo audited/refreshed (§9b) — or N/A, stated why
- [ ] QA gate (§10) passed
- [ ] **HUMAN: redirect rules live (§9)** — Redwan, WP Engine portal; rule table linked
- [ ] Canonicals flipped to self; "temporary routing" notes removed; issue closed
```

## 12. Running a public review cycle (optional stage — when the WG drafts a new spec version)

Demonstrated end-to-end on EthTrust v4 (2026-08-24). Principles 4, 6 and 7
drive everything here.

### 12.1 The draft page
A review draft is a **rendered page on the WG site** (`docs/spec/v<N>/`), not
a PR people must decode. Non-negotiables (principle 4): persistent banner
("DRAFT · AI-GENERATED · FOR VALIDATION & REVIEW ONLY — NOT AN APPROVED EEA
SPECIFICATION OR CERTIFICATION BASELINE" — adapt provenance), `noindex`, the
approved baseline named and linked in the head matter, provenance stated
(what generated it, from which sources), and a closing note that the final
version goes through the normal WG process. On the WG homepage the draft sits
in a visually distinct card (red-accented) *below* the approved version.

### 12.2 The requirement-level diff (the reviewer accelerator)
Add a "v3 today → v4 proposed" section to the draft: side-by-side panels
pairing the **exact current normative text** (extracted verbatim from the
hosted approved copy, anchor-linked) with the exact proposed replacement, one
panel per modified/replaced requirement, level changes flagged explicitly
([GP]→[S] is a certification-impact change reviewers must see). New
candidates get a no-counterpart table; nearest-context pairings are labelled
as editorial judgment. Give every candidate box an anchor id so feedback can
deep-link it. Reference implementation: v4 page §2.7.

### 12.3 The intake machinery (in the public-comment repo)
- A **structured issue form** (`.yml`, not `.md`) mirroring the draft's own
  review questions as a dropdown — short labels (2–5 words, they must not
  wrap on mobile), definitions in helper text; fields for requirement ID and
  section; only the feedback box required; proposed normative text optional
  and carrying the participation-agreement gate; name/affiliation for
  acknowledgment. Own label (e.g. `v4-review`) for triage.
- A **pinned umbrella issue**: what the draft is, what feedback is wanted,
  how to respond, form linked. First thing the issues tab shows.
- README callout + spec-table row for the draft, framed exactly like the page.
- Route buttons publicward: the WG page and draft link the pinned issue/form,
  not internal tracking issues.
- Close stale pre-cycle issues with a **resolution comment mapping asks to
  outcomes** (what was adopted, where; what wasn't; where to re-raise).

### 12.4 Outreach tracing (the follow-up loop)
When the requester emails reviewers, build the trace the same day:
- Pull the actual sent message (recipients, subject, thread id) from the
  mailbox — never work from a remembered list.
- A tracker script keyed on that recipient list checks (a) thread replies +
  inbound mail from recipients mentioning the spec, (b) new issues/comments
  in the public-comment repo; keeps delta state; prints responded/outstanding
  by org; suggests a nudge from ~day 5.
- A weekday OpenClaw cron (main session) runs it: digest on new activity,
  full status Mondays, silent otherwise. **The machinery never emails
  anyone** — nudge drafts only on the requester's explicit ask (principle 8).
  Reference: `clawd/scripts/ethtrust_v4_review_tracker.py` + cron
  `ethtrust-v4-review-tracker`.

## 13. EthTrust-specific things the next run should NOT copy blindly

- The `[S]/[M]/[Q]` level plates and depth bars — EthTrust's core concept;
  find the equivalent load-bearing concept for the next WG (or omit).
- The contributors data source (v3 spec head matter) — each WG's authoritative
  credit source differs; some have none (then skip the section, don't invent).
- The STIX-for-DeFi second strand — WG-specific.
- `wg-eta-registry` being archived — check, don't assume, for the next repo.
- Open items EthTrust still carries (see wg-ethtrust-site#4): §9 redirect
  rules awaiting Redwan; canonical flip after that; "(inactive)" label and
  Opal Graham co-chair status awaiting EEA staff; spec-skin CSS not yet
  promoted into this repo.
