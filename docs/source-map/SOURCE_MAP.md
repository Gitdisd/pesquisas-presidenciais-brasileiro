# PEBR 2026 — Brazilian Presidential Polling Source Map

**Project:** Pesquisas Eleitorais BR / pesquisas-presidenciais-brasileiro (Gitdisd)  
**Scope of this document:** Research-only map of where national (and clearly marked other) polls are published or registered. **No shortlist.** No invented poll numbers.  
**Research date:** 26 Sep 2026 (America/Sao_Paulo)  
**Repo context:** https://github.com/Gitdisd/pesquisas-presidenciais-brasileiro  

**Locked decisions reflected here:**
- v1 = **NATIONAL polls only** (state sources mapped separately; never mix into national aggregates)
- Intake from everywhere + TSE; **TSE is provenance, not truth**
- Canonical poll identity + witness/coverage model for dedupe
- `fieldwork_end` is the trend date
- Never invent poll numbers, candidates, institutes, or dates

Companion files:
- [`sources.json`](./sources.json) — structured source records
- [`identity-notes.md`](./identity-notes.md) — TSE/witness/dedupe notes for schema designers

---

## 1. How Brazilian election polls become public

```
Institute fieldwork
        │
        ▼
TSE PesqEle registration (≤5 days before disclosure; from 1 Jan of election year)
  • Registration number e.g. BR-00304/2026 (national) or SP-03057/2026 (state)
  • Metadata: sample, method, MoE, confidence, contractor/payer, statistician, UF/cargo
  • Attachments: questionnaire PDF, NFs, neighborhood/municipality detail
  • TSE does NOT certify results; registration ≠ published horse-race numbers
        │
        ├──────────────────────┐
        ▼                      ▼
Institute release         Media / aggregator republication
(HTML, PDF, press kit)    (G1, Folha, Poder360, CNN, UOL, …)
        │                      │
        └──────────┬───────────┘
                   ▼
         Secondary archives / aggregators / Wikipedia / open datasets
```

**Implication for PEBR:** treat **published results** (institute PDF/HTML or reliable witness) as the result layer; treat **TSE registration** as the provenance/identity layer. They often join on `BR-#####/YYYY` but can mismatch or one side can be missing.

---

## 2. TSE / Justice Electoral (provenance layer)

### 2.1 Systems

| Name | URL | Role |
|------|-----|------|
| PesqEle — public consultation | https://pesqele-divulgacao.tse.jus.br/ | Lookup registered polls by election / UF / filters |
| PesqEle — company registration | https://pesqele-empresa.tse.jus.br/ | Institute login to register polls |
| TSE hub — pesquisas eleitorais | https://www.tse.jus.br/eleicoes/pesquisas-eleitorais | Legal framing + links into PesqEle |
| TSE — consulta às pesquisas | https://www.tse.jus.br/eleicoes/pesquisa-eleitorais/consulta-as-pesquisas-registradas | Portal page pointing to PesqEle divulgacao |
| TSE — registro de empresas | https://www.tse.jus.br/eleicoes/pesquisa-eleitorais/registro-de-empresas-e-entidades-de-pesquisas-e-cadastro-de-pesquisas | Points to PesqEle empresa |
| Resolução 23.747/2026 (rules) | https://www.tse.jus.br/legislacao/compilada/res/2026/resolucao-no-23-747-de-26-de-fevereiro-de-2026 | Fields required at registration |

**Access notes (verified 26 Sep 2026):**
- `pesqele-divulgacao.tse.jus.br` often **JS-heavy** and sometimes returns **"Acesso Rejeitado"** / WAF blocks to automated clients. Browser session usually required.
- Lookup pattern (documented for 2022; same UX pattern for later cycles): select election (e.g. Eleições Gerais 2026) → UF = **Brasil** for national, or a state UF → Pesquisar → lupa for detail + PDF downloads.
- Public display of registered info is time-bounded in law (historically ~30 days on tribunal sites); **Dados Abertos** is the durable dump.

### 2.2 Open data (structured dumps)

