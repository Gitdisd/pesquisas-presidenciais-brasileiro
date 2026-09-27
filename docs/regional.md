# Regional (UF) presidential polls — data plane

**Status:** foundation stub (2026-09-27 America/Sao_Paulo)  
**Product intent:** old-site Chart #2 / Capítulo 2 **geo isolation** (national vs national+UF), **not** the interim 1º/2º companion panel.

Companion memos: [`old-site-deep-port.md`](old-site-deep-port.md), [`cross-reference.md`](cross-reference.md), [`methodology-aggregate-option-b.md`](methodology-aggregate-option-b.md), ADR [`0002-regional-geography-parallel-tree.md`](adr/0002-regional-geography-parallel-tree.md).

## Why a parallel tree

Old Chart #2 existed so readers could inspect **state presidential** polls (SP/MG/DF/PE/…) while Chart 1’s **national Option B mean stayed pure**. Multi-UF selection explicitly **refused a blended Brazil mean** (“estado ≠ país”).

PEBR mirrors that on the data plane:

| Tree | Schema | Assemble output | Option B / chart |
|------|--------|-----------------|------------------|
| `data/national/` | `poll.schema.json` (`geography: "national"` **locked**) | `canonical-points.json` + `canonical-points-2nd-round.json` | Lead → `chart.json` / `chart-2nd-round.json` |
| `data/regional/` | `poll-regional.schema.json` (`geography: "state"` + required `uf`) | `canonical-points-regional.json` **only** | **No** national Option B ingest |

**Never** merge regional rows into national canonical files or national chart series.

## Identity / witnesses

Same rules as national ([`schemas/README.md`](../schemas/README.md), [`cross-reference.md`](cross-reference.md)):

- Canonical key: `(institute_id, fieldwork_start, fieldwork_end, geography, uf, election_cycle, scenario)` + witness merge.
- TSE / `BR-` / `UF-` ids = provenance only.
- Dual-enter only with an **extractable primary** (readable labeled shares). Old-site `polls-regional.json` = **URL leads only**.
- Anti-replicate checks run on regional with the **same** normalize rules; geography+uf keep state rows out of national fingerprints.

## Multi-geo no-blend (binding)

1. National Option B (`option_b_sqrt_n_trailing`) inputs **only** `geography == national`.
2. Any future regional aggregate (Stats or UI) may emit an aggregate line **only when ≤1 UF is selected**.
3. Selecting 2+ UFs → scatter (and tables) **without** a blended mean. Never market a multi-UF average as Brazil.
4. National breakouts published inside a national PDF remain attributes of the national poll (crosstabs) — **not** regional poll entities — unless the study is a true UF-scoped presidential registration.

## Discovery

- Fixture leads: `fixtures/discovery/old-site-regional-leads.json` (watch target `old-site-regional-leads`).
- Queue: `data/regional/discovery/queue.json` (stub until watch writes regional out — national queue may still surface `regional_breakout` demotions for operator awareness).
- Inbox: `data/regional/discovery/inbox/` (same drop contract as national; confirm UF presidential scope before dual-enter).

## UI Chart #2 shell

`site/js/regional-chart.js` + `#regional-panel` (“Pesquisas regionais (UF)”) ships empty-state plumbing. Prefers `site/data/chart-regional.json` when it has poll series; else raw `canonical-points-regional.json` points. Empty message: *Nenhuma pesquisa regional verificada ainda*. Lights up when Pipeline/Lead fill those files — no national Option B merge.

## Intake status (intake-regional-001)

- Prefer UF fill: **SP / MG / DF / PE** (other UFs still leads).
- `data/regional/polls/` + `witnesses/`: dual-entered from extractable CNN/g1/TMC HTML and institute PDFs (Atlas PE / RTBD SP / Futura SP / Instituto Ver MG).
- `site/data/canonical-points-regional.json`: non-empty after `bin/pebr assemble` — **flag Lead Chart #2 Option B export**.
- Holds: RTBD MG institute PDF missing on CNN page (HTML used); Atlas PE share charts image-heavy in PDF (CNN prose used); Quaest RJ + non-prefer UFs not dual-entered this pass; image-only / 404 → do not invent.
- National Option B inputs unchanged (`canonical-points.json` / `chart.json` not touched by regional assemble).

## CLI

```bash
bin/pebr validate   # fixtures + national + regional trees
bin/pebr normalize  # fingerprints + anti-replicate (national + regional)
bin/pebr assemble   # national 1º/2º + regional separate file
```
