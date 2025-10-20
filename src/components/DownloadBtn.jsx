export function DownloadBtn({ disabled, onClick, label = "Download" }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600
                 px-3 py-2 text-white shadow transition hover:opacity-90 disabled:opacity-50 sm:px-4"
      title={label}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M5 20h14v-2H5v2zm7-18l-5 5h3v6h4V7h3l-5-5z" /></svg>
      <span className="ml-2 hidden text-sm font-semibold sm:inline">{label}</span>
    </button>
  );
}