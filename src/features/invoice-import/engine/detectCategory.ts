import type { TherapyCategory } from "../types/invoice";

export const CATEGORY_KEYWORDS: Record<
  TherapyCategory,
  string[]
> = {
  ABA: [
    "aba",
    "behaviour",
    "behavior",
    "bcba",
    "ibi",
    "autism",
    "behaviour consultation",
    "behaviour therapy",
  ],
  BCBA: [
    "bcba",
    "board certified",
    "behavior analyst",
  ],


  Speech: [
    "speech",
    "language",
    "slp",
    "speech therapy",
    "speech-language",
  ],

  OT: [
    "occupational",
    "occupational therapy",
    "ot",
  ],

  Psychology: [
    "psychology",
    "psychologist",
    "psych",
    "mental health",
  ],

  Physiotherapy: [
    "physio",
    "physiotherapy",
    "physical therapy",
  ],

  "Social Work": [
    "social work",
    "social worker",
  ],

  Recreation: [
    "recreation",
    "camp",
    "respite",
  ],

  Other: [],
};

export function detectCategory(
  description: string
): TherapyCategory {
  const text = description.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [
    TherapyCategory,
    string[]
  ][]) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  return "Other";
}