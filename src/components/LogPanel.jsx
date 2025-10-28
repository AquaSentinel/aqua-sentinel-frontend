import React, { useMemo, useState } from "react";
import useLogs from "../hooks/useLogs";
import { auth } from "../firebase";
import SendReport from "./SendReport.jsx";
import { deleteRecord } from "../lib/deleteRecord";
import ActionLoader from "./ActionLoader";
// Demo images (local assets) - used only for a temporary UI demo when datastore is empty
import demoShip from "../assets/images/shipdetect.png";
import demoDebris from "../assets/images/debrisdetect.png";
import demoAqua from "../assets/images/aqua.png";

export default function LogPanel({ uid: uidProp }) {
  const uid = uidProp || auth.currentUser?.uid || null;
  const { logs, loading, error } = useLogs(uid);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const list = useMemo(() => logs || [], [logs]);

  // Demo record shown when there are no real logs (non-persistent)
  const demoRecord = useMemo(
    () => ({
      id: "demo-record",
      images: [demoShip, demoDebris, demoShip, demoDebris],
      emailId: "demo@local",
      createdAt: new Date(),
      demo: true,
    }),
    []
  );

  const displayList =
    !loading && (!list || list.length === 0) ? [demoRecord] : list;

  const openItem = (item) => {
    setSelected(item);
    setOpen(true);
  };

  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);


  // Report dialog state (for sending a report for the selected log)
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const makeName = (url, idx, fallback) => {
    // Try to derive extension from URL (fallback to png)
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

  // onSend is handled inside SendReport when we pass `record={selected}`

  return (
    <>
      {/* Toggle button (floating) - bottom-right for better visibility */}
      <div className="fixed right-4 bottom-6 z-50">
        <button
          title="Open Logs"
          onClick={() => setOpen((v) => !v)}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 px-3 py-2 text-sm font-semibold text-gray-800 shadow-lg dark:bg-gray-800 dark:text-white"
        >
          📚
        </button>
      </div>

      {/* Side panel */}
      <aside
        className={`fixed right-0 top-0 z-40 h-full w-96 transform bg-white/95 p-4 shadow-xl transition-transform dark:bg-gray-900 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between">
          <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent text-3xl font-bold">
          Detection Logs
        </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(false)}
              className="btn btn-primary rounded-md px-3 py-1 text-lg text-white hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mt-4 h-[calc(100%-4rem)] overflow-auto">
          {loading && <div className="text-sm text-gray-600">Loading…</div>}
          {error && (
            <div className="text-sm text-red-600">Error loading logs</div>
          )}

          {!loading && list.length === 0 && (
            <div className="text-lg text-gray-600">No logs yet.</div>
          )}

          <ul className="mt-2 space-y-2">
            {displayList.map((it) => {
              const when = it.createdAt
                ? it.createdAt.toLocaleString()
                : it.id || "unknown";
              return (
                <li
                  key={it.id}
                  className="cursor-pointer rounded-md border p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => { if (deletingId === it.id) return; openItem(it); }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {when}
                        </div>
                        {it.demo && (
                          <div className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                            Demo
                          </div>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {it.images?.length || 0} images
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Inline delete icon or loader */}
                      {deletingId === it.id ? (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <ActionLoader status="loading" size={28} showLabel={false} />
                        </div>
                      ) : (
                        // show inline confirm when requested for this item
                        confirmDeleteId === it.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const uidNow = uid || auth.currentUser?.uid;
                                  if (!uidNow) throw new Error('No authenticated user');
                                  setDeletingId(it.id);
                                  setConfirmDeleteId(null);
                                  console.log('[LogPanel] deleting', it.id);
                                  await deleteRecord(uidNow, it.id, it.images || []);
                                  if (selected && selected.id === it.id) {
                                    setSelected(null);
                                    setOpen(false);
                                  }
                                  setDeletingId(null);
                                } catch (e) {
                                  console.error('[LogPanel] delete failed', e);
                                  alert('Failed to delete log. See console for details.');
                                  setDeletingId(null);
                                  setConfirmDeleteId(null);
                                }
                              }}
                              className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                            >
                              Yes
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                              className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-800 hover:bg-gray-200"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); console.log('[LogPanel] delete clicked', it.id); setConfirmDeleteId(it.id); }}
                            title="Delete log"
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 6v14a2 2 0 002 2h4a2 2 0 002-2V6" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 10v6" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10v6" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                            </svg>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Modal for selected log */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-auto">
          <div className="mx-4 max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-4 shadow-lg dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">
                {selected.createdAt
                  ? selected.createdAt.toLocaleString()
                  : selected.id}
              </h4>
                <div className="flex gap-2">
                <button
                  onClick={() => setReportDialogOpen(true)}
                  className="btn btn-primary rounded-md px-3 py-1 text-lg text-white hover:bg-indigo-700"
                >
                  Send Report
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="btn btn-primary rounded-md px-3 py-1 text-lg text-white hover:bg-indigo-700"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(selected.images || []).map((src, idx) => (
                <div key={idx} className="rounded-md border p-2">
                  <img
                    src={src}
                    alt={`log-${selected.id}-${idx}`}
                    className="h-48 w-full object-contain"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-gray-600">Image {idx + 1}</div>
                    <a
                      href={src}
                      download
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

          {/* ReportDialog for sending the selected log */}
          {selected && (
            <SendReport
              open={reportDialogOpen}
              onClose={() => {
                setReportDialogOpen(false);
                setOpen(false);
                setSelected(null);
              }}
              record={selected}
              attachHints={[]}
            />
          )}
    </>
  );
}
