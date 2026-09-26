# PEBR 2026 — Identity, TSE, Witness & Dedupe Notes

For schema designers of the Ruby pipeline / canonical poll identity model.  
Research date: 26 Sep 2026 (America/Sao_Paulo). Companion: `SOURCE_MAP.md`, `sources.json`.

---

## 1. Core model (locked decisions → schema)

| Concept | Recommendation |
|---------|----------------|
| **Canonical poll** | One fieldwork wave + one institute + one national universe + one TSE registration when present |
| **Trend date** | `fieldwork_end` (not publication date, not registration date) |
| **TSE role** | **Provenance / identity key**, not ground-truth of percentages |
| **Witnesses** | Zero-to-many coverage records (media URLs, PDF mirrors, aggregator mentions) pointing at the same poll |
| **Results** | Separate layer: scenarios × question type × candidate shares; never invent |

Suggested identity stack (conceptual):

```
poll_id (PEBR UUID)
  ├── institute_id (normalized)
  ├── tse_registration_id  (nullable; e.g. BR-00304/2026)
  ├── geography = national | state | municipal
  ├── fieldwork_start / fieldwork_end   ← trend date = end
  ├── sample_size, moe, confidence, mode (face/CATI/online/…)
  ├── contractor / payer (from TSE when available)
  ├── results[] (scenarios, spontaneous/stimulated, totals/valids, …)
  └── witnesses[] (url, publisher, retrieved_at, role=primary_pdf|mirror|article|aggregator)
```

---

## 2. TSE registration number as join key

### 2.1 Format

- **National:** `BR-#####/YYYY` (examples observed in press: `BR-00304/2026`, `BR-06004/2026`, `BR-01739/2026`, `BR-04202/2026`, …)
- **State:** `UF-#####/YYYY` (e.g. `SP-03057/2026`, `RJ-04036/2026`, `CE-03967/2026`)
- **Municipal:** typically within UF packages / city filters in PesqEle (municipal elections years)

### 2.2 What TSE reliably gives

From law (Lei 9.504/97 art. 33; Res. TSE incl. 23.747/2026) and Dados Abertos / PesqEle UX docs:

- Institute / CNPJ entity  
- Field dates, sample, MoE, confidence, methodology text  
- Contractor + payer identifiers  
- Statistician + CONRE  
- UF + cargos  
- PDF attachments: questionnaire, NFs, geographic detail  

### 2.3 What TSE does **not** give (as official results)

- Candidate vote intention percentages  
- Obligation that a registered poll is ever published  

**Quote-level policy from TSE materials:** Justice Electoral does not pre-control results or manage disclosure; registration ≠ endorsement of numbers.

### 2.4 Join failures to expect

| Situation | Handling |
|-----------|----------|
| Media cites `BR-…` and institute PDF matches | Strong identity; attach witnesses |
| TSE row exists; no public results found | Keep as **registered unpublished** (provenance only) |
| Results published; TSE number missing/wrong in article | Soft-match on institute + fieldwork_end + sample; flag `tse_link=unverified` |
| Same BR number cited with conflicting % across outlets | Prefer institute PDF; mark witness conflict; do not average silently |
| Open-data CSV lags PesqEle UI by hours/days | Prefer freshest provenance; store `tse_source=open_data|pesqele_ui` |

AFOS HuggingFace mirror shows real-world `register_tse = null` on many result rows — proof that published results and TSE keys are **not always co-present** in secondary datasets.

---

## 3. Witness / coverage model

### 3.1 Roles

| Role | Example | Use |
|------|---------|-----|
| `primary_institute` | quaest.com.br PDF, atlasintel.org/poll/…, nexus release page | Prefer for percentages |
| `pdf_mirror` | `static.poder360.com.br/uploads/…` | OK if hash/bytes match or clearly same report |
| `article_witness` | G1/Folha/CNN story citing TSE number | Discovery + soft fields; extract carefully |
| `aggregator_mention` | UOL/CNN Índice/Wikipedia row | Discovery only; never sole % source for v1 truth |

