import {toast} from 'react-toastify';
import { FiDownload } from "react-icons/fi"; // make sure to install: npm install react-icons
export const handleSucess = (msg)=>{
    toast.success(msg,{
        position : 'top-right'
    })
}

export const handleError = (msg)=>{
    toast.error(msg,{
        position : 'top-right'
    })
}

/* ---------- UI atoms ---------- */
export const Step = ({ n, label, active, done }) => (
  <div className="flex items-center gap-2">
    <div
      className={[
        "h-7 w-7 flex items-center justify-center rounded-full text-xs font-semibold",
        done
          ? "bg-indigo-600 text-white"
          : active
          ? "bg-indigo-600/15 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30"
          : "bg-gray-900/5 text-gray-700 ring-1 ring-gray-200 dark:bg-white/10 dark:text-gray-300 dark:ring-white/10",
      ].join(" ")}
    >
      {done ? "✓" : n}
    </div>
    <span
      className={
        active || done
          ? "text-gray-900 dark:text-gray-100 text-sm"
          : "text-gray-600 dark:text-gray-300 text-sm"
      }
    >
      {label}
    </span>
  </div>
);

export const ImageLightbox = ({ open, src, alt, onClose, caption }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative max-w-5xl w-full">
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-900 shadow hover:bg-white"
          >
            ✕ Close
          </button>
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
            <div className="p-3 text-xs text-gray-700 dark:text-gray-300">{caption}</div>
            <img
              src={src}
              alt={alt || "Preview"}
              className="w-full h-[70vh] object-contain bg-gray-50 dark:bg-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export function DownloadBtn({ disabled, onClick, label = "Download" }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-full 
                 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600
                 px-3 py-2 text-white shadow-md transition 
                 hover:opacity-90 disabled:opacity-50 sm:px-4 sm:py-2"
      title={label}
    >
      {/* Download icon (visible always) */}
      <FiDownload className="h-4 w-4" />

      {/* Text label — hidden on small screens, visible on md+ */}
      <span className="ml-2 hidden text-sm font-semibold sm:inline">{label}</span>
    </button>
  );
}

export function ImageCard({ title, src, placeholder, onDownload }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border
                 border-gray-200/70 bg-white/80 p-4 backdrop-blur
                 dark:border-white/10 dark:bg-white/10"
    >
      {/* Title and Download button row */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {title}
        </div>
        <DownloadBtn disabled={!src} onClick={onDownload} />
      </div>

      {/* Image or placeholder */}
      <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {src ? (
          <img
            src={src}
            alt={title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-gray-500 dark:text-gray-400">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}