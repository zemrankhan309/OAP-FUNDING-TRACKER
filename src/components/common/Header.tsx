import { Bell, UserCircle } from "lucide-react";

import Logo from "./Logo";
import ChildSelector from "./ChildSelector";

import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">

      {/* Logo */}
      <Logo />

      {/* Child Selector */}
      <div className="hidden flex-1 justify-center lg:flex">
        <ChildSelector />
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

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
        <div className="flex items-center gap-3">

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

          <div className="text-right leading-tight">

            <p className="text-sm font-semibold text-gray-800">
              Welcome
            </p>

            <p className="text-sm font-medium text-gray-700">
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