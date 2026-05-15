import { copyFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const currentFile = fileURLToPath(import.meta.url);
const scriptsDir = dirname(currentFile);
const frontendRoot = dirname(scriptsDir);

const source = join(
  frontendRoot,
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.mjs",
);

const destination = join(frontendRoot, "public", "pdf.worker.min.mjs");

if (!existsSync(source)) {
  console.warn(`PDF.js worker not found at: ${source}`);
  process.exit(0);
}

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);

console.log("Copied PDF.js worker to frontend/public/pdf.worker.min.mjs");
