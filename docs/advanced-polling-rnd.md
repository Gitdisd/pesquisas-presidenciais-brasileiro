# Expert R&D — advanced polling methods & toggleable models (PEBR)

**Written:** 2026-09-27 ~03:20 BRT (America/Sao_Paulo)  
**Lane:** Research / docs only (product paused). **No product code. No invented poll shares.**  
**Audience:** Lead + future expert-mode Modelo design.  
**Parent pointers:** [`suggestions-and-research.md`](suggestions-and-research.md) · [`suggestions-research-findings.md`](suggestions-research-findings.md) · [`methodology-aggregate-option-b.md`](methodology-aggregate-option-b.md) · [`AI-HANDOFF.md`](AI-HANDOFF.md)

---

## 0) Purpose & hard constraints

This memo deepens PEBR research **far beyond** the #1–21 suggestions briefs. It catalogs **advanced polling math**, **election-projection features**, and **toggleable Modelo options** (Option B and beyond) that PEBR *could* expose later — with explicit feasibility under locked architecture:

| Lock | Binding rule |
|------|----------------|
| Stack | Ruby pipeline → Python Option B → **static HTML/CSS + vanilla JS + D3 SVG** |
| No | TypeScript / SPA / Vite / ECharts / WASM estimators / Go |
| UX | **No** brush / bottom range scrubber; **no** all-candidate hover scoreboard |
| Chart #2 | **UF geo isolation** (not 1º vs 2º); multi-UF no-blend |
| Candidates | **Michelle Bolsonaro permanently out** |
| Discovery | **Playwright out**; never invent shares (OCR/CI auto-extract forbidden) |
| Honesty | House effects **never** silent default; ribbons ≠ classical CI ≠ win prob |
| Sources | Public academic papers, open-source (clear license), official TSE, reputable news/method explainers, 538/ABC public pages, published books/papers, GitHub open projects — **no Pastebin / leaked scripts / cracked paywalled models** |

**Success criterion for this file:** deep, citable R&D that Lead can summarize; zero product commits.

---

## 1) Executive expert takeaways

1. **Option B is already in the transparent “honest average” family** — √N, ~14d window, anti-flood, mid-campo dating, raw points visible, **no house effects**. That is the correct **default** under PEBR locks. Do not silently upgrade into Depois das 17 / `agregR` / 538-full / Economist-full.

2. **Three questions ≠ one ribbon.** Depois das 17’s taxonomy is binding product copy: (A) where intention is *today*, (B) where it may be on *election day*, (C) what the *urn* will say. PEBR v1 answers only a descriptive version of (A). Never label (A) bands as (C).

3. **Brazilian context is not US portfolio math.** Two-round absolute majority; estimulada ≠ espontânea; quota/complex designs inflate true SE beyond declared MOE; TSE PesqEle registers *method* not *shares*; UF presidential polls must never enter a Brazil mean.

4. **Toggleable Modelo = exclusive chips, not multi-model overlays.** Extend the existing collapsible **Modelo** section with **mutually exclusive** method chips (radio semantics). Precompute alternate series in Python exports when possible; avoid browser Stan/WASM. Static site can load `chart.json` *or* a sibling like `chart-option-c.json` via chip — still vanilla JS.

5. **Projection features are optional expert toys, not truth claims.** Monte Carlo runoff trees, house-effect overlays, fundamentals hybrids: default **OFF**, labeled **experimental / not a forecast**, never “PEBR predicts winner.”

6. **MRP / ecological inference / synthetic UF borrowing are out of reach for v1** — need microdata + poststrat frames (IBGE+TSE) + heavy compute + high mislead risk. Document only.

