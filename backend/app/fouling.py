"""Simple reversible membrane fouling and clean-in-place proxies."""
from __future__ import annotations

from math import exp

from .physics import finite_positive


def estimated_fouling_resistance(
    initial_resistance: float,
    runtime_hours: float,
    silt_density_index: float,
    scaling_index: float = 0.3,
) -> float:
    finite_positive("initial resistance", initial_resistance, zero_ok=True)
    finite_positive("runtime", runtime_hours, zero_ok=True)
    finite_positive("silt density index", silt_density_index, zero_ok=True)
    finite_positive("scaling index", scaling_index, zero_ok=True)
    deposition = runtime_hours * (
        0.000015 * silt_density_index + 0.000020 * scaling_index
    )
    return min(7.0, initial_resistance + deposition)


def permeability_derating(resistance: float) -> float:
    finite_positive("resistance", resistance, zero_ok=True)
    return 1.0 / (1.0 + resistance)


def cleaning_response(resistance: float, effectiveness: float) -> float:
    finite_positive("resistance", resistance, zero_ok=True)
    if not 0.0 <= effectiveness <= 1.0:
        raise ValueError("effectiveness must be between zero and one")
    return resistance * (1.0 - effectiveness)


def normalized_flux_decline(resistance: float, hours: float) -> float:
    finite_positive("resistance", resistance, zero_ok=True)
    finite_positive("hours", hours, zero_ok=True)
    return exp(-resistance * hours / 9000.0)
