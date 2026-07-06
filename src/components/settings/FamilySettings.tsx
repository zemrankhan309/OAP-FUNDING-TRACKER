import { useEffect, useState } from "react";

import { useSettings } from "../../hooks/useSettings";

import type { UserSettings } from "../../types/settings";

export default function FamilySettings() {
  const {
    loading,
    settings,
    updateSettings,
  } = useSettings();

  const [form, setForm] =
    useState<UserSettings | null>(null);

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  if (loading || !form) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        Loading family settings...
      </div>
    );
  }

  function updateField<
    K extends keyof UserSettings
  >(field: K, value: UserSettings[K]) {
    setForm((previous) => ({
      ...previous!,
      [field]: value,
    }));
  }

  async function handleSave() {
    if (!form) return;

    await updateSettings(form);
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow">

      <h2 className="mb-8 text-3xl font-bold">
        Family Settings
      </h2>

      <div className="space-y-8">

        {/* Remember Last Child */}

        <div className="flex items-center justify-between border-b pb-5">

          <div>

            <h3 className="font-semibold">
              Remember Last Selected Child
            </h3>

            <p className="text-sm text-gray-500">
              Automatically reopen the last child you
              were working with.
            </p>

          </div>

          <input
            type="checkbox"
            checked={form.rememberLastChild}
            onChange={(e) =>
              updateField(
                "rememberLastChild",
                e.target.checked
              )
            }
            className="h-5 w-5"
          />

        </div>

        {/* Default Funding Program */}

        <div>

          <label className="mb-2 block font-semibold">
            Default Funding Program
          </label>

          <select
            value={form.defaultFundingProgram}
            onChange={(e) =>
              updateField(
                "defaultFundingProgram",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3"
          >
            <option>Ontario Autism Program</option>
            <option>Jordan's Principle</option>
            <option>Insurance</option>
            <option>Private Funding</option>
            <option>Other</option>
          </select>

        </div>

        {/* Currency */}

        <div>

          <label className="mb-2 block font-semibold">
            Currency
          </label>

          <select
            value={form.currency}
            onChange={(e) =>
              updateField(
                "currency",
                e.target.value as "CAD"
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3"
          >
            <option value="CAD">
              Canadian Dollar (CAD)
            </option>
          </select>

        </div>

        {/* Information */}

        <div className="rounded-lg bg-blue-50 p-5">

          <h3 className="mb-2 font-semibold text-blue-700">
            Family Preferences
          </h3>

          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">

            <li>
              Settings apply to every child in your
              account.
            </li>

            <li>
              Individual funding and expenses remain
              separated by child.
            </li>

            <li>
              You can switch children at any time from
              the header.
            </li>

          </ul>

        </div>

        {/* Save */}

        <div className="pt-4">

          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            💾 Save Family Settings
          </button>

        </div>

      </div>

    </div>
  );
}