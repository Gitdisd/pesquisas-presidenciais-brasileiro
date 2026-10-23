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

- Added exact X-axis start/end dates, manual or automatic Y-axis bounds, an optional zero baseline, grid toggle and choice of X-only or X+Y zoom/pan.
- The default Y axis now fits visible points and aggregate values with padding instead of anchoring at zero, reducing the flattened-trend problem. The user can restore zero; truncated axes must always show actual limits because they magnify small movements.
- Axis settings are encoded in shareable URLs.
- Option B remains the reference model. No unvalidated winner probability was added.

## Material limitation and next step

The canonical schema currently lacks a structured vote-basis field carried through raw intake, canonical points and chart rows. Some historical records are valid-vote estimates while others are total-vote estimates. Until records are tagged and series separated, the current aggregate must not be described as an outcome-calibrated prediction. Implement vote basis through schema, intake, assembler, Python model and UI first, then run the historical holdout plan above.
