export interface CandidateSession {
  /**
   * Temporary unique identifier.
   */
  id: string;

  /**
   * Original line(s) extracted from the PDF.
   * Useful for debugging and user review.
   */
  rawText: string;

  /**
   * Confidence score (0–100).
   */
  confidence: number;

  /**
   * Parsed values.
   */
  serviceDate: string | null;

  description: string;

  amount: number | null;

  category: string;

  provider: string;

  therapist: string;

  invoiceNumber: string;

  invoiceDate: string;

  /**
   * Whether the user has selected this row for import.
   */
  selected: boolean;
}