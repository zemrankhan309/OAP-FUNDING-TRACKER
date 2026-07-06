import { useEffect, useState } from "react";

import { useSettings } from "../../hooks/useSettings";

import type { UserSettings } from "../../types/settings";

export default function FundingSettings() {
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
        Loading funding preferences...
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
    await updateSettings(form);
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow">

      <h2 className="mb-8 text-3xl font-bold">
        Funding Preferences
      </h2>

      <div className="space-y-8">

        {/* Low Funding Warning */}

        <div>

          <label className="mb-2 block font-semibold">
            Low Funding Warning (% Remaining)
          </label>

          <input
            type="number"
            min={1}
            max={100}
            value={form.lowFundingWarning}
            onChange={(e) =>
              updateField(
                "lowFundingWarning",
                Number(e.target.value)
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3"
          />

          <p className="mt-2 text-sm text-gray-500">
            Show a warning when remaining funding
            falls below this percentage.
          </p>

        </div>

        {/* Expiry Reminder */}

        <div>

          <label className="mb-2 block font-semibold">
            Funding Expiry Reminder (Days)
          </label>

          <input
            type="number"
            min={1}
            max={365}
            value={form.expiryReminderDays}
            onChange={(e) =>
              updateField(
                "expiryReminderDays",
                Number(e.target.value)
              )
            }
            className="w-full rounded-lg border border-gray-300 p-3"
          />

          <p className="mt-2 text-sm text-gray-500">
            Notify you before a funding allocation
            expires.
          </p>

        </div>

        {/* Preview */}

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">

          <h3 className="mb-3 text-lg font-semibold text-blue-700">
            Preview
          </h3>

          <ul className="space-y-2 text-sm text-gray-700">

            <li>
              ⚠️ Warning appears when remaining
              funding drops below{" "}
              <strong>
                {form.lowFundingWarning}%
              </strong>
            </li>

            <li>
              📅 Reminder appears{" "}
              <strong>
                {form.expiryReminderDays}
              </strong>{" "}
              days before funding expires.
            </li>

          </ul>

        </div>

        {/* Save */}

        <div>

          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            💾 Save Funding Preferences
          </button>

        </div>

      </div>

    </div>
  );
}