# backend/app/schemas/gpa.py

from pydantic import BaseModel


class GpaSummary(BaseModel):
    total_completed_aus: float
    total_gpa_aus: float
    total_grade_points: float
    cumulative_gpa: float


class RemainingAusSummary(BaseModel):
    total_degree_requirement: float
    total_completed_aus: float
    remaining_aus: float
