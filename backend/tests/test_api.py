"""HTTP contract tests for research-only API features."""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json()["mode"] == "synthetic_research"


def test_overview_contains_stage_balances():
    response = client.get("/api/v1/overview")
    assert response.status_code == 200
    assert len(response.json()["balance"]["stages"]) == 3


def test_simulation_rejects_negative_flow():
    response = client.post("/api/v1/simulate", json={"feed_m3_h": -2})
    assert response.status_code == 422


def test_simulation_validates_pressure_difference():
    response = client.post("/api/v1/simulate", json={
        "feed_pressure_bar": 10, "permeate_pressure_bar": 12,
    })
    assert response.status_code == 422


def test_observation_ingestion_without_operator_key_is_forbidden():
    response = client.post("/api/v1/observations", json={
        "channel": "FEED_PRESSURE", "value": 62, "engineering_unit": "bar",
    })
    assert response.status_code == 403


def test_catalogue_missing_case_returns_not_found():
    response = client.get("/api/v1/catalogue/999999")
    assert response.status_code == 404


def test_optimizer_reports_candidates():
    response = client.post("/api/v1/optimize", json={})
    assert response.status_code == 200
    assert len(response.json()["candidates"]) == 8
