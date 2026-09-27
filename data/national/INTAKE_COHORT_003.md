# Intake Cohort 003 — verified national stimulated 1º turno expansion (PEBR 2026)

**Date:** 2026-09-26 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-003`  
**Scope:** national geography · scenario `stimulated_1st_round` only  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes)

## Summary

| Metric | Value |
|--------|-------|
| Polls after (001+002+003) | **42** |
| New polls this cohort | **6** |
| New witnesses this cohort | **6** |
| Prior cohorts | 36 polls (001: 15 + 002: 21) unchanged |
| Optional Lead Option B ingest | `site/data/canonical-points.json` refreshed for **all 42** verified polls |
| `site/data/chart.json` | **NOT modified / NOT invented by this cohort** (Lead/Stats-owned Option B re-export) |

## New polls (fieldwork_end order)

| poll_id | institute | fieldwork | TSE | conf | primary witness |
|---------|-----------|-----------|-----|------|-----------------|
| datafolha_2026-05-13_stimulated_1st_round | datafolha | 2026-05-12 → 05-13 | BR-00290/2026 | 0.96 pdf | Datafolha institute PDF |
| ideia_2026-05-27_stimulated_1st_round | ideia | 2026-05-23 → 05-27 | BR-02918/2026 | 0.90 press | Gazeta do Povo |
| ideia_2026-07-06_stimulated_1st_round | ideia | 2026-07-03 → 07-06 | BR-05628/2026 | 0.90 press | Gazeta do Povo |
| quaest_2026-08-03_stimulated_1st_round | quaest | 2026-07-31 → 08-03 | BR-06591/2026 | 0.92 press | Gazeta do Povo |
| quaest_2026-08-13_stimulated_1st_round | quaest | 2026-08-10 → 08-13 | BR-06773/2026 | 0.92 press | G1 |
| datafolha_2026-08-20_stimulated_1st_round | datafolha | 2026-08-18 → 08-20 | BR-04496/2026 | 0.92 press | G1 (no-Marçal) |

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction (e.g. 0.02 = ±2pp).
- `fieldwork_mid` = calendar midpoint (`start + (end-start)//2 days`).
- Residuals: `branco_nulo`, `ns_nr`, `outros` when source publishes those buckets.
- Ideia May publishes aggregated **Outros** → `residuals.outros` (not invented candidate splits).
- Datafolha Aug: preferred principal comparable slate **without** Pablo Marçal (Marçal-in published separately — not dual-entered), same rule as cohort 002.
- Datafolha May: principal slate without Ciro; Rebelo/Dias published as below 1% → 0.0.
- Old-site `polls.json` / gitdisd.github.io used **only as URL leads** — every cell re-fetched and re-verified (never copied blindly). BBC aggregator rows still skipped.

## Exclusions / honest gaps (still blocked)

| Item | Reason |
|------|--------|
| Quaest Genial PDF `GENIALQUAESTAGO26.pdf` as sole witness | Chart pages image-only (`pdftotext` yields labels, no % table). Used Gazeta press table instead (dual-consistent with CNN candidate shares). |
| Ideia May/Jul institute PDFs as sole witness | Chart-image heavy; Gazeta numeric tables used as press witnesses. PDFs retained under `_intake_raw/cohort003/` for provenance only. |
| Indexa Sep (BR-03482/2026 teaser) | JOTA still paywalled / incomplete full stimulated table — not invented. |
| CNT/MDA Sep 170ª (BR-06902/2026) | Institute PDF stimulated charts still image-only; no new extractable press table this pass. |
| Ipsos-Ipec 2026 national stimulated | Still no verified 2026 stimulated national primary found. |
| Early Jan–Apr bulk (Futura/GERP/Nexus/Atlas/Quaest Jan–Jun waves) | Old-site/BBC leads only; no cell-by-cell primary re-verification this pass — remain quarantine leads. |
| Datafolha Apr 2026 | Soft-failed / incomplete primary table this pass. |
| Pure 2º turno / runoff | Out of scope. |
| Wikipedia / BBC aggregator alone | Discovery only — never sole witness. |
| `site/data/chart.json` | **Not fabricated.** Lead Option B must re-export from `canonical-points.json` / `data/national/polls`. |

## Remaining coverage gaps (honest)

- Early 2026 (Jan–Apr) still thin: need primary fetches for Quaest/Atlas/Ideia/Futura/Nexus/RTBD/GERP/Paraná Jan waves.
- Ipec national 2026 stimulated series missing.
- Indexa Sep + CNT/MDA Sep still blocked (paywall / image PDF).
- Total **42** verified (≥40 target met). Prefer denser coverage next via primary PDFs/press for Jan–Jul series.

## Validation

```bash
bin/pebr validate
```

## Files touched

```
data/national/polls/*.json                 (+6)
data/national/witnesses/*.json             (+6)
data/national/INTAKE_COHORT_003.md
site/data/canonical-points.json            (refresh all 42)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`, `config/` (no new institutes/aliases required).  
**Not committed:** `_intake_raw/`, `_quarantine/`.
