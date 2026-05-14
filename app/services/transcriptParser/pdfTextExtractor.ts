// app/services/transcriptParser/pdfTextExtractor.ts

import type { PdfTextItem } from "./transcriptParser.types";

export async function extractPdfTextItems(file: File): Promise<PdfTextItem[]> {
  const pdfjsLib = await import("pdfjs-dist/build/pdf.mjs");

  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  const items: PdfTextItem[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    textContent.items.forEach((item) => {
      if (!isPdfTextItem(item)) return;

      const text = item.str.trim();

      if (!text) return;

      items.push({
        pageNumber,
        text,
        x: item.transform[4],
        y: item.transform[5],
        width: item.width,
        height: item.height,
      });
    });
  }

  return items;
}

type PdfJsTextItem = {
  str: string;
  transform: number[];
  width: number;
  height: number;
};

function isPdfTextItem(item: unknown): item is PdfJsTextItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "str" in item &&
    "transform" in item &&
    "width" in item &&
    "height" in item
  );
}
