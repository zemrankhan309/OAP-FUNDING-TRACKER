import type { Expense } from "../../types/expense";

interface Props {
  expense: Expense;

  onEdit: (expense: Expense) => void;

  onDelete: (id: string) => void;
}

export default function ExpenseCard({
  expense,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <h3 className="text-xl font-bold">
            {expense.category}
          </h3>

          <p className="mt-1 text-gray-500">
            {expense.provider}
          </p>

        </div>

        <div className="text-2xl font-bold text-red-600">
          {Number(expense.amount).toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
          })}
        </div>

      </div>

      {/* Description */}

      <div className="mt-5">

        <p className="text-gray-700">
          {expense.description || "No description"}
        </p>

      </div>

      {/* Service Dates */}

      <div className="mt-6 border-t border-gray-200 pt-4">

        <div className="flex justify-between">

          <span className="text-gray-500">
            Start Date
          </span>

          <span>{expense.startDate}</span>

        </div>

        <div className="mt-2 flex justify-between">

          <span className="text-gray-500">
            End Date
          </span>

          <span>{expense.endDate}</span>

        </div>

      </div>

      {/* Notes */}

      {expense.notes && (
        <div className="mt-5 rounded-lg bg-gray-50 p-3">

          <div className="mb-1 text-sm font-semibold text-gray-600">
            Notes
          </div>

          <p className="text-sm text-gray-700">
            {expense.notes}
          </p>

        </div>
      )}

      {/* Buttons */}

      <div className="mt-6 border-t border-gray-200 pt-4">

        <div className="grid gap-3">

          <button
            onClick={() => onEdit(expense)}
            className="rounded-lg border border-blue-600 py-2 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            ✏️ Edit Expense
          </button>

          <button
            onClick={() => onDelete(expense.id)}
            className="rounded-lg bg-red-600 py-2 font-semibold text-white transition hover:bg-red-700"
          >
            🗑 Delete Expense
          </button>

        </div>

      </div>

    </div>
  );
}