import { copyFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const source = "node_modules/pdfjs-dist/build/pdf.worker.min.mjs";
const destination = "public/pdf.worker.min.mjs";

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);

console.log("Copied PDF.js worker to public/pdf.worker.min.mjs");
