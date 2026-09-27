# Cross-reference / anti-replicate (before canonical & charts)

**Goal:** one fieldwork+scenario+geo identity → **one** canonical poll row. Multiple mirrors become **witnesses** (provenance URLs), not extra chart points.

Applies to **national and regional** trees. Regional rows never join national Option B.

## Hard fails (`bin/pebr normalize` → exit 1)

| Check | Key | Action |
|-------|-----|--------|
| Duplicate `poll_id` | filename / field | Error |
| Duplicate identity fingerprint | `institute_id\|fieldwork_start\|fieldwork_end\|geography\|[uf\|]\|election_cycle\|scenario` | Error — two poll_ids, one identity |
| Soft intake twin | `institute_id\|fieldwork_end\|geography\|[uf\|]\|scenario\|sample_size` with **different** `poll_id` | Error — near-duplicate that would plot twice |
| Geography leak | national poll with `geography != national`; regional with `geography != state` or missing `uf` | Error |
| Tree leak | regional `uf` present under `data/national/polls` (or national under regional) | Error |

## Warnings (report; do not auto-merge)

| Check | Meaning |
|-------|---------|
| Shared `content_hash` across witness_ids | Same bytes retrieved twice — OK if intentional mirrors; prefer one witness + notes |
| Same normalized `source_url` → multiple poll_ids | Often legitimate (one article, many 2º matchups). Review if same scenario |
| Same `tse_registration_id` + same `scenario` + same geography(+uf) → multiple poll_ids | Possible TSE reuse / mistype — human review (do not silently drop; May vs July RTBD BR-05864 is an example warning) |
| Overlapping fieldwork window + same institute + scenario + geo(+uf) + highly similar candidate set | Suspect re-entry — human review before assemble |

## Witness merge (operator)

1. Prefer institute primary PDF/HTML over secondary press when results conflict.
2. Same poll, many URLs → **one** poll JSON; append `witness_ids`; never a second poll_id.
3. Never invent shares to “fill” a mirror.
4. 2º pairwise: one poll per lex-sorted matchup scenario (see [`scenario-convention.md`](scenario-convention.md)).

## Assemble guards

- National assemble reads **only** `data/national/polls/` → `canonical-points.json` + `canonical-points-2nd-round.json`.
- Regional assemble reads **only** `data/regional/polls/` → `canonical-points-regional.json`.
- Provenance retained on every point: `poll_id`, `institute_id`, `sample_size` (N), `geography`, `uf` (regional), `scenario`, `source_path`, optional `tse_registration_id`.
- Unknown scenario keys → hard fail (no silent drop).
- Fingerprint collision inside an assemble batch → hard fail.

## CI

[`.github/workflows/refresh.yml`](../.github/workflows/refresh.yml): `validate` → `normalize` → `assemble` → drift check on **all three** canonical JSON files (1º, 2º, regional).

## Holds

Michelle out · Ipec 2026 national stimulated 1º hard-stop · no Playwright · no inventing · no login/CAPTCHA/paywall bypass.
