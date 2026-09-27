# Intake Cohort 2T-006 — earlier PoderData + Futura/GERP/CNT mop + Atlas Apr (PEBR 2026)

**Date:** 2026-09-26 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-2t-006`  
**Scope:** national geography · scenario family `stimulated_2nd_round_*`  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes).

## Summary

| Metric | Value |
|--------|-------|
| New 2º-turno polls | **34** |
| New witnesses | **10** |
| Waves / mop | PoderData May–Aug (6 waves ×4) + Sep-16 (3); Futura Sep-04–10 (4); CNT/MDA Aug-09 (1); GERP Aug-25 (1); AtlasIntel Apr-27 (1) |
| 1º-turno polls added | **0** |
| 1º `canonical-points.json` | Expect unchanged **116** |
| 2º `canonical-points-2nd-round.json` | Expect **166** (132 prior + 34) |
| `site/data/chart.json` / UI / `chart-2nd-round.json` | **NOT touched** (Lead-owned) |

## Priority honored

1. Earlier RTBD / Futura / GERP / CNT-MDA / Atlas Jan–May / PoderData May–Aug where dual-entry completable — **this cohort** (PoderData full; Futura mid-Sep; GERP Aug; CNT Aug; Atlas Apr Flávio×Lula).
2. Michelle×Lula — **permanently out**.
3. Quaest Jun 08 Flávio Arte / Caiado — **still blocked**.
4. Meio/Ideia Exame — **still blocked**.
5. Atlas Sep-16 Zema/Caiado/Cury/Renan — **still blocked** (no new residual prose).
6. No inventing; no chart/UI edits.

## New polls (fieldwork_end · institute · matchups)

### PoderData — 2026-05-25 → 2026-05-28 · N=2400 · moe=0.02 · TSE BR-04882/2026

Primary PDF: [ndmais Relatorio-PoderData-Eleitoral-29mai26](https://static.ndmais.com.br/2026/05/Relatorio-PoderData-Eleitoral-29mai26.pdf)  
Witness: `w_poderdata_2026-05-28_pdf_2t` · **4 scenarios** (Joaquim Barbosa skipped)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.42 · lula 0.46 | bn 0.09 · ns 0.03 |
| `lula_vs_renan_santos` | lula 0.45 · renan 0.36 | bn 0.16 · ns 0.03 |
| `lula_vs_romeu_zema` | lula 0.45 · zema 0.41 | bn 0.12 · ns 0.03 |
| `lula_vs_ronaldo_caiado` | lula 0.45 · caiado 0.41 | bn 0.12 · ns 0.02 |

### PoderData — 2026-06-21 → 2026-06-24 · N=2400 · moe=0.02 · TSE BR-05722/2026

Primary: [25jun26 PDF](https://static.ndmais.com.br/2026/06/Relatorio-PoderData-Eleitoral-25jun26.pdf) · `w_poderdata_2026-06-24_pdf_2t` · **4**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.43 · lula 0.46 | bn 0.08 · ns 0.03 |
| `lula_vs_renan_santos` | lula 0.45 · renan 0.38 | bn 0.14 · ns 0.03 |
| `lula_vs_romeu_zema` | lula 0.45 · zema 0.42 | bn 0.10 · ns 0.03 |
| `lula_vs_ronaldo_caiado` | lula 0.45 · caiado 0.42 | bn 0.10 · ns 0.03 |

### PoderData — 2026-07-12 → 2026-07-15 · N=2400 · moe=0.02 · TSE BR-00059/2026

Primary: [16jul26 PDF](https://static.poder360.com.br/uploads/2026/07/Relatorio-PoderData-Eleitoral-16jul26-final.pdf); numbers from Jul-29 time-series **15-Jul** column (Jul-15 chart OCR messy; press corroborates F×L 45–43) · `w_poderdata_2026-07-15_pdf_2t` · **4**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.43 · lula 0.45 | bn 0.09 · ns 0.02 |
| `lula_vs_renan_santos` | lula 0.43 · renan 0.38 | bn 0.15 · ns 0.04 |
| `lula_vs_romeu_zema` | lula 0.44 · zema 0.41 | bn 0.11 · ns 0.04 |
| `lula_vs_ronaldo_caiado` | lula 0.44 · caiado 0.43 | bn 0.11 · ns 0.03 |

### PoderData — 2026-07-26 → 2026-07-29 · N=2400 · moe=0.02 · TSE BR-07845/2026

Primary: [29jul26 PDF](https://static.poder360.com.br/uploads/2026/07/Relatorio-PoderData-Eleitoral-29jul26-3.pdf) · rightmost · `w_poderdata_2026-07-29_pdf_2t` · **4**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.43 · lula 0.46 | bn 0.09 · ns 0.02 |
| `lula_vs_renan_santos` | lula 0.45 · renan 0.37 | bn 0.15 · ns 0.04 |
| `lula_vs_romeu_zema` | lula 0.44 · zema 0.42 | bn 0.10 · ns 0.03 |
| `lula_vs_ronaldo_caiado` | lula 0.44 · caiado 0.43 | bn 0.10 · ns 0.03 |

### PoderData — 2026-08-09 → 2026-08-12 · N=2400 · moe=0.02 · TSE BR-06868/2026

Primary: [12ago26 PDF](https://static.poder360.com.br/uploads/2026/08/Relatorio-PoderData-Eleitoral-12ago26-final.pdf) · `w_poderdata_2026-08-12_pdf_2t` · **4**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.45 · lula 0.46 | bn 0.08 · ns 0.01 |
| `lula_vs_renan_santos` | lula 0.46 · renan 0.37 | bn 0.15 · ns 0.02 |
| `lula_vs_romeu_zema` | lula 0.45 · zema 0.43 | bn 0.10 · ns 0.01 |
| `lula_vs_ronaldo_caiado` | lula 0.45 · caiado 0.44 | bn 0.10 · ns 0.01 |

### PoderData — 2026-08-23 → 2026-08-26 · N=2400 · moe=0.02 · TSE BR-04974/2026

Primary: [26ago26 PDF](https://static.poder360.com.br/uploads/2026/08/Relatorio-PoderData-Eleitoral-26ago26-1.pdf) · `w_poderdata_2026-08-26_pdf_2t` · **4**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.44 · lula 0.45 | bn 0.09 · ns 0.02 |
| `lula_vs_renan_santos` | lula 0.44 · renan 0.37 | bn 0.16 · ns 0.03 |
| `lula_vs_romeu_zema` | lula 0.44 · zema 0.43 | bn 0.10 · ns 0.02 |
| `lula_vs_ronaldo_caiado` | lula 0.43 · caiado 0.44 | bn 0.10 · ns 0.02 |

### PoderData — 2026-09-13 → 2026-09-16 · N=3000 · moe=0.018 · TSE BR-00360/2026

Primary: [16set26 PDF](https://static.poder360.com.br/uploads/2026/09/Relatorio-PoderData-Eleitoral-16set26.pdf) · `w_poderdata_2026-09-16_pdf_2t` · **3** (no Zema/Caiado/Renan 2º in PDF)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.46 · lula 0.44 | bn 0.08 · ns 0.02 |
| `augusto_cury_vs_lula` | cury 0.45 · lula 0.42 | bn 0.11 · ns 0.02 |
| `augusto_cury_vs_flavio_bolsonaro` | cury 0.36 · flavio 0.43 | bn 0.18 · ns 0.02 |

### Futura / 100% Cidades — 2026-09-04 → 2026-09-10 · N=2000 · moe=0.022 · TSE BR-02322/2026

Primary: [pesquisa-futura-100-cidades-11set.pdf](https://static.poder360.com.br/uploads/2026/09/pesquisa-futura-100-cidades-11set.pdf)  
Witness: `w_futura_2026-09-10_pdf_2t` · **4 scenarios** (no sibling 1º yet; distinct from Sep-01 BR-02793)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.454 · lula 0.45 | bn 0.071 · ns 0.025 |
| `lula_vs_ronaldo_caiado` | lula 0.437 · caiado 0.428 | bn 0.107 · ns 0.029 |
| `lula_vs_romeu_zema` | lula 0.46 · zema 0.405 | bn 0.109 · ns 0.026 |
| `lula_vs_renan_santos` | lula 0.461 · renan 0.376 | bn 0.132 · ns 0.031 |

### CNT/MDA — 2026-08-05 → 2026-08-09 · N=2002 · moe=0.022 · TSE BR-06935/2026

Primary: [CartaCapital](https://www.cartacapital.com.br/politica/cnt-mda-lula-tem-13-pontos-de-vantagem-sobre-flavio-bolsonaro-no-1o-turno/) · `w_cnt_mda_2026-08-09_cartacapital_2t` · **1** (only Flávio×Lula in prose)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.391 · lula 0.48 | bn 0.106 · ns 0.023 |

### GERP — 2026-08-21 → 2026-08-25 · N=2400 · moe=0.02 · TSE BR-03547/2026

Primary: [Gazeta do Povo](https://www.gazetadopovo.com.br/eleicoes/2026/pesquisa-eleitoral-2026/gerp-presidente-agosto-2026-2/) · `w_gerp_2026-08-25_gazeta_2t` · **1**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.47 · lula 0.42 | bn 0.08 · ns 0.03 |

### AtlasIntel — 2026-04-22 → 2026-04-27 · N=5008 · moe=0.01 · TSE BR-07992/2026

Primary: [Valor Econômico](https://valor.globo.com/politica/noticia/2026/04/28/atlasintel-flavio-bolsonaro-tem-478percent-e-lula-475percent-em-eventual-2o-turno.ghtml) · `w_atlasintel_2026-04-27_valor_2t` · **1** (PDF 2º chart-image; press has residual lump)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.478 · lula 0.475 | bn 0.047 |

## New scenario keys (Option B)

None. Reused prior keys including `stimulated_2nd_round_augusto_cury_vs_flavio_bolsonaro`.

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction.
- Scenario ids lex-sorted candidate pair.
- PoderData: Branco/Nulo→`branco_nulo`; Não sabe→`ns_nr`.
- Futura: Ninguém/Branco/Nulo→`branco_nulo`; NS/NR/Indeciso→`ns_nr`.
- GERP: Nenhum deles→`branco_nulo`; Não sabe/não respondeu→`ns_nr`.
- Atlas residual lump (indecisos+anular/branco) → entire residual to `branco_nulo`.
- Joaquim Barbosa×Lula present in PoderData May/Jun PDFs — **skipped** (not in current six-scenario chart set; no Lead ask for new key).

## Blocked / deferred (explicit)

| Item | Reason |
|------|--------|
| Michelle×Lula (any institute) | **Permanently out of scope** |
| Quaest Jun 08 · Flávio×Lula | Arte-only residuals — hold |
| Quaest Jun 08 · Caiado×Lula | Primary inconsistency — hold |
| Meio/Ideia national 2º (Exame) | Non-extractable body; no new primary |
| Atlas Sep-16 · Zema/Caiado/Cury/Renan | Candidate % without residuals — hold |
| Atlas Jan / Feb / Mar / May 2º | Institute PDFs chart-image; press often candidate % without stated residual (Jan CNN 49–45) or multi-matchup incomplete — **not dual-entered** |
| Atlas Apr other matchups (Haddad/Alckmin 2º) | Wrong/out-of-scope slate for main chart |
| CNT/MDA Apr / Jun earlier; CNT Aug non-Flávio | Only Flávio×Lula in CartaCapital Aug prose; earlier waves no clean multi-matchup primary this pass |
| GERP earlier waves (pre Aug-25) | Searched; no clean residual table dual-entered beyond Aug-25 / Sep-16 |
| RTBD earlier waves (pre Sep-23) | No clean multi-matchup primary dual-entered this pass |
| Futura earlier waves (pre Sep-04) | Sep-04–10 entered; older Gazeta 1º witnesses lack extractable 2º residual tables this pass |
| Ipsos-Ipec 2026 national stimulated 1º | Hard-stop upheld |
| State-only 2º | Wrong geography |
| Image-only / Arte-only without prose residuals | Skip rule upheld |
| `site/data/chart-2nd-round.json` | Lead must re-export from `canonical-points-2nd-round.json` (`--multi-scenario`) |

## URLs tried / notes (still blocked or partial)

- Atlas Jan–May PDFs: 2º pages are charts; `pdftotext` yields no numeric tables. CNN Jan states 49–45 without residual line → held.
- Valor Apr cites Mar F47.6/L46.6/residual 5.8 retrospectively — **not** dual-entered as Mar primary (Apr article is secondary for Mar).
- Exame Meio/Ideia: still non-extractable (prior hold).
- RTBD earlier PDFs/GZH: 1º-focused or incomplete 2º residual tables this pass.

## Validation

```bash
bin/pebr validate && bin/pebr normalize && bin/pebr assemble
```

## Files touched

```
data/national/polls/poderdata_2026-{05-28,06-24,07-15,07-29,08-12,08-26}_stimulated_2nd_round_*.json  (+24)
data/national/polls/poderdata_2026-09-16_stimulated_2nd_round_*.json                                 (+3)
data/national/polls/futura_2026-09-10_stimulated_2nd_round_*.json                                     (+4)
data/national/polls/cnt_mda_2026-08-09_stimulated_2nd_round_flavio_bolsonaro_vs_lula.json            (+1)
data/national/polls/gerp_2026-08-25_stimulated_2nd_round_flavio_bolsonaro_vs_lula.json               (+1)
data/national/polls/atlasintel_2026-04-27_stimulated_2nd_round_flavio_bolsonaro_vs_lula.json         (+1)
data/national/witnesses/w_poderdata_2026-*_pdf_2t.json                                               (+7)
data/national/witnesses/w_futura_2026-09-10_pdf_2t.json
data/national/witnesses/w_cnt_mda_2026-08-09_cartacapital_2t.json
data/national/witnesses/w_gerp_2026-08-25_gazeta_2t.json
data/national/witnesses/w_atlasintel_2026-04-27_valor_2t.json
data/national/INTAKE_COHORT_2T_006.md
site/data/canonical-points.json                   (regenerated; 1º-only — expect 116)
site/data/canonical-points-2nd-round.json         (regenerated; expect 166)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`, `site/data/chart-2nd-round.json`, `config/candidate_aliases.yml`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