### 3.2 Same poll, many URLs (dedupe)

A single Datafolha or Quaest wave typically fans out to:

1. Institute page / PDF  
2. Folha or G1 article (sometimes two articles: 1º turno / 2º turno)  
3. Poder360 CDN PDF copy  
4. CNN / Gazeta / UOL / Estadão rewrites  
5. Wikipedia citation  
6. Aggregator ingest  

**Dedupe key should NOT be URL.** Prefer:

```
normalize(institute) + fieldwork_end + sample_size + tse_registration
```

Fallbacks when TSE missing: `(institute, fieldwork_start, fieldwork_end, sample_size, mode)`.

### 3.3 Article splitting ≠ multiple polls

G1 often publishes **separate URLs** for 1º turno and 2º turno of the **same** fieldwork. Schema must allow multiple result scenarios under one `poll_id`, not two polls.

### 3.4 Power360 dual role

Poder360 is simultaneously:

- Owner/publisher of **PoderData** (primary)  
- PDF mirror / reporter for **other** institutes (witness)  
- Paywalled **Agregador** (secondary)

Tag witnesses with `publisher_is_pollster_owner=true|false` to avoid circular provenance.

---

## 4. Institute name normalization (aliases)

| Observed label | Canonical institute_id |
|----------------|------------------------|
| Quaest, Genial/Quaest, Quaest/Genial | `quaest` |
| Datafolha | `datafolha` |
| AtlasIntel, Atlas/Bloomberg, AtlasIntel/Bloomberg | `atlasintel` |
| PoderData, PoderData/Aya, PoderData/AYA | `poderdata` |
| Paraná Pesquisas, Instituto Paraná | `parana_pesquisas` |
| Real Time Big Data, Real Time, RealTime | `realtime_big_data` |
| Ideia, Meio/Ideia, Ideia/Canal Meio, Instituto Meio Ideia | `ideia` |
| CNT/MDA, MDA, Pesquisa CNT de Opinião | `cnt_mda` (store `commissioner=CNT`, `field_institute=MDA`) |
| Ipsos-Ipec, Ipec, Ipsos | `ipsos_ipec` |
| Futura, Futura Inteligência, Futura/Apex | `futura` |
| Nexus, BTG/Nexus, Nexus/BTG | `nexus` |
| Indexa, Indexa Pesquisas, Indexa Broadcast | `indexa` |
| Palver | `palver` |
| Gerp, Gerp Opinião | `gerp` |
| Vox Brasil, Instituto Vox Brasil | `vox_brasil` |
| Veritá, Instituto Veritá | `verita` |

Maintain an `institute_aliases` table; never create a new institute from a partnership prefix alone.

---

## 5. NATIONAL vs STATE contamination risks

### 5.1 Hard filters for v1 national aggregates

Accept only if **all** true:

1. `geography = national`  
2. Registration prefix `BR-` when TSE present  
3. Sample described as Brasil / territorio nacional  
4. Cargo includes Presidente at national level  

Reject / quarantine:

- Any `UF-` registration  
- Paraná (and others’) state PDFs even if they include a presidential question  
- Datafolha “nos estados” **cuts** used as if they were independent state polls **or** as extra national polls  
- Ipsos-Ipec CE (etc.) presidential intention among state voters  
- Índice CNN governor series  

### 5.2 Crosstab trap

National polls often publish regional/state **breakdowns**. Those are **attributes of the national poll**, not separate poll entities. Model as `crosstab` children, not sibling polls.

### 5.3 Mixed CDN directories

`static.poder360.com.br/uploads/` mixes national and state PDFs (e.g. Real Time SP/CE). Filename + TSE number + title must be parsed before intake.

---

## 6. Result-shape identity risks (one poll ≠ one number)

Within a single registration/PDF:

