# Intake Cohort 004 — denser verified national stimulated 1º turno (PEBR 2026)

**Date:** 2026-09-26 / 2026-09-27 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-004`  
**Scope:** national geography · scenario `stimulated_1st_round` only  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes)

## Summary

| Metric | Value |
|--------|-------|
| Polls after (001+002+003+004) | **58** |
| New polls this cohort | **16** |
| New witnesses this cohort | **16** |
| Prior cohorts | 42 polls unchanged |
| Optional Lead Option B ingest | `site/data/canonical-points.json` refreshed for **all 58** verified polls |
| `site/data/chart.json` | **NOT modified / NOT invented by this cohort** (Lead/Stats-owned Option B re-export) |

## New polls (fieldwork_end order)

| poll_id | institute | fieldwork | TSE | conf | primary witness |
|---------|-----------|-----------|-----|------|-----------------|
| parana_pesquisas_2026-01-28_stimulated_1st_round | parana_pesquisas | 2026-01-25 → 01-28 | BR-08254/2026 | 0.90 press | Gazeta do Povo (Flávio slate) |
| ideia_2026-03-10_stimulated_1st_round | ideia | 2026-03-06 → 03-10 | BR-00386/2026 | 0.90 press | Gazeta (Caiado slate) |
| datafolha_2026-04-09_stimulated_1st_round | datafolha | 2026-04-07 → 04-09 | BR-03770/2026 | 0.96 pdf | Datafolha PDF (Poder360 CDN) |
| quaest_2026-05-11_stimulated_1st_round | quaest | 2026-05-08 → 05-11 | BR-03598/2026 | 0.92 press | G1 |
| poderdata_2026-05-28_stimulated_1st_round | poderdata | 2026-05-25 → 05-28 | BR-04882/2026 | 0.95 pdf | PoderData PDF |
| quaest_2026-06-08_stimulated_1st_round | quaest | 2026-06-05 → 06-08 | BR-07661/2026 | 0.92 press | Gazeta do Povo |
| poderdata_2026-06-24_stimulated_1st_round | poderdata | 2026-06-21 → 06-24 | BR-05722/2026 | 0.95 pdf | PoderData PDF |
| atlasintel_2026-06-30_stimulated_1st_round | atlasintel | 2026-06-26 → 06-30 | BR-04582/2026 | 0.88 press | Gazeta (Flávio slate) |
| futura_2026-07-11_stimulated_1st_round | futura | 2026-07-07 → 07-11 | BR-07294/2026 | 0.90 press | Gazeta (1º cenário) |
| poderdata_2026-07-15_stimulated_1st_round | poderdata | 2026-07-12 → 07-15 | BR-00059/2026 | 0.95 pdf | PoderData PDF |
| nexus_2026-08-02_stimulated_1st_round | nexus | 2026-07-31 → 08-02 | BR-02874/2026 | 0.90 press | Gazeta |
| futura_2026-08-07_stimulated_1st_round | futura | 2026-08-03 → 08-07 | BR-08109/2026 | 0.90 press | Gazeta (1º cenário) |
| indexa_2026-09-13_stimulated_1st_round | indexa | 2026-09-10 → 09-13 | BR-03482/2026 | 0.92 press | Gazeta (unblocks Sep) |
| cnt_mda_2026-09-13_stimulated_1st_round | cnt_mda | 2026-09-09 → 09-13 | BR-06902/2026 | 0.92 press | O Tempo (unblocks Sep 170ª) |
| gerp_2026-09-16_stimulated_1st_round | gerp | 2026-09-14 → 09-16 | BR-00535/2026 | 0.90 press | Gazeta votos totais |
| alfa_inteligencia_2026-09-23_stimulated_1st_round | alfa_inteligencia | 2026-09-18 → 09-23 | BR-02512/2026 | 0.90 press | CartaCapital |

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction (e.g. 0.022 = ±2.2pp).
- `fieldwork_mid` = calendar midpoint (`start + (end-start)//2 days`).
- Residuals: `branco_nulo`, `ns_nr`, `outros` when source publishes those buckets.
- Dual stimulated slates: preferred principal comparable (Ideia Caiado; Futura/Atlas first Flávio-fuller; Paraná Flávio+Ratinho+Caiado; CNT Sep Marçal-in as only published).
- Indexa Sep: 4% «não iria votar» left in notes only (same rule as Aug Indexa).
- Old-site `polls.json` / Wikipedia used **only as URL leads** — every cell re-fetched.

## Previously blocked — now solved this pass

| Item | Resolution |
|------|------------|
| Indexa Sep (BR-03482/2026) | Gazeta full stimulated table (JOTA still paywalled) |
| CNT/MDA Sep 170ª (BR-06902/2026) | O Tempo + CartaCapital extractable tables (PDF still image-heavy) |
| Datafolha Apr 2026 (BR-03770/2026) | Institute PDF on Poder360 CDN + G1 |

## Exclusions / honest gaps (still blocked)

| Item | Reason |
|------|--------|
| Ipsos-Ipec 2026 national stimulated | Only Dec-2025 release found; no verified 2026 fieldwork national stimulated primary this pass |
| Quaest Jan (multi-scenario) / Feb / Mar / Apr | Jan multi-adversary ambiguous for single principal; Gazeta Apr/Mar/Fev slugs soft-hub; need dedicated G1/institute PDF |
| Ideia Jan/Feb/Apr/May waves beyond Mar | Soft-404 Gazeta slugs or no full table this pass |
| Indexa May/Jun/Jul series | Gazeta slugs soft-hub / incomplete |
| CNT/MDA Apr/Jun | Soft-hub Gazeta; PDF image tables |
| Early Atlas/Nexus/Futura Jan–May beyond what entered | BBC aggregator leads only — not sole witness |
| Pure 2º turno / runoff | Out of scope |
| Wikipedia / BBC aggregator alone | Discovery only — never sole witness |
| `site/data/chart.json` | **Not fabricated.** Lead Option B must re-export |

## Remaining coverage gaps (honest)

- Jan–Apr still thinner than Aug–Sep: Quaest Jan–Apr, Ideia Jan/Feb/Apr, Atlas Jan–May, Futura Jan–Jun, Nexus Mar–Jul gaps remain.
- Ipec 2026 series still missing.
- Several Indexa mid-year waves still without free primary tables.
- Total **58** verified stimulated national 1º turno.

## Validation

```bash
bin/pebr validate
```

## Files touched

```
data/national/polls/*.json                 (+16)
data/national/witnesses/*.json             (+16)
data/national/INTAKE_COHORT_004.md
site/data/canonical-points.json            (refresh all 58)
config/institutes.yml                      (activate alfa_inteligencia)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
