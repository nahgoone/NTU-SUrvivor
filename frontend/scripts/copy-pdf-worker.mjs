import { copyFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

const source = "../node_modules/pdfjs-dist/build/pdf.worker.min.mjs";
const destination = "public/pdf.worker.min.mjs";

if (!existsSync(source)) {
  console.warn("PDF.js worker not found. Skipping worker copy.");
  process.exit(0);
}

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);

console.log("Copied PDF.js worker to public/pdf.worker.min.mjs");
