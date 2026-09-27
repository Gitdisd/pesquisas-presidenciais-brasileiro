# PEBR architecture (data plane)

- **Pipeline (Ruby)**: discovery watch (human-gated URL queue) → normalize → identity/witness merge → canonical polls under schemas + `data/national/`. Owns `schemas/*.schema.json`. CLI: `bin/pebr validate | normalize | assemble | discover | watch`.
- **Discovery staging**: `data/national/discovery/queue.json` (+ `last-run.json`). Patterns adapted from [pesquisas-eleitorais-br](https://github.com/Gitdisd/pesquisas-eleitorais-br) discover-polls/policy — **without** auto-extracting shares. See [`discovery.md`](discovery.md).
- **Electoral Stats (Python, Lead)**: package [`models/pebr_models`](../models/) — Option B (√N trailing ~14d, anti-flood, midpoint dating, no house effects); writes `site/data/chart.json` for Pages. Public methodology: [`methodology-aggregate-option-b.md`](methodology-aggregate-option-b.md).
- **Research UI (HTML/CSS + D3)**: consumes `data/chart.json` only (`series_kind`: poll | aggregate | uncertainty). Display multiplies fractions ×100. Lead-owned.

Geography: **national** tree (`data/national/`, `geography: national` locked) feeds Option B.
Regional UF presidential polls live in a **parallel** tree (`data/regional/`, `poll-regional.schema.json`)
and assemble only to `site/data/canonical-points-regional.json` — **never** merge into national
canonical/chart files. Multi-geo blended means forbidden (see `docs/regional.md`).
No Go/WASM/TS SPA. CI never invents poll shares.
