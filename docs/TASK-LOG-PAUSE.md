> **Superseded for current execution (2026-10-04):** This file is a frozen historical pause snapshot. The user's explicit update/repair order resumes work. See [docs/maintenance-log-2026-10-04.md](maintenance-log-2026-10-04.md) for the current checklist and status.

# TASK LOG — USER PAUSE (frozen checklist)

**Frozen at:** 2026-09-27 02:22 BRT (America/Sao_Paulo)  
**Main tip verified:** `59f9f0384eeb163f5e0eec485eb54b005f4e4fe3`  
**Full narrative:** [`docs/pipeline-status-log.md`](pipeline-status-log.md)

Do **not** tick these boxes by doing the work. This list is frozen documentation only.

---

## Presently doing (halted mid-flight)

- [ ] PR #1 `pipeline/regional-chart2-primary-fill` — brief said CONFLICTING/DIRTY; **at freeze: MERGED** (`59f9f03`, tip landed `bf4ee83`; superseded pre-amend `5e6be49` not on main). Preserve Lead shell `7d65082` (already on main).
- [ ] Lead re-export `chart-regional.json` Option B expecting 24 regional points on main — HEAD still empty stub; dirty uncommitted WIP in working tree (**do not commit from Pipeline**).
- [ ] Subagents / Continuous Pipeline loop — **stopped** on user pause.

## Planned (do not start)

- [ ] Confirm / ping exact main SHA after PR #1 (`59f9f03…`) for Lead Chart #2 Option B (no re-merge of #1).
- [ ] Chart #2 Option B export on main → non-empty `site/data/chart-regional.json` series (Lead).
- [ ] More regional UF dual-enter beyond SP/MG/DF/PE (extractable primary only).
- [ ] National discovery queue mop if clean primary + witnesses.
- [ ] Optional `pipeline-status.json` / poll-witness-index.

## Yet to do / deferred blockers (do not start)

- [ ] TSE CDN/dadosabertos 403 + Wayback lag — provenance leads only.
- [ ] Ipec national stimulated 1º hard-stop — still upheld.
- [ ] Michelle permanently out.
- [ ] Playwright stays out of discovery.
- [ ] Quaest Jun-08 dirty residuals — still blocked.
- [ ] Atlas Sep-16 residual prose — still blocked.
- [ ] Image-only PDFs — no inventing.
- [ ] Future PR conflict hygiene (PR #1 itself is merged).

## Finished snapshot (do not redo)

- [x] National on main: **117** 1º / **203** 2º (`canonical-points*.json`).
- [x] Cohorts 2T-001…2T-008 (+ stabilize `71ca278`; watch/bypass/robust/inbox/regional foundation SHAs — see status log).
- [x] Regional **24** points on main via PR #1 (`bf4ee83` → merge `59f9f03`).
- [x] Anti-replicate, watch, inbox, old-site leads, regional docs foundation.

---

*Paused per user 2026-09-27. Resume only on explicit order.*
