"""Derived performance metrics and guardrail classifications."""
from __future__ import annotations

from .domain import PlantBalance


def performance_indicators(balance: PlantBalance) -> dict[str, object]:
    salt_rejection = 1.0 - balance.combined_permeate_salinity_g_l / max(
        0.001, balance.stages[0].feed_salinity_g_l
    )
    observations: list[str] = []
    if balance.recovery_fraction < 0.20:
        observations.append("LOW_RECOVERY")
    if balance.combined_permeate_salinity_g_l > 0.50:
        observations.append("PRODUCT_SALINITY_REVIEW")
    if balance.specific_energy_kwh_m3 > 5.0:
        observations.append("HIGH_SPECIFIC_ENERGY")
    if balance.concentrate_salinity_g_l > 75.0:
        observations.append("BRINE_CONCENTRATION_REVIEW")
    return {
        "salt_rejection_fraction": salt_rejection,
        "recovery_fraction": balance.recovery_fraction,
        "productivity_m3_day": balance.total_permeate_m3_h * 24.0,
        "specific_energy_kwh_m3": balance.specific_energy_kwh_m3,
        "alerts": observations,
        "status": "review" if observations else "nominal_research_case",
    }
