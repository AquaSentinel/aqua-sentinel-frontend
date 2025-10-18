import {useState} from "react";

/* ---------- Report Dialog (dark mode placeholders fixed) ---------- */

const ReportDialog = ({ open, onClose, onSend, attachHints = [] }) => {
  const [form, setForm] = useState({ vessel: "", location: "", email: "", notes: "" });
  if (!open) return null;
  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const send = () => { onSend(form); onClose(); };

  const inputBase =
    "w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 ring-indigo-500/0 " +
    "placeholder:text-gray-500 dark:placeholder-gray-400 " +
    "border-gray-200 bg-white text-gray-900 " +
    "dark:border-white/10 dark:bg-white/10 dark:text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-200/70 bg-white p-5 shadow-xl
                      dark:border-white/10 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Send Report</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Share concerns as a ship operator. We’ll compose an email to the concerned authority.
        </p>

        {attachHints?.length ? (
          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-700 ring-1 ring-gray-200
                          dark:bg-slate-800 dark:text-gray-300 dark:ring-white/10">
            The following images will be attached/shared:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {attachHints.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
        ) : null}

        <div className="mt-4 grid gap-3">
          <input name="vessel" value={form.vessel} onChange={handle} placeholder="Vessel / IMO Number" className={inputBase} />
          <input name="location" value={form.location} onChange={handle} placeholder="Location / Coordinates" className={inputBase} />
          <input name="email" value={form.email} onChange={handle} placeholder="Your contact email" className={inputBase} />
          <textarea name="notes" value={form.notes} onChange={handle} placeholder="Describe the issue or observation" rows={4} className={inputBase} />
        </div>

        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button onClick={onClose}
            className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200
                       dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/15">
            Cancel
          </button>
          <button onClick={send} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReportDialog;
