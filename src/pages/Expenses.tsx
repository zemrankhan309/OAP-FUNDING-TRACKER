import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseCard from "../components/expenses/ExpenseCard";

import { useAuth } from "../contexts/AuthContext";

import {
  createExpense,
  getExpenses,
} from "../services/expenseService";

import { getAllocations } from "../services/allocationService";

import type { Expense } from "../types/expense";

export default function Expenses() {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);

  async function loadData() {
    if (!user) return;

    const [expenseData, allocationData] = await Promise.all([
      getExpenses(user.uid),
      getAllocations(user.uid),
    ]);

    setExpenses(expenseData);
    setAllocations(allocationData);
  }

  useEffect(() => {
    loadData();
  }, [user]);

  async function handleCreateExpense(expense: Omit<Expense, "id" | "createdAt">) {
    if (!user) return;

    await createExpense(user.uid, expense);

    await loadData();
  }

  return (
    <DashboardLayout>

      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold">
            Expense Management
          </h1>

          <p className="mt-2 text-gray-500">
            Record all therapy expenses.
          </p>
        </div>

        <ExpenseForm
          allocations={allocations}
          onSubmit={handleCreateExpense}
        />

        <div>

          <h2 className="mb-4 text-2xl font-bold">
            Expense History
          </h2>

          <div className="grid gap-5">

            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
              />
            ))}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}