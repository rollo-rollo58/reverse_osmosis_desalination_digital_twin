"""Unit-consistent basic transport and hydrodynamic calculations."""
from __future__ import annotations

from math import isfinite

NACL_MOLAR_MASS_G_MOL = 58.44
IDEAL_GAS_R_BAR_L_MOL_K = 0.08314


def finite_positive(name: str, value: float, *, zero_ok: bool = False) -> float:
    if not isfinite(value) or (value < 0 if zero_ok else value <= 0):
        raise ValueError(f"{name} must be finite and nonnegative" if zero_ok
                         else f"{name} must be finite and positive")
    return value


def osmotic_pressure_bar(salinity_g_l: float, temperature_c: float) -> float:
    finite_positive("salinity", salinity_g_l, zero_ok=True)
    if not isfinite(temperature_c) or not -2.0 <= temperature_c <= 80.0:
        raise ValueError("temperature must be between -2 and 80 C")
    molarity_mol_l = salinity_g_l / NACL_MOLAR_MASS_G_MOL
    return 2.0 * molarity_mol_l * IDEAL_GAS_R_BAR_L_MOL_K * (
        temperature_c + 273.15
    )


def net_driving_pressure_bar(
    feed_pressure_bar: float,
    permeate_pressure_bar: float,
    feed_salinity_g_l: float,
    permeate_salinity_g_l: float,
    temperature_c: float,
) -> float:
    finite_positive("feed pressure", feed_pressure_bar)
    finite_positive("permeate pressure", permeate_pressure_bar, zero_ok=True)
    differential = osmotic_pressure_bar(feed_salinity_g_l, temperature_c)
    differential -= osmotic_pressure_bar(permeate_salinity_g_l, temperature_c)
    return max(0.0, feed_pressure_bar - permeate_pressure_bar - differential)


def water_flux_lmh(permeability_lmh_bar: float, driving_bar: float) -> float:
    finite_positive("permeability", permeability_lmh_bar)
    finite_positive("driving pressure", driving_bar, zero_ok=True)
    return permeability_lmh_bar * driving_bar


def salt_in_permeate_g_l(feed_g_l: float, flux_lmh: float, b_lmh: float) -> float:
    finite_positive("feed salinity", feed_g_l, zero_ok=True)
    finite_positive("water flux", flux_lmh, zero_ok=True)
    finite_positive("salt permeability", b_lmh)
    return feed_g_l * b_lmh / (flux_lmh + b_lmh)


def salt_mass_balance_g_l(
    feed_m3_h: float,
    feed_g_l: float,
    permeate_m3_h: float,
    permeate_g_l: float,
) -> float:
    remaining = feed_m3_h - permeate_m3_h
    if remaining <= 0:
        raise ValueError("concentrate stream must remain positive")
    value = (feed_m3_h * feed_g_l - permeate_m3_h * permeate_g_l) / remaining
    return max(0.0, value)
