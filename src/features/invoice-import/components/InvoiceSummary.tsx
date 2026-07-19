import type { ParsedInvoice } from "../types/invoice";

interface Props {
  invoice: ParsedInvoice;
  selectedCount: number;
}

export default function InvoiceSummary({
  invoice,
  selectedCount,
}: Props) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">
        Statement Summary
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <strong>Provider:</strong>{" "}
          {invoice.summary.provider || "-"}
        </div>

        <div>
          <strong>Account:</strong>{" "}
          {invoice.summary.accountName || "-"}
        </div>

        <div>
          <strong>Statement Date:</strong>{" "}
          {invoice.summary.statementDate || "-"}
        </div>

        <div>
          <strong>Confidence:</strong>{" "}
          {invoice.confidence}%
        </div>

        <div>
          <strong>Total Invoiced:</strong>{" "}
          ${invoice.summary.totalInvoiced.toFixed(2)}
        </div>

        <div>
          <strong>Total Paid:</strong>{" "}
          ${invoice.summary.totalPaid.toFixed(2)}
        </div>

        <div>
          <strong>Balance:</strong>{" "}
          ${invoice.summary.balance.toFixed(2)}
        </div>

        <div>
          <strong>Selected:</strong>{" "}
          {selectedCount} / {invoice.sessions.length}
        </div>
      </div>
    </div>
  );
}