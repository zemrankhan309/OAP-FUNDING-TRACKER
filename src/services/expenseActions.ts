import type { Expense } from "../types/expense";
import type { Allocation } from "../types/allocation";

import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenses,
} from "./expenseService";

import { getAllocations } from "./allocationService";

/**
 * Load expenses for the selected child.
 */
export async function loadExpenses(
  uid: string,
  childId: string
): Promise<{
  expenses: Expense[];
  allocations: Allocation[];
}> {
  const [expenses, allocations] = await Promise.all([
    getExpenses(uid),
    getAllocations(uid),
  ]);

  // Only this child's allocations
  const childAllocations = allocations.filter(
    (allocation: any) =>
      allocation.childId === childId
  );

  // Allocation IDs for this child
  const allocationIds = childAllocations.map(
    (allocation) => allocation.id
  );

  // Only expenses belonging to this child's allocations
  const childExpenses = expenses.filter(
    (expense: any) =>
      allocationIds.includes(expense.allocationId)
  );

  return {
    expenses: childExpenses,
    allocations: childAllocations,
  };
}

/**
 * Create Expense
 */
export async function addExpense(
  uid: string,
  expense: Omit<Expense, "id" | "createdAt">
) {
  await createExpense(uid, expense);
}

/**
 * Update Expense
 */
export async function editExpense(
  uid: string,
  expenseId: string,
  expense: Omit<Expense, "id" | "createdAt">
) {
  await updateExpense(uid, expenseId, expense);
}

/**
 * Delete Expense
 */
export async function removeExpense(
  uid: string,
  expenseId: string
) {
  await deleteExpense(uid, expenseId);
}