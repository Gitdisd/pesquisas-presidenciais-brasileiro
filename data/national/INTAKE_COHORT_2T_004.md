# Intake Cohort 2T-004 — other institutes’ national stimulated 2º (PEBR 2026)

**Date:** 2026-09-26 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-2t-004`  
**Scope:** national geography · scenario family `stimulated_2nd_round_*`  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes).

## Summary

| Metric | Value |
|--------|-------|
| New 2º-turno polls | **25** |
| New witnesses | **8** |
| Institutes newly with 2º | AtlasIntel, PoderData, Real Time Big Data, Nexus, CNT/MDA, GERP, Futura |
| 1º-turno polls added | **0** |
| 1º `canonical-points.json` | Expect unchanged **116** |
| 2º `canonical-points-2nd-round.json` | Expect **98** (73 prior + 25) |
| `site/data/chart.json` / UI / `chart-2nd-round.json` | **NOT touched** (Lead-owned) |

## Priority honored

1. Other institutes’ national stimulated 2º with extractable primary — **this cohort**.
2. Michelle×Lula / `michelle_bolsonaro` — **permanently out of scope** (Lead/user: Michelle not running).
3. Quaest Jun 08 Flávio Arte residual / Caiado inconsistency — **still blocked** (no invent).
4. Ipsos-Ipec inventing / image-PDF inventing — not done.

## New polls (fieldwork_end · institute · matchups)

### AtlasIntel — 2026-09-17 → 2026-09-22 · N=5015 · moe=0.01 · TSE BR-04739/2026

Primary: [CNN Brasil](https://www.cnnbrasil.com.br/eleicoes/atlas-bloomberg-lula-tem-477-no-2o-turno-flavio-474/)  
Witness: `w_atlasintel_2026-09-22_cnn_2t` · **5 scenarios**  
Residual convention: published **Branco/nulo/não sabe** lumped → entire residual mapped to `branco_nulo` (ns not split). Renan residual **22.3%** (CNN/VEJA; Terra 23.3% rejected).

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.474 · lula 0.477 | bn 0.049 |
| `lula_vs_ronaldo_caiado` | lula 0.466 · caiado 0.44 | bn 0.094 |
| `lula_vs_renan_santos` | lula 0.465 · renan 0.312 | bn 0.223 |
| `lula_vs_romeu_zema` | lula 0.476 · zema 0.422 | bn 0.102 |
| `augusto_cury_vs_lula` | cury 0.394 · lula 0.462 | bn 0.144 |

### PoderData — 2026-09-20 → 2026-09-23 · N=3000 · moe=0.018 · TSE BR-01739/2026

Primary: [CNN Brasil](https://www.cnnbrasil.com.br/eleicoes/poderdata-aya-flavio-tem-46-das-intencoes-de-voto-no-2o-turno-lula-45/)  
Witness: `w_poderdata_2026-09-23_cnn_2t` · **3 scenarios** (includes **new** Option B key)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.46 · lula 0.45 | bn 0.07 · ns 0.02 |
| `augusto_cury_vs_lula` | cury 0.45 · lula 0.42 | bn 0.10 · ns 0.03 |
| `augusto_cury_vs_flavio_bolsonaro` | cury 0.39 · flavio 0.41 | bn 0.17 · ns 0.03 |

### Real Time Big Data — 2026-09-19 → 2026-09-23 · N=2000 · moe=0.02 · TSE BR-04202/2026

Primary: [Gazeta do Povo](https://www.gazetadopovo.com.br/eleicoes/2026/pesquisa-eleitoral-2026/real-time-big-data-presidente-setembro-2026-2/)  
Witness: `w_rtbd_2026-09-23_gazeta_2t` · **5 scenarios**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.45 · lula 0.44 | bn 0.08 · ns 0.03 |
| `augusto_cury_vs_lula` | cury 0.43 · lula 0.44 | bn 0.08 · ns 0.05 |
| `lula_vs_renan_santos` | lula 0.44 · renan 0.38 | bn 0.10 · ns 0.08 |
| `lula_vs_ronaldo_caiado` | lula 0.44 · caiado 0.44 | bn 0.08 · ns 0.04 |
| `lula_vs_romeu_zema` | lula 0.45 · zema 0.39 | bn 0.09 · ns 0.07 |

### Nexus (BTG) — 2026-09-18 → 2026-09-20 · N=2006 · moe=0.02 · TSE BR-00485/2026

Primary: [Correio da Manhã](https://www.correiodamanha.com.br/politica/2026/09/320621-btg-nexus-lula-e-flavio-bolsonaro-empatam-na-margem-de-erro-nos-dois-turnos.html) (residuals); institute page corroborates 46–45 only.  
Witness: `w_nexus_2026-09-20_correio_2t` · **1 scenario**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.45 · lula 0.46 | bn 0.07 · ns 0.01 |

### CNT/MDA — 2026-09-09 → 2026-09-13 · N=2002 · moe=0.022 · TSE BR-06902/2026

Primary: [Estadão](https://www.estadao.com.br/politica/eleicoes/cntmda-no-2-turno-lula-tem-473-e-flavio-bolsonaro-40/)  
Witness: `w_cnt_mda_2026-09-13_estadao_2t` · **5 scenarios**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.40 · lula 0.473 | bn 0.102 · ns 0.025 |
| `augusto_cury_vs_lula` | cury 0.384 · lula 0.453 | bn 0.127 · ns 0.036 |
| `lula_vs_ronaldo_caiado` | lula 0.464 · caiado 0.373 | bn 0.131 · ns 0.032 |
| `lula_vs_romeu_zema` | lula 0.477 · zema 0.345 | bn 0.157 · ns 0.031 |
| `lula_vs_renan_santos` | lula 0.473 · renan 0.339 | bn 0.157 · ns 0.031 |

### GERP — 2026-09-14 → 2026-09-16 · N=2400 · moe=0.02 · TSE BR-00535/2026

Primary: [CNN Brasil](https://www.cnnbrasil.com.br/eleicoes/gerp-flavio-tem-50-no-2o-turno-lula-43/)  
Witness: `w_gerp_2026-09-16_cnn_2t` · **1 scenario**

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.50 · lula 0.43 | bn 0.06 · ns 0.01 |

### Futura / 100% Cidades — 2026-09-19 → 2026-09-23 · N=2000 · moe=0.022 · TSE BR-05268/2026

Primaries: [Revista Oeste](https://revistaoeste.com/politica/futura-flavio-passa-lula-no-1o-e-2o-turno/) (Flávio×Lula residuals) + [GP1](https://www.gp1.com.br/eleicoes-2026/noticia/2026/9/24/futura-flavio-bolsonaro-tem-494-e-lula-437-em-cenario-de-2o-turno-632279.html) (other four + candidates).  
Witnesses: `w_futura_2026-09-23_oeste_2t`, `w_futura_2026-09-23_gp1_2t` · **5 scenarios**  
Note: GP1 prints Indecisos **5.6%** for Flávio×Lula (row sum 104.3) — **rejected**; Oeste bn 5.6 + ns 1.3 used instead.

| scenario | results | residuals | residual source |
|----------|---------|-----------|-----------------|
| `flavio_bolsonaro_vs_lula` | flavio 0.494 · lula 0.437 | bn 0.056 · ns 0.013 | Oeste |
| `lula_vs_ronaldo_caiado` | caiado 0.465 · lula 0.424 | bn 0.097 · ns 0.013 | GP1 |
| `lula_vs_romeu_zema` | zema 0.438 · lula 0.433 | bn 0.112 · ns 0.017 | GP1 |
| `augusto_cury_vs_lula` | cury 0.463 · lula 0.41 | bn 0.109 · ns 0.018 | GP1 |
| `lula_vs_renan_santos` | lula 0.438 · renan 0.417 | bn 0.132 · ns 0.013 | GP1 |

## New scenario keys (Option B)

| Key | First introduced |
|-----|------------------|
| `stimulated_2nd_round_augusto_cury_vs_flavio_bolsonaro` | PoderData 2026-09-23 |

Prior keys reused: `flavio_bolsonaro_vs_lula`, `augusto_cury_vs_lula`, `lula_vs_ronaldo_caiado`, `lula_vs_romeu_zema`, `lula_vs_renan_santos`.

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction.
- Scenario ids lex-sorted candidate pair (`_a_vs_b`).
- Same fieldwork / TSE as existing sibling 1º polls — **separate** poll_ids (scenario in identity).
- Atlas 2º residual lump (bn+ns) documented per poll notes — not invented split.

## Blocked / deferred (explicit)

| Item | Reason |
|------|--------|
| Michelle×Lula (any institute) | **Permanently out of scope** — Michelle Bolsonaro not running; do not add alias. |
| Quaest Jun 08 · Flávio×Lula | Arte-only residuals — hold. |
| Quaest Jun 08 · Caiado×Lula | Primary inconsistency (UL vs retrospective) — hold. |
| Meio/Ideia national 2º (e.g. Sep 4–7 BR-07935) | Exame fetch returned non-extractable/binary body; no honest residual table dual-entered this pass. |
| Earlier waves of Atlas/PoderData/Nexus/Futura/GERP/RTBD/CNT 2º | Capacity — latest extractable wave per institute entered; earlier waves still open for later cohort if primary extractable. |
| Ipsos-Ipec 2026 national stimulated 1º | Hard-stop upheld. |
| State-only 2º | Wrong geography. |
| Image-only / Arte-only without prose residuals | Skip rule upheld. |
| Aggregator-only sole witness (depoisdas17 / TradeMap) | Prefer institute/G1/Estadão/CNN/Gazeta; aggregators not used as sole witness. |
| `site/data/chart-2nd-round.json` | Lead must re-export from `canonical-points-2nd-round.json` (`--multi-scenario`). |

## URLs tried / notes (Ideia)

- `https://exame.com/brasil/pesquisa-meio-ideia-lula-cai-flavio-bolsonaro-cresce-e-os-dois-empatam-em-46-no-2o-turno/` — fetched bytes not usable HTML prose (compressed/binary); candidate % only in search snippet without residuals → **blocked**.

## Validation

```bash
bin/pebr validate && bin/pebr normalize && bin/pebr assemble
```

## Files touched

```
data/national/polls/{atlasintel,poderdata,realtime_bigdata,nexus,cnt_mda,gerp,futura}_*_stimulated_2nd_round_*.json   (+25)
data/national/witnesses/w_atlasintel_2026-09-22_cnn_2t.json
data/national/witnesses/w_poderdata_2026-09-23_cnn_2t.json
data/national/witnesses/w_rtbd_2026-09-23_gazeta_2t.json
data/national/witnesses/w_nexus_2026-09-20_correio_2t.json
data/national/witnesses/w_cnt_mda_2026-09-13_estadao_2t.json
data/national/witnesses/w_gerp_2026-09-16_cnn_2t.json
data/national/witnesses/w_futura_2026-09-23_oeste_2t.json
data/national/witnesses/w_futura_2026-09-23_gp1_2t.json
data/national/INTAKE_COHORT_2T_004.md
site/data/canonical-points.json                   (regenerated; 1º-only — expect 116)
site/data/canonical-points-2nd-round.json         (regenerated; expect 98)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`, `site/data/chart-2nd-round.json`, `config/candidate_aliases.yml`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
