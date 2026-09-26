"""Option B weights: √min(n, n_cap) size weight × √(1/m) institute flood factor."""

from __future__ import annotations

import math
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Iterable, Optional, Sequence

from .types import NationalPoll

# Published constants (see docs/methodology-aggregate-option-b.md)
K_DAYS = 14
FLOOD_W_DAYS = 14
N_CAP = 4000
N_REF = 2000  # fixed reference inside √(min(n,cap)/n_ref); then renormalize in aggregate


@dataclass(frozen=True)
class WeightParams:
    n_cap: int = N_CAP
    n_ref: float = N_REF
    flood_w_days: int = FLOOD_W_DAYS


def size_weight(sample_size: Optional[int], params: WeightParams | None = None) -> float:
    """√(min(n, n_cap) / n_ref). If sample_size is None/≤0 → 1.0 (equal-weight fallback)."""
    p = params or WeightParams()
    if sample_size is None or sample_size <= 0:
        return 1.0
    capped = min(float(sample_size), float(p.n_cap))
    return math.sqrt(capped / float(p.n_ref))


def flood_factor(m: int) -> float:
    """√(1/m) for m ≥ 1 same-institute polls in the flood window; m≤1 → 1.0."""
    if m <= 1:
        return 1.0
    return math.sqrt(1.0 / float(m))


def count_institute_in_window(
    polls: Sequence[NationalPoll],
    institute_id: str,
    as_of: date,
    flood_w_days: int = FLOOD_W_DAYS,
) -> int:
    """Count polls from institute_id with field_mid in (as_of − W, as_of]."""
    lo = as_of - timedelta(days=flood_w_days)
    n = 0
    for poll in polls:
        if poll.institute_id != institute_id:
            continue
        t = poll.field_mid
        if lo < t <= as_of:
            n += 1
    return n


def poll_weight(
    poll: NationalPoll,
    window_polls: Sequence[NationalPoll],
    as_of: date,
    params: WeightParams | None = None,
) -> float:
    """Combined size × flood weight for one poll inside day ``as_of``'s aggregate window."""
    p = params or WeightParams()
    w_size = size_weight(poll.sample_size, p)
    m = count_institute_in_window(window_polls, poll.institute_id, as_of, p.flood_w_days)
    return w_size * flood_factor(m)


def normalize(weights: Iterable[float]) -> list[float]:
    ws = list(weights)
    total = sum(ws)
    if total <= 0:
        n = len(ws)
        return [1.0 / n] * n if n else []
    return [w / total for w in ws]
