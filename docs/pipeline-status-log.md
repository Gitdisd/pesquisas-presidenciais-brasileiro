> **Superseded for current execution (2026-10-04):** This file is a frozen historical pause snapshot. The user's explicit update/repair order resumes work. See [docs/maintenance-log-2026-10-04.md](maintenance-log-2026-10-04.md) for the current checklist and status.

# Pipeline status log — USER PAUSE

**Frozen at:** 2026-09-27 02:22 BRT (America/Sao_Paulo)  
**Lane:** Pipeline (documentation only — user halt)  
**Repository:** https://github.com/Gitdisd/pesquisas-presidenciais-brasileiro  
**Verified main tip at write time:** `59f9f0384eeb163f5e0eec485eb54b005f4e4fe3` (`origin/main`)  
**Constraint:** documentation ONLY. Do **not** merge further PRs, dual-enter polls, expand acquisition, or touch UI/charts from this log.

This file is the durable pause snapshot for the Pipeline workstream. It records verified SHAs, counts, mid-flight work, planned work, and blockers. It is **not** authorization to resume intake, rebase, merge, or export.

---

## 1) Finished (with SHAs, files, counts)

Verified with `git fetch`, `git log`, `gh pr view 1`, and file reads on `origin/main` at the freeze time above.

### Main tip (honest)

| Ref | Full SHA | Note |
|-----|----------|------|
| **main / origin/main** | `59f9f0384eeb163f5e0eec485eb54b005f4e4fe3` | Merge commit: `Merge pull request #1 from Gitdisd/pipeline/regional-chart2-primary-fill` |
| PR #1 merge | merged **2026-09-27 02:19 BRT** (`2026-09-27T05:19:07Z`) | State at freeze: **MERGED** (briefing earlier said CONFLICTING — see §2) |
| Regional fill landed | `bf4ee83d9bd3a7a0c1d54a7ec8bc8ff88b11fefb` | `feat(regional): Chart #2 primary-backed SP/MG/DF/PE fill (24 points)` |
| Chart #2 UI shell (Lead) | `7d6508281e10bcbe13dccc4729d0ebc1511a1e57` | On main; preserved as first-parent ancestor of the merge |

**SHA note (5e6be49 vs bf4ee83):** briefing cited tip `5e6be49babe015d307ff0995ec1370354204ab31`. That object exists locally with the same subject line and parent `a72251e`, but it is **not** on `main`. The commit that landed via PR #1 is the amended tip **`bf4ee83`** (authored ~2 min later). Treat `5e6be49` as a superseded pre-amend tip; do not expect it on `origin/main`.

### National counts on main (verified)

| Artifact | Count | Path |
|----------|------:|------|
| 1º canonical points | **117** | `site/data/canonical-points.json` |
| 2º canonical points | **203** | `site/data/canonical-points-2nd-round.json` |
| National poll JSON files | 320 | `data/national/polls/*.json` |
| National witnesses | 178 | `data/national/witnesses/*.json` |

Matches briefing (~117 1º / ~203 2º) and Option B re-export commit `4a7c81b` (“117 1º / 203 2º”).

### Regional counts on main (verified — now on main)

| Artifact | Count | Path |
|----------|------:|------|
| Regional canonical points | **24** | `site/data/canonical-points-regional.json` |
| Regional poll JSON files | 24 | `data/regional/polls/*.json` |
| Regional witnesses | 14 | `data/regional/witnesses/*.json` |

**By UF (canonical points):** DF 2 · MG 6 · PE 10 · SP 6.  
**Scenarios:** 10× `stimulated_1st_round`; 10× `stimulated_2nd_round_flavio_bolsonaro_vs_lula`; plus Atlas PE extras (Cury / Renan / Zema / Caiado) ×1 each.

`site/data/chart-regional.json` **on HEAD** is still the **empty stub** (`series` length **0**). Lead Option B regional export was mid-flight in the working tree only (see §2) — **not** committed.

### Pipeline cohort / stabilize SHAs (approx chain)

