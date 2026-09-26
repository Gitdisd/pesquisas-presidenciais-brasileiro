# Intake Cohort 001 — verified national stimulated 1º turno (PEBR 2026)

**Date:** 2026-09-26 (America/Sao_Paulo)  
**Dataset version:** `intake-cohort-001`  
**Scope:** national geography · scenario `stimulated_1st_round` only  
**Rule:** no invented numbers — every poll has ≥1 witness with fetched `source_url` + `content_hash` (sha256 of retrieved bytes)

## Summary

| Metric | Value |
|--------|-------|
| Polls | **15** |
| Witnesses | **18** |
| Institutes activated | datafolha, quaest, atlasintel, poderdata, futura, nexus, vox_brasil, realtime_bigdata, gerp, ideia, indexa |
| Optional Lead Option B ingest | `site/data/canonical-points.json` (array of canonical poll snapshots + `source_path`) |
| `site/data/chart.json` | **NOT modified by this cohort** (Lead/Stats-owned; still synthetic EXAMPLE from prior commit) |

## Poll inventory (fieldwork_end order)

| poll_id | institute | fieldwork | TSE | confidence (witness) | primary witness |
|---------|-----------|-----------|-----|----------------------|-----------------|
| ideia_2026-08-03_stimulated_1st_round | ideia | 2026-07-31 → 2026-08-03 | BR-04579/2026 | 0.88 press | Gazeta do Povo |
| indexa_2026-08-23_stimulated_1st_round | indexa | 2026-08-20 → 2026-08-23 | BR-06366/2026 | 0.88 press | Broadcast |
| gerp_2026-08-25_stimulated_1st_round | gerp | 2026-08-21 → 2026-08-25 | BR-03547/2026 | 0.88 press | Gazeta do Povo |
| vox_brasil_2026-08-27_stimulated_1st_round | vox_brasil | 2026-08-25 → 2026-08-27 | BR-05519/2026 | 0.96 pdf | Poder360 CDN PDF |
| nexus_2026-08-30_stimulated_1st_round | nexus | 2026-08-28 → 2026-08-30 | BR-08900/2026 | 0.93 institute HTML | nexus.fsb.com.br |
| realtime_bigdata_2026-08-31_stimulated_1st_round | realtime_bigdata | 2026-08-27 → 2026-08-31 | BR-03490/2026 | 0.88 press | GZH (cenário sem Marçal) |
| futura_2026-09-01_stimulated_1st_round | futura | 2026-08-27 → 2026-09-01 | BR-02793/2026 | 0.95 pdf + 0.90 html | Futura PDF + Poder360 |
| poderdata_2026-09-02_stimulated_1st_round | poderdata | 2026-08-30 → 2026-09-02 | BR-07561/2026 | 0.95 pdf + 0.93 html | PoderData PDF + article |
| datafolha_2026-09-03_stimulated_1st_round | datafolha | 2026-09-01 → 2026-09-03 | BR-03669/2026 | 0.92 press | G1 |
| quaest_2026-09-06_stimulated_1st_round | quaest | 2026-09-03 → 2026-09-06 | BR-01720/2026 | 0.90 press | G1 (no-Marçal list) |
| nexus_2026-09-07_stimulated_1st_round | nexus | 2026-09-04 → 2026-09-07 | BR-06790/2026 | 0.95 pdf | BTG-Nexus PDF |
| quaest_2026-09-13_stimulated_1st_round | quaest | 2026-09-10 → 2026-09-13 | BR-03607/2026 | 0.92 press | G1 |
| quaest_2026-09-20_stimulated_1st_round | quaest | 2026-09-17 → 2026-09-20 | BR-06004/2026 | 0.92 press | G1 |
| atlasintel_2026-09-22_stimulated_1st_round | atlasintel | 2026-09-17 → 2026-09-22 | BR-04739/2026 | 0.88 press (+ PDF meta) | CNN + Atlas PDF |
| datafolha_2026-09-23_stimulated_1st_round | datafolha | 2026-09-22 → 2026-09-23 | BR-00304/2026 | 0.92 press | G1 |

## Sources fetched (provenance)

Fetched into local `_intake_raw/` (gitignored; hashes recorded on witnesses):