| Dataset | URL | Cadence | License (portal) |
|---------|-----|---------|------------------|
| Pesquisas Eleitorais — 2026 | https://dadosabertos.tse.jus.br/dataset/pesquisas-eleitorais-2026 | Daily (portal metadata) | Creative Commons Attribution (resource page) |
| Group index (2012–2026) | https://dadosabertos.tse.jus.br/pt_BR/group/pesquisas-eleitorais | Per-election packages | Same family |
| Resource example (main CSV zip) | https://dadosabertos.tse.jus.br/dataset/pesquisas-eleitorais-2026/resource/769a663e-12c5-489e-a9c8-04633c2d57a3 | — | CC Attribution |
| Contratantes CSV resource | https://dadosabertos.tse.jus.br/dataset/pesquisas-eleitorais-2026/resource/5675d403-63ce-4a39-bd00-fc110ef999a7 | — | — |
| Pagantes CSV resource | https://dadosabertos.tse.jus.br/dataset/pesquisas-eleitorais-2026/resource/32fc58de-8369-4b9f-9c97-1647f8de49cb | — | — |

**2026 package contents (from portal page):**
- Pesquisas eleitorais CSV (all UFs)
- Contratantes CSV
- Pagantes CSV
- Notas fiscais PDF (zip/bundle)
- Questionários de pesquisa PDF
- Detalhamento de bairro/município PDF

**Critical:** open-data CSVs are **registration/metadata**, not a complete results table of candidate percentages. Candidate horse-race numbers live in institute releases / media witnesses / secondary archives that parse them.

**Access notes:** CKAN API (`/api/3/action/package_show`) returned **Access Denied** from research box (26 Sep 2026). Web UI pages were fetchable. Expect **Akamai/WAF** friction; plan browser or egress-tolerant download for production.

### 2.3 Identity fields available via TSE (from law + UX docs)

From Lei 9.504/1997 art. 33 / Res. TSE (incl. 23.747/2026) and TSE how-to pages, registrations expose (inter alia):
- Registration number (`BR-#####/YYYY` national; `UF-#####/YYYY` state)
- Institute / entity
- Fieldwork period
- Sample size, MoE, confidence
- Methodology
- Contractor and payer (CPF/CNPJ)
- Statistician + CONRE + digital signature artifacts
- UF and offices (`cargos`) covered
- PDF attachments (questionnaire, NF, geography)

**Not in TSE as “official results”:** stimulated/spontaneous vote shares by candidate. Those are published by the institute (or not — registration does not force disclosure of results).

---

## 3. NATIONAL institutes (primary result producers)

Verified via institute sites, PDFs, and/or consistent national coverage in multiple national outlets / Wikipedia 2026 polling page. **Geographic scope = national** unless noted.

