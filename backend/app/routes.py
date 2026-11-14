"""HTTP endpoints for research visualization and guarded observation ingestion."""
from __future__ import annotations

import asyncio
import json
from dataclasses import asdict

from fastapi import APIRouter, Header, HTTPException, Query
from fastapi.responses import StreamingResponse

from .analytics import performance_indicators
from .auth import authorized_operator
from .catalogue import case_index, evaluate_case
from .config import get_settings
from .domain import DEFAULT_STAGES, PlantOperatingPoint
from .membranes import simulate
from .optimization import recommend_pressure
from .schemas import ObservationRequest, OperatingPointRequest, OptimizeRequest
from .store import ObservationJournal
from .telemetry import sample

router = APIRouter()
journal = ObservationJournal(max_events=300)


@router.get("/healthz")
def healthz() -> dict[str, object]:
    return {"status": "ok", "mode": "synthetic_research", "ingestion_enabled":
            get_settings().operator_api_key is not None}


@router.get("/api/v1/overview")
def overview() -> dict[str, object]:
    point = PlantOperatingPoint()
    calculation = simulate(point, DEFAULT_STAGES)
    return {
        "plant": "AquaFlux Estuary Research Facility",
        "train": "RO-01",
        "simulated": True,
        "operating": asdict(point),
        "balance": asdict(calculation),
        "performance": performance_indicators(calculation),
        "telemetry": sample(0),
    }


@router.post("/api/v1/simulate")
def simulation(request: OperatingPointRequest) -> dict[str, object]:
    point = request.operating_point()
    try:
        result = simulate(point, DEFAULT_STAGES)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    return {"simulated": True, "balance": asdict(result),
            "performance": performance_indicators(result)}


@router.post("/api/v1/optimize")
def optimize(request: OptimizeRequest) -> dict[str, object]:
    try:
        return recommend_pressure(
            request.operating_point(),
            request.minimum_recovery,
            request.maximum_product_g_l,
        )
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


@router.get("/api/v1/events")
def events(limit: int = Query(default=50, ge=1, le=100)) -> dict[str, object]:
    return {"items": journal.latest(limit), "durable": False}


@router.post("/api/v1/observations", status_code=201)
def ingest(
    request: ObservationRequest,
    x_operator_key: str | None = Header(default=None),
) -> dict[str, object]:
    if not authorized_operator(x_operator_key, get_settings()):
        raise HTTPException(status_code=403, detail="Observation ingestion disabled or forbidden")
    return journal.append(
        request.channel, request.value, request.engineering_unit, request.source
    )


@router.get("/api/v1/catalogue/{case_id}")
def catalogue_case(case_id: int, feed_pressure_bar: float = Query(default=62, gt=1, le=90),
                   silt_density_index: float = Query(default=3, ge=0, le=15)) -> dict:
    try:
        return evaluate_case(case_id, feed_pressure_bar, silt_density_index)
    except KeyError as error:
        raise HTTPException(status_code=404, detail="No matching scenario") from error


@router.get("/api/v1/scenarios")
def scenarios(limit: int = Query(default=20, ge=1, le=100)) -> dict[str, object]:
    return {"items": case_index(limit), "synthetic": True}


async def stream_samples():
    number = 0
    while True:
        yield "data: " + json.dumps(sample(number), separators=(",", ":")) + "\n\n"
        number += 1
        await asyncio.sleep(1)


@router.get("/api/v1/stream")
async def stream() -> StreamingResponse:
    return StreamingResponse(stream_samples(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache"})
