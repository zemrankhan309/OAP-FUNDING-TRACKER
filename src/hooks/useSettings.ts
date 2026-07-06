import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";

import type { UserSettings } from "../types/settings";

import {
  getSettings,
  saveSettings,
} from "../services/settingsService";

export function useSettings() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [settings, setSettings] =
    useState<UserSettings | null>(null);

  /**
   * Load settings
   */
  const refresh = useCallback(async () => {
    if (!user) {
      setSettings(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await getSettings(user.uid);

      setSettings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Save settings
   */
  async function updateSettings(
    updatedSettings: UserSettings
  ) {
    if (!user) return;

    try {
      await saveSettings(
        user.uid,
        updatedSettings
      );

      setSettings(updatedSettings);

      alert("Settings saved successfully.");
    } catch (error) {
      console.error(error);

      alert("Unable to save settings.");
    }
  }

  return {
    loading,

    settings,

    updateSettings,

    refresh,
  };
}