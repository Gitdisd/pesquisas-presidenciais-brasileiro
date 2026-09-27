# Lead conversation transcript (docs-sourced RAW dump)

**Lane:** PEBR Lead (product / Option B / static UI)  
**Written:** 2026-09-27 ~02:30 BRT (America/Sao_Paulo)  
**Fidelity:** Reconstructed from durable repo docs **plus** shared USER verbatim quotes also preserved in the Pipeline ReadTranscript dump. Mechanical chat JSONL for the Lead agent was **not** available on this box at dump time (`store.db` transcript tables empty / no `agent-transcripts` JSONL for the Lead session). Sister Pipeline dump [`pipeline-conversation-transcript.md`](pipeline-conversation-transcript.md) **is** ReadTranscript-sourced (already on main via `d12c22b`).  
**Rule:** Prefer completeness of USER turns. Do **not** treat paraphrases as invented chat. Labels:

| Tag | Meaning |
|-----|---------|
| `USER` | User steering (prompt / decision) |
| `LEAD` | Lead explanation or product reply mirrored in docs |
| `PIPELINE` | Visible Pipeline ping / status the Lead recorded |
| `VERBATIM` | Exact quoted words from source docs |
| `PARAPHRASE` | Faithful durable summary from source docs (not a fabricated turn) |

**Sources:** [`conversation-decisions.md`](conversation-decisions.md), [`AI-HANDOFF.md`](AI-HANDOFF.md), [`lead-status-log.md`](lead-status-log.md), [`pipeline-status-log.md`](pipeline-status-log.md), [`TASK-LOG-PAUSE.md`](TASK-LOG-PAUSE.md), [`feature-gap-audit.md`](feature-gap-audit.md), [`old-site-deep-port.md`](old-site-deep-port.md).  
**Sister dump:** [`pipeline-conversation-transcript.md`](pipeline-conversation-transcript.md) · **Index:** [`conversation-transcript.md`](conversation-transcript.md)

---

## T00 — Gate (current)

**PIPELINE / LEAD** · PARAPHRASE · sources: AI-HANDOFF §1, lead-status-log, TASK-LOG-PAUSE

Product work is **PAUSED** (user halt 2026-09-27). Documentation-only until the user explicitly says **resume**. PR #1 regional fill is **MERGED** (`59f9f03`); regional **24** points on main; `chart-regional.json` on HEAD still empty stub; Option B `--geography state` WIP may exist uncommitted — do not commit blindly during pause.

---

## T01 — 2026-09-26 — Greenfield PEBR; lock the stack

**USER** · PARAPHRASE · source: conversation-decisions.md §Greenfield

This is a greenfield PEBR project, not a request to reproduce the old repository wholesale. Lock the working path as:

```text
Ruby pipeline → Python Option B → static HTML/CSS + vanilla JavaScript + D3
```

Do not reopen the choice in favor of TypeScript, a SPA, Vite/bundlers, ECharts, Go, WASM estimators, or another framework.

**LEAD** · PARAPHRASE · source: conversation-decisions.md “Why it matters”; AI-HANDOFF §0–§2

A future AI should implement new behavior inside the existing low-dependency path. “Port” means selectively preserve useful behavior and research semantics, not migrate the old architecture or its visual skin. Lead owns Pages UI + Option B exports; Pipeline owns schemas/intake/discovery/anti-replicate.

---

## T02 — 2026-09-26 — Option B default; Pages are live

**USER** · PARAPHRASE · source: conversation-decisions.md

Use Python Option B as the default aggregate/model for the Pages product. National first-round data is the first-class path; pairwise second-round scenarios remain separate rather than being blended into it. Treat the static GitHub Pages site as the real product surface, not a throwaway prototype.

**LEAD** · PARAPHRASE · sources: AI-HANDOFF; methodology-aggregate-option-b.md; site live URL in lead-status-log

Default is deterministic, documented, Lead-owned. Pipeline may assemble verified canonical data but must not invent shares or silently regenerate/replace Option B exports. Live site: https://gitdisd.github.io/pesquisas-presidenciais-brasileiro/

---

## T03 — 2026-09-26 — Reject old hover scoreboard and range slider

**USER** · PARAPHRASE (+ locked UX inventory) · sources: conversation-decisions.md; feature-gap-audit.md; old-site-deep-port.md

The user explicitly disliked the old hover scoreboard and the bottom range slider. Keep interaction point-focused: point-only hover with an external/detail panel, rather than an all-candidate scoreboard over the plot. Use TradingView-style pan and zoom instead of a brush/range slider.

**LEAD** · PARAPHRASE · sources: lead-status-log (`6a5f30f`); feature-gap-audit “Intentionally skip”

These are locked UX constraints, not unfinished polish. Period chips may choose the X-domain; there is no brush or bottom slider. Shipped pan/zoom without range brush (`6a5f30f`). Skip forever: bottom range/brush slider; all-candidate % hover scoreboard.

