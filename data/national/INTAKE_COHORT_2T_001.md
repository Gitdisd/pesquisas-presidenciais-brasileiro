# Intake Cohort 2T-001 — national stimulated 2º turno path + first verified cohort (PEBR 2026)

**Date:** 2026-09-26 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-2t-001`  
**Scope:** national geography · scenario family `stimulated_2nd_round_*`  
**Rule:** no invented numbers — every new poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes).

## Summary

| Metric | Value |
|--------|-------|
| New 2º-turno polls | **10** (5 Datafolha matchups + 5 Quaest matchups) |
| New witnesses | **2** (one G1 article each; shared across sibling matchups) |
| 1º-turno polls added | **0** (honest ceiling from cohort 008; Ipsos-Ipec hard-stop upheld) |
| 1º `canonical-points.json` | Unchanged count **116** (assemble filters 1º only) |
| 2º `canonical-points-2nd-round.json` | **10** points (new file) |
| `site/data/chart.json` / UI | **NOT touched** (Lead-owned) |

## Convention landed this cohort

- Scenario: `stimulated_2nd_round_<cand_a>_vs_<cand_b>` (candidate_ids lexicographically sorted).
- Same folder: `data/national/polls/` + scenario field (no separate poll subtree).
- Assemble: `canonical-points.json` = 1º only; `canonical-points-2nd-round.json` = 2º family.
- Docs: `docs/scenario-convention.md`; fixtures `EXAMPLE_poll_2nd_round.json` + `EXAMPLE_witness_2nd_round.json`.

## New polls (fieldwork_end · institute · matchup)

### Datafolha — fieldwork 2026-09-22 → 2026-09-23 · N=2002 · moe=0.02 · TSE BR-00304/2026

Primary: [G1 2026-09-24](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/09/24/datafolha-presidente-segundo-turno-24-setembro.ghtml)  
Witness: `w_datafolha_2026-09-23_g1_2t`

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.45 · lula 0.47 | bn 0.07 · ns 0.01 |
| `…_lula_vs_ronaldo_caiado` | lula 0.46 · ronaldo_caiado 0.44 | bn 0.09 · ns 0.01 |
| `…_lula_vs_romeu_zema` | lula 0.48 · romeu_zema 0.39 | bn 0.11 · ns 0.01 (sum 0.99 as-found) |
| `…_lula_vs_renan_santos` | lula 0.48 · renan_santos 0.39 | bn 0.12 · ns 0.02 (sum 1.01 as-found) |
| `…_augusto_cury_vs_lula` | augusto_cury 0.43 · lula 0.46 | bn 0.09 · ns 0.01 (sum 0.99 as-found) |

### Quaest — fieldwork 2026-09-17 → 2026-09-20 · N=2004 · moe=0.02 · TSE BR-06004/2026

Primary: [G1 2026-09-21](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/09/21/quaest-presidente-2o-turno-21-setembro.ghtml)  
Witness: `w_quaest_2026-09-20_g1_2t`

| poll_id (scenario suffix) | results (fractions) | residuals |
|---------------------------|---------------------|-----------|
| `…_flavio_bolsonaro_vs_lula` | flavio_bolsonaro 0.42 · lula 0.41 | bn 0.14 · ns 0.03 |
| `…_lula_vs_ronaldo_caiado` | lula 0.41 · ronaldo_caiado 0.39 | bn 0.16 · ns 0.04 |
| `…_augusto_cury_vs_lula` | augusto_cury 0.35 · lula 0.39 | bn 0.21 · ns 0.05 |
| `…_lula_vs_renan_santos` | lula 0.41 · renan_santos 0.38 | bn 0.17 · ns 0.04 |
| `…_lula_vs_romeu_zema` | lula 0.46 · romeu_zema 0.32 | bn 0.18 · ns 0.04 |

## Mapping notes

- Shares as fractions 0–1; `moe` as fraction.
- Datafolha “Em branco/nulo/nenhum” → `branco_nulo`; “Indecisos” → `ns_nr`.
- Quaest “Branco/nulo/não vai votar” → `branco_nulo`; “Indecisos” → `ns_nr`.
- Same fieldwork as existing 1º polls `datafolha_2026-09-23_stimulated_1st_round` / `quaest_2026-09-20_stimulated_1st_round` — **separate** poll_ids (scenario in identity).

## Blocked on missing primary (explicit)

| Item | Reason |
|------|--------|
| Ipsos-Ipec **2026 calendar** national stimulated **1º** | Hard-stop (cohort 008): no verified national stimulated primary with 2026 fieldwork. Only Dec-2025 national + 2026 state (CE). |
| Earlier 2026 2º-turno waves (Datafolha/Quaest/Atlas/etc. before this Sep pair) | Not dual-entered this pass — need per-wave primary fetch + hash; do not copy from aggregators alone. |
| Other institutes’ national 2º tables (AtlasIntel, PoderData, Nexus, Futura, Ideia, GERP, CNT/MDA, RTBD, …) | Not fetched/verified this pass — blocked until named primary with extractable matchup table. |
| Image-only / Arte-only matchups without list text | Skip if unordered-list / table text absent (these two G1 articles had extractable lists). |
| Historical cycles &lt; 2026 | `election_cycle` schema minimum is 2026 — out of scope until schema/Lead expands. |
| BBC / aggregator-only 2º rows | Discovery only — never sole witness. |
| `site/data/chart.json` 2º series | Lead must wire consumption of `canonical-points-2nd-round.json` (filter by scenario). |

## 1º turno careful expansion

**0 new 1º polls.** Cohort 008 already reported honest ceiling vs old-site estimulada lead list. No new primary-verified national stimulated 1º cells added.

## Validation

```bash
bin/pebr validate && bin/pebr normalize && bin/pebr assemble
```

## Files touched

```
schemas/poll.schema.json                          (scenario description)
schemas/README.md                                 (scenario section)
docs/scenario-convention.md                       (new)
fixtures/national/EXAMPLE_poll_2nd_round.json     (new)
fixtures/national/EXAMPLE_witness_2nd_round.json  (new)
lib/pebr.rb / lib/pebr/assemble.rb / bin/pebr
.github/workflows/refresh.yml
config/residual_categories.yml
README.md
data/national/polls/*_stimulated_2nd_round_*.json (10)
data/national/witnesses/w_datafolha_2026-09-23_g1_2t.json
data/national/witnesses/w_quaest_2026-09-20_g1_2t.json
data/national/INTAKE_COHORT_2T_001.md
site/data/canonical-points.json                   (regenerated; 1º-only — expect byte-stable vs prior 116)
site/data/canonical-points-2nd-round.json         (new)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`.  
**Not committed:** `_intake_raw/`, `_quarantine/`.
