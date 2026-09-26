"""Export Option B series to Research UI ``site/data/chart.json`` (flat series rows)."""

from __future__ import annotations

import json
from datetime import date, datetime
from pathlib import Path
from typing import Any, Mapping, Sequence
from zoneinfo import ZoneInfo

from .aggregate import (
    BAND_MEANING,
    MODEL_ID,
    AggregatePoint,
    OptionBParams,
    aggregate_option_b,
)
from .types import NationalPoll, V1_EMITTED_KINDS

SP_TZ = ZoneInfo("America/Sao_Paulo")

# Default EXAMPLE display metadata (synthetic only).
_DEFAULT_CANDIDATE_COLORS = {
    "example_candidate_a": "#5B8CFF",
    "example_candidate_b": "#FF6B6B",
    "example_candidate_c": "#4ECDC4",
    "example_candidate_d": "#F7B731",
}
_DEFAULT_CANDIDATE_LABELS = {
    "example_candidate_a": "Candidato A",
    "example_candidate_b": "Candidato B",
    "example_candidate_c": "Candidato C",
    "example_candidate_d": "Candidato D",
}
_DEFAULT_INSTITUTE_LABELS = {
    "example_institute": "Instituto Exemplo (sintético)",
    "example_institute_alpha": "Instituto Alpha (exemplo)",
    "example_institute_beta": "Instituto Beta (exemplo)",
    "example_institute_gamma": "Instituto Gamma (exemplo)",
}


def _ymd(d: date) -> str:
    return d.isoformat()


def _round4(x: float) -> float:
    return round(float(x), 4)


def polls_as_flat_rows(polls: Sequence[NationalPoll]) -> list[dict[str, Any]]:
    """Emit flat series_kind=poll rows dated at field_mid (fractions 0–1)."""
    rows: list[dict[str, Any]] = []
    for p in sorted(polls, key=lambda x: (x.field_mid, x.poll_id)):
        for cid, frac in p.results.items():
            rows.append(
                {
                    "series_kind": "poll",
                    "date": _ymd(p.field_mid),
                    "candidate_id": cid,
                    "value": _round4(frac),
                    "institute_id": p.institute_id,
                    "poll_id": p.poll_id,
                    "n": p.sample_size,
                }
            )
    return rows


def aggregate_as_flat_rows(
    points: Sequence[AggregatePoint],
    *,
    include_uncertainty: bool = True,
) -> list[dict[str, Any]]:
    """Emit flat aggregate (+ optional uncertainty) rows."""
    rows: list[dict[str, Any]] = []
    for pt in sorted(points, key=lambda x: (x.day, x.candidate_id)):
        rows.append(
            {
                "series_kind": "aggregate",
                "date": _ymd(pt.day),
                "candidate_id": pt.candidate_id,
                "value": _round4(pt.value),
            }
        )
        if include_uncertainty:
            rows.append(
                {
                    "series_kind": "uncertainty",
                    "date": _ymd(pt.day),
                    "candidate_id": pt.candidate_id,
                    "band_low": _round4(pt.band_low),
                    "band_high": _round4(pt.band_high),
                }
            )
    return rows


def _derive_candidates(
    polls: Sequence[NationalPoll],
    meta_candidates: Sequence[Mapping[str, Any]] | None,
) -> list[dict[str, Any]]:
    if meta_candidates:
        return [dict(c) for c in meta_candidates]
    seen: list[str] = []
    for p in polls:
        for cid in p.results:
            if cid not in seen:
                seen.append(cid)
    out = []
    for i, cid in enumerate(seen):
        out.append(
            {
                "id": cid,
                "label": _DEFAULT_CANDIDATE_LABELS.get(cid, cid),
                "color": _DEFAULT_CANDIDATE_COLORS.get(
                    cid, ["#5B8CFF", "#FF6B6B", "#4ECDC4", "#F7B731", "#A78BFA"][i % 5]
                ),
            }
        )
    return out


def _derive_institutes(
    polls: Sequence[NationalPoll],
    meta_institutes: Sequence[Mapping[str, Any]] | None,
) -> list[dict[str, Any]]:
    if meta_institutes:
        return [dict(i) for i in meta_institutes]
    seen: list[str] = []
    for p in polls:
        if p.institute_id not in seen:
            seen.append(p.institute_id)
    return [
        {
            "id": iid,
            "label": _DEFAULT_INSTITUTE_LABELS.get(iid, iid),
        }
        for iid in seen
    ]


def build_chart_export(
    polls: Sequence[NationalPoll],
    params: OptionBParams | None = None,
    *,
    include_uncertainty: bool = True,
    example: bool = True,
    note: str | None = None,
    meta: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
    """Build the Research UI chart document (flat series, unit=fraction)."""
    params = params or OptionBParams()
    meta = dict(meta or {})
    filtered = [p for p in polls if not p.geography or p.geography == "national"]
    if not filtered:
        raise ValueError("no national polls to aggregate")

    scenarios = sorted({p.scenario for p in filtered})
    # UI currently expects a single top-level scenario; prefer meta or majority.
    scenario = meta.get("scenario") or scenarios[0]
    scenario_polls = [p for p in filtered if p.scenario == scenario]
    if not scenario_polls:
        scenario_polls = filtered
        scenario = scenarios[0]

    agg_points = aggregate_option_b(scenario_polls, params)
    series: list[dict[str, Any]] = []
    series.extend(polls_as_flat_rows(scenario_polls))
    series.extend(
        aggregate_as_flat_rows(agg_points, include_uncertainty=include_uncertainty)
    )

    for s in series:
        if s["series_kind"] not in V1_EMITTED_KINDS:
            raise ValueError(f"v1 must not emit series_kind={s['series_kind']!r}")

    mids = [p.field_mid for p in scenario_polls]
    if agg_points:
        d_start = min(min(mids), min(pt.day for pt in agg_points))
        d_end = max(max(mids), max(pt.day for pt in agg_points))
    else:
        d_start, d_end = min(mids), max(mids)

    now = datetime.now(SP_TZ)
    is_example = bool(meta.get("example", example))
    default_note = (
        "EXAMPLE / dados de exemplo — sintético. Não são pesquisas reais. "
        "Option B (√N trailing ~14d + anti-flood); unit=fraction; "
        "band_low/band_high = in-window dispersion."
    )
    doc: dict[str, Any] = {
        "schema_version": 1,
        "model_id": MODEL_ID,
        "unit": "fraction",
        "params": params.as_dict(),
        "band_meaning": BAND_MEANING,
        "election_cycle": int(
            meta.get("election_cycle") or scenario_polls[0].election_cycle
        ),
        "geography": meta.get("geography") or "national",
        "scenario": scenario,
        "example": is_example,
        "note": note or meta.get("note") or default_note,
        "candidates": _derive_candidates(scenario_polls, meta.get("candidates")),
        "institutes": _derive_institutes(scenario_polls, meta.get("institutes")),
        "generated_at": now.isoformat(timespec="seconds"),
        "date_range": {"start": _ymd(d_start), "end": _ymd(d_end)},
        "series": series,
    }
    return doc


def write_chart_json(
    doc: dict[str, Any],
    path: str | Path,
    *,
    also: Sequence[str | Path] | None = None,
) -> list[Path]:
    """Write chart JSON to path and optional mirrors."""
    written: list[Path] = []
    targets = [Path(path)] + [Path(p) for p in (also or [])]
    text = json.dumps(doc, ensure_ascii=False, indent=2) + "\n"
    for t in targets:
        t.parent.mkdir(parents=True, exist_ok=True)
        t.write_text(text, encoding="utf-8")
        written.append(t)
    return written
