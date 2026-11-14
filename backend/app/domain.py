"""Immutable and typed SI-based engineering records."""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class MembraneStage:
    stage_number: int
    area_m2: float
    permeability_lmh_bar: float
    salt_permeability_lmh: float
    fouling_resistance: float = 0.05


@dataclass(frozen=True)
class PlantOperatingPoint:
    feed_m3_h: float = 120.0
    feed_salinity_g_l: float = 35.0
    feed_pressure_bar: float = 64.0
    permeate_pressure_bar: float = 1.2
    temperature_c: float = 23.0
    pump_efficiency: float = 0.84
    energy_recovery_efficiency: float = 0.80
    silt_density_index: float = 3.2
    runtime_hours: float = 800.0


@dataclass(frozen=True)
class StageBalance:
    stage_number: int
    feed_m3_h: float
    feed_salinity_g_l: float
    permeate_m3_h: float
    concentrate_m3_h: float
    permeate_salinity_g_l: float
    concentrate_salinity_g_l: float
    flux_lmh: float
    net_driving_pressure_bar: float
    recovery_fraction: float


@dataclass(frozen=True)
class PlantBalance:
    total_permeate_m3_h: float
    concentrate_m3_h: float
    combined_permeate_salinity_g_l: float
    concentrate_salinity_g_l: float
    recovery_fraction: float
    pump_power_kw: float
    recovery_credit_kw: float
    net_power_kw: float
    specific_energy_kwh_m3: float
    stages: tuple[StageBalance, ...]


DEFAULT_STAGES = (
    MembraneStage(1, 550.0, 1.15, 0.12),
    MembraneStage(2, 420.0, 1.05, 0.14),
    MembraneStage(3, 310.0, 0.95, 0.16),
)
