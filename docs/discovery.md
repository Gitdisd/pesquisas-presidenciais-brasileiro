# Discovery & intake runbook (PEBR 2026)

**Discover ≠ ingest.** Automated watchers only flag source URLs for humans. Poll shares are never invented in CI or by `bin/pebr watch` / `discover`.

### Discovery boundary (non-negotiable)

- **Playwright is not part of PEBR discovery or CI.** Browser automation stays out of the pipeline.
- JS-thin, WAF-blocked, and PesqEle listings are a **human/manual witness path**: a person may open the listing and capture a primary witness, but the watcher does not work around the block.
- The safe automated path is **public RSS, Google News RSS (GNews), Wikipedia citation/listing pages, Wayback availability/public mementos, and checked-in fixtures**. Wikipedia citations are leads for a human primary-source check, never the source of truth for shares.
- **No shares are invented.** The pipeline does not use login, paywall, CAPTCHA, proxy, or TSE-403 browser workarounds; it only queues URLs and metadata for review.

## Old site vs PEBR (acquisition)

Reference site: https://gitdisd.github.io/pesquisas-eleitorais-br/  
Repo: https://github.com/Gitdisd/pesquisas-eleitorais-br

| Concern | Old site (`pesquisas-eleitorais-br`) | PEBR (`pesquisas-presidenciais-brasileiro`) |
|---------|--------------------------------------|---------------------------------------------|
| Language | Node (`discover-polls.mjs`, `update-polls.mjs`) + Python/Rust/WASM gates | **Ruby only** for glue (`bin/pebr`) |
| Config | `data/sources.json` (outlets, institutes, Google News RSS) | `config/watch_targets.yml` (+ research `docs/source-map/sources.json`) |
| Link policy | `discover-policy.mjs` (canonicalize, score, reject wrong-office/social) | `lib/pebr/watch_policy.rb` (ported) |
| Discovery output | Stages `discovered-polls.json` **with extracted cells** when confident; `inbox.json` for ambiguous | **`data/national/discovery/queue.json`** — URLs/metadata/scores only; **no shares** |
| Merge to canonical | Hourly Actions **auto-commits** `data/polls.json` after audits | Human dual-enter → `validate` → `normalize` → `assemble`; CI **fails on drift**, never invents |
| PDF/OCR | `recover-poll-documents.mjs` + tesseract in CI | **Out of scope** (holds: no image-PDF inventing) |
| TSE | `poll-pipeline.mjs` registry recovery queues | Watch target for dados-abertos listing (provenance signal only) |
| Charts | Built in refresh pipeline | Lead-owned Option B; Actions does **not** touch `chart.json` |

**Ported patterns:** config-driven listing/RSS watchers, Google News RSS signal, URL canonicalize (strip UTM), presidential vs state link scoring, soft fetch failures, `last-run.json` health report, staging under `data/…/discovery/` (not public site).

**Deliberately not ported:** auto cell extraction, OCR inventing, auto-commit of poll numbers, WASM/Go parsers, hourly push of invented data.

## Commands

| Command | Network | Writes |
|---------|---------|--------|
| `bin/pebr discover` | No | stdout inventory of `sources.json` + `institutes.yml` |
| `bin/pebr watch --offline` | No | `queue.json` + `last-run.json` from **fixtures** + human drop inbox |
| `bin/pebr watch --fetch` | Yes (listings/feeds only) | same; live bodies |
| `bin/pebr drop FILE` | No | copy HTML/PDF into `data/national/discovery/inbox/` + sidecar hash |
| `bin/pebr validate` | No | none (exit status) |
| `bin/pebr normalize` | No | none (fingerprint report) |
| `bin/pebr assemble` | No | both `canonical-points*.json` |

Queue path: **`data/national/discovery/`** (not under `site/`) so Pages does not publish the review inbox.

## Watch targets

[`config/watch_targets.yml`](../config/watch_targets.yml) — high-signal national subset: **G1 pesquisas RSS**, G1/Poder360/CNN/Gazeta/UOL/PollingData/Wikipedia EN+PT polling listings, institute homes, alternate TSE/PesqEle pointers, TradeMap/Palver provenance indexes, a TSE-registration GNews query, TSE dados abertos (often 403), sitemap fixture, **multiple Google News RSS queries**, Poder360 feed, and the human evidence drop folder. Optional `archive_fallback: true` uses archive.org `wayback/available` when a listing fails. Wikipedia, news, aggregators, and TSE IDs are citation/provenance discovery only; every lead needs a human primary check.

Queue item fields: `url`, `source_id`, `target_id` / `target_ids`, `detected_at`, `last_seen_at`, `title`/`snippet`, `scenario_hints`, `score`/`score_reasons`, `listing_content_hash`, `listing_via` (`fixture`|`network`|`archive`), optional `published_at` (RSS) / `lastmod` (sitemap), `status` (`needs_human_review` | `already_witnessed` | `inbox_low_score`).

### Queue review UX (operator)

Sort is automatic: `needs_human_review` first → higher score → newer `last_seen_at`.

| Status | Meaning | Operator action |
|--------|---------|-----------------|
| `needs_human_review` | Score ≥ min (default 35) or keyword hit; not yet witnessed | Open URL → confirm **national** presidential → dual-enter poll + witness |
| `already_witnessed` | URL matches a witness `source_url` | Skip (or refresh witness if bytes changed) |
| `inbox_low_score` | Weak signal | Usually ignore; do not ingest |

