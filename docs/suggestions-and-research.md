# Suggestions and research

Durable copy of Lead replies from chat (BRT 2026-09-27), for handoff. Product work remains paused unless the user unpauses.

---

## 1. Suggestions for deeper research / next work

Yes. Here are the highest-value deeper research / build ideas I’d queue — still under the current stack, no new architecture. Say which bucket to run and I’ll unpause only that.

### Website / Pages

1. Perf audit of dense D3 SVG (117+203 points, regional growing) — virtualize table, throttle redraw, measure lag on phone.
2. Accessibility pass: keyboard, screen reader for chips/charts, focus rings.
3. “What changed since last visit” strip (diff of latest Option B vs prior export stamp).

### Chart building / UX

4. Finish Chart #2 properly: Option B `chart-regional.json` for the 24 UF rows, then single-UF aggregate rules (never blend UFs into a Brazil mean).
5. Linked brushing without a range slider — select a time window on Chart #1 and mirror on Chart #2 / table.
6. Uncertainty ribbons readability study (Option B bands vs institute scatter).

### Plotting math / algorithms

7. Stress-test Option B: √N weights, 14d window, anti-flood — sensitivity memo + unit fixtures when one institute floods.
8. House-effects research as *optional overlay* (never silent default) — document bias, don’t bake into Option B.
9. Soft-twin / fingerprint dedupe false-positive audit on the 117/203 set.
10. Fieldwork-end vs mid-campo dating conventions across institutes.

### Polling research

11. Stimulated vs spontaneous national 1º as a first-class scenario (if primaries exist) — separate series, not mixed.
12. Sample-size / margin-of-error display from N when institutes publish it.
13. TSE witness graph: how often news BR-ids disagree with ZIP/Wayback mirrors.

### Coding / GitHub

14. Contract tests: canonical schema → chart JSON → UI load smoke in Actions.
15. Pages deploy cache-busting for `chart.js` / data JSON after Actions.
16. `pipeline-status.json` for the site “Verificar agora” / health footer (queue depth, last assemble).

### Architecture (keep Ruby→Python→static; deepen contracts)

17. Explicit “lane API”: what Pipeline may write vs what Lead must re-export — schema version field.
18. Regional vs national provenance fields unified so Chart #2 can’t accidentally read national files.

### Pipeline-only research (task on unpause)

19. Extractable-primary map for image/Arte PDFs (hold vs OCR policy — no inventing).
20. Expand regional SP/MG/DF/PE + other UFs with same anti-replicate CI.
21. Acquisition robots: more RSS→PDF resolution + Wayback for dead primaries; TSE mirror/egress note only if still blocked.

**Default pick if unpausing:** #4 + #7 + #14 (light up Chart #2, harden Option B math docs/tests, CI contract).

---

## 2. Background: Brazilian election polling

Brazilian election polling sits on a mix of private institutes, media commissions, and public regulation. For presidential races the important pieces are:

### Electoral calendar

Brazil runs a two-round system. If nobody wins an absolute majority of valid votes in the first round (1º turno), the top two advance to a runoff a few weeks later (2º turno). Polls therefore split into first-round fields (often many candidates) and head-to-head runoff scenarios. Mixing those series is a common error.

### What “estimulada” vs “espontânea” means

Spontaneous asks who you would vote for with no list. Stimulated shows a ballot of names (sometimes with parties). Stimulated numbers are denser and more comparable over time; spontaneous is noisier and often understates lesser-known names. PEBR’s national chart path is built around stimulated-style verified tables when that’s what the primary publishes.

### Sample design

Good national polls use stratified probability samples (region, city size, sex/age quotas), face-to-face or phone/online. Sample size (N) drives statistical uncertainty roughly like \(1/\sqrt{N}\). Institutes also report fieldwork dates; the end of fieldwork is the honest x-axis date for a time series.

### Institutes & brands

Frequent national names include Datafolha, Ipec (ex-Ibope), Quaest, AtlasIntel, Paraná Pesquisas, CNT/MDA, Ideia, Gerp, Futura, and others. Methods and house styles differ: some lean online panels, some door-to-door. Treating every institute as interchangeable without showing raw points hides that.

### Regulation & transparency

Electoral polls aimed at influencing voters are registered with the TSE (Tribunal Superior Eleitoral). Registrations and some metadata are public; full microdata and every press chart are not. News sites often republish tables; the primary is the institute PDF/HTML or the TSE filing. Paywalls, image-only charts, and dead links are why PEBR insists on extractable primaries and witnesses.

### Second round tables

Media often publish many hypothetical matchups (Lula×Flávio, Lula×Zema, …). Those are separate scenarios. Averaging across matchups invents a race that wasn’t asked. PEBR keeps pairwise 2º series separate (`chart-2nd-round.json`).

### State vs national

State (UF) presidential polls answer a different question and must not be pooled into a national mean. The old site’s “Capítulo 2” / PEBR Chart #2 exists so regional rows stay inspectable without contaminating Brazil aggregates.

### Why aggregates need rules

With many houses posting often, a naïve average lets one chatty institute dominate. Option B uses sample-size weights, a short trailing window, and anti-flood logic, and still plots every raw point so readers can see disagreement.

### 2026 context (product scope)

PEBR is tracking the 2026 presidential cycle on a static GitHub Pages site: verified national points first, regional UF as a parallel track, Michelle Bolsonaro excluded as a non-candidate, no invented cells in CI.

---

## Pointers

- Cold pickup: [`docs/AI-HANDOFF.md`](AI-HANDOFF.md)
- Status logs: [`docs/lead-status-log.md`](lead-status-log.md), [`docs/pipeline-status-log.md`](pipeline-status-log.md)
