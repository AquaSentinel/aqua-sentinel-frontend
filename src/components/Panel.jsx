import {Step,ImageLightbox } from "../utils/utils.jsx"; 
import React, { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
const Panel = ({ title, endpoint, reportType, onImagesChange }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultFile, setResultFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [lightbox, setLightbox] = useState({ open: false, src: "", caption: "" });

  const steps = useMemo(() => ["Ready", "Uploading", "Processing", "Done"], []);

  const reset = useCallback(() => {
    setFile(null);
    setPreview("");
    setResultUrl("");
    setResultFile(null);
    setError("");
    setBusy(false);
    setStep(0);
    onImagesChange?.({ originalFile: null, originalUrl: "", resultFile: null, resultUrl: "" });
    if (inputRef.current) inputRef.current.value = "";
  }, [onImagesChange]);

  const onSelect = useCallback(
    (f) => {
      if (!f) return;
      if (!/^image\//.test(f.type)) {
        setError("Please upload an image file (PNG/JPG/WebP).");
        return;
      }
      setError("");
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
      onImagesChange?.({ originalFile: f, originalUrl: url, resultFile, resultUrl });
    },
    [onImagesChange, resultFile, resultUrl]
  );

  const onFileChange = (e) => onSelect(e.target.files?.[0]);
  const onDrop = (e) => {
    e.preventDefault();
    onSelect(e.dataTransfer?.files?.[0]);
  };
  const onDragOver = (e) => e.preventDefault();

  const fakeProcess = async (imageFile) =>
    new Promise((resolve) => setTimeout(() => resolve(URL.createObjectURL(imageFile)), 600));

  const postImageForResult = async (url, imageFile) => {
    if (!url) return fakeProcess(imageFile);
    const fd = new FormData();
    fd.append("image", imageFile);
    const res = await fetch(url, { method: "POST", body: fd });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  const blobUrlToFile = async (blobUrl, suggestedName = "result.png") => {
    const res = await fetch(blobUrl);
    const blob = await res.blob();
    const ext =
      blob.type?.includes("png") ? "png" :
      blob.type?.includes("webp") ? "webp" :
      blob.type?.includes("jpeg") || blob.type?.includes("jpg") ? "jpg" : "png";
    return new File([blob], suggestedName.replace(/\.(png|jpe?g|webp)$/i, `.${ext}`), {
      type: blob.type || "image/png",
    });
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    setStep(1);
    try {
      await new Promise((r) => setTimeout(r, 150));
      setStep(2);
      const outUrl = await postImageForResult(endpoint, file);
      setResultUrl(outUrl);
      const outFile = await blobUrlToFile(outUrl, `${title.toLowerCase().replace(/\s+/g, "-")}-result.png`);
      setResultFile(outFile);
      setStep(3);
      onImagesChange?.({ originalFile: file, originalUrl: preview, resultFile: outFile, resultUrl: outUrl });
    } catch (e) {
      setError(e.message || "Something went wrong.");
      setStep(0);
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    const url = resultUrl || preview;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-result.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const openLightbox = (src, caption) => setLightbox({ open: true, src, caption });

  return (
    <div className="overflow-hidden rounded-3xl border p-4 sm:p-5 backdrop-blur-xl shadow-xl bg-white/80 border-gray-200/70 dark:bg-white/[0.06] dark:border-white/10">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-5/12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            Upload a satellite/ocean image. This panel runs the <b>{reportType}</b> model.
          </p>

          {/* Dropzone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className={`mt-4 rounded-2xl border-2 border-dashed p-4 sm:p-5 text-center transition
                       bg-white/85 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10
                       ${error ? "border-red-400 dark:border-red-600" : "border-gray-300 dark:border-white/15"}`}
          >
            <div className="mx-auto mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-700 dark:text-indigo-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13v6H5v-6H3v6a2 2 0 002 2h14a2 2 0 002-2v-6h-2zM11 6.414L8.707 8.707l-1.414-1.414L12 2.586l4.707 4.707-1.414 1.414L13 6.414V16h-2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              Drag & drop your image here, or{" "}
              <button
                onClick={() => inputRef.current?.click()}
                className="font-semibold text-indigo-700 underline underline-offset-2 dark:text-indigo-300"
              >
                browse
              </button>
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">PNG, JPG, WebP • Max ~25MB</p>
            <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          </div>

          {error && (
            <div className="mt-3 rounded-xl border border-red-300/70 bg-red-50/80 p-3 text-sm text-red-800 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Steps */}
          <div className="mt-5 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              {steps.map((label, i) => (
                <Step key={label} n={i + 1} label={label} active={i === step} done={i < step && step !== 0} />
              ))}
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200/70 dark:bg-white/10">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.round((step / (steps.length - 1)) * 100))}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={run}
              disabled={!file || busy}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow ring-1 ring-indigo-500/30 transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {busy ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Processing…
                </>
              ) : (
                "Run Detection"
              )}
            </button>
            <button
              onClick={reset}
              disabled={busy || (!file && !resultUrl)}
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:opacity-60 dark:bg-white/10 dark:text-gray-100 dark:ring-white/10 dark:hover:bg-white/15"
            >
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-7/12">
          <div className="grid gap-5 sm:gap-5 grid-cols-1 md:grid-cols-2">
            {/* Original */}
            <div className="overflow-hidden rounded-2xl border p-3 sm:p-4 backdrop-blur-xl shadow-lg bg-white/80 border-gray-200/70 dark:bg-white/[0.06] dark:border-white/10">
              <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Original</div>
              <button
                type="button"
                onClick={() => preview && openLightbox(preview, `${title} • Original`)}
                className="block w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
                title={preview ? "Click to view" : ""}
              >
                {preview ? (
                  <img src={preview} alt="Original preview" className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                    No image selected
                  </div>
                )}
              </button>
            </div>

            {/* Result */}
            <div className="overflow-hidden rounded-2xl border p-3 sm:p-4 backdrop-blur-xl shadow-lg bg-white/80 border-gray-200/70 dark:bg-white/[0.06] dark:border-white/10">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Result</div>
                <button
                  onClick={download}
                  disabled={!resultUrl && !preview}
                  className="rounded-full px-4 py-2 text-xs font-semibold transition disabled:opacity-50
                             bg-gray-900 text-white hover:bg-black/85
                             dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
                >
                  Download
                </button>
              </div>
              <button
                type="button"
                onClick={() => (resultUrl || preview) && openLightbox(resultUrl || preview, `${title} • Result`)}
                className="block w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
                title={resultUrl || preview ? "Click to view" : ""}
              >
                {resultUrl || preview ? (
                  <img src={resultUrl || preview} alt="Result" className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                    {step >= 2 ? "Processing…" : "Awaiting run"}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ImageLightbox
        open={lightbox.open}
        src={lightbox.src}
        caption={lightbox.caption}
        onClose={() => setLightbox((s) => ({ ...s, open: false }))}
      />
    </div>
  );
};
export default Panel;