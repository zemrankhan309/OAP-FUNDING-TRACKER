import { getExpenses } from "./expenseService";
import { getAllocations } from "./allocationService";
import { getChildren } from "./childService";

export interface ProviderStatementRow {
  date: string;
  childName: string;
  therapist: string;
  category: string;
  invoiceNumber?: string;
  description: string;
  amount: number;
}

export interface ProviderStatementResult {
  rows: ProviderStatementRow[];
  totalAmount: number;
  totalSessions: number;
  averageCost: number;
  firstServiceDate?: string;
  lastServiceDate?: string;
}

export async function getProviderStatement(
  uid: string,
  provider: string,
  from?: string,
  to?: string,
  childId?: string,
  allocationId?: string
): Promise<ProviderStatementResult> {
  const [expenses, allocations, children] = await Promise.all([
    getExpenses(uid),
    getAllocations(uid),
    getChildren(uid),
  ]);

  const lowerProvider = provider.trim().toLowerCase();

  let filtered = expenses.filter((e) =>
    e.provider?.toLowerCase().includes(lowerProvider)
  );

  if (childId) {
    const childAllocIds = allocations
      .filter((a) => a.childId === childId)
      .map((a) => a.id);

    filtered = filtered.filter((e) =>
      childAllocIds.includes(e.allocationId)
    );
  }

  if (allocationId) {
    filtered = filtered.filter(
      (e) => e.allocationId === allocationId
    );
  }

  if (from) {
    filtered = filtered.filter((e) => e.startDate >= from);
  }

  if (to) {
    filtered = filtered.filter((e) => e.startDate <= to);
  }

  // Map to rows with child names
  const rows: ProviderStatementRow[] = filtered.map((e) => {
    const alloc = allocations.find((a) => a.id === e.allocationId);
    const child = children.find((c) => c.id === alloc?.childId);

    return {
      date: e.startDate,
      childName: child
        ? `${child.firstName} ${child.lastName}`
        : "Unknown",
      therapist: e.therapist ?? "",
      category: e.category,
      invoiceNumber: e.invoiceNumber,
      description: e.description,
      amount: e.amount,
    };
  });

  const totalAmount = rows.reduce((s, r) => s + (r.amount || 0), 0);
  const totalSessions = rows.length;
  const averageCost = totalSessions > 0 ? totalAmount / totalSessions : 0;

  const sortedDates = rows
    .map((r) => r.date)
    .filter(Boolean)
    .sort();

  return {
    rows: rows.sort((a, b) => (a.date < b.date ? -1 : 1)),
    totalAmount,
    totalSessions,
    averageCost,
    firstServiceDate: sortedDates[0],
    lastServiceDate: sortedDates[sortedDates.length - 1],
  };
}

export interface ProviderAggregateRow {
  provider: string;
  totalSessions: number;
  totalAmount: number;
  averageCost: number;
  firstServiceDate?: string;
  lastServiceDate?: string;
}

export interface ProviderAggregateResult {
  rows: ProviderAggregateRow[];
  grandTotalAmount: number;
  grandTotalSessions: number;
}

export async function getAllProvidersAggregate(
  uid: string,
  from?: string,
  to?: string,
  childId?: string,
  allocationId?: string
): Promise<ProviderAggregateResult> {
  const [expenses, allocations] = await Promise.all([
    getExpenses(uid),
    getAllocations(uid),
  ]);

  let filtered = expenses.slice();

  if (childId) {
    const childAllocIds = allocations
      .filter((a) => a.childId === childId)
      .map((a) => a.id);

    filtered = filtered.filter((e) =>
      childAllocIds.includes(e.allocationId)
    );
  }

  if (allocationId) {
    filtered = filtered.filter(
      (e) => e.allocationId === allocationId
    );
  }

  if (from) filtered = filtered.filter((e) => e.startDate >= from);
  if (to) filtered = filtered.filter((e) => e.startDate <= to);

  // group by provider
  const map = new Map<string, ProviderAggregateRow & { dates: string[] }>();

  for (const e of filtered) {
    const key = (e.provider || "Unknown").trim();

    if (!map.has(key)) {
      map.set(key, {
        provider: key,
        totalSessions: 0,
        totalAmount: 0,
        averageCost: 0,
        firstServiceDate: undefined,
        lastServiceDate: undefined,
        dates: [],
      } as any);
    }

    const entry = map.get(key)!;
    entry.totalSessions += 1;
    entry.totalAmount += e.amount || 0;
    if (e.startDate) entry.dates.push(e.startDate);
  }

  const rows: ProviderAggregateRow[] = Array.from(map.values()).map((v) => {
    const sorted = v.dates.sort();
    return {
      provider: v.provider,
      totalSessions: v.totalSessions,
      totalAmount: v.totalAmount,
      averageCost: v.totalSessions > 0 ? v.totalAmount / v.totalSessions : 0,
      firstServiceDate: sorted[0],
      lastServiceDate: sorted[sorted.length - 1],
    };
  });

  // sort alphabetically by provider
  rows.sort((a, b) => a.provider.toLowerCase().localeCompare(b.provider.toLowerCase()));

  const grandTotalAmount = rows.reduce((s, r) => s + r.totalAmount, 0);
  const grandTotalSessions = rows.reduce((s, r) => s + r.totalSessions, 0);

  return {
    rows,
    grandTotalAmount,
    grandTotalSessions,
  };
}

