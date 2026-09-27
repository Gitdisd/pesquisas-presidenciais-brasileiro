from pathlib import Path

from pebr_models.export import build_chart_export, write_chart_json
from pebr_models.types import load_fixture_envelope, load_polls, poll_from_dict


REPO = Path(__file__).resolve().parents[2]
FIXTURE = REPO / "fixtures" / "national" / "example_polls_synthetic.json"
EXAMPLE_POLL = REPO / "fixtures" / "national" / "EXAMPLE_poll.json"


def test_fixture_matches_schema_shape():
    polls, meta = load_fixture_envelope(str(FIXTURE))
    assert meta.get("example") is True
    assert len(polls) >= 3
    for p in polls:
        assert p.geography == "national"
        assert p.poll_id.startswith("example_")
        assert all(0 <= v <= 1 for v in p.results.values())


def test_single_example_poll_loads():
    import json

    d = json.loads(EXAMPLE_POLL.read_text(encoding="utf-8"))
    p = poll_from_dict(d)
    assert p.poll_id.startswith("example_")
    assert p.field_mid is not None


def test_chart_export_flat_series_kinds(synthetic_polls):
    doc = build_chart_export(synthetic_polls, example=True)
    assert doc["unit"] == "fraction"
    assert doc["model_id"] == "option_b_sqrt_n_trailing"
    assert doc["example"] is True
    kinds = {s["series_kind"] for s in doc["series"]}
    assert kinds == {"poll", "aggregate", "uncertainty"}
    for s in doc["series"]:
        assert "date" in s and "candidate_id" in s
        if s["series_kind"] == "poll":
            assert "institute_id" in s and "poll_id" in s and "n" in s
            assert "value" in s
        elif s["series_kind"] == "aggregate":
            assert "value" in s
        elif s["series_kind"] == "uncertainty":
            assert "band_low" in s and "band_high" in s


def test_write_chart_from_synthetic_fixture(tmp_path):
    polls, meta = load_fixture_envelope(str(FIXTURE))
    doc = build_chart_export(polls, example=True, meta=meta)
    out = tmp_path / "chart.json"
    write_chart_json(doc, out)
    assert out.exists()
    import json

    loaded = json.loads(out.read_text(encoding="utf-8"))
    assert loaded["params"]["k_days"] == 14
    assert loaded["band_meaning"]
    assert any(s["series_kind"] == "uncertainty" for s in loaded["series"])


def test_scenario_filter_rejects_unknown(synthetic_polls):
    import pytest

    with pytest.raises(ValueError, match="not found"):
        build_chart_export(synthetic_polls, scenario="no_such_scenario")


def test_multi_scenario_runs_pairwise_not_merged():
    from datetime import date, timedelta

    from pebr_models.export import build_multi_scenario_chart_export, matchup_label
    from pebr_models.types import NationalPoll

    def _p(pid, scen, mid, results):
        return NationalPoll(
            poll_id=pid,
            institute_id="inst_a",
            fieldwork_start=mid - timedelta(days=1),
            fieldwork_end=mid + timedelta(days=1),
            fieldwork_mid=mid,
            scenario=scen,
            sample_size=2000,
            results=results,
            geography="national",
            election_cycle=2026,
            dataset_version="0.0.0-test",
            notes="SYNTHETIC",
        )

    mid = date(2026, 9, 18)
    polls = [
        _p(
            "p1",
            "stimulated_2nd_round_cand_a_vs_cand_b",
            mid,
            {"cand_a": 0.40, "cand_b": 0.45},
        ),
        _p(
            "p2",
            "stimulated_2nd_round_cand_a_vs_cand_c",
            mid,
            {"cand_a": 0.50, "cand_c": 0.30},
        ),
    ]
    doc = build_multi_scenario_chart_export(polls, example=True)
    assert doc["round"] == "2nd"
    assert len(doc["scenarios"]) == 2
    ids = [b["scenario"] for b in doc["scenarios"]]
    assert ids == sorted(ids)
    # Each block only contains its own candidates — no blind merge.
    by = {b["scenario"]: b for b in doc["scenarios"]}
    cands_ab = {c["id"] for c in by["stimulated_2nd_round_cand_a_vs_cand_b"]["candidates"]}
    cands_ac = {c["id"] for c in by["stimulated_2nd_round_cand_a_vs_cand_c"]["candidates"]}
    assert cands_ab == {"cand_a", "cand_b"}
    assert cands_ac == {"cand_a", "cand_c"}
    poll_rows_ab = [
        s
        for s in by["stimulated_2nd_round_cand_a_vs_cand_b"]["series"]
        if s["series_kind"] == "poll"
    ]
    assert all(s["candidate_id"] in cands_ab for s in poll_rows_ab)
    assert "×" in matchup_label("stimulated_2nd_round_cand_a_vs_cand_b")


def test_build_chart_export_requires_scenario_when_many():
    import pytest
    from datetime import date, timedelta

    from pebr_models.types import NationalPoll

    mid = date(2026, 9, 18)

    def _p(pid, scen):
        return NationalPoll(
            poll_id=pid,
            institute_id="inst_a",
            fieldwork_start=mid,
            fieldwork_end=mid,
            fieldwork_mid=mid,
            scenario=scen,
            sample_size=1000,
            results={"x": 0.5, "y": 0.4},
            geography="national",
            election_cycle=2026,
        )

    polls = [
        _p("a", "stimulated_2nd_round_a_vs_b"),
        _p("b", "stimulated_2nd_round_a_vs_c"),
    ]
    with pytest.raises(ValueError, match="multiple scenarios"):
        build_chart_export(polls)
    doc = build_chart_export(polls, scenario="stimulated_2nd_round_a_vs_b")
    assert doc["scenario"] == "stimulated_2nd_round_a_vs_b"
