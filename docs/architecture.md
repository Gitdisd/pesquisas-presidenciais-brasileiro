# PEBR architecture (data plane)

- **Pipeline (Ruby)**: discovery → normalize → identity/witness merge → canonical polls under schemas + `data/national/` (future). Owns `schemas/*.schema.json`.
- **Electoral Stats (Python, Lead)**: package [`models/pebr_models`](../models/) — Option B (√N trailing ~14d, anti-flood, midpoint dating, no house effects); writes `site/data/chart.json` for Pages. Public methodology: [`methodology-aggregate-option-b.md`](methodology-aggregate-option-b.md).
- **Research UI (HTML/CSS + D3)**: consumes `data/chart.json` only (`series_kind`: poll | aggregate | uncertainty). Display multiplies fractions ×100.

v1 geography: national only. No Go/WASM/TS SPA.
