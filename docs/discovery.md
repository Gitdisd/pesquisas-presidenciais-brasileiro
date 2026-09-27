# Discovery & intake runbook (PEBR 2026)

**Discover ≠ ingest.** Automated watchers only flag source URLs for humans. Poll shares are never invented in CI or by `bin/pebr watch` / `discover`.

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
| `bin/pebr watch --offline` | No | `queue.json` + `last-run.json` from **fixtures** |
| `bin/pebr watch --fetch` | Yes (listings/feeds only) | same; live bodies |
| `bin/pebr validate` | No | none (exit status) |
| `bin/pebr normalize` | No | none (fingerprint report) |
| `bin/pebr assemble` | No | both `canonical-points*.json` |

Queue path: **`data/national/discovery/`** (not under `site/`) so Pages does not publish the review inbox.

## Watch targets

[`config/watch_targets.yml`](../config/watch_targets.yml) — high-signal national subset: G1, Poder360, CNN, AtlasIntel, Quaest, TSE dados abertos, sample RSS/sitemap, Google News RSS.

Queue item fields: `url`, `source_id`, `target_id`, `detected_at`, `title`/`snippet`, `scenario_hints`, `score`/`score_reasons`, `listing_content_hash`, `status` (`needs_human_review` | `already_witnessed` | `inbox_low_score`).

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
- **discovery-fetch** (opt-in `workflow_dispatch` input `run_discovery_fetch`): live `bin/pebr watch --fetch`; uploads queue artifact only.

## Still blocked / fragile

- Live fetch: robots.txt, bot walls, paywalls, JS-rendered listings, rate limits.
- No secrets for authenticated institute portals (`POLL_SOURCE_URL`-style remote dumps are Lead/ops only if ever used).
- TSE = provenance, not horse-race truth.
- Parsers are dumb regex HTML/RSS/sitemap — no self-modifying parsers.
- National vs state: policy heuristics; human decides geography.

## Holds (do not weaken)

Michelle out; Quaest Jun 08; Meio/Ideia; image-PDF inventing; Ipec 2026 national stimulated 1º hard-stop.
