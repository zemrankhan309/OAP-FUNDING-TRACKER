import {
  Bell,
  UserCircle,
} from "lucide-react";

import Logo from "./Logo";
import ChildSelector from "./ChildSelector";

import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-8">
        <Logo />

        <div className="hidden xl:block">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            OAP Funding Tracker
          </p>

          <h2 className="text-lg font-bold text-gray-800">
            Manage Funding with Confidence
          </h2>
        </div>
      </div>

      {/* Child Selector */}
      <div className="hidden flex-1 justify-center lg:flex">
        <ChildSelector />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="rounded-full p-2 transition hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell
            size={22}
            className="text-gray-600"
          />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName ?? "User"}
              className="h-10 w-10 rounded-full border border-gray-300 object-cover"
            />
          ) : (
            <UserCircle
              size={40}
              className="text-blue-600"
            />
          )}

          <div className="leading-tight">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Signed in as
            </p>

            <p className="font-semibold text-gray-800">
              {user?.displayName ?? "Guest User"}
            </p>

            {user?.email && (
              <p className="text-xs text-gray-500">
                {user.email}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}