"""Anti-flood: multiple same-institute polls in W days share √(1/m) factor."""

from datetime import date

import pytest

from pebr_models.weights import (
    WeightParams,
    count_institute_in_window,
    flood_factor,
    poll_weight,
    size_weight,
)


def test_count_institute_in_window(synthetic_polls):
    # On 2026-08-12, inst_a polls at Aug 1, 5, 12 → 3 within 14d window
    as_of = date(2026, 8, 12)
    m = count_institute_in_window(synthetic_polls, "inst_a", as_of, flood_w_days=14)
    assert m == 3


def test_count_excludes_outside_window(synthetic_polls):
    # Narrow W=3 from Aug 12: only Aug 12 (Aug 10 is c, Aug 5 is >3d away)
    as_of = date(2026, 8, 12)
    m = count_institute_in_window(synthetic_polls, "inst_a", as_of, flood_w_days=3)
    assert m == 1


def test_poll_weight_applies_flood(synthetic_polls):
    as_of = date(2026, 8, 12)
    params = WeightParams(flood_w_days=14)
    # window = all synthetic (they fit in 14d from Aug 12: Aug 1 is exactly 11d before)
    window = [p for p in synthetic_polls if p.field_mid <= as_of]
    a_polls = [p for p in window if p.institute_id == "inst_a"]
    assert len(a_polls) == 3
    m = 3
    for p in a_polls:
        w = poll_weight(p, window, as_of, params)
        expected = size_weight(p.sample_size, params) * flood_factor(m)
        assert w == pytest.approx(expected)


def test_single_institute_no_flood_penalty(synthetic_polls):
    as_of = date(2026, 8, 3)
    # Only inst_a Aug1 + inst_b Aug3 in early window — inst_b appears once
    window = [p for p in synthetic_polls if p.field_mid <= as_of]
    b = next(p for p in window if p.institute_id == "inst_b")
    w = poll_weight(b, window, as_of, WeightParams())
    assert w == pytest.approx(size_weight(b.sample_size))
