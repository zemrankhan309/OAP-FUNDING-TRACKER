export type LayoutType =
  | "invoice-block"
  | "table"
  | "ledger"
  | "generic";

/**
 * Detects the overall structure of a PDF rather than the provider.
 * This allows multiple providers to share the same parser.
 */
export function detectLayout(text: string): LayoutType {
  const normalized = text
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();

  //
  // Invoice Block Layout
  //
  // Example:
  //
  // Invoice #8545-P01 $150.00
  // October 7, 2025...
  // Description...
  //
  if (
    /invoice\s*#/i.test(normalized) &&
    /\$\s*\d+(?:,\d{3})*(?:\.\d{2})?/.test(normalized)
  ) {
    return "invoice-block";
  }

  //
  // Table Layout
  //
  // Example:
  //
  // Date
  // Details
  // Hours
  // Amount
  //
  const hasDate = /\bdate\b/i.test(normalized);
  const hasAmount = /\bamount\b/i.test(normalized);
  const hasHours = /\bhours?\b/i.test(normalized);
  const hasDetails =
    /\bdetails\b/i.test(normalized) ||
    /\bdescription\b/i.test(normalized);

  if (
    hasDate &&
    hasAmount &&
    (hasHours || hasDetails)
  ) {
    return "table";
  }

  //
  // Ledger Layout
  //
  // Example:
  //
  // Date  Debit Credit Balance
  //
  const hasDebit = /\bdebit\b/i.test(normalized);
  const hasCredit = /\bcredit\b/i.test(normalized);
  const hasBalance = /\bbalance\b/i.test(normalized);

  if (
    hasDate &&
    (hasDebit || hasCredit || hasBalance)
  ) {
    return "ledger";
  }

  return "generic";
}