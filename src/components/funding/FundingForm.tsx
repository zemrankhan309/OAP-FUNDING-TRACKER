import { useEffect, useState } from "react";
import type { Allocation } from "../../types/allocation";

export interface FundingFormData {
  name: string;
  program: string;
  amount: number | "";
  startDate: string;
  endDate: string;
}

interface FundingFormProps {
  onSubmit: (data: {
    name: string;
    program: string;
    amount: number;
    startDate: string;
    endDate: string;
  }) => Promise<void>;

  editingAllocation: Allocation | null;

  onCancelEdit: () => void;
}

const emptyForm: FundingFormData = {
  name: "",
  program: "Ontario Autism Program",
  amount: "",
  startDate: "",
  endDate: "",
};

export default function FundingForm({
  onSubmit,
  editingAllocation,
  onCancelEdit,
}: FundingFormProps) {
  const [form, setForm] =
    useState<FundingFormData>(emptyForm);

  const [saving, setSaving] = useState(false);

  /**
   * Whenever the selected allocation changes,
   * populate the form automatically.
   */
  useEffect(() => {
    if (editingAllocation) {
      setForm({
        name: editingAllocation.name,
        program: editingAllocation.program,
        amount: editingAllocation.amount,
        startDate: editingAllocation.startDate,
        endDate: editingAllocation.endDate,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingAllocation]);

  function updateField<K extends keyof FundingFormData>(
    field: K,
    value: FundingFormData[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (form.amount === "") {
      alert("Please enter a funding amount.");
      return;
    }

    try {
      setSaving(true);

      await onSubmit({
        ...form,
        amount: Number(form.amount),
      });

      // Only clear the form after creating
      if (!editingAllocation) {
        setForm(emptyForm);
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
      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            {editingAllocation
              ? "Edit Funding Allocation"
              : "Add Funding Allocation"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {editingAllocation
              ? "Update the selected funding allocation."
              : "Create a new funding allocation."}
          </p>

        </div>

        {editingAllocation && (
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Editing
          </span>
        )}

      </div>

      <div className="space-y-6">

        {/* Funding Name */}

        <div>

          <label className="mb-2 block font-medium">
            Funding Name
          </label>

          <input
            type="text"
            placeholder="Example: 2026 OAP Funding"
            value={form.name}
            onChange={(e) =>
              updateField("name", e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            required
          />

        </div>

        {/* Program */}

        <div>

          <label className="mb-2 block font-medium">
            Program
          </label>

          <select
            value={form.program}
            onChange={(e) =>
              updateField("program", e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          >
            <option>Ontario Autism Program</option>
            <option>Jordan's Principle</option>
            <option>Insurance</option>
            <option>Private Funding</option>
            <option>Other</option>
          </select>

        </div>

        {/* Funding Amount */}

        <div>

          <label className="mb-2 block font-medium">
            Funding Amount
          </label>

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>

            <input
              type="number"
              min={0}
              step="0.01"
              value={form.amount}
              onChange={(e) =>
                updateField(
                  "amount",
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
              className="w-full rounded-lg border border-gray-300 py-3 pl-9 pr-3 focus:border-blue-500 focus:outline-none"
              required
            />

          </div>

        </div>

        {/* Dates */}

        <div className="grid gap-4 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Start Date
            </label>

            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                updateField("startDate", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              required
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              End Date
            </label>

            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                updateField("endDate", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              required
            />

          </div>

        </div>

        {/* Buttons */}

        <div className="flex gap-4">

          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingAllocation
              ? "💾 Update Funding"
              : "💾 Save Funding"}
          </button>

          {editingAllocation && (
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