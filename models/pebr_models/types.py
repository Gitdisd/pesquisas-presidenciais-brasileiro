"""Dataclasses matching Pipeline canonical national poll schema (schemas/poll.schema.json)."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import Any, Mapping, Optional

SERIES_KINDS = frozenset({"poll", "aggregate", "uncertainty", "projection", "overlay"})
V1_EMITTED_KINDS = frozenset({"poll", "aggregate", "uncertainty"})


@dataclass(frozen=True)
class NationalPoll:
    """Canonical national poll (Pipeline contract).

    ``results`` maps candidate_id → voting-intention fraction in [0, 1].
    ``moe`` is a fraction on the share scale (e.g. 0.02 for ±2pp), not a percent integer.
    """

    poll_id: str
    institute_id: str
    fieldwork_start: date
    fieldwork_end: date
    scenario: str
    sample_size: Optional[int]
    results: Mapping[str, float]
    residuals: Mapping[str, float] = field(default_factory=dict)
    geography: str = "national"
    election_cycle: int = 2026
    fieldwork_mid: Optional[date] = None
    moe: Optional[float] = None
    tse_registration_id: Optional[str] = None
    witness_ids: tuple[str, ...] = ()
    dataset_version: str = "1"
    notes: str = ""

    @property
    def field_mid(self) -> date:
        if self.fieldwork_mid is not None:
            return self.fieldwork_mid
        from .dating import fieldwork_midpoint

        return fieldwork_midpoint(self.fieldwork_start, self.fieldwork_end)


def parse_ymd(s: str) -> date:
    return date.fromisoformat(s)


def poll_from_dict(d: Mapping[str, Any]) -> NationalPoll:
    """Parse a Pipeline-shaped poll object (schemas/poll.schema.json)."""
    mid = d.get("fieldwork_mid")
    ss = d.get("sample_size")
    cycle = d.get("election_cycle", 2026)
    return NationalPoll(
        poll_id=str(d["poll_id"]),
        institute_id=str(d["institute_id"]),
        fieldwork_start=parse_ymd(d["fieldwork_start"]),
        fieldwork_end=parse_ymd(d["fieldwork_end"]),
        fieldwork_mid=parse_ymd(mid) if mid else None,
        geography=str(d.get("geography", "national")),
        election_cycle=int(cycle),
        scenario=str(d["scenario"]),
        sample_size=int(ss) if ss is not None else None,
        moe=float(d["moe"]) if d.get("moe") is not None else None,
        results={str(k): float(v) for k, v in dict(d["results"]).items()},
        residuals={str(k): float(v) for k, v in dict(d.get("residuals") or {}).items()},
        tse_registration_id=d.get("tse_registration_id"),
        witness_ids=tuple(d.get("witness_ids") or ()),
        dataset_version=str(d.get("dataset_version", "1")),
        notes=str(d.get("notes") or ""),
    )


def load_polls(path: str) -> list[NationalPoll]:
    """Load bare JSON array of Pipeline polls, or {polls: [...]} envelope."""
    import json
    from pathlib import Path

    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    if isinstance(raw, dict) and "polls" in raw:
        # Optional chart metadata may live alongside polls; ignore here.
        raw = raw["polls"]
    if not isinstance(raw, list):
        raise ValueError("polls JSON must be a bare array or {polls: [...]}")
    return [poll_from_dict(item) for item in raw]


def load_fixture_envelope(path: str) -> tuple[list[NationalPoll], dict[str, Any]]:
    """Load polls plus optional candidates/institutes metadata from a fixture file."""
    import json
    from pathlib import Path

    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    meta: dict[str, Any] = {}
    if isinstance(raw, dict):
        polls_raw = raw.get("polls", [])
        for key in ("candidates", "institutes", "example", "note", "election_cycle", "geography", "scenario"):
            if key in raw:
                meta[key] = raw[key]
    elif isinstance(raw, list):
        polls_raw = raw
    else:
        raise ValueError("fixture must be a bare poll array or {polls: [...], ...}")
    return [poll_from_dict(item) for item in polls_raw], meta