| SHA (short) | Full SHA | Subject / note |
|-------------|----------|----------------|
| `71ca278` | `71ca2783e077d6ecb65f07c550d893119e3e2aa4` | Stabilize / assemble + harden `pebr-refresh` Actions skeleton |
| `a14efe9` | `a14efe978b3bc8810de373db87b93f800bd9dfb3` | **2T-001** — 2º scenario path + 10 verified |
| `5ee2857` | `5ee2857861cef7cf2725f76e7ee924c929d9923c` | **2T-002** — 33 earlier Datafolha/Quaest 2º |
| `f9658d4` | `f9658d457b167073f32d806c8d47d1b142ef636a` | **2T-003** — 30 earlier Datafolha/Quaest 2º |
| `09dda49` | `09dda496db90fb3ee73748e0c65b85d3e3e3febc` | **2T-004** — 25 other-institute national 2º |
| `6a45ffd` | `6a45ffd889a36a6beb2a22854e6823e6333aaeb1` | **2T-005** — 34 earlier-wave + DF mop 2º |
| `4abd14b` | `4abd14b1600436327be8d5ce4f91301b9c6bd1f8` | **2T-006** — 34 PoderData + Futura/GERP/CNT/Atlas mop 2º |
| `41fdab9` | `41fdab92a22153d59bb44fd636fdc95ed08f301a` | **2T-007** — RTBD/Futura/GERP/CNT mop; cohort note expects **193** 2º |
| `e215d0a` | `e215d0a8c578bedd7581d21ab97132a5fa50110a` | **2T-008** intake — Meio/Ideia Sep mop + Palver Sep-23 2º + TSE wayback lead → **117 / 203** |
| `4a7c81b` | `4a7c81b510010ea53a9ace1d8d04d3a9b3dbdeea` | Lead Option B re-export: **117 1º / 203 2º** (post–`e215d0a`) |

Cohort notes on disk: `data/national/INTAKE_COHORT_2T_00{1..8}.md` (and earlier 1º cohorts `INTAKE_COHORT_00{1..8}.md`).

### Discovery / hardening / regional foundation SHAs

| SHA (short) | Full SHA | Subject / note |
|-------------|----------|----------------|
| `561ee5e` | `561ee5e441919d26a763f2b3192f09dc4b763e92` | Human-gated discovery **watch** + refresh hardening |
| `cee97e7` | `cee97e7f1fb1f49c3d26677180743aa5a807da3d` | RSS-first watch + archive **bypass** / fallback past listing blockers |
| `ebaaa48` | `ebaaa481a0ae412124435c98b1664fe6b593aa0f` | Acquisition **robust**/harden — human drop + TSE provenance leads |
| `8f7f139` | `8f7f139f40f7157b209d655420c153aa46fbc6a5` | **Extras:** inbox operator path, watch expansion, **old-site leads** |
| `a72251e` | `a72251e5bff70fd403752f5267787a410689a482` | **Regional foundation** + **anti-replicate** + discovery harden |
| `bf4ee83` | `bf4ee83d9bd3a7a0c1d54a7ec8bc8ff88b11fefb` | **Regional fill** (24 points) — landed on main via PR #1 |

### Supporting surfaces finished on main (docs / ops, not re-entered here)

- Anti-replicate: CI fixtures for fingerprint twin + soft-twin hard-fail; national↔regional same-wave fingerprints stay distinct (`a72251e` / `bf4ee83`).
- Watch + inbox: `config/watch_targets.yml`, `data/national/discovery/{queue,inbox,last-run}.json`, regional queue under `data/regional/discovery/`.
- Old-site leads: fixtures under `fixtures/discovery/` + watch target `old-site-regional-leads` (URL leads only — never copy candidate %).
- Docs: `docs/discovery.md`, `docs/regional.md`, `docs/manual-intake.md`, `docs/cross-reference.md`, ADR regional parallel tree, `data/regional/README.md`, `site/data/README.md`.

---

## 2) Mid-doing when paused

Recorded as of the user halt. **Honest drift vs pause brief is called out.**

### PR #1 — briefing vs freeze-time truth

| Item | Pause brief | Verified at freeze |
|------|-------------|--------------------|
| Branch | `pipeline/regional-chart2-primary-fill` | same |
| Mergeability | **CONFLICTING / DIRTY** vs main; rebase owned by Pipeline | **MERGED** into main (`59f9f03`) at 2026-09-27 02:19 BRT |
| Tip | `5e6be49…` | Landed tip **`bf4ee83…`** (amended); `5e6be49` not on main |
| Lead Chart #2 UI shell | must preserve `~7d65082` | **`7d65082` is on main** (merge first-parent ancestor) |
| Regional 24 points | “NOT yet on main” | **On main** via merge (`canonical-points-regional.json` len=24) |

