# `data/regional/` — state (UF) presidential polls

Parallel tree to [`data/national/`](../national/). **State presidential** fieldwork only (cargo Presidente scoped to one UF/DF).

| Path | Role |
|------|------|
| `polls/*.json` | Canonical regional polls (`schemas/poll-regional.schema.json`) |
| `witnesses/*.json` | Coverage witnesses (`schemas/witness.schema.json` — shared) |
| `discovery/queue.json` | Human-gated URL review queue (no shares) |
| `discovery/inbox/` | Optional human HTML/PDF drops for regional primaries |

## Hard rules

1. **Never** copy rows into `data/national/polls/` or into `site/data/canonical-points.json` / `canonical-points-2nd-round.json` / `chart.json` / `chart-2nd-round.json`.
2. Assemble emits **only** `site/data/canonical-points-regional.json` (separate file; empty `[]` is valid).
3. Same identity + witness + anti-replicate rules as national (see [`docs/cross-reference.md`](../../docs/cross-reference.md)); fingerprint includes `uf`.
4. **Multi-geo no-blend:** selecting multiple UFs must never produce a blended “Brazil” mean (old Chart #2 reason — keep Chart 1 national Option B pure).
5. Old-site `polls-regional.json` = **URL leads only** — never copy candidate `%`.
6. Holds: Michelle out; Ipec national stimulated 1º hard-stop still applies to national tree; no inventing; no Playwright.

## Intake status (intake-regional-001)

Prefer UF first-fill: **SP / MG / DF / PE**. Dual-entered only with extractable primary (HTML/PDF text tables). Image-only / missing PDF → hold.

Assemble → `site/data/canonical-points-regional.json` (see count in that file / `bin/pebr assemble` output). National canonical stays untouched (117/203).
