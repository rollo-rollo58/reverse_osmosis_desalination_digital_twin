"""Deterministic synthetic time-series for UI preview and training."""
from __future__ import annotations

from datetime import datetime, timezone
from math import sin, cos


def sample(index: int) -> dict[str, object]:
    phase = index / 8.0
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "simulated": True,
        "feed_pressure_bar": round(63.8 + 0.6 * sin(phase), 3),
        "feed_flow_m3_h": round(120.0 + 1.2 * cos(phase), 3),
        "product_conductivity_us_cm": round(410.0 + 14.0 * sin(phase / 1.9), 2),
        "temperature_c": round(23.0 + 0.5 * sin(phase / 5.0), 2),
        "silt_density_index": round(3.2 + 0.2 * cos(phase / 4.0), 3),
    }
