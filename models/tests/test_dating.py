from datetime import date

from pebr_models.dating import fieldwork_midpoint
from pebr_models.types import NationalPoll, poll_from_dict


def test_midpoint_odd_span():
    # 10..12 → mid 11
    assert fieldwork_midpoint(date(2026, 1, 10), date(2026, 1, 12)) == date(2026, 1, 11)


def test_midpoint_same_day():
    d = date(2026, 3, 15)
    assert fieldwork_midpoint(d, d) == d


def test_midpoint_even_span_floors():
    # 1..4 → delta 3 → mid = 1 + 1 = 2
    assert fieldwork_midpoint(date(2026, 1, 1), date(2026, 1, 4)) == date(2026, 1, 2)


def test_field_mid_uses_stored_mid():
    p = NationalPoll(
        poll_id="t",
        institute_id="i",
        fieldwork_start=date(2026, 1, 1),
        fieldwork_end=date(2026, 1, 10),
        fieldwork_mid=date(2026, 1, 3),  # explicit override
        scenario="s",
        sample_size=100,
        results={"a": 0.5},
    )
    assert p.field_mid == date(2026, 1, 3)


def test_field_mid_computes_when_null():
    p = poll_from_dict(
        {
            "poll_id": "t",
            "institute_id": "i",
            "fieldwork_start": "2026-01-10",
            "fieldwork_end": "2026-01-12",
            "fieldwork_mid": None,
            "geography": "national",
            "election_cycle": 2026,
            "scenario": "stimulated_1st_round",
            "sample_size": 1000,
            "results": {"a": 0.5},
            "residuals": {},
            "witness_ids": ["w1"],
            "dataset_version": "0",
        }
    )
    assert p.field_mid == date(2026, 1, 11)
