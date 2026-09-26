"""CLI: generate site/data/chart.json from canonical poll fixtures."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .aggregate import OptionBParams
from .export import build_chart_export, write_chart_json
from .types import load_fixture_envelope


def _repo_root() -> Path:
    # models/pebr_models/cli.py → repo root is parents[2]
    return Path(__file__).resolve().parents[2]


def main(argv: list[str] | None = None) -> int:
    root = _repo_root()
    parser = argparse.ArgumentParser(
        description="PEBR Option B: write site/data/chart.json from poll fixtures"
    )
    parser.add_argument(
        "--polls",
        type=Path,
        default=root / "fixtures" / "national" / "example_polls_synthetic.json",
        help="Path to poll fixture JSON (array or {polls, candidates, institutes})",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=root / "site" / "data" / "chart.json",
        help="Output chart.json path",
    )
    parser.add_argument("--k-days", type=int, default=14)
    parser.add_argument("--flood-w-days", type=int, default=14)
    parser.add_argument("--n-cap", type=int, default=4000)
    parser.add_argument(
        "--no-example",
        action="store_true",
        help="Clear example:true (only for verified real corpora — not for fixtures)",
    )
    args = parser.parse_args(argv)

    polls, meta = load_fixture_envelope(str(args.polls))
    if not polls:
        print(f"error: no polls in {args.polls}", file=sys.stderr)
        return 1

    params = OptionBParams(
        k_days=args.k_days,
        flood_w_days=args.flood_w_days,
        n_cap=args.n_cap,
    )
    example = not args.no_example
    if "example" in meta:
        example = bool(meta["example"]) and example

    doc = build_chart_export(polls, params, example=example, meta=meta)
    written = write_chart_json(doc, args.out)
    n_poll = sum(1 for s in doc["series"] if s["series_kind"] == "poll")
    n_agg = sum(1 for s in doc["series"] if s["series_kind"] == "aggregate")
    n_unc = sum(1 for s in doc["series"] if s["series_kind"] == "uncertainty")
    print(
        f"wrote {written[0]} "
        f"(polls_in={len(polls)} series_rows poll={n_poll} aggregate={n_agg} uncertainty={n_unc} "
        f"example={doc['example']})"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
