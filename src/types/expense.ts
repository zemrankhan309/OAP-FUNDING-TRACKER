export interface Expense {
  /** Firestore document ID */
  id: string;

  /** Funding allocation this expense belongs to */
  allocationId: string;

  /** Expense category */
  category: string;

  /** Provider or clinic */
  provider: string;

  /** Description of the service/session */
  description: string;

  /** Expense amount */
  amount: number;

  /** Service start date */
  startDate: string;

  /** Service end date */
  endDate: string;

  /** Optional notes */
  notes?: string;

  /** Optional therapist name */
  therapist?: string;

  /** Optional invoice number */
  invoiceNumber?: string;

  /** Where the expense originated */
  source: "manual" | "invoice-import" | "email-import";

  /** Workflow status */
  status?: "pending" | "approved" | "rejected";

  /** Firestore timestamp */
  createdAt?: unknown;
}