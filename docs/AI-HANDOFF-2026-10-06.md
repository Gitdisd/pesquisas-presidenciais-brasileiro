# PEBR — Save State / Handoff — 2026-10-06

**Purpose:** durable save-state for starting a new chat without reconstructing this session from conversation history.

**Repository:** https://github.com/Gitdisd/pesquisas-presidenciais-brasileiro  
**Pages:** https://gitdisd.github.io/pesquisas-presidenciais-brasileiro/  
**Main tip at save:** `7cba99d3497a9995f84d13fb77329469835defd4`  
**Last maintenance window recorded:** 2026-10-04 (election day), with the final documentation checkpoint committed after CI/Pages verification.

---

## 1. Resume immediately from this state

The project is **not at the old September pause state anymore**. Election-day maintenance resumed and the following repairs/features are already on `main`.

### Completed — [x]

- [x] Re-read the core project/handoff and operational documentation before the election-day maintenance work.
- [x] Preserved the locked architecture: Ruby pipeline → Python Option B → static HTML/CSS + vanilla JS + D3.
- [x] Preserved the explicit exclusions: no TypeScript, SPA, Vite, ECharts, Go, WASM estimators, Playwright, brush/range slider, all-candidate hover scoreboard, silent house effects, invented shares, or national/regional blending.
- [x] Repaired **Chart #2 / Pesquisas regionais (UF)** missing-line behavior.
- [x] Root cause: the regional chart initially selected all UFs; by design, a multi-UF selection cannot show a blended Option B line, so the line appeared absent.
- [x] Regional default now deterministically selects **one UF** so its independent Option B line is visible on first load.
- [x] `Todas UFs` remains available and intentionally shows separate raw points without a blended Brazil-style mean.
- [x] Regional status copy now explicitly states when the per-UF Option B line/ribbon is active versus the no-blend multi-UF state.
- [x] Fixed the missing `data-through` DOM binding used by the national polling freshness indicator.
- [x] Added an election-day banner separating historical polling from official vote counting.
- [x] Added a dedicated **official TSE presidential-results panel**.
- [x] Official results are kept completely separate from poll canonical data and all Option B chart artifacts.
- [x] Official-result polling starts only after 17:00 BRT and refreshes every 30 seconds.
- [x] Added failure-safe result loading: if a refresh fails after a successful result, the last displayed result is retained.
- [x] Added cache-busting for the election-results JavaScript.
- [x] Reconciled first-round canonical drift (including the verified `samara_martins: 0` cell).
- [x] Reconciled second-round canonical drift and deterministic pairwise key ordering.
- [x] Current presidential candidate UI roster was updated after **Leonardo Avalanche's renunciation**; historical records remain archived and are not silently relabeled.
- [x] Maintained the current active allowlist without Pablo Marçal.
- [x] Confirmed the previous late-September national polling refresh is already on `main`.
- [x] Final `pebr-refresh` validation passed according to the election-day maintenance log.
- [x] Final Pages deployment passed according to the election-day maintenance log.
- [x] CI includes JavaScript syntax checks, DOM-id contract checks, canonical drift checks, Option B tests, chart contract checks, discovery smoke, and Ruby tests.

### Key commits from the election-day repair chain

- `0870b52062234051aff0739eb0422a5b689b9a89` — regional line fix + official TSE results panel + election-day wiring.
- `287732ebff70f1455e8ef515bf463e3f02d08063` — reconcile assembled canonical snapshot.
- `b80f6b945c3a229cdbf9b2955cb113ed53a31b2c` — reconcile second-round canonical snapshot.
- `40da431dea505d53fd331be43baf59fd4a9336a7` — deterministic second-round key ordering.
- `5be318944781ce8c53b2637e3bc57d7f73e1e66b` — consolidated regional/election-day/data-freshness repair.
- `5bd36bbf0194e8b7b128167db9730ec87f5e7127` — documentation checkpoint marking CI + Pages verification.

---

## 2. Files that matter most

### National / product

- `site/index.html`
- `site/css/app.css`
- `site/js/chart.js`
- `site/js/option-b.js`
- `site/js/candidates-config.js`
- `site/js/companion-chart.js`
- `site/js/election-results.js`

### Regional

- `site/js/regional-chart.js`
- `site/data/canonical-points-regional.json`
- `site/data/chart-regional.json`

### National data

- `data/national/polls/`
- `data/national/witnesses/`
- `site/data/canonical-points.json`
- `site/data/canonical-points-2nd-round.json`
- `site/data/chart.json`
- `site/data/chart-2nd-round.json`

### Pipeline / CI

