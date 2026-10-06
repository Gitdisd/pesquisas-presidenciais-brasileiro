# Election-day maintenance log — 2026-10-04

**Scope:** live-site repair, election-day readiness, and a written checklist of completed work.
**Branch:** `maintenance/election-day`
**Architecture preserved:** Ruby pipeline → Python Option B → static HTML/CSS + vanilla JS + D3. No SPA, TypeScript, Vite, ECharts, Go, WASM, Playwright, or polling/result mixing.

## Completed

- [x] Read the project cold-start/handoff, durable decisions, feature-gap audit, methodology, discovery, cross-reference, regional, and status documentation before editing.
- [x] Reproduced the Chart #2 line issue from the code path: the chart initialized with all UFs selected, while regional Option B aggregate lines are intentionally hidden for multi-UF selections.
- [x] Repaired Chart #2 default state: select one UF automatically, using only distinct verified poll count as the deterministic selection rule. `Todas UFs` remains available as a points-only no-blend view.
- [x] Clarified regional status text so the UI states when a per-UF Option B line is active versus when multi-UF display is points-only.
- [x] Added a separate election-day official-results panel. It does not alter `canonical-points`, `chart.json`, `chart-2nd-round.json`, or regional Option B.
- [x] Added direct TSE result consumption for presidential 1st-round official data using the published 2026 TSE result endpoint; polling starts after 17:00 BRT and refreshes every 30 seconds.
- [x] Added an explicit pre-17:00 waiting state and failure-safe behavior that preserves the last successful official result.
- [x] Added a visible source/separation note so official vote totals cannot be mistaken for polling or Option B output.
- [x] Added Pages cache-busting for the new election-results JavaScript so the live site does not keep an older script after deployment.

## Election-day source contract

The TSE states that presidential results are released from 17:00 Brasília time and updated as ballot boxes are received and processed. The official result service exposes JSON files for this purpose. PEBR therefore keeps election results in a separate UI/data path rather than treating votes as polling observations.

## Remaining / next pass

- [x] Verify the deployed Pages build after merge: Pages run 49 completed successfully, and refresh run 47 completed all validation, drift, Option B, chart-contract, JavaScript/DOM, and Ruby test steps.
- [ ] Add a small automated smoke test for the election-results parser against a checked-in synthetic TSE-shaped fixture, without storing real live vote totals.
- [ ] After the first official update, inspect the live rendering and repair any schema/name/status edge cases exposed by the production payload.
- [ ] Continue polling-intake updates only from verified primary witnesses; never backfill election results as poll records.
- [ ] Add post-election archive mode so the final official result remains inspectable even after live polling stops.

## 2026-10-04 checkpoint

The latest national polling refresh is already on `main` from the previous maintenance pass. This pass focuses on the broken regional line and the separation/readiness of official election-night results.


## CI repair checkpoint — 2026-10-04 14:52 BRT

- [x] Reconciled first-round canonical drift (missing verified `samara_martins: 0` cell).
- [x] Reconciled second-round canonical drift (added verified Datafolha 2026-10-03 pairwise record and matched deterministic key ordering).
- [x] Final `pebr-refresh` run passed all three canonical drift checks, discovery smoke, Python tests, chart contract, JavaScript syntax/DOM contract, and Ruby tests.
- [x] Final Pages deployment completed successfully from `main`.
- [ ] Election-result runtime check remains pending until the TSE's 17:00 BRT release window; the TSE documents that presidential result JSON becomes available from 17:00 and updates during totalization.

## Post-election maintenance — 2026-10-06 12:54 BRT

The 1º turno is now closed. The product has moved from election-night readiness to a permanent 2º-turno polling/archive state.

- [x] Confirmed the official TSE result phase is complete and the site now treats the 1º turno as historical.
- [x] Added a local permanent archive at `site/data/official-results-1st-round.json`; official vote totals are never ingested as polling observations.
- [x] Added `site/js/election-results-core.js` with a synthetic TSE-shaped fixture and Node contract test.
- [x] Replaced the 30-second live-result loop with the checked-in final archive so the public site does not depend on a live TSE JSON endpoint after the election.
- [x] Made the 2º turno the default view on a bare URL while preserving explicit `?round=1` share links as historical first-round views.
- [x] Added an explicit post-first-round phase note to distinguish pre-result polling from evidence collected after 04/10.
- [x] Reconciled the newly published Instituto Veritá national 2º-turno synthesis: 51.56% Flávio Bolsonaro / 48.44% Lula, N=40,500, fieldwork 26/09–02/10. This is included as a **pre-result-fieldwork** observation, not mislabeled as a post-first-round poll.
- [x] Activated Veritá in the institute registry and attached primary-index + press witnesses.
- [x] Updated the 2º-turno canonical snapshot so Pages regeneration will incorporate Veritá into `chart-2nd-round.json`.
- [x] No scheduled-but-not-yet-published polls were fabricated: current reporting indicates the first post-first-round fieldwork releases from Datafolha and PoderData are expected from 08/10, with AtlasIntel expected 09/10.

### Current evidence boundary

The post-04/10 polling series should only gain a new observation when its fieldwork has actually occurred and the published result has a verified primary witness. Scheduled fieldwork is not treated as a poll.

Veritá's 2026-10-05/06 publication is intentionally retained because it is a real published national 2º-turno synthesis, but its interviews ended before the 04/10 vote. The UI and documentation explicitly distinguish this from the next generation of post-result polls.

### Sources checked on 2026-10-06

- TSE official result publication / first-round completion: https://www.tse.jus.br/comunicacao/noticias/2026/Outubro/flavio-bolsonaro-e-lula-vao-disputar-o-2o-turno-para-a-presidencia-da-republica
- TSE official results portal documentation: https://www.tse.jus.br/eleicoes/informacoes-tecnicas-sobre-a-divulgacao-de-resultados
- Instituto Veritá publication index: https://eleicoes26.institutoverita.com.br/
- Veritá national synthesis cross-check: https://folhadepatrocinio.com/noticias/pesquisa-verita-nacional/
- Current second-round polling schedule: UOL reporting published 2026-10-05
