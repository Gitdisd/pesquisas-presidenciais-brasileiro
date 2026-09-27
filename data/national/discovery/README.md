# National discovery queue

Human-gated **candidates** from `bin/pebr watch` (patterns adapted from `pesquisas-eleitorais-br` discover-polls — **without** share extraction).

| File | Role |
|------|------|
| `queue.json` | Review queue (URLs, scores, metadata). **Not** poll data. |
| `last-run.json` | Watcher health report (targets, fetch errors, counts). |

## Rules

- Discover ≠ ingest. Queue items never carry poll shares.
- `needs_human_review` → operator dual-enters poll + witness after primary check.
- `already_witnessed` → URL matches an existing witness `source_url`.
- `inbox_low_score` → weak signal; do not treat as ready to ingest.
- CI may upload artifacts; must **not** auto-write poll JSON.
- Under `data/` (not `site/`) so Pages does not publish the inbox.

See [`docs/discovery.md`](../../../docs/discovery.md).
