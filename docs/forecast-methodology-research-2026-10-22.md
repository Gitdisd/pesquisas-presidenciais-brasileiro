# Research and implementation plan: polling-to-outcome calibration (2026-10-22)

## Findings from Brazilian and international evidence

- **Brazil-specific empirical baseline.** Meireles and Russo compared more than 2,000 pre-election polls from 2012–2020 across five Brazilian elections. Larger samples and fieldwork closer to election day tended to reduce error; presidential and second-round polling had lower error rates in the studied set. Their conclusion was that Brazilian polls performed broadly comparably to polls in other countries. Sources: [Estudos Avançados / USP](https://revistas.usp.br/eav/en/article/view/205985) and [SciELO full text](https://www.scielo.br/j/ea/a/HpJD5WZ485T56SmKkkwSbRz/?lang=pt).
- **United States, 2024.** AAPOR judged that publicly released polls largely captured a close national race; its evaluation also emphasized continued learning after the larger polling misses of 2016 and 2020. Polls are snapshots, not outcome guarantees. Sources: [AAPOR report announcement](https://aapor.org/announcements/2024-pre-election-polling-report/) and [AAPOR polling guidance](https://aapor.org/polling-accuracy/).
- **United Kingdom, 2024.** The British Polling Council reported that final polls tended to overstate Labour and understate the Conservatives. This is a clear example of common-mode error: several pollsters can agree and still miss in the same direction. Source: [British Polling Council](https://www.britishpollingcouncil.org/the-performance-of-the-polls-in-the-2024-general-election/).
- **France.** Historical analyses show that directional corrections are more defensible when signed error repeats across prior elections. If an error direction varies by election/round, a general correction can add noise. Sources: [France overview](https://www.pollingforecast.com/research/france-overview?lang=en) and [French polling error 1965–2024](https://www.pollingforecast.com/research/france-polling-error?lang=en).
- **Australia.** Published leave-one-election-out comparisons show corrections do not reliably improve every election; one recent comparison found the tested correction closer in two of seven elections and worse on average in five. That is a warning to test corrections out of sample, not to assume past miss directions will repeat. Source: [Australian poll accuracy](https://www.pollingforecast.com/au/accuracy?tab=summary).
- **Expert judgement versus poll averages.** A published comparison of 4,494 expert forecasts over three German federal elections found that experts were less accurate on average than the poll averages they were compared against. Complexity has to prove itself in testing. Source: [International Journal of Public Opinion Research](https://academic.oup.com/ijpor/article-abstract/36/1/edae002/7600008).

## What PEBR should estimate (three separate outputs)

1. **Nowcast:** where stated vote intention sits today, based on comparable polls.
2. **Election-day projection:** how that intention could move between latest fieldwork and voting day, including uncertainty about movement.
3. **Outcome probability:** probability of winning, published only after election-day errors and probability calibration have been validated on held-out elections.

The current Option B ribbon represents in-window poll dispersion. It is not a confidence interval for the electorate and not a win probability.

## Required data contract before advanced modelling

- Add a structured vote-basis field with values total_votes, valid_votes or unknown. Total-vote shares and valid-vote-only shares are different estimands and must not be averaged in the same series.
- Preserve scenario, question wording, fieldwork dates/midpoint, N, published MOE, mode, sample frame, likely-voter screen if stated, and source-witness links. Published MOE is not the full election-forecast error.
- Count each underlying poll once even if repeated by multiple news outlets. Track common samples/panels/tracking waves and dependence at the institute/panel level; reported N values are not automatically independent evidence.
- Preserve source rounding; do not silently normalize percentages or redistribute undecided voters.
- Treat house effects as relative differences between pollsters unless previous election outcomes establish a recurring poll-to-result bias. Disagreement with consensus is not proof of ballot error.

## Models to compare

| Model | Useful role | Failure mode | Production gate |
|---|---|---|---|
| Current Option B | Transparent trailing square-root-N average with institute anti-flood | Descriptive band; sensitive to mixed vote bases and shared errors | Keep as benchmark only after vote-basis separation |
| Equal-house robust consensus | Limits dominance by prolific pollsters | Few houses make median noisy; can discard informative house-level differences | Must beat Option B on whole-election holdouts |
| Robust poll-level model (Student-t/Huber) | Reduces influence of isolated outliers while keeping raw points visible | Can mistake a real shift for an outlier | Pre-set thresholds; visible diagnostics |
| Dynamic latent-margin model | Separates opinion movement from polling noise; estimates movement to election day | Sparse surveys make process-noise assumptions dominate | Held-out trajectory and interval-coverage test |
| Hierarchical house effect + common election error | Partially pools pollster effects and models shared polling error | Needs several harmonized elections to identify biases | No correction until out-of-sample gain is shown |
| Fundamentals / MRP | Potential extra signal from fundamentals or demographic cells | PEBR does not consistently have microdata or cell-level inputs for credible MRP | Out of production until source coverage supports it |

## Required backtest protocol

1. Harmonize poll archives with official outcomes by election, round, candidate, scenario, vote basis and cutoff date. Hold out one entire election at a time; never randomly split poll rows from the same election across train/test.
2. Rebuild what each model would have shown 30, 14, 7 and 1 day before each election. No later polls or held-out result may enter the fit.
3. Compare latest single poll, plain unweighted average, current Option B, equal-house consensus and candidate advanced models on identical cutoffs.
4. Report signed error, absolute error, MAE, RMSE and race-margin error. For probability models report Brier/log score and reliability/calibration; for intervals report actual 50/80/95% coverage and interval width.
5. Test by round, fieldwork recency, mode and vote basis. Only retain a correction when it consistently improves held-out elections.
6. Adjust effective information for shared institute/panel dependence; many highly correlated polls do not equal many independent samples.
7. Publish model version, cutoff, source coverage, missingness and reason for each change. Raw polls remain visible next to any adjusted estimate.

## Immediate improvements in this release

- Added exact X-axis start/end dates, manual or automatic Y ranges, an optional zero baseline, grid visibility, and X-only or X+Y zoom/pan; settings persist in shareable URLs.
- Default Y autoscale fits visible observations and aggregates with padding instead of anchoring at zero.
- The chart now offers separately selectable Option B √N, equal-poll mean, equal-institute mean, robust median and seven-day recency-weighted summaries. Raw polling dots remain visible.
- Added optional, second-round-only persistence and seven-day linear-trend extensions through 25 October 2026. They are disabled by default and are explicitly uncalibrated illustrative extrapolations, not winner probabilities.

## Brazil-specific vote tally and denominator handling (2026-10-23)

Under [Law 9,504/1997, Article 2](https://www.planalto.gov.br/ccivil_03/leis/l9504compilado.htm), the presidential result uses valid candidate votes; blank and null votes are excluded from that denominator and do not transfer to candidates. The [TSE explains that blank/null votes do not cancel an election](https://www.tse.jus.br/comunicacao/noticias/2026/Setembro/faltam-17-dias-votos-nulos-e-brancos-nao-anulam-a-eleicao). A first round and runoff are distinct elections. Voter-roll cancellation/suspension and unpaid fines are not equivalent: see the [TSE voting-status guidance](https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral#/).

- National and regional poll schemas and canonical point records now have a `vote_basis` field with `total_votes`, `valid_votes`, or `unknown`.
- The basis defaults to unknown; it is not inferred from rounded values summing to 100%. Three recent second-round source records with documented total-vote basis have been tagged explicitly. Historical unverified records remain unknown.
- A separately plotted **Branco / Nulo (conforme publicado)** series is emitted only if the poll reports combined `branco_nulo`, or both `branco` and `nulo`. Missing residual values are not filled with zero. The line represents the poll's published response category; it is not necessarily identical to the eventual official TSE blank/null tally.
- The current descriptive aggregate does not automatically convert every survey to valid-vote shares. Unknown denominators are disclosed, not silently normalized. A complete historical denominator audit is still required before claiming outcome calibration.
- NS/NR / undecided, abstention, blank/null, voter-roll ineligibility and unpaid fines remain separate concepts. No candidate-specific fine penalty, inferred voting preference among non-voters, proportional undecided redistribution or automatic runoff transfer is applied.

## Research and model-selection rationale

Brazil evidence: Meireles & Russo reviewed over 2,000 pre-election polls across five elections (2012–2020); within that sample, larger samples and fieldwork closer to election day tended to be associated with lower errors ([Estudos Avançados / USP](https://revistas.usp.br/eav/en/article/view/205985)). This supports transparent sample/recency rules, not a guarantee that the largest or latest poll is right.

International evidence:
- UK 2024 polling evaluations documented a common-direction miss across pollsters, showing correlated polling error can remain even when pollsters largely agree ([British Polling Council](https://www.britishpollingcouncil.org/the-performance-of-the-polls-in-the-2024-general-election/)).
- A leave-one-election-out evaluation of an Australian historical error correction found that it improved on the plain polling baseline in only two of seven elections, cautioning against assuming past directional corrections will generalize ([Polling Forecast Australia](https://www.pollingforecast.com/au/accuracy?tab=summary)).
- The US AAPOR 2024 review emphasizes survey-level interpretation and methodological evaluation rather than treating a poll or average as a guaranteed result ([AAPOR](https://aapor.org/announcements/2024-pre-election-polling-report/)).

## Required calibration gate

Before publishing an outcome-calibrated forecast or win probability, perform whole-election holdouts using only data available at each historical forecast date: 30, 14, 7 and 1 days before election day. Report candidate-share MAE/RMSE, signed error, vote-margin error and empirical interval coverage. For any probabilistic model, additionally report Brier/log scores and reliability calibration. Preserve election-level common error and pollster/house effects only where historical data support estimation. Avoid MRP without suitable individual/area-level inputs. Do not treat the first-round result as a second-round voter-transfer matrix.

Implementation details, UI controls and the remaining denominator/backtest work are documented in [docs/brazilian-tally-and-model-switches-2026-10-23.md](brazilian-tally-and-model-switches-2026-10-23.md).
