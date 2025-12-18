import { useEffect, useState } from "react";
import MyNavBar from "../components/MyNavBar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useThemeManager } from "../context/ThemeManager";
// OPTIONAL: import your assets (replace with your files)
// import logo from "../assets/aqua-logo.svg";              // <-- put your logo svg/png here
import demoPoster from "../assets/images/debrisdetect.png"; // <-- poster image for the video
import aqua from "../assets/images/aqua.png"; // <-- Aqua Sentinel logo
import demoVideo from "../assets/videos/demo.mp4"; // <-- short muted demo video
import { apiUrl } from "../lib/api";

export default function HomePage() {

  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState("");
  const { isDark, theme, toggle } = useThemeManager();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("loggedInUser");
    setLoggedInUser(name || "");
    
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(apiUrl("/api/logout"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const result = await response.json();
      if (result.success) {
        localStorage.clear(); // clear all
        setLoggedInUser("");  // update UI state
        navigate("/login", { replace: true }); // immediate navigation
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-50 via-white to-white dark:from-[#0b0e13] dark:via-[#0b0e13] dark:to-[#0b0e13]">
      {/* top nav */}
      <MyNavBar loggedInUser={loggedInUser} onLogout={handleLogout} />

      {/* HERO */}
      <header className="relative mx-auto max-w-7xl px-6 pt-28 md:pt-32">
        {/* soft gradient under hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-20 mx-auto h-72 max-w-5xl rounded-[40px] bg-gradient-to-r from-indigo-500/15 via-fuchsia-500/15 to-cyan-500/15 blur-3xl"
        />
        <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
          {/* LEFT: brand + pitch */}
          <div>
            <div className="mb-4 inline-flex items-center gap-3">
              {aqua ? (
                <img
                  src={aqua}
                  alt="Aqua Sentinel logo"
                  className="h-30 w-auto"
                />
              ) : (
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600" />
              )}
              <span className="text-xl font-semibold tracking-wide text-gray-700 dark:text-gray-300">
                AQUA SENTINEL
              </span>
            </div>
            {/* mt-4 text-lg text-zinc-400 */}
            <motion.h1
              className={`text-4xl md:text-6xl font-extrabold tracking-tight transition-colors duration-300
        ${isDark ? "text-gray-200" : "text-gray-800"}
      `}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Beautiful, Practical Ocean Intelligence
              <span className="block bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                For Modern Monitoring Apps
              </span>
            </motion.h1>

            <motion.p
              className="mt-5 max-w-xl text-base leading-relaxed text-gray-700 dark:text-gray-300 md:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              Aqua Sentinel is unified for <b>Ship Detection</b> and{" "}
              <b>Marine Debris Detection</b>. Upload once — we run both models
              automatically and return polished result images ready to review or
              download.
            </motion.p>

            <motion.div
              className="mt-7 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <a
                href="#demo"
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Watch Demo
              </a>
              <a
                href="#features"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:ring-white/10 dark:hover:bg-white/15"
              >
                Explore Features
              </a>
            </motion.div>

            {loggedInUser && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Signed in as <span className="font-medium">{loggedInUser}</span>
              </p>
            )}
          </div>

          {/* RIGHT: demo pane (video in a glass card) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gray-900/70 p-4 backdrop-blur-xl shadow-lg text-white">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-200">
                Seamless Two-Step Inference
              </div>
              <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-800">
                <iframe
                  id="demo"
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/wN-0MyZbO3A?autoplay=1&mute=1&loop=1&playlist=wN-0MyZbO3A"
                  title="Aqua Sentinel Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {["1️⃣ Upload", "2️⃣ Ship Detect", "3️⃣ Debris Detect"].map(
                  (step) => (
                    <div
                      key={step}
                      className="flex items-center justify-center rounded-xl bg-white/10 px-3 py-2 text-center text-xs font-medium text-gray-100 ring-1 ring-white/10"
                    >
                      {step}
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="mx-auto mt-16 max-w-7xl px-6">
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          Why Choose Aqua Sentinel?
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-700 dark:text-gray-300 md:text-base">
          Designed for speed, clarity, and reliability — from research to
          production.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            // {
            //   title: "Lightning Fast",
            //   desc: "Optimized pipeline and minimal overhead. Your results render quickly.",
            //   icon: "⚡",
            // },
            {
              title: "24/7 Detection with SAR Technology",
              desc: "Utilizes Synthetic Aperture Radar (SAR) to detect ships through clouds, fog, and darkness.",
              icon: "⚡",
            },
            // {
            //   title: "Unified Workflow",
            //   desc: "One upload triggers both models in sequence. No juggling steps.",
            //   icon: "🧩",
            // },
            {
              title: "Optical Debris Detection",
              desc: "Employs AI models on optical satellite imagery to identify floating marine debris like plastic concentrations and oil slicks.",
              icon: "🧩",
            },
            {
              title: "Enhanced Law Enforcement",
              desc: "Empowers environmental agencies with concrete data for more effective investigations and penalties.",
              icon: "♿",
            },
            {
              title: "Dark-Mode Smart",
              desc: "Follows your OS, plus quick toggle for System / Light / Dark.",
              icon: "🌗",
            },
            {
              title: "Download Ready",
              desc: "Outputs are image files you can preview and download instantly.",
              icon: "⬇️",
            },
            {
              title: "Clean API Hooks",
              desc: "Simple endpoints for ship and debris detection — easy to extend.",
              icon: "🔌",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-200/70 bg-white/70 p-5 backdrop-blur-xl shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/[0.06]"
            >
              <div className="mb-2 text-2xl">{f.icon}</div>
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                {f.title}
              </div>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mx-auto my-16 max-w-7xl px-6">
        <div className="overflow-hidden rounded-3xl border border-indigo-200/40 bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-6 shadow-lg md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 text-white md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-semibold md:text-3xl">
                Ready to try Aqua Sentinel?
              </h3>
              <p className="mt-2 max-w-prose text-white/90">
                Start with the unified demo and see detection results in
                seconds.
              </p>
            </div>
            <a
              href="/login"
              className="rounded-xl bg-white/90 px-5 py-3 text-sm font-semibold text-gray-900 ring-1 ring-white/40 transition hover:bg-white"
            >
              Get Started →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
