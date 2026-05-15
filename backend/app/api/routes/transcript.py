# backend/app/api/routes/academic.py

from fastapi import APIRouter
from pydantic import BaseModel

from app.schemas.module import Module

# from app.schemas.degree import DegreeRequirements
from app.services.gpa_service import calculate_gpa

# from app.services.su_optimizer_service import optimise_su_usage

router = APIRouter(prefix="/api/academic", tags=["Academic"])


class GpaRequest(BaseModel):
    modules: list[Module]


# class SuOptimiseRequest(BaseModel):
#     modules: list[Module]
#     degree_requirements: DegreeRequirements


@router.post("/gpa")
def calculate_gpa_endpoint(payload: GpaRequest):
    return calculate_gpa(payload.modules)


# @router.post("/su-optimise")
# def optimise_su_endpoint(payload: SuOptimiseRequest):
#     return optimise_su_usage(
#         payload.modules,
#         payload.degree_requirements,
#     )
