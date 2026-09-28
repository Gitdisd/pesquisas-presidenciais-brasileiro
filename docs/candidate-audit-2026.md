# Candidate audit — 2026 presidential election

**Audit date:** 2026-09-28 (America/Sao_Paulo)  
**Authoritative status source:** Tribunal Superior Eleitoral (TSE), **11 Sep 2026**, "Eleições têm 12 candidaturas na disputa pela Presidência da República"  
**Source:** https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/eleicoes-2026-tem-12-candidaturas-na-disputa-pela-presidencia-da-republica

## Current presidential roster used by the UI

The TSE page says that 12 candidacies were in the presidential race after the 11 Sep 2026 decision. The current-roster gate in `site/js/candidates-config.js` therefore uses these 12 candidate IDs:

| Candidate ID | Display name | Ballot no. |
|---|---|---:|
| `lula` | Luiz Inácio Lula da Silva | 13 |
| `flavio_bolsonaro` | Flávio Bolsonaro | 22 |
| `samara_martins` | Samara Martins | 80 |
| `romeu_zema` | Romeu Zema | 30 |
| `hertz_dias` | Hertz Dias | 16 |
| `edmilson_costa` | Edmilson Costa | 21 |
| `renan_santos` | Renan Santos | 14 |
| `wilson_grassi` | Wilson Grassi | 35 |
| `clariana_barao` | Clariana Barão | 27 |
| `augusto_cury` | Augusto Cury | 70 |
| `ronaldo_caiado` | Ronaldo Caiado | 55 |
| `rui_costa_pimenta` | Rui Costa Pimenta | 29 |

## Audit findings

### 1. Bolsonaro identity is correct

The canonical national and regional datasets use **`flavio_bolsonaro`**, not `jair_bolsonaro`. No `jair_bolsonaro` candidate ID was present in the canonical datasets.

The TSE's presidential-candidacy page also identifies the 2026 PL presidential candidate as **Flávio Bolsonaro**.

Display text is now normalized to **Flávio Bolsonaro** in the UI even when generated chart metadata uses the ASCII form "Flavio Bolsonaro".

### 2. The default UI candidate gate was incomplete

Before this audit, `site/js/candidates-config.js` explicitly hid only seven historical/non-current IDs:

- `aldo_rebelo`
- `joaquim_barbosa`
- `aecio_neves`
- `cabo_daciolo`
- `pablo_marcal`
- `hero_bezerra`
- `ratinho_junior`

That left four additional non-current IDs eligible to appear by default:

- `ciro_gomes`
- `michel_temer`
- `tarcisio_de_freitas`
- `leonardo_avalanche`

The fix replaces that partial blacklist with an explicit **current 12-candidate allowlist**. Historical IDs remain available in the archive but are no longer part of the default current-election UI.

### 3. Leonardo Avalanche requires historical treatment

`leonardo_avalanche` appears in 9 national 1st-round canonical poll records, including records with late fieldwork dates. The TSE's 11 Sep page identifies Leonardo Avalanche as the **vice-presidential running mate** on the denied Pablo Marçal ticket, not as a separate presidential candidate.

This audit therefore **does not rewrite those historical poll result cells**. Relabeling the historical values to Pablo Marçal without re-checking each underlying witness would create new unverified data. Instead:

- `leonardo_avalanche` is classified as historical/non-current;
- it is hidden from the default current-election UI;
- the archived poll records remain unchanged pending source-level verification.

### 4. Pablo Marçal is already excluded from the current UI

The repository already treated `pablo_marcal` as inactive. The TSE subsequently denied the PRTB ticket on 11 Sep 2026. The alias note has been updated to record that decision while preserving historical records.

### 5. Regional Chart #2 had the same candidate-risk

The regional Chart #2 fallback reads `canonical-points-regional.json` directly while `chart-regional.json` is empty. That raw regional dataset includes `pablo_marcal`.

The regional renderer previously did not apply the main candidate-status gate to its plotted points/legend. It now uses the same current-roster gate, so the regional view cannot silently surface a non-current candidate by default.

## Historical candidates intentionally retained in the data archive

These IDs occur in historical 2026 first-round poll records but are not in the current 12-candidate presidential roster used for the UI:

`aecio_neves`, `aldo_rebelo`, `cabo_daciolo`, `ciro_gomes`, `hero_bezerra`, `joaquim_barbosa`, `leonardo_avalanche`, `michel_temer`, `pablo_marcal`, `ratinho_junior`, `tarcisio_de_freitas`.

They are retained because the project is an archive of what polls actually contained at the time they were fielded. Removing or silently rewriting those historical rows would destroy provenance.

## 2nd-round scenario audit

The six current 2nd-round scenarios in `site/data/canonical-points-2nd-round.json` use only current presidential candidates:

- Augusto Cury × Flávio Bolsonaro
- Augusto Cury × Lula
- Flávio Bolsonaro × Lula
- Lula × Renan Santos
- Lula × Romeu Zema
- Lula × Ronaldo Caiado

No 2nd-round scenario uses Jair Bolsonaro.

## Files changed by this audit

- `site/js/candidates-config.js` — explicit current 2026 roster + canonical display names
- `site/js/chart.js` — uses canonical candidate display names and normalizes Flávio's accent
- `site/js/regional-chart.js` — applies the current-roster gate to regional points/legend
- `site/js/companion-chart.js` — uses canonical candidate display names
- `config/candidate_aliases.yml` — clarifies current vs historical identity notes
- `docs/candidate-audit-2026.md` — this audit record

## Important scope decision

This audit fixes **candidate identity and current-election presentation** without fabricating replacement poll cells. Historical poll data whose source labels need reconsideration are preserved until their primary witnesses can be checked individually.
