import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ExportButton({
  wrapperId = "malware-report-area",
  status,        // "SAFE" | "MALICIOUS" (button disabled unless MALICIOUS)
  filenameBase = "malware_charts",
}) {
  const [busy, setBusy] = useState(false);

  const capture = async () => {
    const el = document.getElementById(wrapperId);
    if (!el) throw new Error(`Could not find element #${wrapperId}`);
    return await html2canvas(el, { scale: 2, useCORS: true, logging: false });
  };

  const downloadPNG = async () => {
    try {
      setBusy(true);
      const canvas = await capture();
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${filenameBase}.png`;
      a.click();
    } finally {
      setBusy(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setBusy(true);
      const canvas = await capture();
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 20;

      // Fit image onto a single A4 page
      const img = new Image();
      img.src = imgData;
      await new Promise((r) => (img.onload = r));
      const ratio = Math.min(
        (pageW - margin * 2) / img.width,
        (pageH - margin * 2) / img.height
      );
      const w = img.width * ratio;
      const h = img.height * ratio;
      pdf.addImage(imgData, "PNG", (pageW - w) / 2, (pageH - h) / 2, w, h);
      pdf.save(`${filenameBase}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  const disabled = busy || status !== "MALICIOUS";

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={downloadPNG} disabled={disabled}>
        {busy ? "Exporting..." : "Export PNG"}
      </button>
      <button onClick={downloadPDF} disabled={disabled}>
        {busy ? "Exporting..." : "Export PDF"}
      </button>
    </div>
  );
}
