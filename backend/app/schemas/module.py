# backend/app/schemas/module.py

from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, Field, field_validator

ModuleType = Literal["Core", "MPE", "BDE", "ICC", "Other"]

Grade = Literal[
    "",
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "D+",
    "D",
    "F",
    "S/U",
    "PASS",
    "EX",
]


MODULE_TYPES: tuple[ModuleType, ...] = (
    "Core",
    "MPE",
    "BDE",
    "ICC",
    "Other",
)

GRADES: tuple[Grade, ...] = (
    "",
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "D+",
    "D",
    "F",
    "S/U",
    "PASS",
    "EX",
)

GRADE_POINTS: dict[str, float] = {
    "A+": 5.0,
    "A": 5.0,
    "A-": 4.5,
    "B+": 4.0,
    "B": 3.5,
    "B-": 3.0,
    "C+": 2.5,
    "C": 2.0,
    "D+": 1.5,
    "D": 1.0,
    "F": 0.0,
}

NON_GPA_GRADES: set[Grade] = {"", "S/U", "PASS", "EX"}

NON_COMPLETED_GRADES: set[Grade] = {""}

MODULE_TYPE_ALIASES: dict[str, ModuleType] = {
    "Major PE": "MPE",
    "GERPE": "Other",
}

DEFAULT_MODULE_TYPE: ModuleType = "Other"

DEFAULT_GRADE: Grade = ""


def normalise_module_code(code: str) -> str:
    return str(code or "").strip().upper()


def normalise_module_name(name: str) -> str:
    return str(name or "").strip()


def normalise_module_au(au: float | int | str) -> float:
    try:
        parsed_au = float(au)
    except (TypeError, ValueError):
        raise ValueError("AU must be a valid positive number.")

    if parsed_au <= 0:
        raise ValueError("AU must be a valid positive number.")

    return parsed_au


def normalise_module_type(module_type: str) -> ModuleType:
    cleaned_type = str(module_type or "").strip()

    if cleaned_type in MODULE_TYPE_ALIASES:
        return MODULE_TYPE_ALIASES[cleaned_type]

    if cleaned_type in MODULE_TYPES:
        return cleaned_type  # type: ignore[return-value]

    return DEFAULT_MODULE_TYPE


def normalise_grade(grade: str) -> Grade:
    cleaned_grade = str(grade or "").strip().upper()

    if cleaned_grade in GRADES:
        return cleaned_grade  # type: ignore[return-value]

    return DEFAULT_GRADE


def normalise_semester(semester: str) -> str:
    return str(semester or "").strip().upper()


class ModuleBase(BaseModel):
    code: str
    name: str
    au: float = Field(gt=0)
    type: ModuleType = DEFAULT_MODULE_TYPE
    grade: Grade = DEFAULT_GRADE
    semester: str = ""

    @field_validator("code", mode="before")
    @classmethod
    def validate_code(cls, value: str) -> str:
        return normalise_module_code(value)

    @field_validator("name", mode="before")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return normalise_module_name(value)

    @field_validator("au", mode="before")
    @classmethod
    def validate_au(cls, value: float | int | str) -> float:
        return normalise_module_au(value)

    @field_validator("type", mode="before")
    @classmethod
    def validate_type(cls, value: str) -> ModuleType:
        return normalise_module_type(value)

    @field_validator("grade", mode="before")
    @classmethod
    def validate_grade(cls, value: str) -> Grade:
        return normalise_grade(value)

    @field_validator("semester", mode="before")
    @classmethod
    def validate_semester(cls, value: str) -> str:
        return normalise_semester(value)


class ModuleCreate(ModuleBase):
    id: str | None = None


class Module(ModuleBase):
    id: str = Field(default_factory=lambda: str(uuid4()))


class ModuleUpdate(BaseModel):
    code: str | None = None
    name: str | None = None
    au: float | None = Field(default=None, gt=0)
    type: ModuleType | None = None
    grade: Grade | None = None
    semester: str | None = None

    @field_validator("code", mode="before")
    @classmethod
    def validate_code(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return normalise_module_code(value)

    @field_validator("name", mode="before")
    @classmethod
    def validate_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return normalise_module_name(value)

    @field_validator("au", mode="before")
    @classmethod
    def validate_au(cls, value: float | int | str | None) -> float | None:
        if value is None:
            return None
        return normalise_module_au(value)

    @field_validator("type", mode="before")
    @classmethod
    def validate_type(cls, value: str | None) -> ModuleType | None:
        if value is None:
            return None
        return normalise_module_type(value)

    @field_validator("grade", mode="before")
    @classmethod
    def validate_grade(cls, value: str | None) -> Grade | None:
        if value is None:
            return None
        return normalise_grade(value)

    @field_validator("semester", mode="before")
    @classmethod
    def validate_semester(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return normalise_semester(value)


def create_module(module_input: ModuleCreate) -> Module:
    return Module(
        id=module_input.id or str(uuid4()),
        code=module_input.code,
        name=module_input.name,
        au=module_input.au,
        type=module_input.type,
        grade=module_input.grade,
        semester=module_input.semester,
    )


def is_su_graded_module(module: Module) -> bool:
    return module.grade == "S/U"


def get_effective_module_type_for_au(module: Module) -> ModuleType:
    original_type = normalise_module_type(module.type)

    if module.grade == "S/U" and original_type == "MPE":
        return "BDE"

    return original_type


def is_module_completed(module: Module) -> bool:
    return module.grade not in NON_COMPLETED_GRADES


def counts_toward_gpa(module: Module) -> bool:
    return module.grade not in NON_GPA_GRADES


def get_module_grade_point(module: Module) -> float | None:
    return GRADE_POINTS.get(module.grade)