---

## T04 — 2026-09-26 — Features, not a visual restyle

**USER** · VERBATIM fragments · source: conversation-decisions.md

> “No restyle”; preserve the useful **features**, but do not give the new product the old site’s exact look (“features I don’t want the exact look”).

**LEAD** · PARAPHRASE · sources: conversation-decisions.md; old-site-deep-port.md §5; feature-gap-audit

Borrow behavior where it improves research use—filters, sharing, tables, verification, chart semantics—while keeping the new static PEBR information architecture, styling, and accessibility choices. Do not clone old chrome merely for visual parity. Explicit skip: visual restyle to clone old look (“Features not skin”).

---

## T05 — 2026-09-26 — Michelle Bolsonaro permanently out

**USER** · PARAPHRASE · sources: conversation-decisions.md; feature-gap-audit; pipeline-conversation-decisions.md

Michelle Bolsonaro is permanently out of candidate/scenario scope.

**LEAD** · PARAPHRASE · sources: AI-HANDOFF §2; discovery holds

Do not add Michelle to candidate configuration, poll scenarios, examples, charts, discovery tasks, or UI fallbacks. A source mentioning her is not permission to create a PEBR series.

---

## T06 — 2026-09-26 — National first; geography boundaries

**USER** · PARAPHRASE · source: conversation-decisions.md

Start with verified national presidential polls. National geography remains locked for the national Option B path; regional/UF work belongs in a separate tree and output.

**LEAD** · PARAPHRASE · sources: AI-HANDOFF; ADR 0002; regional.md

State rows must never leak into `canonical-points.json`, `chart.json`, or the national second-round chart. No invented or blended “Brazil” line may be made from multiple UFs. Regional lives in `data/regional/` → `canonical-points-regional.json` only.

---

## T07 — 2026-09-26/27 — Chart #2 is geo isolation, not 1º/2º

**USER** · PARAPHRASE · sources: conversation-decisions.md; pipeline-conversation-decisions.md (“national-versus-state view, not 1º-versus-2º”)

Chart #2 is for regional/UF inspection—geographic isolation—not “first round versus second round.” The national `chart.json` versus `chart-2nd-round.json` distinction is a separate round/scenario split.

**LEAD** · PARAPHRASE · sources: old-site-deep-port.md §2; AI-HANDOFF §9; regional.md

Keep product axes separate:

- **Chart #1:** pure national Option B.
- **Chart #2:** regional/UF data in the parallel regional tree; must not contaminate Chart #1.
- **Round/scenario controls:** apply to national first/second-round material independently of Chart #2’s geographic job.

**False:** “Chart #2 = 2º turno.”  
**True:** Old Chart #2 existed so UF polls can be inspected without contaminating Chart #1’s national aggregate.

Shipped: interim national companion (1º ↔ Lula×Flávio) demoted (`ecb9e4a`); Chart #2 regional UI shell + empty stub (`7d65082`).

---

## T08 — 2026-09-27 — Remove CSV/JSON export buttons

**USER** · VERBATIM · source: pipeline-conversation-transcript.md §11 (shared order; also conversation-decisions.md)

> "we also don't need a button for CSV and Jason export on the site"

**USER** · PARAPHRASE (Lead decision record) · sources: conversation-decisions.md; feature-gap-audit

Remove the CSV and JSON export buttons from the Pages UI. Keep the shareable URL/state behavior.

**LEAD** · PARAPHRASE · sources: feature-gap-audit; lead-status-log

Export buttons are not a required product surface in the current direction. Compartilhar / URL state kept (`inst` bitmask etc.). Pipeline relays the decision and does not implement product UI during the pause.

---

## T09 — 2026-09-27 — Collapsible Institutos / Candidatos / Modelo

**USER** · PARAPHRASE · source: conversation-decisions.md

The `Institutos`, `Candidatos`, and `Modelo` sections should be independently collapsible so the dense filter area can be managed without hiding unrelated controls.

**Tap-target clarification (USER steering, paraphrased):** The collapse affordance must not be confused with the filter chips. The section heading/full-width toggle is the tap target for collapse/expand; the chips remain their own tap targets for filtering.

**LEAD** · PARAPHRASE · sources: lead-status-log (`6a16f46`, `b6e6230`, `21566df`)

Independent collapsible chart filters shipped; later fixes made collapse headers full-width/obvious so touch users do not change a filter when intending to collapse (or vice versa). Persist section state only as UI state.

---

## T10 — Keep Pipeline continuously tasked (standing model)

**USER** · PARAPHRASE · source: conversation-decisions.md

Keep the Pipeline workstream continuously tasked while product work proceeds: harden acquisition, maintain human-gated discovery, and enforce anti-replicate/identity checks. Pipeline should keep producing durable status and queues rather than becoming an ad hoc scraper.

