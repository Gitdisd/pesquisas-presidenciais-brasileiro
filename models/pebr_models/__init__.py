"""PEBR Option B poll aggregation models (√N trailing window + anti-flood)."""

from .aggregate import OptionBParams, aggregate_option_b
from .export import build_chart_export, write_chart_json
from .types import NationalPoll, SERIES_KINDS

__all__ = [
    "NationalPoll",
    "OptionBParams",
    "SERIES_KINDS",
    "aggregate_option_b",
    "build_chart_export",
    "write_chart_json",
]

__version__ = "0.1.0"
