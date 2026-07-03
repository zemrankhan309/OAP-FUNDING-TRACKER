export type AllocationStatus =
  | "active"
  | "inactive"
  | "closed"
  | "archived";

export interface Allocation {
  id: string;

  name: string;

  program: string;

  amount: number;

  startDate: string;

  endDate: string;

  active: boolean;

  status: AllocationStatus;

  spent: number;

  remaining: number;

  expenseCount: number;

  percentUsed: number;
}