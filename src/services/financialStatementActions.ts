import { getAllocations } from "./allocationService";
import { getExpenses } from "./expenseService";

export interface FinancialStatementData {
  totalFunding: number;
  totalSpent: number;
  remaining: number;
  percentUsed: number;

  allocations: any[];
  expenses: any[];

  categoryTotals: Record<string, number>;
}

export async function loadFinancialStatement(
  uid: string,
  childId: string
): Promise<FinancialStatementData> {
  const [allocations, expenses] = await Promise.all([
    getAllocations(uid),
    getExpenses(uid),
  ]);

  // Only this child's funding
  const childAllocations = allocations.filter(
    (allocation: any) =>
      allocation.childId === childId
  );

  // IDs for this child's funding
  const allocationIds = childAllocations.map(
    (allocation) => allocation.id
  );

  // Only expenses for this child
  const childExpenses = expenses.filter(
    (expense: any) =>
      allocationIds.includes(expense.allocationId)
  );

  const totalFunding = childAllocations.reduce(
    (sum: number, allocation: any) =>
      sum + Number(allocation.amount),
    0
  );

  const totalSpent = childExpenses.reduce(
    (sum: number, expense: any) =>
      sum + Number(expense.amount),
    0
  );

  const remaining = totalFunding - totalSpent;

  const percentUsed =
    totalFunding === 0
      ? 0
      : (totalSpent / totalFunding) * 100;

  const categoryTotals: Record<string, number> = {};

  childExpenses.forEach((expense: any) => {
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) +
      Number(expense.amount);
  });

  return {
    allocations: childAllocations,
    expenses: childExpenses,

    totalFunding,
    totalSpent,
    remaining,
    percentUsed,

    categoryTotals,
  };
}