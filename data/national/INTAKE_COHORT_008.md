# Intake Cohort 008 — final mop-up national stimulated 1º turno (PEBR 2026)

**Date:** 2026-09-26 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-008`  
**Scope:** national geography · scenario `stimulated_1st_round` only  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes). **BBC-only sole witnesses disallowed.**

## Summary

| Metric | Value |
|--------|-------|
| Polls after (001–008) | **116** |
| New polls this cohort | **2** |
| New witnesses this cohort | **2** |
| Prior cohorts | 114 polls unchanged |
| Optional Lead Option B ingest | `site/data/canonical-points.json` refreshed for **all 116** verified polls |
| `site/data/chart.json` | **NOT modified / NOT invented by this cohort** (Lead/Stats-owned Option B re-export) |

## New polls (fieldwork_end order)

| poll_id | institute | fieldwork | TSE | conf | primary witness |
|---------|-----------|-----------|-----|------|-----------------|
| gerp_2026-02-02_stimulated_1st_round | gerp | 2026-01-28 → 02-02 | BR-04519/2026 | 0.88 press | Gazeta fevereiro-2026 (estimulado Flávio slate) |
| gerp_2026-03-25_stimulated_1st_round | gerp | 2026-03-20 → 03-25 | BR-02846/2026 | 0.88 press | Gazeta março-2026 (1º cenário Flávio) |

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction.
- `fieldwork_mid` = calendar midpoint (`start + (end-start)//2 days`).
- GERP: Gazeta **first** Flávio stimulated slate; `Nenhum deles`→`branco_nulo`, `Não sabe`→`ns_nr`.
- Old-site BBC windows (Jan 26–30 / Mar 21–27) corrected to Gazeta primary fieldwork (28/01–02/02 / 20–25/03). Same waves; BBC dates were soft/approximate.
- Jan published sum ~98; Mar printed sum ~101 — left as-found (prior GERP cohorts tolerate 0.98–1.02).

## Lead-list coverage (old-site `polls.json` estimulada 1º turno = 97)

| Status | Count | Notes |
|--------|-------|-------|
| Already covered pre-008 (deduped by institute + overlapping fieldwork) | 95 | Includes all AtlasIntel “missing” leads — PEBR uses `atlasintel_*` ids (false gap from alias mismatch) |
| Added this cohort | 2 | GERP Jan/early-Feb + Mar |
| Still uncovered estimulada leads with primary | **0** | — |

## Hard stops / honest ceiling (post-008)

| Item | Reason |
|------|--------|
| Ipsos-Ipec **2026 calendar** national stimulated | No verified national stimulated primary with 2026 fieldwork. Only Dec **2025** national (Ipsos PDF/Estadão) and 2026 **state** (Ceará) releases found. Not on old-site lead list. **Hard stop.** |
| BBC aggregator alone | Discovery only — never sole witness (rule upheld; both adds use Gazeta named press) |
| Pure 2º turno / runoff | Out of scope |
| `site/data/chart.json` | **Not fabricated.** Lead Option B must re-export |
| Further manual scrape of old-site estimulada | **Honest ceiling reached** for primary/named-press national stimulated 1º turno vs lead list. Diminishing returns — shift to stabilize intake + GitHub Actions refresh / discover path |

## Validation

```bash
bin/pebr validate
```

Passed: 238 file(s) (polls + witnesses + fixtures).

## Files touched

```
data/national/polls/gerp_2026-02-02_stimulated_1st_round.json
data/national/polls/gerp_2026-03-25_stimulated_1st_round.json
data/national/witnesses/w_gerp_2026-02-02_gazeta.json
data/national/witnesses/w_gerp_2026-03-25_gazeta.json
data/national/INTAKE_COHORT_008.md
site/data/canonical-points.json            (refresh all 116)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`, `config/candidate_aliases.yml`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
