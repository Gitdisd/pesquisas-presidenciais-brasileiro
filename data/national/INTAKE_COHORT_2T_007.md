# Intake Cohort 2T-007 — RTBD Aug-31 + Futura pre–Sep-04 + GERP Jun/Jul + CNT Apr/Jun/Aug mop (PEBR 2026)

**Date:** 2026-09-26 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-2t-007`  
**Scope:** national geography · scenario family `stimulated_2nd_round_*`  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes).

## Summary

| Metric | Value |
|--------|-------|
| New 2º-turno polls | **27** |
| New witnesses | **8** |
| Waves / mop | RTBD Aug-27–31 (4); Futura Aug-27–Sep-01 (4); GERP Jun-15–20 (3); GERP Jul-03–07 (4); CNT Apr-08–12 (4); CNT Jun-10–14 (4); CNT Aug-05–09 non-Flávio (4) |
| 1º-turno polls added | **0** |
| 1º `canonical-points.json` | Expect unchanged **116** |
| 2º `canonical-points-2nd-round.json` | Expect **193** (166 prior + 27) |
| `site/data/chart.json` / UI / `chart-2nd-round.json` | **NOT touched** (Lead-owned) |

## Priority honored

1. Earlier RTBD / Futura pre–Sep-04 / GERP pre–Aug-25 / CNT Apr/Jun + Aug non-Flávio / Atlas Jan–May only if residuals extractable — **this cohort** (RTBD Aug-31 full; Futura Sep-01; GERP Jun+Jul; CNT Apr/Jun/Aug PDF bars).
2. Michelle×Lula — **permanently out** (GERP Jul Michelle matchup skipped).
3. Quaest Jun 08 Flávio Arte / Caiado — **still blocked**.
4. Meio/Ideia Exame — **still blocked**.
5. Atlas Sep-16 Zema/Caiado/Cury/Renan — **still blocked** (no new residual prose).
6. Atlas Jan–May 2º — **still blocked** (PDF chart-image without labeled residual bars / press often candidate-% only).
7. No inventing; no chart/UI edits.

## New polls (fieldwork_end · institute · matchups)

### Real Time Big Data — 2026-08-27 → 2026-08-31 · N=2000 · moe=0.02 · TSE BR-03490/2026

Primary PDF: [Pesquisa-presidencial-Brasil-Real-Time-Big-Data-1-set-2026.pdf](https://static.poder360.com.br/uploads/2026/09/Pesquisa-presidencial-Brasil-Real-Time-Big-Data-1-set-2026.pdf)  
Witness: `w_rtbd_2026-08-31_pdf_2t` · **4 scenarios** (Pablo Marçal skipped) · EM press corroborates

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.44 · lula 0.44 | bn 0.09 · ns 0.03 |
| `lula_vs_ronaldo_caiado` | lula 0.43 · caiado 0.45 | bn 0.08 · ns 0.04 |
| `lula_vs_romeu_zema` | lula 0.43 · zema 0.40 | bn 0.10 · ns 0.07 |
| `lula_vs_renan_santos` | lula 0.44 · renan 0.37 | bn 0.12 · ns 0.07 |

### Futura / 100% Cidades — 2026-08-27 → 2026-09-01 · N=2000 · moe=0.022 · TSE BR-02793/2026

Primary: [pesquisaFutura-nacional-presidente-3set2026.pdf](https://static.poder360.com.br/uploads/2026/09/pesquisaFutura-nacional-presidente-3set2026.pdf) + [Gazeta](https://www.gazetadopovo.com.br/eleicoes/2026/pesquisa-eleitoral-2026/futura-inteligencia-presidente-setembro-2026/)  
Witnesses: `w_futura_2026-09-01_pdf_2t`, `w_futura_2026-09-01_gazeta_2t` · **4** (pre–Sep-04; distinct from Sep-10 BR-02322)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.452 · lula 0.456 | bn 0.072 · ns 0.02 |
| `lula_vs_ronaldo_caiado` | lula 0.444 · caiado 0.425 | bn 0.109 · ns 0.022 |
| `lula_vs_romeu_zema` | lula 0.467 · zema 0.385 | bn 0.119 · ns 0.03 |
| `lula_vs_renan_santos` | lula 0.466 · renan 0.366 | bn 0.138 · ns 0.03 |

### GERP — 2026-06-15 → 2026-06-20 · N=2000 · moe=0.0219 · TSE BR-09657/2026

Primary: [Gazeta](https://www.gazetadopovo.com.br/eleicoes/2026/pesquisa-eleitoral-2026/gerp-presidente-junho-2026-2/) · `w_gerp_2026-06-20_gazeta_2t` · **3**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.42 · lula 0.40 | bn 0.148 · ns 0.035 |
| `lula_vs_ronaldo_caiado` | lula 0.39 · caiado 0.38 | bn 0.186 · ns 0.045 |
| `lula_vs_romeu_zema` | lula 0.39 · zema 0.36 | bn 0.214 · ns 0.043 |

### GERP — 2026-07-03 → 2026-07-07 · N=2000 · moe=0.022 · TSE BR-03067/2026

Primary: [Gazeta](https://www.gazetadopovo.com.br/eleicoes/2026/pesquisa-eleitoral-2026/gerp-presidente-julho-2026/) · `w_gerp_2026-07-07_gazeta_2t` · **4** (Michelle skipped)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.45 · lula 0.42 | bn 0.09 · ns 0.04 |
| `lula_vs_ronaldo_caiado` | lula 0.40 · caiado 0.36 | bn 0.18 · ns 0.05 |
| `lula_vs_romeu_zema` | lula 0.41 · zema 0.36 | bn 0.18 · ns 0.05 |
| `lula_vs_renan_santos` | lula 0.41 · renan 0.30 | bn 0.24 · ns 0.05 |

### CNT/MDA — 2026-04-08 → 2026-04-12 · N=2002 · moe=0.022 · TSE BR-02847/2026 · rodada 167

Primary PDF: [Pesquisa-CNT-de-Opiniao-167a-rodada-1.pdf](https://static.poder360.com.br/2026/04/Pesquisa-CNT-de-Opiniao-167a-rodada-1.pdf) · `w_cnt_mda_2026-04-12_pdf_2t` · **4** (Aldo Rebelo skipped)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.402 · lula 0.449 | bn 0.113 · ns 0.036 |
| `lula_vs_romeu_zema` | lula 0.452 · zema 0.316 | bn 0.159 · ns 0.073 |
| `lula_vs_ronaldo_caiado` | lula 0.444 · caiado 0.327 | bn 0.152 · ns 0.077 |
| `lula_vs_renan_santos` | lula 0.45 · renan 0.283 | bn 0.177 · ns 0.09 |

### CNT/MDA — 2026-06-10 → 2026-06-14 · N=2002 · moe=0.022 · TSE BR-04256/2026 · rodada 168

Primary PDF: [Pesquisa-CNT-de-Opiniao-168a-rodada.pdf](https://static.poder360.com.br/uploads/2026/06/Pesquisa-CNT-de-Opiniao-168a-rodada.pdf) · `w_cnt_mda_2026-06-14_pdf_2t` · **4**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.368 · lula 0.493 | bn 0.112 · ns 0.027 |
| `lula_vs_romeu_zema` | lula 0.488 · zema 0.316 | bn 0.146 · ns 0.05 |
| `lula_vs_ronaldo_caiado` | lula 0.484 · caiado 0.322 | bn 0.143 · ns 0.051 |
| `lula_vs_renan_santos` | lula 0.493 · renan 0.28 | bn 0.172 · ns 0.056 |

### CNT/MDA — 2026-08-05 → 2026-08-09 · N=2002 · moe=0.022 · TSE BR-06935/2026 · rodada 169 (non-Flávio mop)

Primary PDF: [Relatorio-Pesquisa-CNT-de-Opiniao-R169-AGOSTO26.pdf](https://static.poder360.com.br/uploads/2026/08/Relatorio-Pesquisa-CNT-de-Opiniao-R169-AGOSTO26.pdf) · `w_cnt_mda_2026-08-09_pdf_2t` · **4**  
(Flávio×Lula already entered in 2T-006 from CartaCapital; PDF F×L page matches 48.0 / 39.1 / 10.6 / 2.3)

| scenario | results | residuals |
|----------|---------|-----------|
| `lula_vs_romeu_zema` | lula 0.491 · zema 0.349 | bn 0.118 · ns 0.042 |
| `lula_vs_ronaldo_caiado` | lula 0.479 · caiado 0.359 | bn 0.117 · ns 0.045 |
| `lula_vs_renan_santos` | lula 0.485 · renan 0.33 | bn 0.136 · ns 0.049 |
| `augusto_cury_vs_lula` | cury 0.324 · lula 0.486 | bn 0.134 · ns 0.056 |

## New scenario keys (Option B)

None. Reused prior keys.

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction.
- Scenario ids lex-sorted candidate pair.
- RTBD: Nulo/Branco→`branco_nulo`; Não sabe/Não respondeu→`ns_nr`.
- Futura: Ninguém/Branco/Nulo→`branco_nulo`; NS/NR/Indeciso→`ns_nr`.
- GERP: Nenhum deles→`branco_nulo`; Não sabe/não respondeu→`ns_nr`.
- CNT/MDA: Branco/Nulo→`branco_nulo`; Indeciso→`ns_nr` (labeled bars on institute PDF pages; text layer is chart-image — extracted via render+read).
- CNT Aug Flávio×Lula not re-entered (already 2T-006).

## Blocked / deferred (explicit)

| Item | Reason |
|------|--------|
| Michelle×Lula (any institute) | **Permanently out of scope** |
| Quaest Jun 08 · Flávio×Lula | Arte-only residuals — hold |
| Quaest Jun 08 · Caiado×Lula | Primary inconsistency — hold |
| Meio/Ideia national 2º (Exame) | Non-extractable body; no new primary |
| Atlas Sep-16 · Zema/Caiado/Cury/Renan | Candidate % without residuals — hold |
| Atlas Jan / Feb / Mar / May 2º | Institute PDFs chart-image without residual labels; press often candidate % only — **not dual-entered** |
| GERP Aug-06–10 (BR-08045) | Gazeta states F×L 45–43 but **no residual line** in article body this pass — hold |
| GERP May and other pre-Jun waves | Not dual-entered this pass (Jul/Jun mop prioritized) |
| RTBD Mar / May / Jun / Jul earlier 2º | Sep/Aug PDF evolution has F×L series only; May ambiguous (two 1º siblings); Jun lacks 1º sibling — **prefer stop over evolution-only noise** |
| Futura waves before Aug-27 | Gazeta 1º witnesses still lack extractable 2º residual tables |
| CNT Aldo Rebelo / Joaquim Barbosa / Temer | Out of chart set |
| Ipsos-Ipec 2026 national stimulated 1º | Hard-stop upheld |
| State-only 2º | Wrong geography |
| Image-only / Arte-only without prose/labeled residuals | Skip rule upheld |
| `site/data/chart-2nd-round.json` | Lead must re-export from `canonical-points-2nd-round.json` (`--multi-scenario`) |

## URLs tried / notes (still blocked or partial)

- RTBD earlier: [24-set PDF](https://static.poder360.com.br/uploads/2026/09/Pesquisa-presidencial-Real-Time-Big-Data-24-set-2026.pdf) evolution F×L only — not dual-entered as Mar/May/Jun/Jul primaries.
- GERP Aug-11 Gazeta: https://www.gazetadopovo.com.br/eleicoes/2026/pesquisa-eleitoral-2026/gerp-presidente-agosto-2026/ — F×L % without bn/ns.
- Atlas Jan–May PDFs / CNN Jan: still chart-only or residual-less prose.
- Exame Meio/Ideia: still non-extractable (prior hold).
- CNT Semana On Jun prose: candidate % without residuals (PDF bars used instead).

## Validation

```bash
bin/pebr validate && bin/pebr normalize && bin/pebr assemble
```

## Files touched

```
data/national/polls/realtime_bigdata_2026-08-31_stimulated_2nd_round_*.json   (+4)
data/national/polls/futura_2026-09-01_stimulated_2nd_round_*.json               (+4)
data/national/polls/gerp_2026-06-20_stimulated_2nd_round_*.json                 (+3)
data/national/polls/gerp_2026-07-07_stimulated_2nd_round_*.json                 (+4)
data/national/polls/cnt_mda_2026-04-12_stimulated_2nd_round_*.json              (+4)
data/national/polls/cnt_mda_2026-06-14_stimulated_2nd_round_*.json              (+4)
data/national/polls/cnt_mda_2026-08-09_stimulated_2nd_round_{zema,caiado,renan,cury}*.json (+4)
data/national/witnesses/w_rtbd_2026-08-31_pdf_2t.json
data/national/witnesses/w_futura_2026-09-01_{pdf,gazeta}_2t.json
data/national/witnesses/w_gerp_2026-{06-20,07-07}_gazeta_2t.json
data/national/witnesses/w_cnt_mda_2026-{04-12,06-14,08-09}_pdf_2t.json
data/national/INTAKE_COHORT_2T_007.md
site/data/canonical-points.json                   (regenerated; 1º-only — expect 116)
site/data/canonical-points-2nd-round.json         (regenerated; expect 193)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`, `site/data/chart-2nd-round.json`, `config/candidate_aliases.yml`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
