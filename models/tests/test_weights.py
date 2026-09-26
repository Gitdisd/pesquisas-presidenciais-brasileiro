import math

import pytest

from pebr_models.weights import N_CAP, N_REF, WeightParams, flood_factor, size_weight


def test_size_weight_sqrt_n():
    w = size_weight(2000)
    assert w == pytest.approx(math.sqrt(2000 / N_REF))


def test_size_weight_caps_at_n_cap():
    w_big = size_weight(50_000)
    w_cap = size_weight(N_CAP)
    assert w_big == w_cap
    assert w_big == pytest.approx(math.sqrt(N_CAP / N_REF))


def test_size_weight_missing_n_is_one():
    assert size_weight(None) == 1.0
    assert size_weight(0) == 1.0


def test_size_weight_custom_params():
    p = WeightParams(n_cap=1000, n_ref=1000.0)
    assert size_weight(1000, p) == pytest.approx(1.0)
    assert size_weight(4000, p) == pytest.approx(1.0)  # capped


def test_flood_factor():
    assert flood_factor(1) == 1.0
    assert flood_factor(0) == 1.0
    assert flood_factor(4) == pytest.approx(0.5)
    assert flood_factor(2) == pytest.approx(math.sqrt(0.5))
