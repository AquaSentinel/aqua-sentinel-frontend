import { useState } from "react";
import ActionLoader from "./ActionLoader";

const ReportDialog = ({ open, onClose, onSend, attachHints = [], sending = false, status = "idle", onCancel = null }) => {
  const [form, setForm] = useState({ vessel: "", location: "", email: "", toEmail: "ops-cgces@indiancoastguard.nic.in", notes: "" });
  if (!open) return null;

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const send = () => { onSend(form); };

  const inputBase =
    "w-full rounded-xl border px-3 py-2 text-sm transition " +
    "placeholder:text-gray-500 dark:placeholder:text-black-400 " +
    "border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 " +
    "dark:border-white/10 dark:bg-white/10 dark:text-red";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 sm:p-4">
      {/* Backdrop: disable background click while sending to avoid accidental closure */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={sending ? undefined : onClose}
      />
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border
                   border-gray-200 bg-white shadow-xl
                   dark:border-white/10 dark:bg-[#0e1117]"
      >
        {/* Loader overlay when sending/cancelled/success - center it inside the dialog */}
        {(sending || status !== "idle") && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
            <div className="rounded-xl bg-white/90 p-6 dark:bg-[#071018]/90">
              <ActionLoader status={status === "idle" ? "loading" : status} label={status === "success" ? "Sent" : status === "cancelled" ? "Cancelled" : null} />
            </div>
          </div>
        )}
        <div className="border-b border-gray-200 px-5 py-4 text-3xl font-semibold text-gray-900 dark:border-white/10 dark:text-red">
          Send Report
        </div>

        <div className="px-5 py-4">
          <p className="text-lg text-gray-600 dark:text-red-300">
            Share concerns as a ship operator. We’ll compile a report and attach your images as a ZIP.
          </p>

          {attachHints?.length ? (
            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-lg text-gray-700 ring-1 ring-gray-200 dark:bg-white/5 dark:text-black-300 dark:ring-black/10">
              The following images will be included:
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {attachHints.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
          ) : null}

          <div className="mt-4 grid gap-3">
            <input name="vessel"   value={form.vessel}   onChange={handle} placeholder="Vessel / IMO Number"      className={inputBase} required={true}/>
            <input name="location" value={form.location} onChange={handle} placeholder="Location / Coordinates"    className={inputBase} required={true}/>
            <input name="email"    value={form.email}    onChange={handle} placeholder="Your contact email"        className={inputBase} required={true}/>
            <input name="toEmail"    value={form.toEmail}    onChange={handle} placeholder="Recipient email"        className={inputBase} required={true}/>
            <textarea name="notes" value={form.notes}    onChange={handle} placeholder="Describe the issue or observation"
                      rows={4} className={inputBase} required={true}/>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={() => {
                // If an explicit onCancel handler is provided (e.g. to abort an in-flight send), call it.
                if (sending && typeof onCancel === "function") {
                  onCancel();
                  return;
                }
                onClose();
              }}
              // Make the cancel button visually above the loader overlay so it's clickable
              className="relative z-40 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200
                         dark:bg-white/10 dark:text-black dark:hover:bg-black/15 btn btn-danger"
            >
              {sending ? "Cancel (stop)" : "Cancel"}
            </button>
            <button
              onClick={send}
              disabled={sending}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDialog;