Interpretation for resume: the conflict/rebase fight described in the brief appears to have completed (merge commit present) **before or during** this documentation pass. Do **not** re-open a merge of PR #1. Ping exact main SHA: **`59f9f0384eeb163f5e0eec485eb54b005f4e4fe3`**.

### Lead Chart #2 Option B re-export (paused mid-flight)

- Expectation: Lead re-exporting `site/data/chart-regional.json` once 24 points exist on main.
- **HEAD** still has empty stub (`series: []`).
- Working tree at freeze had **uncommitted** dirty edits (do **not** commit from Pipeline pause docs):
  - `site/data/chart-regional.json` (large expansion; local series length observed ~813)
  - `models/pebr_models/{aggregate,cli,export,types}.py` (export path WIP)
- Subagents / Continuous Pipeline loop: **stopped** on user pause.
- Local stashes present (`wip-before-rebase`, `local-site-wip-before-pull`, `wip-ui`) — leave untouched.

### What was explicitly not started from this halt

No further dual-enter, no national queue mop execution, no UI/chart commits, no Playwright, no acquisition expansion.

---

## 3) Planned / yet to do (do NOT start)

Frozen checklist — resume only on explicit user order:

1. **PR #1 follow-through** — Rebase/merge itself looks **done** at `59f9f03`. Remaining: confirm Lead has the ping SHA and that Chart #2 Option B export targets main tip (no second merge of #1).
2. **More regional UF dual-enter** — Prefer-UF first fill was SP/MG/DF/PE; other UFs (GO/PR/CE/SC/TO/PA/AC/…, Quaest RJ, etc.) still leads-only where extractable primary exists.
3. **National queue mop** — If clean primary appears in `data/national/discovery/queue.json` (large human-gated queue on disk); enter only with witnesses; no inventing.
4. **Chart #2 Option B on main after merge** — Lead-owned: finish `chart-regional.json` series export from the 24 canonical regional points; light UI Chart #2. Preserve no-blend / no national Option B merge rules (`docs/regional.md`).
5. **Optional** — `pipeline-status.json` / poll-witness-index (machine-readable status); only if requested.

---

## 4) Blockers (still in force)

| Blocker | Status / note |
|---------|----------------|
| **TSE CDN / dadosabertos 403** | Live fetch blocked; Wayback lagging — leads only (`e215d0a` wayback lead work) |
| **Ipec 1º hard-stop** | Ipsos-Ipec 2026 national stimulated 1º — no verified extractable primary; hard-stop upheld |
| **Michelle permanently out** | No Michelle×Lula (or other Michelle) scenarios |
| **Playwright out** | Discovery must not use Playwright |
| **Quaest Jun-08 dirty** | Flávio Arte / Caiado residuals / sum issues — still blocked |
| **Atlas Sep-16 residuals** | Zema/Caiado/Cury/Renan — candidate % without residual prose — still blocked |
| **Image-only PDFs** | No inventing from chart images without labeled shares (Atlas PE PDF share charts held; CNN prose used where applicable) |
| **PR conflict** | Briefing blocker; at freeze PR #1 is **merged** — conflict no longer open on that PR. Any *new* main drift vs regional WIP remains a process risk for future PRs |

Regional intake holds called in PR #1 body (still relevant for *next* dual-enter, not for the landed 24): RTBD MG institute PDF missing on CNN (HTML used); Atlas PE image-heavy PDF; Quaest RJ + non-prefer UFs leads only.

---

## Related docs

- [`docs/TASK-LOG-PAUSE.md`](TASK-LOG-PAUSE.md) — short frozen checklist
- [`docs/regional.md`](regional.md), [`docs/discovery.md`](discovery.md), [`docs/manual-intake.md`](manual-intake.md)
- [`docs/lead-status-log.md`](lead-status-log.md) — Lead-lane pause snapshot (if present; separate lane)

---

*End of Pipeline pause log. No further Pipeline actions from this document until user resume.*
