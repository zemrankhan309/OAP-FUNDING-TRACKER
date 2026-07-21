import * as pdfjsLib from "pdfjs-dist";

import type { InvoiceParseResult } from "../types/invoice";

import { cleanPdfText } from "./textCleaner";
import { parseStatementSummary } from "./statementParser";
import { parseSessions } from "./sessionParser";

import { detectLayout } from "../components/layouts/detectLayout";
import { parseInvoiceBlocks } from "../parsers/invoiceBlockParser";
import { parseTable } from "../parsers/tableParser";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/**
 * Reads every page of the PDF while preserving rows.
 */
export async function extractPdfText(
  file: File
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  const pages: string[] = [];

  for (let page = 1; page <= pdf.numPages; page++) {
    const currentPage = await pdf.getPage(page);

    const content =
      await currentPage.getTextContent();

    const rows = new Map<number, string[]>();

    for (const item of content.items) {
      if (!("str" in item)) continue;

      const text = item.str.trim();

      if (!text) continue;

      const y = Math.round(item.transform[5]);

      if (!rows.has(y)) {
        rows.set(y, []);
      }

      rows.get(y)!.push(text);
    }

    const pageLines = [...rows.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, parts]) => parts.join(" "));

    pages.push(pageLines.join("\n"));
  }

  return pages.join("\n\n");
}

/**
 * Main parser entry point.
 */
export async function parseInvoice(
  file: File
): Promise<InvoiceParseResult> {
  try {
    const rawText = await extractPdfText(file);

    console.group("========== RAW PDF ==========");
    console.log(rawText);
    console.groupEnd();

    const cleaned = cleanPdfText(rawText);

    const summary =
      parseStatementSummary(cleaned);

    const layout =
      detectLayout(cleaned);

    console.log(
      "Detected layout:",
      layout
    );

    let sessions;

    switch (layout) {
      case "invoice-block":
        sessions = parseInvoiceBlocks(
          cleaned,
          summary
        );
        break;

      case "table":
        sessions = parseTable(
          cleaned,
          summary
        );
        break;

      default:
        sessions = parseSessions(
          cleaned
        );
        break;
    }

    console.group("========== PARSED ==========");
    console.log(summary);
    console.table(sessions);
    console.groupEnd();

    return {
      success: true,

      invoice: {
        summary,
        sessions,
        confidence:
          sessions.length > 0 ? 95 : 40,
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