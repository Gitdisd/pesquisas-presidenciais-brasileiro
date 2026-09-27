# Intake Cohort 005 — denser verified national stimulated 1º turno (PEBR 2026)

**Date:** 2026-09-26 / 2026-09-27 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-005`  
**Scope:** national geography · scenario `stimulated_1st_round` only  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes)

## Summary

| Metric | Value |
|--------|-------|
| Polls after (001–005) | **71** |
| New polls this cohort | **13** |
| New witnesses this cohort | **13** |
| Prior cohorts | 58 polls unchanged |
| Optional Lead Option B ingest | `site/data/canonical-points.json` refreshed for **all 71** verified polls |
| `site/data/chart.json` | **NOT modified / NOT invented by this cohort** (Lead/Stats-owned Option B re-export) |

## New polls (fieldwork_end order)

| poll_id | institute | fieldwork | TSE | conf | primary witness |
|---------|-----------|-----------|-----|------|-----------------|
| quaest_2026-01-11_stimulated_1st_round | quaest | 2026-01-08 → 01-11 | — | 0.92 press | G1 Cenário 2 (sem Tarcísio) |
| ideia_2026-01-12_stimulated_1st_round | ideia | 2026-01-08 → 01-12 | BR-06731/2026 | 0.95 pdf | Meio/Ideia PDF p.5 Flávio slate |
| ideia_2026-02-02_stimulated_1st_round | ideia | 2026-01-30 → 02-02 | BR-08425/2026 | 0.95 pdf | Meio/Ideia PDF p.9 Caiado slate |
| quaest_2026-02-09_stimulated_1st_round | quaest | 2026-02-05 → 02-09 | — | 0.92 press | G1 Cenário 2 (Caiado+Zema) |
| quaest_2026-03-09_stimulated_1st_round | quaest | 2026-03-06 → 03-09 | — | 0.92 press | G1 Cenário 2 (Caiado+Zema) |
| ideia_2026-04-07_stimulated_1st_round | ideia | 2026-04-03 → 04-07 | BR-00605/2026 | 0.96 pdf | Meio/Ideia Abril PDF TABELA 5 |
| cnt_mda_2026-04-12_stimulated_1st_round | cnt_mda | 2026-04-08 → 04-12 | BR-02847/2026 | 0.95 pdf | CNT 167ª PDF Cenário 1 |
| quaest_2026-04-13_stimulated_1st_round | quaest | 2026-04-09 → 04-13 | BR-09285/2026 | 0.92 press | G1 single stimulated slate |
| atlasintel_2026-04-27_stimulated_1st_round | atlasintel | 2026-04-22 → 04-27 | BR-07992/2026 | 0.96 pdf | Atlas/Bloomberg PDF Cenário 1 |
| indexa_2026-05-24_stimulated_1st_round | indexa | 2026-05-22 → 05-24 | BR-02154/2026 | 0.90 press | Money Times |
| cnt_mda_2026-06-14_stimulated_1st_round | cnt_mda | 2026-06-10 → 06-14 | BR-04256/2026 | 0.95 pdf | CNT 168ª PDF Cenário 1 |
| indexa_2026-07-19_stimulated_1st_round | indexa | 2026-07-16 → 07-19 | BR-02904/2026 | 0.92 press | CNN Brasil |
| poderdata_2026-07-29_stimulated_1st_round | poderdata | 2026-07-26 → 07-29 | BR-07845/2026 | 0.95 pdf | PoderData PDF |

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction (e.g. 0.022 = ±2.2pp).
- `fieldwork_mid` = calendar midpoint (`start + (end-start)//2 days`).
- Residuals: `branco_nulo`, `ns_nr`, `outros` when source publishes those buckets.
- Dual stimulated slates: preferred principal comparable (Ideia Caiado when available; Quaest Caiado+Zema Cenário 2 for Feb/Mar; Quaest Jan Cenário 2 sem Tarcísio; Atlas Cenário 1 Lula; CNT Cenário 1).
- Quaest Jan–Mar: TSE registration not printed in G1 articles → `tse_registration_id` null (provenance optional).
- Indexa May: sub-1% «outros candidatos» left in notes only.
- Old-site `polls.json` / BBC used **only as URL leads** — every cell re-fetched from primary PDF or named press.

## Previously blocked — now solved this pass

| Item | Resolution |
|------|------------|
| Quaest Jan–Apr | G1 full stimulated tables (Apr single slate; Jan–Mar preferred Cenário 2) |
| Ideia Jan/Feb/Apr | Primary Meio/Ideia PDFs (Jan/Feb chart visual; Abr text table) |
| Indexa May + Jul | Money Times + CNN full tables with residuals |
| CNT/MDA Apr + Jun | Primary PDFs Cenário 1 bar charts extractable visually |
| Atlas Apr | Primary Atlas/Bloomberg PDF Cenário 1 |
| PoderData late Jul | Primary PDF BR-07845/2026 |

## Exclusions / honest gaps (still blocked)

| Item | Reason |
|------|--------|
| Indexa Jun (BR-08944/2026) | Free press lists candidates but **no extractable 1º-turno residual split** this pass (would invent ns/branco) |
| Ipsos-Ipec 2026 national stimulated | Still no verified 2026 fieldwork national stimulated primary |
| Atlas Jan–Mar / Jul | atlasintel.org pages JS-empty to fetch; no free PDF mirrors verified this pass |
| Early Futura Jan–Jun / Nexus Mar–Jul / RTBD Feb–Jul | BBC aggregator leads only — not sole witness; dedicated primary tables not completed this pass |
| Ideia May (beyond existing May 27) | Lead-list May 1–5 wave still soft; not re-verified here |
| Pure 2º turno / runoff | Out of scope |
| Wikipedia / BBC aggregator alone | Discovery only — never sole witness |
| `site/data/chart.json` | **Not fabricated.** Lead Option B must re-export |

## Remaining coverage gaps (honest)

- Indexa Jun still missing residuals.
- Early Atlas (Jan–Mar, Jul), Futura Jan–Jun, Nexus Mar–Jul, RTBD early waves still thin vs lead list.
- Ipec 2026 series still missing.
- Total **71** verified stimulated national 1º turno.

## Validation

```bash
bin/pebr validate
```

## Files touched

```
data/national/polls/*.json                 (+13)
data/national/witnesses/*.json             (+13)
data/national/INTAKE_COHORT_005.md
site/data/canonical-points.json            (refresh all 71)
config/candidate_aliases.yml               (add michel_temer)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
