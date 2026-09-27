# Suggestions research findings (#1–21 + BR polling background)

**Written:** 2026-09-27 ~02:45 BRT (America/Sao_Paulo)  
**Lane:** Research only (product paused). No feature code.  
**Sources:** local PEBR + old-site trees, live Pages/GitHub, and public web (TSE, Poder360, Folha, 538/ABC, Depois das 17, Gazeta, O Povo, etc.).  
**Parent brief:** [`suggestions-and-research.md`](suggestions-and-research.md) · cold start [`AI-HANDOFF.md`](AI-HANDOFF.md)

---

## How to read this memo

For each suggestion: **status vs current PEBR**, **research findings** (with URLs), **recommended approach** (no code), **effort (S/M/L)**, **blockers**, **priority after unpause**.

Effort guide: **S** ≈ hours–1 day · **M** ≈ 2–5 days · **L** ≈ week+ / multi-lane.

---

## Expanded background: Brazilian election polling (sourced)

### Two-round presidential system

Brazil uses absolute-majority runoff: if no candidate wins a majority of **valid** votes in the 1º turno, the top two advance to a 2º turno weeks later. Polls therefore split into multi-candidate first-round fields and pairwise runoff scenarios. Averaging across matchups invents a race that was never asked — PEBR already keeps pairwise 2º in `chart-2nd-round.json` separate from 1º `chart.json`.

### Estimulada vs espontânea

| Mode | What is asked | Role |
|------|---------------|------|
| **Espontânea** | No name list; respondent free-recalls | Measures name recall / engagement; noisier; more “não sabe”; understates lesser-known names |
| **Estimulada** | Ballot / read list of names (sometimes with parties) | Media headline series; denser time series; closer to “if election today with this ballot” |

