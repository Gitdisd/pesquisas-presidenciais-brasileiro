# Intake Cohort 2T-003 — deferred earlier Datafolha/Quaest stimulated 2º waves (PEBR 2026)

**Date:** 2026-09-26 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-2t-003`  
**Scope:** national geography · scenario family `stimulated_2nd_round_*`  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes).

## Summary

| Metric | Value |
|--------|-------|
| New 2º-turno polls | **30** (12 Datafolha + 18 Quaest) |
| New witnesses | **9** (one G1/JN article per wave; shared across sibling matchups) |
| 1º-turno polls added | **0** (Ipsos-Ipec hard-stop upheld; no new honest 1º primary) |
| 1º `canonical-points.json` | Expect unchanged count **116** |
| 2º `canonical-points-2nd-round.json` | Expect **73** points (43 prior + 30 new) |
| `site/data/chart.json` / UI | **NOT touched** (Lead-owned) |

## Priority honored

1. Deferred earlier DF/Quaest 2º from 2T-002 blocked list — **this cohort**.
2. Adjacent May/Jun Quaest national 2º with extractable G1 text — partial (capacity).
3. Other institutes’ national 2º — still blocked (see below).

## New polls (fieldwork_end · institute · matchup)

### Datafolha — fieldwork 2026-07-22 → 2026-07-24 · N=2004 · moe=0.02 · TSE BR-01166/2026

Primary: [G1 2026-07-24](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/07/24/datafolha-2o-turno-lula-tem-48percent-e-flavio-bolsonaro-43percent.ghtml)  
Witness: `w_datafolha_2026-07-24_g1_2t` · **3 scenarios** (no Renan/Cury)

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.43 · lula 0.48 | bn 0.09 · ns 0.01 |
| `…_lula_vs_ronaldo_caiado` | lula 0.47 · ronaldo_caiado 0.40 | bn 0.11 · ns 0.02 |
| `…_lula_vs_romeu_zema` | lula 0.48 · romeu_zema 0.40 | bn 0.10 · ns 0.02 |

### Datafolha — fieldwork 2026-06-17 → 2026-06-19 · N=2004 · moe=0.02 · TSE BR-09956/2026

Primary: [G1 2026-06-20](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/06/20/datafolha-2o-turno-lula-tem-47-e-flavio-bolsonaro-43.ghtml)  
Witness: `w_datafolha_2026-06-19_g1_2t` · **3 scenarios**

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.43 · lula 0.47 | bn 0.08 · ns 0.01 |
| `…_lula_vs_ronaldo_caiado` | lula 0.47 · ronaldo_caiado 0.41 | bn 0.10 · ns 0.02 |
| `…_lula_vs_romeu_zema` | lula 0.48 · romeu_zema 0.39 | bn 0.11 · ns 0.02 |

### Datafolha — fieldwork 2026-05-20 → 2026-05-22 · N=2004 · moe=0.02 · TSE BR-07489/2026 (sibling 1º)

Primary: [G1 2026-05-22](https://g1.globo.com/politica/eleicoes/2026/noticia/2026/05/22/datafolha-2o-turno-lula-flavio.ghtml)  
Witness: `w_datafolha_2026-05-22_g1_2t` · **3 scenarios** (Michelle 2º skipped — no alias)

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.43 · lula 0.47 | bn 0.09 · ns 0.02 |
| `…_lula_vs_ronaldo_caiado` | lula 0.48 · ronaldo_caiado 0.39 | bn 0.11 · ns 0.02 |
| `…_lula_vs_romeu_zema` | lula 0.48 · romeu_zema 0.39 | bn 0.11 · ns 0.02 |

### Datafolha — fieldwork 2026-05-12 → 2026-05-13 · N=2004 · moe=0.02 · TSE BR-00290/2026 (sibling 1º)

Primary: [G1 JN 2026-05-16](https://g1.globo.com/jornal-nacional/noticia/2026/05/16/datafolha-2o-turno-lula-e-flavio-tem-45percent-das-intencoes-de-voto.ghtml)  
Witness: `w_datafolha_2026-05-13_jn_2t` · **3 scenarios** from JN **prose** (explicit %), not Arte

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.45 · lula 0.45 | bn 0.09 · ns 0.01 |
| `…_lula_vs_ronaldo_caiado` | lula 0.46 · ronaldo_caiado 0.39 | bn 0.13 · ns 0.02 |
| `…_lula_vs_romeu_zema` | lula 0.46 · romeu_zema 0.40 | bn 0.13 · ns 0.02 |

### Quaest — fieldwork 2026-08-10 → 2026-08-13 · N=2004 · moe=0.02 · TSE BR-06773/2026

Primary: [G1 2026-08-14](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/08/14/quaest-presidente-2o-turno-14-agosto.ghtml)  
Witness: `w_quaest_2026-08-13_g1_2t` · **4 scenarios** (no Cury)

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.40 · lula 0.43 | bn 0.13 · ns 0.04 |
| `…_lula_vs_ronaldo_caiado` | lula 0.44 · ronaldo_caiado 0.37 | bn 0.14 · ns 0.05 |
| `…_lula_vs_renan_santos` | lula 0.44 · renan_santos 0.36 | bn 0.16 · ns 0.04 |
| `…_lula_vs_romeu_zema` | lula 0.45 · romeu_zema 0.34 | bn 0.16 · ns 0.05 |

### Quaest — fieldwork 2026-07-31 → 2026-08-03 · N=2004 · moe=0.02 · TSE BR-06591/2026

Primary: [G1 2026-08-05](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/08/05/quaest-2o-turno-lula-flavio-bolsonaro-agosto-2026.ghtml)  
Witness: `w_quaest_2026-08-03_g1_2t` · **4 scenarios**

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.39 · lula 0.44 | bn 0.13 · ns 0.04 |
| `…_lula_vs_romeu_zema` | lula 0.46 · romeu_zema 0.34 | bn 0.16 · ns 0.04 |
| `…_lula_vs_ronaldo_caiado` | lula 0.45 · ronaldo_caiado 0.37 | bn 0.14 · ns 0.04 |
| `…_lula_vs_renan_santos` | lula 0.45 · renan_santos 0.35 | bn 0.16 · ns 0.04 |

### Quaest — fieldwork 2026-07-10 → 2026-07-13 · N=2004 · moe=0.02 · TSE BR-07181/2026

Primary: [G1 2026-07-15](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/07/15/quaest-segundo-turno.ghtml)  
Witness: `w_quaest_2026-07-13_g1_2t` · **4 scenarios**

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.37 · lula 0.45 | bn 0.14 · ns 0.04 |
| `…_lula_vs_ronaldo_caiado` | lula 0.45 · ronaldo_caiado 0.36 | bn 0.15 · ns 0.04 |
| `…_lula_vs_romeu_zema` | lula 0.45 · romeu_zema 0.35 | bn 0.16 · ns 0.04 |
| `…_lula_vs_renan_santos` | lula 0.45 · renan_santos 0.33 | bn 0.18 · ns 0.04 |

### Quaest — fieldwork 2026-06-05 → 2026-06-08 · N=2004 · moe=0.02 · TSE BR-07661/2026 · **PARTIAL**

Primary: [G1 2026-06-10](https://g1.globo.com/politica/eleicoes/2026/noticia/2026/06/10/quaest-2-turno-junho.ghtml)  
Witness: `w_quaest_2026-06-08_g1_2t` · **2 scenarios entered** (Flávio/Caiado blocked — see below)

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_lula_vs_renan_santos` | lula 0.45 · renan_santos 0.31 | bn 0.20 · ns 0.04 |
| `…_lula_vs_romeu_zema` | lula 0.45 · romeu_zema 0.35 | bn 0.17 · ns 0.03 |

