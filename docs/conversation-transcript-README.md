# Conversation transcript README

**Purpose:** Explain the durable RAW-style conversation dumps under `docs/`.

## What these files are

- [`conversation-transcript.md`](conversation-transcript.md) — **index** of Lead + Pipeline dumps.
- [`lead-conversation-transcript.md`](lead-conversation-transcript.md) — Lead-lane RAW-style dump (USER / LEAD / visible PIPELINE pings).
- [`pipeline-conversation-transcript.md`](pipeline-conversation-transcript.md) — Pipeline-lane RAW dump from **ReadTranscript** (agent `1586113f-335b-4638-9ed8-524655473c18`).

They prefer **completeness of USER turns** and durable Lead/Pipeline explanations over tool-call noise.

## Fidelity

| Dump | Source |
|------|--------|
| Pipeline | ReadTranscript of Pipeline chat (`d12c22b` on main). USER lines are quoted; PIPELINE lines keep visible reply snippets (ellipses where summarized). |
| Lead | Durable docs (`conversation-decisions`, AI-HANDOFF, status logs, gap/deep-port) **plus** shared USER verbatim quotes also captured in the Pipeline dump. Lead mechanical JSONL was not on this box at first write. |

## What they are not

- Not a curated decision-only memo (see [`conversation-decisions.md`](conversation-decisions.md) / [`pipeline-conversation-decisions.md`](pipeline-conversation-decisions.md)).
- Not authorization to resume product work while the pause gate holds.

## Possible later append

A full mechanical JSONL export of the Lead (or this Grok Bot) session **may be appended later by Lead** if the platform transcript becomes recoverable. Until then, these markdown dumps are the durable human/AI-readable record in-repo. Do not replace the Pipeline ReadTranscript dump with a weaker paraphrase.
