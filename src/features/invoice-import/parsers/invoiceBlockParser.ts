import type {
  ImportableTherapySession,
  StatementSummary,
} from "../types/invoice";

import { detectCategory } from "../engine/detectCategory";
import { extractCurrency } from "../engine/normalizeText";

const INVOICE_REGEX = /Invoice\s*#\s*([A-Za-z0-9-]+)/i;

const DATE_REGEX =
  /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/i;

const FOOTER_REGEX =
  /^(subtotal|total|payer total|payments?|printed at|page\s+\d+)/i;

/**
 * Parses invoice-block style PDFs.
 *
 * Example:
 *
 * Invoice #8545-P01 $150.00
 * October 7, 2025 - 11:00am
 * Speech and Language Therapy (60 minutes)
 *
 * Invoice #8620-P01 $150.00
 * ...
 */
export function parseInvoiceBlocks(
  text: string,
  summary: StatementSummary
): ImportableTherapySession[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const sessions: ImportableTherapySession[] = [];

  let currentBlock: string[] = [];

  const flush = () => {
    if (!currentBlock.length) return;

    const session = parseBlock(currentBlock, summary);

    if (session) {
      sessions.push(session);
    }

    currentBlock = [];
  };

  for (const line of lines) {
    if (FOOTER_REGEX.test(line)) {
      continue;
    }

    if (INVOICE_REGEX.test(line)) {
      flush();
    }

    currentBlock.push(line);
  }

  flush();

  return sessions;
}

function parseBlock(
  block: string[],
  summary: StatementSummary
): ImportableTherapySession | null {
  const rawText = block.join("\n");

  const invoiceMatch = rawText.match(INVOICE_REGEX);

  if (!invoiceMatch) {
    return null;
  }

  const invoiceNumber = invoiceMatch[1];

  const invoiceLine =
  block.find((line) => INVOICE_REGEX.test(line)) ?? "";

const amount =
  extractCurrency(invoiceLine) ?? 0;

  const serviceDate =
    block.find((line) => DATE_REGEX.test(line)) ?? "";

const service =
  block.find((line) =>
    /Speech|Language Therapy|ABA|Occupational Therapy|OT|Psychology|Physiotherapy/i.test(
      line
    )
  ) ?? "";

  return {
    id: crypto.randomUUID(),

    invoiceNumber,

    invoiceDate: summary.statementDate,

    serviceDate,

    provider: summary.provider,

    therapist: "",

    service,

    category: detectCategory(service),

    amount,

    selected: true,

    confidence: 95,

    rawText,
  };
}