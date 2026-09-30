"""Export Option B series to Research UI chart JSON (flat series rows).

Single-scenario docs (`chart.json`) keep the existing contract.
Multi-scenario docs (`chart-2nd-round.json`) wrap pairwise Option B runs under
``scenarios[]`` — never merge distinct 2º matchups into one aggregate.
"""

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

_PALETTE = ["#5B8CFF", "#FF6B6B", "#4ECDC4", "#F7B731", "#A78BFA", "#34D399", "#FB7185"]


def _ymd(d: date) -> str:
    return d.isoformat()


def _round4(x: float) -> float:
    return round(float(x), 4)


def polls_as_flat_rows(
    polls: Sequence[NationalPoll],
    *,
    include_uf: bool = False,
) -> list[dict[str, Any]]:
    """Emit flat series_kind=poll rows dated at field_mid (fractions 0–1)."""
    rows: list[dict[str, Any]] = []
    for p in sorted(polls, key=lambda x: (x.field_mid, x.poll_id)):
        for cid, frac in p.results.items():
            row: dict[str, Any] = {
                "series_kind": "poll",
                "date": _ymd(p.field_mid),
                "fieldwork_start": _ymd(p.fieldwork_start),
                "fieldwork_end": _ymd(p.fieldwork_end),
                "candidate_id": cid,
                "value": _round4(frac),
                "institute_id": p.institute_id,
                "poll_id": p.poll_id,
                "n": p.sample_size,
            }
            if p.moe is not None:
                row["moe"] = _round4(p.moe)
            if p.tse_registration_id:
                row["tse_registration_id"] = p.tse_registration_id
            if include_uf and p.uf:
                row["uf"] = p.uf
            rows.append(row)
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
    by_meta: dict[str, dict[str, Any]] = {}
    if meta_candidates:
        for c in meta_candidates:
            cid = str(c.get("id") or "")
            if cid:
                by_meta[cid] = dict(c)

    seen: list[str] = []
    for p in polls:
        for cid in p.results:
            if cid not in seen:
                seen.append(cid)

    out: list[dict[str, Any]] = []
    for i, cid in enumerate(seen):
        if cid in by_meta:
            out.append(dict(by_meta[cid]))
            continue
        out.append(
            {
                "id": cid,
                "label": _DEFAULT_CANDIDATE_LABELS.get(cid, cid),
                "color": _DEFAULT_CANDIDATE_COLORS.get(cid, _PALETTE[i % len(_PALETTE)]),
            }
        )
    return out


def _derive_institutes(
    polls: Sequence[NationalPoll],
    meta_institutes: Sequence[Mapping[str, Any]] | None,
) -> list[dict[str, Any]]:
    by_meta: dict[str, dict[str, Any]] = {}
    if meta_institutes:
        for inst in meta_institutes:
            iid = str(inst.get("id") or "")
            if iid:
                by_meta[iid] = dict(inst)

    seen: list[str] = []
    for p in polls:
        if p.institute_id not in seen:
            seen.append(p.institute_id)
    out: list[dict[str, Any]] = []
    for iid in seen:
        if iid in by_meta:
            out.append(dict(by_meta[iid]))
        else:
            out.append(
                {
                    "id": iid,
                    "label": _DEFAULT_INSTITUTE_LABELS.get(iid, iid),
                }
            )
    return out


def _filter_national(polls: Sequence[NationalPoll]) -> list[NationalPoll]:
    return [p for p in polls if not p.geography or p.geography == "national"]


def list_scenarios(polls: Sequence[NationalPoll]) -> list[str]:
    """Sorted unique scenario ids among national polls."""
    return sorted({p.scenario for p in _filter_national(polls)})


def matchup_label(scenario: str) -> str:
    """Human-readable pairwise label from stimulated_2nd_round_<a>_vs_<b>."""
    prefix = "stimulated_2nd_round_"
    if scenario.startswith(prefix) and "_vs_" in scenario:
        rest = scenario[len(prefix) :]
        a, _, b = rest.partition("_vs_")
        def pretty(cid: str) -> str:
            return cid.replace("_", " ").strip().title()

        return f"{pretty(a)} × {pretty(b)}"
    return scenario


def build_chart_export(
    polls: Sequence[NationalPoll],
    params: OptionBParams | None = None,
    *,
    include_uncertainty: bool = True,
    example: bool = True,
    note: str | None = None,
    meta: Mapping[str, Any] | None = None,
    scenario: str | None = None,
) -> dict[str, Any]:
    """Build a single-scenario Research UI chart document (flat series, unit=fraction).

    If ``scenario`` is set (or ``meta['scenario']``), only that matchup/scenario is
    aggregated. Distinct scenarios are never merged into one Option B run.
    """
    params = params or OptionBParams()
    meta = dict(meta or {})
    filtered = _filter_national(polls)
    if not filtered:
        raise ValueError("no national polls to aggregate")

    scenarios = sorted({p.scenario for p in filtered})
    chosen = scenario or meta.get("scenario")
    if chosen is not None:
        chosen = str(chosen)
        scenario_polls = [p for p in filtered if p.scenario == chosen]
        if not scenario_polls:
            raise ValueError(
                f"scenario {chosen!r} not found; available: {scenarios}"
            )
    else:
        if len(scenarios) > 1:
            raise ValueError(
                "multiple scenarios present; pass scenario=... or use "
                f"build_multi_scenario_chart_export. available: {scenarios}"
            )
        chosen = scenarios[0]
        scenario_polls = [p for p in filtered if p.scenario == chosen]

    # Aggregate already loops scenarios; input is single-scenario by construction.
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
        "scenario": chosen,
        "example": is_example,
        "note": note or meta.get("note") or default_note,
        "candidates": _derive_candidates(scenario_polls, meta.get("candidates")),
        "institutes": _derive_institutes(scenario_polls, meta.get("institutes")),
        "generated_at": now.isoformat(timespec="seconds"),
        "date_range": {"start": _ymd(d_start), "end": _ymd(d_end)},
        "series": series,
    }
    return doc


