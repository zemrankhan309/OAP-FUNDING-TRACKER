import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { UserSettings } from "../types/settings";

const defaultSettings: UserSettings = {
  rememberLastChild: true,

  defaultFundingProgram:
    "Ontario Autism Program",

  currency: "CAD",

  lowFundingWarning: 20,

  expiryReminderDays: 30,

  darkMode: false,

  notifications: true,
};

export async function getSettings(
  uid: string
): Promise<UserSettings> {
  const ref = doc(
    db,
    "users",
    uid,
    "settings",
    "preferences"
  );

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    await setDoc(ref, defaultSettings);

    return defaultSettings;
  }

  return snapshot.data() as UserSettings;
}

export async function saveSettings(
  uid: string,
  settings: UserSettings
) {
  const ref = doc(
    db,
    "users",
    uid,
    "settings",
    "preferences"
  );

  await setDoc(ref, settings);
}