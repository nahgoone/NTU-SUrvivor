// app/services/transcriptParser/ntuTranscriptParser.ts

import { normaliseGrade, Grade } from "../../models/module";
import {
  MODULE_CODE_REGEX,
  NO_COURSE_NAME,
  NTU_SEMESTER_REGEX,
  TRANSCRIPT_GRADE_VALUES,
} from "./transcriptParser.constants";

import type {
  ParsedTranscriptModule,
  PdfTextItem,
  TranscriptParseResult,
  TranscriptSummary,
} from "./transcriptParser.types";

type SemesterBlock = {
  semester: string;
  pageNumber: number;
  xStart: number;
  xEnd: number;
  yTop: number;
  yBottom: number;
};

type TextRow = {
  y: number;
  items: PdfTextItem[];
  text: string;
};

const ROW_Y_TOLERANCE = 3;

export function parseNtuTranscript(
  textItems: PdfTextItem[],
): TranscriptParseResult {
  const warnings: string[] = [];

  const semesterBlocks = getSemesterBlocks(textItems);

  if (semesterBlocks.length === 0) {
    return {
      modules: [],
      summary: parseTranscriptSummary(textItems),
      warnings: ["No NTU semester sections were found in the PDF."],
    };
  }

  const firstAcademicYearStartYear =
    inferFirstAcademicYearStartYear(semesterBlocks);

  const modules = semesterBlocks.flatMap((block) =>
    parseSemesterBlock(textItems, block, warnings, firstAcademicYearStartYear),
  );

  return {
    modules,
    summary: parseTranscriptSummary(textItems),
    warnings,
  };
}

function getSemesterBlocks(items: PdfTextItem[]): SemesterBlock[] {
  const semesterHeaders = items
    .filter((item) => NTU_SEMESTER_REGEX.test(item.text))
    .sort((a, b) => {
      if (a.pageNumber !== b.pageNumber) return a.pageNumber - b.pageNumber;
      if (Math.abs(b.y - a.y) > ROW_Y_TOLERANCE) return b.y - a.y;
      return a.x - b.x;
    });

  return semesterHeaders.map((header) => {
    const isLeftColumn = header.x < 300;

    const sameColumnHeadersBelow = semesterHeaders.filter(
      (other) =>
        other.pageNumber === header.pageNumber &&
        other.x < 300 === isLeftColumn &&
        other.y < header.y,
    );

    const nextHeaderBelow = sameColumnHeadersBelow.sort((a, b) => b.y - a.y)[0];

    return {
      semester: normaliseSemesterLabel(header.text),
      pageNumber: header.pageNumber,
      xStart: isLeftColumn ? 40 : 300,
      xEnd: isLeftColumn ? 300 : 580,
      yTop: header.y,
      yBottom: nextHeaderBelow ? nextHeaderBelow.y + 10 : 80,
    };
  });
}

function parseSemesterBlock(
  allItems: PdfTextItem[],
  block: SemesterBlock,
  warnings: string[],
  firstAcademicYearStartYear: number | null,
): ParsedTranscriptModule[] {
  const blockItems = allItems.filter(
    (item) =>
      item.pageNumber === block.pageNumber &&
      item.x >= block.xStart &&
      item.x <= block.xEnd &&
      item.y < block.yTop &&
      item.y > block.yBottom,
  );

  const rows = groupItemsIntoRows(blockItems);

  const modules: ParsedTranscriptModule[] = [];

  rows.forEach((row, index) => {
    const code = findModuleCode(row);

    if (!code) return;

    const au = findAu(row);
    const grade = findGrade(row);

    if (!au || !grade) {
      warnings.push(
        `Could not fully parse ${code} in ${block.semester}. Please check manually.`,
      );
      return;
    }

    const name = findCourseName(rows, index, code, au);

    modules.push({
      code,
      name,
      au,
      type: inferModuleType(code),
      grade: normaliseTranscriptGrade(grade),
      semester: toAppSemester(block.semester, firstAcademicYearStartYear),
      source: "ntu-transcript",
    });
  });

  return modules;
}
function groupItemsIntoRows(items: PdfTextItem[]): TextRow[] {
  const sortedItems = [...items].sort((a, b) => {
    if (Math.abs(b.y - a.y) > ROW_Y_TOLERANCE) return b.y - a.y;
    return a.x - b.x;
  });

  const rows: TextRow[] = [];

  sortedItems.forEach((item) => {
    const existingRow = rows.find(
      (row) => Math.abs(row.y - item.y) <= ROW_Y_TOLERANCE,
    );

    if (existingRow) {
      existingRow.items.push(item);
      existingRow.items.sort((a, b) => a.x - b.x);
      existingRow.text = existingRow.items
        .map((rowItem) => rowItem.text)
        .join(" ");
      return;
    }

    rows.push({
      y: item.y,
      items: [item],
      text: item.text,
    });
  });

  return rows;
}

