# Maintenance log — 2026-10-04 site update & repair

**Started:** 2026-10-04 00:22 BRT (America/Sao_Paulo)  
**Requested by user:** update the live site, repair anything broken/incomplete, read the project documentation, and mark/write what is being completed.  
**Base:** `main` at `2d0f75676d211718f3b3b71ada12072bf70fb5ef`
**Maintenance merge:** `0b3a0f79ad1885ae0f491a45e4d216612354faa3` (PR #11)  
**Final accessibility merge:** `86d00b4f17bb5d6193779bd836461366d9f4475d` (PR #12)  
**Final candidate-status merge:** `372aa5b49fe657887a6ca70941f8428d018eaecb` (PR #13)  
**Post-merge canonical metadata correction:** `b12fdba6b2428e37daaca001de88576060cc8f07` (PR #14) — merged.  
**Preventive site-CI merge:** `9f17923aba5b2e1fc86eead22340c25cceceb697` (PR #15) — merged.  
**Working branches:** maintenance branches used for this cycle are closed/merged.

## Documentation reconciliation

- [x] Read and cross-reference the root README.
- [x] Read `docs/AI-HANDOFF.md` and treat its 2026-09-27 pause as historical; the user's 2026-10-04 explicit update order supersedes the pause for this maintenance cycle.
- [x] Read `docs/conversation-decisions.md`, `docs/lead-status-log.md`, `docs/pipeline-status-log.md`, `docs/TASK-LOG-PAUSE.md`, and transcript README/index material.
- [x] Read `docs/suggestions-and-research.md`, `docs/suggestions-research-findings.md`, and `docs/advanced-polling-rnd.md`.
- [x] Read `docs/feature-gap-audit.md` and `docs/old-site-deep-port.md`.
- [x] Read `docs/architecture.md`, `docs/scenario-convention.md`, `docs/methodology-aggregate-option-b.md`, `docs/regional.md`, `docs/discovery.md`, and `docs/manual-intake.md`.
- [x] Read `docs/cross-reference.md`, ADR 0001, ADR 0002, and `data/regional/README.md` / `site/data/README.md`.
- [x] Preserve frozen status logs as historical records; current execution is tracked here instead of rewriting history.

## Site / code repairs

- [x] Repaired the latest-fieldwork header chip. The HTML chip was being destroyed by `headerMeta.innerHTML`, and `chart.js` did not define `el.dataThrough`.
- [x] Removed the dead `btn-focus-chart` reference left after the Focar control was intentionally removed.
- [x] Kept the existing no-brush / point-only-hover / D3 / vanilla-JS architecture.
- [x] Preserved keyboard-accessible chart points and requestAnimationFrame zoom coalescing already shipped.
- [x] Confirmed Chart #2 regional Option B snapshot is populated and per-UF, rather than the stale documentation's old “empty stub” description.
- [x] Confirmed the Pages workflow rebuilds national 1º, national pairwise 2º, and regional Chart #2 artifacts from canonical data during deployment.
- [x] Confirmed refresh validation includes Python Option B tests and model-trigger coverage.

## Candidate-status repair

- [x] Reconciled the default candidate gate with the current TSE candidature table checked 2026-10-01.
- [x] Kept the 12 currently deferido presidential candidacies active by default.
- [x] Kept Leonardo Avalanche in the current roster; his TSE status is pending judgment, which is not treated as inactive. Pablo Marçal remains outside the active allowlist because TSE marks the candidacy indeferido.
- [x] Kept Pablo Marçal out of the active allowlist because the current TSE table marks the candidacy indeferido.
- [x] No Jair Bolsonaro candidate ID was added.

## Poll-data refresh

### Added current verified waves

- [x] Datafolha — 2026-10-03; N=4,006; MOE ±2 pp; TSE BR-01708/2026; 1º-turno total and Lula × Flávio 2º-turno.
- [x] Quaest — fieldwork 2026-10-02..2026-10-03; N=3,702; MOE ±2 pp; TSE BR-02197/2026; 1º-turno total and Flávio × Lula 2º-turno.
- [x] CNT/MDA — fieldwork 2026-09-30..2026-10-02; N=2,007; MOE ±2.2 pp; TSE BR-04756/2026; 1º-turno total and Lula × Flávio 2º-turno.
- [x] Palver — fieldwork 2026-09-30..2026-10-03; N=5,000; MOE ±2.4 pp; TSE BR-00198/2026; 1º-turno total plus five published 2º-turno scenarios.
- [x] Added transparent manual-extraction witnesses with `content_hash_basis: manual_extraction`; notes explicitly state that raw source bytes are not stored in-repo.
- [x] Corrected the existing Datafolha 2026-09-29..10-01 first-round row to include the published Wilson Grassi 1% share so its recorded candidate/residual totals match the cited publication more faithfully.

### Rejected / removed

- [x] Removed `indexa_2026-09-29_stimulated_2nd_round_flavio_bolsonaro_vs_lula.json` because that row did not have a verified source supporting the recorded runoff shares. It was not promoted into the canonical 2º snapshot.

## Canonical / integrity state

- [x] Refreshed `site/data/canonical-points.json`.
- [x] Refreshed `site/data/canonical-points-2nd-round.json`.
- [x] 1º canonical: **130** points; duplicate-free; deterministically sorted.
- [x] 2º canonical: **250** points; duplicate-free; deterministically sorted.
- [x] Canonical dataset-version metadata aligned with the corresponding intake cohorts.
- [x] Final integrity audit caught and corrected a cohort-label mismatch before validation/deployment: Sep 28–Oct 1 intake remains cohort 006; Oct 3 intake is cohort 007.
- [x] National and regional data planes remain separate.
- [x] No national multi-UF blend introduced.
- [x] `site/data/chart-regional.json` verified non-empty on current main ancestry (per-UF Option B snapshot).

## Validation / deployment

- [x] Prior main refresh validation run `36653397669` passed `validate-assemble`.
- [x] Maintenance PR #11 merged to main; its main push triggered the Refresh and Pages workflows.
- [x] PR #12 accessibility cleanup and PR #13 candidate-status correction were merged to main; both also trigger the Pages/Refresh paths where their changed files match workflow triggers.
- [ ] Confirm served Pages asset/data responses after deployment — the repository-side merge and Pages trigger are confirmed, but this session cannot fetch the public Pages endpoint or the push-triggered workflow result.
- [x] Pages workflow contains cache-busting for CSS and all shipped JS assets; runtime response confirmation remains an external check.
- [x] Preventive site contract is merged into the refresh validation path; its post-merge run is the authoritative CI gate for future site edits.


## Research-backed items intentionally still open

- [ ] “What changed since last visit” cross-visit strip.
- [ ] Linked domain sync between national and regional views (without adding a brush).
- [ ] Wider regional UF intake beyond the current verified set, only with extractable primary evidence.
- [ ] TSE live-dump freshness: official data-open endpoints may remain blocked from the automated egress; do not bypass.
- [ ] Ipec 2026 national stimulated 1º hard-stop remains in force until a verified extractable primary appears.
- [ ] No image-only PDF/OCR invention.
- [ ] No Playwright discovery/CI.
- [ ] No house-effects / runoff-Monte-Carlo / state-space / MRP model silently promoted to production.

## Current working principle

Every repair in this cycle is either checked off above or explicitly recorded as deferred/blocked. Historical documentation is preserved; no stale pause note is silently rewritten into a false historical claim.

## External verification used for the current data

- UOL polling roundup, 2026-10-03: https://noticias.uol.com.br/eleicoes/2026/10/03/pesquisa-presidente-2026-veja-numeros-dos-levantamentos-ate-este-sabado.ghtm
- Datafolha current report, 2026-10-03: https://www.moneytimes.com.br/pesquisa-datafolha-3-de-outubro-de-2026-gaep/
- Quaest current report, 2026-10-03: https://www.poder360.com.br/poder-eleicoes-2026/lula-tem-46-e-flavio-45-dos-votos-validos-no-1o-turno-diz-quaest/
- CNT/MDA current report, 2026-10-03: https://www.bol.uol.com.br/noticias/2026/10/03/pesquisa-cntmda-hoje-veja-resultados-do-ultimo-levantamento.ghtm
- Palver current report, 2026-10-03: https://noticias.uol.com.br/eleicoes/2026/10/03/pesquisa-palver-lula-e-flavio-tem-empate-tecnico-no-1-turno.ghtm
- TSE candidature status table checked 2026-10-01: https://sig.tse.jus.br/ords/dwapr/r/seai/sig-eleitoral/consulta-candidatos-eleicao


## Election-day follow-up — 2026-10-04

- [x] Confirmed with the TSE that today is the 1º turno (4 Oct) and presidential result disclosure starts at 17:00 Brasília.
- [x] Confirmed the production result distribution uses public JSON files and the presidential federal election code is 6257.
- [x] Repaired Chart #2 so multi-UF selection shows separate per-UF Option B lines instead of hiding the aggregate layer entirely. No blended multi-UF mean is introduced.
- [x] Removed Leonardo Avalanche from the active current-candidate allowlist after his 2026-09-30 renunciation; historical poll observations remain archived.
- [x] Added an explicit election-day boundary banner: polling data is historical and official results are a separate data plane.
- [x] Kept the existing TSE official-results panel separate from polls and Option B; it begins polling only at/after 17:00 BRT.
- [ ] Verify the production TSE payload after 17:00 and adjust only the parser if the live JSON shape differs.
- [ ] Verify the public Pages deployment and browser-rendered UF lines after CI completes.
