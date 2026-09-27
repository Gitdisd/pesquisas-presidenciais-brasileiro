# PEBR canonical schemas (Pipeline-owned)

Binding contract for **Pesquisas presidenciais brasileiro** (PEBR 2026) poll identity.

## Files

| Path | Role |
|------|------|
| `poll.schema.json` | Canonical **national** poll (`geography` locked to `national`) |
| `poll-regional.schema.json` | Canonical **state (UF)** presidential poll (`geography: state` + required `uf`) |
| `witness.schema.json` | One coverage/publication of a poll (shared national/regional) |
| `institute.schema.json` | Institute registry entry |

Electoral Stats Option B ingests **national** polls matching `poll.schema.json` only. Regional assemble → `site/data/canonical-points-regional.json` — **never** merged into national chart/canonical files. Research UI does **not** read schemas directly.

## Units

- Candidate `results` and `residuals`: **fractions in [0, 1]** (not 0–100).
- `moe`: fraction on the same scale (e.g. `0.02` means ±2 percentage points). Null if unpublished.
- Chart export (`data/chart.json`): `unit: "fraction"`; uncertainty uses `band_low` / `band_high` (Option B in-window dispersion, **not** classical CIs).

## Identity rules

1. **Canonical key** (after merge): stable `poll_id`. Prefer deriving from `(institute_id, fieldwork_start, fieldwork_end, geography, [uf], election_cycle, scenario)` plus deterministic witness merge — never invent ids from TSE alone.
2. **Witnesses**: many publications/PDFs/pages can point at one poll. Link via `witness_ids` on the poll and `poll_id` on each witness (nullable until linked).
3. **TSE** (`tse_registration_id`): **provenance only**, not truth for results or sole identity.
4. **Geography**: national schema stays `national` only (**do not widen**). Regional uses parallel schema/tree. State polls never enter national aggregates.
5. **Trend date**: `fieldwork_end` orders the series. Stats Option B dates at `fieldwork_mid` when present.
6. **Scenario**: never mix scenarios in one aggregate. Binding keys:
   - `stimulated_1st_round` → assemble → `site/data/canonical-points.json`
   - `stimulated_2nd_round_<cand_a>_vs_<cand_b>` → assemble → `site/data/canonical-points-2nd-round.json`
   - Regional (any of the above) → `site/data/canonical-points-regional.json` only
   See [`docs/scenario-convention.md`](../docs/scenario-convention.md).
7. **Anti-replicate**: see [`docs/cross-reference.md`](../docs/cross-reference.md). Same poll from multiple mirrors → one canonical row + witness provenance links.
8. **Parsers**: `parser_id` is config/mapping driven — no self-modifying parsers.

## Witness merge (sketch)

- Same institute + overlapping/identical fieldwork window + same scenario + consistent geography(+uf) → candidates for one `poll_id`.
- Prefer institute primary release over secondary press when results conflict; record conflicts in `notes` / supplements — do not silently average disagreeing witnesses.
- Content hash on witnesses detects duplicate retrievals.

## EXAMPLE fixtures

- National: `fixtures/national/` (`EXAMPLE_poll.json`, …)
- Regional: `fixtures/regional/` (`EXAMPLE_poll_regional.json`, …)

Files with `example_` ids are **synthetic** and must never be treated as real Brazilian polls.

## Superseded

Legacy workspace `data/SCHEMA.md` / bare `Poll[]` with percent `pct` fields are **non-binding**. Quarantined under `_quarantine/` locally; not SoT.
