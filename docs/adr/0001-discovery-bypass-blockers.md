# ADR 0001 — Discovery past robots / paywalls / JS listings (without inventing shares)

**Status:** Accepted (safe slice shipped 2026-09-27)  
**Repo:** pesquisas-presidenciais-brasileiro  
**Companion:** [docs/discovery.md](../discovery.md), old-site `pesquisas-eleitorais-br`

## Context

Live `bin/pebr watch --fetch` hits soft failures: Akamai/WAF 403 (TSE Dados Abertos, UOL), JS-thin institute homes (AtlasIntel Nuxt, Futura), paywalled outlets (Estadão, Economist), and rate limits. Lead rule: **tighten watch targets + queue UX; never invent poll % in CI; escalate secrets/robots if blocking.**

## Research notes (what actually works)

### A. What the old site (`pesquisas-eleitorais-br`) did

| Technique | Role | Legal / ToS |
|-----------|------|-------------|
| Config-driven multi-URL sources (`data/sources.json`) | Redundancy when one URL soft-fails | Safe (public pages) |
| **Google News RSS** (8 institute/query variants) | Primary *signal* feed; soft-fail OK | Safe (public RSS) |
| Outlet/institute HTML listings + regex `<a href>` | Candidate URLs only | Safe if robots allow; grey if Disallow |
| WordPress / Globo **RSS** (`poder360.com.br/feed/`, G1 dynamo RSS) | Better than JS HTML | Safe |
| Soft fetch failures → continue; inbox for unparseable | Never invent cells | Safe |
| JSON-LD date heuristics + regex extract | Old site *did* stage shares when confident | PEBR **deliberately does not** |
| No login / paywall bypass (documented) | Hard rule | Safe |
| Playwright | **E2E only**, not discovery fetch | N/A |
| TSE registry recovery via GNews protocol search | Provenance | Safe signal |

### B. Common BR poll pipelines (2026)

| Pipeline | Acquisition | Notes for PEBR |
|----------|-------------|----------------|
| **AFOS** | GNews RSS + `cdn.tse.jus.br/.../pesquisa_eleitoral_2026.zip` 3×/day; Wayback snapshot of cited URLs | CDN zip often **403 from datacenter IPs** (verified this box); needs residential/ops egress |
| **agregR / PollingData / Depois das 17 / TradeMap** | Curated TSE-registered + press tables | Human/editorial ingest; not scrape recipes |
| **Wikipedia EN/PT polling pages** | Citation farm | Signal only |
| **Archive.org** `wayback/available` + mementos | Public snapshots of listings | Safe read of already-public archives; **not** a paywall bypass |

### C. Live probe results (2026-09-27, America/Sao_Paulo, research box)

| Endpoint | Result |
|----------|--------|
| Google News RSS (several queries) | **200** XML |
| G1 pesquisas RSS `…/pesquisa-eleitoral/rss2.xml` | **200** (best G1 path) |
| G1 política RSS | **200** (noisy; state polls) |
| Poder360 `/feed/` | **200** |
| G1 / Gazeta / CNN / Wiki HTML listings | **200** (regex links OK; state noise) |
| AtlasIntel / Quaest HTML | **200** but JS-thin |
| TSE `dadosabertos` + `cdn.tse.jus.br` zip | **403** Access Denied |
| UOL eleições | **403** |
| `archive.org/wayback/available?url=G1…` | **200** + snapshot URL |

### D. Legal / ToS-safe vs grey

**Prefer (safe):** public RSS; Google News RSS; Wikipedia; archive.org *availability* + public mementos; TSE open-data **when egress allows**; cached **fixtures** in CI; human dual-enter of shares.

**Grey / avoid:** ignoring `robots.txt` Disallow; login/cookie jar; CAPTCHA solve; paywall DOM tricks; residential-proxy “stealth” scrapers; self-modifying parsers; Playwright for production discovery (Ruby-glue rule + fragility).

**Hard PEBR holds:** no inventing shares; no auto-write to `data/national/polls`; no chart/UI edits from discovery.

## Decision — ranked implementable steps

| Rank | Step | Status |
|------|------|--------|
| 1 | Expand GNews queries + G1 pesquisas RSS + Poder360 feed + Wiki + Gazeta | **Shipped** |
| 2 | Follow HTTP redirects in `Net::HTTP` | **Shipped** |
| 3 | `archive_fallback` via Wayback `available` API for listing_html | **Shipped** |
| 4 | Sitemap `lastmod` + RSS `pubDate` as queue metadata | **Shipped** |
| 5 | Wrong-office always wins over hub slug false positives | **Shipped** |
| 6 | Queue review UX docs (status meanings, sort, artifact path) | **Shipped** |
| 7 | Fixture-backed offline CI (no live invent) | **Already + extended** |
| 8 | TSE zip via ops egress / secret mirror URL | **Blocked — needs human** |
| 9 | Optional `POLL_SOURCE_URL` dump of pre-fetched HTML | **Needs Lead secret** |
| 10 | Institute JSON APIs (if any appear) | None confirmed; revisit |

## Consequences

- Discovery recall rises via RSS redundancy without touching canonical polls.
- Archive fallback is **evidence of listing links**, not witness bytes for shares.
- TSE provenance remains blocked from Actions/datacenter until Lead provides egress or a mirrored zip.
- Operators still dual-enter percentages after opening queued URLs.

## Escalations for Lead / secrets

1. **TSE open-data zip** — manual download or GitHub Actions secret pointing at an allowed mirror / egress runner (`cdn.tse.jus.br/.../pesquisa_eleitoral_2026.zip`). Provenance only.
2. **PesqEle UI** — JS + WAF; browser session only; do not automate login.
3. **Paywalled witnesses** — human paste / PDF upload into `data/national/witnesses/` with `content_hash`; never CI bypass.
