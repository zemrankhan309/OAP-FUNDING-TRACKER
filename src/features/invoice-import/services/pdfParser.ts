import * as pdfjsLib from "pdfjs-dist";

import type { InvoiceParseResult } from "../types/invoice";

import { cleanPdfText } from "./textCleaner";
import { parseStatementSummary } from "./statementParser";
import { parseSessions } from "./sessionParser";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/**
 * Reads every page of the PDF and returns all text.
 */
export async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  let text = "";

  for (let page = 1; page <= pdf.numPages; page++) {
    const currentPage = await pdf.getPage(page);

    const content = await currentPage.getTextContent();

    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");

    text += pageText + "\n";
  }

  return text;
}

/**
 * Main parser entry point.
 */
export async function parseInvoice(
  file: File
): Promise<InvoiceParseResult> {
  try {
    const rawText = await extractPdfText(file);

    const cleaned = cleanPdfText(rawText);

    const summary = parseStatementSummary(cleaned);

    const sessions = parseSessions(cleaned);

    return {
      success: true,

      invoice: {
        summary,
        sessions,
        confidence: sessions.length > 0 ? 95 : 40,
        rawText: cleaned,
      },

      errors: [],
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      errors: ["Unable to parse PDF."],
    };
  }
}