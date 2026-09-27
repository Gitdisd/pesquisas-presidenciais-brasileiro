# Site data

- `canonical-points.json` — **Pipeline assemble** output (`bin/pebr assemble`). Deterministic snapshot of national `stimulated_1st_round` polls (sorted by `fieldwork_end`, `poll_id`) plus `source_path`. Optional Stats Option B ingest. CI fails if this file drifts from polls.
- `canonical-points-2nd-round.json` — Pipeline assemble for pairwise `stimulated_2nd_round_<a>_vs_<b>` only. Do not mix with 1º.
- `canonical-points-regional.json` — **Pipeline assemble** for `data/regional/polls` only (`geography: state` + `uf`). Parallel to national; **never** merged into national Option B / `chart.json`. Lead Chart #2 Option B export when non-empty.
- `chart.json` — **Electoral Stats / Lead** Option B export for **1º** (`python -m pebr_models.cli --polls site/data/canonical-points.json`). UI: `data/chart.json`. Actions does **not** regenerate this.
- `chart-2nd-round.json` — **Lead** Option B **per matchup** (`--multi-scenario`). Wrapper with `scenarios[]` (each block = same flat series contract as `chart.json`). Never merges distinct 2º confrontos. UI loads this when the user selects 2º turno.
- `chart-regional.json` — **Lead** Option B regional export when available (same flat series contract, may carry `uf` on poll rows). Empty stub until regional intake + Lead re-export. UI Chart #2 lights up from this file or falls back to raw `canonical-points-regional.json` points (no invented aggregate).
- Series: `poll` | `aggregate` | `uncertainty`; `unit: fraction`; `band_low`/`band_high` = in-window dispersion.
- Do not commit unverified bulk poll corpora here. EXAMPLE / `example: true` files are synthetic only.