| Institute | Home / poll hub | Typical content | Cadence (observed) | Primary vs witness | Notes |
|-----------|-----------------|-----------------|--------------------|--------------------|-------|
| **Quaest** | https://quaest.com.br/ ; LP series e.g. https://quaest.com.br/lps/lp-pesquisa-eleicoes-2026-julho/ ; PDFs under `quaest.com.br/wp-content/uploads/…` | HTML + PDF reports | Frequent (weekly in campaign) | **Primary** | Also **Genial/Quaest** partnership branding on some rounds. Commissioned series for Globo/O Globo in 2026 campaign. |
| **Datafolha** | https://datafolha.folha.uol.com.br/ | HTML summaries; full numbers often via Folha/G1 | Frequent in campaign | **Primary** | Folha + TV Globo commissions common. State breakdowns of national samples also published — **do not treat state crosstabs as state polls**. |
| **AtlasIntel** | https://atlasintel.org/ ; poll pages e.g. https://atlasintel.org/poll/brazil-national-2026-09-23 | Structured poll pages + charts | ~weekly / high-frequency | **Primary** | Online/panel methodology; Bloomberg partnership cited in press as Atlas/Bloomberg. |
| **PoderData** (w/ **Aya**) | Results + PDF via Poder360 CDN e.g. `static.poder360.com.br/uploads/…/Relatorio-PoderData-…` | PDF reports | ~weekly | **Primary** (institute) | Publisher is often Poder360; treat Poder360 article as witness, PDF as primary artifact when institute-issued. |
| **Paraná Pesquisas** | https://paranapesquisas.com.br/ ; PDFs `paranapesquisas.com.br/wp-content/uploads/…/Nacional_*.pdf` | PDF + site posts | Irregular national; heavy **state** output | **Primary** for national PDFs | Homepage currently dominated by **state** studies — filter UF/`BR-` carefully. |
| **Real Time Big Data** | https://realtimebigdata.com.br/ ; https://realtimebigdata.com.br/pesquisas/ | Site + PDFs (often mirrored on Poder360 CDN) | Campaign-frequent | **Primary** | Site `/pesquisas` is thin/JS; many full PDFs redistributed by media. |
| **Ideia** / **Meio/Ideia** / **Ideia/Canal Meio** | https://ideiausa.com.br/ (corporate); results often via media PDFs e.g. Poder360 `Pesquisa-Meio_Ideia-*.pdf` | PDF / press | ~monthly / campaign | **Primary** | Branding variants are the **same institute family** — normalize name carefully. |
| **CNT/MDA** | Reports via CNT / media; PDF example hosted by CartaCapital / Poder360 | PDF “Pesquisa CNT de Opinião” rounds | Periodic (numbered rounds, e.g. 170ª) | **Primary** | CNT commissions; **MDA** executes. Dual branding. |
| **Ipsos-Ipec** | https://www.ipsos.com/pt-br/ ; PDFs under `ipsos.com/sites/default/files/ct/publication/documents/…` | PDF releases | Less frequent than weekly trackers in 2026 sample | **Primary** | Successor brand to Ibope/Ipec lineage in press shorthand. Also publishes **state** studies (e.g. CE) — separate. |
| **Futura Inteligência** | https://www.futurainteligencia.com.br/pesquisas | Library page (JS-heavy) | Campaign-frequent | **Primary** | Also branded **Futura/Apex** in some coverage. |
| **Nexus** (BTG/Nexus) | https://www.nexus.fsb.com.br/ ; estudos e.g. …/pesquisa-btg-nexus-… | HTML release + PDF mirrors | Frequent | **Primary** | Commissioned with BTG Pactual branding. |
| **Indexa Pesquisas** | https://indexapesquisas.com.br/ | Corporate site; results via JOTA/CNN/Estadão Broadcast ecosystem | Regular | **Primary** | Press: Indexa / Indexa Broadcast. Successor narrative to Instituto Opinião in some bios. |
| **Palver** | Results via CNN/JOTA; occasional Google Docs / PDF links in press | Press + PDF | Campaign waves | **Primary** (when institute PDF available) | Often witnessed first via CNN/JOTA. |
| **Gerp** | Results via Jovem Pan / Poder360 etc. | Press / PDF | Irregular | **Primary** when PDF found | Appears in national aggregators. |
| **Vox Brasil** | Results via Poder360 / Metrópoles | Press / PDF | Irregular | **Primary** when PDF found | National rounds cited on Wikipedia 2026 page. |
| **Veritá** | Press citations | Press / PDF | Irregular | Secondary until PDF | Listed in UOL aggregator institute list. |
| **Alfa Inteligência** | Press / UOL list | Unknown primary hub | Unknown | Secondary until verified hub | Appears in UOL “origem dos dados”. |
| **American Analytics** | Press / UOL list | Unknown | Unknown | Secondary until verified hub | Same. |
| **DataTrends** | Press / UOL list | Unknown | Unknown | Secondary until verified hub | Same. |
| **Neokemp** | Press citations | Press | Sparse | Secondary until PDF | Appears on Wikipedia tables. |
| **Instituto Jota** / JOTA surveys | jota.info ecosystem | Press | Sparse | Treat carefully | UOL lists “Jota” among sources — confirm whether JOTA is pollster vs publisher. |

**Partnership brands to normalize (not separate institutes):**
- Genial/Quaest ≡ Quaest fieldwork under Genial sponsorship
- PoderData/Aya ≡ PoderData
- BTG/Nexus ≡ Nexus
- Futura/Apex ≡ Futura
- Meio/Ideia, Ideia/Canal Meio ≡ Ideia
- CNT/MDA ≡ MDA fieldwork for CNT
- Atlas/Bloomberg ≡ AtlasIntel

---

## 4. STATE / SUBNATIONAL sources (DO NOT mix into national v1)

These produce real polls but **must be tagged `geographic_scope=state` (or municipal)** and excluded from national trend aggregates.

| Source | Evidence | Risk |
|--------|----------|------|
| Paraná Pesquisas state series | Homepage lists CE, ES, BA, RJ, SC, SP, AL, Curitiba municipal, etc. with `UF-#####/2026` | Easy to confuse with national `Nacional_*.pdf` |
| Datafolha “estados” articles | Folha/G1 publish SP/RJ/MG/PE/DF **cuts** of national sample OR dedicated state fieldwork | Crosstab of national ≠ state poll |
| Ipsos-Ipec state releases | e.g. Ceará PDF under ipsos.com | State presidential intention inside state study |
| Real Time Big Data state PDFs | Poder360 CDN hosts SP, CE, etc. | Same institute, different registration |
| TSE PesqEle when UF ≠ Brasil | All state/municipal registrations | Filter `UF=Brasil` / cargo Presidente + national only |
| Índice CNN state mode | CNN documents governor races for 27 UFs | Aggregator of state polls |

