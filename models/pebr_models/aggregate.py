"""Option B: √N-weighted trailing window + same-institute anti-flood.

No house-effect shifts. Scenario-locked. Gap policy v1: omit empty days.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Iterable, Optional, Sequence

from .types import NationalPoll
from .uncertainty import dispersion_band, weighted_sd
from .weights import (
    FLOOD_W_DAYS,
    K_DAYS,
    N_CAP,
    N_REF,
    WeightParams,
    poll_weight,
)


@dataclass(frozen=True)
class OptionBParams:
    k_days: int = K_DAYS
    flood_w_days: int = FLOOD_W_DAYS
    n_cap: int = N_CAP
    n_ref: float = N_REF

    def weight_params(self) -> WeightParams:
        return WeightParams(
            n_cap=self.n_cap,
            n_ref=self.n_ref,
            flood_w_days=self.flood_w_days,
        )

    def as_dict(self) -> dict:
        return {
            "k_days": self.k_days,
            "flood_W_days": self.flood_w_days,
            "n_cap": self.n_cap,
            "unit": "fraction",
        }


MODEL_ID = "option_b_sqrt_n_trailing"

BAND_MEANING = (
    "Option B in-window dispersion (not classical CI, not win probability)"
)


@dataclass(frozen=True)
class AggregatePoint:
    day: date
    scenario: str
    candidate_id: str
    value: float  # fraction 0–1
    band_low: float
    band_high: float
    n_polls: int


def _filter_polls(polls: Sequence[NationalPoll]) -> list[NationalPoll]:
    return [p for p in polls if not p.geography or p.geography == "national"]


def window_polls(
    polls: Sequence[NationalPoll],
    day: date,
    scenario: str,
    k_days: int,
) -> list[NationalPoll]:
    """Polls with field_mid in (day − k, day] and identical scenario string."""
    lo = day - timedelta(days=k_days)
    return [p for p in polls if p.scenario == scenario and lo < p.field_mid <= day]


def candidate_ids_in(polls: Iterable[NationalPoll]) -> list[str]:
    seen: set[str] = set()
    ordered: list[str] = []
    for p in polls:
        for cid in p.results:
            if cid not in seen:
                seen.add(cid)
                ordered.append(cid)
    return ordered


def aggregate_day_candidate(
    day_polls: Sequence[NationalPoll],
    day: date,
    candidate_id: str,
    scenario: str,
    params: OptionBParams,
) -> Optional[AggregatePoint]:
    """Weighted mean + dispersion band for one candidate on one day. None if empty."""
    if not day_polls:
        return None
    usable = [p for p in day_polls if candidate_id in p.results]
    if not usable:
        return None
    wp = params.weight_params()
    weights = [poll_weight(p, day_polls, day, wp) for p in usable]
    values = [float(p.results[candidate_id]) for p in usable]
    total_w = sum(weights)
    if total_w <= 0:
        return None
    mean = sum(w * v for w, v in zip(weights, values)) / total_w
    sd = weighted_sd(values, weights)
    lo, hi = dispersion_band(mean, sd)
    return AggregatePoint(
        day=day,
        scenario=scenario,
        candidate_id=candidate_id,
        value=mean,
        band_low=lo,
        band_high=hi,
        n_polls=len(usable),
    )


def _date_range(start: date, end: date) -> list[date]:
    if end < start:
        return []
    out: list[date] = []
    d = start
    while d <= end:
        out.append(d)
        d += timedelta(days=1)
    return out


def aggregate_option_b(
    polls: Sequence[NationalPoll],
    params: OptionBParams | None = None,
    day_from: date | None = None,
    day_to: date | None = None,
) -> list[AggregatePoint]:
    """Compute Option B aggregate points for all scenarios × candidates × days.

    Gap policy v1: if the trailing window is empty for (day, scenario), that day
    is omitted (no carry-forward). No house-effect adjustments.
    """
    params = params or OptionBParams()
    filtered = _filter_polls(polls)
    if not filtered:
        return []

    scenarios = sorted({p.scenario for p in filtered})
    mids = [p.field_mid for p in filtered]
    d0 = day_from or min(mids)
    d1 = day_to or max(mids)

    results: list[AggregatePoint] = []
    for scenario in scenarios:
        scen_polls = [p for p in filtered if p.scenario == scenario]
        if not scen_polls:
            continue
        cands = candidate_ids_in(scen_polls)
        for day in _date_range(d0, d1):
            wp = window_polls(scen_polls, day, scenario, params.k_days)
            if not wp:
                continue
            for cid in cands:
                pt = aggregate_day_candidate(wp, day, cid, scenario, params)
                if pt is not None:
                    results.append(pt)
    return results
