# backend/app/services/gpa_service.py

from app.schemas.gpa import GpaSummary, RemainingAusSummary
from app.schemas.module import (
    Module,
    GRADE_POINTS,
    counts_toward_gpa,
    is_module_completed,
)

GPA_DECIMAL_PLACES = 3


def round_gpa(value: float) -> float:
    return round(value, GPA_DECIMAL_PLACES)


def calculate_gpa(modules: list[Module]) -> GpaSummary:
    total_completed_aus = 0.0
    total_gpa_aus = 0.0
    total_grade_points = 0.0

    for module in modules:
        if is_module_completed(module):
            total_completed_aus += module.au

        if not counts_toward_gpa(module):
            continue

        grade_point = GRADE_POINTS.get(module.grade)

        if grade_point is None:
            continue

        total_gpa_aus += module.au
        total_grade_points += module.au * grade_point

    cumulative_gpa = (
        0.0 if total_gpa_aus == 0 else round_gpa(total_grade_points / total_gpa_aus)
    )

    return GpaSummary(
        total_completed_aus=total_completed_aus,
        total_gpa_aus=total_gpa_aus,
        total_grade_points=total_grade_points,
        cumulative_gpa=cumulative_gpa,
    )


def calculate_remaining_aus(
    modules: list[Module],
    total_degree_requirement: float,
) -> RemainingAusSummary:
    gpa_summary = calculate_gpa(modules)

    remaining_aus = max(
        total_degree_requirement - gpa_summary.total_completed_aus,
        0,
    )

    return RemainingAusSummary(
        total_degree_requirement=total_degree_requirement,
        total_completed_aus=gpa_summary.total_completed_aus,
        remaining_aus=remaining_aus,
    )
