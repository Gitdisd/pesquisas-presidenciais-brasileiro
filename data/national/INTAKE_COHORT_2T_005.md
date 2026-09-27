# Intake Cohort 2T-005 — earlier other-institute + DF mop national stimulated 2º (PEBR 2026)

**Date:** 2026-09-26 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-2t-005`  
**Scope:** national geography · scenario family `stimulated_2nd_round_*`  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes).

## Summary

| Metric | Value |
|--------|-------|
| New 2º-turno polls | **34** |
| New witnesses | **10** |
| Waves / mop | Atlas Jun/Jul/Aug/Sep-16; PoderData Sep-02/Sep-09; Nexus Sep-13 + Sep-20 mop; Datafolha Mar/Apr leftovers |
| 1º-turno polls added | **0** |
| 1º `canonical-points.json` | Expect unchanged **116** |
| 2º `canonical-points-2nd-round.json` | Expect **132** (98 prior + 34) |
| `site/data/chart.json` / UI / `chart-2nd-round.json` | **NOT touched** (Lead-owned) |

## Priority honored

1. Earlier waves of AtlasIntel / PoderData / Nexus (and DF leftovers) with extractable primary — **this cohort**.
2. Michelle×Lula / `michelle_bolsonaro` — **permanently out of scope**.
3. Quaest Jun 08 Flávio Arte residual / Caiado inconsistency — **still blocked**.
4. Meio/Ideia Sep Exame — **still blocked** (no new extractable primary).
5. No inventing residuals for Atlas Sep-16 non-Flávio matchups.

## New polls (fieldwork_end · institute · matchups)

### Datafolha — 2026-03-03 → 2026-03-05 · N=2004 · moe=0.02 · TSE null (sibling)

Primary: [G1](https://g1.globo.com/politica/eleicoes/2026/noticia/2026/03/07/datafolha-lula-tem-46percent-e-flavio-bolsonaro-43percent-das-intencoes-de-voto-no-2o-turno-diz-pesquisa.ghtml)  
Witness: `w_datafolha_2026-03-05_g1_2t` · **2 scenarios** (Tarcísio/Ratinho/Leite/Haddad skipped — no alias)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.43 · lula 0.46 | bn 0.10 · ns 0.01 |
| `lula_vs_ronaldo_caiado` | lula 0.46 · caiado 0.36 | bn 0.16 · ns 0.02 |

### Datafolha — 2026-04-07 → 2026-04-09 · N=2004 · moe=0.02 · TSE BR-03770/2026

Primary: [G1](https://g1.globo.com/politica/eleicoes/2026/noticia/2026/04/11/datafolha-lula-empata-com-flavio-bolsonaro-caiado-e-zema-no-2o-turno-para-presidente.ghtml)  
Witness: `w_datafolha_2026-04-09_g1_2t` · **3 scenarios**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.46 · lula 0.45 | bn 0.08 · ns 0.01 |
| `lula_vs_ronaldo_caiado` | lula 0.45 · caiado 0.42 | bn 0.11 · ns 0.02 |
| `lula_vs_romeu_zema` | lula 0.45 · zema 0.42 | bn 0.11 · ns 0.02 |

### AtlasIntel — 2026-06-26 → 2026-06-30 · N=4999 · moe=0.01 · TSE BR-04582/2026

Primary: [Blog Radar de Notícias](https://blogradardenoticias.com.br/pesquisa-atlas-bloomberg-divulga-mais-uma-pesquisa-e-diz-que-lula-tem-488-dos-votos-no-2o-turno-flavio-423/)  
Witness: `w_atlasintel_2026-06-30_blog_2t` · **4 scenarios** (Michelle/Jair skipped)  
Residual: combined → `branco_nulo`

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.423 · lula 0.488 | bn 0.089 |
| `lula_vs_ronaldo_caiado` | lula 0.48 · caiado 0.39 | bn 0.131 |
| `lula_vs_romeu_zema` | lula 0.482 · zema 0.385 | bn 0.133 |
| `lula_vs_renan_santos` | lula 0.492 · renan 0.289 | bn 0.219 |

### AtlasIntel — 2026-07-22 → 2026-07-27 · N=5021 · moe=0.01 · TSE BR-08602/2026

Primary: [180graus](https://180graus.com/analise-politica/atlasintel-lula-tem-492-contra-429-de-flavio-bolsonaro-no-2o-turno/) (residuals); [Congresso em Foco](https://www.congressoemfoco.com.br/noticia/120849/atlasintel-lula-abre-9-pontos-sobre-flavio-e-vence-todos-no-2-turno) corroborates candidates  
Witness: `w_atlasintel_2026-07-27_180graus_2t` · **4 scenarios** (Michelle/Jair skipped)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.429 · lula 0.492 | bn 0.079 |
| `lula_vs_ronaldo_caiado` | lula 0.482 · caiado 0.389 | bn 0.129 |
| `lula_vs_romeu_zema` | lula 0.486 · zema 0.396 | bn 0.118 |
| `lula_vs_renan_santos` | lula 0.476 · renan 0.302 | bn 0.222 |

### AtlasIntel — 2026-08-25 → 2026-08-30 · N=5014 · moe=0.01 · TSE BR-07972/2026

Primary: [TMC](https://tmc.com.br/politica/atlas-bloomberg-lula-lidera-todos-os-cenarios-de-2o-turno-e-abre-vantagem-de-45-pontos-sobre-flavio-bolsonaro/)  
Witness: `w_atlasintel_2026-08-30_tmc_2t` · **4 scenarios** (Cury not listed with residuals)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.426 · lula 0.471 | bn 0.103 |
| `lula_vs_ronaldo_caiado` | lula 0.466 · caiado 0.41 | bn 0.123 |
| `lula_vs_romeu_zema` | lula 0.47 · zema 0.407 | bn 0.123 |
| `lula_vs_renan_santos` | lula 0.475 · renan 0.26 | bn 0.266 |

### AtlasIntel — 2026-09-11 → 2026-09-16 · N=5018 · moe=0.01 · TSE BR-06221/2026

Primary: [Congresso em Foco](https://www.congressoemfoco.com.br/noticia/122343/atlas-bloomberg-flavio-tem-47-2-e-lula-46-8-no-2-turno)  
Witness: `w_atlasintel_2026-09-16_cef_2t` · **1 scenario** (other four candidate % without residuals — **held**)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.472 · lula 0.468 | bn 0.06 |

### PoderData — 2026-08-30 → 2026-09-02 · N=3000 · moe=0.018 · TSE BR-07561/2026

Primary: [CNN Brasil](https://www.cnnbrasil.com.br/eleicoes/poderdata-aya-flavio-tem-45-contra-44-de-lula-no-2o-turno/); PDF corroboration  
Witness: `w_poderdata_2026-09-02_cnn_2t` · **4 scenarios**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.45 · lula 0.44 | bn 0.08 · ns 0.03 |
| `lula_vs_romeu_zema` | lula 0.44 · zema 0.42 | bn 0.12 · ns 0.02 |
| `lula_vs_ronaldo_caiado` | lula 0.44 · caiado 0.42 | bn 0.11 · ns 0.02 |
| `lula_vs_renan_santos` | lula 0.44 · renan 0.39 | bn 0.15 · ns 0.03 |

### PoderData — 2026-09-06 → 2026-09-09 · N=3000 · moe=0.018 · TSE BR-04914/2026

Primary: [institute PDF](https://static.poder360.com.br/uploads/2026/09/Relatorio-PoderData-Eleitoral-9set26-1.pdf)  
Witness: `w_poderdata_2026-09-09_pdf_2t` · **3 scenarios** (incl. Option B Cury×Flávio)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.47 · lula 0.45 | bn 0.06 · ns 0.02 |
| `augusto_cury_vs_lula` | cury 0.44 · lula 0.43 | bn 0.11 · ns 0.02 |
| `augusto_cury_vs_flavio_bolsonaro` | cury 0.36 · flavio 0.43 | bn 0.20 · ns 0.02 |

### Nexus — 2026-09-11 → 2026-09-13 · N=2003 · moe=0.02 · TSE BR-04076/2026 (no sibling 1º yet)

Primary: [Estadão](https://www.estadao.com.br/politica/eleicoes/btgnexus-em-cenario-de-2-turno-lula-tem-47-das-intencoes-de-voto-contra-46-de-flavio-bolsonaro/)  
Witness: `w_nexus_2026-09-13_estadao_2t` · **5 scenarios**  
Zema/Renan: residual stated as branco/nulo/nenhum only → `branco_nulo`; sum as-found 0.98/0.99

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.46 · lula 0.47 | bn 0.06 · ns 0.01 |
| `augusto_cury_vs_lula` | cury 0.42 · lula 0.45 | bn 0.11 · ns 0.02 |
| `lula_vs_ronaldo_caiado` | lula 0.47 · caiado 0.41 | bn 0.11 · ns 0.01 |
| `lula_vs_romeu_zema` | lula 0.49 · zema 0.38 | bn 0.11 |
| `lula_vs_renan_santos` | lula 0.48 · renan 0.37 | bn 0.14 |

### Nexus mop — 2026-09-18 → 2026-09-20 · N=2006 · moe=0.02 · TSE BR-00485/2026

Primary: [Gazeta Brasil](https://gazetabrasil.com.br/brasil/2026/09/21/confira-os-numeros-da-nova-pesquisa-btg-nexus-para-presidente-desta-segunda-feira-21/)  
Witness: `w_nexus_2026-09-20_gazeta_brasil_2t` · **4 scenarios** (Flávio×Lula already in 2T-004 via Correio)

| scenario | results | residuals |
|----------|---------|-----------|
| `lula_vs_ronaldo_caiado` | lula 0.45 · caiado 0.45 | bn 0.08 · ns 0.02 |
| `augusto_cury_vs_lula` | cury 0.43 · lula 0.44 | bn 0.11 · ns 0.02 |
| `lula_vs_romeu_zema` | lula 0.47 · zema 0.41 | bn 0.09 · ns 0.02 |
| `lula_vs_renan_santos` | lula 0.47 · renan 0.39 | bn 0.12 · ns 0.02 |

## New scenario keys (Option B)

None new this cohort. Reused prior keys including `stimulated_2nd_round_augusto_cury_vs_flavio_bolsonaro` (PoderData Sep-09 second entry).

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction.
- Scenario ids lex-sorted candidate pair.
- Atlas residual lump (bn+ns) → entire residual to `branco_nulo` when primary does not split.
- Datafolha Mar TSE left **null** (sibling 1º also null; not invented).

## Blocked / deferred (explicit)

| Item | Reason |
|------|--------|
| Michelle×Lula (any institute) | **Permanently out of scope** |
| Quaest Jun 08 · Flávio×Lula | Arte-only residuals — hold |
| Quaest Jun 08 · Caiado×Lula | Primary inconsistency — hold |
| Meio/Ideia national 2º (Exame) | Non-extractable body; no new primary this pass |
| Atlas Sep-16 · Zema/Caiado/Cury/Renan | Candidate % without residuals — hold (no invent) |
| Atlas earlier Jan–May / Apr waves | Not dual-entered this pass (capacity / primary hunt incomplete) |
| PoderData May–Aug earlier waves | PDFs/HTML not fully dual-entered this pass beyond Sep-02/09 |
| RTBD / Futura / GERP / CNT-MDA earlier waves | Searched; no clean extractable multi-matchup primary dual-entered this pass beyond latest (2T-004) |
| Ipsos-Ipec 2026 national stimulated 1º | Hard-stop upheld |
| State-only 2º | Wrong geography |
| Image-only / Arte-only without prose residuals | Skip rule upheld |
| `site/data/chart-2nd-round.json` | Lead must re-export from `canonical-points-2nd-round.json` (`--multi-scenario`) |

## URLs tried / notes (still blocked or partial)

- Atlas Sep-16 CEF: Zema/Caiado/Cury/Renan listed without residual % → held.
- Exame Meio/Ideia Sep: still non-extractable (2T-004 hold).
- Futura mid-Sep (11–15) cited in aggregator roundups without full residual table dual-entered.
- GERP / CNT / RTBD: only latest wave (2T-004) had extractable multi-scenario primary of quality enough this pass.
- Atlas Jul institute PDF on Poder360 CDN: chart-image 2º pages; prose primary preferred (180graus).

## Validation

```bash
bin/pebr validate && bin/pebr normalize && bin/pebr assemble
```

## Files touched

```
data/national/polls/datafolha_2026-03-05_stimulated_2nd_round_*.json          (+2)
data/national/polls/datafolha_2026-04-09_stimulated_2nd_round_*.json          (+3)
data/national/polls/atlasintel_2026-06-30_stimulated_2nd_round_*.json         (+4)
data/national/polls/atlasintel_2026-07-27_stimulated_2nd_round_*.json         (+4)
data/national/polls/atlasintel_2026-08-30_stimulated_2nd_round_*.json         (+4)
data/national/polls/atlasintel_2026-09-16_stimulated_2nd_round_*.json         (+1)
data/national/polls/poderdata_2026-09-02_stimulated_2nd_round_*.json          (+4)
data/national/polls/poderdata_2026-09-09_stimulated_2nd_round_*.json          (+3)
data/national/polls/nexus_2026-09-13_stimulated_2nd_round_*.json              (+5)
data/national/polls/nexus_2026-09-20_stimulated_2nd_round_*.json              (+4 mop)
data/national/witnesses/w_*_2t.json                                          (+10)
data/national/INTAKE_COHORT_2T_005.md
site/data/canonical-points.json                   (regenerated; 1º-only — expect 116)
site/data/canonical-points-2nd-round.json         (regenerated; expect 132)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`, `site/data/chart-2nd-round.json`, `config/candidate_aliases.yml`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
