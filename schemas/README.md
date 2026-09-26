# PEBR canonical schemas (Pipeline-owned)

Binding contract for **Pesquisas presidenciais brasileiro** (PEBR 2026) national poll identity.

## Files

| Path | Role |
|------|------|
| `poll.schema.json` | Canonical national poll (one fieldwork + scenario) |
| `witness.schema.json` | One coverage/publication of a poll |
| `institute.schema.json` | Institute registry entry |

Electoral Stats ingests polls matching `poll.schema.json`. Research UI does **not** read these directly; Stats emits `data/chart.json` (Option B).

## Units

- Candidate `results` and `residuals`: **fractions in [0, 1]** (not 0–100).
- `moe`: fraction on the same scale (e.g. `0.02` means ±2 percentage points). Null if unpublished.
- Chart export (`data/chart.json`): `unit: "fraction"`; uncertainty uses `band_low` / `band_high` (Option B in-window dispersion, **not** classical CIs).

## Identity rules

1. **Canonical key** (after merge): stable `poll_id`. Prefer deriving from `(institute_id, fieldwork_start, fieldwork_end, geography, election_cycle, scenario)` plus deterministic witness merge — never invent ids from TSE alone.
2. **Witnesses**: many publications/PDFs/pages can point at one poll. Link via `witness_ids` on the poll and `poll_id` on each witness (nullable until linked).
3. **TSE** (`tse_registration_id`): **provenance only**, not truth for results or sole identity.
4. **Geography**: v1 is `national` only. State polls never enter national aggregates.
5. **Trend date**: `fieldwork_end` orders the series. Stats Option B dates at `fieldwork_mid` (calendar midpoint of start/end) when present.
6. **Scenario**: never mix scenarios in one aggregate (e.g. `stimulated_1st_round` vs runoff pairs).
7. **Parsers**: `parser_id` is config/mapping driven — no self-modifying parsers.

## Witness merge (sketch)

- Same institute + overlapping/identical fieldwork window + same scenario + consistent geography → candidates for one `poll_id`.
- Prefer institute primary release over secondary press when results conflict; record conflicts in `notes` / supplements — do not silently average disagreeing witnesses.
- Content hash on witnesses detects duplicate retrievals.

## EXAMPLE fixtures

See `fixtures/national/`. Files with `example_` ids are **synthetic** and must never be treated as real Brazilian polls.

## Superseded

Legacy workspace `data/SCHEMA.md` / bare `Poll[]` with percent `pct` fields are **non-binding**. Quarantined under `_quarantine/` locally; not SoT.
