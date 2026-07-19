import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import SummaryCard from "../components/dashboard/SummaryCard";

import { useAuth } from "../contexts/AuthContext";
import { useSelectedChild } from "../contexts/SelectedChildContext";

import { getDashboardData } from "../services/dashboardService";

import type { Allocation } from "../types/allocation";
import type { Expense } from "../types/expense";

interface DashboardData {
  allocations: Allocation[];
  expenses: Expense[];
  totalFunding: number;
  totalSpent: number;
  remaining: number;
  percentUsed: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { selectedChild } = useSelectedChild();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<DashboardData>({
    allocations: [],
    expenses: [],
    totalFunding: 0,
    totalSpent: 0,
    remaining: 0,
    percentUsed: 0,
  });

  useEffect(() => {
    async function loadDashboard() {
      if (!user || !selectedChild) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const dashboard = await getDashboardData(
          user.uid,
          selectedChild.id
        );

        setData(dashboard);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user, selectedChild]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-xl font-semibold">
            Loading Dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome back! Here's your funding summary.
          </p>

          {selectedChild && (
            <div className="mt-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Viewing: {selectedChild.firstName}{" "}
              {selectedChild.lastName}
            </div>
          )}
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

        {/* Funding Progress */}
        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Funding Used
            </h2>

            <span className="rounded-full bg-blue-100 px-3 py-1 font-bold text-blue-700">
              {data.percentUsed.toFixed(1)}%
            </span>
          </div>

          <div className="h-5 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-700"
              style={{
                width: `${Math.min(
                  data.percentUsed,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold">
              Recent Expenses
            </h3>

            <p className="mt-2 text-4xl font-bold">
              {data.expenses.length}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Total recorded expenses
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold">
              Funding Remaining
            </h3>

            <p className="mt-2 text-4xl font-bold text-green-600">
              ${data.remaining.toLocaleString()}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Available funding balance
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold">
              Funding Used
            </h3>

            <p className="mt-2 text-4xl font-bold text-blue-600">
              {data.percentUsed.toFixed(1)}%
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Overall funding utilization
            </p>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Recent Expenses
            </h2>

            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              View All →
            </button>
          </div>

          {data.expenses.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
              <div className="text-lg font-medium text-gray-600">
                No expenses yet
              </div>

              <p className="mt-2 text-gray-500">
                Add your first expense or import a
                therapy statement.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.expenses
                .slice(0, 5)
                .map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-semibold">
                        {expense.category}
                      </div>

                      <div className="mt-1 text-sm text-gray-500">
                        {expense.startDate} –{" "}
                        {expense.endDate}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-red-500">
                        -$
                        {Number(
                          expense.amount
                        ).toLocaleString()}
                      </div>

                      {expense.source ===
                        "invoice-import" && (
                        <div className="mt-1 text-xs font-semibold text-green-600">
                          Imported
                        </div>
                      )}
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