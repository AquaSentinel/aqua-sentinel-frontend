// DualDetector.jsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {Step,ImageLightbox} from "../utils/utils.jsx";
import Panel from "./Panel.jsx";
import ReportDialog from "./ReportDialog.jsx";
const ENDPOINTS = { ship: null, debris: null };


/* ---------- Main ---------- */
const DualDetector = () => {
  const [reportOpen, setReportOpen] = useState(false);

  const [shipImages, setShipImages] = useState({ originalFile: null, originalUrl: "", resultFile: null, resultUrl: "" });
  const [debrisImages, setDebrisImages] = useState({ originalFile: null, originalUrl: "", resultFile: null, resultUrl: "" });

  const attachHints = [
    shipImages.originalUrl && "Ship • Original",
    shipImages.resultUrl && "Ship • Result",
    debrisImages.originalUrl && "Debris • Original",
    debrisImages.resultUrl && "Debris • Result",
  ].filter(Boolean);

  const onSendReport = async (data) => {
    const files = [
      shipImages.originalFile && new File([shipImages.originalFile], "ship-original" + fileExt(shipImages.originalFile), { type: shipImages.originalFile.type }),
      shipImages.resultFile && new File([shipImages.resultFile], "ship-result" + fileExt(shipImages.resultFile), { type: shipImages.resultFile.type }),
      debrisImages.originalFile && new File([debrisImages.originalFile], "debris-original" + fileExt(debrisImages.originalFile), { type: debrisImages.originalFile.type }),
      debrisImages.resultFile && new File([debrisImages.resultFile], "debris-result" + fileExt(debrisImages.resultFile), { type: debrisImages.resultFile.type }),
    ].filter(Boolean);

    const shareText =
      `Aqua Sentinel Report\n\n` +
      `Vessel/IMO: ${data.vessel || "-"}\nLocation: ${data.location || "-"}\nContact: ${data.email || "-"}\n\n` +
      `Notes:\n${data.notes || "-"}\n\nAttachments: 4 images (Ship Original + Result, Debris Original + Result)\n`;

    if (navigator.canShare && files.length && navigator.canShare({ files })) {
      try {
        await navigator.share({ title: "Aqua Sentinel Report", text: shareText, files });
        return;
      } catch { /* fall through */ }
    }

    // Fallback: mailto with links (attachments not supported by mailto)
    const to = "authority@maritime.gov";
    const subject = encodeURIComponent("Aqua Sentinel Report");
    const body = encodeURIComponent(
      `${shareText}\n` +
      `Ship Original: ${shipImages.originalUrl || "-"}\n` +
      `Ship Result:   ${shipImages.resultUrl || "-"}\n` +
      `Debris Original: ${debrisImages.originalUrl || "-"}\n` +
      `Debris Result:   ${debrisImages.resultUrl || "-"}\n\n` +
      `(Generated from Aqua Sentinel Detection Studio)`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        <Panel title="Ship Detection" reportType="Ship Detection" endpoint={ENDPOINTS.ship} onImagesChange={setShipImages} />
        <Panel title="Marine Debris Detection" reportType="Marine Debris" endpoint={ENDPOINTS.debris} onImagesChange={setDebrisImages} />

        {/* Report CTA */}
        <div className="overflow-hidden rounded-3xl border border-indigo-200/40 bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-5 sm:p-6 md:p-10 shadow-lg">
          <div className="flex flex-col items-start justify-between gap-4 sm:gap-6 text-white md:flex-row md:items-center">
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">Need to notify an authority?</h3>
              <p className="mt-2 max-w-prose text-white/90">
                Open a report and describe your concern. We’ll compose an email and attach the images when possible.
              </p>
            </div>
            <button
              onClick={() => setReportOpen(true)}
              className="w-full sm:w-auto rounded-xl bg-white/90 px-5 py-3 text-sm font-semibold text-gray-900 ring-1 ring-white/40 transition hover:bg-white"
            >
              Send Report
            </button>
          </div>
        </div>
      </div>

      <ReportDialog open={reportOpen} onClose={() => setReportOpen(false)} onSend={onSendReport} attachHints={attachHints} />
    </>
  );
};

function fileExt(file) {
  const t = (file?.type || "").toLowerCase();
  if (t.includes("png")) return ".png";
  if (t.includes("webp")) return ".webp";
  if (t.includes("jpeg") || t.includes("jpg")) return ".jpg";
  return ".png";
}

export default DualDetector;
