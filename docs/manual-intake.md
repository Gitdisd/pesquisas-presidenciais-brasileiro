# Human inbox operator path (stubborn sources)

This is the **human evidence drop** path for JS/WAF/PesqEle, paywalled, PDF-only, or otherwise fragile sources. It is deliberately boring: save the bytes, hash them, review the discovery queue, then enter shares only after a human primary-source check. The watcher never parses HTML/PDF shares.

Companion runbook: [`discovery.md`](discovery.md). Holds (do not weaken): **Michelle out**; **Ipec 2026 national stimulated 1º hard-stop**; Quaest Jun 08 dirty residuals; no image-PDF inventing.

## When to use this path

| Situation | Action |
|-----------|--------|
| Public RSS/GNews/listing URL opens cleanly | Prefer normal queue review — no drop needed |
| JS/WAF/PesqEle / TSE 403 / soft paywall | Save HTML/PDF in a normal browser → `bin/pebr drop` |
| Institute PDF already downloaded | `drop` the PDF with its public `source_url` |
| Old-site row looks useful | Treat as **lead only** — still need PEBR primary witness; never copy old-site `%` |

## Operator checklist

1. Open the primary or an openly published mirror in a normal browser. Do **not** automate login, CAPTCHA, paywall, or TSE-403 workarounds. No Playwright in PEBR.
2. Save the page as HTML or download the report as PDF. Preserve the original URL and retrieval time.
3. Drop the file into PEBR and record its source URL:

   ```bash
   bin/pebr drop /path/to/saved-report.pdf \
     --source-url 'https://example.org/report.pdf' \
     --title 'Institute report — national presidential poll' \
     --source-id institute-release
   ```

   `drop` copies only `.html`, `.htm`, or `.pdf` bytes to `data/national/discovery/inbox/`, writes a JSON sidecar, and prints a SHA-256 `content_hash`. It does **not** inspect or extract poll cells. Binaries under `inbox/` are gitignored; sidecars (`*.pdf.json`) are kept.

4. Index the drop (and refresh statuses against current witnesses):

   ```bash
   bin/pebr watch --offline
   ```

   Review `data/national/discovery/queue.json`:
   - New drops → `kind: human_drop`, `listing_via: human_drop`, `review_bucket: human_drop_new`, `status: needs_human_review`
   - Drop whose `source_url` already has a witness → `status: already_witnessed` / `review_bucket: human_drop_done`
   - Sort is automatic: status → bucket (`human_drop_new` → `primary_document` → `national_press` → `old_site_lead` → …) → score → recency
   - Read `meta.operator_summary` for the top work list and bucket counts

5. Open the saved evidence and its source URL. Confirm **national** presidential scope, fieldwork dates, institute, TSE registration/provenance, methodology, and that the report is the primary witness. Wikipedia, TradeMap, Google News, old-site rows, and press citations are **leads only**.

6. **Extractable primary only.** If shares are not clearly readable (image-only PDF, arte chart without labels, contradictory UL sums), **stop** — leave the queue item for later; do not invent. Respect holds (Michelle scenarios skipped; Ipec national stimulated 1º hard-stop).

7. Create a witness JSON under `data/national/witnesses/` with `source_url`, `content_hash`, retrieval metadata, and the human review details. Never treat a TSE registration ID or aggregator row as shares.

8. Dual-enter fractions **0–1** into `data/national/polls/<poll_id>.json`, link `witness_ids`, then run:

   ```bash
   bin/pebr validate && bin/pebr normalize && bin/pebr assemble
   ```

9. Commit the poll, witness, and refreshed canonical files together. A lead may re-export Option B charts separately (`site/data/chart.json`, `chart-2nd-round.json`); discovery never edits chart/UI files.

## Drop-folder contract

- Path: `data/national/discovery/inbox/`
- Accepted evidence: HTML/PDF only; sidecar: `<file>.html.json`, `<file>.pdf.json`, or `<file>.htm.json`
- Sidecar keys consumed: `source_url`, `title`, `source_id`, `retrieved_at`; all poll/share fields are ignored
- Queue contains URL/path, byte hash, type, and review metadata only — never `shares`, `results`, `pct`, or `poll_id`
- A file drop is **not** a witness until a human has checked the primary and created the normal witness JSON

## Processing whatever is already queued / in inbox

```bash
bin/pebr watch --offline   # index drops + refresh already_witnessed
# Inspect meta.operator_summary.next_actions and items with
#   status=needs_human_review AND review_bucket in (human_drop_new, primary_document, national_press)
```

| Queue signal | Operator decision |
|--------------|-------------------|
| `human_drop_new` with readable national tables | Dual-enter → witness + poll |
| `primary_document` (PDF) national | Same, if labeled bars/% extractable |
| `old_site_lead` | Lead only — fetch PEBR primary; **never** copy old-site cells |
| `regional_breakout` / wrong-office / nav-noise | Skip |
| `hold-ipec-hard-stop` / Michelle | Skip (hard holds) |
| `already_witnessed` | Skip (or refresh witness bytes if hash changed) |
| `inbox_low_score` | Usually ignore |

After dual-enter: `validate` → `normalize` → `assemble` → commit polls + witnesses + both `canonical-points*.json`. Report exact paths + 1º/2º counts for Lead Option B.
