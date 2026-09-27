# Manual evidence intake (stubborn sources)

This is the human path for JS/WAF/PesqEle, paywalled, or otherwise fragile sources. It is deliberately boring: save the bytes, hash them, then enter shares only after a human primary-source check. The watcher never parses HTML/PDF shares.

## Checklist

1. Open the primary or an openly published mirror in a normal browser. Do not automate login, CAPTCHA, paywall, or TSE-403 workarounds.
2. Save the page as HTML or download the report as PDF. Preserve the original URL and retrieval time.
3. Drop the file into PEBR and record its source URL:

   ```bash
   bin/pebr drop /path/to/saved-report.pdf \
     --source-url 'https://example.org/report.pdf' \
     --title 'Institute report — national presidential poll' \
     --source-id institute-release
   ```

   `drop` copies only `.html`, `.htm`, or `.pdf` bytes to `data/national/discovery/inbox/`, writes a JSON sidecar, and prints a SHA-256 `content_hash`. It does not inspect or extract poll cells.

4. Index the drop into the review queue:

   ```bash
   bin/pebr watch --offline
   ```

   Review `data/national/discovery/queue.json`. A drop is `kind: human_drop`, `listing_via: human_drop`, and `status: needs_human_review`.
5. Open the saved evidence and its source URL. Confirm national presidential scope, fieldwork dates, institute, TSE registration/provenance, methodology, and that the report is the primary witness. Wikipedia, TradeMap, Google News, and press citations are leads only.
6. Create a witness JSON under `data/national/witnesses/` with `source_url`, `content_hash`, retrieval metadata, and the human review details. Never treat a TSE registration ID or aggregator row as shares.
7. Dual-enter fractions **0–1** into `data/national/polls/<poll_id>.json`, link `witness_ids`, then run:

   ```bash
   bin/pebr validate && bin/pebr normalize && bin/pebr assemble
   ```

8. Commit the poll, witness, and refreshed canonical files together. A lead may re-export charts separately; discovery never edits chart/UI files.

## Drop-folder contract

- Accepted evidence: HTML/PDF only; sidecar: `<file>.html.json`, `<file>.pdf.json`, or `<file>.htm.json`.
- Sidecar keys consumed: `source_url`, `title`, `source_id`, and `retrieved_at`; all poll/share fields are ignored.
- Queue contains URL/path, byte hash, type, and review metadata only. It never contains `shares`, `results`, `pct`, or `poll_id`.
- A file drop is not a witness until a human has checked the primary source and created the normal witness JSON.
