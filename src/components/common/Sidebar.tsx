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

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">

      {/* Logo */}

      <div className="border-b border-gray-200 px-6 py-5">

        <h1 className="text-2xl font-bold text-blue-600">
          OAP Tracker
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Funding Management
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 p-4">

        <ul className="space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.title}>

                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow"
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
          })}

        </ul>

      </nav>

      {/* Logout */}

      <div className="border-t border-gray-200 p-4">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 transition hover:bg-red-50"
        >

          <LogOut size={20} />

          <span className="font-medium">
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}