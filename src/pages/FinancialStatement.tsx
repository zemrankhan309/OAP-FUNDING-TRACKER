import DashboardLayout from "../layouts/DashboardLayout";

import { useSelectedChild } from "../contexts/SelectedChildContext";

import { useFinancialStatement } from "../hooks/useFinancialStatement";

export default function FinancialStatement() {
  const { selectedChild } = useSelectedChild();

  const {
    loading,
    statement,
  } = useFinancialStatement();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-xl bg-white p-8 shadow">
          Loading Financial Statement...
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
            Financial Statement
          </h1>

          <p className="mt-2 text-gray-500">
            Funding summary for{" "}
            <span className="font-semibold text-blue-600">
              {selectedChild
                ? `${selectedChild.firstName} ${selectedChild.lastName}`
                : "No Child Selected"}
            </span>
          </p>

        </div>

        {/* Summary */}

        <div className="grid gap-6 md:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-gray-500">
              Total Funding
            </h3>

            <p className="mt-2 text-3xl font-bold">
              $
              {statement.totalFunding.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-gray-500">
              Total Spent
            </h3>

            <p className="mt-2 text-3xl font-bold text-red-500">
              $
              {statement.totalSpent.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-gray-500">
              Remaining
            </h3>

            <p className="mt-2 text-3xl font-bold text-green-600">
              $
              {statement.remaining.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-gray-500">
              Used
            </h3>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {statement.percentUsed.toFixed(1)}%
            </p>
          </div>

        </div>

        {/* Category Breakdown */}

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-6 text-2xl font-bold">
            Spending by Category
          </h2>

          {Object.keys(statement.categoryTotals).length === 0 ? (

            <p className="text-gray-500">
              No expenses recorded.
            </p>

          ) : (

            <div className="space-y-3">

              {Object.entries(statement.categoryTotals).map(
                ([category, total]) => (

                  <div
                    key={category}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>{category}</span>

                    <span className="font-semibold">
                      ${Number(total).toLocaleString()}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* Transactions */}

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-6 text-2xl font-bold">
            Transactions
          </h2>

          {statement.expenses.length === 0 ? (

            <p className="text-gray-500">
              No transactions.
            </p>

          ) : (

            <div className="space-y-4">

              {statement.expenses.map((expense: any) => (

                <div
                  key={expense.id}
                  className="flex items-center justify-between border-b pb-3"
                >

                  <div>

                    <div className="font-semibold">
                      {expense.category}
                    </div>

                    <div className="text-sm text-gray-500">
                      {expense.provider}
                    </div>

                    <div className="text-sm text-gray-400">
                      {expense.startDate} - {expense.endDate}
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