| Axis | Variants |
|------|----------|
| Round | 1º turno / 2º turno matchups |
| Prompt | espontânea / estimulada |
| Denominator | total sample / válidos / excluding undecided |
| Scenario | different candidate lists (esp. pre-convention) |
| Rounding | integer vs one decimal |

**Canonical trend series** should declare which slice (e.g. “estimulada, 1º turno, total %)”. Storing only a single headline % loses auditability and causes false “conflicts” between witnesses that actually quote different slices.

---

## 7. Date fields (avoid trend pollution)

| Field | Meaning | Use |
|-------|---------|-----|
| `registered_at` | TSE registration timestamp | Provenance |
| `fieldwork_start` / `fieldwork_end` | Interview period | **`fieldwork_end` = trend date** |
| `published_at` | First public disclosure | Coverage chronology |
| `witness_retrieved_at` | When PEBR fetched a URL | ETL audit |
| `open_data_extract_at` | TSE dump generation date | Freshness |

Aggregators often date rows by **publication** or **“last update”**. Recompute trends from `fieldwork_end` after ingest.

---

## 8. Duplicate-witness heuristics (practical)

High confidence same poll if:

- Identical `tse_registration_id`, OR  
- Same institute + same `fieldwork_end` ±0 days + same `sample_size` + compatible MoE  

Medium confidence:

- Same institute + fieldwork window overlap + sample within ±1% + matching leading candidate ordering  

Low confidence (manual review):

- Same week + same institute but different sample sizes (may be genuine new wave — Datafolha/Quaest weekly cadence)  

**Weekly institutes:** do **not** collapse consecutive weeks solely by institute name.

---

## 9. Secondary datasets (AFOS, Wikipedia, aggregators)

| Source | Safe use | Unsafe use |
|--------|----------|------------|
| TSE open data | Build registration skeleton | Treat as results |
| Institute PDF/HTML | Results + methodology | — |
| Poder360 CDN | PDF bytes if matched | Blind scrape without national filter |
| G1/Folha/CNN | Discovery + TSE number | Sole % without PDF check |
| UOL / Índice CNN / Economist | Coverage / QA | Feeding national model as raw polls |
| Wikipedia | Seed institute list + links | Copy numbers without citation chase |
| AFOS HF | Bootstrap + diff QA | Trust null-TSE rows; trust Polymarket joins as poll truth |

---

## 10. Access / robotics constraints affecting identity ETL

- **PesqEle divulgacao:** WAF / “Acesso Rejeitado” for some automated clients → prefer Dados Abertos CSV for bulk provenance; use browser for ad-hoc UI checks.  
- **TSE CKAN API:** Access Denied from research box (26 Sep 2026) → download via portal UI or alternate egress.  
- **Poder360 Agregador:** paywalled — do not make subscription scrape a hard dependency.  
- **Futura / RealTime institute pages:** JS-thin — media PDF mirrors may be more durable witnesses.  
- **G1 especial:** JS-rendered charts — HTML fetch may show zeros; use articles + institute for numbers.

---

## 11. Suggested minimal uniqueness constraint

```text
UNIQUE NULLS NOT DISTINCT (
  institute_id,
  fieldwork_end,
  geography,
  COALESCE(tse_registration_id, '_none_'),
  sample_size
)
```

Plus a separate `witness_url` uniqueness to prevent re-ingesting the same article, while still allowing many witnesses per poll.

---

## 12. Open unknowns (honest)

- Exact CSV column dictionary for 2026 open-data zip: not downloaded this pass (WAF); infer from prior-year packages + AFOS `tse-registry` docs, then confirm on first successful download.  
- Stable official hubs for Palver, Gerp, Vox Brasil, Veritá, Alfa, American Analytics, DataTrends: **not verified** beyond aggregator/press mentions.  
- Whether “Jota” in UOL’s institute list is a pollster or a publisher label.  
- Sapiens Labs API: URL exists in search; **schema unaudited**.  
- Harvard Dataverse DOI landing for AFOS: claimed, not independently fetched.

