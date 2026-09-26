"""Descriptive uncertainty = weighted SD of in-window polls (dispersion, not win prob)."""

from __future__ import annotations

import math
from typing import Sequence


def weighted_sd(values: Sequence[float], weights: Sequence[float]) -> float:
    """√ Σ w̃_i (x_i − μ)² with w̃ = w / Σw. Returns 0.0 if fewer than 2 points."""
    if len(values) < 2 or len(values) != len(weights):
        return 0.0
    total = sum(weights)
    if total <= 0:
        return 0.0
    mu = sum(w * x for w, x in zip(weights, values)) / total
    var = sum((w / total) * (x - mu) ** 2 for w, x in zip(weights, values))
    return math.sqrt(max(var, 0.0))


def dispersion_band(mean: float, sd: float) -> tuple[float, float]:
    """Return (band_low, band_high) clipped to [0, 1] around mean ± sd."""
    lo = max(0.0, mean - sd)
    hi = min(1.0, mean + sd)
    return lo, hi
