// Same columns as the iOS export (RocksCSV.swift).
export function escapeField(field) {
  if (!/[",\r\n]/.test(field)) return field;
  return `"${field.replaceAll('"', '""')}"`;
}

export function rocksToCSV(rocks) {
  const rows = rocks.map((rock) =>
    [
      rock.createdAt.toISOString(),
      rock.updatedAt.toISOString(),
      escapeField(rock.text),
    ].join(","),
  );
  return ["created_at,updated_at,text", ...rows].join("\n") + "\n";
}

export function downloadCSV(rocks) {
  const blob = new Blob([rocksToCSV(rocks)], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: "scriberocks.csv" });
  a.click();
  URL.revokeObjectURL(url);
}
