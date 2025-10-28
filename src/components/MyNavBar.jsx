import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* --- helpers ------------------------------------------------------------- */
function getSystemPrefersDark() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function subscribeSystemTheme(cb) {
  if (typeof window === "undefined" || !window.matchMedia) return () => { };
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = (e) => cb(e.matches);
  if (mql.addEventListener) {
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }
  // Safari fallback
  mql.addListener?.(handler);
  return () => mql.removeListener?.(handler);
}

/* --- component ----------------------------------------------------------- */
const MyNavBar = ({ loggedInUser = "", onLogout }) => {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [systemDark, setSystemDark] = useState(getSystemPrefersDark());

  // Track OS theme live
  useEffect(() => subscribeSystemTheme(setSystemDark), []);

  // Effective mode considering "system"
  const effectiveDark = useMemo(
    () => (theme === "system" ? systemDark : theme === "dark"),
    [theme, systemDark]
  );

  // Apply theme ASAP to avoid flicker
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", effectiveDark);
  }, [effectiveDark]);

  // Persist choice
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const cycleTheme = () =>
    setTheme((t) => (t === "system" ? "light" : t === "light" ? "dark" : "system"));

  // ICONS: Moon in dark, Sun in light
  const Icon = effectiveDark ? (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  ) : (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 0l1.79-1.8 1.41 1.41-1.8 1.79-1.4-1.4zM12 4V2h0v2h0zm0 18v-2h0v2h0zM4 12H2v0h2v0zm18 0h-2v0h2v0zM6.76 19.16l-1.42 1.42-1.79-1.8 1.41-1.41 1.8 1.79zm13.69-.38l-1.41 1.41-1.79-1.79 1.41-1.41 1.79 1.79zM12 7a5 5 0 100 10 5 5 0 000-10z" />
    </svg>
  );

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[94%] -translate-x-1/2 md:top-6 md:w-[88%]">
      <div className="mx-auto max-w-7xl">
        {/* Glass bar */}
        <div
          className="
          flex items-center justify-between rounded-full border px-5 py-3 backdrop-blur-2xl shadow-lg
          text-gray-900 bg-white/80 border-gray-200/60
          dark:text-white dark:bg-gray-900/90 dark:border-white/10
        "
        >
          {/* Brand */}
          <a
            href="/"
            className="text-base md:text-lg font-extrabold tracking-tight text-transparent bg-clip-text
                       bg-gradient-to-r from-blue-600 via-fuchsia-600 to-cyan-600
                       dark:from-blue-400 dark:via-fuchsia-400 dark:to-cyan-400"
          >
            AQUA SENTINEL
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {loggedInUser ? (
              <>
                <a
                  href="/detectionstudio"
                  className="rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-900/5 dark:hover:bg-white/10"
                >
                  Detection Studio
                </a>
                <a
                  href="#features"
                  className="rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-900/5 dark:hover:bg-white/10"
                >
                  Features
                </a>
                <a
                  href="#footer-about"
                  className="rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-900/5 dark:hover:bg-white/10"
                >
                  About Us
                </a>
              </>
            ) : (
              <>
                <a
                  href="#features"
                  className="rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-900/5 dark:hover:bg-white/10"
                >
                  Features
                </a>
                <a
                  href="#footer-about"
                  className="rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-900/5 dark:hover:bg-white/10"
                >
                  About Us
                </a>
              </>
            )}

            {!loggedInUser ? (
              <a
                href="/login"
                className="ml-1 rounded-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600
                         px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
              >
                Get Started
              </a>
            ) : (
              <div className="relative ml-2">
                {/* User Button */}
                <button
                  onClick={() => setShowDropdown((v) => !v)}
                  className="flex items-center gap-2 rounded-full bg-gray-900/5 px-3 py-1.5 text-sm font-medium dark:bg-white/10"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-[11px] font-bold text-white">
                    {loggedInUser.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[9rem] truncate">{loggedInUser}</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-white/10 shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onLogout && onLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Theme toggle */}
            {/* <button
              onClick={cycleTheme}
              title={`Theme: ${theme}`}
              aria-label="Toggle theme"
              className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full
                         bg-gray-900/5 hover:bg-gray-900/10
                         dark:bg-white/10 dark:hover:bg-white/20"
            >
              {Icon}
            </button> */}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={cycleTheme}
              aria-label="Toggle theme"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full
                         bg-gray-900/5 hover:bg-gray-900/10
                         dark:bg-white/10 dark:hover:bg-white/20"
            >
              {Icon}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full
                         bg-gray-900/5 hover:bg-gray-900/10
                         dark:bg-white/10 dark:hover:bg-white/20"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 top-[70px] z-40 mx-auto max-w-7xl px-4"
            >
              <div
                className="rounded-2xl border p-4 backdrop-blur-xl shadow-lg
                              text-gray-900 bg-white/90 border-gray-200/70
                              dark:text-white dark:bg-gray-900/95 dark:border-white/10"
              >
                {loggedInUser ? (
                  <>
                    <a
                      href="/detectionstudio"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 hover:bg-gray-900/5 dark:hover:bg-white/10"
                    >
                      Detection Studio
                    </a>
                    <a
                      href="#features"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 hover:bg-gray-900/5 dark:hover:bg-white/10"
                    >
                      Features
                    </a>
                    <a
                      href="#footer-about"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 hover:bg-gray-900/5 dark:hover:bg-white/10"
                    >
                      About Us
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="#features"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 hover:bg-gray-900/5 dark:hover:bg-white/10"
                    >
                      Features
                    </a>
                    <a
                      href="#footer-about"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 hover:bg-gray-900/5 dark:hover:bg-white/10"
                    >
                      About Us
                    </a>
                  </>
                )}


                {loggedInUser && (
                  <button
                    onClick={() => {
                      setOpen(false);
                      onLogout && onLogout();
                    }}
                    className="mt-2 w-full text-left rounded-xl px-4 py-3 text-sm hover:bg-gray-900/5 dark:hover:bg-white/10"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default MyNavBar;
