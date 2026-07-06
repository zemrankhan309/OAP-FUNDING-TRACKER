import { Shield } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function SecuritySettings() {
  const { user } = useAuth();

  return (
    <div className="rounded-xl bg-white p-8 shadow">

      <h2 className="mb-8 text-3xl font-bold">
        Security
      </h2>

      <div className="space-y-6">

        <div className="flex items-center gap-4">

          <Shield className="text-green-600" />

          <div>

            <h3 className="font-semibold">
              Authentication Provider
            </h3>

            <p className="text-gray-500">
              {user?.providerData[0]?.providerId}
            </p>

          </div>

        </div>

        <div>

          <h3 className="font-semibold">
            Email Address
          </h3>

          <p className="text-gray-500">
            {user?.email}
          </p>

        </div>

      </div>

    </div>
  );
}