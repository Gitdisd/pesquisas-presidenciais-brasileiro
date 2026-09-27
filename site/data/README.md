# Site data

- `canonical-points.json` — **Pipeline assemble** output (`bin/pebr assemble`). Deterministic snapshot of `data/national/polls/*.json` (sorted by `fieldwork_end`, `poll_id`) plus `source_path`. Optional Stats Option B ingest. CI fails if this file drifts from polls.
- `chart.json` — **owned by Electoral Stats / Lead** (Option B export via `python -m pebr_models.cli`). UI path on Pages: `data/chart.json`. Actions does **not** regenerate this.
- Series: `poll` | `aggregate` | `uncertainty`; `unit: fraction`; `band_low`/`band_high` = in-window dispersion.
- Do not commit unverified bulk poll corpora here. EXAMPLE / `example: true` files are synthetic only.
