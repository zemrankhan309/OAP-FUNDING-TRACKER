import { getAllocations } from "./allocationService";
import { getExpenses } from "./expenseService";

export async function getDashboardData(uid: string) {
  const allocations = await getAllocations(uid);
  const expenses = await getExpenses(uid);

  // Find the active funding allocation
  const activeAllocation = allocations.find(
    (allocation: any) => allocation.active === true
  );

  // No active allocation
  if (!activeAllocation) {
    return {
      allocations,
      expenses: [],
      totalFunding: 0,
      totalSpent: 0,
      remaining: 0,
      percentUsed: 0,
    };
  }

  // Only expenses for the active allocation
  const activeExpenses = expenses.filter(
    (expense: any) =>
      expense.allocationId === activeAllocation.id
  );

  const totalFunding = Number(activeAllocation.amount);

  const totalSpent = activeExpenses.reduce(
    (sum: number, expense: any) =>
      sum + Number(expense.amount),
    0
  );

  const remaining = totalFunding - totalSpent;

  const percentUsed =
    totalFunding === 0
      ? 0
      : (totalSpent / totalFunding) * 100;

  return {
    allocations,
    expenses: activeExpenses,
    totalFunding,
    totalSpent,
    remaining,
    percentUsed,
  };
}