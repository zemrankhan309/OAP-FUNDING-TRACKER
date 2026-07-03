import { useEffect, useState } from "react";

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

  editingAllocation?: any;

  onCancelEdit?: () => void;
}

export default function FundingForm({
  onSubmit,
  editingAllocation,
  onCancelEdit,
}: FundingFormProps) {
  const emptyForm: FundingFormData = {
    name: "",
    program: "Ontario Autism Program",
    amount: "",
    startDate: "",
    endDate: "",
  };

  const [form, setForm] =
    useState<FundingFormData>(emptyForm);

  const [saving, setSaving] = useState(false);

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
    setForm((prev) => ({
      ...prev,
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

    setSaving(true);

    await onSubmit({
      ...form,
      amount: Number(form.amount),
    });

    setSaving(false);

    if (!editingAllocation) {
      setForm(emptyForm);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white p-8 shadow"
    >
      <h2 className="mb-8 text-2xl font-bold">
        {editingAllocation
          ? "Edit Funding Allocation"
          : "Add Funding Allocation"}
      </h2>

      <div className="space-y-6">

        {/* Funding Name */}

        <div>

          <label className="mb-2 block font-medium text-gray-700">
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

          <label className="mb-2 block font-medium text-gray-700">
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
            <option>Private Funding</option>
            <option>Insurance</option>
            <option>Other</option>
          </select>

        </div>

        {/* Amount */}

        <div>

          <label className="mb-2 block font-medium text-gray-700">
            Funding Amount
          </label>

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="60000"
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

            <label className="mb-2 block font-medium text-gray-700">
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

            <label className="mb-2 block font-medium text-gray-700">
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
            className="flex-1 rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700"
          >
            {saving
              ? "Saving..."
              : editingAllocation
              ? "💾 Update Funding"
              : "💾 Save Funding Allocation"}
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