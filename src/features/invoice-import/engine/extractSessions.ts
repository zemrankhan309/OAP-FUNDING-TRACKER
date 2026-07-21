import { detectCategory } from "./detectCategory";
import {
  extractCurrency,
  extractDate,
  getLines,
} from "./normalizeText";

import type { ImportableTherapySession } from "../types/invoice";

export function extractSessions(text: string): ImportableTherapySession[] {
  const lines = getLines(text);

  const sessions: ImportableTherapySession[] = [];

  let invoiceNumber = extractInvoiceNumber(text);
  let invoiceDate = extractInvoiceDate(text);

  let sessionIndex = 0;

  for (const line of lines) {
    const date = extractDate(line);

    if (!date) {
      continue;
    }

    const amount = extractCurrency(line);

    if (amount === null) {
      continue;
    }

    const description = cleanDescription(line, date);

    if (!description) {
      continue;
    }

    sessionIndex++;

    sessions.push({
      id: `${invoiceNumber}-${sessionIndex}`,

      invoiceNumber,

      invoiceDate,

      serviceDate: date,

      provider: "",

      therapist: "",

      service: description,

      category: detectCategory(description),

      amount,

      selected: true,

      confidence: 70,

      rawText: line,
    });
  }

  return sessions;
}

function cleanDescription(
  line: string,
  date: string
): string {
  let description = line;

  description = description.replace(date, "");

  description = description.replace(
    /\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?/,
    ""
  );

  description = description.replace(
    /\b\d+(\.\d+)?\b/,
    ""
  );

  return description.replace(/\s+/g, " ").trim();
}

function extractInvoiceNumber(
  text: string
): string {
  const patterns = [
    /Invoice Number[:\s]*([A-Za-z0-9-]+)/i,
    /Invoice #[:\s]*([A-Za-z0-9-]+)/i,
    /Invoice No\.?[:\s]*([A-Za-z0-9-]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      return match[1];
    }
  }

  return "UNKNOWN";
}

function extractInvoiceDate(
  text: string
): string {
  const patterns = [
    /Invoice Date[:\s]*(.+)/i,
    /Date[:\s]*(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      return match[1].trim();
    }
  }

  return "";
}