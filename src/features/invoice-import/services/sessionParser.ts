import type { TherapySession } from "../types/invoice";
import { cleanPdfText } from "./textCleaner";

/**
 * Extracts therapy sessions from a Talk Talk statement.
 *
 * Example line:
 * Invoice #2666-P01 Saif Khan May 21, 2024 - 2:00pm,
 * Speech and Language Therapy (60 minutes)
 * ...
 * $150.00
 */
export function parseSessions(rawText: string): TherapySession[] {
  const text = cleanPdfText(rawText);

  const sessions: TherapySession[] = [];

  const invoiceRegex =
    /Invoice\s+#(\d+)[\s\S]*?([A-Z][a-z]+\s+\d{1,2},\s+\d{4})[\s\S]*?(Speech and Language Therapy|Speech and Language Assessment|ABA Therapy|Occupational Therapy|Psychology)[\s\S]*?\$([\d,]+\.\d{2})/gi;

  let match: RegExpExecArray | null;

  while ((match = invoiceRegex.exec(text)) !== null) {
    sessions.push({
      invoiceNumber: match[1],

      invoiceDate: match[2],

      serviceDate: match[2],

      provider: "Talk Talk",

      therapist: "",

      service: match[3],

      category: determineCategory(match[3]),

      amount: Number(match[4].replace(",", "")),
    });
  }

  return sessions;
}

function determineCategory(service: string): string {
  const value = service.toLowerCase();

  if (value.includes("speech")) return "Speech";
  if (value.includes("occupational")) return "OT";
  if (value.includes("aba")) return "ABA";
  if (value.includes("psychology")) return "Psychology";

  return "Other";
}