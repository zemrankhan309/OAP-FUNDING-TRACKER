import { useEffect, useState } from "react";

import type { Child } from "../../types/child";

export interface ChildFormData {
  firstName: string;
  lastName: string;

  dob: string;
  oapNumber: string;
  ohipNumber: string;
  diagnosis: string;
  gender: string;
  school: string;
  notes: string;
}

interface Props {
  onSubmit: (
    child: ChildFormData
  ) => Promise<void>;

  editingChild?: Child | null;

  onCancelEdit?: () => void;
}

export default function ChildForm({
  onSubmit,
  editingChild,
  onCancelEdit,
}: Props) {
  const emptyForm: ChildFormData = {
    firstName: "",
    lastName: "",

    dob: "",
    oapNumber: "",
    ohipNumber: "",
    diagnosis: "",
    gender: "",
    school: "",
    notes: "",
  };

  const [saving, setSaving] = useState(false);

  const [form, setForm] =
    useState<ChildFormData>(emptyForm);

  useEffect(() => {
    if (editingChild) {
      setForm({
        firstName: editingChild.firstName,
        lastName: editingChild.lastName,

        dob: editingChild.dob ?? "",
        oapNumber:
          editingChild.oapNumber ?? "",
        ohipNumber:
          editingChild.ohipNumber ?? "",
        diagnosis:
          editingChild.diagnosis ?? "",
        gender: editingChild.gender ?? "",
        school: editingChild.school ?? "",
        notes: editingChild.notes ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingChild]);

  function updateField<
    K extends keyof ChildFormData
  >(field: K, value: ChildFormData[K]) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!form.firstName.trim()) {
      alert("First Name is required.");
      return;
    }

    if (!form.lastName.trim()) {
      alert("Last Name is required.");
      return;
    }

    try {
      setSaving(true);

      await onSubmit(form);

      if (!editingChild) {
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
      <h2 className="mb-8 text-3xl font-bold">
        {editingChild
          ? "Edit Child"
          : "Add Child"}
      </h2>

      <div className="grid gap-6">

        {/* Required */}

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              First Name *
            </label>

            <input
              type="text"
              value={form.firstName}
              onChange={(e) =>
                updateField(
                  "firstName",
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-3"
              required
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Last Name *
            </label>

            <input
              type="text"
              value={form.lastName}
              onChange={(e) =>
                updateField(
                  "lastName",
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-3"
              required
            />

          </div>

        </div>

        {/* Optional */}

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Date of Birth
            </label>

            <input
              type="date"
              value={form.dob}
              onChange={(e) =>
                updateField("dob", e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Gender
            </label>

            <select
              value={form.gender}
              onChange={(e) =>
                updateField(
                  "gender",
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-3"
            >
              <option value="">
                Select Gender
              </option>

              <option>Male</option>
              <option>Female</option>
              <option>Non-Binary</option>
              <option>Prefer not to say</option>

            </select>

          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              OAP Number
            </label>

            <input
              type="text"
              value={form.oapNumber}
              onChange={(e) =>
                updateField(
                  "oapNumber",
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              OHIP Number
            </label>

            <input
              type="text"
              value={form.ohipNumber}
              onChange={(e) =>
                updateField(
                  "ohipNumber",
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Diagnosis
          </label>

          <input
            type="text"
            value={form.diagnosis}
            onChange={(e) =>
              updateField(
                "diagnosis",
                e.target.value
              )
            }
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            School
          </label>

          <input
            type="text"
            value={form.school}
            onChange={(e) =>
              updateField(
                "school",
                e.target.value
              )
            }
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Notes
          </label>

          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) =>
              updateField(
                "notes",
                e.target.value
              )
            }
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div className="flex gap-4">

          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingChild
              ? "💾 Update Child"
              : "💾 Save Child"}
          </button>

          {editingChild && (
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