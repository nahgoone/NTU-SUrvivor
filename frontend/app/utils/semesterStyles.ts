import { getSemesterScore } from "./semesterUtils";

type SemesterStyle = {
  container: string;
  header: string;
  strip: string;
  pill: string;
};

const SEMESTER_STYLES: SemesterStyle[] = [
  {
    container: "border-blue-200 bg-blue-50/40",
    header: "bg-blue-50",
    strip: "bg-blue-500",
    pill: "text-blue-700 ring-blue-200",
  },
  {
    container: "border-purple-200 bg-purple-50/40",
    header: "bg-purple-50",
    strip: "bg-purple-500",
    pill: "text-purple-700 ring-purple-200",
  },
  {
    container: "border-emerald-200 bg-emerald-50/40",
    header: "bg-emerald-50",
    strip: "bg-emerald-500",
    pill: "text-emerald-700 ring-emerald-200",
  },
  {
    container: "border-amber-200 bg-amber-50/40",
    header: "bg-amber-50",
    strip: "bg-amber-500",
    pill: "text-amber-700 ring-amber-200",
  },
];

const NO_SEMESTER_STYLE: SemesterStyle = {
  container: "border-gray-200 bg-gray-50/60",
  header: "bg-gray-50",
  strip: "bg-gray-400",
  pill: "text-gray-700 ring-gray-200",
};

export function getSemesterStyle(semester: string): SemesterStyle {
  const score = getSemesterScore(semester);

  if (score < 0) {
    return NO_SEMESTER_STYLE;
  }

  return SEMESTER_STYLES[score % SEMESTER_STYLES.length];
}
