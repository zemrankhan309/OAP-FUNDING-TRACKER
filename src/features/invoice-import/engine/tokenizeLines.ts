import { detectCategory } from "./detectCategory";
import {
  extractCurrency,
  extractDate,
  isDuration,
} from "./normalizeText";

import type { TherapyCategory } from "../types/invoice";

export type TokenType =
  | "date"
  | "description"
  | "hours"
  | "amount"
  | "subtotal"
  | "tax"
  | "total"
  | "header"
  | "unknown";

export interface LineToken {
  index: number;

  text: string;

  type: TokenType;

  date: string | null;

  amount: number | null;

  duration: number | null;

  category: TherapyCategory;

  hasTimeRange: boolean;
}

function detectType(
  line: string,
  date: string | null,
  amount: number | null,
  duration: number | null
): TokenType {
  const lower = line.toLowerCase();

  if (lower.includes("subtotal")) return "subtotal";

  if (lower.includes("hst") || lower.includes("tax")) return "tax";

  if (/^total\b/i.test(line)) return "total";

  if (
    lower === "date" ||
    lower === "details" ||
    lower === "service" ||
    lower === "hours" ||
    lower === "amount"
  ) {
    return "header";
  }

  if (date) return "date";

  if (duration !== null) return "hours";

  if (amount !== null) return "amount";

  if (detectCategory(line) !== "Other" || /therapy/i.test(line)) {
    return "description";
  }

  return "unknown";
}

export function tokenizeLines(text: string): LineToken[] {
  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => {
    const date = extractDate(line);

    const amount = extractCurrency(line);

    const duration = isDuration(line)
      ? Number(line)
      : null;

    const category = detectCategory(line) as TherapyCategory;

    const hasTimeRange =
      /\d{1,2}:\d{2}\s?(am|pm)\s+to\s+\d{1,2}:\d{2}\s?(am|pm)/i.test(
        line
      );

    return {
      index,
      text: line,
      type: detectType(line, date, amount, duration),
      date,
      amount,
      duration,
      category,
      hasTimeRange,
    };
  });
}