7. **Closest open BR peers to study (not to ship as default):** [Depois das 17 metodologia](https://depoisdas17.com.br/2022/metodologia/), open package [`agregR`](https://rnmag.github.io/agregR/) (Jackman-style state-space in Stan), Estadão Dados 2022 mode-split average, Poder360 ±60d moving average, 538/ABC public averages methodology.

8. **Data prerequisites beat clever math.** Without verified N, fieldwork mid/end, scenario ids, institute ids, and extractable primaries, advanced toggles invent precision. Pipeline dual-enter remains the bottleneck.

9. **Recommended default forever unless user asks:** `option_b_sqrt_n_trailing` (current). Expert chips: half-life / weight / TSE-only / ribbons / dating — low risk. House effects / MC runoff / state-space — high risk, late, OFF.

10. **Out of scope / unethical:** leaked proprietary scripts; inventing cells; blending scenarios/geos; claiming CI/win-prob from descriptive SD; Playwright acquisition; Michelle in scenarios; brush/scoreboard.

---

## 2) Brazilian context (sourced deepen)

### 2.1 Two-round presidential math

Brazil elects the President by **absolute majority of valid votes**. If no candidate clears 50%+ of *válidos* in the **1º turno**, the **top two** advance to a **2º turno** weeks later. Implications for aggregators:

- **1º** is a multi-candidate compositional field (shares sum toward 100% after handling blank/null/undecided conventions).
- **2º** is a **pairwise scenario tree**: Lula×Flávio, Lula×Zema, … Each matchup is a **different estimand**. Averaging across matchups invents a race.
- Advancement probabilities require a **joint model** of the 1º field (who finishes 1st/2nd), not separate univariate averages.
- PEBR already separates `chart.json` (1º) from `chart-2nd-round.json` (pairwise) — preserve that forever.

### 2.2 Estimulada vs espontânea

| Mode | Protocol | Estimand | Series rule |
|------|----------|----------|-------------|
| **Espontânea** | No name list; free recall | Name recall / top-of-mind | Separate scenario; noisier; higher NS/NR |
| **Estimulada** | Ballot / read list | “If election today with this ballot” | National Option B default |

Ask spontaneous **before** stimulated so the list does not contaminate recall ([O Povo](https://www.opovo.com.br/noticias/politica/eleicoes/2024/06/27/pesquisa-eleitoral-estimulada-ou-espontanea-entenda-as-diferencas.html); [O Globo Pulso](https://oglobo.globo.com/blogs/pulso/post/2022/07/o-que-e-pesquisa-estimulada-entenda-a-principal-duvida-dos-brasileiros-nas-buscas-do-google.ghtml); [IBPAD](https://ibpad.com.br/politica/questionarios-em-pesquisas-eleitorais/)). Depois das 17: stimulated-only in national model; spontaneous shown separately. **PEBR:** national 1º is stimulated; spontaneous only as first-class separate scenario when primaries exist.

### 2.3 TSE / PesqEle registration (2026)

- From **1 Jan of election year**, public-opinion polls for elections/candidates must register in **PesqEle** **≥5 full days** before disclosure (Lei 9.504/1997 art. 33; Res. TSE 23.600/2019 as amended by **Res. 23.747/2026**).
- Registration includes contractor, payer, funding, methodology, fieldwork, sample plan & weighting axes, CI, MOE, statistician digital attestation.
- TSE does **not** pre-clear results and does **not** publish vote shares in the registry — shares come from institute/press primaries.
- Portals: [TSE news 2026-01-01](https://www.tse.jus.br/comunicacao/noticias/2026/Janeiro/eleicoes-2026-pesquisas-eleitorais-devem-ser-registradas-a-partir-desta-quinta-1o), [consulta](https://www.tse.jus.br/eleicoes/pesquisa-eleitorais/consulta-as-pesquisas-registradas), [PesqEle](https://pesqele-divulgacao.tse.jus.br/app/pesquisa/listar.xhtml), [Dados Abertos 2026](https://dadosabertos.tse.jus.br/dataset/pesquisas-eleitorais-2026), [Res. 23.747/2026](https://www.tse.jus.br/legislacao/compilada/res/2026/resolucao-no-23-747-de-26-de-fevereiro-de-2026).
- **PEBR:** `tse_registration_id` = provenance/witness. Toggle “only TSE-registered” is a **filter**, not a quality oracle (pre-year / academic / some press tables may lack ids).

### 2.4 Sample design: quota vs probability; MOE vs design effect

National houses typically ~2,000+ interviews, ~±2 pp declared MOE at 95% ([Folha 2026-09-22 institute roundup](https://www1.folha.uol.com.br/poder/2026/09/entenda-diferenca-de-metodologia-nas-principais-pesquisas-eleitorais.shtml)):

| Institute | Mode (public claims) | Frame notes |
|-----------|----------------------|-------------|
| Datafolha | Face-to-face, high-flow points | Município→bairro→ponto; quotas sex/age; IBGE/TSE |
| Ipec (ex-Ibope) | Face-to-face domiciliar | Education/activity quotas historically |
| Quaest | Face-to-face domiciliar | Multi-stage; 2026 political-profile clustering claims |
| AtlasIntel | Online RDR | Large N; post-strat; anonymity claim |
| Paraná Pesquisas | Mostly F2F (sometimes phone) | Census frames criticized in past cycles |
| PoderData | Automated phone (URA) | CEP-stratified; large N common |
| Nexus/BTG | Phone | Anatel DDD frame |
| CNT/MDA | Domiciliar + flow | Proportional UF allocation |
| Futura / RealTime | Phone / mixed | Quotas + weighting |

**Quota / complex designs** mean the classical SRS formula \(1.96\sqrt{p(1-p)/n}\) is an **approximation**, not a design-based SE ([CONFE notes on quota samples](https://www.confe.org.br/pesquisacotas1.pdf); design-effect literature). Depois das 17 estimates a **design factor D≈1.72×** declared MOE typical. **Never invent MOE from N and sell it as institute MOE.**

### 2.5 UF / region vs national

UF presidential polls answer a **different estimand** (intention *within* that state). Pooling into a national mean is a classic aggregator error. PEBR Chart #2 + ADR 0002 = geo isolation; multi-UF mean must never be marketed as Brazil.

### 2.6 House effects in BR literature

**House effect** = systematic institute deviation vs contemporaneous consensus (mode, quotas, undecided treatment, question order) — **not** automatically partisan bias ([Gazeta 2022](https://www.gazetadopovo.com.br/eleicoes/2022/o-que-sao-house-effects-e-como-impactam-nas-pesquisas-eleitorais/); Depois das 17; Estadão Dados). Relative to **peers**, not to the urn, unless post-election anchored (retrospective models in `agregR`).

### 2.7 How public BR aggregators work (high level)

| Source | Public method sketch | PEBR takeaway |
|--------|----------------------|---------------|
| [Poder360 Agregador](https://www.poder360.com.br/agregador-de-pesquisas/) | Stimulated; moving average over ±60d (filters 15/20/30/60); attenuates method disparities; turno + abrangência + institute filters | Long centered MA = laggy/smooth; **do not** copy orange range scrubber |
| Estadão Dados (2022) | Separate F2F vs phone averages; gold-standard Datafolha/Ipec; outlier downweight; bias correction toward F2F | Mode-split overlay interesting; not Option B default |
| [Depois das 17](https://depoisdas17.com.br/2022/metodologia/) | Bayesian state-space; house δ; D design factor; t-likelihood; compositional sum-100; 90% trajectory bands; **today only**, no win prob | Honesty gold standard; too heavy for PEBR default |
| [`agregR`](https://rnmag.github.io/agregR/) | Open Stan Jackman-style SSM; δ + τ non-sampling; past RMSE weights; 1º/2º heterogeneous | Best **open** BR implementation to *study*; CmdStan ≠ PEBR stack |
| g1 / Folha | Deep primary presentation more than multi-house average | Witness pattern |
| Pindograma (historical) | Day-level weights + short trailing MA; open writeup | Transparent small aggregator pattern |

---

## 3) Math cookbook (KaTeX-friendly)

Notation: poll \(i\) on day \(d\) (fieldwork mid), candidate \(c\), institute \(h\), share \(p_{i,c}\in[0,1]\), sample size \(n_i\).

### 3.1 Option B (current default) — review

\[
w_i^{\mathrm{size}}=\sqrt{\frac{\min(n_i,n_{\cap})}{n_{\mathrm{ref}}}},\quad
w_i^{\mathrm{flood}}=\sqrt{\frac{1}{m_{h,d}}},\quad
w_i=w_i^{\mathrm{size}}\,w_i^{\mathrm{flood}}
\]

\[
A_c(d)=\frac{\sum_{i\in S_d} w_i\,p_{i,c}}{\sum_{i\in S_d} w_i}
\]

Uncertainty (descriptive): \(A_c\pm\) weighted SD in window — **not** CI.

### 3.2 Sample-size weighting: √N vs N vs capped

- **√N:** matches MOE scaling (SE ∝ \(1/\sqrt{n}\)); diminishing returns — 538 default spirit; PEBR v1.
- **Linear N:** overpowers mega-online panels (Atlas/PoderData-style N).
- **Cap / winsorize:** 538 caps (e.g. 10k averages; 1.5k in some forecast flavors). PEBR `n_cap=4000`.

Toggle math: replace √ with identity, or expose \(n_{\cap}\in\{2000,4000,10000\}\).

### 3.3 Recency kernels

**Hard trailing window (Option B):** \(S_d=\{i: d-k < t_i \le d\}\).

**Exponential / EWMA half-life \(H\):**  
\(w_i^{\mathrm{time}}=\exp\!\big(-\ln 2\cdot \Delta_i / H\big)\) with \(\Delta_i=d-t_i\). Common \(H\in\{7,14,30\}\) days.

**Trapezoid / triangular:** weight 1 inside inner window, linear decay to 0 at outer edge (anti-cliff vs hard window).

**538-style anti-flood:** if institute posts \(m\) polls in \(W\) days, share one poll’s budget: \(w^{\mathrm{flood}}=\sqrt{1/m}\) (PEBR) or \(1/m\) then √ (538 narrative).

**Centered MA (Poder360):** uses polls in \([d-w,d+w]\) — **needs future polls** for historical points; fine for archive, awkward for “today” tip. Prefer trailing for live tip.

### 3.4 House-effect estimation

**Iterative residual:** compute naive average \(A\); \(\hat\delta_h=\mathrm{mean}_i(p_{i,c}-A_{t(i),c})\) for polls of house \(h\); subtract \(\hat\delta_h\); iterate. Shrink \(\hat\delta_h\) toward 0 with \(\hat\delta_h\cdot\frac{\tau^2}{\tau^2+\mathrm{se}_h^2}\).

**Hierarchical / multilevel (538):** multilevel regression of poll vs baseline average; Bayesian shrink to \(N(0,\sigma_\delta^2)\).

**State-space (Jackman / Depois / agregR):**  
State: \(\theta_t=\theta_{t-1}+\eta_t\), \(\eta_t\sim N(0,\sigma_t^2)\).  
Measure: \(y_i=\theta_{t(i)}+\delta_{h(i)}+\varepsilon_i\).  
Identify \(\delta\) via \(\sum_h\delta_h=0\) (relative) or election-day anchor (retrospective).

**Warning:** relative house effects ≠ accuracy vs urn. Past-cycle RMSE→τ (agregR weighted models) is a *pollster weight*, still not a guarantee for 2026.

### 3.5 Likely-voter / turnout models

US literature adjusts adults→RV→LV. BR institutes mostly interview **16+ with título** / population 16+; “likely voter” screens are less standardized publicly. **Do not invent LV screens** from national toplines. If dual populations ever appear in primaries, store as metadata — do not silently convert.

### 3.6 Undecided / blank / null allocation

Common heuristics (all controversial):

| Rule | Formula sketch | Risk |
|------|----------------|------|
| Leave as-is (total base) | keep NS/NR separate | Incomparable across houses |
| Valid-vote renorm | \(p'_c=p_c/\sum_{\mathrm{cands}}p\) | Assumes undecided≈nonvoters |
| Proportional allocate | split undecided like decided | Amplifies leaders |
| Equal split | \(u/K\) to each of \(K\) cands | Flattens |
| Leaners-only | use leaner probe if published | Needs primary detail |

Depois das 17 computes house effects on **válidos** because undecided rates vary wildly across houses. **PEBR default:** do not silently redistribute; optional toggle must label base (total vs válidos).

### 3.7 Herding detection (diagnostic, not a model)

Silver-style idea: compare poll-to-poll distances vs sampling-error expectations; suspiciously tight clustering across houses may indicate herding. Output = **diagnostic flag / memo**, not a downweight that silently rewrites history — unless user opts into an experimental kernel (538 has outlier kernels; high mislead risk if opaque).

### 3.8 Bayesian updating (conceptual)

Prior on election-day or today intention; likelihood from polls with inflated variance \(p(1-p)/n_{\mathrm{eff}}+\tau^2\); posterior mean pulls prior toward data. With flat prior over short windows ≈ weighted average. Full value appears when combining **fundamentals + polls** or **sparse UF + national**.

### 3.9 State-space / Kalman / local-level

Local level:  
\(y_t=\mu_t+\varepsilon_t\), \(\mu_{t+1}=\mu_t+\eta_t\).  
Kalman filter = recursive Gaussian smoother for this DLM. Linzer (2013) / Economist / Heidemanns–Gelman–Morris extend to hierarchical state+national polls. **Effort L**; needs Stan/Python MCMC or careful KF; not vanilla-JS.

### 3.10 Gaussian process / LOESS / kernel regression

- **LOESS / local polynomial:** smooth scatter of \((t_i,p_i)\); bandwidth critical; 538 blends EWMA + local polynomial.
- **GP:** prior over smooth functions; posterior bands are principled but computationally heavier; easy to over-smooth BR multi-candidate fields.
- PEBR could later offer **display-only** LOESS on already-exported points (D3) — still must not look like a forecast.

### 3.11 Uncertainty: what bands mean

| Band type | Meaning | OK label? |
|-----------|---------|-----------|
| Weighted SD in window (Option B) | Descriptive dispersion of polls | “dispersão das pesquisas” — **not** CI |
| Institute declared MOE whiskers | Pollster’s claimed SE | “MOE declarado” |
| Design-effect inflated SE | \(D\times\) SRS SE | Educational only if D estimated |
| Bootstrap of weighted average | Sampling variability of *aggregator* under resample | “banda bootstrap do agregado” |
| Bayesian 90% trajectory (Depois) | Posterior of latent *today* | “credibilidade do modelo” — needs model |
| Election-day predictive / win prob | Forecast | **Out of default PEBR claims** |

**Why not call ribbons “IC” casually:** users read “IC 95%” as “true share is inside with 95% probability,” which is false for descriptive SD and usually false for declared MOE under quota designs.

### 3.12 Monte Carlo runoff sketch (projection feature)

1. Draw latent 1º shares \(\tilde p^{(s)}\) from a distribution (e.g. Dirichlet around aggregate, or Gaussian on logit with covariance).  
2. Rank candidates; record top-two pair \(\pi^{(s)}\).  
3. For each pairwise 2º series, draw runoff share or map from published head-to-heads.  
4. Estimate \(P(\text{advance})\), \(P(\text{win 2º})\).  

**Must disclose:** dependence on covariance assumptions; sparse matchups; not calibrated to 2026 urn. Default **OFF**.

### 3.13 MRP (why usually out of reach)

**Multilevel regression + poststratification:** model \(P(\mathrm{vote}\mid \mathrm{demo},\mathrm{geo})\) then weight by census/eleitorado cell sizes (Park–Gelman–Bafumi; Ghitza–Gelman). Needs: respondent-level or rich crosstabs, IBGE Censo / PNAD cells, TSE eleitorado margins, turnout model. PEBR has **toplines**, not microdata → **cannot honestly MRP** without new data lane. Synthetic “UF borrowing” from national without cells = inventing geography.

---

## 4) Toggle catalog (Modelo options)

Semantics: **exclusive chips** in collapsible Modelo (radio group). One active model id. Filters (institutes/candidates) stay orthogonal. Precompute in Python when math is non-trivial; JS only switches JSON / series_kind visibility when trivial.

| ID | What it does | Math sketch | Data needed | Mislead risk | Default | Effort | Lock OK? |
|----|--------------|-------------|-------------|--------------|---------|--------|----------|
| `option_b` | Current √N + 14d + anti-flood | §3.1 | N, mid, institute, scenario | Low if labeled | **ON** | done | Yes |
| `weight_n` | Linear N instead of √N | \(w\propto\min(n,n_\cap)\) | N | Medium (mega-N flood) | OFF | S | Yes |
| `half_life_7` / `_14` / `_30` | Exp recency replace/hard window | §3.3 | mid dates | Medium (7d twitchy) | OFF (14d window≈) | S–M | Yes |
| `anti_flood_off` | Disable flood brake | \(w^{\mathrm{flood}}=1\) | institute ids | High if chatty house | OFF | S | Yes |
| `n_cap_2k` / `_4k` / `_10k` | Cap before √ | winsor n | N | Low–med | 4k ON | S | Yes |
| `exclude_outsiders` | Drop institutes below transparency bar | allow-list | institute metadata | Med (selection bias) | OFF | M | Yes if list public |
| `tse_only` | Only rows with `tse_registration_id` | filter | TSE ids | Med (coverage holes) | OFF | S | Yes |
| `date_fieldwork_end` | X/aggregate on end not mid | use end | start/end | Low | OFF | S | Yes |
| `house_overlay` | Subtract relative δ | §3.4 | many houses × time | **High** | OFF | M–L | Yes only as overlay |
| `undecided_renorm` | Valid-vote renorm | §3.6 | undecided fields | High | OFF | M | Needs schema fields |
| `espontanea_lane` | Separate scenario series | same Option B | spontaneous primaries | Low if separated | OFF until data | M | Yes |
| `moe_whiskers` | Show declared MOE on points | pass-through | `moe` | Low if labeled | OFF→recommend ON | S | Yes |
| `ribbon_off` | Hide SD ribbons | UI only | — | Low | optional | S | Yes |
| `bootstrap_bands` | Resample polls in window | nonparametric | window set | Med if called CI | OFF | M | Yes if labeled |
| `mode_split` | F2F vs phone/online averages | two series | mode metadata | Med | OFF | M | Needs mode field |
| `regional_shrink` | Partial pool UF toward national | hierarchical | UF+national | **Very high** | OFF | L | Conflicts geo isolation spirit |
| `runoff_mc` | Scenario tree probs | §3.12 | 1º+2º series | **Very high** | OFF | L | Label experimental only |
| `state_space` | Jackman/Depois-style | §3.9 | dense series | High | OFF | L | Python offline only |
| `fundamentals_hybrid` | Polls + economy/incumbency | Abramowitz-style prior | macros | **Extreme for BR 2026** | OFF | L | Docs only / never default |
| `mrp` | Cell model + poststrat | §3.13 | microdata+IBGE+TSE | Extreme | OUT | L+ | Out of v1 |
| `approval_series` | Parallel approval if available | separate chart | approval polls | Low if separate | OUT until data | M | Separate estimand |

### Recommended staged rollout (after unpause, user-approved)

1. **Wave A (safe):** `moe_whiskers`, `ribbon` toggle, `tse_only`, `date_fieldwork_end`, `n_cap` / `half_life` sensitivity **docs+fixtures first**.  
2. **Wave B:** `weight_n`, `anti_flood_off` as expert compare; still exclusive chips.  
3. **Wave C:** `house_overlay` experimental; never rewrite default `chart.json`.  
4. **Wave D (maybe never):** `runoff_mc`, `state_space` offline exports; heavy disclaimers.  
5. **Never as product default:** fundamentals hybrid, MRP, regional_shrink inventing Brazil-from-UF.

---

## 5) Projection feature catalog — what PEBR should NOT claim

| Feature | OK as experimental toggle? | Must NOT claim |
|---------|----------------------------|----------------|
| Poll-only average (Option B) | Yes (default) | “Will win” |
| Fundamentals (GDP, approval, incumbency) | Docs-only caution for BR 2026 | Calibrated 2026 forecast |
| Scenario trees 1º→2º | Optional MC with huge caveats | Exact P(win) without uncertainty literacy |
| Ensemble of institutes | Already visible as raw points | “Wisdom of crowds guarantees urn” |
| Dynamic house effects | Overlay OFF | “Corrected true intention” |
| Correlated errors across days | Model detail | Tighter false CI |
| Monte Carlo from poll distributions | Expert | Election prediction without model risk copy |
| Ecological inference / MRP | Out | State maps from national toplines |
| Synthetic districts / UF borrow | Out | Invented UF shares |

**Abramowitz Time-for-Change / US fundamentals:** useful *contextual* literature (approval + economy + term penalty). Brazilian presidential forecasting with US-style fundamentals is **not transferable** without a peer-reviewed BR calibration; 2026 has coalition/party system, compulsory voting, runoff dynamics, and different economic instruments. **Do not ship a fundamentals model as PEBR truth.**

---

## 6) Data prerequisites matrix

| Feature family | N | fieldwork mid/end | institute | scenario | TSE id | mode (F2F/phone/online) | undecided | moe | microdata / crosstabs | IBGE cells | TSE eleitorado | past-cycle RMSE |
|----------------|:-:|:-----------------:|:---------:|:--------:|:------:|:-----------------------:|:---------:|:---:|:---------------------:|:----------:|:--------------:|:---------------:|
| Option B | ● | ● | ● | ● | ○ | ○ | ○ | ○ | — | — | — | — |
| TSE-only filter | ○ | ○ | ○ | ○ | ● | — | — | — | — | — | — | — |
| House overlay | ● | ● | ● | ● | ○ | ○ | ◐ | ○ | — | — | — | ◐ |
| Mode-split | ● | ● | ● | ● | ○ | ● | ○ | ○ | — | — | — | — |
| Undecided renorm | ● | ● | ● | ● | ○ | ○ | ● | ○ | — | — | — | — |
| Bootstrap bands | ● | ● | ● | ● | ○ | ○ | ○ | ○ | — | — | — | — |
| State-space / agregR-like | ● | ● | ● | ● | ○ | ○ | ◐ | ◐ | — | — | — | ◐ |
| Runoff MC | ● | ● | ● | ●● (1º+2º) | ○ | ○ | ◐ | ○ | — | — | — | — |
| MRP | — | — | — | — | — | — | — | — | ● | ● | ● | ○ |

● required · ◐ strongly recommended · ○ optional · — not applicable

**Open data anchors for a future poststrat lane (not v1):** [IBGE Censo 2022](https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html), [TSE eleitorado dados abertos](https://dadosabertos.tse.jus.br/dataset/eleitorado-2022).

---

## 7) Recommended Modelo UX (extend exclusive chips safely)

### Current UI fact

Collapsible **Modelo** section already exists; method chips are largely **static labels** describing Option B (`chip-static`), not mutually exclusive model switchers. Institute/candidate chips are filters. Period chips set X domain (not a brush).

### Safe extension pattern

1. **One radio group:** `role="radiogroup"` / `aria-checked` on Modelo chips — exactly one `model_id` active.  
2. **Do not** stack multiple aggregate lines for different models simultaneously (that becomes a multi-model overlay the lock rejected). Compare models by **switching**, or by a dedicated “sensibilidade” table below — not rainbow aggregates.  
3. **Data loading:** Prefer Lead-exported sibling files (`chart.json` default; `chart-alt/<model_id>.json`) generated offline in Python. JS fetches selected file (cache-bust as today). Avoid porting Stan to the browser.  
4. **Copy:** Every non-default chip shows a one-line PT disclaimer in the method side note (“experimental · não é prognóstico · não corrige urna”).  
5. **URL share:** optional `?modelo=` param; default omit = Option B.  
6. **Chart #2:** same model id only within **single UF**; never enable regional_shrink that blends geos.  
7. **Collapse target:** heading toggles collapse; chips remain separate tap targets ([conversation-decisions](conversation-decisions.md)).

### Default recommendation

Leave **Option B** as the only production aggregate. Ship Wave A toggles that are filters/display (TSE-only, MOE whiskers, ribbon on/off, dating) before any alternate weight math in the UI. Publish sensitivity memos (#7) before exposing `weight_n` / half-life chips.

---

## 8) Open-source / public methodology anchors

### International

- 538/ABC averages methodology: https://abcnews.com/538/polling-averages-work/story?id=109364028  
- 538 polls policy: https://abcnews.com/538/538s-polls-policy-faqs/story?id=104489193  
- 538 pollster ratings: https://abcnews.com/538/538s-pollster-ratings-work/story?id=105398138  
- 538 2024 forecast (high level): https://abcnews.com/538/538s-2024-presidential-election-forecast-works/story?id=113068753  
- Economist model explainer: https://www.economist.com/interactive/us-2024-election/prediction-model/president/how-this-works  
- Heidemanns, Gelman, Morris (2020) HDSR: https://hdsr.mitpress.mit.edu/pub/nw1dzd02/release/2  
- Linzer (2013) dynamic Bayesian state forecasts (PDF): https://votamatic.org/wp-content/uploads/2013/07/Linzer-JASA13.pdf  
- Park, Gelman, Bafumi MRP: https://sites.stat.columbia.edu/gelman/research/published/parkgelmanbafumi.pdf  
- Ghitza & Gelman Mister P: https://sites.stat.columbia.edu/gelman/research/published/misterp.pdf  
- Abramowitz Time-for-Change (contextual): https://www.emory.edu/news/Releases/time-for-change.html  
- MIT Election Lab (election science / SPAE): https://electionlab.mit.edu/  
- Jackman Bayesian social science / poll pooling tradition (book + applied notes): see agregR references to Jackman (2009)

### Brazilian / Lusophone

- Depois das 17 metodologia 2022: https://depoisdas17.com.br/2022/metodologia/  
- agregR (open Stan BR aggregator): https://rnmag.github.io/agregR/ · https://github.com/rnmag/agregR  
- Poder360 agregador + method note: https://www.poder360.com.br/agregador-de-pesquisas/ · https://www.poder360.com.br/poder360/poder360-abre-acesso-ao-agregador-de-pesquisas-mais-completo-da-midia/  
- Folha institute methods 2026-09-22: https://www1.folha.uol.com.br/poder/2026/09/entenda-diferenca-de-metodologia-nas-principais-pesquisas-eleitorais.shtml  
- Gazeta house effects: https://www.gazetadopovo.com.br/eleicoes/2022/o-que-sao-house-effects-e-como-impactam-nas-pesquisas-eleitorais/  
- Estadão agregador 2022 (mode-aware): https://www.estadao.com.br/politica/eleicoes/agregador-pesquisa-eleitoral-2022/  
- O Povo estimulada/espontânea: https://www.opovo.com.br/noticias/politica/eleicoes/2024/06/27/pesquisa-eleitoral-estimulada-ou-espontanea-entenda-as-diferencas.html  
- TSE Res. 23.747/2026: https://www.tse.jus.br/legislacao/compilada/res/2026/resolucao-no-23-747-de-26-de-fevereiro-de-2026  
- TSE pesquisas hub: https://www.tse.jus.br/eleicoes/pesquisas-eleitorais  
- TSE Dados Abertos pesquisas 2026: https://dadosabertos.tse.jus.br/dataset/pesquisas-eleitorais-2026  
- IBGE Censo 2022: https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html  
- CONFE quota-sample notes: https://www.confe.org.br/pesquisacotas1.pdf  

### PEBR internal

- Option B: [`methodology-aggregate-option-b.md`](methodology-aggregate-option-b.md)  
- Suggestions #1–21 findings: [`suggestions-research-findings.md`](suggestions-research-findings.md)  
- Locks: [`AI-HANDOFF.md`](AI-HANDOFF.md), [`conversation-decisions.md`](conversation-decisions.md)

---

## 9) Explicit out of scope / unethical / lock violations

Do **not** research-implement or document as PEBR how-to:

1. Pastebin / “leaked” proprietary pollster scripts, cracked paywalled forecast models, stolen microdata.  
2. Inventing poll shares, OCR/CI auto-extract of percentages, filling missing cells.  
3. Playwright (or other browser automation) for discovery/acquisition.  
4. Brush / Poder360-style range scrubber; all-candidate hover scoreboard.  
5. TypeScript / SPA / Vite / ECharts / WASM-Stan in the Pages UI.  
6. Silent house-effect default rewriting Option B.  
7. Mixing espontânea into estimulada; mixing 2º matchups; blending UFs into Brasil.  
8. Chart #2 as 1º-vs-2º panel.  
9. Michelle Bolsonaro in candidates/scenarios.  
10. Labeling descriptive SD ribbons as “IC 95%” or win probability.  
11. Shipping US fundamentals models as calibrated BR 2026 forecasts.  
12. MRP / synthetic UF maps without real poststrat cell data.  
13. Actions regenerating Lead-owned `chart*.json`.  
14. Re-adding Pages CSV/JSON export buttons (share URL stays).

---

## 10) Suggested follow-on research tasks (still docs / fixtures; no product until resume)

1. Sensitivity memo on real 117/203: k∈{7,14,21}, √N vs N, flood on/off → tables of latest \(A_c\) (ties suggestion #7).  
2. Institute residual table vs Option B (docs-only house-effect research; ties #8).  
3. Mode metadata audit: which primaries publish F2F/phone/online clearly enough to support a mode-split toggle.  
4. Read-only comparison notebook against `agregR` **outputs** if publicly reproduced — cite package; do not vendor Stan into PEBR.  
5. Runoff pairing frequency table from published 2º scenarios (descriptive counts, not MC probs).  
6. Copy deck: PT one-liners for every Wave A/B chip disclaimer.

---

*End of advanced R&D memo. Append-only expansions welcome; do not delete prior PEBR methodology docs.*