- `bin/pebr`
- `lib/pebr/`
- `models/pebr_models/`
- `schemas/`
- `config/`
- `.github/workflows/pages.yml`
- `.github/workflows/refresh.yml`

---

## 3. Locked product/data rules — DO NOT REOPEN

### Architecture

```
Ruby pipeline → Python Option B → static HTML/CSS + vanilla JS + D3
```

No new SPA/framework/bundler stack.

### National vs regional

- National Option B consumes only `geography: national`.
- Regional data lives under `data/regional/`.
- Regional output is `canonical-points-regional.json` / `chart-regional.json` only.
- Never pool multiple UFs into a Brazil aggregate.
- For the regional chart, one selected UF may show its independent Option B line/ribbon.
- Two or more UFs may be displayed as separate point/line series, but **never** as a single blended mean.

### Poll integrity

- No invented percentages.
- No OCR-based invention.
- No auto-extraction of poll shares in CI.
- Discovery is lead generation only.
- Human primary witness + dual-entry + identity/anti-replicate checks remain mandatory.
- TSE registration IDs are provenance, not poll shares.
- Historical poll rows must not be silently relabeled.

### Option B

- `option_b_sqrt_n_trailing`
- trailing 14 days
- sample-size weight based on sqrt(N), capped at 4000
- same-institute anti-flood sqrt(1/m) over 14 days
- fieldwork midpoint dating
- no house effects
- descriptive in-window weighted dispersion only
- ribbons are not classical confidence intervals and not win probabilities
- scenarios remain separate

### UX locks

- point-only hover/detail
- TradingView-style pan/zoom
- no bottom brush/range slider
- no multi-candidate hover scoreboard
- no CSV/JSON export buttons in the Pages UI
- shareable URL/state remains
- independent collapsible Institutos / Candidatos / Modelo sections
- Chart #2 means UF/regional geography, not the national second-round chart

### Candidate scope

The current active UI roster is the twelve candidates retained after Leonardo Avalanche's renunciation:

`lula`, `flavio_bolsonaro`, `samara_martins`, `romeu_zema`, `hertz_dias`, `edmilson_costa`, `renan_santos`, `wilson_grassi`, `clariana_barao`, `augusto_cury`, `ronaldo_caiado`, `rui_costa_pimenta`.

Historical candidate IDs remain possible in archived records but are hidden from the default election UI. Michelle Bolsonaro remains permanently excluded.

---

## 4. Election-day official-results implementation

Current production script:

`site/js/election-results.js`

Behavior:

- Uses the public TSE 2026 presidential results JSON endpoint.
- Does not write poll files.
- Does not modify Option B.
- Does not turn vote totals into poll points.
- Waits until 17:00 BRT before attempting official-result loading.
- Refreshes every 30 seconds.
- Displays section totalization, votes counted, turnout, timestamp, candidate votes/percentage/status.
- Clearly labels these values as official results, not polls.

### Post-election requirement

The official-results panel was built for live election day. **The next maintenance pass should decide/implement a permanent post-election archive behavior** so the final official total remains inspectable instead of depending on a live upstream JSON endpoint forever.

---

## 5. Known follow-up work

### Highest priority

- [ ] Add a checked-in **synthetic TSE-shaped fixture** and a small automated parser/render contract test for `election-results.js` behavior. Do not store live vote totals in the fixture.
- [ ] After/while the official TSE payload is available, inspect the production payload for schema/name/status edge cases and harden the parser if needed.
- [ ] Add post-election archive mode for the final official result.
- [ ] Re-check the public Pages rendering on a real browser/phone after the election-day deployment, especially:
  - Chart #2 default UF line visibility
  - `Todas UFs` no-blend behavior
  - official result table
  - mobile layout
  - refresh states
  - candidate labels
- [ ] Continue verified polling updates only from primary witnesses; never model election results as polls.

### Medium priority from the standing R&D queue

- [ ] Soft-twin/fingerprint audit across the expanded national set.
- [ ] Option B stress fixtures for institute flooding and edge cases.
- [ ] Contract coverage for canonical → chart JSON → UI loading.
- [ ] Optional machine-readable pipeline/site health status if still useful.
- [ ] More regional UFs only when extractable verified primaries exist.

---

## 6. Documentation reviewed / authoritative references

Core documents used for this maintenance state:

- `README.md`
- `docs/AI-HANDOFF.md`
- `docs/conversation-decisions.md`
- `docs/feature-gap-audit.md`
- `docs/suggestions-and-research.md`
- `docs/advanced-polling-rnd.md`
- `docs/architecture.md`
- `docs/scenario-convention.md`
- `docs/manual-intake.md`
- `docs/discovery.md`
- `docs/regional.md`
- `docs/cross-reference.md`
- `docs/lead-status-log.md`
- `docs/pipeline-status-log.md`
- `docs/pipeline-conversation-decisions.md`
- `docs/old-site-deep-port.md`
- `docs/conversation-transcript-README.md`

