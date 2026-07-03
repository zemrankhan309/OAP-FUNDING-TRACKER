import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import SummaryCard from "../components/dashboard/SummaryCard";

import { useAuth } from "../contexts/AuthContext";

import { getDashboardData } from "../services/dashboardService";

export default function Dashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    allocations: [],
    expenses: [],
    totalFunding: 0,
    totalSpent: 0,
    remaining: 0,
    percentUsed: 0,
  });

  useEffect(() => {
    if (!user) return;

    async function loadDashboard() {
      const dashboard = await getDashboardData(user.uid);

      setData(dashboard);

      setLoading(false);
    }

    loadDashboard();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-xl">
          Loading Dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}

        <div>
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome back! Here's your funding summary.
          </p>
        </div>

        {/* Summary */}

        <div className="grid gap-6 md:grid-cols-3">

          <SummaryCard
            title="Total Funding"
            value={`$${data.totalFunding.toLocaleString()}`}
          />

          <SummaryCard
            title="Spent"
            value={`$${data.totalSpent.toLocaleString()}`}
            color="text-red-500"
          />

          <SummaryCard
            title="Remaining"
            value={`$${data.remaining.toLocaleString()}`}
            color="text-green-600"
          />

        </div>

        {/* Progress */}

        <div className="rounded-xl bg-white p-6 shadow">

          <div className="mb-3 flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Funding Used
            </h2>

            <span className="font-bold">
              {data.percentUsed.toFixed(1)}%
            </span>

          </div>

          <div className="h-5 overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${Math.min(
                  data.percentUsed,
                  100
                )}%`,
              }}
            />

          </div>

        </div>

        {/* Recent Expenses */}

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-semibold">
            Recent Expenses
          </h2>

          {data.expenses.length === 0 ? (
            <p className="text-gray-500">
              No expenses yet.
            </p>
          ) : (
            <div className="space-y-4">

              {data.expenses.slice(0, 5).map((expense: any) => (

                <div
                  key={expense.id}
                  className="flex items-center justify-between border-b pb-3"
                >

                  <div>

                    <div className="font-semibold">
                      {expense.category}
                    </div>

                    <div className="text-sm text-gray-500">
                      {expense.startDate}

                      {"  "}to{"  "}

                      {expense.endDate}
                    </div>

                  </div>

                  <div className="font-bold text-red-500">
                    -$
                    {Number(expense.amount).toLocaleString()}
                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}