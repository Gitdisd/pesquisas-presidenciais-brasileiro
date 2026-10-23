# Brazilian tally and toggleable polling models — 2026-10-23

## Product contract

1. The chart's primary purpose is to display individual published polls. Changing a method changes the summary line, not the observations.
2. Branco/Nulo is a distinct reported poll-response category. It is plotted only when the survey publishes a combined share or both separate categories.
3. Every poll's share denominator is metadata: `total_votes`, `valid_votes`, or `unknown`. Unknown stays unknown. This is an auditability step, not proof that the archive is fully harmonized.
4. Forecast extensions are optional, second-round-only, off by default and shown dashed. They are exploratory extrapolations, not calibrated win probabilities.
5. Turnout, voter-registration eligibility, abstention, undecided answers and vote transfers must be modelled separately where suitable evidence exists.

## Brazilian tally

The president is elected by an absolute majority of valid votes. Blank and null votes are recorded but excluded from valid candidate votes; they do not transfer to candidates. If no candidate reaches the required majority in the first round, the two candidates with the highest vote totals advance to a separate runoff. Official references: [Law 9,504/1997, Article 2](https://www.planalto.gov.br/ccivil_03/leis/l9504compilado.htm) and [TSE: blank/null votes do not cancel an election](https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/faltam-17-dias-votos-nulos-e-brancos-nao-anulam-a-eleicao).

Keep these concepts separate:
- **Branco/Nulo:** the source's published combined category, or a sum only when both separate categories are published.
- **NS/NR / undecided:** a distinct residual; do not automatically allocate it to a candidate.
- **Abstention / non-turnout:** a person who does not cast a ballot, not a blank/null vote.
- **Ineligible registration:** a cancelled or suspended electoral title is distinct from an unpaid fine. Aggregate data cannot reveal the candidate preference of a non-voter.

The live Branco/Nulo line uses the poll's reported value. It is not an official TSE blank/null count and might represent a source-specific response category. The site never fills an absent Branco/Nulo value with zero.

## Vote basis

The raw poll schema, regional schema, canonical assembler, canonical point data and Python poll type now carry `vote_basis` with three permitted values:
- `total_votes`
- `valid_votes`
- `unknown`

Basis defaults to unknown and is not inferred by checking whether rounded shares sum to approximately 100%. Three recently reviewed second-round records (Datafolha 22 October, Quaest 20 October and AtlasIntel 3–8 October) have been marked total-vote basis. Other historic observations remain unknown until the original source's table or methodological note is audited. In the 267 second-round records currently in the canonical archive, 3 are explicitly marked `total_votes` and 264 remain `unknown`; none should be silently promoted to a known basis.

**Implemented denominator control:** the live second-round chart now offers `Percentuais publicados` and `Candidatos = 100% (normalizado)`. The latter recalculates each complete poll as each finalist's reported share divided by the sum of the two finalists' reported shares. It retains the published value in the point detail, omits Branco/Nulo from the normalized chart view rather than reallocating it, and excludes polls without both finalist values. This is an arithmetic visualization, not evidence that blank/null voters will transfer, not a turnout adjustment, and not a calibrated valid-vote forecast.

**Remaining limitation:** the default published-percentage view intentionally leaves values as published, and the historical aggregate should not be read as a common valid-vote denominator while most source bases are unknown. No candidate-specific penalty is inferred from unpaid fines, and no first-round vote is automatically transferred to a second-round candidate.

## Methods now selectable in the live UI

| Control | Computation | What it does not claim |
|---|---|---|
| Option B · √N | Existing trailing window, square-root sample-size weights, institute anti-flood rule | Not a confidence interval or calibrated prediction |
| Média simples | Equal weight per poll | Frequent pollsters can have greater collective influence |
| Igual por instituto | Average within each pollster, then equal weights per institute | Does not correct shared samples or common-mode errors |
| Mediana robusta | Median poll value in the trailing window | May lag genuine rapid changes; dispersion is descriptive |
| Recência · 7d | Option B weights with an extra seven-day half-life | Not an empirically calibrated election model |
| Persistência | Extends the last available aggregate through 25 October 2026 | Assumes no further aggregate movement |
| Tendência linear · 7d | Fits a short trend over the recent seven days and extrapolates through 25 October 2026 | Short-term trends can reverse and are not probabilistic |

Option B remains the default aggregation. Raw polling points remain present when selecting other summaries. The denominator selector is separate from the aggregation selector: the published view preserves source values (and the reported Branco/Nulo series), while the optional candidate-only view recalculates candidate shares within each complete poll. The chart also includes dated survey context for runoff intentions among the combined first-round absent/blank/null cohort and motivations among respondents intending blank/null/none in the runoff; these are different questions and populations and are not pooled into a synthetic transfer rate. The two forward extensions apply only to the second-round view and are disabled by default. They remain exploratory, not calibrated probabilities, and do not estimate turnout, eligibility, undecided transfers, pollster house effects or correlated election-level errors.

## International methodology findings

- **Brazil:** Meireles & Russo reviewed more than 2,000 pre-election polls across five elections from 2012–2020. In that historical sample, larger samples and fieldwork closer to election day tended to be associated with lower error. This motivates explicit sample/recency rules but does not ensure the latest or largest poll will be closest to the result. [Estudos Avançados / USP](https://revistas.usp.br/eav/en/article/view/205985)
- **United Kingdom, 2024:** public final polls showed a shared-direction miss for Labour and the Conservatives, illustrating that pollsters can agree with one another yet share common error. [British Polling Council](https://www.britishpollingcouncil.org/the-performance-of-the-polls-in-the-2024-general-election/)
- **Australia:** an assessed historical directional correction improved on the plain-poll baseline in only two of seven leave-one-election-out tests; the researchers caution against applying a generic correction just because a past miss had a direction. [Polling Forecast Australia](https://www.pollingforecast.com/au/accuracy?tab=summary)
- **United States, 2024:** AAPOR's review emphasizes evaluating the full survey record rather than treating polling averages as outcome guarantees. [AAPOR](https://aapor.org/announcements/2024-pre-election-polling-report/)

## Backtesting gate before probabilities

Use whole-election holdouts. At each historic election, recreate only the polling information available 30, 14, 7 and 1 days before election day. Report signed error, MAE, RMSE, candidate-margin error and empirical interval coverage. For any probabilistic model, additionally report Brier/log scores and reliability calibration. Account for pollster/house effects and correlated election-wide error only if there is sufficient historical data to estimate them. Avoid MRP without appropriate individual/area-level inputs. No winner probability should be published until denominator/source audits and those backtests pass.
