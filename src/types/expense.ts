export interface Expense {
  id: string;

  allocationId: string;

  category: string;

  provider: string;

  description: string;

  amount: number;

  startDate: string;

  endDate: string;

  notes: string;

  createdAt?: any;
}