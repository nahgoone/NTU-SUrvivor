// app/services/transcriptParser/transcriptParser.constants.ts
import { GRADES } from "../../models/module";

export const NTU_SEMESTER_REGEX = /^\d{4}-\d{4} SEMESTER \d$/;

export const MODULE_CODE_REGEX = /^[A-Z]{2,4}\d{4}$/;

// jic some grades only appear in transcripts that dont match our constant definitions
export const TRANSCRIPT_ONLY_GRADE_VALUES = ["S", "U"] as const;

export const TRANSCRIPT_GRADE_VALUES = [
  ...GRADES.filter((grade) => grade !== ""),
  ...TRANSCRIPT_ONLY_GRADE_VALUES,
] as const;

export const NO_COURSE_NAME = "Imported from transcript";
