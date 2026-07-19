import { saveExpense } from "../../../services/expenseEngine";

import type { ImportableTherapySession } from "../types/invoice";

export interface ImportResult {
  imported: number;
  skipped: number;
  failed: number;
  errors: string[];
}

export async function importSessions(
  uid: string,
  allocationId: string,
  sessions: ImportableTherapySession[]
): Promise<ImportResult> {
  let imported = 0;
  let skipped = 0;
  let failed = 0;

  const errors: string[] = [];

  const selectedSessions = sessions.filter(
    (session) => session.selected && !session.imported
  );

  skipped = sessions.length - selectedSessions.length;

  for (const session of selectedSessions) {
    try {
      await saveExpense(uid, {
        allocationId,

        category: session.category,

        provider: session.provider ?? "",

        description: session.service,

        amount: session.amount,

        startDate: session.serviceDate,

        endDate: session.serviceDate,

        notes: "",

        therapist: session.therapist,

        invoiceNumber: session.invoiceNumber,

        source: "invoice-import",

        status: "approved",
      });

      session.imported = true;
      imported++;
    } catch (error) {
      failed++;

      const message =
        error instanceof Error
          ? error.message
          : "Unknown import error";

      errors.push(
        `${session.invoiceNumber} (${session.serviceDate}): ${message}`
      );
    }
  }

  return {
    imported,
    skipped,
    failed,
    errors,
  };
}