# Lead status log

**Snapshot:** 2026-09-27 02:20 BRT (America/Sao_Paulo)
**Lane:** Lead + pipeline coordination
**Repository:** `Gitdisd/pesquisas-presidenciais-brasileiro`

This is the durable pause snapshot for the Lead lane. It records the state and decisions known at the user-ordered pause; it is not an authorization to resume work or to reinterpret pending work as complete.

> **Correction (2026-09-27):** PR #1 is **MERGED**; regional **24** points are on main (`bf4ee83` → `59f9f03`). Treat conflicting/WAITING-on-merge wording below as outdated — see [`docs/AI-HANDOFF.md`](AI-HANDOFF.md) for the cold-start source of truth.

## Pause notice

Work paused per user on **2026-09-27**. Do not continue features, intake, exports, merges, or coordination intake until the user explicitly says to resume.

## Architecture (locked)

The locked product direction is:

- Ruby pipeline → Python Option B → static HTML/CSS + vanilla JS + D3.
- No TypeScript and no SPA architecture.
- Do not restyle the product back to the old look.
- No brush slider.
- No hover scoreboard.
- Michelle is out of scope.
- Playwright is out of discovery.

These constraints remain in force when work resumes. “Feature ports” means behavioral parity where explicitly selected, not a wholesale visual rollback.

## Live site / repo

- Live site: https://gitdisd.github.io/pesquisas-presidenciais-brasileiro/
- Repository: https://github.com/Gitdisd/pesquisas-presidenciais-brasileiro
- Key docs:
  - [`docs/feature-gap-audit.md`](feature-gap-audit.md)
  - [`docs/old-site-deep-port.md`](old-site-deep-port.md)
  - [`docs/regional.md`](regional.md)
  - [`docs/discovery.md`](discovery.md)

## Data counts (last known)

Counts below are the last known pause snapshot, not a request to regenerate data:

- National 1º: **117** (`canonical-points.json` / `chart.json`).
- National 2º: **203** (`canonical-points-2nd-round.json` / `chart-2nd-round.json`).
- Regional: **24** on the PR #1 branch (`canonical-points-regional.json`) — **not confirmed on main at pause**. Chart #2 Option B export was **WAITING on merge**.

## Done recently (Lead)

The recent Lead lane work, recorded by commit, includes:

- `d7332a1` and `c585576` — established the Pages site and its GitHub Pages deployment.
- `f9d7c4a` — enlarged the chart and brought over the old-site period, CSV, and candidate filters.
- `6a5f30f` — added TradingView-style chart pan/zoom, with no range brush.
- `8350466` — ported old-site P0 behavior: JSON export, share URL, Option B PT, and client-side filter aggregation.
- `6f298d5` — ported old-site P1 behavior: summary cards, metrics, theme, poll table, and shortcuts.
- `beefe64` — added the in-page data verification stamp.
- `6a16f46` — added independent collapsible chart filters.
- `b6e6230` and `21566df` — fixed filter-collapse behavior and made collapse headers full-width/obvious.
- `2b4ddad` — added features-only pagination, search, fullscreen, and share-URL institute bitmask behavior.
- `4a7c81b` — Option B re-export at the known national counts: 117 first-round / 203 second-round.
- `ecb9e4a` — added the interim national companion (Capítulo 2) and the old-site deep-port memo.
- `7d65082` — added the Chart #2 regional UI shell, including empty-state behavior while awaiting data.
- `bf4ee83` — produced the known Chart #2 regional primary-backed fill (24 points) on the regional branch.

Export buttons were removed as part of the current product direction. The deep-port memo and interim national companion are documentation/product context, not permission to resume. Option B re-exports are known work and remain gated by the pause and by canonical-data changes.

## In progress at pause (Lead)

- Chart #2 Option B re-export of `chart-regional.json` was blocked on the PR #1 merge conflict.
- The Continuous Pipeline tasking loop was in progress.

Both items are paused. No re-export or conflict-resolution work should be started during the pause.

## Planned / yet to do (Lead)

When the user resumes work, the outstanding Lead plan is:

1. Finish `chart-regional.json` after the regional 24 points are confirmed on main.
2. Light up the Chart #2 UI with real UF data.
3. Port more behavior from `docs/old-site-deep-port.md` and `docs/feature-gap-audit.md`; behavior only, within the locked architecture.
4. Run an Option B re-export whenever the national canonical dataset grows.
5. Apply true Chart #2 polish: UF filters and no national blend.

These are deferred items, not active tasks while paused.

## Pipeline coordination (at pause)

The ordered Pipeline priorities were:

1. Regional fill.
2. Anti-replicate.
3. Acquisition robots.
4. Continuous report-back.

The last Pipeline report was:

- `a72251e` — foundation, regional work, anti-replicate, and discovery hardening.
- `5e6be49` / PR #1 — report reference for the 24 regional points; rebase was **CONFLICTING** and in flight at the pause.

Pipeline was asked to document its state in `docs/pipeline-status-log.md` and then idle. Coordination is therefore documentation-only until an explicit resume instruction.

## Explicitly NOT doing while paused

- No merges, including PR #1.
- No dual-enter.
- No UI features.
- No restyle.
- No inventing data.
- No intake or discovery continuation.
- No chart re-exports.
- No changes to site JavaScript.

## Resume gate

Resume only after an explicit user instruction. On resume, first reread this log and the key docs above, verify the data/branch state, and reconcile any pipeline report before selecting one deferred item. Until then, this file is the source-of-truth pause record for the Lead lane and coordination state.
