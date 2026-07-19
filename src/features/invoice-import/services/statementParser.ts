import { cleanPdfText } from "./textCleaner";
import type { StatementSummary } from "../types/invoice";

function extractMoney(text: string, label: string): number {
  const regex = new RegExp(
    `${label}\\s*\\$?([\\d,]+\\.\\d{2})`,
    "i"
  );

  const match = text.match(regex);

  if (!match) return 0;

  return Number(match[1].replace(/,/g, ""));
}

function extractAccount(text: string): string {
  const match = text.match(/Account:\s*(.+?)(?=\s{2,}|Statement|Invoice)/i);

  return match ? match[1].trim() : "";
}

function extractStatementDate(text: string): string {
  const match = text.match(
    /Printed at:\s*([A-Za-z]+\s+\d{1,2},\s+\d{4})/i
  );

  return match ? match[1] : "";
}

export function parseStatementSummary(
  rawText: string
): StatementSummary {
  const text = cleanPdfText(rawText);

  return {
    provider: text.includes("talk-talk")
      ? "Talk Talk"
      : "",

    childName: "",

    accountName: extractAccount(text),

    accountNumber: "",

    statementDate: extractStatementDate(text),

    totalInvoiced: extractMoney(text, "Total Invoiced"),

    totalPaid: extractMoney(text, "Total Paid"),

    balance: extractMoney(text, "Balance"),
  };
}