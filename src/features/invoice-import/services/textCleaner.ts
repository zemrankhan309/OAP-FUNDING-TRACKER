/**
 * Cleans and normalizes PDF text before parsing.
 */
export function cleanPdfText(rawText: string): string {
  return rawText
    // normalize line endings
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")

    // collapse repeated spaces
    .replace(/[ \t]+/g, " ")

    // remove empty lines
    .replace(/\n{2,}/g, "\n")

    // trim whitespace
    .trim();
}