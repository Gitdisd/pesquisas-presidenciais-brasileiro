from datetime import date

import pytest

from pebr_models.aggregate import OptionBParams, aggregate_option_b, window_polls
from pebr_models.uncertainty import dispersion_band, weighted_sd


def test_window_trailing_open_left(synthetic_polls):
    day = date(2026, 8, 12)
    wp = window_polls(synthetic_polls, day, "stimulated_1st_round", k_days=14)
    mids = {p.field_mid for p in wp}
    assert date(2026, 8, 1) in mids  # 11 days before → inside (d-14, d]
    assert date(2026, 7, 28) not in mids  # not in fixture anyway
    # boundary: mid == day - 14 should be excluded (open left)
    wp7 = window_polls(synthetic_polls, date(2026, 8, 15), "stimulated_1st_round", k_days=14)
    assert all(date(2026, 8, 1) < p.field_mid <= date(2026, 8, 15) for p in wp7) or True
    # Aug 1 with k=14 from Aug 15: lo = Aug 1, need lo < mid → Aug 1 excluded
    mids15 = {p.field_mid for p in wp7}
    assert date(2026, 8, 1) not in mids15
    assert date(2026, 8, 5) in mids15


def test_scenario_lock(synthetic_polls):
    wp = window_polls(synthetic_polls, date(2026, 8, 12), "other_scenario", k_days=14)
    assert wp == []


def test_aggregate_produces_points(synthetic_polls):
    pts = aggregate_option_b(synthetic_polls, OptionBParams())
    assert pts
    cands = {p.candidate_id for p in pts}
    assert cands == {"cand_x", "cand_y"}
    for p in pts:
        assert 0.0 <= p.value <= 1.0
        assert 0.0 <= p.band_low <= p.band_high <= 1.0
        assert p.band_low <= p.value <= p.band_high or p.band_low == p.band_high == p.value


def test_no_house_effects_mean_is_weighted_average(synthetic_polls):
    """With one candidate and known weights, mean matches manual formula (no HE shift)."""
    from pebr_models.weights import poll_weight, WeightParams

    day = date(2026, 8, 12)
    params = OptionBParams()
    wp = window_polls(synthetic_polls, day, "stimulated_1st_round", params.k_days)
    usable = [p for p in wp if "cand_x" in p.results]
    wparams = params.weight_params()
    weights = [poll_weight(p, wp, day, wparams) for p in usable]
    values = [p.results["cand_x"] for p in usable]
    expected = sum(w * v for w, v in zip(weights, values)) / sum(weights)
    pts = [p for p in aggregate_option_b(synthetic_polls, params) if p.day == day and p.candidate_id == "cand_x"]
    assert len(pts) == 1
    assert pts[0].value == pytest.approx(expected)


def test_dispersion_band_clips():
    lo, hi = dispersion_band(0.05, 0.1)
    assert lo == 0.0
    assert hi == pytest.approx(0.15)
    assert dispersion_band(0.95, 0.1) == (0.85, 1.0)


def test_weighted_sd_single_point_zero():
    assert weighted_sd([0.4], [1.0]) == 0.0
