import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";

import { getFinancialStatement } from "../services/financialStatementService";

export default function FinancialStatement() {
  const { user } = useAuth();

  const [statement, setStatement] = useState<any>(null);
  const [selectedAllocation, setSelectedAllocation] =
    useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      setLoading(true);

      const data = await getFinancialStatement(
        user.uid,
        selectedAllocation || undefined
      );

      setStatement(data);

      setLoading(false);
    }

    loadData();
  }, [user, selectedAllocation]);

  if (loading || !statement) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Page Header */}

        <div>
          <h1 className="text-4xl font-bold">
            Funding Statement
          </h1>

          <p className="mt-2 text-gray-500">
            Complete financial summary of your OAP funding.
          </p>
        </div>

        {/* Allocation Selector */}

        <div className="rounded-xl bg-white p-6 shadow">

          <label className="mb-2 block font-semibold">
            Funding Allocation
          </label>

          <select
            value={selectedAllocation}
            onChange={(e) =>
              setSelectedAllocation(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              All Funding Allocations
            </option>

            {statement.allocations.map((allocation: any) => (
              <option
                key={allocation.id}
                value={allocation.id}
              >
                {allocation.name}
              </option>
            ))}

          </select>

        </div>

        {/* Summary */}

        <div className="grid gap-6 md:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Funding Received
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {statement.totalFunding.toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Total Spent
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {statement.totalSpent.toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Remaining Balance
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {statement.remaining.toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Funding Used
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {statement.percentUsed.toFixed(1)}%
            </h2>
          </div>

        </div>

        {/* Progress */}

        <div className="rounded-xl bg-white p-6 shadow">

          <div className="mb-4 flex justify-between">

            <span className="font-semibold">
              Funding Usage
            </span>

            <span>
              {statement.percentUsed.toFixed(1)}%
            </span>

          </div>

          <div className="h-4 rounded-full bg-gray-200">

            <div
              className="h-4 rounded-full rounded-full bg-blue-600"
              style={{
                width: `${Math.min(
                  statement.percentUsed,
                  100
                )}%`,
              }}
            />

          </div>

        </div>

        {/* Spending by Category */}

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-4 text-2xl font-bold">
            Spending by Category
          </h2>

          {Object.keys(statement.categoryTotals).length === 0 ? (

            <p className="text-gray-500">
              No expenses found.
            </p>

          ) : (

            <div className="space-y-3">

              {Object.entries(statement.categoryTotals).map(
                ([category, amount]) => (
                  <div
                    key={category}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>{category}</span>

                    <span className="font-semibold">
                      {Number(amount).toLocaleString(
                        "en-CA",
                        {
                          style: "currency",
                          currency: "CAD",
                        }
                      )}
                    </span>

                  </div>
                )
              )}

            </div>

          )}

        </div>

        {/* Transaction History */}

        <div className="overflow-x-auto rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-2xl font-bold">
            Transaction History
          </h2>

          {statement.transactions.length === 0 ? (

            <p className="text-gray-500">
              No transactions found.
            </p>

          ) : (

            <table className="w-full">

              <thead>

                <tr className="border-b text-left">

                  <th className="pb-3">
                    Service Period
                  </th>

                  <th>Category</th>

                  <th>Provider</th>

                  <th>Description</th>

                  <th className="text-right">
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                {statement.transactions.map(
                  (expense: any) => (

                    <tr
                      key={expense.id}
                      className="border-b"
                    >

                      <td className="py-3">
                        {expense.startDate} → {expense.endDate}
                      </td>

                      <td>{expense.category}</td>

                      <td>{expense.provider}</td>

                      <td>{expense.description}</td>

                      <td className="text-right font-semibold">
                        {Number(
                          expense.amount
                        ).toLocaleString("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        })}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

              <tfoot>

                <tr className="border-t font-bold">

                  <td
                    colSpan={4}
                    className="pt-4"
                  >
                    Total Expenses
                  </td>

                  <td className="pt-4 text-right">
                    {statement.totalSpent.toLocaleString(
                      "en-CA",
                      {
                        style: "currency",
                        currency: "CAD",
                      }
                    )}
                  </td>

                </tr>

              </tfoot>

            </table>

          )}

        </div>

      </div>
    </DashboardLayout>
  );
}