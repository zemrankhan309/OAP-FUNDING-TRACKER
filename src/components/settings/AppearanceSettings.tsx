import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/useSettings";
import type { UserSettings } from "../../types/settings";

export default function AppearanceSettings() {
  const { loading, settings, updateSettings } = useSettings();
  const [form, setForm] = useState<UserSettings | null>(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  if (loading || !form) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        Loading appearance...
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow">
      <h2 className="mb-8 text-3xl font-bold">
        Appearance
      </h2>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">
            Dark Mode
          </h3>

          <p className="text-sm text-gray-500">
            Enable dark mode for the application.
          </p>
        </div>

        <input
          type="checkbox"
          checked={form.darkMode}
          onChange={(e) =>
            setForm({
              ...form,
              darkMode: e.target.checked,
            })
          }
          className="h-5 w-5"
        />
      </div>

      <button
        onClick={() => updateSettings(form)}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        💾 Save Appearance
      </button>
    </div>
  );
}