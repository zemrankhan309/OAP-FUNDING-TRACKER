import {
  Calendar,
  Building2,
  FileText,
  Pencil,
  Trash2,
  BadgeDollarSign,
} from "lucide-react";

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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-2">

            <h3 className="text-xl font-bold text-gray-800">
              {expense.category}
            </h3>

            {expense.source === "invoice-import" && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Imported
              </span>
            )}

          </div>

          <div className="mt-2 flex items-center gap-2 text-gray-500">

            <Building2 size={16} />

            <span>
              {expense.provider || "Unknown Provider"}
            </span>

          </div>

        </div>

        <div className="text-right">

          <div className="flex items-center justify-end gap-2">

            <BadgeDollarSign
              size={18}
              className="text-red-500"
            />

            <span className="text-2xl font-bold text-red-600">
              {Number(expense.amount).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </span>

          </div>

        </div>

      </div>

      {/* Description */}

      <div className="mt-6 rounded-xl bg-gray-50 p-4">

        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600">

          <FileText size={16} />

          Description

        </div>

        <p className="text-gray-700">
          {expense.description || "No description provided."}
        </p>

      </div>

      {/* Dates */}

      <div className="mt-6 grid gap-4 md:grid-cols-2">

        <div className="rounded-xl border border-gray-200 p-4">

          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">

            <Calendar size={16} />

            Start Date

          </div>

          <div className="font-medium">
            {expense.startDate}
          </div>

        </div>

        <div className="rounded-xl border border-gray-200 p-4">

          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">

            <Calendar size={16} />

            End Date

          </div>

          <div className="font-medium">
            {expense.endDate}
          </div>

        </div>

      </div>

      {/* Notes */}

      {expense.notes && (

        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4">

          <div className="mb-2 text-sm font-semibold text-yellow-800">
            Notes
          </div>

          <p className="text-sm text-gray-700">
            {expense.notes}
          </p>

        </div>

      )}

      {/* Footer */}

      <div className="mt-6 flex gap-3 border-t border-gray-200 pt-5">

        <button
          onClick={() => onEdit(expense)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-600 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
        >

          <Pencil size={18} />

          Edit

        </button>

        <button
          onClick={() => onDelete(expense.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
        >

          <Trash2 size={18} />

          Delete

        </button>

      </div>

    </div>
  );
}