# Intake Cohort 2T-008 — Meio/Ideia Sep mop + Palver Sep-23 2º (PEBR 2026)

**Date:** 2026-09-27 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-2t-008`  
**Scope:** national geography · Meio/Ideia hold mop (1º+2º) · Palver Onda 4 2º · discovery watch `--fetch` review  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes).

## Summary

| Metric | Value |
|--------|-------|
| New 1º-turno polls | **1** (ideia Sep 4–7) |
| New 2º-turno polls | **10** (ideia ×5 + palver ×5) |
| New witnesses | **4** |
| 1º `canonical-points.json` | Expect **117** (116 + 1) |
| 2º `canonical-points-2nd-round.json` | Expect **203** (193 + 10) |
| `site/data/chart.json` / UI / `chart-2nd-round.json` | **NOT touched** (Lead-owned) |

## Priority honored

1. Discovery `bin/pebr watch --fetch` reviewed — enter only national polls with extractable primary.
2. Meio/Ideia national 2º (BR-07935) — **mopped** via Canal Meio PDF labeled bars + Exame press.
3. Quaest Jun 08 Flávio Arte / Caiado — **still blocked** (re-checked G1: F×L candidate % without residual prose; Caiado UL still sums ≈1.09).
4. Atlas Sep-16 Zema/Caiado/Cury/Renan — **still blocked** (CEF still candidate % without residuals).
5. Ipsos-Ipec 2026 national stimulated 1º — **HARD-STOP upheld** (GNews hits are CE state, approval, or non-extractable; no verified 2026 national stimulated primary).
6. Michelle — **permanently out**.
7. No inventing; no chart/UI edits; no Playwright.

## New polls

### Meio/Ideia — 2026-09-04 → 2026-09-07 · N=1500 · moe=0.025 · TSE BR-07935/2026

Primary PDF: [Pesquisa-Meio_Ideia-Setembro.pdf](https://www.canalmeio.com.br/wp-content/uploads/2026/09/Pesquisa-Meio_Ideia-Setembro.pdf)  
Press: [Exame 1º](https://exame.com/brasil/pesquisa-meio-ideia-lula-tem-384-e-flavio-bolsonaro-373-no-1o-turno/) · [Exame 2º](https://exame.com/brasil/pesquisa-meio-ideia-lula-cai-flavio-bolsonaro-cresce-e-os-dois-empatam-em-46-no-2o-turno/)  
Witnesses: `w_ideia_2026-09-07_pdf`, `w_ideia_2026-09-07_exame_1t`, `w_ideia_2026-09-07_exame_2t`

**1º estimulada (PDF p.8):** Lula 0.384 · Flávio 0.373 · Cury 0.066 · Renan 0.04 · Caiado 0.04 · Zema 0.015 · Marçal 0.015 · Samara 0.007 · Rui 0.004 · Grassi 0.002 · Hertz/Clariana/Edmilson 0.001 · bn 0.025 · ns 0.028

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.46 · lula 0.46 | bn 0.035 · ns 0.045 |
| `augusto_cury_vs_lula` | cury 0.409 · lula 0.46 | bn 0.075 · ns 0.056 |
| `lula_vs_ronaldo_caiado` | lula 0.46 · caiado 0.42 | bn 0.061 · ns 0.059 |
| `lula_vs_romeu_zema` | lula 0.46 · zema 0.38 | bn 0.084 · ns 0.076 |
| `lula_vs_renan_santos` | lula 0.46 · renan 0.403 | bn 0.093 · ns 0.045 |

### Palver — 2026-09-20 → 2026-09-23 · N=5000 · moe=0.03 · TSE BR-09587/2026 (Onda 4)

Primary PDF: [voting-intention-2026-september-w4/report](https://www.palver.com.br/api/surveys/voting-intention-2026-september-w4/report)  
Witness: `w_palver_2026-09-23_pdf_2t` · **5 scenarios** (sibling 1º already entered cohort-002)

| scenario | results | residuals |
|----------|---------|-----------|
| `flavio_bolsonaro_vs_lula` | flavio 0.48 · lula 0.45 | bn 0.06 · ns 0.01 |
| `augusto_cury_vs_lula` | lula 0.44 · cury 0.36 | bn 0.18 · ns 0.02 |
| `lula_vs_renan_santos` | lula 0.44 · renan 0.34 | bn 0.20 · ns 0.02 |
| `lula_vs_ronaldo_caiado` | lula 0.44 · caiado 0.42 | bn 0.12 · ns 0.02 |
| `lula_vs_romeu_zema` | lula 0.45 · zema 0.43 | bn 0.10 · ns 0.02 |

## Discovery watch `--fetch` (this pass)

- Mode fetch: 30 targets, 24 live, 544 queue items, 322 `needs_human_review`.
- Entered from review: Meio/Ideia Sep PDF + Exame; Palver W4 PDF 2º (same wave as existing 1º).
- Skipped (already in / wrong geography / no clean primary): RTBD Sep-19–23 CNN (already entered); Datafolha/Quaest state cuts; GNews redirects; Atlas Sep-16 non-Flávio residuals; fixture URLs; hub/nav noise.
- Watermark fieldwork_end stayed 2026-09-23 (no newer national wave with extractable primary beyond Meio Sep-07 / existing Sep-23 set).

## TSE provenance status

| Lead | Result 2026-09-27 |
|------|-------------------|
| `dadosabertos.tse.jus.br` / CDN zip / PesqEle / TSE portal | **403** Akamai (unchanged) |
| TradeMap aggregator | **timeout** this egress |
| GNews `"Registro TSE"` | **200** — BR-IDs mostly state Paraná releases; national IDs already known or non-share provenance |
| Palver GitHub + `palver.com.br/survey` + W4 report PDF | **200** — wired |
| Canal Meio Ideia Setembro PDF | **200** — wired |
| Wayback `pesquisa_eleitoral_2026.zip` (20260909223204) | **200 application/zip ≈3.7MB** — wired as `tse-cdn-zip-wayback` lagging mirror |
| Live CDN / fresh daily dump | **Still blocked** |

**Conclusion:** Alternate public leads reduce discovery blind spots, but **mirror/egress secret is still required** for fresh TSE open-data dumps. Wayback is a dated snapshot only.

## Blocked / deferred (explicit)

| Item | Reason |
|------|--------|
| Michelle×Lula (any) | Permanently out |
| Quaest Jun 08 · Flávio×Lula | Arte-only residuals — hold |
| Quaest Jun 08 · Caiado×Lula | UL sum ≈1.09 vs retrospective — hold |
| Atlas Sep-16 · Zema/Caiado/Cury/Renan | Candidate % without residuals — hold |
| Ipsos-Ipec 2026 national stimulated 1º | Hard-stop — no verified primary |
| Image-only inventing | Skip rule upheld |
| `site/data/chart*.json` | Lead must re-export |

## Validation

```bash
bin/pebr validate && bin/pebr normalize && bin/pebr assemble
```

## Files touched

```
data/national/polls/ideia_2026-09-07_stimulated_1st_round.json
data/national/polls/ideia_2026-09-07_stimulated_2nd_round_*.json   (+5)
data/national/polls/palver_2026-09-23_stimulated_2nd_round_*.json  (+5)
data/national/witnesses/w_ideia_2026-09-07_{pdf,exame_1t,exame_2t}.json
data/national/witnesses/w_palver_2026-09-23_pdf_2t.json
data/national/INTAKE_COHORT_2T_008.md
data/national/discovery/queue.json + last-run.json   (watch --fetch)
config/watch_targets.yml                             (+4 public URLs)
docs/discovery.md · docs/adr/0001-discovery-bypass-blockers.md
site/data/canonical-points.json                      (expect 117)
site/data/canonical-points-2nd-round.json            (expect 203)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`, `site/data/chart-2nd-round.json`, `config/candidate_aliases.yml`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
