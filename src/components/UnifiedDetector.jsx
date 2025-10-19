import React, { useRef, useState } from "react";

// --- config ---
const ENDPOINTS = { combined: null, ship: null, debris: null }; // wire your real endpoints here
const ACCEPT = "image/png,image/jpeg,image/webp";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Small, responsive download button (icon-only on XS)
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

export function ImageCard({ title, src, placeholder, onDownload }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-white/10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</div>
        <DownloadBtn disabled={!src} onClick={onDownload} />
      </div>
      <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {src ? (
          <img src={src} alt={title} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-gray-500 dark:text-gray-400">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnifiedDetector({ onArtifactsChange = () => {} }) {
  const inputRef = useRef(null);

  // originals
  const [shipFile, setShipFile] = useState(null);
  const [debrisFile, setDebrisFile] = useState(null);
  const [shipOrigUrl, setShipOrigUrl] = useState("");
  const [debrisOrigUrl, setDebrisOrigUrl] = useState("");

  // results (keep blobs for zipping)
  const [shipResultBlob, setShipResultBlob] = useState(null);
  const [debrisResultBlob, setDebrisResultBlob] = useState(null);
  const [shipResultUrl, setShipResultUrl] = useState("");
  const [debrisResultUrl, setDebrisResultUrl] = useState("");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [step, setStep] = useState(0);

  const notify = (extra = {}) =>
    onArtifactsChange({
      shipOriginal: shipFile,
      debrisOriginal: debrisFile,
      shipResult: shipResultBlob,
      debrisResult: debrisResultBlob,
      shipOrigUrl,
      debrisOrigUrl,
      shipResultUrl,
      debrisResultUrl,
      ...extra,
    });

  const assignFiles = (filesList) => {
    const files = Array.from(filesList || []).filter((f) => f.type.startsWith("image/")).slice(0, 2);
    if (!files.length) return;
    const first = files[0];
    setShipFile(first);
    setShipOrigUrl(URL.createObjectURL(first));
    const second = files[1];
    if (second) {
      setDebrisFile(second);
      setDebrisOrigUrl(URL.createObjectURL(second));
    } else {
      setDebrisFile(null);
      setDebrisOrigUrl("");
    }
    // reset results
    setShipResultBlob(null); setDebrisResultBlob(null);
    setShipResultUrl("");    setDebrisResultUrl("");
    setStep(0); setErr("");
    notify({ shipOriginal: first, debrisOriginal: second || null, shipResult: null, debrisResult: null });
  };

  const onDrop = (e) => { e.preventDefault(); assignFiles(e.dataTransfer?.files); };
  const onDragOver = (e) => e.preventDefault();
  const onChange = (e) => assignFiles(e.target.files);

  const run = async () => {
    if (!shipFile || !debrisFile) { setErr("Please provide two images: first for Ship, second for Marine Debris."); return; }
    setBusy(true); setErr("");
    try {
      setStep(1); await sleep(200);
      if (ENDPOINTS.combined) {
        setStep(2);
        const fd = new FormData();
        fd.append("ship", shipFile);
        fd.append("marine_debris", debrisFile);
        const res = await fetch(ENDPOINTS.combined, { method: "POST", body: fd });
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        // DEMO: echo originals; replace with parsing your response to two blobs
        await sleep(600);
        const shipBlob = shipFile;
        const debrisBlob = debrisFile;
        setShipResultBlob(shipBlob);
        setDebrisResultBlob(debrisBlob);
        setShipResultUrl(URL.createObjectURL(shipBlob));
        setDebrisResultUrl(URL.createObjectURL(debrisBlob));
      } else {
        // Ship
        setStep(2);
        if (ENDPOINTS.ship) {
          const fdS = new FormData(); fdS.append("ship", shipFile);
          const rS = await fetch(ENDPOINTS.ship, { method: "POST", body: fdS });
          if (!rS.ok) throw new Error(`Ship endpoint ${rS.status}`);
          const bS = await rS.blob();
          setShipResultBlob(bS); setShipResultUrl(URL.createObjectURL(bS));
        } else { await sleep(600); setShipResultBlob(shipFile); setShipResultUrl(URL.createObjectURL(shipFile)); }

        // Debris
        setStep(3);
        if (ENDPOINTS.debris) {
          const fdD = new FormData(); fdD.append("marine_debris", debrisFile);
          const rD = await fetch(ENDPOINTS.debris, { method: "POST", body: fdD });
          if (!rD.ok) throw new Error(`Debris endpoint ${rD.status}`);
          const bD = await rD.blob();
          setDebrisResultBlob(bD); setDebrisResultUrl(URL.createObjectURL(bD));
        } else { await sleep(600); setDebrisResultBlob(debrisFile); setDebrisResultUrl(URL.createObjectURL(debrisFile)); }
      }
      setStep(4);
      notify();
    } catch (e) {
      setErr(e.message || "Something went wrong."); setStep(0);
    } finally { setBusy(false); }
  };

  const reset = () => {
    setShipFile(null); setDebrisFile(null);
    setShipOrigUrl(""); setDebrisOrigUrl("");
    setShipResultBlob(null); setDebrisResultBlob(null);
    setShipResultUrl(""); setDebrisResultUrl("");
    setErr(""); setStep(0);
    notify({ shipOriginal: null, debrisOriginal: null, shipResult: null, debrisResult: null });
    if (inputRef.current) inputRef.current.value = "";
  };

  const download = (src, name) => {
    if (!src) return;
    const a = document.createElement("a");
    a.href = src; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white/80 p-5 sm:p-6 md:p-8 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-white/[0.06]">
      <div className="mb-6">
        <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent text-2xl font-bold">
        Unified Detector — Two Inputs
        </span>
      
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          Drop/select <b>two images</b>: <b>first → Ship</b>, <b>second → Marine Debris</b>. Click <b>Run Detection</b>.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Left: dropzone + steps + actions */}
        <div>
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className={`flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition
                        ${err ? "border-red-400 dark:border-red-600" : "border-gray-300 dark:border-white/15"}
                        ${busy ? "opacity-70" : ""}
                        bg-white/80 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10`}
          >
            <div className="text-gray-900 dark:text-gray-100">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M19 13v6H5v-6H3v6a2 2 0 002 2h14a2 2 0 002-2v-6h-2zM11 6.414L8.707 8.707l-1.414-1.414L12 2.586l4.707 4.707-1.414 1.414L13 6.414V16h-2z"/></svg>
              </div>
              <p className="text-sm">
                Drag & drop <b>two images</b> here, or{" "}
                <button onClick={() => inputRef.current?.click()} className="font-semibold underline underline-offset-2 hover:opacity-80">
                  browse
                </button>
              </p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">PNG, JPG, WebP • Max ~25MB each</p>
              <input ref={inputRef} type="file" accept={ACCEPT} multiple className="hidden" onChange={onChange} />
            </div>
          </div>

          {/* Steps + actions */}
          <ol className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700 dark:text-gray-300 md:grid-cols-4">
            <li className={`flex items-center gap-2`}><span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900/10 text-xs font-bold dark:bg-white/10">1</span>Ready</li>
            <li className={`flex items-center gap-2 ${step < 1 ? "opacity-60" : ""}`}><span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900/10 text-xs font-bold dark:bg-white/10">2</span>Uploading</li>
            <li className={`flex items-center gap-2 ${step < 2 ? "opacity-60" : ""}`}><span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900/10 text-xs font-bold dark:bg-white/10">3</span>Ship</li>
            <li className={`flex items-center gap-2 ${step < 3 ? "opacity-60" : ""}`}><span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900/10 text-xs font-bold dark:bg-white/10">4</span>Debris</li>
          </ol>

          <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10">
            <div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 transition-all"
                 style={{ width: `${[0, 25, 60, 85, 100][Math.min(step, 4)]}%` }} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={run}
              disabled={!shipFile || !debrisFile || busy}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow ring-1 ring-indigo-500/30 transition hover:bg-indigo-700 disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {busy ? "Processing…" : "Run Detection"}
            </button>
            <button
              onClick={() => {
                setShipFile(null); setDebrisFile(null);
                setShipOrigUrl(""); setDebrisOrigUrl("");
                setShipResultBlob(null); setDebrisResultBlob(null);
                setShipResultUrl(""); setDebrisResultUrl("");
                setErr(""); setStep(0); notify({ shipOriginal: null, debrisOriginal: null, shipResult: null, debrisResult: null });
                if (inputRef.current) inputRef.current.value = "";
              }}
              disabled={busy || (!shipFile && !debrisFile && !shipResultUrl && !debrisResultUrl)}
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:opacity-60 dark:bg-white/10 dark:text-white dark:ring-white/10 dark:hover:bg-white/15"
            >
              Reset
            </button>
          </div>

          {err && (
            <div className="mt-4 rounded-xl border border-red-300/70 bg-red-50/80 p-3 text-sm text-red-800 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
              {err}
            </div>
          )}
        </div>

        {/* Right: 2×2 grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ImageCard title="Ship - Original"         src={shipOrigUrl}           placeholder="First image will appear here." onDownload={() => download(shipOrigUrl, "ship-original.png")} />
          <ImageCard title="Ship - Result"           src={shipResultUrl}         placeholder="Awaiting run"               onDownload={() => download(shipResultUrl, "ship-result.png")} />
          <ImageCard title="Marine Debris - Original"src={debrisOrigUrl}         placeholder="Second image will appear here." onDownload={() => download(debrisOrigUrl, "debris-original.png")} />
          <ImageCard title="Marine Debris - Result"  src={debrisResultUrl}       placeholder="Awaiting run"               onDownload={() => download(debrisResultUrl, "debris-result.png")} />
        </div>
      </div>
    </div>
  );
}
