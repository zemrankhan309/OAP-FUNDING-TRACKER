import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/useSettings";
import type { UserSettings } from "../../types/settings";

export default function NotificationSettings() {
  const { loading, settings, updateSettings } = useSettings();
  const [form, setForm] = useState<UserSettings | null>(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  if (loading || !form) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        Loading notification settings...
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow">
      <h2 className="mb-8 text-3xl font-bold">
        Notifications
      </h2>

      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h3 className="font-semibold">
            Enable Notifications
          </h3>
          <p className="text-sm text-gray-500">
            Receive reminders about funding and important events.
          </p>
        </div>

        <input
          type="checkbox"
          checked={form.notifications}
          onChange={(e) =>
            setForm({
              ...form,
              notifications: e.target.checked,
            })
          }
          className="h-5 w-5"
        />
      </div>

      <button
        onClick={() => updateSettings(form)}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        💾 Save Notification Settings
      </button>
    </div>
  );
}