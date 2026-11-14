"""Hydraulic energy and recovery-device sensitivity models."""
from __future__ import annotations

from .physics import finite_positive


def pump_power_kw(
    pressure_bar: float, feed_m3_h: float, efficiency: float
) -> float:
    finite_positive("pressure", pressure_bar)
    finite_positive("feed flow", feed_m3_h)
    if not 0.25 <= efficiency <= 1.0:
        raise ValueError("pump efficiency outside supported envelope")
    return pressure_bar * feed_m3_h / (36.0 * efficiency)


def recovery_credit_kw(
    concentrate_m3_h: float,
    pressure_bar: float,
    exchanger_efficiency: float,
) -> float:
    finite_positive("concentrate flow", concentrate_m3_h, zero_ok=True)
    finite_positive("pressure", pressure_bar)
    if not 0.0 <= exchanger_efficiency <= 0.95:
        raise ValueError("recovery efficiency outside supported envelope")
    return concentrate_m3_h * pressure_bar * exchanger_efficiency / 36.0


def specific_energy_kwh_m3(power_kw: float, permeate_m3_h: float) -> float:
    finite_positive("power", power_kw, zero_ok=True)
    finite_positive("permeate", permeate_m3_h)
    return power_kw / permeate_m3_h
