import type { Expense } from "../../../types/expense";
import type { TherapySession } from "../types/invoice";

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

export function detectDuplicates(
  sessions: TherapySession[],
  expenses: Expense[]
): TherapySession[] {
  return sessions.map((session) => {
    const duplicate = expenses.some((expense) => {
      // Strong match when invoice numbers exist
      if (
        session.invoiceNumber &&
        expense.invoiceNumber &&
        normalize(session.invoiceNumber) ===
          normalize(expense.invoiceNumber)
      ) {
        return Number(expense.amount) === Number(session.amount);
      }

      // Fallback match for invoices without numbers
      return (
        normalize(expense.startDate) ===
          normalize(session.serviceDate) &&
        normalize(expense.category) ===
          normalize(session.service) &&
        Number(expense.amount) === Number(session.amount) &&
        normalize(expense.provider) ===
          normalize(session.provider)
      );
    });

    return {
      ...session,
      imported: duplicate,
      selected: !duplicate,
    };
  });
}