- G1 Datafolha / Quaest articles (Sep 3, 7, 14, 21, 24)
- CNN Atlas/Bloomberg article + CNN-hosted Atlas PDF
- Poder360 PoderData article + `Relatorio-PoderData-Eleitoral-2set26.pdf`
- Poder360 Futura article + `pesquisaFutura-nacional-presidente-3set2026.pdf`
- Nexus institute HTML (31 Aug release)
- `BTG-Nexus-nacional-8set2026.pdf` (Poder360 CDN)
- Vox Brasil national PDF (Poder360 CDN)
- GZH Real Time Big Data article
- Gazeta do Povo GERP + Meio/Ideia articles
- Broadcast Indexa article
- AtlasIntel HTML poll pages (JS charts — metadata only; numbers from CNN)
- Quaest PDF URL attempted (`QUAEST5PRESIDENCIAL2109.pdf`) — image-heavy / not used for numbers
- CNT/MDA PDF + Revista Fórum article fetched but **excluded** from cohort (see below)

Quarantine `_quarantine/legacy-workspace-dump/polls.json` used **only as URL lead list** — no numbers copied without re-fetch.

## Mapping notes

- Shares stored as fractions 0–1; `moe` as fraction (e.g. 0.02 = ±2pp).
- `fieldwork_mid` = calendar midpoint of start/end.
- Residuals: `branco_nulo`, `ns_nr`, and `outros` when the source publishes an aggregated “outros” bucket.
- Candidate slugs in `config/candidate_aliases.yml` (intake-cohort-001 section).
- Partnership brands normalized: Genial/Quaest→quaest, PoderData/Aya→poderdata, BTG/Nexus→nexus, Futura/100% Cidades→futura, Meio/Ideia→ideia, Atlas/Bloomberg→atlasintel.

## Exclusions / honest gaps

| Item | Reason |
|------|--------|
| CNT/MDA Aug 2026 (BR-06935/2026) | Methodology + TSE verified from institute PDF; stimulated **headline %** only in press (Revista Fórum) while PDF charts are image-based — deferred until OCR/primary table text is verified without risk of misread. |
| 2º turno / runoff scenarios | Out of scope for this cohort (many quarantine leads are runoff-only). |
| Marçal-included alternate slates | When a page publishes two stimulated lists, preferred the principal **without** ineligible Marçal (noted on Quaest 2026-09-06 and RTBD). |
| Early-2026 BBC aggregator table | Single secondary URL covering many rows — not re-verified cell-by-cell; skipped. |
| Paraná Pesquisas national PDFs | Not fetched in this pass (timeboxed to sources with clear stimulated tables). |
| Ipsos-Ipec / Palver / Veritá / Alfa / etc. | No verified primary fetch this pass. |
| TSE Dados Abertos CSV bulk | WAF/API friction noted in SOURCE_MAP; not required when institute/press already carry BR- ids. |
| Nexus 2026-08-30 residuals | Institute page did not publish branco/NS for 1º turno — residuals left `{}` (not invented). Shares sum ≈0.92. |
| Indexa “não iriam votar” 4pp | Documented on witness extractions / poll notes; not forced into residual keys. |
| `site/data/chart.json` Option B aggregate | **Not fabricated.** Lead/Stats must regenerate from real `data/national/polls` (or `canonical-points.json`) when ready. Current chart.json remains synthetic EXAMPLE from prior Stats commit. |

## Lead Option B blockers / handoff

1. Point Stats CLI at `data/national/polls/*.json` **or** `site/data/canonical-points.json` (path documented here) instead of `fixtures/national/example_polls_synthetic.json`.
2. Do **not** treat EXAMPLE fixtures / existing `chart.json` as real.
3. Scenario filter must stay `stimulated_1st_round` only.
4. Missing residuals on Nexus Aug-30 may affect share-sum checks — Stats should tolerate incomplete residual coverage or wait for PDF fill-in.
5. UI banner: until chart.json is rebuilt from this cohort, keep EXAMPLE disclaimer.

## Validation

```bash
bin/pebr validate   # fixtures + data/national/polls|witnesses vs schemas; cross-links witness↔poll
```

## Files touched

```
data/national/polls/*.json          (15)
data/national/witnesses/*.json      (18)
data/national/INTAKE_COHORT_001.md
site/data/canonical-points.json     (optional Option B ingest)
config/institutes.yml               (activate used institutes)
config/candidate_aliases.yml
config/residual_categories.yml      (activate outros)
bin/pebr + lib/pebr.rb              (validate national tree)
.gitignore                          (_intake_raw/)
```

**Not touched:** `site/index.html`, `site/css/`, `site/js/`, `site/data/chart.json`.
