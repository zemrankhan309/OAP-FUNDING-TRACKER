import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Receipt,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { logout } from "../../firebase/auth";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Children",
    path: "/children",
    icon: Users,
  },
  {
    title: "Funding",
    path: "/funding",
    icon: Wallet,
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: Receipt,
  },
  {
    title: "Funding Statement",
    path: "/financial-statement",
    icon: FileText,
  },
];

const secondaryItems = [
  {
    title: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  async function handleLogout() {
    await logout();
    window.location.href = "/login";
  }

  function renderItem(item: {
    title: string;
    path: string;
    icon: React.ElementType;
  }) {
    const Icon = item.icon;

    return (
      <li key={item.title}>
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`
          }
        >
          <Icon size={20} />

          <span className="font-medium">
            {item.title}
          </span>
        </NavLink>
      </li>
    );
  }

  return (
    <aside className="flex h-full w-72 flex-col border-r border-gray-200 bg-white">

      {/* Logo */}

      <div className="border-b border-gray-200 px-6 py-6">

        <h1 className="text-3xl font-bold text-blue-600">
          OAP Tracker
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Funding Management
        </p>

      </div>

      {/* Main Navigation */}

      <div className="px-5 pt-5">

        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
          Main
        </p>

        <ul className="space-y-2">
          {menuItems.map(renderItem)}
        </ul>

      </div>

      {/* Secondary */}

      <div className="mt-8 px-5">

        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
          Administration
        </p>

        <ul className="space-y-2">
          {secondaryItems.map(renderItem)}
        </ul>

      </div>

      <div className="mt-auto border-t border-gray-200 p-5">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={20} />

          <span className="font-medium">
            Logout
          </span>
        </button>

        <div className="mt-6 text-center text-xs text-gray-400">
          OAP Tracker v1.0
        </div>

      </div>

    </aside>
  );
}