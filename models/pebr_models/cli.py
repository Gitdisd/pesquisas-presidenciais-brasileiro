"""CLI: generate site/data/chart.json (or multi-scenario chart-2nd-round.json)."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from .aggregate import OptionBParams
from .export import (
    build_chart_export,
    build_multi_scenario_chart_export,
    list_scenarios,
    write_chart_json,
)
from .types import load_fixture_envelope, poll_from_dict


def _repo_root() -> Path:
    # models/pebr_models/cli.py → repo root is parents[2]
    return Path(__file__).resolve().parents[2]


def _load_polls_input(path: Path) -> tuple[list, dict[str, Any]]:
    """Load polls from a fixture file, canonical-points array, or a directory of *.json polls."""
    if path.is_dir():
        polls = []
        for fp in sorted(path.glob("*.json")):
            raw = json.loads(fp.read_text(encoding="utf-8"))
            if isinstance(raw, dict) and "poll_id" in raw:
                polls.append(poll_from_dict(raw))
            elif isinstance(raw, list):
                polls.extend(poll_from_dict(item) for item in raw)
            elif isinstance(raw, dict) and "polls" in raw:
                polls.extend(poll_from_dict(item) for item in raw["polls"])
            else:
                print(f"warning: skip {fp} (not a poll object)", file=sys.stderr)
        return polls, {}
    return load_fixture_envelope(str(path))


def main(argv: list[str] | None = None) -> int:
    root = _repo_root()
    parser = argparse.ArgumentParser(
        description=(
            "PEBR Option B: write chart JSON from poll fixtures. "
            "Use --scenario for one matchup, or --multi-scenario for pairwise "
            "2º exports (never merges distinct scenarios)."
        )
    )
    parser.add_argument(
        "--polls",
        type=Path,
        default=root / "fixtures" / "national" / "example_polls_synthetic.json",
        help=(
            "Path to poll fixture JSON (array or {polls, candidates, institutes}), "
            "canonical-points.json, or a directory of poll *.json files"
        ),
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=root / "site" / "data" / "chart.json",
        help="Output chart JSON path",
    )
    parser.add_argument("--k-days", type=int, default=14)
    parser.add_argument("--flood-w-days", type=int, default=14)
    parser.add_argument("--n-cap", type=int, default=4000)
    parser.add_argument(
        "--scenario",
        type=str,
        default=None,
        help="Filter to a single scenario id (Option B runs on that matchup only)",
    )
    parser.add_argument(
        "--multi-scenario",
        action="store_true",
        help=(
            "Run Option B per scenario and write a wrapper with scenarios[] "
            "(for site/data/chart-2nd-round.json). Mutually exclusive with --scenario."
        ),
    )
    parser.add_argument(
        "--list-scenarios",
        action="store_true",
        help="Print scenario ids found in --polls and exit",
    )
    parser.add_argument(
        "--no-example",
        action="store_true",
        help="Clear example:true (only for verified real corpora — not for fixtures)",
    )
    parser.add_argument(
        "--note",
        type=str,
        default=None,
        help="Override chart note metadata (e.g. verified cohort description)",
    )
    args = parser.parse_args(argv)

    if args.scenario and args.multi_scenario:
        print("error: use either --scenario or --multi-scenario, not both", file=sys.stderr)
        return 2

    polls, meta = _load_polls_input(args.polls)
    if not polls:
        print(f"error: no polls in {args.polls}", file=sys.stderr)
        return 1

    if args.list_scenarios:
        for s in list_scenarios(polls):
            print(s)
        return 0

    params = OptionBParams(
        k_days=args.k_days,
        flood_w_days=args.flood_w_days,
        n_cap=args.n_cap,
    )
    example = not args.no_example
    if "example" in meta:
        example = bool(meta["example"]) and example

    note = args.note
    if note is not None:
        meta = {**meta, "note": note}

    try:
        if args.multi_scenario:
            doc = build_multi_scenario_chart_export(
                polls, params, example=example, note=note, meta=meta
            )
        else:
            doc = build_chart_export(
                polls,
                params,
                example=example,
                note=note,
                meta=meta,
                scenario=args.scenario,
            )
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    written = write_chart_json(doc, args.out)

    if args.multi_scenario:
        n_scen = len(doc.get("scenarios") or [])
        n_poll = sum(
            1
            for block in doc.get("scenarios") or []
            for s in block.get("series") or []
            if s.get("series_kind") == "poll"
        )
        n_agg = sum(
            1
            for block in doc.get("scenarios") or []
            for s in block.get("series") or []
            if s.get("series_kind") == "aggregate"
        )
        print(
            f"wrote {written[0]} "
            f"(polls_in={len(polls)} scenarios={n_scen} "
            f"series_rows poll={n_poll} aggregate={n_agg} example={doc['example']})"
        )
    else:
        n_poll = sum(1 for s in doc["series"] if s["series_kind"] == "poll")
        n_agg = sum(1 for s in doc["series"] if s["series_kind"] == "aggregate")
        n_unc = sum(1 for s in doc["series"] if s["series_kind"] == "uncertainty")
        print(
            f"wrote {written[0]} "
            f"(polls_in={len(polls)} scenario={doc['scenario']} "
            f"series_rows poll={n_poll} aggregate={n_agg} uncertainty={n_unc} "
            f"example={doc['example']})"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
