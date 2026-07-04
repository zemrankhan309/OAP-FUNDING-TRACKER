import { useEffect, useState } from "react";
import type { Expense } from "../../types/expense";

interface Props {
  allocations: {
    id: string;
    name: string;
  }[];

  onSubmit: (
    expense: Omit<Expense, "id" | "createdAt">
  ) => Promise<void>;

  editingExpense?: Expense | null;

  onCancelEdit?: () => void;
}

export default function ExpenseForm({
  allocations,
  onSubmit,
  editingExpense,
  onCancelEdit,
}: Props) {
  const emptyExpense = {
    allocationId: "",
    category: "ABA Therapy",
    provider: "",
    description: "",
    amount: "",
    startDate: "",
    endDate: "",
    notes: "",
  };

  const [saving, setSaving] = useState(false);

  const [expense, setExpense] = useState<any>(emptyExpense);

  useEffect(() => {
    if (editingExpense) {
      setExpense({
        allocationId: editingExpense.allocationId,
        category: editingExpense.category,
        provider: editingExpense.provider,
        description: editingExpense.description,
        amount: editingExpense.amount,
        startDate: editingExpense.startDate,
        endDate: editingExpense.endDate,
        notes: editingExpense.notes ?? "",
      });
    } else {
      setExpense(emptyExpense);
    }
  }, [editingExpense]);

  function update(field: string, value: any) {
    setExpense((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!expense.allocationId) {
      alert("Please select a funding allocation.");
      return;
    }

    if (Number(expense.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (expense.endDate < expense.startDate) {
      alert("End Date cannot be before Start Date.");
      return;
    }

    try {
      setSaving(true);

      await onSubmit({
        allocationId: expense.allocationId,
        category: expense.category,
        provider: expense.provider,
        description: expense.description,
        amount: Number(expense.amount),
        startDate: expense.startDate,
        endDate: expense.endDate,
        notes: expense.notes,
      });

      if (!editingExpense) {
        setExpense(emptyExpense);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white p-8 shadow"
    >
      <h2 className="mb-8 text-3xl font-bold">
        {editingExpense
          ? "Edit Expense"
          : "Add Expense"}
      </h2>

      <div className="grid gap-6">

        {/* Funding Allocation */}

        <div>
          <label className="mb-2 block font-medium">
            Funding Allocation
          </label>

          <select
            required
            value={expense.allocationId}
            onChange={(e) =>
              update("allocationId", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              Select Allocation
            </option>

            {allocations.map((allocation) => (
              <option
                key={allocation.id}
                value={allocation.id}
              >
                {allocation.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}

        <div>
          <label className="mb-2 block font-medium">
            Category
          </label>

          <select
            value={expense.category}
            onChange={(e) =>
              update("category", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option>ABA Therapy</option>
            <option>Speech Therapy</option>
            <option>Occupational Therapy</option>
            <option>Psychology</option>
            <option>Physiotherapy</option>
            <option>Behaviour Consultation</option>
            <option>Respite</option>
            <option>Parent Training</option>
            <option>Travel</option>
            <option>Equipment</option>
            <option>Technology</option>
            <option>Other</option>
          </select>
        </div>

        {/* Provider */}

        <div>
          <label className="mb-2 block font-medium">
            Provider
          </label>

          <input
            type="text"
            value={expense.provider}
            onChange={(e) =>
              update("provider", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Description */}

        <div>
          <label className="mb-2 block font-medium">
            Description
          </label>

          <input
            type="text"
            value={expense.description}
            onChange={(e) =>
              update("description", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* Amount */}

        <div>
          <label className="mb-2 block font-medium">
            Amount
          </label>

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              $
            </span>

            <input
              type="number"
              min="0"
              step="0.01"
              value={expense.amount}
              onChange={(e) =>
                update("amount", e.target.value)
              }
              className="w-full rounded-lg border py-3 pl-8 pr-3"
            />

          </div>
        </div>

        {/* Dates */}

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Start Date
            </label>

            <input
              type="date"
              value={expense.startDate}
              onChange={(e) =>
                update("startDate", e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              End Date
            </label>

            <input
              type="date"
              value={expense.endDate}
              onChange={(e) =>
                update("endDate", e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

        </div>

        {/* Notes */}

        <div>

          <label className="mb-2 block font-medium">
            Notes
          </label>

          <textarea
            rows={4}
            value={expense.notes}
            onChange={(e) =>
              update("notes", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />

        </div>

        {/* Buttons */}

        <div className="flex gap-4">

          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingExpense
              ? "💾 Update Expense"
              : "💾 Save Expense"}
          </button>

          {editingExpense && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-100"
            >
              Cancel
            </button>
          )}

        </div>

      </div>
    </form>
  );
}