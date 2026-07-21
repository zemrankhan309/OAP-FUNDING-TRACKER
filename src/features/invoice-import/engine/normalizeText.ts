/**
 * Normalizes raw text extracted from PDFs so downstream parsing
 * can work with a consistent format regardless of the invoice provider.
 */
export function normalizeText(text: string): string {
  return text
    // Normalize line endings
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")

    // Replace tabs with spaces
    .replace(/\t/g, " ")

    // Replace non-breaking spaces
    .replace(/\u00A0/g, " ")

    // Collapse multiple spaces
    .replace(/[ ]{2,}/g, " ")

    // Remove trailing whitespace
    .replace(/[ \t]+$/gm, "")

    // Collapse excessive blank lines
    .replace(/\n{3,}/g, "\n\n")

    .trim();
}

/**
 * Returns all non-empty trimmed lines.
 */
export function getLines(text: string): string[] {
  return normalizeText(text)
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
}

/**
 * Converts "$1,234.56" into 1234.56
 */
export function normalizeCurrency(value: string): number {
  return Number(
    value
      .replace(/\$/g, "")
      .replace(/,/g, "")
      .trim()
  );
}

/**
 * Returns true if the string appears to be a currency value.
 */
export function isCurrency(value: string): boolean {
  const text = value.trim();

  return (
    /^\$\s*\d[\d,]*(\.\d{2})?$/.test(text) ||
    /^\d[\d,]*\.\d{2}$/.test(text)
  );
}

/**
 * Returns true if the string appears to be a duration or hours value.
 *
 * Examples:
 * 3
 * 3.0
 * 3.00
 * 1.5
 */
export function isDuration(value: string): boolean {
  return /^\d+(\.\d+)?$/.test(value.trim());
}

/**
 * Returns true if the string looks like a supported date.
 */
export function isDate(value: string): boolean {
  const text = value.trim();

  const patterns = [
    /^\d{4}-\d{2}-\d{2}$/, // 2024-12-03
    /^\d{4}\/\d{2}\/\d{2}$/, // 2024/12/03
    /^\d{2}\/\d{2}\/\d{4}$/, // 12/03/2024
    /^\d{1,2}-[A-Za-z]{3}-\d{4}$/, // 03-Dec-2024
    /^[A-Za-z]{3,9}\s+\d{1,2},\s+\d{4}$/ // May 21, 2024
  ];

  return patterns.some(pattern => pattern.test(text));
}

/**
 * Attempts to locate a currency amount in a string.
 *
 * Rules:
 * - Prefer values with a dollar sign.
 * - Otherwise require exactly two decimal places.
 * - Ignore IDs such as:
 *     CASLPO #4230
 *     Invoice #8545-P01
 *     Account 123456
 */
export function extractCurrency(text: string): number | null {
  // Prefer explicit currency values
  const dollarMatches = text.match(/\$\s*\d[\d,]*(?:\.\d{2})?/g);

  if (dollarMatches && dollarMatches.length > 0) {
    return normalizeCurrency(
      dollarMatches[dollarMatches.length - 1]
    );
  }

  // Otherwise only allow numbers with exactly 2 decimals
  const decimalMatches = text.match(
    /\b\d[\d,]*\.\d{2}\b/g
  );

  if (decimalMatches && decimalMatches.length > 0) {
    return normalizeCurrency(
      decimalMatches[decimalMatches.length - 1]
    );
  }

  return null;
}

/**
 * Attempts to locate the first supported date in a string.
 */
export function extractDate(text: string): string | null {
  const patterns = [
    /\d{4}-\d{2}-\d{2}/,
    /\d{4}\/\d{2}\/\d{2}/,
    /\d{2}\/\d{2}\/\d{4}/,
    /\d{1,2}-[A-Za-z]{3}-\d{4}/,
    /[A-Za-z]{3,9}\s+\d{1,2},\s+\d{4}/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      return match[0];
    }
  }

  return null;
}