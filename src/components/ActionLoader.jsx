import React from "react";

// Small animated loader with success tick. Designed to work in light/dark modes
// Uses Tailwind-friendly classes and inline SVG so colors follow current text color.
const ActionLoader = ({ status = "loading", size = 56, label = null, showLabel = true }) => {
  const px = `${size}px`;
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {status === "loading" && (
        <div
          className="flex items-center justify-center rounded-full bg-white/80 dark:bg-black/60"
          style={{ width: px, height: px }}
        >
          <svg
            className="-ml-1 h-8 w-8 animate-spin text-indigo-600 dark:text-cyan-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      )}

      {status === "success" && (
        <div
          className="flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40"
          style={{ width: px, height: px }}
        >
          <svg
            className="h-10 w-10 text-green-600 dark:text-green-300"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
            <path
              d="M7 13l3 3 7-7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {status === "cancelled" && (
        <div
          className="flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/40"
          style={{ width: px, height: px }}
        >
          <svg
            className="h-10 w-10 text-yellow-600 dark:text-yellow-300"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
            <path
              d="M15 9l-6 6M9 9l6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {showLabel && (
        <div className="text-center">
          {label ? (
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</div>
          ) : (
            <>
              {status === "loading" && <div className="text-sm text-gray-700 dark:text-gray-200">Sending report…</div>}
              {status === "success" && <div className="text-sm font-medium text-gray-700 dark:text-gray-200">Sent</div>}
              {status === "cancelled" && <div className="text-sm font-medium text-gray-700 dark:text-gray-200">Cancelled</div>}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionLoader;
