import type { Expense } from "../../../types/expense";
import type {
  ImportableTherapySession,
  TherapySession,
} from "../types/invoice";

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

export function detectDuplicates(
  sessions: TherapySession[],
  expenses: Expense[]
): ImportableTherapySession[] {
  return sessions.map((session) => {
    const duplicate = expenses.some((expense) => {
      const matchingDetails =
        normalize(expense.startDate) ===
          normalize(session.serviceDate) &&
        normalize(expense.category) ===
          normalize(session.category) &&
        normalize(expense.provider) ===
          normalize(session.provider) &&
        normalize(expense.description) ===
          normalize(session.service) &&
        Number(expense.amount) === Number(session.amount);

      if (
        session.invoiceNumber &&
        expense.invoiceNumber &&
        normalize(session.invoiceNumber) ===
          normalize(expense.invoiceNumber)
      ) {
        return matchingDetails;
      }

      return matchingDetails;
    });

    return {
      ...session,
      imported: duplicate,
      selected: !duplicate,
    };
  });
}
