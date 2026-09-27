# National discovery queue

Human-gated **candidates** from `bin/pebr watch` (patterns adapted from `pesquisas-eleitorais-br` discover-polls — **without** share extraction).

| File | Role |
|------|------|
| `queue.json` | Review queue (URLs, scores, metadata). **Not** poll data. |
| `last-run.json` | Watcher health report (targets, fetch errors, `via` fixture/network/archive, counts). |

## Rules

- Discover ≠ ingest. Queue items never carry poll shares.
- `needs_human_review` → operator dual-enters poll + witness after primary check.
- `already_witnessed` → URL matches an existing witness `source_url`.
- `inbox_low_score` → weak signal; do not treat as ready to ingest.
- CI may upload artifacts; must **not** auto-write poll JSON.
- Under `data/` (not `site/`) so Pages does not publish the inbox.

## Review UX

Sort: status → `review_bucket` → score → recency. Prefer `meta.operator_summary`.
Buckets: `human_drop_new`, `primary_document`, `national_press`, `old_site_lead`, `provenance`, `regional_breakout`, `aggregator`, …
Old-site harvest items are **leads only** (`listing_via: old_site_harvest`) — never unverified shares.

1. Open `queue.json` (or CI artifact `pebr-discovery-queue`).
2. Work top-down (`needs_human_review`, high score first).
3. Prefer items from `g1-pesquisas-rss`, institute-specific `gnews-*`, `poder360-feed`.
4. Treat `listing_via: archive` as a **listing hint** only — still fetch the live primary/press URL for the witness `content_hash` when possible.
5. Dual-enter shares as fractions 0–1 into `data/national/polls/` — never paste invented CI cells.

See [`docs/discovery.md`](../../../docs/discovery.md) and [`docs/adr/0001-discovery-bypass-blockers.md`](../../../docs/adr/0001-discovery-bypass-blockers.md).
