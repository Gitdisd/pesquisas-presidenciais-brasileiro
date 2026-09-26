# Intake Cohort 002 — verified national stimulated 1º turno expansion (PEBR 2026)

**Date:** 2026-09-26 / 2026-09-27 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-002`  
**Scope:** national geography · scenario `stimulated_1st_round` only  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes)

## Summary

| Metric | Value |
|--------|-------|
| Polls after (001+002) | **36** |
| New polls this cohort | **21** |
| New witnesses this cohort | **21** |
| Prior cohort 001 | 15 polls / 18 witnesses (unchanged) |
| Institutes newly activated | parana_pesquisas, cnt_mda, palver |
| Optional Lead Option B ingest | `site/data/canonical-points.json` refreshed for **all 36** verified polls |
| `site/data/chart.json` | **NOT modified / NOT invented by this cohort** (Lead/Stats-owned Option B re-export) |

## New polls (fieldwork_end order)

| poll_id | institute | fieldwork | TSE | conf | primary witness |
|---------|-----------|-----------|-----|------|-----------------|
| parana_pesquisas_2026-02-25_stimulated_1st_round | parana_pesquisas | 2026-02-22 → 02-25 | BR-07974/2026 | 0.95 pdf | institute PDF (Caiado scenario) |
| datafolha_2026-03-05_stimulated_1st_round | datafolha | 2026-03-03 → 03-05 | null | 0.85 press | G1 Cenário 3 (Flávio+Caiado) |
| parana_pesquisas_2026-03-28_stimulated_1st_round | parana_pesquisas | 2026-03-25 → 03-28 | BR-00873/2026 | 0.96 pdf | institute PDF |
| datafolha_2026-06-19_stimulated_1st_round | datafolha | 2026-06-17 → 06-19 | BR-09956/2026 | 0.92 press | G1 |
| quaest_2026-07-13_stimulated_1st_round | quaest | 2026-07-10 → 07-13 | BR-07181/2026 | 0.92 press | G1 |
| datafolha_2026-07-24_stimulated_1st_round | datafolha | 2026-07-22 → 07-24 | BR-01166/2026 | 0.92 press | G1 |
| cnt_mda_2026-08-09_stimulated_1st_round | cnt_mda | 2026-08-05 → 08-09 | BR-06935/2026 | 0.90 press | CartaCapital table |
| poderdata_2026-08-12_stimulated_1st_round | poderdata | 2026-08-09 → 08-12 | BR-06868/2026 | 0.95 pdf | PoderData PDF |
| poderdata_2026-08-26_stimulated_1st_round | poderdata | 2026-08-23 → 08-26 | BR-04974/2026 | 0.95 pdf | PoderData PDF |
| atlasintel_2026-08-30_stimulated_1st_round | atlasintel | 2026-08-25 → 08-30 | BR-07972/2026 | 0.90 press | Poder360 |
| quaest_2026-09-01_stimulated_1st_round | quaest | 2026-08-30 → 09-01 | BR-07065/2026 | 0.92 press | G1 (no-Marçal) |
| poderdata_2026-09-09_stimulated_1st_round | poderdata | 2026-09-06 → 09-09 | BR-04914/2026 | 0.96 pdf | PoderData PDF |
| datafolha_2026-09-10_stimulated_1st_round | datafolha | 2026-09-08 → 09-10 | BR-01833/2026 | 0.90 press | CNN |
| atlasintel_2026-09-16_stimulated_1st_round | atlasintel | 2026-09-11 → 09-16 | BR-06221/2026 | 0.88 press | CNN |
| datafolha_2026-09-16_stimulated_1st_round | datafolha | 2026-09-15 → 09-16 | BR-04029/2026 | 0.92 press | G1 |
| poderdata_2026-09-16_stimulated_1st_round | poderdata | 2026-09-13 → 09-16 | BR-00360/2026 | 0.93 press | Poder360 (+ PDF) |
| nexus_2026-09-20_stimulated_1st_round | nexus | 2026-09-18 → 09-20 | BR-00485/2026 | 0.90 press | CNN |
| futura_2026-09-23_stimulated_1st_round | futura | 2026-09-19 → 09-23 | BR-05268/2026 | 0.96 pdf | Futura PDF (Poder360 CDN) |
| poderdata_2026-09-23_stimulated_1st_round | poderdata | 2026-09-20 → 09-23 | BR-01739/2026 | 0.96 pdf | PoderData PDF |
| realtime_bigdata_2026-09-23_stimulated_1st_round | realtime_bigdata | 2026-09-19 → 09-23 | BR-04202/2026 | 0.90 press | Gazeta do Povo |
| palver_2026-09-23_stimulated_1st_round | palver | 2026-09-20 → 09-23 | BR-09587/2026 | 0.88 press | CNN |

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction (e.g. 0.022 = ±2.2pp).
- `fieldwork_mid` = calendar midpoint of start/end.
- Residuals: `branco_nulo`, `ns_nr`, `outros` when source publishes those buckets.
- Partnership brands normalized as in cohort 001 + CNT/MDA → `cnt_mda`, Palver → `palver`, Paraná Pesquisas → `parana_pesquisas`.
- When dual stimulated slates exist (Marçal in/out; Paraná Ratinho vs Caiado; Datafolha Mar multi-scenario), preferred the principal comparable slate and documented in poll notes — did **not** dual-enter.

## Exclusions / honest gaps

| Item | Reason |
|------|--------|
| CNT/MDA Sep 170ª (BR-06902/2026) | Institute PDF stimulated 1º turno charts still image-only (pdftotext has headers, no reliable % table). No press article with extractable full stimulated table verified this pass. |
| Datafolha May 2026 (BR-00290/2026) | G1 article confirms Lula 38 / Flávio 35 / meta, but full stimulated candidate+residual list not extractable from fetched HTML body (image charts). Deferred. |
| Datafolha Aug 18–20 | G1 URL soft-failed / wrong path this pass; not invented from Wikipedia alone. |
| Quaest 31 Jul–3 Aug / 10–13 Aug | CNN/G1 fetches incomplete on residuals or 404; not entered without residual verification. |
| Ipsos-Ipec 2026 national stimulated | Only Dec-2025 national release confirmed; no verified 2026 stimulated national primary this pass. |
| Ideia waves besides 001 Aug-03 | No re-fetched primary with full table this pass. |
| Indexa Sep 10–13 | JOTA paywalled / incomplete fetch; skipped. |
| GERP / Vox / Futura earlier 2026 waves | Timeboxed; URL leads remain in quarantine for later. |
| BBC aggregator early-2026 bulk rows | Still not cell-by-cell re-verified — skipped (same rule as cohort 001). |
| Pure 2º turno / runoff | Out of scope. |
| Wikipedia EN table alone | Discovery only — never sole witness for numbers. |
| `site/data/chart.json` | **Not fabricated.** Lead Option B must re-export from `canonical-points.json` / `data/national/polls`. |

## Remaining coverage gaps (honest)

- Early 2026 (Jan–Apr) still thin vs campaign period: need more Quaest/Atlas/Ideia/Futura/Nexus/RTBD primary fetches.
- Ipec national 2026 stimulated series missing.
- CNT/MDA Sep still blocked on image PDF.
- Several Aug Quaest/Datafolha waves still missing.
- Total **36** verified (short of ≥40 stretch goal) without inventing — push largest honest set.

## Validation

```bash
bin/pebr validate
```

## Files touched

```
data/national/polls/*.json                 (+21)
data/national/witnesses/*.json             (+21)
data/national/INTAKE_COHORT_002.md
site/data/canonical-points.json            (refresh all 36)
config/institutes.yml                      (activate parana_pesquisas, cnt_mda, palver)
config/candidate_aliases.yml               (+aldo_rebelo, ratinho_junior, joaquim_barbosa, aecio_neves, hero_bezerra)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
