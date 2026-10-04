# Conversation decisions — durable user steering

**Scope:** PEBR Lead product decisions and explanations that must survive a chat handoff. This is a curated decision record, not a transcript.

**Time zone:** Entries use BRT (America/Sao_Paulo), approximately 2026-09-26–27. Where a precise prompt is not preserved verbatim, the wording below is a faithful durable summary of the user steering recorded in Lead memory, status logs, and implementation notes.

**Historical gate:** Product work was **PAUSED** on 2026-09-27. The user's explicit 2026-10-04 instruction to update and repair the site supersedes that pause for the current maintenance cycle. Locked architecture, no-inventing, candidate, discovery, and no-restyle rules remain binding. Current execution is tracked in [`maintenance-log-2026-10-04.md`](maintenance-log-2026-10-04.md).

## 2026-09-26 — Greenfield, architecture, and defaults

### Greenfield PEBR; lock the stack

**User steering:** This is a greenfield PEBR project, not a request to reproduce the old repository wholesale. Lock the working path as:

```text
Ruby pipeline → Python Option B → static HTML/CSS + vanilla JavaScript + D3
```

Do not reopen the choice in favor of TypeScript, a SPA, Vite/bundlers, ECharts, Go, WASM estimators, or another framework.

**Why it matters:** A future AI should implement new behavior inside the existing low-dependency path. “Port” means selectively preserve useful behavior and research semantics, not migrate the old architecture or its visual skin.

### Option B is the default statistical path

**User steering:** Use Python Option B as the default aggregate/model for the Pages product. National first-round data is the first-class path; pairwise second-round scenarios remain separate rather than being blended into it.

**Why it matters:** The default is deterministic, documented, and owned by Lead. Pipeline can assemble verified canonical data, but it must not invent shares or silently regenerate/replace the Option B exports.

### Pages are live

**User steering:** Treat the static GitHub Pages site as the real product surface, not a throwaway prototype.

**Why it matters:** Product decisions apply to the deployed Pages UI and its static data contract. Live site: <https://gitdisd.github.io/pesquisas-presidenciais-brasileiro/>.

## 2026-09-26 — Chart interaction and visual direction

### Reject the old hover scoreboard and range slider

**User steering:** The user explicitly disliked the old hover scoreboard and the bottom range slider. Keep interaction point-focused: point-only hover with an external/detail panel, rather than an all-candidate scoreboard over the plot. Use TradingView-style pan and zoom instead of a brush/range slider.

**Why it matters:** These are locked UX constraints, not unfinished polish. Period chips may choose the X-domain, but there is no brush or bottom slider. Future chart work must preserve pan/zoom and point-only inspection.

### Features, not a visual restyle

**User steering:** “No restyle”; preserve the useful **features**, but do not give the new product the old site’s exact look (“features I don’t want the exact look”).

**Why it matters:** Borrow behavior where it improves research use—filters, sharing, tables, verification, and chart semantics—while keeping the new static PEBR information architecture, styling, and accessibility choices. Do not clone old chrome merely for visual parity.

### Michelle Bolsonaro is not a candidate

**User steering:** Michelle Bolsonaro is permanently out of candidate/scenario scope.

**Why it matters:** Do not add Michelle to candidate configuration, poll scenarios, examples, charts, discovery tasks, or UI fallbacks. A source mentioning her is not permission to create a PEBR series.

## 2026-09-26 — National first and the meaning of Chart #2

### National first; preserve geography boundaries

**User steering:** Start with verified national presidential polls. National geography remains locked for the national Option B path; regional/UF work belongs in a separate tree and output.

**Why it matters:** State rows must never leak into `canonical-points.json`, `chart.json`, or the national second-round chart. No invented or blended “Brazil” line may be made from multiple UFs.

### Chart #2 is regional geo isolation, not a 1º/2º split

**User steering:** Chart #2 is for regional/UF inspection—geographic isolation—not “first round versus second round.” The national `chart.json` versus `chart-2nd-round.json` distinction is a separate round/scenario split.

**Why it matters:** Keep the product axes separate:

- **Chart #1:** pure national Option B.
- **Chart #2:** regional/UF data in the parallel regional tree; it must not contaminate Chart #1.
- **Round/scenario controls:** apply to national first/second-round material independently of the geographic job of Chart #2.

When an aggregate is shown for regional data, it is allowed only for a single selected UF (or otherwise explicitly non-blended data); never present a multi-UF mean as Brazil.

## 2026-09-27 — Product features and interaction clarification

### Remove CSV/JSON export buttons

