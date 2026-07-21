import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { getProviderStatement } from "../services/reportService";
import { getAllProvidersAggregate } from "../services/reportService";
import { getAllocations } from "../services/allocationService";
import { getChildren } from "../services/childService";
import { downloadCsv } from "../utils/exportCsv";
import { exportHtmlStringToPdf } from "../utils/exportPdf";
import Modal from "../components/common/Modal";

export default function Reports() {
  const { user } = useAuth();

  const [provider, setProvider] = useState("");
  const [childId, setChildId] = useState<string | undefined>(undefined);
  const [allocationId, setAllocationId] = useState<string | undefined>(undefined);
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);

  const [children, setChildren] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);

  const [result, setResult] = useState<any>(null);
  const [aggregateResult, setAggregateResult] = useState<any>(null);
  const [mode, setMode] = useState<"provider" | "all">("provider");
  const [pdfOrientation, setPdfOrientation] = useState<"portrait" | "landscape">("portrait");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    async function loadLookups() {
      if (!user) return;

      const [c, a] = await Promise.all([
        getChildren(user.uid),
        getAllocations(user.uid),
      ]);

      setChildren(c);
      setAllocations(a);
    }

    loadLookups();
  }, [user]);

  // load for individual provider
  async function runProvider() {
    if (!user || !provider) return;

    const res = await getProviderStatement(
      user.uid,
      provider,
      fromDate,
      toDate,
      childId,
      allocationId
    );

    setResult(res);
  }

  async function loadAggregate() {
    if (!user) return;

    const res = await getAllProvidersAggregate(
      user.uid,
      fromDate,
      toDate,
      childId,
      allocationId
    );

    setAggregateResult(res);
  }

  function handleExportCsv() {
    if (!result) return;

    const rows = result.rows.map((r: any) => ({
      Date: r.date,
      Child: r.childName,
      Therapist: r.therapist,
      Category: r.category,
      Invoice: r.invoiceNumber,
      Description: r.description,
      Amount: r.amount,
    }));

    downloadCsv(`provider-statement-${provider}.csv`, rows);
  }

  function handlePreview() {
    if (!result && !aggregateResult) return;
    setIsPreviewOpen(true);
  }

  function handlePrint() {
    if (!result) return;

    const win = window.open("", "_blank");

    if (!win) return;

    const html = `
      <html>
      <head>
        <title>Provider Statement - ${provider}</title>
        <style>body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:20px} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:8px;text-align:left}</style>
      </head>
      <body>
        <h1>Provider Statement - ${provider}</h1>
        <p>Total Sessions: ${result.totalSessions} — Total Amount: ${result.totalAmount.toFixed(2)}</p>
        <table>
          <thead><tr><th>Date</th><th>Child</th><th>Therapist</th><th>Category</th><th>Invoice</th><th>Description</th><th>Amount</th></tr></thead>
          <tbody>
            ${result.rows
              .map((r: any) =>
                `<tr><td>${r.date}</td><td>${r.childName}</td><td>${r.therapist}</td><td>${r.category}</td><td>${r.invoiceNumber ?? ''}</td><td>${r.description}</td><td>${r.amount}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    win.document.open();
    win.document.write(html);
    win.document.close();
    win.print();
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Reports</h1>
          <p className="mt-2 text-gray-500">Provider Statement</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="grid gap-4 md:grid-cols-4">
            <input
              className="rounded-xl border border-gray-300 px-4 py-2"
              placeholder="Provider name"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            />

            <select
              className="rounded-xl border border-gray-300 px-4 py-2"
              value={childId ?? ""}
              onChange={(e) => setChildId(e.target.value || undefined)}
            >
              <option value="">All Children</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl border border-gray-300 px-4 py-2"
              value={allocationId ?? ""}
              onChange={(e) => setAllocationId(e.target.value || undefined)}
            >
              <option value="">All Allocations</option>
              {allocations
                .filter((a) => !childId || a.childId === childId)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>

            <div className="flex gap-2">
              <input
                type="date"
                value={fromDate ?? ""}
                onChange={(e) => setFromDate(e.target.value || undefined)}
                className="rounded-xl border border-gray-300 px-4 py-2"
              />

              <input
                type="date"
                value={toDate ?? ""}
                onChange={(e) => setToDate(e.target.value || undefined)}
                className="rounded-xl border border-gray-300 px-4 py-2"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => { setMode("provider"); runProvider(); }}
                className={`rounded-xl px-4 py-2 ${mode === "provider" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Provider
              </button>

              <button
                onClick={() => setMode("all")}
                className={`rounded-xl px-4 py-2 ${mode === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                All Providers
              </button>
            </div>

            <button
              onClick={() => {
                if (mode === "provider") handleExportCsv();
                else if (mode === "all" && aggregateResult) {
                  const rows = aggregateResult.rows.map((r: any) => ({
                    Provider: r.provider,
                    TotalSessions: r.totalSessions,
                    TotalAmount: r.totalAmount,
                    Average: r.averageCost,
                    FirstServiceDate: r.firstServiceDate,
                    LastServiceDate: r.lastServiceDate,
                  }));

                  downloadCsv("all-providers-summary.csv", rows);
                }
              }}
              className="rounded-xl bg-gray-200 px-4 py-2"
            >
              Export CSV
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm">PDF:</label>
              <select
                value={pdfOrientation}
                onChange={(e) => setPdfOrientation(e.target.value as any)}
                className="rounded-xl border border-gray-300 px-3 py-2"
              >
                <option value="portrait">A4 Portrait</option>
                <option value="landscape">A4 Landscape</option>
              </select>
            </div>

            <button
              onClick={handlePreview}
              className="rounded-xl bg-gray-200 px-4 py-2"
            >
              Preview
            </button>

            <button
              onClick={handlePrint}
              className="rounded-xl bg-gray-200 px-4 py-2"
            >
              Print
            </button>

            <button
              onClick={() => {
                if (mode === "provider" && result) {
                  const html = `
                    <html>
                    <head>
                      <title>Provider Statement - ${provider}</title>
                      <style>html,body{width:100%;margin:0;padding:0;background:#fff;color:#111;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:10px;line-height:1.4;} body{padding:20px;} h1{font-size:16px;margin:0 0 10px;} p{margin:0 0 12px;} table{width:100%;border-collapse:collapse;table-layout:fixed;} th,td{border:1px solid #ddd;padding:6px;text-align:left;vertical-align:top;word-break:break-word;font-size:9px;} th{background:#f3f4f6;font-weight:700;} th:nth-child(1),td:nth-child(1){width:30%;} th:nth-child(2),td:nth-child(2){width:15%;} th:nth-child(3),td:nth-child(3){width:15%;} th:nth-child(4),td:nth-child(4){width:13%;} th:nth-child(5),td:nth-child(5){width:12%;} th:nth-child(6),td:nth-child(6){width:15%;}</style>
                    </head>
                    <body>
                      <h1>Provider Statement - ${provider}</h1>
                      <p>Total Sessions: ${result.totalSessions} — Total Amount: ${result.totalAmount.toFixed(2)}</p>
                      <table>
                        <thead><tr><th>Date</th><th>Child</th><th>Therapist</th><th>Category</th><th>Invoice</th><th>Description</th><th>Amount</th></tr></thead>
                        <tbody>
                          ${result.rows
                            .map((r: any) =>
                              `<tr><td>${r.date}</td><td>${r.childName}</td><td>${r.therapist}</td><td>${r.category}</td><td>${r.invoiceNumber ?? ''}</td><td>${r.description}</td><td>${r.amount}</td></tr>`
                            )
                            .join("")}
                        </tbody>
                      </table>
                    </body>
                    </html>
                  `;
                  exportHtmlStringToPdf(html, `provider-statement-${provider}.pdf`, { orientation: pdfOrientation });
                } else if (mode === "all" && aggregateResult) {
                  const rowsHtml = aggregateResult.rows
                    .map((r: any) => `<tr><td>${r.provider}</td><td>${r.totalSessions}</td><td>${r.totalAmount.toFixed(2)}</td><td>${r.averageCost.toFixed(2)}</td><td>${r.firstServiceDate}</td><td>${r.lastServiceDate}</td></tr>`)
                    .join("");

                  const html = `
                    <html>
                    <head>
                      <title>All Providers Summary</title>
                      <style>html,body{width:100%;margin:0;padding:0;background:#fff;color:#111;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:10px;line-height:1.4;} body{padding:20px;} h1{font-size:16px;margin:0 0 10px;} p{margin:0 0 12px;} table{width:100%;border-collapse:collapse;table-layout:fixed;} th,td{border:1px solid #ddd;padding:6px;text-align:left;vertical-align:top;word-break:break-word;font-size:9px;} th{background:#f3f4f6;font-weight:700;} th:nth-child(1),td:nth-child(1){width:30%;} th:nth-child(2),td:nth-child(2){width:12%;} th:nth-child(3),td:nth-child(3){width:15%;} th:nth-child(4),td:nth-child(4){width:13%;} th:nth-child(5),td:nth-child(5){width:15%;} th:nth-child(6),td:nth-child(6){width:15%;}</style>
                    </head>
                    <body>
                      <h1>All Providers Summary</h1>
                      <p>Grand Sessions: ${aggregateResult.grandTotalSessions} — Grand Total: ${aggregateResult.grandTotalAmount.toFixed(2)}</p>
                      <table>
                        <thead><tr><th>Provider</th><th>Sessions</th><th>Total Amount</th><th>Average</th><th>First</th><th>Last</th></tr></thead>
                        <tbody>
                          ${rowsHtml}
                        </tbody>
                      </table>
                    </body>
                    </html>
                  `;

                  exportHtmlStringToPdf(html, `all-providers-summary.pdf`, { orientation: pdfOrientation });
                }
              }}
              className="rounded-xl bg-gray-200 px-4 py-2"
            >
              Export PDF
            </button>
          </div>

          {mode === "provider" && result && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Summary</h3>
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                <div>Total Sessions: {result.totalSessions}</div>
                <div>Total Amount: ${result.totalAmount.toFixed(2)}</div>
                <div>Average: ${result.averageCost.toFixed(2)}</div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-semibold">Rows</h4>
                <div className="mt-2 space-y-2">
                  {result.rows.map((r: any, idx: number) => (
                    <div key={idx} className="rounded-lg border p-3">
                      <div className="font-semibold">{r.date} — {r.childName}</div>
                      <div>{r.therapist} • {r.category} • {r.invoiceNumber}</div>
                      <div className="font-bold">${r.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === "all" && (
            <div className="mt-6">
              <div className="flex gap-3">
                <button
                  onClick={loadAggregate}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-white"
                >
                  Run All Providers
                </button>
              </div>

              {aggregateResult && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">All Providers Summary</h3>

                  <div className="mt-2 grid gap-2">
                    <div>Grand Sessions: {aggregateResult.grandTotalSessions}</div>
                    <div>Grand Total: ${aggregateResult.grandTotalAmount.toFixed(2)}</div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {aggregateResult.rows.map((r: any, idx: number) => (
                      <div key={idx} className="rounded-lg border p-3 flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{r.provider}</div>
                          <div className="text-sm text-gray-600">{r.totalSessions} sessions • Avg ${r.averageCost.toFixed(2)}</div>
                        </div>

                        <div className="font-bold">${r.totalAmount.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isPreviewOpen}
        title={mode === "provider" ? "Provider Statement Preview" : "All Providers Preview"}
        onClose={() => setIsPreviewOpen(false)}
        width="xl"
      >
        {mode === "provider" && result ? (
          <div className="space-y-4" style={{ fontFamily: "system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}>
            <div>
              <h2 className="text-2xl font-bold">Provider Statement - {provider}</h2>
              <p>Total Sessions: {result.totalSessions} — Total Amount: ${result.totalAmount.toFixed(2)}</p>
            </div>

            <div className="overflow-x-auto border rounded-xl">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Date</th>
                    <th className="border px-3 py-2 text-left">Child</th>
                    <th className="border px-3 py-2 text-left">Therapist</th>
                    <th className="border px-3 py-2 text-left">Category</th>
                    <th className="border px-3 py-2 text-left">Invoice</th>
                    <th className="border px-3 py-2 text-left">Description</th>
                    <th className="border px-3 py-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r: any, idx: number) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border px-3 py-2">{r.date}</td>
                      <td className="border px-3 py-2">{r.childName}</td>
                      <td className="border px-3 py-2">{r.therapist}</td>
                      <td className="border px-3 py-2">{r.category}</td>
                      <td className="border px-3 py-2">{r.invoiceNumber ?? ""}</td>
                      <td className="border px-3 py-2">{r.description}</td>
                      <td className="border px-3 py-2">${r.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {mode === "all" && aggregateResult ? (
          <div className="space-y-4" style={{ fontFamily: "system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}>
            <div>
              <h2 className="text-2xl font-bold">All Providers Summary</h2>
              <p>Grand Sessions: {aggregateResult.grandTotalSessions} — Grand Total: ${aggregateResult.grandTotalAmount.toFixed(2)}</p>
            </div>

            <div className="overflow-x-auto border rounded-xl">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Provider</th>
                    <th className="border px-3 py-2 text-left">Sessions</th>
                    <th className="border px-3 py-2 text-left">Total Amount</th>
                    <th className="border px-3 py-2 text-left">Average</th>
                    <th className="border px-3 py-2 text-left">First</th>
                    <th className="border px-3 py-2 text-left">Last</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregateResult.rows.map((r: any, idx: number) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border px-3 py-2">{r.provider}</td>
                      <td className="border px-3 py-2">{r.totalSessions}</td>
                      <td className="border px-3 py-2">${r.totalAmount.toFixed(2)}</td>
                      <td className="border px-3 py-2">${r.averageCost.toFixed(2)}</td>
                      <td className="border px-3 py-2">{r.firstServiceDate}</td>
                      <td className="border px-3 py-2">{r.lastServiceDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </Modal>
    </DashboardLayout>
  );
}
