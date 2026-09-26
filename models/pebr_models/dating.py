"""Fieldwork midpoint dating for PEBR aggregates."""

from __future__ import annotations

from datetime import date, timedelta


def fieldwork_midpoint(start: date, end: date) -> date:
    """Calendar midpoint of [start, end].

    Uses half the inclusive day-span (integer floor). If start == end, returns
    that day. Option B dates polls at this midpoint (not publication day).
    """
    if end < start:
        start, end = end, start
    delta_days = (end - start).days
    return start + timedelta(days=delta_days // 2)


def parse_ymd(s: str) -> date:
    return date.fromisoformat(s)
