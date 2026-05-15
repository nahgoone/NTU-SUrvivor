# backend/app/api/routes/academic.py

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.schemas.module import Module
from app.schemas.gpa import GpaSummary, RemainingAusSummary
from app.services.gpa_service import calculate_gpa, calculate_remaining_aus

router = APIRouter(prefix="/api/academic", tags=["Academic"])


class GpaRequest(BaseModel):
    modules: list[Module]


class RemainingAusRequest(BaseModel):
    modules: list[Module]
    total_degree_requirement: float = Field(default=138, ge=0)


@router.post("/gpa", response_model=GpaSummary)
def calculate_gpa_endpoint(payload: GpaRequest):
    return calculate_gpa(payload.modules)


@router.post("/remaining-aus", response_model=RemainingAusSummary)
def calculate_remaining_aus_endpoint(payload: RemainingAusRequest):
    return calculate_remaining_aus(
        modules=payload.modules,
        total_degree_requirement=payload.total_degree_requirement,
    )