function findModuleCode(row: TextRow): string | null {
  const token = row.items.find((item) => MODULE_CODE_REGEX.test(item.text));

  return token?.text ?? null;
}

function findAu(row: TextRow): number | null {
  const auItem = row.items.find((item) => /^\d+(\.\d+)?$/.test(item.text));

  if (!auItem) return null;

  const au = Number(auItem.text);

  return Number.isFinite(au) && au > 0 ? au : null;
}

function findGrade(row: TextRow): string | null {
  const gradeItem = row.items.find((item) =>
    TRANSCRIPT_GRADE_VALUES.includes(item.text as never),
  );

  return gradeItem?.text ?? null;
}

function findCourseName(
  rows: TextRow[],
  rowIndex: number,
  code: string,
  au: number,
): string {
  const row = rows[rowIndex];

  const firstLine = row.items
    .filter((item) => {
      if (item.text === code) return false;
      if (item.text === String(au) || item.text === au.toFixed(1)) return false;
      if (TRANSCRIPT_GRADE_VALUES.includes(item.text as never)) return false;
      if (/^\d+(\.\d+)?$/.test(item.text)) return false;

      return true;
    })
    .map((item) => item.text)
    .join(" ")
    .trim();

  const continuationLines: string[] = [];

  for (let i = rowIndex + 1; i < rows.length; i += 1) {
    const nextRow = rows[i];

    if (findModuleCode(nextRow)) break;
    if (nextRow.text.includes("No. of Academic Units Earned")) break;
    if (nextRow.text.includes("Cumulative Grade Point Average")) break;

    const continuationText = nextRow.text.trim();

    if (continuationText) {
      continuationLines.push(continuationText);
    }
  }

  const fullName = [firstLine, ...continuationLines].join(" ").trim();

  return fullName || NO_COURSE_NAME;
}

function normaliseTranscriptGrade(grade: string): Grade {
  const cleanedGrade = grade.trim().toUpperCase();

  if (cleanedGrade === "S" || cleanedGrade === "U") return "S/U";

  return normaliseGrade(cleanedGrade);
}

function normaliseSemesterLabel(label: string): string {
  return label.trim().toUpperCase();
}

function toAppSemester(
  semesterLabel: string,
  firstAcademicYearStartYear: number | null,
): string {
  const parsedSemester = parseAcademicSemesterLabel(semesterLabel);

  if (!parsedSemester || firstAcademicYearStartYear === null) {
    return semesterLabel;
  }

  const yearLevel = Math.max(
    parsedSemester.startYear - firstAcademicYearStartYear + 1,
    1,
  );

  return `Y${yearLevel}S${parsedSemester.semester}`;
}

function inferFirstAcademicYearStartYear(
  semesterBlocks: SemesterBlock[],
): number | null {
  const startYears = semesterBlocks
    .map((block) => parseAcademicSemesterLabel(block.semester)?.startYear)
    .filter((startYear): startYear is number => startYear !== undefined);

  if (startYears.length === 0) {
    return null;
  }

  return Math.min(...startYears);
}

function parseAcademicSemesterLabel(semesterLabel: string): {
  startYear: number;
  semester: number;
} | null {
  const match = semesterLabel
    .trim()
    .toUpperCase()
    .match(/^(\d{4})-\d{4} SEMESTER (\d)$/);

  if (!match) {
    return null;
  }

  return {
    startYear: Number(match[1]),
    semester: Number(match[2]),
  };
}

function inferModuleType(code: string): string {
  if (code.startsWith("CC")) return "ICC";
  if (code.startsWith("ML")) return "ICC";
  if (code.startsWith("HW")) return "ICC";

  // Transcript does not reliably indicate Core vs MPE.
  // Let users edit this later in Module Manager.
  if (code.startsWith("SC")) return "Core";

  return "Other";
}

function parseTranscriptSummary(items: PdfTextItem[]): TranscriptSummary {
  const joinedText = items.map((item) => item.text).join(" ");

  const cgpaMatch = joinedText.match(
    /Cumulative Grade Point Average\s*:\s*(\d+(\.\d+)?)/i,
  );

  const totalAuMatch = joinedText.match(
    /TOTAL ACADEMIC UNITS EARNED\s*:\s*(\d+(\.\d+)?)/i,
  );

  return {
    cgpa: cgpaMatch ? Number(cgpaMatch[1]) : undefined,
    totalAcademicUnitsEarned: totalAuMatch
      ? Number(totalAuMatch[1])
      : undefined,
  };
}
