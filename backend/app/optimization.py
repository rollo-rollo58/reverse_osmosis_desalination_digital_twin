"""Searches a bounded physical operating envelope for feasible candidates."""
from __future__ import annotations

from dataclasses import replace

from .domain import DEFAULT_STAGES, PlantOperatingPoint
from .membranes import simulate


def recommend_pressure(
    point: PlantOperatingPoint,
    minimum_recovery: float = 0.20,
    maximum_product_g_l: float = 0.50,
) -> dict[str, object]:
    if not 0.0 < minimum_recovery < 0.70:
        raise ValueError("minimum recovery outside envelope")
    if not 0.0 < maximum_product_g_l <= 2.0:
        raise ValueError("maximum product salinity outside envelope")
    candidates: list[dict[str, float | bool]] = []
    for pressure in (42.0, 46.0, 50.0, 54.0, 58.0, 62.0, 66.0, 70.0):
        trial = replace(point, feed_pressure_bar=pressure)
        result = simulate(trial, DEFAULT_STAGES)
        feasible = (
            result.recovery_fraction >= minimum_recovery
            and result.combined_permeate_salinity_g_l <= maximum_product_g_l
            and result.total_permeate_m3_h > 0.0
        )
        candidates.append({
            "pressure_bar": pressure,
            "recovery_fraction": result.recovery_fraction,
            "product_salinity_g_l": result.combined_permeate_salinity_g_l,
            "specific_energy_kwh_m3": result.specific_energy_kwh_m3,
            "feasible": feasible,
        })
    eligible = [candidate for candidate in candidates if candidate["feasible"]]
    winner = min(
        eligible,
        key=lambda item: (item["specific_energy_kwh_m3"], item["pressure_bar"]),
    ) if eligible else None
    return {
        "best": winner,
        "candidates": candidates,
        "status": "feasible" if winner else "no_feasible_candidate",
        "note": "Simplified synthetic comparison; not an automated control instruction.",
    }
