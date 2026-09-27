# Intake Cohort 006 — denser verified national stimulated 1º turno (PEBR 2026)

**Date:** 2026-09-26 / 2026-09-27 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-006`  
**Scope:** national geography · scenario `stimulated_1st_round` only  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes)

## Summary

| Metric | Value |
|--------|-------|
| Polls after (001–006) | **94** |
| New polls this cohort | **23** |
| New witnesses this cohort | **23** |
| Prior cohorts | 71 polls unchanged |
| Optional Lead Option B ingest | `site/data/canonical-points.json` refreshed for **all 94** verified polls |
| `site/data/chart.json` | **NOT modified / NOT invented by this cohort** (Lead/Stats-owned Option B re-export) |

## New polls (fieldwork_end order)

| poll_id | institute | fieldwork | TSE | conf | primary witness |
|---------|-----------|-----------|-----|------|-----------------|
| atlasintel_2026-01-20_stimulated_1st_round | atlasintel | 2026-01-15 → 01-20 | BR-02804/2026 | 0.96 pdf | Atlas/Bloomberg PDF Cenário com Flávio |
| futura_2026-01-19_stimulated_1st_round | futura | 2026-01-15 → 01-19 | BR-08233/2026 | 0.90 press | Gazeta 100% Cidades/Futura |
| atlasintel_2026-02-24_stimulated_1st_round | atlasintel | 2026-02-19 → 02-24 | BR-07600/2026 | 0.96 pdf | Atlas/Bloomberg PDF Cenário 1 |
| futura_2026-02-07_stimulated_1st_round | futura | 2026-02-03 → 02-07 | BR-02276/2026 | 0.90 press | Gazeta |
| realtime_bigdata_2026-03-02_stimulated_1st_round | realtime_bigdata | 2026-02-28 → 03-02 | BR-09353/2026 | 0.90 press | Gazeta first stim |
| futura_2026-03-06_stimulated_1st_round | futura | 2026-03-02 → 03-06 | BR-06607/2026 | 0.90 press | Gazeta |
| atlasintel_2026-03-23_stimulated_1st_round | atlasintel | 2026-03-18 → 03-23 | BR-04227/2026 | 0.96 pdf | Atlas/Bloomberg PDF Cenário 1 |
| nexus_2026-03-29_stimulated_1st_round | nexus | 2026-03-27 → 03-29 | BR-07875/2026 | 0.95 pdf | BTG/Nexus PDF Cenário 1 |
| futura_2026-04-11_stimulated_1st_round | futura | 2026-04-07 → 04-11 | BR-08282/2026 | 0.90 press | Gazeta |
| nexus_2026-04-26_stimulated_1st_round | nexus | 2026-04-24 → 04-26 | BR-01075/2026 | 0.95 pdf | BTG/Nexus PDF Cenário 1 |
| realtime_bigdata_2026-05-04_stimulated_1st_round | realtime_bigdata | 2026-05-02 → 05-04 | BR-03627/2026 | 0.90 press | Gazeta |
| ideia_2026-05-05_stimulated_1st_round | ideia | 2026-05-01 → 05-05 | BR-05356/2026 | 0.96 pdf | Meio/Ideia PDF p.32 |
| futura_2026-05-08_stimulated_1st_round | futura | 2026-05-04 → 05-08 | BR-03678/2026 | 0.90 press | Gazeta |
| atlasintel_2026-05-18_stimulated_1st_round | atlasintel | 2026-05-13 → 05-18 | BR-06939/2026 | 0.96 pdf | Atlas/Bloomberg PDF Cenário 1 |
| futura_2026-05-20_stimulated_1st_round | futura | 2026-05-15 → 05-20 | BR-06529/2026 | 0.95 pdf | Futura/Apex PDF Cenário 1 |
| nexus_2026-05-24_stimulated_1st_round | nexus | 2026-05-22 → 05-24 | BR-04193/2026 | 0.95 pdf | BTG/Nexus PDF Cenário 1 |
| futura_2026-06-12_stimulated_1st_round | futura | 2026-06-08 → 06-12 | BR-01461/2026 | 0.90 press | Gazeta |
| nexus_2026-06-14_stimulated_1st_round | nexus | 2026-06-12 → 06-14 | BR-06645/2026 | 0.95 pdf | BTG/Nexus PDF Cenário 1 |
| nexus_2026-06-28_stimulated_1st_round | nexus | 2026-06-26 → 06-28 | BR-08521/2026 | 0.95 pdf | BTG/Nexus PDF Cenário 1 |
| nexus_2026-07-12_stimulated_1st_round | nexus | 2026-07-10 → 07-12 | BR-07981/2026 | 0.95 pdf | BTG/Nexus PDF Cenário 1 |
| realtime_bigdata_2026-07-20_stimulated_1st_round | realtime_bigdata | 2026-07-18 → 07-20 | BR-05864/2026 | 0.95 pdf | RTBD PDF |
| nexus_2026-07-26_stimulated_1st_round | nexus | 2026-07-24 → 07-26 | BR-01489/2026 | 0.95 pdf | BTG/Nexus PDF |
| atlasintel_2026-07-27_stimulated_1st_round | atlasintel | 2026-07-22 → 07-27 | BR-08602/2026 | 0.96 pdf | Atlas/Bloomberg PDF Cenário 1 |

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction (e.g. 0.022 = ±2.2pp).
- `fieldwork_mid` = calendar midpoint (`start + (end-start)//2 days`).
- Residuals: `branco_nulo`, `ns_nr`, `outros` when source publishes those buckets.
- Atlas: Cenário 1 Lula slate preferred; Jan uses **Cenário com Flávio** (comparable principal; ampliado+Tarcísio not dual-entered).
- Nexus: Cenário 1 perfil TOTAL preferred; integer pp as published (institute notes 99–101% rounding).
- Futura: Gazeta **first** stimulated scenario per prior cohort pattern; mid-May uses primary PDF Cenário 1.
- Ideia early-May: primary Meio/Ideia PDF stimulated Flávio slate (p.32).
- RTBD Jul: PDF primary; minor candidates summed as `outros` exactly as published.
- Old-site `polls.json` / BBC used **only as URL leads** — every cell re-fetched from primary PDF or named press.