Election-day maintenance log:

- `docs/election-day-maintenance-2026-10-04.md`

That log is the primary record for the Oct. 4 repair checkpoint and says the final refresh validation and Pages deployment were successful.

---

## 7. Safe startup sequence for the next chat

1. Read this file first.
2. Read `docs/election-day-maintenance-2026-10-04.md`.
3. Verify `main` still points to `5bd36bbf0194e8b7b128167db9730ec87f5e7127` or a descendant.
4. Inspect the current Pages/Actions state before changing deployment code.
5. Inspect the current official TSE payload behavior before adding any result-specific logic.
6. Make small, isolated changes; update this save-state/checklist in the same maintenance cycle.
7. Run:
   `node --check` for all site JS,
   `python -m pytest models/tests -q`,
   `bin/pebr validate`,
   `bin/pebr normalize`,
   `bin/pebr assemble`,
   chart/DOM contract checks,
   and the relevant Ruby tests.
8. Do not overwrite canonical/chart artifacts with ad-hoc generated data.
9. Record what changed, what was verified, and what remains open.

---

## 8. Important historical context

The older September handoff said product work was paused and that Chart #2's Option B file was an empty stub. That state is **superseded** by the election-day commits listed above.

Do not restart the project from that September snapshot.

The present state already includes:

- populated regional Option B output,
- regional line repair,
- official-results panel,
- election-day UI boundary,
- candidate-roster update,
- canonical reconciliation,
- deterministic second-round output ordering,
- verified CI/Pages deployment.

---

## 9. Save-state principle

This file is intentionally operational rather than conversational. On the next chat, use it as the starting state, then confirm live repository/Actions state before making new changes.

## 11. Final verification checkpoint — 2026-10-06

- [x] Post-first-round maintenance merged to `main`: `9a11c535b7a9d50946daf352c99d9b52c94933a8`.
- [x] Parser/fixture CI hardening followed on `main`.
- [x] Final `pebr-refresh` run `37493427640` passed all validation, canonical drift, discovery, Option B, chart, JavaScript/DOM, and Ruby tests.
- [x] Pages run `37493030398` for the merged product commit completed successfully.
- [x] The published Pages artifact therefore contains the archived 1º-turn result path and the regenerated 2º-turn chart based on the verified canonical set.
- [ ] Direct browser rendering verification remains unavailable from this environment; repository-side deployment is verified.

**Last saved:** 2026-10-06

## 10. Post-first-round update — 2026-10-06

This save-state was opened on 2026-10-06 after the first round had concluded.

### Completed in this maintenance pass

- [x] First round is treated as historical; second round is now the bare-URL default.
- [x] Explicit `?round=1` URLs remain valid for archived first-round views.
- [x] Final TSE first-round result is archived locally in `site/data/official-results-1st-round.json`.
- [x] Official-result parsing is isolated in `site/js/election-results-core.js`.
- [x] Synthetic TSE-shaped fixture + Node contract test added.
- [x] Election-night 30-second remote polling loop removed from production UI.
- [x] Veritá's newly published national 2º-turno synthesis added with witnesses and canonical reconciliation:
  - N=40,500
  - fieldwork 2026-09-26..2026-10-02
  - Flávio Bolsonaro 51.56% valid
  - Lula 48.44% valid
  - explicitly marked pre-result-fieldwork; never described as a post-04/10 poll.
- [x] Veritá activated in `config/institutes.yml`.
- [x] Pages cache-busting extended to the election-result parser core.

### Polling boundary as of 2026-10-06

Do not add future scheduled surveys as if they are already observations. Current reporting shows Datafolha fieldwork 06–08/10 (release expected 08/10), PoderData fieldwork 05–07/10 (release expected 08/10), and AtlasIntel fieldwork 03–08/10 (release expected 09/10). Once published and verified, these should enter the 2º-turno series with their real field dates.

### Next work

- [ ] Run repository CI on this branch/PR and repair any contract failures.
- [ ] Merge only after validation is green.
- [ ] Verify the deployed Pages artifact on real browser/mobile if available.
- [ ] Add each newly published post-result poll through the primary-witness gate; regenerate the 2º-turno Option B chart from canonical data.
- [ ] Revisit regional UF intake after new verified regional primaries appear.
- [ ] Keep the first-round archive and official-result panel read-only and separate from polling.
