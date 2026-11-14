"""Conservative staged solution-diffusion and salt-balance model."""
from __future__ import annotations

from .domain import MembraneStage, PlantBalance, PlantOperatingPoint, StageBalance
from .energy import pump_power_kw, recovery_credit_kw, specific_energy_kwh_m3
from .fouling import estimated_fouling_resistance, permeability_derating
from .physics import net_driving_pressure_bar, salt_in_permeate_g_l
from .physics import salt_mass_balance_g_l, water_flux_lmh


def simulate(
    operating: PlantOperatingPoint,
    stages: tuple[MembraneStage, ...],
) -> PlantBalance:
    if not stages or len(stages) > 8:
        raise ValueError("between one and eight stages are required")
    if not 0.0 < operating.feed_m3_h <= 100000.0:
        raise ValueError("feed flow outside supported envelope")
    if not 0.0 <= operating.feed_salinity_g_l <= 75.0:
        raise ValueError("feed salinity outside supported envelope")
    if not 1.0 < operating.feed_pressure_bar <= 90.0:
        raise ValueError("feed pressure outside supported envelope")
    if operating.permeate_pressure_bar >= operating.feed_pressure_bar:
        raise ValueError("permeate pressure must be below feed pressure")
    if not -2.0 <= operating.temperature_c <= 80.0:
        raise ValueError("temperature outside supported envelope")
    if not 0.25 <= operating.pump_efficiency <= 1.0:
        raise ValueError("invalid pump efficiency")
    if not 0.0 <= operating.energy_recovery_efficiency <= 0.95:
        raise ValueError("invalid energy recovery efficiency")
    if not 0.0 <= operating.runtime_hours <= 100000.0:
        raise ValueError("invalid operating runtime")
    if not 0.0 <= operating.silt_density_index <= 15.0:
        raise ValueError("invalid silt density index")
    flow = operating.feed_m3_h
    salinity = operating.feed_salinity_g_l
    total_permeate = 0.0
    salt_permeate_mass = 0.0
    balances: list[StageBalance] = []
    for stage in stages:
        resistance = estimated_fouling_resistance(
            stage.fouling_resistance,
            operating.runtime_hours,
            operating.silt_density_index,
        )
        permeability = stage.permeability_lmh_bar * permeability_derating(resistance)
        estimate_salinity = 0.3
        pressure_loss = max(0.0, stage.stage_number - 1) * 2.0
        available_pressure = max(1.0, operating.feed_pressure_bar - pressure_loss)
        driving = net_driving_pressure_bar(
            available_pressure,
            operating.permeate_pressure_bar,
            salinity,
            estimate_salinity,
            operating.temperature_c,
        )
        flux = water_flux_lmh(permeability, driving)
        permeate_salinity = salt_in_permeate_g_l(
            salinity,
            flux,
            stage.salt_permeability_lmh,
        )
        raw_permeate = flux * stage.area_m2 / 1000.0
        # Retain a concentrate stream for each finite stage and the whole plant.
        maximum_permeate = min(flow * 0.65, operating.feed_m3_h * 0.70 - total_permeate)
        permeate = max(0.0, min(raw_permeate, maximum_permeate))
        concentrate = flow - permeate
        next_salinity = salt_mass_balance_g_l(
            flow, salinity, permeate, permeate_salinity
        )
        balances.append(StageBalance(
            stage_number=stage.stage_number,
            feed_m3_h=flow,
            feed_salinity_g_l=salinity,
            permeate_m3_h=permeate,
            concentrate_m3_h=concentrate,
            permeate_salinity_g_l=permeate_salinity,
            concentrate_salinity_g_l=next_salinity,
            flux_lmh=flux,
            net_driving_pressure_bar=driving,
            recovery_fraction=permeate / flow,
        ))
        total_permeate += permeate
        salt_permeate_mass += permeate * permeate_salinity
        flow = concentrate
        salinity = next_salinity
    gross = pump_power_kw(
        operating.feed_pressure_bar,
        operating.feed_m3_h,
        operating.pump_efficiency,
    )
    recovery = recovery_credit_kw(
        flow, operating.feed_pressure_bar, operating.energy_recovery_efficiency
    )
    net = max(0.0, gross - recovery)
    specific = specific_energy_kwh_m3(net, total_permeate) if total_permeate > 0 else 0.0
    return PlantBalance(
        total_permeate_m3_h=total_permeate,
        concentrate_m3_h=flow,
        combined_permeate_salinity_g_l=(
            salt_permeate_mass / total_permeate if total_permeate > 0 else 0.0
        ),
        concentrate_salinity_g_l=salinity,
        recovery_fraction=total_permeate / operating.feed_m3_h,
        pump_power_kw=gross,
        recovery_credit_kw=recovery,
        net_power_kw=net,
        specific_energy_kwh_m3=specific,
        stages=tuple(balances),
    )
