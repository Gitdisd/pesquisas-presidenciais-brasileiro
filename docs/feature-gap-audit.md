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
| Export CSV (visible polls) | Filters applied |
| Bigger chart + pan/pinch zoom | ~6a5f30f |
| Point-only hover detail panel | No scoreboard overlay |
| Summary cards + overview metrics | P1 |
| Dark/light theme toggle | P1 · localStorage |
| National poll table | P1 · filter-aware |
| Focar / scroll-top + shortcuts | P1 |

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
2. **Export JSON** of visible series (polls ± client aggregate) — old had CSV+JSON; NEW had CSV only.
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
| Poll data table under chart | **Shipped** — lean national table, filter-aware (no pagination yet) |
| Keyboard shortcuts (round / period) | **Shipped** — 1/2, 3/9/0, G, T, Esc (hint in UI) |
| “Verificar agora” refresh stamp | Old live check — still open |

### P2 — low / niche

| Gap | Notes |
|-----|--------|
| Compartilhar with institutes in query | Partial in P0; full multi-institute bitmasks later |
| Fullscreen chart | Optional |
| EN locale toggle | Old site-controls i18n |
| WASM estimator parity badge | Old rust path |

## Remaining after this ship

- P1 shipped: summary cards + Δ30d, overview metrics, dark/light theme, national poll table, focar/scroll-top, keyboard shortcuts
- Still open from P1 list: “Verificar agora” refresh stamp (deferred)
- P2 items unchanged (institutes in share URL bitmasks, fullscreen, EN locale, WASM badge)
- Any further visual tuning from live QA
