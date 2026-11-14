"""Pydantic boundary contracts; physical values never enter unchecked."""
from __future__ import annotations

from pydantic import BaseModel, Field

from .domain import PlantOperatingPoint


class OperatingPointRequest(BaseModel):
    feed_m3_h: float = Field(default=120, gt=0, le=100000)
    feed_salinity_g_l: float = Field(default=35, ge=0, le=75)
    feed_pressure_bar: float = Field(default=64, gt=1, le=90)
    permeate_pressure_bar: float = Field(default=1.2, ge=0, le=20)
    temperature_c: float = Field(default=23, ge=-2, le=80)
    pump_efficiency: float = Field(default=0.84, ge=0.25, le=1)
    energy_recovery_efficiency: float = Field(default=0.80, ge=0, le=0.95)
    silt_density_index: float = Field(default=3.2, ge=0, le=15)
    runtime_hours: float = Field(default=800, ge=0, le=100000)

    def operating_point(self) -> PlantOperatingPoint:
        return PlantOperatingPoint(**self.model_dump())


class OptimizeRequest(OperatingPointRequest):
    minimum_recovery: float = Field(default=0.20, gt=0, lt=0.70)
    maximum_product_g_l: float = Field(default=0.50, gt=0, le=2.0)

    def operating_point(self) -> PlantOperatingPoint:
        data = self.model_dump(exclude={"minimum_recovery", "maximum_product_g_l"})
        return PlantOperatingPoint(**data)


class ObservationRequest(BaseModel):
    channel: str = Field(min_length=2, max_length=70, pattern=r"^[A-Z0-9_]+$")
    value: float = Field(ge=-100000, le=100000)
    engineering_unit: str = Field(min_length=1, max_length=20)
    source: str = Field(default="manual", pattern=r"^(manual|simulated)$")