**LEAD** · PARAPHRASE · sources: conversation-decisions.md; lead-status-log “Pipeline coordination”

Acquisition failures produce leads and review work—not invented percentages. Lead owns Pages UI and Option B chart exports. Do not dual-lane the same file or ask Pipeline to edit UI/chart code.

Ordered Pipeline priorities at pause: (1) Regional fill (2) Anti-replicate (3) Acquisition robots (4) Continuous report-back.

**Note:** The continuous loop is now **stopped by the user pause**. “Continuously tasked” describes the standing operating model, not permission to resume intake during the pause.

---

## T11 — Playwright is out

**USER** · VERBATIM (Pipeline chat) · source: pipeline-conversation-transcript.md §3

> "play write may help"

…later…

> "Docs only: Playwright stays out..."

**USER** · PARAPHRASE · sources: conversation-decisions.md; pipeline-conversation-decisions.md; ADR 0001

Playwright is out of discovery and CI (including the user widget).

**LEAD / PIPELINE** · PARAPHRASE · sources: discovery.md; ADR 0001

Use human-gated URL/witness flow, RSS/listing/archive fallbacks, and manual evidence drop. Do not introduce a browser automation workaround for blocked or JS-heavy sources.

---

## T12 — Feature ports shipped (Lead chronology visible to USER)

**LEAD** · PARAPHRASE · sources: lead-status-log; AI-HANDOFF §6; feature-gap-audit

Recent Lead commits (do not re-do): Pages + deploy; larger chart + period/candidate filters; TradingView pan/zoom; P0 share URL / Option B PT / client filter aggregation; P1 cards/metrics/theme/table/shortcuts + Verificar agora; collapsible filters + tap-target fixes; P2 pager/search/fullscreen/`inst` bitmask; Option B re-export **117** 1º / **203** 2º (`4a7c81b`); companion + deep-port memo; Chart #2 regional UI shell (`7d65082`).

---

## T13 — Pipeline pings visible to Lead (regional PR #1)

**PIPELINE** · PARAPHRASE · sources: lead-status-log; pipeline-status-log

- `a72251e` — regional foundation + anti-replicate + discovery harden.
- Branch `pipeline/regional-chart2-primary-fill` / PR #1 — 24 regional points (SP/MG/DF/PE). Briefing cited tip `5e6be49` and **CONFLICTING** rebase; freeze-time truth: amended tip **`bf4ee83`** landed; PR **MERGED** at `59f9f03` (2026-09-27 02:19 BRT). Lead shell `7d65082` preserved on main.
- National counts remain **117** 1º / **203** 2º. Regional canonical **24** on main. `chart-regional.json` HEAD stub `series: []`.

**LEAD** · PARAPHRASE · sources: AI-HANDOFF §14 correction

Earlier Lead pause wording that said regional 24 were “not confirmed on main” / Option B “WAITING on merge” is **outdated**. First Lead product action after unpause: finish Option B `--geography state` + export non-empty `chart-regional.json`.

---

## T14 — 2026-09-27 — Pause and document for handoff

**USER** · VERBATIM · source: pipeline-conversation-transcript.md §12 (order to both Lead and Pipeline)

> "I need you both to pause , document everything in detail on the repo and leave a log all your tasks that you are presently dowing and plan on doing and have yet todo"

**USER** · PARAPHRASE · source: conversation-decisions.md §Pause

Pause product work and document the state for handoff. The repository must contain an `AI-HANDOFF` cold-start brief, pause/status logs, and the durable conversation prompts/explanations—not just a chat history.

**LEAD** · PARAPHRASE · sources: AI-HANDOFF; lead-status-log; conversation-decisions.md

Docs-only exception while paused. Authoritative cold-start: [`AI-HANDOFF.md`](AI-HANDOFF.md). Operational snapshots: [`lead-status-log.md`](lead-status-log.md), [`pipeline-status-log.md`](pipeline-status-log.md), [`TASK-LOG-PAUSE.md`](TASK-LOG-PAUSE.md). Decision record: [`conversation-decisions.md`](conversation-decisions.md). This transcript is the human/AI-readable RAW-style dump of known USER/LEAD/PIPELINE turns from those sources.

**Explicitly NOT doing while paused:** no merges (PR #1 already done), no dual-enter, no UI features, no restyle, no inventing data, no chart re-exports, no committing dirty Option B WIP “just because it exists.”

---

## T15 — Resume gate (standing)

**USER** · PARAPHRASE · sources: all pause docs

Resume only after an explicit user instruction to resume.

**LEAD** · PARAPHRASE · source: AI-HANDOFF §10

On resume: reread handoff + status logs; `git pull` main; verify 117/203/24; finish regional Option B export first; then one deferred Lead item; task Pipeline separately for more UF dual-enter / national queue mop.

---

*End of Lead docs-sourced transcript. No additional USER turns were invented beyond what the source docs record.*
