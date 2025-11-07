import React, { useState, useRef } from "react";
import ReportDialog from "./ReportDialog.jsx";
import { auth } from "../firebase";
import { apiUrl } from "../lib/api";

const makeName = (blob, fallback) => {
  const type = (blob?.type || "").toLowerCase();
  if (type.includes("png")) return `${fallback}.png`;
  if (type.includes("webp")) return `${fallback}.webp`;
  if (type.includes("jpeg") || type.includes("jpg")) return `${fallback}.jpg`;
  return `${fallback}.png`;
};

const makeNameFromUrl = (url, idx, fallback) => {
  try {
    const lower = (url || "").toLowerCase();
    if (lower.includes(".png")) return `${fallback}-${idx + 1}.png`;
    if (lower.includes(".webp")) return `${fallback}-${idx + 1}.webp`;
    if (lower.includes(".jpg") || lower.includes(".jpeg")) return `${fallback}-${idx + 1}.jpg`;
  } catch (e) {
    // ignore
  }
  return `${fallback}-${idx + 1}.png`;
};

const SendReport = ({ open, onClose, artifacts = {}, attachHints = [], record = null }) => {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | cancelled
  const [statusLabel, setStatusLabel] = useState(null);
  const controllerRef = useRef(null);

  const abortInFlight = () => {
    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch (e) {
        // ignore
      }
    }
  };

  const onSend = async (form) => {
    try {
      setSending(true);
      setStatus("loading");
      setStatusLabel(null);

      const fd = new FormData();
      fd.append("vessel", form.vessel || "");
      fd.append("location", form.location || "");
      fd.append("email", form.email || "");
      fd.append("toEmail", form.toEmail || "");
      fd.append("notes", form.notes || "");
      fd.append("userId", auth.currentUser?.uid || "anonymous");

      controllerRef.current = new AbortController();
      const signal = controllerRef.current.signal;

      // If a record is provided (from LogPanel), include record metadata and
      // fetch images stored as URLs on the record and attach them.
      if (record) {
        fd.append("recordId", record.id || "");
        fd.append("recordTs", record.createdAt ? record.createdAt.toString() : "");

        const imgs = record.images || [];
        for (let i = 0; i < imgs.length; i++) {
          const url = imgs[i];
          try {
            const res = await fetch(url, { signal });
            if (!res.ok) throw new Error(`Failed to fetch image ${i}`);
            const blob = await res.blob();
            const name = makeNameFromUrl(url, i, `record-${record.id || 'r'}-${i+1}`);
            fd.append(`image${i + 1}`, blob, name);
          } catch (fe) {
            if (fe.name === 'AbortError') {
              // aborted while fetching images
              throw fe;
            }
            console.error('[SendReport] failed to fetch record image:', fe, url);
          }
        }
      }

      if (artifacts.shipOriginal) {
        fd.append(
          "shipOriginal",
          artifacts.shipOriginal,
          makeName(artifacts.shipOriginal, "ship-original")
        );
      }
      if (artifacts.shipResult) {
        fd.append(
          "shipResult",
          artifacts.shipResult,
          makeName(artifacts.shipResult, "ship-result")
        );
      }
      if (artifacts.debrisOriginal) {
        fd.append(
          "debrisOriginal",
          artifacts.debrisOriginal,
          makeName(artifacts.debrisOriginal, "debris-original")
        );
      }
      if (artifacts.debrisResult) {
        fd.append(
          "debrisResult",
          artifacts.debrisResult,
          makeName(artifacts.debrisResult, "debris-result")
        );
      }

  // Resolve backend endpoint using centralized helper (supports same-origin fallback under HTTPS)
  const endpoint = apiUrl("/api/report");
       
      console.log('[SendReport] posting to', endpoint);

      // If the user is authenticated, attach their ID token so the backend can verify identity server-side.
      const headers = {};
      try {
        if (auth.currentUser) {
          const idToken = await auth.currentUser.getIdToken();
          if (idToken) headers["Authorization"] = `Bearer ${idToken}`;
        }
      } catch (e) {
        console.warn('[SendReport] failed to get idToken', e);
      }

      const res = await fetch(endpoint, {
        method: "POST",
        body: fd,
        signal,
        headers,
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      // success
      setStatus("success");
      setStatusLabel("Sent");
      // keep loader visible briefly then close
      setTimeout(() => {
        setSending(false);
        setStatus("idle");
        setStatusLabel(null);
        controllerRef.current = null;
        onClose();
      }, 900);
    } catch (err) {
      if (err?.name === 'AbortError') {
        // cancellation path: show success tick (as requested) but label as Cancelled
        setStatus("success");
        setStatusLabel("Cancelled");
        setTimeout(() => {
          setSending(false);
          setStatus("idle");
          setStatusLabel(null);
          controllerRef.current = null;
          onClose();
        }, 900);
        return;
      }

      console.error("[SendReport] send failed:", err);
      alert("Failed to send report. Please try again.");
      setStatus("idle");
      setStatusLabel(null);
      controllerRef.current = null;
      setSending(false);
    }
  };

  const handleCancel = () => {
    // If a send is in-progress, abort it; otherwise just close.
    if (sending) {
      // show loading state while abort completes
      abortInFlight();
    } else {
      onClose();
    }
  };

  return (
    <ReportDialog
      open={open}
      onClose={onClose}
      onSend={onSend}
      attachHints={attachHints}
      sending={sending}
      status={status}
      onCancel={handleCancel}
    />
  );
};

export default SendReport;