Best practice (and institute habit): ask spontaneous **before** stimulated so the list does not contaminate recall. Sources: [O Povo explainer](https://www.opovo.com.br/noticias/politica/eleicoes/2024/06/27/pesquisa-eleitoral-estimulada-ou-espontanea-entenda-as-diferencas.html), [O Globo Pulso](https://oglobo.globo.com/blogs/pulso/post/2022/07/o-que-e-pesquisa-estimulada-entenda-a-principal-duvida-dos-brasileiros-nas-buscas-do-google.ghtml), [IBPAD questionnaire notes](https://ibpad.com.br/politica/questionarios-em-pesquisas-eleitorais/).  
**PEBR implication:** national Option B is built on `stimulated_1st_round` (117/117 canonical 1º). Spontaneous must be a **separate scenario series**, never mixed into stimulated aggregates (aligns with Depois das 17: stimulated only in national model; spontaneous shown separately — [metodologia](https://depoisdas17.com.br/2022/metodologia/)).

### TSE / PesqEle registration (2026)

- From **1 Jan of election year**, entities must register each public-opinion poll in **PesqEle** **≥5 full days** before disclosure (Lei 9.504/1997 art. 33; Res. TSE 23.600/2019 as amended).  
- Registration includes contractor, payer, funding, methodology, fieldwork period, sample plan & weighting (sex, age, education, economic level, geography), confidence interval, MOE.  
- TSE does **not** pre-clear results and does **not** publish vote shares in the registry; results come from institute/press primaries.  
- Res. **23.747/2026** (26 Feb 2026) tightens statistician digital attestation, geographic delimitation, fiscal docs, complementation windows.  
- Public portals: [TSE news 2026-01-01](https://www.tse.jus.br/comunicacao/noticias/2026/Janeiro/eleicoes-2026-pesquisas-eleitorais-devem-ser-registradas-a-partir-desta-quinta-1o), [consulta](https://www.tse.jus.br/eleicoes/pesquisa-eleitorais/consulta-as-pesquisas-registradas), [PesqEle divulgação](https://pesqele-divulgacao.tse.jus.br/app/pesquisa/listar.xhtml), [Dados Abertos 2026](https://dadosabertos.tse.jus.br/dataset/pesquisas-eleitorais-2026).  
- **PEBR stance (correct):** `tse_registration_id` = provenance/witness, not truth of shares; 113/117 national points already carry a TSE id.

### Sample design, N, MOE, house effects

National houses typically target ~2,000+ interviews, ~±2 pp MOE at 95% CI (rule of thumb; design effect often larger than SRS formula). Modes differ sharply ([Folha 2026-09-22 methodology roundup](https://www1.folha.uol.com.br/poder/2026/09/entenda-diferenca-de-metodologia-nas-principais-pesquisas-eleitorais.shtml)):

| Institute | Typical mode | Notes |
|-----------|--------------|-------|
| Datafolha | Face-to-face, high-flow points | Quotas mainly sex/age; IBGE/TSE frame |
| Ipec (ex-Ibope) | Face-to-face domiciliar | Education/activity quotas; sometimes turnout filters historically |
| Quaest | Face-to-face domiciliar | Multi-stage + political-profile clustering claims in 2026 |
| AtlasIntel | Online RDR | Large N common; post-stratification; anonymity claim |
| Paraná Pesquisas | Mostly face-to-face (sometimes phone) | Older census frames criticized in past cycles |
| PoderData | Automated phone (URA) | Large N; CEP-stratified |
| Nexus/BTG | Phone | Anatel DDD frame |
| CNT/MDA | Mix domiciliar + flow | Proportional UF allocation |

**House effects** = systematic institute deviations vs contemporaneous consensus from method choices (mode, quotas, undecided treatment, question order) — not necessarily partisan bias ([Gazeta 2022](https://www.gazetadopovo.com.br/eleicoes/2022/o-que-sao-house-effects-e-como-impactam-nas-pesquisas-eleitorais/); [Depois das 17](https://depoisdas17.com.br/2022/metodologia/)). 538 adjusts house effects with Bayesian shrinkage ([ABC/538 methodology](https://abcnews.com/538/polling-averages-work/story?id=109364028)); PEBR Option B **explicitly does not** — raw points stay visible.

### Aggregator practices (BR + foreign UX)

| Source | Aggregate style | UX notes | PEBR takeaway |
|--------|-----------------|----------|---------------|
| [Poder360 Agregador](https://www.poder360.com.br/agregador-de-pesquisas/) | Moving average over ±60d (also 15/20/30 filters); TSE registered + known methodology in election years | Turno, abrangência (BR/UF), institute filter, **orange range bar**, hover on candidate markers, export tables; 2026 open during cycle ([launch article](https://www.poder360.com.br/poder360/poder360-abre-acesso-ao-agregador-de-pesquisas-mais-completo-da-midia/)) | Keep geo + turno filters; **do not** copy their bottom/top range scrubber (locked out). Prefer TV pan/zoom + period chips |
| Estadão Dados (2022) | Separate face-to-face vs phone averages | Interactive tracker, multi-institute | Mode-split overlay is research-interesting but **not** Option B default |
| g1 2026 | Page assembling Quaest + Datafolha detail | Strong primary presentation, not full multi-house average | Good witness pattern: deep primary tables |
| [Depois das 17](https://depoisdas17.com.br/2022/metodologia/) | Full state-space model + house δ + design-effect D≈1.72 | Explicit three uncertainty layers; stimulated-only national | Closest BR peer for honesty copy; PEBR stays simpler Option B |
| [538/ABC averages](https://abcnews.com/538/polling-averages-work/story?id=109364028) | √N weight, 14d anti-flood (then √), house effects, outlier kernels, EWMA+LOESS mix | Uncertainty band = error vs future polls, **not** election outcome | Option B already mirrors √N + 14d flood spirit **without** house effects — correct given lock |
| TradingView / Polymarket-style | Drag pan, wheel/pinch zoom, crosshair snap, external/bounded tooltip, interval presets, reset | Point-focused detail | Matches PEBR locked UX (already shipped) |

### Regional vs national

UF presidential polls answer a different estimand. Pooling into a national mean is a common aggregator error. Old site Capítulo 2 and PEBR Chart #2 exist for **geo isolation**; multi-UF mean must never be sold as Brazil ([ADR 0002](adr/0002-regional-geography-parallel-tree.md), [`regional.md`](regional.md)).

### 2026 PEBR product scope (locked)

Static Pages; Ruby → Python Option B → vanilla JS + D3; Michelle Bolsonaro out; no invented shares; Playwright out of discovery; Chart #2 = UF geo, not 1º vs 2º.

**Verified local data (research box, main + WIP):** national 1º **117**, 2º **203**, regional **24** (PE 10 / MG 6 / SP 6 / DF 2). HEAD `chart-regional.json` = empty stub; working tree may hold uncommitted regional Option B (~813 series) — **do not commit blindly**. Live Pages serves real `chart.json` (~1.1 MB, `example: false`) with `Cache-Control: max-age=600`.

---

## Per-suggestion research briefs

### 1. Perf audit of dense D3 SVG (117+203 points, regional growing)

| | |
|--|--|
| **Status** | Partially mitigated; not audited. Chart #1 loads ~6762 series rows (1072 poll + 2845 aggregate + 2845 uncertainty) ≈ **1.1 MB** JSON + **73 KB** `chart.js`. Table is paginated (25/page) + search. Zoom/pan redraws full SVG paths. |
| **Findings** | Dense multi-series SVG is a known mobile lag pattern. TradingView/Lightweight Charts use canvas for density; PEBR is locked to **full D3 SVG** — optimize within that. Poder360 also pushes heavy multi-candidate curves + tables. Old site used ECharts canvas (explicitly not ported). |
| **Approach** | (1) Instrument FPS / long-task on mid Android + Safari iOS with 30d/90d/tudo. (2) Throttle zoom redraw (`requestAnimationFrame` + coalesce). (3) Draw uncertainty ribbons only for visible candidates. (4) Keep table virtualized/paginated. (5) Consider downsampling aggregate polylines when zoomed out (not poll points). **Do not** switch to canvas/ECharts/SPA. |
| **Effort** | M |
| **Blockers** | None technical; needs device matrix. |
| **Priority** | Medium (after #4 lights Chart #2, density rises). |

### 2. Accessibility pass (keyboard, SR for chips/charts, focus rings)

| | |
|--|--|
| **Status** | Partial. Many `aria-pressed` / `aria-expanded` / `aria-live` / `aria-label` on filters, theme, overview. Chart SVG still mostly `aria-hidden` / visual. Focus-visible styles exist on filter toggles. Keyboard shortcuts (1/2/3/9/0/G/F/T/Esc) help power users but are not SR-documented as a single map. |
| **Findings** | Poll charts are hard for SR; best practice = `role="img"` + long description + **parallel data table** (PEBR already has national table — make it the accessible twin). Point-only hover must have keyboard equivalent to open detail panel. |
| **Approach** | Audit with axe + VoiceOver/TalkBack. Ensure chip groups are radiogroup/listbox patterns; chart gets accessible name + “use table below”; Tab to first poll point / detail; don’t rely on hover-only. |
| **Effort** | M |
| **Blockers** | None. |
| **Priority** | Medium-high for public trust; can parallelize with #4. |

### 3. “What changed since last visit” strip

| | |
|--|--|
| **Status** | Not built. “Verificar agora” refreshes JSON + shows stamp; no cross-visit diff. |
| **Findings** | Needs a durable export stamp (`generated_at` / `dataset_version` already on chart JSON). Store last-seen stamp in `localStorage`; diff counts of new polls / latest aggregate Δ. Avoid inventing narrative. |
| **Approach** | On load: compare `chart.json` `generated_at` + newest `fieldwork_end` vs stored; strip like “+3 pesquisas desde sua visita · agregado Lula Δ −0,4 pp”. Clear on share-URL deep links carefully. |
| **Effort** | S–M |
| **Blockers** | None; depends on stable export metadata (already mostly present). |
| **Priority** | Nice P1 after core Chart #2. |

### 4. Finish Chart #2: Option B `chart-regional.json` for 24 UF rows + single-UF aggregate rules

| | |
|--|--|
| **Status** | **UI shell shipped** (`regional-chart.js`, empty-state on HEAD). Canonical regional **24** on main. HEAD stub `series: []`. Local WIP may already implement `--geography state` + non-empty export — **uncommitted; must test before commit**. |
| **Findings** | Old Capítulo 2 merged national+UF for inspect; PEBR Chart #2 is **UF-only parallel tree** (stricter isolation — good). Multi-geo no-blend is binding. Aggregators (Poder360) expose UF as abrangência filter with separate series — same mental model. |
| **Approach** | After unpause: finish/test WIP Option B regional CLI → write `chart-regional.json` with **per-UF** aggregates only; UI already refuses multi-UF mean. Document scenario chips for regional 2º (already 10× Lula×Flávio + Atlas PE extras). Never merge into national files. |
| **Effort** | M (mostly finish + fixtures + Pages copy) |
| **Blockers** | Pause gate; careful review of WIP; Pipeline for more UF rows (#20). |
| **Priority** | **P0 — default unpause #1** |

### 5. Linked brushing without range slider

| | |
|--|--|
| **Status** | Not built. Period chips (30d/90d/tudo) already set Chart #1 X domain; companion listens to `__pebrView`. Chart #2 does not yet mirror national window. |
| **Findings** | Locked: **no** brush/slider (Poder360’s orange scrubber is exactly what user rejected). Linked **domain sync** via view-bus is the compliant pattern (TradingView multi-pane sync without a brush). |
| **Approach** | Extend `__pebrView` with `{xMin,xMax,rangeDays}`; Chart #2 + table respect it; optional “vincular período” toggle default on. **No** drag-rect brush UI. |
| **Effort** | S–M |
| **Blockers** | Chart #2 data (#4) to be meaningful. |
| **Priority** | P1 after #4. |

### 6. Uncertainty ribbons readability study

| | |
|--|--|
| **Status** | Ribbons shipped = ± weighted SD in window; copy correctly says **not** classical CI / not win prob. Dense when many candidates visible. |
| **Findings** | 538 bands = uncertainty of predicting *future polls*; Depois das 17 draws 90% posterior trajectories and separates “today / election day / urn error”. PEBR’s descriptive SD is honest if labeled — risk is visual clutter looking like “forecast confidence”. |
| **Approach** | UX study: toggle ribbons; show only for focused candidate; opacity ramp; compare vs institute scatter alone. Keep methodology PT copy. Optional later: MOE whiskers on points (#12) distinct from ribbon. |
| **Effort** | S (study) / M (UI toggles) |
| **Blockers** | None. |
| **Priority** | P2 research; small UX wins anytime. |

### 7. Stress-test Option B (√N, 14d, anti-flood) + sensitivity memo + flood fixtures

| | |
|--|--|
| **Status** | Unit tests exist (`models/tests/test_weights.py`, `test_aggregate.py`, dating). Docs in [`methodology-aggregate-option-b.md`](methodology-aggregate-option-b.md). No published sensitivity memo on real 117/203 flood scenarios. |
| **Findings** | 538 also uses √N and ~14d anti-flood then √ — PEBR is intentionally close without house effects. Poder360 uses long ±60d MA (smoother, more lag). Flood risk is real with weekly online houses (Atlas, PoderData cadence). |
| **Approach** | Fixture: one institute posts 5 polls in 10 days vs sparse peers; assert flood weights. Memo: k∈{7,14,21}, n_cap∈{2000,4000}, with/without flood — tables of latest A_c. **Do not** change v1 defaults without user OK. |
| **Effort** | M |
| **Blockers** | None. |
| **Priority** | **P0 with #4/#14** |

### 8. House-effects research as *optional overlay* (never silent default)

| | |
|--|--|
| **Status** | Explicitly **out** of Option B (`test_no_house_effects_*`). Methodology copy says so. |
| **Findings** | BR explainers + Depois das 17 / JOTA-style aggregators estimate δ_house; effect sizes vary by cycle and are **relative to peers, not urn**. Baking into default would violate product honesty lock and confuse readers who watch colored points. |
| **Approach** | Research notebook / docs-only table of institute mean residual vs Option B; optional future **toggle overlay** “corrigir viés de casa (experimental)” default **off**, never rewrite `chart.json`. Prefer documenting mode clusters (face / phone / online) over full Bayesian house model. |
| **Effort** | M (research) / L (if productized overlay) |
| **Blockers** | Must not become silent default. |
| **Priority** | Research now OK; product overlay **after** unpause and only with explicit user ask. |

### 9. Soft-twin / fingerprint dedupe false-positive audit (117/203)

| | |
|--|--|
| **Status** | Implemented: `Identity.fingerprint` + `soft_twin_key` (institute|fieldwork_end|geo|uf|scenario|N); normalize errors on near-dupes; tests in `test/normalize_assemble_test.rb`. |
| **Findings** | Soft twin catches re-entry with shifted `fieldwork_start` but same end/N — good. False-positive risk: legitimate back-to-back waves with same N and end date (rare) or corrections. Mirror URL normalize also present. |
| **Approach** | Run `bin/pebr normalize` report on full national+regional; classify errors vs warnings; sample 10 soft-twin hits manually against primaries. Tune only if FPs confirmed — don’t weaken anti-replicate casually. |
| **Effort** | S–M |
| **Blockers** | None. |
| **Priority** | P1 Pipeline hygiene. |

### 10. Fieldwork-end vs mid-campo dating conventions

| | |
|--|--|
| **Status** | Schema: `fieldwork_end` = trend/order date; Option B uses `fieldwork_mid` (computed midpoint). All 117+24 have both mid and end locally. Assemble retains both. |
| **Findings** | Institutes publish start–end ranges; media often plots **release** day (biased late). 538 uses median field date. PEBR mid is a reasonable compromise; end-only would systematically right-shift multi-day campos. |
| **Approach** | Docs note + optional debug toggle “eixo = fim do campo”. Audit institutes that publish single-day vs week-long campos. **Do not** date on publication. |
| **Effort** | S |
| **Blockers** | None. |
| **Priority** | Low (docs/clarity) unless dating bugs appear. |

### 11. Stimulated vs spontaneous as first-class scenario

| | |
|--|--|
| **Status** | UI label map includes `spontaneous_1st_round`; national canonical 1º is **100% stimulated**. No spontaneous series assembled. |
| **Findings** | Mixing is a classic error; Depois das 17 / media explainers insist on separation. Spontaneous useful in pre-campaign for name recall. |
| **Approach** | Only if extractable primaries exist: new scenario id, separate Option B export or scenario chip, **never** blend. Discovery may queue espontânea tables as distinct leads. Michelle still out. |
| **Effort** | M (data+UI) once primaries exist; else research hold |
| **Blockers** | Verified spontaneous primaries; Pipeline dual-enter. |
| **Priority** | Hold until data; schema-ready. |

### 12. Sample-size / MOE display from N

| | |
|--|--|
| **Status** | Detail + table show **N**; chart poll rows export `n` but **not** `moe` (moe exists on canonical 117/117, dropped in chart series). No formula-MOE from N alone in UI. |
| **Findings** | Published MOE ≠ SRS \(1.96\sqrt{p(1-p)/n}\) under quota designs; Depois das 17 uses ~1.72× declared. Inventing MOE from N alone is misleading. |
| **Approach** | Pass through institute `moe` on poll series + detail when present; label “MOE declarado”. Optional educational “MOE SRS≈” behind methodology, not as primary. |
| **Effort** | S |
| **Blockers** | Export field plumbing (Lead). |
| **Priority** | P1 easy win. |

### 13. TSE witness graph: news BR-ids vs ZIP/Wayback mirrors

| | |
|--|--|
| **Status** | Discovery watches TSE/PesqEle pointers; dados-abertos often **403**; Playwright forbidden. Old site had rich `pipeline-status.json` registry recovery counts. PEBR has `last-run.json` queue health, not a public witness graph. |
| **Findings** | [Dados Abertos pesquisas 2026](https://dadosabertos.tse.jus.br/dataset/pesquisas-eleitorais-2026) + PesqEle UI are the structured registries; results still need institute/press. News BR-ids can disagree with ZIP mirrors (typos, recycled protocols). |
| **Approach** | Pipeline research: sample 30 `tse_registration_id`s; compare news cite vs PesqEle page vs Wayback; log mismatch types. Publish read-only `pipeline-status.json` subset (#16) — **no** auto-extract. Manual witness path for 403. |
| **Effort** | M |
| **Blockers** | TSE egress/403; no Playwright. |
| **Priority** | P1 Pipeline research. |

### 14. Contract tests: canonical schema → chart JSON → UI load smoke in Actions

| | |
|--|--|
| **Status** | Ruby minitest (watch/normalize/assemble) in `refresh.yml`; Python Option B pytest locally under `models/tests/` — **not clearly gated** as Pages contract smoke. `pages.yml` only deploys `site/`. |
| **Findings** | Failure mode: schema drift → broken chart. Need CI job: validate JSON Schema → run export on fixtures → assert `series_kind` ∈ {poll,aggregate,uncertainty} → maybe headless fetch of `index.html` **without** Playwright-as-discovery (a minimal static check is OK; avoid browser automation for acquisition). |
| **Approach** | Add Actions job on `models/**`, `site/data/**`, `schemas/**`: pytest + `bin/pebr validate` + jq assertions on chart shape. Optional link check. |
| **Effort** | M |
| **Blockers** | None. |
| **Priority** | **P0 with #4/#7** |

### 15. Pages deploy cache-busting for `chart.js` / data JSON

| | |
|--|--|
| **Status** | “Verificar agora” already fetches with `?v=Date.now()` + `cache: "no-store"`. GitHub Pages/Fastly currently serves `Cache-Control: max-age=600` on both JS and JSON (observed 2026-09-27). HTML references `chart.js` without content hash. |
| **Findings** | 10‑minute edge cache is mild; first-load without Verificar can still show stale JS for up to TTL. Content-hash query on script/link tags at deploy is the static-site standard. |
| **Approach** | Build step or Actions: append short git SHA to `index.html` asset URLs (`chart.js?v=SHA`). Keep runtime bust for data refresh. Avoid service workers. |
| **Effort** | S |
| **Blockers** | None. |
| **Priority** | P1 (quick). |

### 16. `pipeline-status.json` for “Verificar agora” / health footer

| | |
|--|--|
| **Status** | Not on PEBR Pages. Discovery `last-run.json` exists privately under `data/national/discovery/` (578 queue items / 351 needs_human_review in last offline run sample). Old site published `public/data/pipeline-status.json` (registry counts, missing protocols, status). |
| **Findings** | Users need honesty about acquisition health without exposing review inbox URLs en masse. |
| **Approach** | Assemble a **redacted** `site/data/pipeline-status.json`: last watch time, queue depth, needs_review count, last assemble stamp, source_health summary — no raw lead URLs required. Footer + Verificar reads it. |
| **Effort** | S–M |
| **Blockers** | Lane clarity: Pipeline writes status artifact; Lead wires footer. |
| **Priority** | P1. |

### 17. Explicit “lane API”: Pipeline write vs Lead re-export + schema version

| | |
|--|--|
| **Status** | Documented in AI-HANDOFF / ADRs; `schema_version` already on chart exports. Not a machine-checked contract boundary. |
| **Findings** | Dual-lane file fights are the main process risk. |
| **Approach** | Short `docs/lane-api.md`: tables of who may write which paths; bump `schema_version` on breaking chart shape; CI ownership comments. Optional CODEOWNERS. |
| **Effort** | S |
| **Blockers** | None. |
| **Priority** | P1 docs on unpause. |

### 18. Regional vs national provenance fields unified

| | |
|--|--|
| **Status** | Parallel schemas (`poll.schema.json` vs `poll-regional.schema.json`); assemble separate; Chart #2 prefers `chart-regional.json` then canonical regional. Risk is UI/loader accidentally pointing at national files. |
| **Findings** | ADR 0002 is the right design. Provenance field names already largely aligned (`tse_registration_id`, fieldwork_*, institute_id, scenario, sample_size, moe). |
| **Approach** | Shared JSON Schema `$defs` for common provenance; loader asserts `geography`/`uf`; refuse national Option B if any `geography!=national`. Regression test. |
| **Effort** | M |
| **Blockers** | None. |
| **Priority** | P1 alongside #4. |

### 19. Extractable-primary map for image/Arte PDFs (hold vs OCR)

| | |
|--|--|
| **Status** | Policy: **no inventing**; OCR/image-PDF auto-extract out (discovery.md). Holds noted for Atlas PE image-heavy PDFs, missing institute PDFs, etc. |
| **Findings** | Arte/image charts are common for Atlas and some press embeds. OCR in CI recreates old-site failure mode. |
| **Approach** | Maintain a spreadsheet/markdown map: source → extractable? (HTML table / text PDF / image-only / paywall). Image-only → human transcript from labeled figures **or** skip. Never CI OCR shares. |
| **Effort** | S ongoing |
| **Blockers** | Human time. |
| **Priority** | Pipeline continuous. |

### 20. Expand regional SP/MG/DF/PE + other UFs (anti-replicate CI)

| | |
|--|--|
| **Status** | Prefer UFs partially filled (24 points). Other UFs = leads only. Anti-replicate already covers regional fingerprints. |
| **Findings** | State presidential polls are scarcer; Quaest/Atlas/Datafolha state cuts appear irregularly. Old site had ~30 regional rows. |
| **Approach** | Pipeline: prioritize extractable primaries for prefer UFs, then RJ/RS/BA/PR. Same dual-enter + CI. Lead re-exports Chart #2 after assemble. |
| **Effort** | L (ongoing intake) |
| **Blockers** | Extractable primaries; pause. |
| **Priority** | P1 Pipeline after #4 lights existing 24. |

### 21. Acquisition robots: more RSS→PDF resolution + Wayback; TSE mirror note

| | |
|--|--|
| **Status** | Watch targets include GNews RSS, institute homes, Wayback `archive_fallback`, TSE pointers. Playwright out. TSE dados-abertos often blocked. |
| **Findings** | Safe path matches ADR 0001: RSS/listings/Wayback/fixtures + human drop. Resolving RSS item → PDF primary is high value if done as **queue enrichment**, not auto-share extract. |
| **Approach** | Improve link scorers to prefer `.pdf` / institute domains; Wayback when 404; document TSE 403 as egress note for operators. No headless browser. |
| **Effort** | M–L |
| **Blockers** | Site WAFs; legal/ToS; pause. |
| **Priority** | Pipeline P1. |

---

## Cross-cutting themes

1. **Honesty over cleverness** — PEBR’s Option B (√N, 14d, anti-flood, no house effects, mid-campo dating, raw points visible) is already aligned with the transparent subset of 538’s craft and BR best explainers; don’t silently “upgrade” into Depois das 17 / 538 full stack.
2. **Geo and scenario axes are orthogonal** — Chart #2 ≠ 2º turno; estimulada ≠ espontânea; UF ≠ Brasil.
3. **Primary extractability gates everything** — aggregators and TSE ids are leads/provenance; shares need human dual-enter.
4. **UX locks are competitive differentiators** — point-only hover + TV pan/zoom vs Poder360 range bar / old scoreboard.
5. **Lane discipline** — Pipeline data vs Lead charts; CI must not invent or regenerate Option B.
6. **Density will grow** — regional export + more institutes → perf (#1) and a11y (#2) become real shortly after #4.
7. **Cache + health** — short Pages TTL helps; still hash-bust assets (#15) and surface pipeline health (#16).

---

## Suggested research-informed unpause order

| Wave | Items | Rationale |
|------|-------|-----------|
| **0 — gate** | User says **resume** | Hard pause |
| **1 — light Chart #2 + harden math/CI** | **#4, #7, #14** (+ #18 asserts) | Default pick from suggestions doc; unblocks regional product |
| **2 — hygiene UX** | **#15, #12, #16, #17, #5** | Fast trust/ops wins; linked domain sync once #4 live |
| **3 — Pipeline depth** | **#9, #13, #19, #20, #21** | More verified rows without inventing |
| **4 — polish / research overlays** | **#1, #2, #3, #6, #10, #11, #8** | Perf/a11y/diff strip; spontaneous only with data; house effects docs/optional only |

---

## Explicit “would violate locked constraints if coded wrongly”

Do **not**:

1. Add a **brush / bottom (or top) range slider** (Poder360-style scrubber) — period chips + pan/zoom only.  
2. Restore **all-candidate hover scoreboard** over the plot — point-only + external detail.  
3. Reintroduce **TypeScript / SPA / Vite / ECharts / WASM estimators / multi-model overlays**.  
4. **Visually restyle** PEBR to clone old site chrome (“features not skin”).  
5. Treat Chart #2 as **1º vs 2º** or wire `chart-2nd-round.json` as the regional panel.  
6. **Blend multiple UFs** into a fake Brasil aggregate line.  
7. Merge regional rows into `canonical-points.json` / `chart.json` / `chart-2nd-round.json`.  
8. Bake **house effects** into default Option B.  
9. Mix **espontânea** into estimulada series.  
10. Add **Michelle Bolsonaro** to candidates/scenarios.  
11. Use **Playwright** (or other browser automation) in discovery/CI acquisition.  
12. **Invent** poll shares via OCR/CI auto-extract / “fill missing cells”.  
13. Date aggregates on **publication** day instead of fieldwork mid/end rules.  
14. Re-add Pages **CSV/JSON export buttons** (share URL stays).  
15. Let Actions **regenerate** Lead-owned `chart*.json`.  
16. Invent MOE from N and present it as institute MOE.

---

## Key external citations (non-exhaustive)

- TSE registration news: https://www.tse.jus.br/comunicacao/noticias/2026/Janeiro/eleicoes-2026-pesquisas-eleitorais-devem-ser-registradas-a-partir-desta-quinta-1o  
- Res. 23.747/2026: https://www.tse.jus.br/legislacao/compilada/res/2026/resolucao-no-23-747-de-26-de-fevereiro-de-2026  
- PesqEle consulta: https://www.tse.jus.br/eleicoes/pesquisa-eleitorais/consulta-as-pesquisas-registradas  
- Dados Abertos 2026: https://dadosabertos.tse.jus.br/dataset/pesquisas-eleitorais-2026  
- Poder360 agregador: https://www.poder360.com.br/agregador-de-pesquisas/ · metodologia note in https://www.poder360.com.br/poder360/poder360-abre-acesso-ao-agregador-de-pesquisas-mais-completo-da-midia/  
- Folha institute methods 2026-09-22: https://www1.folha.uol.com.br/poder/2026/09/entenda-diferenca-de-metodologia-nas-principais-pesquisas-eleitorais.shtml  
- Estimulada/espontânea: https://www.opovo.com.br/noticias/politica/eleicoes/2024/06/27/pesquisa-eleitoral-estimulada-ou-espontanea-entenda-as-diferencas.html  
- House effects: https://www.gazetadopovo.com.br/eleicoes/2022/o-que-sao-house-effects-e-como-impactam-nas-pesquisas-eleitorais/  
- Depois das 17 metodologia: https://depoisdas17.com.br/2022/metodologia/  
- 538/ABC averages: https://abcnews.com/538/polling-averages-work/story?id=109364028  
- PEBR live: https://gitdisd.github.io/pesquisas-presidenciais-brasileiro/  
- PEBR repo: https://github.com/Gitdisd/pesquisas-presidenciais-brasileiro  
- Old site: https://gitdisd.github.io/pesquisas-eleitorais-br/

---

## Repo note for Lead

- This file is **documentation only**.  
- Working tree may still contain **uncommitted** Option B regional WIP (`models/pebr_models/*`, `site/data/chart-regional.json`) — out of scope for this research commit; verify on resume before any product commit.
