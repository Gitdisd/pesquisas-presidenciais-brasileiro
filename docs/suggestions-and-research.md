## 2026-10-04 resume override

The user explicitly resumed maintenance on 2026-10-04. The former pause is historical; this cycle is tracked in [maintenance-log-2026-10-04.md](maintenance-log-2026-10-04.md). Research locks remain binding: no brush/scoreboard, no Go/WASM/SPA, no Playwright discovery/CI, no invented shares, no silent house effects, and no national/regional blending.

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

## 3. Expert R&D — advanced methods & toggleable models (2026-09-27)

**Status:** Documentation only (product still paused). **No product code. No invented shares.**  
**Full-depth memo:** [`docs/advanced-polling-rnd.md`](advanced-polling-rnd.md)  
**Companion findings (#1–21):** [`docs/suggestions-research-findings.md`](suggestions-research-findings.md)

This section is the Lead-facing summary of a deeper R&D pass: Brazilian two-round / TSE / house-effect context; classical aggregation math (√N, recency kernels, anti-flood, house effects, Kalman/state-space, GP/LOESS, bootstrap vs “CI”); projection features PEBR must **not** claim as truth; and a **Modelo toggle catalog** compatible with locked stack (Ruby→Python Option B→static HTML/CSS+vanilla JS+D3; no TS/SPA; no brush/scoreboard; Chart #2 = UF geo; Michelle out; Playwright out).

### Executive takeaways (compressed)

1. Keep **`option_b_sqrt_n_trailing`** as the honest default forever unless the user explicitly asks otherwise — √N, ~14d, anti-flood, mid-campo, raw points, **no silent house effects**.
2. Separate three uncertainties in product copy: **today’s intention** vs **election-day path** vs **urn outcome**. PEBR ribbons answer a descriptive “today/dispersion” only — never casual “IC” / win-prob labels ([Depois das 17 taxonomy](https://depoisdas17.com.br/2022/metodologia/)).
3. BR specifics dominate: 1º≠2º matchups; estimulada≠espontânea; quota designs → declared MOE understates design-based SE; TSE ids are provenance not shares; UF ≠ Brasil.
4. **Modelo UX:** extend existing exclusive-chip / radiogroup pattern — switch one precomputed model at a time; do not rainbow multi-model overlays; prefer Python-exported sibling JSON over browser MCMC.
5. Safe Wave A toggles: TSE-only filter, MOE whiskers, ribbon on/off, fieldwork-end dating, sensitivity docs for half-life / n_cap. Risky / late / OFF: house-effect overlay, runoff Monte Carlo, state-space, fundamentals hybrid. **Out:** MRP without microdata, synthetic UF borrowing, leaked/proprietary scripts.
6. Open anchors to study (not ship as default): [538/ABC averages](https://abcnews.com/538/polling-averages-work/story?id=109364028), [Economist model high-level](https://www.economist.com/interactive/us-2024-election/prediction-model/president/how-this-works), [`agregR`](https://rnmag.github.io/agregR/), Depois das 17, Poder360 MA, Estadão 2022 mode-split, TSE Res. 23.747/2026, Folha 2026 method roundup.

### Toggle catalog (short)

| Chip / model id | Default | Effort | Risk | Notes |
|-----------------|---------|--------|------|-------|
| `option_b` (√N, 14d, anti-flood) | **ON** | done | Low | Production |
| `weight_n` / `n_cap_*` / `half_life_*` / `anti_flood_off` | OFF | S–M | Med | Sensitivity / expert compare |
| `tse_only` / `date_fieldwork_end` / `moe_whiskers` / `ribbon_off` | OFF→A | S | Low | Filters / display |
| `house_overlay` | OFF | M–L | High | Never silent; relative ≠ urn |
| `undecided_renorm` / `mode_split` / `espontanea_lane` | OFF | M | Med–High | Needs schema + primaries |
| `bootstrap_bands` | OFF | M | Med | Label ≠ CI |
| `runoff_mc` / `state_space` | OFF | L | Very high | Experimental disclaimer only |
| `fundamentals_hybrid` / `mrp` / `regional_shrink` | OUT / OFF | L+ | Extreme | Docs caution; not v1 product |

Full math cookbook, data-prerequisites matrix, projection “do not claim” table, bibliography URLs, and lock-violation list live in [`advanced-polling-rnd.md`](advanced-polling-rnd.md).

### What this does *not* authorize

Unpausing product work; changing Option B defaults; committing WIP regional chart code; fetching Pastebin/leaked pollster code; inventing shares; adding brush/scoreboard/TS/SPA/Playwright/Michelle.

---

## Pointers (updated)

- Cold pickup: [`docs/AI-HANDOFF.md`](AI-HANDOFF.md)
- Status logs: [`docs/lead-status-log.md`](lead-status-log.md), [`docs/pipeline-status-log.md`](pipeline-status-log.md)
- Advanced R&D (this cycle): [`docs/advanced-polling-rnd.md`](advanced-polling-rnd.md)
- Suggestions research #1–21: [`docs/suggestions-research-findings.md`](suggestions-research-findings.md)
