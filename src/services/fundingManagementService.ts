import type { Allocation } from "../types/allocation";

import { getAllocations } from "./allocationService";
import { getExpenses } from "./expenseService";

export async function getFundingSummary(
  uid: string
): Promise<Allocation[]> {
  const [allocations, expenses] = await Promise.all([
    getAllocations(uid),
    getExpenses(uid),
  ]);

  return allocations.map((allocation) => {
    const allocationExpenses = expenses.filter(
      (expense: any) =>
        expense.allocationId === allocation.id
    );

    const spent = allocationExpenses.reduce(
      (total: number, expense: any) =>
        total + Number(expense.amount),
      0
    );

    const remaining =
      Number(allocation.amount) - spent;

    const percentUsed =
      allocation.amount === 0
        ? 0
        : (spent / Number(allocation.amount)) * 100;

    return {
      ...allocation,

      amount: Number(allocation.amount),

      spent,

      remaining,

      expenseCount: allocationExpenses.length,

      percentUsed,
    };
  });
}