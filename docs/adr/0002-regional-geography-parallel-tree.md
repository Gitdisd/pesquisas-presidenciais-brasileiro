# ADR 0002 — Regional geography via parallel tree (not widening national enum)

**Status:** Accepted (foundation 2026-09-27)  
**Repo:** pesquisas-presidenciais-brasileiro  
**Companion:** [`docs/regional.md`](../regional.md), [`docs/old-site-deep-port.md`](../old-site-deep-port.md)

## Context

Old Chart #2 mixed national + UF presidential polls for **inspection**, while Chart 1’s national aggregate stayed pure and multi-geo means were forbidden. NEW locked `poll.schema.json` to `geography: "national"`. Widening that enum would risk state rows leaking into Option B.

## Decision

1. **Do not** widen national `geography` (remains `const: "national"`).
2. Add `schemas/poll-regional.schema.json` with `geography: "state"` + required `uf`.
3. Store intake under `data/regional/{polls,witnesses,discovery}/`.
4. Assemble writes **`site/data/canonical-points-regional.json` only** — never merge into national canonical/chart files.
5. Same identity, witness, and anti-replicate rules; fingerprint includes `uf`.
6. Document multi-geo no-blend for any future Stats/UI consumer.

## Consequences

- National Option B pipeline unchanged (117/203 unless new national primaries).
- UI regional Capítulo 2 remains Lead-gated until regional polls exist.
- Discovery may queue old-site regional URL leads; dual-enter requires extractable primary.
