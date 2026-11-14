"""AquaFlux API application with narrow CORS and disabled actuation."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routes import router

app = FastAPI(
    title="AquaFlux Desalination Research API",
    version="0.1.0",
    description="Synthetic engineering workbench, not plant control software.",
)
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.allowed_origins),
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["content-type", "x-operator-key"],
)
app.include_router(router)
