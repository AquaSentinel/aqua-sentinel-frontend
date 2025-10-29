// Centralized API base URL resolver
// - Uses VITE_BACKEND_URL if provided
// - Falls back to same-origin "/api" when running under HTTPS and env points to http (to avoid mixed content)
// - Trims trailing slashes on base and ensures path has a single leading slash

let RAW_BASE = import.meta.env.VITE_BACKEND_URL || "";

try {
  if (typeof window !== "undefined") {
    const isHttps = window.location.protocol === "https:";
    // If site is HTTPS but base is explicitly HTTP, ignore it to avoid mixed-content
    if (isHttps && typeof RAW_BASE === "string" && RAW_BASE.startsWith("http://")) {
      RAW_BASE = "";
    }
  }
} catch (_) {
  // ignore
}

export const apiUrl = (path) => {
  const base = (RAW_BASE || "").replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  // If base is empty, return same-origin path
  return `${base}${p}`;
};