### Quaest — fieldwork 2026-05-08 → 2026-05-11 · N=2004 · moe=0.02 · TSE BR-03598/2026

Primary: [G1 2026-05-13](https://g1.globo.com/politica/eleicoes/2026/noticia/2026/05/13/quaest-2o-turno-lula-tem-42percent-e-flavio-bolsonaro-41percent.ghtml)  
Witness: `w_quaest_2026-05-11_g1_2t` · **4 scenarios**

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.41 · lula 0.42 | bn 0.14 · ns 0.03 |
| `…_lula_vs_romeu_zema` | lula 0.44 · romeu_zema 0.37 | bn 0.15 · ns 0.04 |
| `…_lula_vs_ronaldo_caiado` | lula 0.44 · ronaldo_caiado 0.35 | bn 0.17 · ns 0.04 |
| `…_lula_vs_renan_santos` | lula 0.45 · renan_santos 0.28 | bn 0.22 · ns 0.05 |

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction.
- Datafolha “Em branco/nulo/nenhum” → `branco_nulo`; “Não sabe(m)/não respondeu” → `ns_nr`.
- Quaest “Branco/nulo/não vai votar” → `branco_nulo`; “Indecisos” → `ns_nr`.
- Same fieldwork / TSE as existing 1º polls — **separate** poll_ids (scenario in identity).
- Scenario keys unchanged vs 2T-001/002 (same five pairwise ids). **No new Option B matchup keys.**
- Michelle Bolsonaro 2º (Datafolha May 22) present in source → **not entered** (no `michelle_bolsonaro` in `config/candidate_aliases.yml`).

## Blocked / deferred (explicit)

| Item | Reason |
|------|--------|
| Ipsos-Ipec **2026 calendar** national stimulated **1º** | Hard-stop (cohort 008): no verified national stimulated primary with 2026 fieldwork. |
| Quaest Jun 08 · Flávio×Lula | Candidate % in prose (44–38) but residuals Arte-only — skip (no invent residuals). |
| Quaest Jun 08 · Caiado×Lula | UL prints Caiado 44% → row sum ≈1.09; Jul 15 retrospective says Jun Caiado was 35% — inconsistent primary; skipped. |
| Datafolha May 22 · Michelle×Lula | Real table in G1; skipped — no candidate alias / Option B key yet. Report for Lead if alias added. |
| JN May 22 Datafolha 2º | Redundant of G1 politica May 22 (entered); JN video/prose twin not dual-entered. |
| AtlasIntel / PoderData / Nexus / Futura / Ideia / GERP / CNT-MDA / RTBD national 2º | No extractable national stimulated 2º primary dual-entered this pass. |
| State-only 2º | Wrong geography — national tree only. |
| Image-only / Arte-only matchups without list or prose residuals | Skip rule upheld. |
| Historical cycles &lt; 2026 | Schema minimum 2026. |
| `site/data/chart.json` 2º series | Lead must wire / re-export `canonical-points-2nd-round.json`. |

## 1º turno careful expansion

**0 new 1º polls.** Ipsos-Ipec hard-stop and image-PDF holds honored.

## Validation

```bash
bin/pebr validate && bin/pebr normalize && bin/pebr assemble
```

## Files touched

```
data/national/polls/*_stimulated_2nd_round_*.json   (+30)
data/national/witnesses/w_datafolha_2026-07-24_g1_2t.json
data/national/witnesses/w_datafolha_2026-06-19_g1_2t.json
data/national/witnesses/w_datafolha_2026-05-22_g1_2t.json
data/national/witnesses/w_datafolha_2026-05-13_jn_2t.json
data/national/witnesses/w_quaest_2026-08-13_g1_2t.json
data/national/witnesses/w_quaest_2026-08-03_g1_2t.json
data/national/witnesses/w_quaest_2026-07-13_g1_2t.json
data/national/witnesses/w_quaest_2026-06-08_g1_2t.json
data/national/witnesses/w_quaest_2026-05-11_g1_2t.json
data/national/INTAKE_COHORT_2T_003.md
site/data/canonical-points.json                   (regenerated; 1º-only — expect 116)
site/data/canonical-points-2nd-round.json         (regenerated; expect 73)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`, `site/data/chart-2nd-round.json`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