**Rule:** national pipeline accepts only polls whose **declared universe is Brazil** and registration prefix **`BR-`**, plus institute metadata confirming national sample. State presidential “intention in State X” is out of v1 national aggregates.

---

## 5. Media & secondary reporters (WITNESS layer)

Useful for discovery, TSE number capture, and PDF mirrors. **Not canonical** when institute PDF/HTML exists.

| Outlet | URL / hub | Content | Paywall / access | Role |
|--------|-----------|---------|------------------|------|
| **G1** | https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/ ; especial https://especiaisg1.globo/politica/eleicoes/2026/pesquisas-eleitorais/presidente/1-turno/ | HTML articles + interactive for Quaest/Datafolha | Free (JS-heavy especial) | Strong witness for Globo-commissioned polls |
| **Folha** | https://www1.folha.uol.com.br/poder/ | HTML; Datafolha home | Soft paywall possible | Primary channel for Datafolha narrative |
| **Poder360** | https://www.poder360.com.br/ ; CDN `static.poder360.com.br/uploads/` ; agregador https://www.poder360.com.br/agregador-de-pesquisas/ | Articles + **PDF hosting** for many institutes | Agregador **subscription-gated** (verified); many PDFs still public on CDN | Best PDF mirror network; dual role (owns PoderData) |
| **CNN Brasil** | https://www.cnnbrasil.com.br/eleicoes/ ; Índice CNN explainer | Articles + aggregator | Free articles | Witness + **Índice CNN** aggregator |
| **UOL** | https://noticias.uol.com.br/eleicoes/agregador-de-pesquisas-eleitorais/ | Weighted aggregator + institute list | Free | Aggregator + discovery |
| **Estadão** | https://www.estadao.com.br/tudo-sobre/eleicoes-2026-pesquisa-eleitoral/ | Articles / Broadcast | Paywall common | Witness |
| **Gazeta do Povo** | https://www.gazetadopovo.com.br/eleicoes/2026/pesquisa-eleitoral-2026/ | HTML recaps of many institutes | Free/partial | Discovery hub |
| **O Globo** | oglobo.globo.com (incl. Lauro Jardim; Rali/Locomotiva mentions) | Articles / blog | Paywall | Witness for Quaest-Globo series |
| **CartaCapital** | hosts CNT/MDA PDFs occasionally | PDF mirrors | Free | PDF witness |
| **Exame / InfoMoney / Terra / Valor / Metrópoles / Correio Braziliense** | Various | HTML | Mixed | Secondary witnesses |
| **JOTA** | jota.info | Articles + some poll PDFs | Mixed | Strong for Indexa/Palver discovery |

---

## 6. Aggregators / trackers (secondary; do not replace primaries)

| Aggregator | URL | Notes |
|------------|-----|-------|
| **UOL Agregador** | https://noticias.uol.com.br/eleicoes/agregador-de-pesquisas-eleitorais/ | National only; stimulated; n≥1000; TSE-registered; weighted by recency/sample/method/cost/history |
| **Índice CNN** (Ipespe Analítica) | Documented at https://www.cnnbrasil.com.br/eleicoes/indice-cnn-saiba-como-funciona-o-agregador-de-pesquisas-das-eleicoes-2026/ | Bayesian/ML; TSE-registered only; president + governors |
| **PollingData** | https://flex.pollingdata.com.br/pdvoto/2026 | Used by BBC Brasil tracker |
| **The Economist** | https://www.economist.com/interactive/2026-brazil-election-tracker | Paywalled interactive |
| **Poder360 Agregador** | https://www.poder360.com.br/agregador-de-pesquisas/ | Subscription (“Poder Monitor”) |
| **G1 especial** | https://especiaisg1.globo/politica/eleicoes/2026/pesquisas-eleitorais/presidente/1-turno/ | Deep dive on **Quaest + Datafolha**, not all institutes |
| **Wikipedia (EN)** | https://en.wikipedia.org/wiki/Opinion_polling_for_the_2026_Brazilian_presidential_election | Excellent discovery index + citations; not a primary |
| **TradeMap** | https://tm.trademap.com.br/agencia/agregador-de-pesquisas-corrida-presidencial-2026-6 | Commercial aggregator |
| **Plano Político / ABC Dados / Poll+Trend** | Cited on Wikipedia aggregator table | Verify freshness before relying |
| **DataPolicy** | noticias.datapolicy.co aggregator pages | Secondary |

