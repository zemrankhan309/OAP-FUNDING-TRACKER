import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import ProfileCard from "../components/settings/ProfileCard";
import FamilySettings from "../components/settings/FamilySettings";
import FundingSettings from "../components/settings/FundingSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import ExportSettings from "../components/settings/ExportSettings";
import AboutCard from "../components/settings/AboutCard";

type Tab =
  | "profile"
  | "family"
  | "funding"
  | "notifications"
  | "appearance"
  | "security"
  | "export"
  | "about";

export default function Settings() {
  const [tab, setTab] =
    useState<Tab>("profile");

  function renderContent() {
    switch (tab) {
      case "profile":
        return <ProfileCard />;

      case "family":
        return <FamilySettings />;

      case "funding":
        return <FundingSettings />;

      case "notifications":
        return (
          <NotificationSettings />
        );

      case "appearance":
        return (
          <AppearanceSettings />
        );

      case "security":
        return <SecuritySettings />;

      case "export":
        return <ExportSettings />;

      case "about":
        return <AboutCard />;

      default:
        return null;
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>

          <h1 className="text-4xl font-bold">
            Settings
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your application preferences.
          </p>

        </div>

        <div className="grid grid-cols-12 gap-8">

          <div className="col-span-3">

            <div className="rounded-xl bg-white p-3 shadow">

              {[
                ["profile", "👤 Profile"],
                ["family", "👨‍👩‍👧 Family"],
                ["funding", "💰 Funding"],
                [
                  "notifications",
                  "🔔 Notifications",
                ],
                [
                  "appearance",
                  "🎨 Appearance",
                ],
                ["security", "🔒 Security"],
                ["export", "☁️ Export"],
                ["about", "ℹ️ About"],
              ].map(([key, label]) => (

                <button
                  key={key}
                  onClick={() =>
                    setTab(key as Tab)
                  }
                  className={`mb-2 w-full rounded-lg px-4 py-3 text-left transition ${
                    tab === key
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>

              ))}

            </div>

          </div>

          <div className="col-span-9">
            {renderContent()}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}