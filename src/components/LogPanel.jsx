import React, { useMemo, useState } from "react";
import useLogs from "../hooks/useLogs";
import { auth } from "../firebase";
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
          <h3 className="text-lg font-semibold">Detection Logs</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300"
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
            <div className="text-sm text-gray-600">No logs yet.</div>
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
                  onClick={() => openItem(it)}
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
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 00.293.707l2 2a1 1 0 101.414-1.414L11 9.586V7z"
                          clipRule="evenodd"
                        />
                      </svg>
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
                  onClick={() => setSelected(null)}
                  className="rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200"
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
                      className="text-xs text-indigo-600 hover:underline"
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
    </>
  );
}
