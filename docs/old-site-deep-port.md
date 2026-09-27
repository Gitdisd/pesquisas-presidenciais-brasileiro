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

1. **Chart 1 — Nacional** (`#chartPanel` / `#pollChart`): verified national presidential stimulated polls only; institute chips; averaging window; models/overlays; cards; national table.
2. **Chart 2 — Capítulo 2 “Todas as fontes (nacional + estados)”** (`#allSourcesPanel` / `#allSourcesChart` in `src/regional-panel.js`): national rows **merged** with `polls-regional.json`; **geo chips** (BR + UF); **own** 1º/2º buttons; own table; **aggregate line only when ≤1 geo selected** (`aggregate: state.geos.size <= 1`). Explicit copy: multi-UF mean **is not Brazil**.

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
- **Series:** scatter of national **and** state-president polls for selected geos; optional aggregate **only** for a single geo; no projection; fixed 14d window; independent round.
- **Data contract:** `polls-regional.json` rows `{institute, geo, fieldwork_*, published_date, scenario, candidates[{name,pct}], n, margin_of_error, source_url, tse_*}` merged with national raw via `canonicalPollKey`, deduped.
- **Why it existed:** (1) keep Chart 1’s national Option-style mean **pure**; (2) still let readers inspect UF presidential polls; (3) teach “estado ≠ país” with UX that refuses a blended multi-geo mean.

### 2.2 Recommendation (clear)

**YES — add a second chart on the NEW site as product/UX on the current stack.**

**Do NOT clone the regional Capítulo 2 yet.** v1 schema locks `geography: "national"`; discovery demotes UF breakouts; Pipeline has no state poll intake. Cloning without data would invent a product.

**What it should show under Option B + 1º/2º (series are already published):**

| Main panel | Companion panel (Capítulo 2) |
|------------|------------------------------|
| 1º `chart.json` (`stimulated_1st_round`) | Primary 2º matchup from `chart-2nd-round.json`: `stimulated_2nd_round_flavio_bolsonaro_vs_lula` |
| 2º (any Confrontos chip) | 1º national `chart.json` |

**Why this series (no Lead fork required):**

1. Reuses existing Option B artifacts (`chart.json`, `chart-2nd-round.json`) — Lead already exports both.
2. Restores the old **dual-notebook** reading pattern (“two questions, two charts”) without ECharts or regional schema.
3. Primary Lula×Flávio is already the NEW default matchup (`isPrimaryMatchup`); densest 2º series (~104 poll points).
4. Shares period + institute filters via the existing view bus; keeps point-only hover; no brush; no scoreboard.
5. Regional UF chapter remains a **later** product if/when Pipeline unlocks non-national geography (see Pipeline tasks).

**Contract for companion (UI-only, no new Stats model):**

- Same `series_kind`: `poll` | `aggregate` | `uncertainty`.
- Unit fraction 0–1; display ×100.
- When institutes ≠ Todos → client Option B (`option-b.js`) on companion’s visible polls (same as main).
- Independent scenario identity (companion does not follow Confrontos chips; always primary 2º ↔ 1º).
- Share URL: optional `companion=0|1` later; v1 foundation can omit or default on.

### 2.3 Explicitly not the second chart

- Multi-model Exp/Casa/Kalman strip under the plot.
- Residuals-only chart (BN/NS) until product asks + residual series export is intentional.
- Small-multiples of all six 2º matchups (nice P2; not the Capítulo 2 foundation).

---

## 3. Port map (P0 / P1 / P2)

Behaviors onto **existing** Ruby → Option B → static D3 stack. Features, not skin.

### P0 — ship / foundation

| Item | Notes |
|------|--------|
| **Companion second chart foundation** | Dual panel: alternate round / primary matchup; shared period+institutes; Option B series from existing JSON. **This memo’s first slice.** |
| View bus `window.__pebrView` + `pebr-view-change` | Mirror old `__pebr` so companion (and future modules) do not refetch blindly. |
| Methodology cross-links | One sentence in side panel: “Capítulo 2 = o outro turno (nacional), não UF.” |

### P1 — valuable next

| Item | Notes |
|------|--------|
| Companion in share URL (`companion=0\|1`) + toast | Extend `buildShareUrl` / `readUrlState`. |
| Companion point hover → shared `#detail-panel` | Same point-only contract. |
| Collapse / “ocultar Capítulo 2” chip | Density control; persist `localStorage`. |
| EN locale (cheap string map) | Old `site-controls.js` pattern; optional. |
| Poll-table columns: TSE + source link when present on chart poll rows | Needs Pipeline to keep ids on chart export (often already on `poll` series). |
| Discovery queue badge on Pages | Read-only `discovery/last-run.json` or a tiny `pipeline-status.json` assemble artifact — no auto-extract. |

### P2 — later / niche

| Item | Notes |
|------|--------|
| Regional Capítulo 2 (true UF port) | Only after Pipeline geography unlock + `polls-regional` assemble path. Keep multi-geo **no blended mean**. |
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
5. **Shareable Confrontos + companion** — one URL opens 1º main + 2º companion (or reverse) with same `inst` mask — old site could not dual-link rounds this cleanly.
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

**Companion chart foundation** (not regional):

- DOM: `#companion-panel` + `#companion-chart` under the main chart, before the national table.
- JS: `site/js/companion-chart.js` consumes `pebr-view-change` / `window.__pebrView`.
- Data: existing `chart.json` + primary scenario inside `chart-2nd-round.json`.
- Behavior: Option B poll/aggregate/uncertainty; period + institute sync; point-only hover; no brush; no visual makeover.
- Main `chart.js`: publishes view bus only (no architecture change).

Regional UF second chart remains **memo-deferred** pending Pipeline tasks below.

---

## 7. Pipeline tasks (data/schema/intake only — not UI)

Delegate to **Poll Data Pipeline**:

1. **Keep chart poll series provenance rich** — ensure every `series_kind=poll` row retains `poll_id`, `institute_id`, `n`, and (if available) stable link keys so UI can deep-link witnesses without scraping.
2. **Optional `site/data/pipeline-status.json`** from `assemble`/`watch` — `last_run_at`, queue counts (`needs_human_review`), holds; **no shares**; byte-stable when unchanged.
3. **Do not** widen `geography` enum yet; continue rejecting state rows in national assemble.
4. **If Lead later greenlights regional product:** ADR to allow `geography` ∈ national \| UF codes; new `data/state/` or `data/national/regional/` tree; separate `canonical-points-regional.json`; **never** merge into `canonical-points.json` / `chart.json`; document multi-geo no-blend rule for Stats (Stats may omit aggregate for multi-geo exports).
5. **Witness index (optional)** — `site/data/poll-witness-index.json` map `poll_id → [source_url]` from witnesses/ for detail panel (deterministic, no invention).
6. **Continue demoting** Michelle / Ipec hard-stop / regional-breakout in `watch_policy` as today.
7. **2º assemble hygiene** — fail loud on unknown scenario keys; keep pairwise lex-sorted ids (already in scenario-convention).

---

## 8. Decision log

| Decision | Choice |
|----------|--------|
| Second chart? | **Yes** — companion alternate-round / primary matchup |
| Regional clone now? | **No** — schema + intake not ready |
| Series for foundation? | `chart.json` ↔ `stimulated_2nd_round_flavio_bolsonaro_vs_lula` |
| New stack/framework? | **No** |
| First code slice? | Companion foundation + view bus |
