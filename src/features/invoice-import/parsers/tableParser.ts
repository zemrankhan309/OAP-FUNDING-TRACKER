import type {
  ImportableTherapySession,
  StatementSummary,
} from "../types/invoice";

import { detectCategory } from "../engine/detectCategory";

const ROW_REGEX =
  /^(\d{4}-\d{2}-\d{2})\s+(.+?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:,\d{3})?(?:\.\d{2})?)$/;

const INVOICE_REGEX =
  /Invoice Number:\s*([A-Za-z0-9-]+)/i;

export function parseTable(
  text: string,
  summary: StatementSummary
): ImportableTherapySession[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const invoiceNumber =
    text.match(INVOICE_REGEX)?.[1] ?? "";

  const sessions: ImportableTherapySession[] = [];

  for (const line of lines) {
    const match = line.match(ROW_REGEX);

    if (!match) continue;

    const [
      ,
      serviceDate,
      service,
      ,
      amount,
    ] = match;

    sessions.push({
      id: crypto.randomUUID(),

      invoiceNumber,

      invoiceDate: summary.statementDate,

      serviceDate,

      provider:
        summary.provider || "My Place Academy",

      therapist: "",

      service,

      category: detectCategory(service),

      amount: Number(
        amount.replace(/,/g, "")
      ),

      selected: true,

      confidence: 95,

      rawText: line,
    });
  }

  console.table(sessions);

  return sessions;
}