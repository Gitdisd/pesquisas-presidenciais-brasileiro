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

- [ ] Verify the deployed Pages build after merge and confirm the browser can read the TSE endpoint from GitHub Pages once the official result file is available.
- [ ] Add a small automated smoke test for the election-results parser against a checked-in synthetic TSE-shaped fixture, without storing real live vote totals.
- [ ] After the first official update, inspect the live rendering and repair any schema/name/status edge cases exposed by the production payload.
- [ ] Continue polling-intake updates only from verified primary witnesses; never backfill election results as poll records.
- [ ] Add post-election archive mode so the final official result remains inspectable even after live polling stops.

## 2026-10-04 checkpoint

The latest national polling refresh is already on `main` from the previous maintenance pass. This pass focuses on the broken regional line and the separation/readiness of official election-night results.
