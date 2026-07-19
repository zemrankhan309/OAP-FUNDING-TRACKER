export interface StatementSummary {
  provider: string;
  childName: string;
  accountName: string;
  accountNumber: string;

  statementDate: string;

  totalInvoiced: number;
  totalPaid: number;
  balance: number;
}

export interface TherapySession {
  invoiceNumber: string;

  invoiceDate: string;

  serviceDate: string;

  provider: string;

  therapist: string;

  service: string;

  category: string;

  amount: number;

  imported?: boolean;
}

/**
 * UI model used during the import workflow.
 * Adds selection state without modifying the persisted model.
 */
export interface ImportableTherapySession
  extends TherapySession {
  selected: boolean;
}

export interface ParsedInvoice {
  summary: StatementSummary;

  sessions: TherapySession[];

  confidence: number;

  rawText: string;
}

export interface InvoiceParseResult {
  success: boolean;

  invoice?: ParsedInvoice;

  errors: string[];
}