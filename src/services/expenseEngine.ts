import { createExpense, updateExpense } from "./expenseService";

import type { Expense } from "../types/expense";

/**
 * Data required to save an expense.
 */
export type ExpenseInput = Omit<
  Expense,
  "id" | "createdAt"
>;

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