CI artifact (opt-in `run_discovery_fetch`): download `pebr-discovery-queue` → inspect `items[]` → **never** copy shares from automation. See also [ADR 0001](adr/0001-discovery-bypass-blockers.md).

## End-to-end acquisition loop

1. **Discover:** safe watchers use public RSS/GNews, outlet listings, Wikipedia EN/PT citation pages, Wayback availability, TSE/PesqEle pointers, and alternate provenance indexes. They emit URLs, dates, hashes, and scores only.
2. **Queue:** CI may upload the queue artifact; `needs_human_review` is sorted ahead of weak signals. `lastmod`/`pubDate` changes receive an explicit metadata diff and a ranking bump.
3. **Human primary check:** open the URL or use the [manual evidence intake](manual-intake.md) drop path for JS/WAF/PesqEle, paywall, or PDF obstacles. TSE registration IDs (`BR-#####/2026`) establish provenance only, never poll shares.
4. **Dual-enter:** save a witness with `source_url` + `content_hash`, then have two human entries agree before writing poll cells.
5. **Validate/assemble:** run `validate`, `normalize`, and `assemble`; CI checks canonical drift and never extracts or invents shares.

### Stubborn-source operator path

For a human-saved HTML/PDF, use `bin/pebr drop ...`, then `bin/pebr watch --offline`. The drop is indexed without parsing its body. Follow the checklist in [manual-intake.md](manual-intake.md) to create a normal witness and dual-enter shares.

## Operator path after a URL is flagged

1. Open the queued URL; confirm **national** presidential (not state/municipal). Respect holds (Michelle out; Quaest Jun 08; Meio/Ideia; no image-PDF inventing; Ipec 2026 national stimulated 1º hard-stop).
2. Fetch primary/press witness bytes; record `source_url` + `content_hash` (sha256) on a witness JSON under `data/national/witnesses/`.
3. Dual-enter shares as fractions **0–1** into `data/national/polls/<poll_id>.json`. Link `witness_ids`. Scenario keys: [`scenario-convention.md`](scenario-convention.md).
4. Run:

   ```bash
   bundle install   # once
   bin/pebr validate && bin/pebr normalize && bin/pebr assemble
   ```

5. Commit polls + witnesses + both refreshed `canonical-points*.json` together.
6. **Lead only:** re-export Option B (`chart.json` / `chart-2nd-round.json`) when ready. If canonical files are byte-stable, Lead does nothing for Pages chart.

## CI

[`.github/workflows/refresh.yml`](../.github/workflows/refresh.yml):

- **validate-assemble**: `validate` → `normalize` → `assemble` → loud `git diff --exit-code` on **both** canonical JSON files + job summary; offline `watch` smoke + unit tests. **Never invents shares; never auto-commits polls.**
- **discovery-fetch** (opt-in `workflow_dispatch` input `run_discovery_fetch`): live `bin/pebr watch --fetch`; uploads queue artifact only. It does not use Playwright or browser workarounds.
- Human HTML/PDF drops are indexed by `bin/pebr watch --offline`; the drop is evidence metadata, not parsed poll data.

## Still blocked / fragile

| Blocker | Mitigation now | Still needs human / secrets |
|---------|----------------|-----------------------------|
| TSE Dados Abertos / CDN **403** (Akamai) | Portal/PesqEle pointers, TSE-registration GNews, TradeMap (often timeout), institute PDFs, Palver/GitHub, Wikipedia citations; **Wayback memento of `pesquisa_eleitoral_2026.zip` (2026-09-09) works as lagging public mirror** (`tse-cdn-zip-wayback`); fixture + `archive_fallback` | **Yes — mirror/egress secret still needed** for fresh daily dumps (Wayback is dated snapshot only; live CDN/dadosabertos/PesqEle still 403 from datacenter egress). Alternate BR-IDs still need human primary verification |
| JS/WAF/PesqEle listings (including TSE 403) | Queue only; use RSS/GNews/Wikipedia/Wayback/fixtures for safe signals | Human/manual listing review and primary witness capture |
| JS-thin institute homes (Atlas, Futura) | Prefer GNews + outlet RSS mirrors | Occasional manual PDF grab |
| Paywalls (Estadão, Economist, soft Folha) | Do **not** bypass; use open mirrors (G1, Poder360, Wikipedia citations) | Human witness upload |
| robots.txt / rate limits | Polite UA; soft-fail; RSS-first | Escalate if Disallow covers needed path |
| Google News article redirect URLs | Kept as **signals** (downranked); prefer resolved outlet URL when present in feed | Optional manual resolve |

- Parsers are dumb regex HTML/RSS/sitemap — **no** self-modifying parsers, **no** Go/WASM glue; human drops are hashed/indexed without body parsing.
- National vs state: policy rejects wrong-office even inside `/pesquisa-eleitoral-*` hubs; human still decides geography.
- Full technique ranking: [ADR 0001](adr/0001-discovery-bypass-blockers.md).

## Holds (do not weaken)

Michelle out; Quaest Jun 08; Meio/Ideia; image-PDF inventing; Ipec 2026 national stimulated 1º hard-stop.
