import { UserCircle, Mail, Calendar } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

export default function ProfileCard() {
  const { user } = useAuth();

  return (
    <div className="rounded-xl bg-white p-8 shadow">

      <h2 className="mb-8 text-3xl font-bold">
        My Profile
      </h2>

      <div className="flex flex-col items-center gap-6 md:flex-row">

        {/* Profile Picture */}

        <div>

          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName ?? "User"}
              className="h-28 w-28 rounded-full border-4 border-blue-500 object-cover shadow"
            />
          ) : (
            <UserCircle
              size={110}
              className="text-blue-500"
            />
          )}

        </div>

        {/* User Details */}

        <div className="flex-1 space-y-5">

          <div>

            <p className="text-sm font-medium text-gray-500">
              Display Name
            </p>

            <p className="text-xl font-semibold">
              {user?.displayName ?? "Not Available"}
            </p>

          </div>

          <div className="flex items-center gap-3">

            <Mail
              size={18}
              className="text-gray-500"
            />

            <div>

              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-medium">
                {user?.email}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Calendar
              size={18}
              className="text-gray-500"
            />

            <div>

              <p className="text-sm text-gray-500">
                Account Created
              </p>

              <p className="font-medium">
                {user?.metadata.creationTime ??
                  "Unknown"}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Calendar
              size={18}
              className="text-gray-500"
            />

            <div>

              <p className="text-sm text-gray-500">
                Last Sign In
              </p>

              <p className="font-medium">
                {user?.metadata.lastSignInTime ??
                  "Unknown"}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Provider */}

      <div className="mt-10 rounded-lg bg-gray-50 p-5">

        <h3 className="mb-3 text-lg font-semibold">
          Authentication
        </h3>

        <div className="space-y-2">

          {user?.providerData.map((provider) => (

            <div
              key={provider.providerId}
              className="flex items-center justify-between rounded-lg border bg-white px-4 py-3"
            >

              <span className="font-medium">
                {provider.providerId ===
                "google.com"
                  ? "Google Account"
                  : provider.providerId ===
                    "password"
                  ? "Email & Password"
                  : provider.providerId}
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Connected
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}