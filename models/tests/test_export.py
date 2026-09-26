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
