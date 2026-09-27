# Intake Cohort 007 — verified mop-up national stimulated 1º turno (PEBR 2026)

**Date:** 2026-09-26 / 2026-09-27 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-007`  
**Scope:** national geography · scenario `stimulated_1st_round` only  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes)

## Summary

| Metric | Value |
|--------|-------|
| Polls after (001–007) | **114** |
| New polls this cohort | **20** |
| New witnesses this cohort | **20** |
| Prior cohorts | 94 polls unchanged |
| Optional Lead Option B ingest | `site/data/canonical-points.json` refreshed for **all 114** verified polls |
| `site/data/chart.json` | **NOT modified / NOT invented by this cohort** (Lead/Stats-owned Option B re-export) |

## New polls (fieldwork_end order)

| poll_id | institute | fieldwork | TSE | conf | primary witness |
|---------|-----------|-----------|-----|------|-----------------|
| gerp_2026-05-12_stimulated_1st_round | gerp | 2026-05-08 → 05-12 | BR-03369/2026 | 0.88 press | Gazeta maio-2026 (1º cenário Flávio) |
| vox_brasil_2026-05-12_stimulated_1st_round | vox_brasil | 2026-05-09 → 05-12 | BR-02423/2026 | 0.96 pdf | Poder360 CDN Vox PDF Cenário 1 |
| gerp_2026-05-22_stimulated_1st_round | gerp | 2026-05-19 → 05-22 | BR-07971/2026 | 0.88 press | Gazeta maio-2026-2 |
| vox_brasil_2026-05-19_stimulated_1st_round | vox_brasil | 2026-05-17 → 05-19 | BR-02416/2026 | 0.96 pdf | Poder360 CDN Vox PDF |
| datafolha_2026-05-22_stimulated_1st_round | datafolha | 2026-05-20 → 05-22 | BR-07489/2026 | 0.90 press | G1 (+ Folha minors) |
| realtime_bigdata_2026-05-30_stimulated_1st_round | realtime_bigdata | 2026-05-29 → 05-30 | BR-05864/2026 | 0.95 pdf | Poder360 CDN RTBD PDF Cenário 01 |
| gerp_2026-06-05_stimulated_1st_round | gerp | 2026-06-02 → 06-05 | BR-01792/2026 | 0.88 press | Gazeta junho-2026 |
| vox_brasil_2026-06-03_stimulated_1st_round | vox_brasil | 2026-06-01 → 06-03 | BR-08016/2026 | 0.93 pdf-series | Aug Vox PDF evolução col 5 JUN |
| alfa_inteligencia_2026-06-10_stimulated_1st_round | alfa_inteligencia | 2026-06-05 → 06-10 | BR-03496/2026 | 0.86 press | ND Mais |
| gerp_2026-06-20_stimulated_1st_round | gerp | 2026-06-15 → 06-20 | BR-09657/2026 | 0.88 press | Gazeta junho-2026-2 |
| indexa_2026-06-20_stimulated_1st_round | indexa | 2026-06-18 → 06-20 | BR-08944/2026 | 0.86 press | Esmael Morais (full 1T residuals) |
| vox_brasil_2026-06-25_stimulated_1st_round | vox_brasil | 2026-06-23 → 06-25 | BR-06630/2026 | 0.93 pdf-series | Aug Vox PDF evolução col 27 JUN |
| gerp_2026-07-07_stimulated_1st_round | gerp | 2026-07-03 → 07-07 | BR-03067/2026 | 0.88 press | Gazeta julho-2026 (1º Flávio slate) |
| gerp_2026-07-17_stimulated_1st_round | gerp | 2026-07-15 → 07-17 | BR-05026/2026 | 0.88 press | Gazeta julho-2026-2 |
| alfa_inteligencia_2026-07-28_stimulated_1st_round | alfa_inteligencia | 2026-07-23 → 07-28 | BR-04488/2026 | 0.88 press | viva.com.br / Broadcast |
| vox_brasil_2026-07-28_stimulated_1st_round | vox_brasil | 2026-07-26 → 07-28 | BR-01084/2026 | 0.93 pdf-series | Aug Vox PDF evolução col 31 JUL |
| gerp_2026-08-10_stimulated_1st_round | gerp | 2026-08-06 → 08-10 | BR-08045/2026 | 0.88 press | Gazeta agosto-2026 |
| nexus_2026-08-09_stimulated_1st_round | nexus | 2026-08-07 → 08-09 | BR-08428/2026 | 0.95 pdf | BTG/Nexus 9ª rodada PDF |
| nexus_2026-08-16_stimulated_1st_round | nexus | 2026-08-14 → 08-16 | BR-03317/2026 | 0.95 pdf | BTG/Nexus 10ª rodada PDF |
| nexus_2026-08-23_stimulated_1st_round | nexus | 2026-08-21 → 08-23 | BR-09028/2026 | 0.95 pdf | BTG/Nexus 11ª rodada PDF (CartaCapital mirror) |

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction.
- `fieldwork_mid` = calendar midpoint (`start + (end-start)//2 days`).
- GERP: Gazeta **first** Flávio stimulated slate; `Nenhum deles`→`branco_nulo`, `Não sabe`→`ns_nr`.
- Vox May: contemporaneous institute PDFs; Jun/Jul: institute Aug PDF **evolução** table (full candidate+residual columns) — not BBC.
- Nexus Aug weeklies: Cenário 1 amostra total from primary PDFs.
- Indexa Jun: Esmael named press supplies 1T residual split (8% bn / 6% ns) that TMC alone lacked.
- Datafolha May-22: distinct from existing May-12–13; Atlas Aug-30 already present (no duplicate).
- RTBD late-May PDF stamps **BR-05864/2026** (same id already on Jul RTBD poll from cohort 006) — noted, not invented.

