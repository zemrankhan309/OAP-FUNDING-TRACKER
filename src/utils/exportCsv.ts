export function downloadCsv(filename: string, rows: any[]) {
  if (!rows || rows.length === 0) {
    const blob = new Blob([""], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return;
  }

  const keys = Object.keys(rows[0]);

  const csv = [keys.join(",")].concat(
    rows.map((r) =>
      keys
        .map((k) => {
          const val = r[k] ?? "";
          if (typeof val === "string") {
            // escape quotes
            return `"${val.replace(/"/g, '""')}"`;
          }

          return val;
        })
        .join(",")
    )
  ).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
