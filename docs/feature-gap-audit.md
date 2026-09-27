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
| Summary cards (latest aggregate + Δ vs 30d) | Old overview cards; needs careful non-scoreboard design |
| Overview metrics (n pesquisas, n institutos, campo recente) | Informational only |
| Dark/light theme toggle | NEW is dark-only; old toggles |
| Focus / scroll-to-chart + scroll-top | Minor UX |
| Poll data table under chart | Large; needs schema + pagination |
| Keyboard shortcuts (round / period) | Nice-to-have |
| “Verificar agora” refresh stamp | Old live check |

### P2 — low / niche

| Gap | Notes |
|-----|--------|
| Compartilhar with institutes in query | Partial in P0; full multi-institute bitmasks later |
| Fullscreen chart | Optional |
| EN locale toggle | Old site-controls i18n |
| WASM estimator parity badge | Old rust path |

## Remaining after this ship

- P1 summary cards / overview metrics
- Light theme toggle
- National poll table
- Any further visual tuning from live QA
