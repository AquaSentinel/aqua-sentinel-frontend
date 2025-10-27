// DualDetector.jsx
import React, { useState } from "react";
import ReportDialog from "./ReportDialog.jsx";
import UnifiedDetector from "./UnifiedDetector.jsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { auth, db, storage } from "../firebase";

const DualDetector = () => {
  const [reportOpen, setReportOpen] = useState(false);

  // Blobs from UnifiedDetector (originals + results)
  const [artifacts, setArtifacts] = useState({
    shipOriginal: null,
    shipResult: null,
    debrisOriginal: null,
    debrisResult: null,
    shipOrigUrl: "",
    shipResultUrl: "",
    debrisOrigUrl: "",
    debrisResultUrl: "",
  });

  // This ensures updates from UnifiedDetector get merged, not replaced
  const handleArtifactsChange = (update) => {
    setArtifacts((prev) => ({
      ...prev,
      ...update,
    }));
  };

  const attachHints = [
    artifacts.shipOriginal && "Ship->Original",
    artifacts.shipResult && "Ship->Result",
    artifacts.debrisOriginal && "Debris->Original",
    artifacts.debrisResult && "Debris->Result",
  ].filter(Boolean);

  const makeName = (blob, fallback) => {
    const type = (blob?.type || "").toLowerCase();
    if (type.includes("png")) return `${fallback}.png`;
    if (type.includes("webp")) return `${fallback}.webp`;
    if (type.includes("jpeg") || type.includes("jpg")) return `${fallback}.jpg`;
    return `${fallback}.png`;
  };

  const onSendReport = async (form) => {
    try {
      
      // Send to backend as multipart/form-data
      const fd = new FormData();
      fd.append("vessel", form.vessel || "");
      fd.append("location", form.location || "");
      fd.append("email", form.email || "");
      fd.append("notes", form.notes || "");
      fd.append("userId", auth.currentUser?.uid || "anonymous");

      const res = await fetch("http://localhost:5050/api/report", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      alert("Report sent successfully with ZIP attachments.");
      setReportOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send report. Please try again.");
    }
  };

  return (
    <>
      {/* Pass the new merge-aware callback */}
      <UnifiedDetector onArtifactsChange={handleArtifactsChange} />

      {/* CTA */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-indigo-200/40 bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-5 sm:p-6 md:p-10 shadow-lg">
        <div className="flex flex-col items-start justify-between gap-4 sm:gap-6 text-white md:flex-row md:items-center">
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">Need to notify an authority?</h3>
            <p className="mt-2 max-w-prose text-white/90">
              Open a report and we’ll attach both originals and both results as a single ZIP.
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

      {/* Report dialog */}
      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSend={onSendReport}
        attachHints={attachHints}
      />
    </>
  );
};

export default DualDetector;
