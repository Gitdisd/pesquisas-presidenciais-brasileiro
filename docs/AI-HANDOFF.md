# AI HANDOFF — PEBR Lead (cold start)

**Written:** 2026-09-27 ~02:30 BRT (America/Sao_Paulo)  
**Repo tip at write:** `8c79e15` (`docs: pipeline pause status log`) — verify with `git rev-parse HEAD` on resume

> **Current override — 2026-10-04:** The user explicitly ordered a live-site update and repair pass, including documentation reconciliation and a running checklist. The 2026-09-27 pause instructions below are historical snapshots; current execution is tracked in [`maintenance-log-2026-10-04.md`](maintenance-log-2026-10-04.md).  
**Lane:** PEBR Lead (product / Option B / static UI)  
**Status:** **ACTIVE MAINTENANCE — RESUMED 2026-10-04 by explicit user order**

This file is the **single cold-start brief** for another AI (or human) picking up Lead. Prefer this over reconstructing state from chat. Pause snapshots remain authoritative for “what was frozen”; this handoff reconciles corrected facts (especially PR #1 **merged**).

For the durable user prompts and the explanations behind the product locks, read [`conversation-decisions.md`](conversation-decisions.md) (curated decisions) and the RAW-style dumps indexed in [`conversation-transcript.md`](conversation-transcript.md) ([`lead-conversation-transcript.md`](lead-conversation-transcript.md), [`pipeline-conversation-transcript.md`](pipeline-conversation-transcript.md)). See [`conversation-transcript-README.md`](conversation-transcript-README.md).

### Expert R&D (docs, 2026-09-27)

Deep advanced-polling / toggleable-Modelo research (no product code):

- [`docs/advanced-polling-rnd.md`](advanced-polling-rnd.md) — full math cookbook, toggle catalog, projection “do not claim”, bibliography
- Summary: [`docs/suggestions-and-research.md`](suggestions-and-research.md) §3
- Appendix pointer: [`docs/suggestions-research-findings.md`](suggestions-research-findings.md) Appendix A



---

## 0) Mission (one paragraph)

**Pesquisas Presidenciais Brasileiro (PEBR 2026)** archives verified Brazilian **national** (and separately **UF/state**) presidential polls and publishes a GitHub Pages research UI: Ruby pipeline → Python Option B aggregate → static HTML/CSS + vanilla JS + D3. Lead owns the Pages site, Option B chart exports, and product behavior ports from the old site **without** restyling to the old look and **without** inventing poll shares. Pipeline owns schemas, dual-enter intake, discovery queues, assemble, and anti-replicate. **Chart #1** = pure national Option B. **Chart #2** = regional/UF **geo isolation** (never contaminate national). National 1º vs 2º files are a **round/scenario** split — not the Chart #2 job.

---

## 1) Pause state (read this first)

| Fact | Value |
|------|--------|
| User halt | **2026-09-27** — no features, intake, exports, merges, or chart regen until **explicit resume** |
| Product work | **IDLE** |
| Docs-only exception | This handoff + pause logs (already on main) |
| PR #1 | **MERGED** (`59f9f03`) — regional **24** points on main via `bf4ee83` |
| Chart #2 UI shell | **Shipped** on main (`7d65082`) |
| Option B `chart-regional.json` | Still **empty stub on HEAD** (`series: []`) — **FIRST Lead action after unpause** (not blocked on any PR) |
| Working-tree WIP | Uncommitted Option B `--geography state` path + a local non-empty `chart-regional.json` (~813 series) may exist on the shared box — **do not commit blindly**; finish/test on resume, then commit as Lead |

**Resume gate:** only after the user says to resume. Then follow §9 step-by-step.

---

## 2) Locked architecture & non-negotiables

### Stack (do not reopen)

```
Ruby pipeline (bin/pebr)  →  Python Option B (models/pebr_models)  →  static HTML/CSS + vanilla JS + D3 SVG
```

- **No** TypeScript, SPA, Vite, ECharts, bundlers, Go, or WASM estimators on NEW.
- **No** restyle back to the old site look (“features not skin”).
- **No** brush / bottom range slider.
- **No** all-candidate hover scoreboard (point-only hover + external detail panel).
- **Michelle Bolsonaro permanently out** of scope / scenarios.
- **Playwright out** of discovery and CI.
- **Never invent** poll percentages (CI never auto-extracts or auto-commits shares).
- **National Option B** consumes **only** `geography: "national"`.
- **Regional** lives in a **parallel tree** (`data/regional/`); assemble → `canonical-points-regional.json` **only**; **never** merge into `canonical-points.json` / `chart.json` / `chart-2nd-round.json`.
- **Multi-geo no-blend:** aggregate line only when **≤1 UF** selected; never market a multi-UF mean as Brazil.
- Actions **does not** regenerate `chart.json` / `chart-2nd-round.json` / `chart-regional.json` — **Lead owns** Option B exports.
- Export CSV/JSON **buttons removed** from Pages UI; share URL kept.

ADRs: [`docs/adr/0001-discovery-bypass-blockers.md`](adr/0001-discovery-bypass-blockers.md), [`docs/adr/0002-regional-geography-parallel-tree.md`](adr/0002-regional-geography-parallel-tree.md).

---

## 3) Lead vs Pipeline lanes

| Concern | **Lead** | **Pipeline** |
|---------|----------|--------------|
| `site/index.html`, `site/css/`, `site/js/` | Owns | Do not touch UI |
| Option B Python (`models/pebr_models`) + `chart*.json` | Owns exports | Do not regenerate charts |
| Schemas, `data/national/`, `data/regional/` | Consume | Owns dual-enter + witnesses |
| `bin/pebr validate \| normalize \| assemble \| watch \| drop` | May run assemble to verify | Owns |
| Discovery queues / anti-replicate / CI refresh | Coordinate only | Owns |
| PR merges for intake | Coordinate; pause forbade merges | Owned regional PR #1 (done) |
| Product ports from old site | Owns (behavior only) | Data foundation only |

**Do not dual-lane the same file.** If Pipeline lands new canonical points, Lead re-exports Option B. If Lead needs more UF rows, task Pipeline — do not invent.

---

## 4) URLs & identity

| What | URL / path |
|------|------------|
| Live Pages | https://gitdisd.github.io/pesquisas-presidenciais-brasileiro/ |
| Repo | https://github.com/Gitdisd/pesquisas-presidenciais-brasileiro |
| Old site (reference only) | https://gitdisd.github.io/pesquisas-eleitorais-br/ |
| Old repo | https://github.com/Gitdisd/pesquisas-eleitorais-br |
| Local preview | `python3 -m http.server 8080 --directory site` → http://localhost:8080/ |

---

## 5) Data state (verified at handoff)

Verify on resume with the snippets below — do not trust chat memory.

| Artifact | Count / state | Path |
|----------|--------------:|------|
| National 1º canonical | **130** | `site/data/canonical-points.json` |
| National 2º canonical | **250** | `site/data/canonical-points-2nd-round.json` |
| Regional canonical | **24** | `site/data/canonical-points-regional.json` |
| National `chart.json` | populated (Option B 1º) | `site/data/chart.json` |
| National `chart-2nd-round.json` | populated (`scenarios[]`) | `site/data/chart-2nd-round.json` |
| `chart-regional.json` **on HEAD** | **populated per-UF Option B** | `site/data/chart-regional.json` |
| National poll JSON files | **357** | `data/national/polls/*.json` |
| National witnesses | **187** | `data/national/witnesses/*.json` |
| Regional poll JSON files | 24 | `data/regional/polls/*.json` |
| Regional witnesses | 14 | `data/regional/witnesses/*.json` |

**Regional by UF (canonical points):** DF 2 · MG 6 · PE 10 · SP 6.  
**Regional scenarios:** 10× `stimulated_1st_round`; 10× `stimulated_2nd_round_flavio_bolsonaro_vs_lula`; Atlas PE extras (Cury / Renan / Zema / Caiado) ×1 each.

```bash
# Quick verify
python3 - <<'PY'
import json
from pathlib import Path
def n(p):
    d=json.loads(Path(p).read_text())
    return len(d) if isinstance(d,list) else len(d.get("series") or d.get("scenarios") or [])
for p in [
  "site/data/canonical-points.json",
  "site/data/canonical-points-2nd-round.json",
  "site/data/canonical-points-regional.json",
]:
    print(p, n(p))
cr=json.loads(Path("site/data/chart-regional.json").read_text())
print("chart-regional series", len(cr.get("series") or []), "note=", (cr.get("note") or "")[:80])
PY
git log -1 --oneline origin/main
test -f site/data/canonical-points-regional.json && echo "regional file OK"
```

**Key SHAs (main ancestry):**

| SHA | Note |
|-----|------|
| `7d65082` | Chart #2 regional UI shell (empty-state) |
| `bf4ee83` | Regional fill 24 points (land tip of PR #1) |
| `59f9f03` | Merge PR #1 onto main |
| `4a7c81b` | National Option B re-export 117 / 203 |
| `a72251e` | Regional foundation + anti-replicate + discovery harden |
| `8c79e15` | Pipeline pause status log (docs) — tip near handoff write |

Superseded pre-amend tip `5e6be49` is **not** on main; use `bf4ee83`.

---

## 6) Shipped features (Lead — do not re-do)

Rough chronology (see also [`lead-status-log.md`](lead-status-log.md)):

- Pages site + GitHub Actions deploy (`d7332a1` / `c585576` era).
- Larger chart; period / CSV / candidate filters (`f9d7c4a`).
- TradingView-style pan/zoom, **no** brush (`6a5f30f`).
- P0 ports: share URL, Option B PT copy, client-side filter aggregation (`8350466`); CSV/JSON export buttons later **removed**.
- P1: summary cards, overview metrics, theme, national poll table, shortcuts (`6f298d5`); Verificar agora stamp (`beefe64`).
- Collapsible filters (`6a16f46` + fixes).
- P2: table pagination/search, fullscreen, `inst` bitmask (`2b4ddad`).
- Option B national re-export 117/203 (`4a7c81b`).
- Interim **national** companion (1º ↔ Lula×Flávio) + deep-port memo (`ecb9e4a`) — **demoted**; **not** Chart #2.
- Chart #2 **regional/UF UI shell** + empty stub (`7d65082`).
- Regional 24 points on main via Pipeline PR #1 (`bf4ee83` → `59f9f03`).

Gap audit: [`feature-gap-audit.md`](feature-gap-audit.md). Deep port / second-chart rationale: [`old-site-deep-port.md`](old-site-deep-port.md).

---

## 7) File map (orientation)

```
pesquisas-presidenciais-brasileiro/
├── bin/pebr                    # Ruby CLI entry
├── lib/pebr/                   # pipeline glue (validate, assemble, watch, …)
├── schemas/                    # poll.schema.json, poll-regional.schema.json, witness, …
├── config/                     # institutes, candidates, watch_targets.yml, …
├── data/national/{polls,witnesses,discovery}/
├── data/regional/{polls,witnesses,discovery}/   # parallel UF tree
├── fixtures/                   # synthetic + discovery lead fixtures
├── models/pebr_models/         # Option B (Lead) — aggregate, export, cli, types
├── site/
│   ├── index.html
│   ├── css/app.css
│   ├── js/
│   │   ├── chart.js              # Chart #1 national
│   │   ├── companion-chart.js    # interim alternate-round (national only)
│   │   ├── regional-chart.js     # Chart #2 UF shell
│   │   ├── option-b.js           # client recompute on institute filter
│   │   └── candidates-config.js
│   └── data/
│       ├── canonical-points.json
│       ├── canonical-points-2nd-round.json
│       ├── canonical-points-regional.json
│       ├── chart.json
│       ├── chart-2nd-round.json
│       ├── chart-regional.json   # STUB on HEAD — Lead fills after unpause
│       └── README.md
├── docs/                       # this handoff + runbooks
└── .github/workflows/          # pages.yml, refresh.yml (no chart invent)
```

---

## 8) Option B CLI recipes (exact)

Deps (once):

```bash
.venv/bin/pip install -e 'models/[dev]'
```

### 8.1 National 1º → `chart.json`

```bash
.venv/bin/python -m pebr_models.cli \
  --polls site/data/canonical-points.json \
  --out site/data/chart.json \
  --no-example \
  --note "verified national stimulated_1st_round"
```

### 8.2 National 2º multi-scenario → `chart-2nd-round.json`

Never merge distinct pairwise matchups into one Option B run.

```bash
.venv/bin/python -m pebr_models.cli \
  --polls site/data/canonical-points-2nd-round.json \
  --out site/data/chart-2nd-round.json \
  --multi-scenario \
  --no-example \
  --note "verified pairwise 2º (multi-scenario)"
```

Single matchup (optional):

```bash
.venv/bin/python -m pebr_models.cli \
  --polls site/data/canonical-points-2nd-round.json \
  --scenario stimulated_2nd_round_flavio_bolsonaro_vs_lula \
  --out /tmp/chart-flavio-lula.json \
  --no-example
```

### 8.3 Regional Chart #2 → `chart-regional.json` (**FIRST post-unpause Lead action**)

**Not blocked on any PR** — 24 points already on main. On HEAD, `pebr_models.cli` may still lack `--geography state` (that flag + per-UF export live in **uncommitted WIP** on the box: `models/pebr_models/{aggregate,cli,export,types}.py` + a dirty `chart-regional.json`). On resume:

1. Review/finish the WIP (per-UF Option B, `uf`-tagged series rows, `geography: "state"`).
2. Run tests: `.venv/bin/pytest models/tests -q`
3. Export (intended recipe once `--geography` is committed):

```bash
# Preferred v1: single-scenario 1º regional (matches mid-flight WIP note)
.venv/bin/python -m pebr_models.cli \
  --polls site/data/canonical-points-regional.json \
  --out site/data/chart-regional.json \
  --geography state \
  --scenario stimulated_1st_round \
  --no-example \
  --note "verified regional UF stimulated_1st_round (SP/MG/DF/PE); Option B per-UF; never merge into national chart.json"

# Optional later: all regional scenarios (incl. 2º) as multi-scenario wrapper
.venv/bin/python -m pebr_models.cli \
  --polls site/data/canonical-points-regional.json \
  --out site/data/chart-regional.json \
  --geography state \
  --multi-scenario \
  --no-example \
  --note "verified regional UF multi-scenario; Option B per-UF per scenario; never merge into national"
```

**Rules for regional export:**

- Option B runs **per UF** (never one blended Brazil line across UFs).
- Tag poll/aggregate/uncertainty rows with `uf`.
- UI (`regional-chart.js`) prefers `chart-regional.json` when `series` non-empty; else falls back to raw `canonical-points-regional.json` points; empty PT: *Nenhuma pesquisa regional verificada ainda*.
- Aggregate in UI only if chart export present **and** ≤1 UF selected.
- **Never** write regional rows into national chart files.

Scenario keys: [`scenario-convention.md`](scenario-convention.md). Methodology: [`methodology-aggregate-option-b.md`](methodology-aggregate-option-b.md).

---

## 9) Second-chart rationale (geo vs round) — do not confuse

| Panel | Job | Axis | Data |
|-------|-----|------|------|
| Chart #1 | National trend | National geography; round via UI | `chart.json` / `chart-2nd-round.json` |
| Chart #2 | UF inspect / Capítulo 2 | **Geography** (state presidential) | `chart-regional.json` ± `canonical-points-regional.json` |
| Companheiro | Interim alternate **national** round | Round only (1º ↔ Lula×Flávio) | same national chart files |

**False:** “Chart #2 = 2º turno.”  
**True:** Old Chart #2 existed so UF polls can be inspected **without contaminating** Chart #1’s national aggregate. Round toggles on old site were **orthogonal**. NEW’s `chart.json` vs `chart-2nd-round.json` is a **national round/scenario** split — different product job.

Full memo: [`old-site-deep-port.md`](old-site-deep-port.md) §2. Regional rules: [`regional.md`](regional.md).

---

## 10) Step-by-step resume order (Lead)

Do **nothing** until the user says resume. Then:

1. **Reread** this file + [`lead-status-log.md`](lead-status-log.md) + [`pipeline-status-log.md`](pipeline-status-log.md) + [`TASK-LOG-PAUSE.md`](TASK-LOG-PAUSE.md).
2. `git fetch && git checkout main && git pull` — confirm tip; confirm PR #1 already merged (`59f9f03` ancestor); **do not re-merge #1**.
3. Verify counts (§5): national **117 / 203**, regional **24**, HEAD `chart-regional.json` stub empty unless you already exported.
4. Inspect local dirty WIP / stashes (`git status`, `git stash list`) — finish Option B `--geography state` path; **do not** commit unrelated stash junk.
5. **FIRST product action:** commit working Option B regional support + export non-empty `site/data/chart-regional.json` (recipe §8.3). Light up Chart #2 without national blend.
6. Smoke-check Pages locally (`http.server` on `site/`) — UF chips, empty-state gone, pan/zoom, point-only hover, ≤1 UF aggregate only.
7. Then pick **one** deferred Lead item (not all at once):
   - True Chart #2 polish (UF filters UX, copy, no national blend).
   - More behavior from [`old-site-deep-port.md`](old-site-deep-port.md) / [`feature-gap-audit.md`](feature-gap-audit.md) — **behavior only**.
   - National Option B re-export **only if** canonical counts changed.
8. Task Pipeline separately for more UF dual-enter / national queue mop (§11).

---

## 11) What to delegate to Pipeline (after resume)

- More regional UF dual-enter beyond SP/MG/DF/PE (extractable primary only; old-site regional JSON = **URL leads only**).
- National discovery queue mop when clean primary + witnesses exist.
- Optional `pipeline-status.json` / poll-witness-index (no shares).
- Keep anti-replicate / watch / inbox healthy; uphold holds (Michelle, Ipec 1º hard-stop, Quaest Jun-08 dirty, Atlas Sep-16 residuals, image-only PDFs, TSE 403 → leads only).
- **Do not** ask Pipeline to edit `site/js/*` or regenerate Option B charts.

Pipeline pause narrative: [`pipeline-status-log.md`](pipeline-status-log.md). Discovery runbook: [`discovery.md`](discovery.md). Manual drop: [`manual-intake.md`](manual-intake.md).

---

## 12) DO NOT list (while paused **and** as standing rules)

**While paused (until user resume):**

- No merges (PR #1 already done — do not re-open).
- No dual-enter / intake / discovery continuation.
- No UI feature code / restyle.
- No chart re-exports (including regional) — **except** this docs handoff work.
- No inventing data.
- No committing dirty Option B WIP “just because it exists.”

**Standing forever:**

- No Michelle scenarios.
- No Playwright in discovery/CI.
- No brush slider / hover scoreboard.
- No TS/SPA/ECharts/WASM stack reopen.
- No blending multi-UF into a fake Brasil Option B line.
- No merging regional into national canonical/chart files.
- No inventing shares from image-only PDFs or blocked TSE CDN.
- No auto-commit of poll numbers from Actions.

---

## 13) Pointers to other docs

| Doc | Why |
|-----|-----|
| [`lead-status-log.md`](lead-status-log.md) | Lead pause snapshot (may still say PR conflicting — prefer this handoff’s corrected facts) |
| [`pipeline-status-log.md`](pipeline-status-log.md) | Pipeline pause snapshot — PR #1 **MERGED**, counts, blockers |
| [`TASK-LOG-PAUSE.md`](TASK-LOG-PAUSE.md) | Short frozen checklist |
| [`old-site-deep-port.md`](old-site-deep-port.md) | Second-chart rationale + port map P0/P1/P2 |
| [`feature-gap-audit.md`](feature-gap-audit.md) | What already shipped vs skip vs gaps |
| [`regional.md`](regional.md) | Parallel tree, no-blend, Chart #2 shell |
| [`discovery.md`](discovery.md) | Watch/queue/human gate; Playwright out |
| [`scenario-convention.md`](scenario-convention.md) | 1º / 2º keys + assemble split + CLI |
| [`methodology-aggregate-option-b.md`](methodology-aggregate-option-b.md) | √N trailing, anti-flood, no house effects |
| [`architecture.md`](architecture.md) | One-page data-plane sketch |
| [`manual-intake.md`](manual-intake.md) | Human HTML/PDF drop path |
| [`cross-reference.md`](cross-reference.md) | Identity / witness cross-ref |
| [`../README.md`](../README.md) | Operator refresh recipe |
| [`../site/data/README.md`](../site/data/README.md) | Chart vs canonical ownership |
| [`../data/regional/README.md`](../data/regional/README.md) | Regional tree rules |
| ADR 0001 / 0002 | Discovery blockers; regional parallel tree |

---

## 14) Corrected facts vs older Lead pause wording

Earlier Lead pause text said regional 24 points were “not confirmed on main” and Chart #2 Option B was “WAITING on merge” / “blocked on PR #1 conflict.” **That is outdated.**

**Corrected (2026-09-27):**

- PR #1 **MERGED** at `59f9f03`.
- Regional **24** points **on main** (`canonical-points-regional.json`), land tip `bf4ee83`.
- Chart #2 UI shell on main (`7d65082`).
- Option B `chart-regional.json` export is **unblocked** and is the **first Lead action after unpause**.
- National still **117** 1º / **203** 2º.
- Product work remains **IDLE** until the user says resume.

---

*End of AI handoff. Product lanes stay paused until explicit user resume.*


## Resume checkpoint — 2026-10-04

The user explicitly resumed product work for election-day maintenance. The prior pause gate is superseded for this maintenance cycle. See election-day-maintenance-2026-10-04.md for the live checklist. Existing architecture and integrity locks remain binding: no invented poll shares, no national/regional blending, no Playwright, and official election results remain separate from polling/Option B.