## Previously blocked — now solved this pass

| Item | Resolution |
|------|------------|
| GERP May–early Aug waves | Gazeta do Povo full stimulated lists |
| Vox May–Jul earlier waves | May: primary PDFs; Jun/Jul: Aug institute series PDF |
| RTBD late-May (29–30) | Primary Poder360 CDN PDF |
| Indexa Jun 1T residuals | Esmael Morais full residual split |
| Alfa Jun + Jul | ND Mais + viva/Broadcast named press |
| Nexus Aug 7–9 / 14–16 / 21–23 | Primary BTG/Nexus PDFs |
| Datafolha May-20–22 | G1+Folha (distinct window) |

## Exclusions / honest gaps (still blocked)

| Item | Reason |
|------|--------|
| GERP Jan / Mar waves | No verified Gazeta/primary full table completed this pass (BBC-only soft) |
| Ipsos-Ipec 2026 national stimulated | Still no verified 2026 national stimulated primary |
| Vox contemporaneous Jun/Jul standalone PDFs | Not located this pass; used Aug series table instead |
| Pure 2º turno / runoff | Out of scope |
| Wikipedia / BBC aggregator alone | Discovery only — never sole witness |
| `site/data/chart.json` | **Not fabricated.** Lead Option B must re-export |
| RTBD May vs Jul shared TSE BR-05864 on both PDFs | Provenance collision left as-found; do not invent a second TSE |

## Remaining coverage gaps (honest)

- GERP Jan/Mar (and any pre-May) still thin vs old-site leads.
- Ipsos-Ipec 2026 series still missing.
- Some old-site ~97 estimulada leads remain BBC-only soft after this mop-up.
- Total **114** verified stimulated national 1º turno.

## Validation

```bash
bin/pebr validate
```

## Files touched

```
data/national/polls/*.json                 (+20)
data/national/witnesses/*.json             (+20)
data/national/INTAKE_COHORT_007.md
site/data/canonical-points.json            (refresh all 114)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`, `config/candidate_aliases.yml`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
