import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseCard from "../components/expenses/ExpenseCard";
import EditExpenseModal from "../components/expenses/EditExpenseModal";

import { useAuth } from "../contexts/AuthContext";

import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenses,
} from "../services/expenseService";

import { getAllocations } from "../services/allocationService";

import type { Expense } from "../types/expense";
import type { Allocation } from "../types/allocation";

export default function Expenses() {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null);

  async function loadData() {
    if (!user) return;

    setLoading(true);

    try {
      const [expenseData, allocationData] =
        await Promise.all([
          getExpenses(user.uid),
          getAllocations(user.uid),
        ]);

      setExpenses(expenseData);
      setAllocations(allocationData);
    } catch (error) {
      console.error(error);
      alert("Unable to load expenses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  // Add new expense only
  async function handleCreateExpense(
    expense: Omit<Expense, "id" | "createdAt">
  ) {
    if (!user) return;

    try {
      await createExpense(user.uid, expense);

      await loadData();

      alert("Expense created successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to create expense.");
    }
  }

  // Update existing expense
  async function handleUpdateExpense(
    expense: Omit<Expense, "id" | "createdAt">
  ) {
    if (!user || !editingExpense) return;

    try {
      await updateExpense(
        user.uid,
        editingExpense.id,
        expense
      );

      setEditingExpense(null);

      await loadData();

      alert("Expense updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to update expense.");
    }
  }

  async function handleDeleteExpense(id: string) {
    if (!user) return;

    if (
      !window.confirm(
        "Delete this expense?\n\nThis action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteExpense(user.uid, id);

      if (editingExpense?.id === id) {
        setEditingExpense(null);
      }

      await loadData();

      alert("Expense deleted.");
    } catch (error) {
      console.error(error);
      alert("Unable to delete expense.");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}

        <div>

          <h1 className="text-4xl font-bold">
            Expense Management
          </h1>

          <p className="mt-2 text-gray-500">
            Record and manage therapy expenses.
          </p>

        </div>

        {/* Always Add New */}

        <ExpenseForm
          allocations={allocations}
          onSubmit={handleCreateExpense}
        />

        {/* Edit Popup */}

        <EditExpenseModal
          isOpen={editingExpense !== null}
          expense={editingExpense}
          allocations={allocations}
          onSave={handleUpdateExpense}
          onClose={() => setEditingExpense(null)}
        />

        {/* Expense List */}

        <div>

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              Expense History
            </h2>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              {expenses.length} Expense
              {expenses.length !== 1 ? "s" : ""}
            </span>

          </div>

          {loading ? (

            <div className="rounded-xl bg-white p-8 shadow">
              Loading expenses...
            </div>

          ) : expenses.length === 0 ? (

            <div className="rounded-xl bg-white p-8 text-center shadow">

              <h3 className="text-xl font-semibold">
                No Expenses Found
              </h3>

              <p className="mt-2 text-gray-500">
                Add your first expense above.
              </p>

            </div>

          ) : (

            <div className="grid gap-5">

              {expenses.map((expense) => (

                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onEdit={setEditingExpense}
                  onDelete={handleDeleteExpense}
                />

              ))}

            </div>

          )}

        </div>

      </div>
    </DashboardLayout>
  );
}