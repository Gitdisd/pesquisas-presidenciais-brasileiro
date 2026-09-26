# Site data

- `chart.json` — **owned by Electoral Stats** (Option B export via `python -m pebr_models.cli`). UI path on Pages: `data/chart.json`.
- Series: `poll` | `aggregate` | `uncertainty`; `unit: fraction`; `band_low`/`band_high` = in-window dispersion.
- Pipeline may later add `canonical-points.json` as optional Stats input.
- Do not commit unverified bulk poll corpora here. EXAMPLE / `example: true` files are synthetic only.
