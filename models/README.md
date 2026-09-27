# pebr-models — Option B aggregator

Python package owned by **Electoral Stats** (Lead). Implements PEBR Option B:

- √N size weights (capped), trailing ~14-day window
- same-institute anti-flood √(1/m)
- dating at `fieldwork_mid`
- **no** house-effect shifts
- emits `site/data/chart.json` (`series_kind`: `poll` | `aggregate` | `uncertainty`, `unit`: fraction)

See [`../docs/methodology-aggregate-option-b.md`](../docs/methodology-aggregate-option-b.md).

## Install / test

```bash
# from repo root
.venv/bin/pip install -e models/[dev]
.venv/bin/pytest models/tests -q
```

## Generate chart.json from EXAMPLE fixtures

```bash
.venv/bin/python -m pebr_models.cli \
  --polls fixtures/national/example_polls_synthetic.json \
  --out site/data/chart.json
```

Synthetic only (`example: true`). Do not invent real Brazilian poll numbers.

## 2º turno (pairwise)

```bash
.venv/bin/python -m pebr_models.cli \
  --polls site/data/canonical-points-2nd-round.json \
  --out site/data/chart-2nd-round.json \
  --multi-scenario \
  --no-example
```

Use `--scenario <id>` for a single matchup. Distinct 2º scenarios are never merged into one Option B run.