def build_regional_chart_export(
    polls: Sequence[NationalPoll],
    params: OptionBParams | None = None,
    *,
    scenario: str = "stimulated_1st_round",
    include_uncertainty: bool = True,
    example: bool = False,
    note: str | None = None,
    meta: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
    """Build a regional/UF Option B export with an independent aggregate per UF."""
    params = params or OptionBParams()
    meta = dict(meta or {})
    state_polls = [p for p in polls if (not p.geography or p.geography == "state") and p.uf]
    if not state_polls:
        raise ValueError("no regional polls to aggregate")
    scenario = str(scenario)
    selected = [p for p in state_polls if p.scenario == scenario]
    if not selected:
        available = sorted({p.scenario for p in state_polls})
        raise ValueError(f"scenario {scenario!r} not found; available: {available}")

    series: list[dict[str, Any]] = []
    all_points: list[AggregatePoint] = []
    for uf in sorted({p.uf for p in selected if p.uf}):
        uf_polls = [p for p in selected if p.uf == uf]
        series.extend(polls_as_flat_rows(uf_polls, include_uf=True))
        points = aggregate_option_b(uf_polls, params, geography="state")
        all_points.extend(points)
        for row in aggregate_as_flat_rows(points, include_uncertainty=include_uncertainty):
            row["uf"] = uf
            series.append(row)

    mids = [p.field_mid for p in selected]
    days = [pt.day for pt in all_points]
    d_start = min([*mids, *days])
    d_end = max([*mids, *days])
    now = datetime.now(SP_TZ)
    is_example = bool(meta.get("example", example))
    return {
        "schema_version": 1,
        "model_id": MODEL_ID,
        "unit": "fraction",
        "params": params.as_dict(),
        "band_meaning": BAND_MEANING,
        "election_cycle": int(meta.get("election_cycle") or selected[0].election_cycle),
        "geography": "state",
        "scenario": scenario,
        "example": is_example,
        "note": note or meta.get("note") or "Regional UF Option B per-state aggregate; never blended across UFs; unit=fraction; band_low/band_high = in-window dispersion.",
        "candidates": _derive_candidates(selected, meta.get("candidates")),
        "institutes": _derive_institutes(selected, meta.get("institutes")),
        "ufs": sorted({p.uf for p in selected if p.uf}),
        "generated_at": now.isoformat(timespec="seconds"),
        "date_range": {"start": _ymd(d_start), "end": _ymd(d_end)},
        "series": series,
    }


def build_multi_scenario_chart_export(
    polls: Sequence[NationalPoll],
    params: OptionBParams | None = None,
    *,
    include_uncertainty: bool = True,
    example: bool = True,
    note: str | None = None,
    meta: Mapping[str, Any] | None = None,
    scenarios: Sequence[str] | None = None,
) -> dict[str, Any]:
    """Run Option B **per scenario** and wrap results (no cross-matchup merge).

    Output shape for ``site/data/chart-2nd-round.json``::

        {
          schema_version, model_id, unit, params, ...,
          round: "2nd",
          scenarios: [
            { scenario, label, candidates, institutes, date_range, series },
            ...
          ]
        }
    """
    params = params or OptionBParams()
    meta = dict(meta or {})
    filtered = _filter_national(polls)
    if not filtered:
        raise ValueError("no national polls to aggregate")

    available = sorted({p.scenario for p in filtered})
    wanted = list(scenarios) if scenarios is not None else available
    missing = [s for s in wanted if s not in available]
    if missing:
        raise ValueError(f"scenarios not found: {missing}; available: {available}")
    if not wanted:
        raise ValueError("no scenarios to export")

    blocks: list[dict[str, Any]] = []
    for scen in wanted:
        single = build_chart_export(
            filtered,
            params,
            include_uncertainty=include_uncertainty,
            example=example,
            note=note,
            meta=meta,
            scenario=scen,
        )
        blocks.append(
            {
                "scenario": single["scenario"],
                "label": matchup_label(single["scenario"]),
                "candidates": single["candidates"],
                "institutes": single["institutes"],
                "date_range": single["date_range"],
                "series": single["series"],
            }
        )

    now = datetime.now(SP_TZ)
    is_example = bool(meta.get("example", example))
    default_note = (
        "2º turno pairwise — Option B per matchup (never merged). "
        "unit=fraction; band_low/band_high = in-window dispersion."
    )
    first = filtered[0]
    return {
        "schema_version": 1,
        "model_id": MODEL_ID,
        "unit": "fraction",
        "params": params.as_dict(),
        "band_meaning": BAND_MEANING,
        "election_cycle": int(meta.get("election_cycle") or first.election_cycle),
        "geography": meta.get("geography") or "national",
        "round": "2nd",
        "example": is_example,
        "note": note or meta.get("note") or default_note,
        "generated_at": now.isoformat(timespec="seconds"),
        "scenarios": blocks,
    }


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