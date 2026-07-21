import { useEffect, useState } from "react";
import {
  Wallet,
  Tag,
  FileText,
  Calendar,
  StickyNote,
  DollarSign,
  Save,
  X,
} from "lucide-react";

import AutocompleteInput from "../common/AutocompleteInput";

import type { Expense } from "../../types/expense";

interface Props {
  allocations: {
    id: string;
    name: string;
  }[];

  providerOptions: string[];
  therapistOptions: string[];

  onSubmit: (
    expense: Omit<Expense, "id" | "createdAt">
  ) => Promise<void>;

  editingExpense?: Expense | null;

  onCancelEdit?: () => void;
}

interface ExpenseFormState {
  allocationId: string;
  category: string;
  provider: string;
  therapist: string;
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
  notes: string;
}

export default function ExpenseForm({
  allocations,
  providerOptions,
  therapistOptions,
  onSubmit,
  editingExpense,
  onCancelEdit,
}: Props) {
  const STORAGE_ALLOCATION_KEY =
    "oap:lastSelectedAllocation";
  const STORAGE_CATEGORY_KEY =
    "oap:lastSelectedCategory";

  const emptyExpense: ExpenseFormState = {
    allocationId: "",
    category: "ABA Therapy",
    provider: "",
    therapist: "",
    description: "",
    amount: "",
    startDate: "",
    endDate: "",
    notes: "",
  };

  const [saving, setSaving] = useState(false);
  const [expense, setExpense] = useState<ExpenseFormState>(
    emptyExpense
  );

  useEffect(() => {
    if (editingExpense) {
      setExpense({
        allocationId: editingExpense.allocationId,
        category: editingExpense.category,
        provider: editingExpense.provider,
        therapist:
          editingExpense.therapist ?? "",
        description: editingExpense.description,
        amount: String(editingExpense.amount),
        startDate: editingExpense.startDate,
        endDate: editingExpense.endDate,
        notes: editingExpense.notes ?? "",
      });
      return;
    }

    const savedAllocationId =
      localStorage.getItem(
        STORAGE_ALLOCATION_KEY
      );
    const savedCategory =
      localStorage.getItem(STORAGE_CATEGORY_KEY);

    setExpense({
      allocationId:
        savedAllocationId ||
        allocations[0]?.id ||
        "",
      category: savedCategory ||
        "ABA Therapy",
      provider: "",
      therapist: "",
      description: "",
      amount: "",
      startDate: "",
      endDate: "",
      notes: "",
    });
  }, [editingExpense, allocations]);

  function update<K extends keyof ExpenseFormState>(
    field: K,
    value: ExpenseFormState[K]
  ) {
    setExpense((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  useEffect(() => {
    if (!editingExpense) {
      localStorage.setItem(
        STORAGE_ALLOCATION_KEY,
        expense.allocationId
      );
      localStorage.setItem(
        STORAGE_CATEGORY_KEY,
        expense.category
      );
    }
  }, [expense.allocationId, expense.category, editingExpense]);

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

    if (
      expense.startDate &&
      expense.endDate &&
      expense.endDate < expense.startDate
    ) {
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

        therapist:
          editingExpense?.therapist ?? "",

        invoiceNumber:
          editingExpense?.invoiceNumber ?? "",

        status:
          editingExpense?.status ?? "approved",

        source:
          editingExpense?.source ?? "manual",
      });

      if (!editingExpense) {
        setExpense(emptyExpense);
      }
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-8 shadow"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {editingExpense
              ? "Edit Expense"
              : "Add Expense"}
          </h2>

          <p className="mt-2 text-gray-500">
            Record a therapy expense against an
            OAP funding allocation.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Allocation */}

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium">
            <Wallet size={18} />
            Funding Allocation
          </label>

          <select
            required
            value={expense.allocationId}
            onChange={(e) =>
              update(
                "allocationId",
                e.target.value
              )
            }
            className={inputClass}
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
          <label className="mb-2 flex items-center gap-2 font-medium">
            <Tag size={18} />
            Category
          </label>

          <select
            value={expense.category}
            onChange={(e) =>
              update(
                "category",
                e.target.value
              )
            }
            className={inputClass}
          >
            <option>ABA Therapy</option>
            <option>Speech Therapy</option>
            <option>
              Occupational Therapy
            </option>
            <option>Psychology</option>
            <option>Physiotherapy</option>
            <option>
              Behaviour Consultation
            </option>
            <option>Respite</option>
            <option>
              Parent Training
            </option>
            <option>Travel</option>
            <option>Equipment</option>
            <option>Technology</option>
            <option>Other</option>
          </select>
        </div>

        {/* Provider */}

        <AutocompleteInput
          id="provider"
          label="Provider"
          value={expense.provider}
          onChange={(value) =>
            update("provider", value)
          }
          options={providerOptions}
          placeholder="Provider or clinic"
          required
          className=""
        />

        {/* Therapist */}

        <AutocompleteInput
          id="therapist"
          label="Therapist"
          value={expense.therapist}
          onChange={(value) =>
            update("therapist", value)
          }
          options={therapistOptions}
          placeholder="Therapist name"
          className=""
        />

        {/* Amount */}

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium">
            <DollarSign size={18} />
            Amount
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>

            <input
              type="number"
              min="0"
              step="0.01"
              value={expense.amount}
              onChange={(e) =>
                update(
                  "amount",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 py-3 pl-8 pr-4 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Description */}

      <div className="mt-6">
        <label className="mb-2 flex items-center gap-2 font-medium">
          <FileText size={18} />
          Description
        </label>

        <input
          type="text"
          value={expense.description}
          onChange={(e) =>
            update(
              "description",
              e.target.value
            )
          }
          placeholder="Session description"
          className={inputClass}
        />
      </div>

      {/* Dates */}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 flex items-center gap-2 font-medium">
            <Calendar size={18} />
            Start Date
          </label>

          <input
            type="date"
            value={expense.startDate}
            onChange={(e) =>
              update(
                "startDate",
                e.target.value
              )
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-medium">
            <Calendar size={18} />
            End Date
          </label>

          <input
            type="date"
            value={expense.endDate}
            onChange={(e) =>
              update(
                "endDate",
                e.target.value
              )
            }
            className={inputClass}
          />
        </div>
      </div>

      {/* Notes */}

      <div className="mt-6">
        <label className="mb-2 flex items-center gap-2 font-medium">
          <StickyNote size={18} />
          Notes
        </label>

        <textarea
          rows={4}
          value={expense.notes}
          onChange={(e) =>
            update(
              "notes",
              e.target.value
            )
          }
          placeholder="Optional notes..."
          className={inputClass}
        />
      </div>

      {/* Buttons */}

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={18} />

          {saving
            ? "Saving..."
            : editingExpense
            ? "Update Expense"
            : "Save Expense"}
        </button>

        {editingExpense && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold transition hover:bg-gray-100"
          >
            <X size={18} />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}