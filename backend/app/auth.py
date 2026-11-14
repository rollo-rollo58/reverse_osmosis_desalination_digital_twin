"""Constant-time verification for optional manual observation ingestion."""
from __future__ import annotations

from hmac import compare_digest

from .config import Settings


def authorized_operator(supplied_key: str | None, settings: Settings) -> bool:
    expected = settings.operator_api_key
    if expected is None or supplied_key is None:
        return False
    return compare_digest(expected, supplied_key)
