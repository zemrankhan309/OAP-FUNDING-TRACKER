import {
  createExpense,
  getExpenses,
  updateExpense,
} from "./expenseService";

import type { Expense } from "../types/expense";

/**
 * Data required to save an expense.
 */
export type ExpenseInput = Omit<
  Expense,
  "id" | "createdAt"
>;

export const DUPLICATE_INVOICE_EXPENSE_ERROR =
  "This invoice session was already imported.";

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function isDuplicateInvoiceExpense(
  existingExpense: Expense,
  expense: ExpenseInput
) {
  return (
    normalize(existingExpense.invoiceNumber) ===
      normalize(expense.invoiceNumber) &&
    normalize(existingExpense.startDate) ===
      normalize(expense.startDate) &&
    normalize(existingExpense.category) ===
      normalize(expense.category) &&
    normalize(existingExpense.provider) ===
      normalize(expense.provider) &&
    normalize(existingExpense.description) ===
      normalize(expense.description) &&
    Number(existingExpense.amount) === Number(expense.amount)
  );
}

/**
 * Basic validation shared by every expense source.
 */
function validateExpense(expense: ExpenseInput) {
  if (!expense.allocationId) {
    throw new Error("Funding allocation is required.");
  }

  if (expense.amount <= 0) {
    throw new Error(
      "Expense amount must be greater than zero."
    );
  }

  if (!expense.category.trim()) {
    throw new Error("Expense category is required.");
  }

  if (!expense.provider.trim()) {
    throw new Error("Provider is required.");
  }

  if (!expense.description.trim()) {
    throw new Error("Description is required.");
  }

  if (!expense.startDate) {
    throw new Error("Start date is required.");
  }

  if (!expense.endDate) {
    throw new Error("End date is required.");
  }

  if (expense.endDate < expense.startDate) {
    throw new Error(
      "End date cannot be before the start date."
    );
  }
}

/**
 * Creates a new expense.
 */
export async function saveExpense(
  uid: string,
  expense: ExpenseInput
) {
  validateExpense(expense);

  const normalizedExpense: ExpenseInput = {
    ...expense,

    provider: expense.provider.trim(),

    description: expense.description.trim(),

    notes: expense.notes?.trim() ?? "",

    therapist: expense.therapist?.trim() ?? "",

    invoiceNumber:
      expense.invoiceNumber?.trim() ?? "",

    status: expense.status ?? "approved",

    source: expense.source ?? "manual",
  };

  if (normalizedExpense.source === "invoice-import") {
    const existingExpenses = await getExpenses(uid);

    if (
      existingExpenses.some((existingExpense) =>
        isDuplicateInvoiceExpense(
          existingExpense,
          normalizedExpense
        )
      )
    ) {
      throw new Error(DUPLICATE_INVOICE_EXPENSE_ERROR);
    }
  }

  await createExpense(uid, normalizedExpense);
}

/**
 * Updates an existing expense.
 */
export async function saveExistingExpense(
  uid: string,
  expenseId: string,
  expense: ExpenseInput
) {
  validateExpense(expense);

  const normalizedExpense: ExpenseInput = {
    ...expense,

    provider: expense.provider.trim(),

    description: expense.description.trim(),

    notes: expense.notes?.trim() ?? "",

    therapist: expense.therapist?.trim() ?? "",

    invoiceNumber:
      expense.invoiceNumber?.trim() ?? "",

    status: expense.status ?? "approved",

    source: expense.source ?? "manual",
  };

  await updateExpense(
    uid,
    expenseId,
    normalizedExpense
  );
}
