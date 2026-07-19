import { Search, Plus, Upload } from "lucide-react";
import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import ExpenseModal from "../components/expenses/ExpenseModal";
import ExpenseCard from "../components/expenses/ExpenseCard";
import EditExpenseModal from "../components/expenses/EditExpenseModal";

import ImportStatementModal from "../features/invoice-import/components/ImportStatementModal";

import { useSelectedChild } from "../contexts/SelectedChildContext";
import { useExpenses } from "../hooks/useExpenses";

export default function Expenses() {
  const { selectedChild } = useSelectedChild();

  const {
    loading,
    expenses,
    allocations,
    editingExpense,
    saveExpense,
    updateExistingExpense,
    deleteExistingExpense,
    edit,
    cancelEdit,
  } = useExpenses();

  const [search, setSearch] = useState("");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const filteredExpenses = expenses.filter((expense) => {
    const term = search.toLowerCase().trim();

    return (
      expense.category.toLowerCase().includes(term) ||
      expense.description.toLowerCase().includes(term) ||
      expense.provider.toLowerCase().includes(term) ||
      (expense.therapist ?? "").toLowerCase().includes(term) ||
      (expense.invoiceNumber ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Expense Management
            </h1>

            <p className="mt-2 text-gray-500">
              Recording expenses for{" "}
              <span className="font-semibold text-blue-600">
                {selectedChild
                  ? `${selectedChild.firstName} ${selectedChild.lastName}`
                  : "No Child Selected"}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Expense
            </button>

            <button
              onClick={() => setIsImportOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              <Upload size={18} />
              Import Statement
            </button>
          </div>
        </div>

        {/* Search */}

        <div className="rounded-xl bg-white p-5 shadow">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-3.5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by category, description, provider, therapist or invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Add Expense Modal */}

        <ExpenseModal
          isOpen={isAddExpenseOpen}
          allocations={allocations}
          onSave={async (expense) => {
            await saveExpense(expense);
            setIsAddExpenseOpen(false);
          }}
          onClose={() => setIsAddExpenseOpen(false)}
        />

        {/* Import Statement Modal */}

        <ImportStatementModal
          isOpen={isImportOpen}
          allocations={allocations}
          onClose={() => setIsImportOpen(false)}
        />

        {/* Edit Expense */}

        <EditExpenseModal
          isOpen={editingExpense !== null}
          expense={editingExpense}
          allocations={allocations}
          onSave={updateExistingExpense}
          onClose={cancelEdit}
        />

        {/* History */}

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Expense History
            </h2>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              {filteredExpenses.length} Expense
              {filteredExpenses.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              Loading expenses...
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
              <h3 className="text-xl font-semibold">
                No Expenses Found
              </h3>

              <p className="mt-2 text-gray-500">
                Try changing your search or add a new expense.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onEdit={edit}
                  onDelete={deleteExistingExpense}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}