---

## 7. Open datasets / archives / APIs

| Resource | URL | Type | Suitability |
|----------|-----|------|-------------|
| TSE Dados Abertos 2026 | https://dadosabertos.tse.jus.br/dataset/pesquisas-eleitorais-2026 | CSV/PDF dumps | **Primary provenance intake** |
| TSE group 2012–2026 | https://dadosabertos.tse.jus.br/pt_BR/group/pesquisas-eleitorais | Historical | Backfill provenance |
| AFOS HuggingFace dataset | https://huggingface.co/datasets/AFOS-Analytics1/brazil-2026-electoral-divergence | Parsed TSE registry + national results + divergence | **Secondary archive** — useful bootstrap; re-verify against TSE + institute PDFs; note null `register_tse` rows |
| AFOS Harvard Dataverse | DOI 10.7910/DVN/2D0UK7 (claimed on HF card) | Archive | Secondary |
| AFOS GitHub | https://github.com/AFOS-Analytics/afos-analitica-2026 | Code/mirror | Secondary |
| Poder360 static CDN | https://static.poder360.com.br/uploads/ | PDF cache | Witness/PDF mirror |
| Wikipedia tables | EN page above | Manual curation | Discovery only |
| Sapiens Labs “API pública Eleições 2026” | https://eleicoes2026.sapienslabs.com.br/api (search hit) | Claimed API | **Unverified in this pass** — treat as unknown until schema audited |

**No official TSE results API for candidate %** was found. Structured results require parsing institute PDFs/HTML or curated secondary datasets.

---

## 8. National vs state separation (operational checklist)

| Accept in v1 national | Reject / quarantine |
|-----------------------|---------------------|
| Registration `BR-…/2026` | `SP-`, `RJ-`, `MG-`, … |
| Institute declares national sample / Brasil | State sample even if question is “president” |
| Cargo includes Presidente da República at national level | Governor / mayor / senator-only |
| National PDF titled Nacional / Brasil | State PDF that also asks presidential intention |
| Media article clearly “pesquisa nacional” | “nos estados” crosstabs alone as separate polls |

---

## 9. Identity & duplicate risks (summary)

See [`identity-notes.md`](./identity-notes.md) for full treatment. Headline risks:
1. Same poll → many URLs (institute + Poder360 CDN + G1 + Folha + CNN).
2. TSE registration without published results (and vice versa early/late cycle).
3. Partnership dual names (Genial/Quaest, BTG/Nexus, …).
4. National sample state **cuts** mistaken for state polls.
5. Spontaneous vs stimulated vs valid votes vs total sample — different “numbers” for one poll.
6. Multiple scenarios in one registration/PDF.
7. Aggregators rewriting / weighting (not witnesses of raw %).

---

## 10. SUGGESTION ONLY — tentative first-intake cohort

**Not a shortlist commitment.** Suggested bootstrap order for national intake tooling:

1. **TSE Dados Abertos 2026** CSV (provenance skeleton; filter Brasil / Presidente).
2. **Institute PDF/HTML primaries:** Datafolha, Quaest, AtlasIntel, PoderData, Nexus, Real Time Big Data, Futura, CNT/MDA, Ideia, Paraná (national PDFs only), Indexa, Ipsos-Ipec.
3. **Witness nets for discovery + PDF mirrors:** G1, Folha, Poder360 CDN, CNN, Gazeta do Povo, JOTA.
4. **Cross-check indexes:** UOL Agregador institute list, Wikipedia EN citations, AFOS `polls/tse-registry` (verify, don’t trust blindly).

Defer: state Paraná flood, paywalled aggregator scrapes as sole source, unverified “Alfa / American Analytics / DataTrends” hubs until primary URLs confirmed.

---

## 11. Verification log (this research pass)

- WebSearch + WebFetch used extensively (TSE portal, Dados Abertos pages, institute homes, G1 especial, CNN Índice, UOL agregador, Wikipedia EN, Atlas poll page, Nexus release, Quaest LP, Paraná home, Futura, Indexa, Poder360 agregador paywall, HuggingFace AFOS, RealTime pesquisas).
- Direct curl to TSE CKAN API: **Access Denied** (noted).
- PesqEle divulgacao: reported as WAF-blocked for some automated clients.
- **No fabricated poll percentages** were invented for this map; any numbers appearing in fetched pages were not transcribed into `sources.json` as PEBR facts.

