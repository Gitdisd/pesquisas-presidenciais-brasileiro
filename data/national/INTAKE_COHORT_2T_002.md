# Intake Cohort 2T-002 — earlier Sep 2026 Datafolha/Quaest stimulated 2º waves (PEBR 2026)

**Date:** 2026-09-26 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-2t-002`  
**Scope:** national geography · scenario family `stimulated_2nd_round_*`  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes).

## Summary

| Metric | Value |
|--------|-------|
| New 2º-turno polls | **33** (18 Datafolha + 15 Quaest) |
| New witnesses | **7** (one G1 article per wave; shared across sibling matchups) |
| 1º-turno polls added | **0** (Ipsos-Ipec hard-stop upheld; no new honest 1º primary this pass) |
| 1º `canonical-points.json` | Expect unchanged count **116** (assemble filters 1º only) |
| 2º `canonical-points-2nd-round.json` | **43** points (10 prior + 33 new) |
| `site/data/chart.json` / UI | **NOT touched** (Lead-owned) |

## Priority honored

1. Earlier 2026 2º waves from institutes with existing G1/primary pattern (Datafolha, Quaest) — **this cohort**.
2. Other institutes’ national 2º tables — still blocked (see below); not dual-entered without extractable primary.

## New polls (fieldwork_end · institute · matchup)

### Datafolha — fieldwork 2026-08-18 → 2026-08-20 · N=2058 · moe=0.02 · TSE BR-04496/2026

Primary: [G1 2026-08-21](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/08/21/datafolha-segundo-turno-21-agosto.ghtml)  
Witness: `w_datafolha_2026-08-20_g1_2t`  
**No Cury matchup** in this wave (4 scenarios). “Não sabe” on Flávio matchup → `ns_nr`.

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.43 · lula 0.47 | bn 0.09 · ns 0.02 (sum 1.01) |
| `…_lula_vs_ronaldo_caiado` | lula 0.47 · ronaldo_caiado 0.40 | bn 0.11 · ns 0.03 (sum 1.01) |
| `…_lula_vs_romeu_zema` | lula 0.48 · romeu_zema 0.38 | bn 0.12 · ns 0.02 |
| `…_lula_vs_renan_santos` | lula 0.47 · renan_santos 0.37 | bn 0.14 · ns 0.02 |

### Datafolha — fieldwork 2026-09-01 → 2026-09-03 · N=2002 · moe=0.02 · TSE BR-03669/2026

Primary: [G1 2026-09-03](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/09/03/datafolha-2o-turno-presidente-3-setembro.ghtml)  
Witness: `w_datafolha_2026-09-03_g1_2t`  
Note: 2º article text says fieldwork 1º–2 Sep; sibling 1º G1 (same TSE) says 1º–3 Sep — wave identity uses sibling 1º dates. **No Cury matchup** in this wave (4 scenarios).

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.44 · lula 0.46 | bn 0.09 · ns 0.02 (sum 1.01) |
| `…_lula_vs_ronaldo_caiado` | lula 0.46 · ronaldo_caiado 0.41 | bn 0.11 · ns 0.02 |
| `…_lula_vs_romeu_zema` | lula 0.48 · romeu_zema 0.39 | bn 0.12 · ns 0.02 (sum 1.01) |
| `…_lula_vs_renan_santos` | lula 0.47 · renan_santos 0.38 | bn 0.13 · ns 0.02 |

### Datafolha — fieldwork 2026-09-08 → 2026-09-10 · N=2002 · moe=0.02 · TSE BR-01833/2026

Primary: [G1 2026-09-11](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/09/11/datafolha-2o-turno-presidente-11-setembro.ghtml)  
Witness: `w_datafolha_2026-09-10_g1_2t`

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.44 · lula 0.46 | bn 0.08 · ns 0.01 (sum 0.99) |
| `…_lula_vs_ronaldo_caiado` | lula 0.46 · ronaldo_caiado 0.41 | bn 0.10 · ns 0.02 (sum 0.99) |
| `…_lula_vs_romeu_zema` | lula 0.48 · romeu_zema 0.39 | bn 0.11 · ns 0.02 |
| `…_lula_vs_renan_santos` | lula 0.48 · renan_santos 0.37 | bn 0.12 · ns 0.02 (sum 0.99) |
| `…_augusto_cury_vs_lula` | augusto_cury 0.43 · lula 0.45 | bn 0.10 · ns 0.02 |

### Datafolha — fieldwork 2026-09-15 → 2026-09-16 · N=2002 · moe=0.02 · TSE BR-04029/2026

Primary: [G1 2026-09-17](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/09/17/datafolha-segundo-turno-presidente-17-setembro.ghtml)  
Witness: `w_datafolha_2026-09-16_g1_2t`

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.44 · lula 0.46 | bn 0.08 · ns 0.01 (sum 0.99) |
| `…_lula_vs_ronaldo_caiado` | lula 0.46 · ronaldo_caiado 0.42 | bn 0.10 · ns 0.02 |
| `…_lula_vs_romeu_zema` | lula 0.49 · romeu_zema 0.39 | bn 0.11 · ns 0.02 (sum 1.01) |
| `…_lula_vs_renan_santos` | lula 0.47 · renan_santos 0.38 | bn 0.13 · ns 0.02 |
| `…_augusto_cury_vs_lula` | augusto_cury 0.44 · lula 0.44 | bn 0.10 · ns 0.01 (sum 0.99) |

### Quaest — fieldwork 2026-08-30 → 2026-09-01 · N=2004 · moe=0.02 · TSE BR-07065/2026

Primary: [G1 2026-09-02](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/09/02/quaest-2-turno-setembro.ghtml)  
Witness: `w_quaest_2026-09-01_g1_2t`  
First Quaest wave with **Cury** 2º scenario in this series.

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.41 · lula 0.42 | bn 0.13 · ns 0.04 |
| `…_lula_vs_ronaldo_caiado` | lula 0.42 · ronaldo_caiado 0.37 | bn 0.17 · ns 0.04 |
| `…_augusto_cury_vs_lula` | augusto_cury 0.34 · lula 0.40 | bn 0.21 · ns 0.05 |
| `…_lula_vs_renan_santos` | lula 0.43 · renan_santos 0.36 | bn 0.17 · ns 0.04 |
| `…_lula_vs_romeu_zema` | lula 0.44 · romeu_zema 0.33 | bn 0.19 · ns 0.04 |

### Quaest — fieldwork 2026-09-03 → 2026-09-06 · N=2004 · moe=0.02 · TSE BR-01720/2026

Primary: [G1 2026-09-07](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/09/07/quaest-2-turno-7-de-setembro.ghtml)  
Witness: `w_quaest_2026-09-06_g1_2t`

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.41 · lula 0.41 | bn 0.13 · ns 0.05 |
| `…_lula_vs_ronaldo_caiado` | lula 0.41 · ronaldo_caiado 0.38 | bn 0.17 · ns 0.04 |
| `…_augusto_cury_vs_lula` | augusto_cury 0.35 · lula 0.39 | bn 0.21 · ns 0.05 |
| `…_lula_vs_renan_santos` | lula 0.42 · renan_santos 0.37 | bn 0.17 · ns 0.04 |
| `…_lula_vs_romeu_zema` | lula 0.44 · romeu_zema 0.33 | bn 0.19 · ns 0.04 |

### Quaest — fieldwork 2026-09-10 → 2026-09-13 · N=2004 · moe=0.02 · TSE BR-03607/2026

Primary: [G1 2026-09-14](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/09/14/quaest-2-turno-setembro.ghtml)  
Witness: `w_quaest_2026-09-13_g1_2t`  
Headline Flávio×Lula from article prose; other four matchups from unordered-list.

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.42 · lula 0.40 | bn 0.13 · ns 0.05 |
| `…_augusto_cury_vs_lula` | augusto_cury 0.36 · lula 0.38 | bn 0.21 · ns 0.05 |
| `…_lula_vs_ronaldo_caiado` | lula 0.41 · ronaldo_caiado 0.39 | bn 0.16 · ns 0.04 |
| `…_lula_vs_renan_santos` | lula 0.41 · renan_santos 0.38 | bn 0.17 · ns 0.04 |
| `…_lula_vs_romeu_zema` | lula 0.45 · romeu_zema 0.33 | bn 0.18 · ns 0.04 |

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction.
- Datafolha “Em branco/nulo/nenhum” → `branco_nulo`; “Indecisos” → `ns_nr`.
- Quaest “Branco/nulo/não vai votar” → `branco_nulo`; “Indecisos” → `ns_nr`.
- Same fieldwork / TSE as existing 1º polls — **separate** poll_ids (scenario in identity).
- Scenario keys unchanged vs 2T-001 (same five pairwise ids). **No new Option B matchup keys.**

## Blocked / deferred (explicit)

| Item | Reason |
|------|--------|
| Ipsos-Ipec **2026 calendar** national stimulated **1º** | Hard-stop (cohort 008): no verified national stimulated primary with 2026 fieldwork. |
| Datafolha 2º waves before Aug 21 2026 (e.g. [G1 2026-07-24](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/07/24/datafolha-2o-turno-lula-tem-48percent-e-flavio-bolsonaro-43percent.ghtml), May/Jun JN pieces) | URLs discovered; not dual-entered this pass — prefer incremental Sep fill first. Next cohort candidates. |
| Quaest 2º waves before Sep 2026 (e.g. [G1 2026-08-14](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/08/14/quaest-presidente-2o-turno-14-agosto.ghtml), [G1 2026-08-05](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/08/05/quaest-2o-turno-lula-flavio-bolsonaro-agosto-2026.ghtml), [G1 2026-07-15](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/07/15/quaest-segundo-turno.ghtml)) | URLs discovered with G1 pattern; deferred to keep cohort honest/small-enough. |
| AtlasIntel / PoderData / Nexus / Futura / Ideia / GERP / CNT-MDA / RTBD national 2º | No extractable national stimulated 2º primary dual-entered this pass (aggregator-only / image-PDF / wrong geography / not fetched). |
| State-only Datafolha 2º (RJ/SP/MG/PE/DF Sep 25) | Wrong geography — national tree only. |
| Image-only / Arte-only matchups without list or prose table text | Skip rule upheld; Sep 14 Quaest headline used prose with explicit % (not image-only). |
| Historical cycles &lt; 2026 | Schema minimum 2026. |
| `site/data/chart.json` 2º series | Lead must wire `canonical-points-2nd-round.json`. |

## 1º turno careful expansion

**0 new 1º polls.** Ipsos-Ipec hard-stop and image-PDF holds honored. No new primary-verified national stimulated 1º cells.

## Validation

```bash
bin/pebr validate && bin/pebr normalize && bin/pebr assemble
```

## Files touched

```
data/national/polls/*_stimulated_2nd_round_*.json   (+33)
data/national/witnesses/w_datafolha_2026-08-20_g1_2t.json
data/national/witnesses/w_datafolha_2026-09-03_g1_2t.json
data/national/witnesses/w_datafolha_2026-09-10_g1_2t.json
data/national/witnesses/w_datafolha_2026-09-16_g1_2t.json
data/national/witnesses/w_quaest_2026-09-01_g1_2t.json
data/national/witnesses/w_quaest_2026-09-06_g1_2t.json
data/national/witnesses/w_quaest_2026-09-13_g1_2t.json
data/national/INTAKE_COHORT_2T_002.md
site/data/canonical-points.json                   (regenerated; 1º-only — expect byte-stable vs prior 116)
site/data/canonical-points-2nd-round.json         (regenerated; 43)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