## Previously blocked — now solved this pass

| Item | Resolution |
|------|------------|
| Atlas Jan–Mar / Jul (+ May) | Primary Atlas/Bloomberg PDFs (Cenarium / Poder360 / BNC) |
| Futura Jan–Jun (both May waves) | Gazeta tables + mid-May Futura/Apex PDF |
| Nexus Mar–Jul (7 rounds) | Primary BTG/Nexus PDFs on Poder360 CDN |
| Ideia early-May (1–5 May) | Primary Meio/Ideia PDF |
| RTBD Mar / early-May / Jul | Gazeta Mar+May; Jul primary PDF |

## Exclusions / honest gaps (still blocked)

| Item | Reason |
|------|--------|
| Indexa Jun (BR-08944/2026) | Free press still lacks extractable **1º-turno** residual split (2º-turno residuals only) — would invent ns/branco for 1T |
| Ipsos-Ipec 2026 national stimulated | Still no verified 2026 fieldwork national stimulated primary |
| RTBD late-May (29–30 May) lead | No verified primary table completed this pass |
| Early Nexus Aug weekly gaps already denser from prior cohorts | Out of this gap list |
| Pure 2º turno / runoff | Out of scope |
| Wikipedia / BBC aggregator alone | Discovery only — never sole witness |
| `site/data/chart.json` | **Not fabricated.** Lead Option B must re-export |

## Remaining coverage gaps (honest)

- Indexa Jun still missing 1T residuals.
- Ipsos-Ipec 2026 series still missing.
- RTBD late-May wave still soft.
- Some early GERP / Alfa / Vox lead-list waves still thin vs aggregator leads (not in this priority list).
- Total **94** verified stimulated national 1º turno.

## Validation

```bash
bin/pebr validate
```

## Files touched

```
data/national/polls/*.json                 (+23)
data/national/witnesses/*.json             (+23)
data/national/INTAKE_COHORT_006.md
site/data/canonical-points.json            (refresh all 94)
config/candidate_aliases.yml               (add tarcisio_de_freitas, ciro_gomes)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
