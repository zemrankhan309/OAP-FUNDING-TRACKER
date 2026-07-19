import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useSelectedChild } from "../contexts/SelectedChildContext";

import type { Expense } from "../types/expense";
import type { Allocation } from "../types/allocation";

import {
  loadExpenses,
  removeExpense,
} from "../services/expenseActions";

import {
  saveExpense as saveExpenseEngine,
  saveExistingExpense,
} from "../services/expenseEngine";

export function useExpenses() {
  const { user } = useAuth();
  const { selectedChild } = useSelectedChild();

  const [loading, setLoading] = useState(true);

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [allocations, setAllocations] =
    useState<Allocation[]>([]);

  const [editingExpense, setEditingExpense] =
    useState<Expense | null>(null);

  /**
   * Load Expenses
   */
  const refresh = useCallback(async () => {
    if (!user || !selectedChild) {
      setExpenses([]);
      setAllocations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await loadExpenses(
        user.uid,
        selectedChild.id
      );

      setExpenses(data.expenses);
      setAllocations(data.allocations);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedChild]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Create Expense
   */
  async function saveExpense(
    expense: Omit<Expense, "id" | "createdAt">
  ) {
    if (!user) return;

    await saveExpenseEngine(
      user.uid,
      expense
    );

    await refresh();
  }

  /**
   * Update Expense
   */
  async function updateExistingExpense(
    expense: Omit<Expense, "id" | "createdAt">
  ) {
    if (!user || !editingExpense) return;

    await saveExistingExpense(
      user.uid,
      editingExpense.id,
      expense
    );

    setEditingExpense(null);

    await refresh();
  }

  /**
   * Delete Expense
   */
  async function deleteExistingExpense(
    id: string
  ) {
    if (!user) return;

    if (
      !window.confirm(
        "Delete this expense?"
      )
    ) {
      return;
    }

    await removeExpense(
      user.uid,
      id
    );

    if (editingExpense?.id === id) {
      setEditingExpense(null);
    }

    await refresh();
  }

  function edit(expense: Expense) {
    setEditingExpense(expense);
  }

  function cancelEdit() {
    setEditingExpense(null);
  }

  return {
    loading,

    expenses,

    allocations,

    editingExpense,

    saveExpense,

    updateExistingExpense,

    deleteExistingExpense,

    edit,

    cancelEdit,

    refresh,
  };
}