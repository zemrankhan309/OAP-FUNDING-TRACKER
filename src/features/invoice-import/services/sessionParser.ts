import type { ImportableTherapySession } from "../types/invoice";

import { cleanPdfText } from "./textCleaner";

import { normalizeText } from "../engine/normalizeText";
import { extractInvoiceMetadata } from "../engine/extractInvoiceMetadata";
import { buildSessions } from "../engine/buildSessions";

/**
 * Import Engine V2
 *
 * Converts extracted PDF text into therapy sessions using the
 * provider-agnostic parsing engine.
 */
export function parseSessions(rawText: string): ImportableTherapySession[] {
  // Clean common PDF extraction artifacts.
  const cleaned = cleanPdfText(rawText);

  // Normalize whitespace, line endings, etc.
  const normalized = normalizeText(cleaned);

  // Extract document-level metadata once.
  const metadata = extractInvoiceMetadata(normalized);

  // Build sessions using the generic parsing engine.
  const sessions = buildSessions(normalized, metadata);

  return sessions;
}