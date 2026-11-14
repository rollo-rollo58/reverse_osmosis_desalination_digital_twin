"""Application configuration with secure-by-default data ingestion."""
from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    environment: str
    allowed_origins: tuple[str, ...]
    operator_api_key: str | None


def get_settings() -> Settings:
    token = os.getenv("OPERATOR_API_KEY", "").strip()
    if token.startswith("REPLACE_") or len(token) < 24:
        token = ""
    origins = tuple(
        part.strip()
        for part in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
        if part.strip()
    )
    return Settings(
        environment=os.getenv("APP_ENV", "development"),
        allowed_origins=origins,
        operator_api_key=token or None,
    )
