import DashboardLayout from "../layouts/DashboardLayout";

import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseCard from "../components/expenses/ExpenseCard";
import EditExpenseModal from "../components/expenses/EditExpenseModal";

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

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}

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

        {/* Add Expense */}

        <ExpenseForm
          allocations={allocations}
          onSubmit={saveExpense}
        />

        {/* Edit Expense */}

        <EditExpenseModal
          isOpen={editingExpense !== null}
          expense={editingExpense}
          allocations={allocations}
          onSave={updateExistingExpense}
          onClose={cancelEdit}
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