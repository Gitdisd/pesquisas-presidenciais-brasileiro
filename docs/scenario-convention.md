# Scenario convention (national polls)

Pipeline-owned. Stats/Lead must filter by `scenario` and consume the matching assemble output — never mix 1º and 2º series.

## Folder layout

All national polls live under **`data/national/polls/`** (same tree). Scenario is a **field on the poll JSON** and is part of `poll_id` / identity fingerprint.

```
data/national/polls/{institute}_{fieldwork_end}_{scenario}.json
data/national/witnesses/w_*.json
```

Do **not** put state polls here. Do **not** invent scenarios without a primary table.

## Scenario keys

| Family | Key form | Assemble output |
|--------|----------|-----------------|
| Stimulated 1º turno | `stimulated_1st_round` | `site/data/canonical-points.json` |
| Stimulated 2º turno (pairwise) | `stimulated_2nd_round_<cand_a>_vs_<cand_b>` | `site/data/canonical-points-2nd-round.json` |

### 2º turno pairwise encoding

- `<cand_a>` and `<cand_b>` are canonical `candidate_id`s from `config/candidate_aliases.yml`.
- Sorted **lexicographically ascending** so the same matchup always gets the same key regardless of press order (e.g. G1 “Lula x Flávio” → `stimulated_2nd_round_flavio_bolsonaro_vs_lula`).
- One fieldwork wave may yield **multiple** poll records (one per matchup). Same TSE / sample / fieldwork; different `scenario` → different `poll_id`.
- A single press article may cover several matchups: one witness with `content_hash` of the retrieval; sibling polls may share that `witness_id` (witness `poll_id` points at the headline matchup).

### Identity note

`docs/source-map/identity-notes.md` §3.3 sketched “multiple scenarios under one poll_id”. **Current binding practice** (cohorts 001–008 + 2T-001) is the opposite: **scenario is part of the canonical key** (`Identity.fingerprint` includes `scenario`). Separate G1 1º/2º URLs → separate polls linked by overlapping fieldwork + shared TSE provenance.

## Assemble behavior

`bin/pebr assemble`:

1. Reads all `data/national/polls/*.json`.
2. Writes **only** `scenario == stimulated_1st_round` → `canonical-points.json`.
3. Writes **only** scenarios with prefix `stimulated_2nd_round` → `canonical-points-2nd-round.json`.
4. **Fails** if any poll has an unhandled scenario (no silent drop).

1º byte-stability: adding 2º polls must not change `canonical-points.json` contents for the existing 1º set.

## Lead / Stats consumption

```bash
# 1º Option B (unchanged path)
.venv/bin/python -m pebr_models.cli \
  --polls site/data/canonical-points.json \
  --out site/data/chart.json \
  --no-example \
  --note "verified national stimulated_1st_round"

# 2º: Option B **per scenario** (pairwise) — never merge matchups
.venv/bin/python -m pebr_models.cli \
  --polls site/data/canonical-points-2nd-round.json \
  --out site/data/chart-2nd-round.json \
  --multi-scenario \
  --no-example \
  --note "cohort 2T-001 / verified pairwise 2º"

# Or one matchup only:
.venv/bin/python -m pebr_models.cli \
  --polls site/data/canonical-points-2nd-round.json \
  --scenario stimulated_2nd_round_flavio_bolsonaro_vs_lula \
  --out /tmp/chart-flavio-lula.json \
  --no-example
```

Lead owns chart UI (`chart.json` = 1º, `chart-2nd-round.json` = 2º with matchup chips). Pipeline will **not** auto-merge 2º into `chart.json`.
