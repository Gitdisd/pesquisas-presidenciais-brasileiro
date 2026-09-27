# Conversation transcript — index

**Written:** 2026-09-27 ~02:30 BRT (America/Sao_Paulo)  
**Status:** Product work remains **PAUSED** (docs-only).

This index points at the durable human/AI-readable RAW-style dumps of known USER prompts and Lead/Pipeline replies for PEBR 2026.

## Dumps

| File | Lane | Contents | Fidelity |
|------|------|----------|----------|
| [`lead-conversation-transcript.md`](lead-conversation-transcript.md) | **Lead** (product / Option B / UI) | Chronological USER + LEAD turns (+ visible PIPELINE pings) | Docs-sourced + shared VERBATIM quotes also in Pipeline dump (Lead mechanical JSONL unavailable on box) |
| [`pipeline-conversation-transcript.md`](pipeline-conversation-transcript.md) | **Pipeline** (`1586113f-335b-4638-9ed8-524655473c18`) | Chronological USER + PIPELINE SendToUser snippets | **ReadTranscript-sourced** (commit `d12c22b`); do not overwrite with paraphrases |
| [`conversation-transcript-README.md`](conversation-transcript-README.md) | meta | How this dump relates to possible later mechanical JSONL | — |

## Related decision records (not transcripts)

| File | Role |
|------|------|
| [`conversation-decisions.md`](conversation-decisions.md) | Curated Lead durable decisions + rationale |
| [`pipeline-conversation-decisions.md`](pipeline-conversation-decisions.md) | Curated Pipeline durable decisions |
| [`AI-HANDOFF.md`](AI-HANDOFF.md) | Cold-start brief (pause/resume) |
| [`lead-status-log.md`](lead-status-log.md) / [`pipeline-status-log.md`](pipeline-status-log.md) / [`TASK-LOG-PAUSE.md`](TASK-LOG-PAUSE.md) | Operational freeze snapshots |

## Coordination note

Another executor may append or refine these files. Prefer **git pull/rebase** over fighting. Keep Pipeline’s ReadTranscript dump authoritative for Pipeline USER quotes; enrich Lead dump with shared verbatim quotes rather than replacing the Pipeline file.
