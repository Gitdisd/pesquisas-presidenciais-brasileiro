
> **2026-10-04 maintenance reconciliation:** This audit's 2026-09-27 table is historical. Current execution and checkboxes are tracked in [docs/maintenance-log-2026-10-04.md](maintenance-log-2026-10-04.md). Chart #2 regional Option B, contract smoke tests, cache-busting, keyboard points, RAF zoom coalescing, MOE/fieldwork detail, and current candidate/data gates are now shipped. The remaining gaps are explicitly marked rather than implied complete.

### Current gap status — 2026-10-04

- [x] Chart #2 regional Option B snapshot is populated per UF; no multi-UF Brazil blend.
- [x] Pages rebuilds national 1º, pairwise 2º and regional chart artifacts from canonical data.
- [x] CI contract coverage includes Python Option B tests and chart-shape smoke checks.
- [x] Static asset cache-busting is applied during Pages deployment.
- [x] Poll points have keyboard focus/activation equivalents; zoom redraws are coalesced with requestAnimationFrame.
- [x] Latest-fieldwork header status is repaired and now survives header metadata rendering.
- [x] Current TSE candidature status is represented: 12 deferido candidates plus Leonardo Avalanche (pending judgment) are in the current roster; Pablo Marçal is not in the active allowlist.
- [x] Latest verified national polling data through 2026-10-03 is incorporated into canonical snapshots.
- [x] Unsupported Indexa runoff data was removed instead of being silently retained.
- [ ] Cross-visit “what changed since last visit” strip remains unbuilt.
- [ ] Linked time-domain synchronization remains unbuilt; no brush/slider will be introduced.
- [ ] Broader UF intake remains evidence-gated.
- [ ] TSE live-dump freshness remains subject to documented egress/403 constraints; no bypass is authorized.

# Feature gap audit — OLD (`pesquisas-eleitorais-br`) → NEW (`pesquisas-presidenciais-brasileiro`)

Audit date: 2026-09-27 (America/Sao_Paulo). Stack locked: vanilla JS + D3 SVG, static HTML/CSS, Ruby pipeline, Python Option B. No TypeScript/SPA. Locked UX: point-only hover, no brush slider, TV-style pan/zoom, hide withdrawn by default, Michelle skipped.

## Already on NEW (do not re-port)

| Feature | Notes |
|---------|--------|
| 1º / 2º rounds + Confrontos chips | Multi-scenario `chart-2nd-round.json` |
| Institute chips (solo on click) | Precomputed Option B hidden when filtered (now: client recompute) |
| Methodology static chips | Option B params badges |
| Period 30d / 90d / tudo | X domain only — not a brush |
| Candidatos chips + mostrar todos | Active filter via `candidates-config.js` |
| Export CSV/JSON buttons | **Removed from Pages UI** this pass (Compartilhar kept) |
| Bigger chart + pan/pinch zoom | ~6a5f30f |
| Point-only hover detail panel | No scoreboard overlay |
| Summary cards + overview metrics | P1 |
| Dark/light theme toggle | P1 · localStorage |
| National poll table | P1 · filter-aware |
| Focar / scroll-top + shortcuts | P1 |
| Fullscreen chart + `F` | P2 · Fullscreen API on `#chart-panel` |
| Institute share bitmask (`inst`) | P2 · richer URL state |
| Poll table pagination + search | P2 · 25/page |

## Intentionally skip (hated / incompatible)

| Old feature | Why skip |
|-------------|----------|
| Bottom range / brush slider | Locked out |
| All-candidate % hover scoreboard | Locked out |
| Multi-model Exp Casa Meta Kalman… | NEW = Option B only |
| Média-window knobs / overlays SMA EMA BB | Pipeline params; no TS SPA |
| Projection / extrapolação dashed | Explicitly deferred |
| Party / CRT themes | Cosmetic noise |
| Regional UF chapter + state table | v1 national-only |
| Poll table chapters (nacional + todas fontes) | Different data product |
| ECharts / Vite / TypeScript | Stack lock |
| Michelle Bolsonaro as candidate | Permanently skipped |

## Prioritized gaps

### P0 — port / ship (this pass)

1. **Richer Option B PT methodology copy** — old long “Como este site funciona”; NEW had only 3 bullets. Expand side panel with plain-PT rules (√N, anti-flood, fieldwork mid, what it is not).
2. **Export JSON** of visible series — shipped earlier; **Pages CSV/JSON buttons removed** this pass (share URL kept).
3. **Shareable URL state** — `?round=&range=&scenario=&show=` + Compartilhar (clipboard / Web Share).
4. **Stronger 2º matchup UX** — prefer Lula×Flávio default, sort primary first, clearer chips + poll counts.
5. **Client-side Option B when institute-filtered** — keep line/ribbon coherent with solo institute instead of hiding precomputed “all institutes” line.
6. **Visual polish** — denser matchup row, method prose, toast, toolbar grouping closer to old dark UI without scoreboard/brush.

### P1 — valuable later

| Gap | Notes |
|-----|--------|
| Summary cards (latest aggregate + Δ vs 30d) | **Shipped** — top visible set (cap 8), Option B latest + Δ≈30d; filter/round/scenario aware |
| Overview metrics (n pesquisas, n institutos, campo recente) | **Shipped** — current-view counts above chart |
| Dark/light theme toggle | **Shipped** — `data-theme` + `localStorage pebr-theme` |
| Focus / scroll-to-chart + scroll-top | **Shipped** — Focar gráfico + ↑ button |
| Poll data table under chart | **Shipped** — lean national table, filter-aware + pagination (25) + search |
| Keyboard shortcuts (round / period) | **Shipped** — 1/2, 3/9/0, G, F, T, Esc (hint in UI) |
| “Verificar agora” refresh stamp | **Shipped** — in-page no-store chart JSON refresh, PT timestamp, and failure-safe toast/status |

### P2 — low / niche

| Gap | Notes |
|-----|--------|
| Compartilhar with institutes in query | **Shipped** — `inst` base36 bitmask (+ `institute` solo / `institutes` CSV back-compat) |
| Fullscreen chart | **Shipped** — Fullscreen API on chart panel + `F` |
| EN locale toggle | Old site-controls i18n |
| WASM estimator parity badge | Old rust path |

## Remaining after this ship

- **Interim alternate-round companion** (national 1º↔2º; **not** old Chart #2 geo/UF job) — see [`old-site-deep-port.md`](old-site-deep-port.md). True NATIONAL+REGIONAL Capítulo 2 still Lead/Pipeline-gated.

- P1 shipped: summary cards + Δ30d, overview metrics, dark/light theme, national poll table (+ pagination/search), focar/scroll-top, keyboard shortcuts
- P1 “Verificar agora” refresh stamp shipped: in-page chart JSON check with PT timestamp and failure-safe status
- P2 shipped this pass: institute bitmask in share URL (`inst`), fullscreen chart toggle, poll-table pagination + search
- Pages UI: CSV/JSON export buttons removed (Compartilhar / URL state kept)
- Still skip / later: EN locale, WASM badge, party/CRT themes, Focar load curtains, brush, hover scoreboard
- Any further visual tuning from live QA
