import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import MyNavBar from "../components/MyNavBar";
import Footer from "../components/Footer";
import DualDetector from "../components/DualDetector";
import { motion } from "framer-motion";

export default function DetectionStudio() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [emailId, setEmail] = useState("");

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser") || "");
    setEmail(localStorage.getItem("emailId") || "");
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-white via-white to-gray-50 dark:from-[#0b0e13] dark:via-[#0b0e13] dark:to-[#0b0e13]">
      <MyNavBar loggedInUser={loggedInUser} />

      {/* Page header (no hero card; fully scrollable) */}
      <header className="mx-auto max-w-7xl px-5 pt-24 md:pt-28">
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            Aqua Sentinel —{" "}
            Detection Studio
          </span>
        </motion.h1>
        <p className="mt-3 max-w-3xl text-sm md:text-base text-gray-700 dark:text-gray-300">
          Upload separately for <b>Ship Detection</b> and for <b>Marine Debris Detection</b>. Each model runs
          its own pipeline and provides a downloadable result image.
        </p>
        {emailId && (
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">Signed in as <span className="font-medium">{emailId}</span></p>
        )}
      </header>

      {/* Two independent pipelines */}
      <main className="mx-auto max-w-7xl px-5 py-10">
        <DualDetector />
      </main>

      <ToastContainer />
      <Footer />
    </div>
  );
}