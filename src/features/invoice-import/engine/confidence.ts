import { detectCategory } from "./detectCategory";
import {
  extractCurrency,
  extractDate,
} from "./normalizeText";

export interface ConfidenceResult {
  score: number;
  reasons: string[];
}

export function calculateConfidence(
  text: string
): ConfidenceResult {
  let score = 0;

  const reasons: string[] = [];

  // --------------------------
  // Date
  // --------------------------

  if (extractDate(text)) {
    score += 25;
    reasons.push("Contains a date");
  }

  // --------------------------
  // Dollar Amount
  // --------------------------

  if (extractCurrency(text) !== null) {
    score += 25;
    reasons.push("Contains an amount");
  }

  // --------------------------
  // Therapy Category
  // --------------------------

  const category = detectCategory(text);

  if (category !== "Other") {
    score += 30;
    reasons.push(`Detected ${category}`);
  }

  // --------------------------
  // Duration
  // --------------------------

  if (/\b\d+(\.\d+)?\b/.test(text)) {
    score += 10;
    reasons.push("Contains duration");
  }

  // --------------------------
  // Time Range
  // --------------------------

  if (
    /\d{1,2}:\d{2}\s?(am|pm)\s+to\s+\d{1,2}:\d{2}\s?(am|pm)/i.test(
      text
    )
  ) {
    score += 5;
    reasons.push("Contains time range");
  }

  // --------------------------
  // Clamp
  // --------------------------

  score = Math.min(score, 100);

  return {
    score,
    reasons,
  };
}