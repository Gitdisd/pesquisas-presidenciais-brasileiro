# Old-site deep port — design memo

**Date:** 2026-09-27 (America/Sao_Paulo)  
**Author:** PEBR Lead executor  
**OLD:** `pesquisas-eleitorais-br` (live https://gitdisd.github.io/pesquisas-eleitorais-br/)  
**NEW:** `pesquisas-presidenciais-brasileiro`  
**Stack lock (do not reopen):** Ruby pipeline → Python Option B → static HTML/CSS + vanilla JS + full D3 SVG. No new frameworks, SPA, bundlers, or chart libraries.

Companion audits: [`feature-gap-audit.md`](feature-gap-audit.md), [`architecture.md`](architecture.md), [`scenario-convention.md`](scenario-convention.md).

---

## 1. Old inventory

### 1.1 Architecture (old)

| Layer | What it was |
|-------|-------------|
| Front (prod intermediate) | Vite + JS/TS + ECharts canvas |
| Front (migration target, never shipped) | Rust/Dioxus WASM + custom SVG |
| Data store | `window.__pebr` shared snapshot; modules do not independently refetch national JSON |
| Canonical polls | bare `Poll[]` in `public/data/polls.json` (+ `polls-extra.json`) |
| Regional companion file | `public/data/polls-regional.json` (30 UF rows) |
| Meta / coverage | `meta.json`, `coverage_summary.json`, discovery queues under `data/discovery/` |
| Stats | JS models 0–12 + Python `pebr_stats` + optional WASM estimator |
| Refresh | hourly Actions; “Verificar agora” = reload published JSON only |

### 1.2 Dual-chart layout (the product pattern)

1. **Chart 1 — Nacional** (`#chartPanel` / `#pollChart`): verified **national** presidential stimulated polls only; institute chips; averaging window; models/overlays; cards; national table. State polls **never** enter this aggregate.
2. **Chart 2 — Capítulo 2 “Todas as fontes (nacional + estados)”** (`#allSourcesPanel` / `#allSourcesChart` in `src/regional-panel.js`): **NATIONAL + REGIONAL** inspect panel — national rows **merged** with `polls-regional.json`; **geo chips** (BR + UF); **own** 1º/2º buttons; own table; **aggregate line only when ≤1 geo selected** (`aggregate: state.geos.size <= 1`). Explicit copy: multi-UF mean **is not Brazil**.

**Pipeline / product fact (do not conflate):** Old Chart #2 exists so **state (UF) presidential polls can be inspected without contaminating Chart #1’s national aggregate**. It is a **geography isolation** panel (national-only vs national+regional). It is **not** the same axis as PEBR NEW’s `chart.json` (1º) vs `chart-2nd-round.json` (pairwise 2º) split — that is a **round/scenario** split on national data only. Both charts on the old site had their own 1º/2º toggles; round was orthogonal to the Capítulo 2 purpose.

Layout order (after `live-overlay.js`): cards → national chart → national table → regional panel → methodology.

### 1.3 Filters, URL state, exports

- Round, range (1d…tudo), averaging window presets + custom, institute multi-select, model 0–12, overlays (SMA/EMA/HMA/VWMA/KAMA/BB).
- Share URL: `round`, `range`, `window`, `institutes`, `model`.
- CSV of visible table + JSON of filtered raw polls (`ui-next.js`).
- Quiet 60s refetch; preserve zoom/legend/institute/geo across refresh.

### 1.4 Chart behaviors

- Scatter polls + aggregate line + uncertainty ribbon + optional projection dashed + overlays.
- External hover box (not over-plot scoreboard of all candidates) — still multi-series at a date via axis tooltip → external panel.
- Bottom **dataZoom slider** + inside wheel/pinch (LOCKED out on NEW).
- Round-2 Y scale data-derived (avoid clipping low series).
- ARIA `role=img` + regional vs national description.

### 1.5 UX chrome

- Overview metrics, summary cards + Δ30d + sparklines, theme cycle (light/dark/CRT/party), PT/EN toggle, mobile bottom nav, fullscreen, focar, scroll-top, table search, methodology long-form PT, X follow chip, “Verificar agora”.

### 1.6 Methodology / integrity (old → keep spirit)

- Fieldwork dates on axis; publication = coverage not identity.
- Identity: TSE+scenario(+geo) else institute+fieldwork+scenario(+geo).
- Never invent percentages; pending TSE out of chart.
- National aggregate never mixes state rows.
- Sample-size √N with N cap 4000; uncertainty ≠ survey MOE ≠ win probability.

### 1.7 Already ported onto NEW (do not re-do)

See `feature-gap-audit.md`: 1º/2º + Confrontos, institute solo, period chips (not brush), candidate chips, share URL + `inst` bitmask, Option B PT copy, client Option B on institute filter, summary cards, overview metrics, theme, national table + pager/search, focar/scroll-top/fullscreen, shortcuts, Verificar agora. Locked UX already honored (no brush, no all-candidate hover scoreboard, Michelle out).

---

## 2. Second-chart rationale

### 2.1 What the old second chart showed

- **Title:** “Todas as fontes (nacional + estados)” / Capítulo 2.
- **Axis:** **Geography** — NATIONAL + REGIONAL (UF) inspect — **not** “1º vs 2º”.
- **Series:** scatter of national **and** state-president polls for selected geos; optional aggregate **only** for a single geo; no projection; fixed 14d window; independent round controls (round is orthogonal).
- **Data contract:** `polls-regional.json` rows `{institute, geo, fieldwork_*, published_date, scenario, candidates[{name,pct}], n, margin_of_error, source_url, tse_*}` merged with national raw via `canonicalPollKey`, deduped.
- **Why it existed:** keep Chart 1’s **national** aggregate **pure** (no UF contamination) while still letting readers inspect state presidential polls; teach “estado ≠ país” with UX that refuses a blended multi-geo mean.

### 2.2 What it is *not*

| Confusion | Reality |
|-----------|---------|
| Old Chart #2 ≈ PEBR `chart.json` vs `chart-2nd-round.json` | **False.** NEW files are a **national round/scenario** split (1º stimulada vs pairwise 2º). Old Chart #2 is a **geo** split (national-only chart vs national+UF inspect). |
| Porting Chart #2 = wiring 2º under 1º | **False.** That would port the wrong product job. |
| Chart 1 already “is” 1º and Chart 2 “is” 2º on the old site | **False.** Both old panels had 1º/2º buttons; Capítulo 2’s job was UF inspect. |

### 2.3 Recommendation (clear)

**YES — the valuable second-chart *job* should exist on NEW eventually: a NATIONAL+REGIONAL inspect panel that never writes into the national Option B aggregate.**

**Not yet as a full port.** v1 schema locks `geography: "national"`; discovery demotes UF breakouts; Pipeline has no state poll intake. Shipping UF scatter without verified regional canonical JSON would invent data.

**Under Option B + 1º/2º on the locked stack, when regional lands:**

| Panel | Data | Aggregate rule |
|-------|------|----------------|
| Chart 1 (main) | `chart.json` / `chart-2nd-round.json` only (`geography: national`) | Full Option B (server + client recompute on institute filter) |
| Chart 2 (Capítulo 2 / UF inspect) | Separate regional assemble export + optional BR overlay points | Aggregate **only** if ≤1 geo selected; **never** blend multi-UF into a fake Brasil line; **never** merge into `canonical-points.json` / `chart.json` |

Round/matchup on Chart 2 stays independent (same as old), still Option B per scenario when a single geo is selected.

**Until Pipeline unlocks regional — interim dual-panel (shipped, labeled honestly):**

A **new-only** alternate-round companion (`site/js/companion-chart.js`) shows the other **national** notebook (1º ↔ primary Lula×Flávio 2º) using existing `chart.json` / `chart-2nd-round.json`. This reuses the **dual-panel layout habit** and existing Option B artifacts; it does **not** claim to be a port of old Chart #2’s geo job. UI copy must not call it “Capítulo 2 / estados”.

| Main panel | Interim companion (national, other round) |
|------------|-------------------------------------------|
| 1º `chart.json` | Primary 2º `stimulated_2nd_round_flavio_bolsonaro_vs_lula` |
| 2º (Confrontos) | 1º `chart.json` |

**Lead decision still required for the true Chart #2 port:** whether/when to intake UF presidential polls and which assemble path/Stats rules apply (see §7). Series for the **interim** companion are already published — no Lead fork needed for that slice.

### 2.4 Explicitly not the (old) second chart

- Treating `chart-2nd-round.json` as a substitute for `polls-regional.json`.
- Multi-model Exp/Casa/Kalman strip under the plot.
- Residuals-only chart (BN/NS) until product asks.
- Small-multiples of all six 2º matchups (nice P2; different product).

---

## 3. Port map (P0 / P1 / P2)

Behaviors onto **existing** Ruby → Option B → static D3 stack. Features, not skin.

### P0 — ship / foundation

| Item | Notes |
|------|--------|
| **Interim alternate-round companion** | Dual panel on **national** Option B only (1º ↔ Lula×Flávio). **Not** a geo/UF port of old Chart #2. **This memo’s first code slice.** |
| View bus `window.__pebrView` + `pebr-view-change` | Mirror old `__pebr` so companion (and future regional panel) do not refetch blindly. |
| Honest methodology copy | Side panel: companion = other **national** turno; true Capítulo 2 (UF) deferred. |

### P1 — valuable next

| Item | Notes |
|------|--------|
| Companion in share URL (`companion=0\|1`) + toast | Extend `buildShareUrl` / `readUrlState`. |
| Companion point hover → shared `#detail-panel` | Same point-only contract. |
| Collapse / “ocultar companheiro” chip | Density control for interim dual panel; persist `localStorage`. |
| EN locale (cheap string map) | Old `site-controls.js` pattern; optional. |
| Poll-table columns: TSE + source link when present on chart poll rows | Needs Pipeline to keep ids on chart export (often already on `poll` series). |
| Discovery queue badge on Pages | Read-only `discovery/last-run.json` or a tiny `pipeline-status.json` assemble artifact — no auto-extract. |

### P2 — later / niche

| Item | Notes |
|------|--------|
| **True Chart #2 port — NATIONAL+REGIONAL UF inspect** | **Real** old second-chart job. After Pipeline geography unlock + regional assemble/Option B path. Multi-geo **no blended mean**; never contaminate `chart.json`. |
| 2º small-multiples strip | All matchups at once; still Option B per scenario. |
| Overlay SMA/EMA as **non-model** doodles | Old overlays; must not change cards/Option B line. Low priority. |
| WASM parity badge | Old rust path; NEW has no WASM estimator — skip unless Lead adds. |

---

## 4. New-only features (fit existing architecture)

These did **not** exist on the old site (or only as stubs) and use pieces NEW already has:

1. **Discovery → human inbox → Pages stamp** — surface `data/national/discovery/last-run.json` / operator summary as a read-only “fila em revisão: N” chip (Actions already write queue; UI never invents shares).
2. **Witness deep-link from hover** — when `poll` series carries `poll_id`, resolve to canonical poll JSON / witness `source_url` in the detail panel (canonical tree already on disk; optional static index JSON from `assemble`).
3. **Scenario purity guard in UI** — refuse to draw if loaded doc’s `scenario` family ≠ selected round (belt-and-suspenders on top of assemble split).
4. **Institute-solo Option B delta card** — “vs Todos” Δpp on summary cards when solo filter on (client recompute already exists).
5. **Shareable Confrontos + alternate-round companion** — one URL opens 1º main + primary 2º companion (or reverse) with same `inst` mask. This is a **new** dual-round layout, not a substitute for old UF Capítulo 2.
6. **Actions freshness without fake “live scrape”** — show `generated_at` from both chart JSON files + last successful `assemble` note; Verificar agora already re-fetches.

---

## 5. Explicitly skip

| Skip | Reason |
|------|--------|
| Bottom range / brush slider | Locked UX |
| All-candidate hover scoreboard | Locked UX |
| Visual restyle to clone old look | Features not skin |
| Michelle Bolsonaro as candidate | Permanently out |
| Inventing poll shares / regional rows without witnesses | Integrity |
| Multi-model Exp Casa Meta Kalman + média-window knobs | NEW = Option B only |
| Party / CRT themes | Cosmetic noise |
| ECharts / Vite / TS SPA / Dioxus | Stack lock |
| Auto-extract shares in CI/discover | Pipeline hold |
| Blended multi-geo national mean | Old rule; keep forever |

---

## 6. First slice (implemented with this memo)

**Interim alternate-round companion** (national only — **not** old Chart #2 geo port):

- DOM: `#companion-panel` + `#companion-chart` under the main chart, before the national table.
- JS: `site/js/companion-chart.js` consumes `pebr-view-change` / `window.__pebrView`.
- Data: existing `chart.json` + primary scenario inside `chart-2nd-round.json` (round split ≠ geo split).
- Behavior: Option B poll/aggregate/uncertainty; period + institute sync; point-only hover; no brush; no visual makeover.
- Main `chart.js`: publishes view bus only (no architecture change).
- Copy: must not imply UF / “Todas as fontes”.

**True** NATIONAL+REGIONAL Capítulo 2 remains **memo-deferred** pending Pipeline tasks below + Lead greenlight on regional intake.

## 7. Pipeline tasks (data/schema/intake only — not UI)

Delegate to **Poll Data Pipeline**:

1. **Keep chart poll series provenance rich** — ensure every `series_kind=poll` row retains `poll_id`, `institute_id`, `n`, and (if available) stable link keys so UI can deep-link witnesses without scraping.
2. **Optional `site/data/pipeline-status.json`** from `assemble`/`watch` — `last_run_at`, queue counts (`needs_human_review`), holds; **no shares**; byte-stable when unchanged.
3. **Do not** widen `geography` enum yet; continue rejecting state rows in national assemble.
4. **True old Chart #2 port (Lead-gated):** ADR to allow `geography` ∈ national | UF codes; new regional poll tree; separate `canonical-points-regional.json` (+ optional regional Option B export); **never** merge into `canonical-points.json` / `chart.json` / `chart-2nd-round.json`; document multi-geo no-blend rule (Stats omits aggregate when >1 geo). Purpose: UF inspect without contaminating national aggregate — same job as old Capítulo 2.
5. **Witness index (optional)** — `site/data/poll-witness-index.json` map `poll_id → [source_url]` from witnesses/ for detail panel (deterministic, no invention).
6. **Continue demoting** Michelle / Ipec hard-stop / regional-breakout in `watch_policy` as today.
7. **2º assemble hygiene** — fail loud on unknown scenario keys; keep pairwise lex-sorted ids (already in scenario-convention).

---

## 8. Decision log

| Decision | Choice |
|----------|--------|
| Old Chart #2 job? | **Geo isolation** (national vs national+UF) — keep Chart 1 pure |
| Same as `chart.json` vs `chart-2nd-round.json`? | **No** — those are national round/scenario files |
| True Chart #2 port now? | **No** — needs Pipeline regional intake; Lead decision on when |
| Interim dual panel? | **Yes** — alternate-round national companion (new-only feature) |
| Interim series? | `chart.json` ↔ `stimulated_2nd_round_flavio_bolsonaro_vs_lula` |
| New stack/framework? | **No** |
| First code slice? | Interim companion + view bus (honest labeling) |
