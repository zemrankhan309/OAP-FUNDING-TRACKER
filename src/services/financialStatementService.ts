import { getAllocations } from "./allocationService";
import { getExpenses } from "./expenseService";

export interface FinancialStatement {
  allocations: any[];
  totalFunding: number;
  totalSpent: number;
  remaining: number;
  percentUsed: number;
  categoryTotals: Record<string, number>;
  transactions: any[];
}

export async function getFinancialStatement(
  uid: string,
  allocationId?: string
): Promise<FinancialStatement> {
  const [allocations, expenses] = await Promise.all([
    getAllocations(uid),
    getExpenses(uid),
  ]);

  let filteredExpenses = expenses;
  let totalFunding = 0;

  if (allocationId) {
    filteredExpenses = expenses.filter(
      (expense) => expense.allocationId === allocationId
    );

    const allocation = allocations.find(
      (item) => item.id === allocationId
    );

    totalFunding = allocation ? Number(allocation.amount) : 0;
  } else {
    totalFunding = allocations.reduce(
      (sum, allocation) => sum + Number(allocation.amount),
      0
    );
  }

  const totalSpent = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const remaining = totalFunding - totalSpent;

  const percentUsed =
    totalFunding === 0
      ? 0
      : (totalSpent / totalFunding) * 100;

  const categoryTotals: Record<string, number> = {};

  filteredExpenses.forEach((expense) => {
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) +
      Number(expense.amount);
  });

  return {
    allocations,
    totalFunding,
    totalSpent,
    remaining,
    percentUsed,
    categoryTotals,
    transactions: filteredExpenses,
  };
}