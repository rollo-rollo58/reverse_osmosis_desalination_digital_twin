"""Physical invariants of the simplified membrane model."""
from dataclasses import replace
from math import isclose

import pytest

from app.domain import DEFAULT_STAGES, PlantOperatingPoint
from app.energy import pump_power_kw, specific_energy_kwh_m3
from app.fouling import cleaning_response, permeability_derating
from app.membranes import simulate
from app.physics import osmotic_pressure_bar


def test_osmotic_pressure_grows_with_salinity():
    assert osmotic_pressure_bar(35, 24) > osmotic_pressure_bar(20, 24)


def test_osmotic_pressure_rejects_invalid_temperature():
    with pytest.raises(ValueError):
        osmotic_pressure_bar(35, -20)


def test_water_and_salt_are_conserved_over_stages():
    point = PlantOperatingPoint()
    result = simulate(point, DEFAULT_STAGES)
    assert isclose(result.total_permeate_m3_h + result.concentrate_m3_h,
                   point.feed_m3_h, abs_tol=1e-8)
    product_salt = result.total_permeate_m3_h * result.combined_permeate_salinity_g_l
    brine_salt = result.concentrate_m3_h * result.concentrate_salinity_g_l
    assert isclose(product_salt + brine_salt,
                   point.feed_m3_h * point.feed_salinity_g_l, rel_tol=1e-9)
    assert 0 < result.recovery_fraction < 0.70


def test_fouling_lowers_permeate_productivity():
    clean = simulate(replace(PlantOperatingPoint(), runtime_hours=0), DEFAULT_STAGES)
    dirty = simulate(replace(PlantOperatingPoint(), runtime_hours=60000), DEFAULT_STAGES)
    assert clean.total_permeate_m3_h > dirty.total_permeate_m3_h


def test_cleaning_recovers_permeability():
    assert cleaning_response(0.8, 0.75) == pytest.approx(0.2)
    assert permeability_derating(0.2) > permeability_derating(0.8)


def test_pressure_energy_has_correct_units():
    assert pump_power_kw(36, 36, 1.0) == pytest.approx(36)
    assert specific_energy_kwh_m3(36, 12) == pytest.approx(3)


def test_high_salt_high_temperature_remains_bounded():
    result = simulate(replace(PlantOperatingPoint(), feed_salinity_g_l=72,
                              temperature_c=38, feed_pressure_bar=82), DEFAULT_STAGES)
    assert result.concentrate_m3_h > 0
    assert result.combined_permeate_salinity_g_l >= 0


def test_invalid_pressure_rejected():
    with pytest.raises(ValueError):
        simulate(replace(PlantOperatingPoint(), feed_pressure_bar=1), DEFAULT_STAGES)
