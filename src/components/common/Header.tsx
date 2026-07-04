import { Bell, UserCircle } from "lucide-react";

import Logo from "./Logo";
import ChildSelector from "./ChildSelector";

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">

      {/* Left */}
      <Logo />

      {/* Center */}
      <div className="hidden flex-1 justify-center lg:flex">
        <ChildSelector />
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        <button
          className="relative rounded-full p-2 transition hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell
            size={22}
            className="text-gray-600"
          />
        </button>

        <div className="flex items-center gap-3">

          <UserCircle
            size={36}
            className="text-blue-600"
          />

          <div className="text-right">

            <p className="text-sm font-semibold text-gray-800">
              Welcome
            </p>

            <p className="text-xs text-gray-500">
              Guest User
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}