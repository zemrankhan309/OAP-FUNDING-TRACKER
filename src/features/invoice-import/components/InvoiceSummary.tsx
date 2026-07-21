import type { ParsedInvoice } from "../types/invoice";

interface Props {
  invoice: ParsedInvoice;
  selectedCount: number;
}

export default function InvoiceSummary({
  invoice,
  selectedCount,
}: Props) {
  const totalInvoiced = invoice.sessions.reduce(
    (sum, session) => sum + session.amount,
    0
  );

  const firstSession = invoice.sessions[0];

  return (
    <div className="rounded-lg border bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">
        Invoice Summary
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <strong>Provider:</strong>{" "}
          {invoice.summary.provider || "-"}
        </div>

        <div>
          <strong>Invoice #:</strong>{" "}
          {firstSession?.invoiceNumber || "-"}
        </div>

        <div>
          <strong>Invoice Date:</strong>{" "}
          {firstSession?.invoiceDate ||
            invoice.summary.statementDate ||
            "-"}
        </div>

        <div>
          <strong>Confidence:</strong>{" "}
          {invoice.confidence}%
        </div>

        <div>
          <strong>Total Sessions:</strong>{" "}
          {invoice.sessions.length}
        </div>

        <div>
          <strong>Total Amount:</strong>{" "}
          ${totalInvoiced.toFixed(2)}
        </div>

        <div>
          <strong>Selected:</strong>{" "}
          {selectedCount} / {invoice.sessions.length}
        </div>
      </div>
    </div>
  );
}