**User steering:** Remove the CSV and JSON export buttons from the Pages UI. Keep the shareable URL/state behavior.

**Why it matters:** Export buttons are not a required product surface in the current direction. Do not reintroduce them as part of a feature port or “cleanup.” Sharing and inspectable published data remain the supported paths.

### Collapsible Institutos, Candidatos, and Modelo

**User steering:** The `Institutos`, `Candidatos`, and `Modelo` sections should be independently collapsible so the dense filter area can be managed without hiding unrelated controls.

**Tap-target clarification:** The collapse affordance must not be confused with the filter chips. The section heading/full-width toggle is the tap target for collapse/expand; the chips remain their own tap targets for filtering. Make the heading obvious and accessible, and do not make static methodology chips pretend to be filters.

**Why it matters:** On touch screens, ambiguous or overlapping targets make users change a filter when they intended to collapse a section (or vice versa). Keep section state independent and persist it only as UI state; do not change the meaning of institute/candidate/model selections.

## 2026-09-27 — Pipeline stewardship, handoff, and tooling

### Keep Pipeline continuously tasked, with robust acquisition and anti-replicate

**User steering:** Keep the Pipeline workstream continuously tasked while product work proceeds: harden acquisition, maintain human-gated discovery, and enforce anti-replicate/identity checks. Pipeline should keep producing durable status and queues rather than becoming an ad hoc scraper.

**Why it matters:** Acquisition failures (blocked listings, archive gaps, image-only evidence, or missing primary witnesses) produce leads and review work—not invented percentages. Pipeline owns schemas, witnesses, dual-enter intake, discovery queues, assembly, and anti-replicate. Lead owns the Pages UI and Option B chart exports. Do not dual-lane the same file or ask Pipeline to edit UI/chart code.

The continuous loop is now **stopped by the user pause**. “Continuously tasked” describes the standing operating model, not permission to resume intake during the pause.

### Playwright is out

**User steering:** Playwright is out of discovery and CI.

**Why it matters:** Use the documented human-gated URL/witness flow, RSS/listing/archive fallbacks, and manual evidence drop where appropriate. Do not introduce a browser automation workaround for blocked or JS-heavy sources.

### Pause and document for handoff

**User steering:** Pause product work and document the state for handoff. The repository must contain an `AI-HANDOFF` cold-start brief, pause/status logs, and the durable conversation prompts/explanations—not just a chat history.

**Why it matters:** Another AI must be able to understand both the current gate and the reasons behind the locks without reconstructing a conversation. The authoritative cold-start brief is [`AI-HANDOFF.md`](AI-HANDOFF.md); the operational snapshots are [`lead-status-log.md`](lead-status-log.md), [`pipeline-status-log.md`](pipeline-status-log.md), and [`TASK-LOG-PAUSE.md`](TASK-LOG-PAUSE.md). This file adds the user-facing steering and rationale those status logs summarize.

## Standing interpretation for future AIs

1. Read [`AI-HANDOFF.md`](AI-HANDOFF.md) and this decision record before touching product work.
2. “Features, not restyle” means behavior can be ported selectively; it never reopens the visual or framework lock.
3. Keep national and regional data planes separate, and do not reinterpret Chart #2 as the national second round.
4. Never invent poll shares, candidate series, or witnesses. Pipeline leads are not verified data.
5. While paused, documentation is the only permitted lane. Resume requires an explicit user order.

## Source trail

This record consolidates the durable direction in [`docs/AI-HANDOFF.md`](AI-HANDOFF.md), [`docs/lead-status-log.md`](lead-status-log.md), [`docs/pipeline-status-log.md`](pipeline-status-log.md), [`docs/TASK-LOG-PAUSE.md`](TASK-LOG-PAUSE.md), [`docs/old-site-deep-port.md`](old-site-deep-port.md), [`docs/feature-gap-audit.md`](feature-gap-audit.md), and the corresponding implementation history from 2026-09-26–27. It intentionally omits transient chat turns, intermediate working-tree details, and product tasks that were not durable decisions.

For a RAW-style chronological dump of known USER / LEAD / PIPELINE turns reconstructed from those sources, see [`conversation-transcript.md`](conversation-transcript.md) (index), [`lead-conversation-transcript.md`](lead-conversation-transcript.md), and [`pipeline-conversation-transcript.md`](pipeline-conversation-transcript.md).


## 2026-10-04 — explicit resume

The user explicitly resumed product work for election-day maintenance. The previous pause gate is superseded for this work cycle. The architecture and data-integrity locks remain unchanged. Current work is tracked in election-day-maintenance-2026-10-04.md.
