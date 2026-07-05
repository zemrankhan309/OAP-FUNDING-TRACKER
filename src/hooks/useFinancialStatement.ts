import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useSelectedChild } from "../contexts/SelectedChildContext";

import {
  loadFinancialStatement,
  type FinancialStatementData,
} from "../services/financialStatementActions";

const emptyStatement: FinancialStatementData = {
  totalFunding: 0,
  totalSpent: 0,
  remaining: 0,
  percentUsed: 0,

  allocations: [],
  expenses: [],

  categoryTotals: {},
};

export function useFinancialStatement() {
  const { user } = useAuth();
  const { selectedChild } = useSelectedChild();

  const [loading, setLoading] = useState(true);

  const [statement, setStatement] =
    useState<FinancialStatementData>(
      emptyStatement
    );

  const refresh = useCallback(async () => {
    if (!user || !selectedChild) {
      setStatement(emptyStatement);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data =
        await loadFinancialStatement(
          user.uid,
          selectedChild.id
        );

      setStatement(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedChild]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    loading,

    statement,

    refresh,
  };
}