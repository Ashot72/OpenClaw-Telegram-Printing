import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import PDFDocument from "pdfkit";

const execPromise = promisify(exec);

function writePdfToFile(text, pdfPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);
    doc.fontSize(12).font("Helvetica").text(text);
    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

async function sendToPrinter(pdfPath) {
  const escaped = pdfPath.replace(/'/g, "''");
  await execPromise(
    `powershell -NoProfile -Command "Start-Process -FilePath '${escaped}' -Verb Print"`,
    { windowsHide: true }
  );
  setTimeout(() => {
    try {
      fs.unlinkSync(pdfPath);
    } catch (_) {}
  }, 10000);
}

export async function print(text, pdfPath) {
  await writePdfToFile(text, pdfPath);
  await sendToPrinter(pdfPath);
}

export default { print };
