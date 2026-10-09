const escapeCsvCell = (value) => {
    const rawText = String(value ?? "");
    const text = /^[\s]*[=+@-]/.test(rawText) ? `'${rawText}` : rawText;
    return `"${text.replaceAll('"', '""')}"`;
};

export const downloadCsv = (filename, headers, rows) => {
    const contents = [headers, ...rows]
        .map((row) => row.map(escapeCsvCell).join(","))
        .join("\r\n");
    const file = new Blob(["\ufeff", contents], {
        type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
