import { getAllocations } from "./allocationService";
import { getExpenses } from "./expenseService";

export async function getDashboardData(
  uid: string,
  childId?: string
) {
  const allocations = await getAllocations(uid);
  const expenses = await getExpenses(uid);

  // Only allocations for selected child
  const childAllocations = childId
    ? allocations.filter(
        (allocation: any) =>
          allocation.childId === childId
      )
    : allocations;

  // Active allocation for selected child
  const activeAllocation = childAllocations.find(
    (allocation: any) => allocation.active === true
  );

  if (!activeAllocation) {
    return {
      allocations: childAllocations,
      expenses: [],
      totalFunding: 0,
      totalSpent: 0,
      remaining: 0,
      percentUsed: 0,
    };
  }

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
    allocations: childAllocations,
    expenses: activeExpenses,
    totalFunding,
    totalSpent,
    remaining,
    percentUsed,
  };
}