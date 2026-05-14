// app/services/transcriptParser/transcriptParser.types.ts

import type { CreateModuleInput } from "../../models/module";

export type PdfTextItem = {
  pageNumber: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ParsedTranscriptModule = CreateModuleInput & {
  source: "ntu-transcript";
};

export type TranscriptSummary = {
  cgpa?: number;
  totalAcademicUnitsEarned?: number;
};

export type TranscriptParseResult = {
  modules: ParsedTranscriptModule[];
  summary: TranscriptSummary;
  warnings: string[];
};
