import { useState } from "react";
import type { Expense } from "../../types/expense";

interface Props {
  allocations: {
    id: string;
    name: string;
  }[];

  onSubmit: (
    expense: Omit<Expense, "id" | "createdAt">
  ) => Promise<void>;
}

export default function ExpenseForm({
  allocations,
  onSubmit,
}: Props) {
  const [saving, setSaving] = useState(false);

  const [expense, setExpense] = useState({
    allocationId: "",
    category: "ABA Therapy",
    provider: "",
    description: "",
    amount: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  function update(field: string, value: any) {
    setExpense((prev) => ({
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

      setExpense({
        allocationId: "",
        category: "ABA Therapy",
        provider: "",
        description: "",
        amount: "",
        startDate: "",
        endDate: "",
        notes: "",
      });
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
        Add Expense
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
            placeholder="Provider Name"
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
            placeholder="Description"
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
              placeholder="0.00"
              value={expense.amount}
              onChange={(e) =>
                update("amount", e.target.value)
              }
              className="w-full rounded-lg border py-3 pl-8 pr-3"
              required
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
              required
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
              required
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

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "💾 Save Expense"}
        </button>

      </div>
    </form>
  );
}