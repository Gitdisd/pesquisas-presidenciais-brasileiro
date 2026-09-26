"""Shared synthetic polls for Option B unit tests (not real Brazilian data)."""

from __future__ import annotations

from datetime import date, timedelta

import pytest

from pebr_models.types import NationalPoll


def _poll(
    poll_id: str,
    institute_id: str,
    mid: date,
    n: int,
    results: dict[str, float],
    *,
    span_days: int = 2,
) -> NationalPoll:
    half = span_days // 2
    start = mid - timedelta(days=half)
    end = mid + timedelta(days=span_days - half)
    return NationalPoll(
        poll_id=poll_id,
        institute_id=institute_id,
        fieldwork_start=start,
        fieldwork_end=end,
        fieldwork_mid=mid,
        scenario="stimulated_1st_round",
        sample_size=n,
        results=results,
        residuals={"ns_nr": 0.1},
        geography="national",
        election_cycle=2026,
        dataset_version="0.0.0-test",
        notes="SYNTHETIC test poll",
        witness_ids=(f"w_{poll_id}",),
    )


@pytest.fixture
def synthetic_polls() -> list[NationalPoll]:
    """Small multi-institute set spanning ~3 weeks for weight/flood/dating tests."""
    return [
        _poll(
            "ex_001",
            "inst_a",
            date(2026, 8, 1),
            1000,
            {"cand_x": 0.40, "cand_y": 0.30},
        ),
        _poll(
            "ex_002",
            "inst_b",
            date(2026, 8, 3),
            4000,
            {"cand_x": 0.35, "cand_y": 0.35},
        ),
        _poll(
            "ex_003",
            "inst_a",
            date(2026, 8, 5),
            1000,
            {"cand_x": 0.42, "cand_y": 0.28},
        ),
        _poll(
            "ex_004",
            "inst_c",
            date(2026, 8, 10),
            2000,
            {"cand_x": 0.38, "cand_y": 0.32},
        ),
        _poll(
            "ex_005",
            "inst_a",
            date(2026, 8, 12),
            9000,  # above n_cap → capped
            {"cand_x": 0.41, "cand_y": 0.29},
        ),
    ]
