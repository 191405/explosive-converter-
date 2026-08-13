"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Trash2, Download, Zap, X, SlidersHorizontal, Link as LinkIcon, Unlink } from "lucide-react";
import { NeoDropzone } from "@/components/dropzone";

// Placeholder conversion function
async function processImage(file: File, options: any) {
  return new Promise<{ url: string, size: number, newName: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        url: URL.createObjectURL(file),
        size: file.size * 0.8,
        newName: file.name.replace(/\.[^/.]+$/, "") + `.${options.format}`
      });
    }, 1500);
  });
}

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default function ImageConvertPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Record<number, { status: "processing" | "done" | "error"; url?: string; size?: number; newName?: string }>>({});
  
  const [format, setFormat] = useState<"webp" | "jpeg" | "png" | "bmp">("webp");
  const [quality, setQuality] = useState(80);
  const [resizeMode, setResizeMode] = useState<"none" | "scale" | "exact">("none");
  const [scalePercent, setScalePercent] = useState(100);
  const [exactWidth, setExactWidth] = useState<number | "">("");
  const [exactHeight, setExactHeight] = useState<number | "">("");
  const [lockAspect, setLockAspect] = useState(true);
  
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    const newResults = { ...results };
    delete newResults[index];
    setResults(newResults);
  };

  const clearAll = () => {
    setFiles([]);
    setResults({});
  };

  const processAll = async () => {
    const unprocessed = files.map((_, i) => i).filter(i => !results[i] || results[i].status === "error");
    
    // Mark as processing
    const processingState: any = { ...results };
    unprocessed.forEach(i => processingState[i] = { status: "processing" });
    setResults(processingState);

    // Process all (simulated parallel)
    await Promise.all(unprocessed.map(async (i) => {
      try {
        const res = await processImage(files[i], { format, quality, resizeMode, scalePercent, exactWidth, exactHeight });
        setResults(prev => ({ ...prev, [i]: { status: "done", ...res } }));
      } catch (e) {
        setResults(prev => ({ ...prev, [i]: { status: "error" } }));
      }
    }));
  };

  const handleExactChange = (dim: "width" | "height", val: string) => {
    const num = val === "" ? "" : Number(val);
    if (dim === "width") {
      setExactWidth(num);
      if (lockAspect && num !== "") setExactHeight(Math.round(num));
    } else {
      setExactHeight(num);
      if (lockAspect && num !== "") setExactWidth(Math.round(num));
    }
  };

  const isAnyProcessing = Object.values(results).some(r => r.status === "processing");
  const hasResults = Object.keys(results).length === files.length && files.length > 0;

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-glow tracking-tight">Image Convert</h1>
        <p className="text-text-primary/50 font-light text-lg">Instantly convert and resize between PNG, JPG & WEBP with zero uploads.</p>
      </div>

      {/* Main Settings Panel */}
      <div className="w-full max-w-xl glass-panel p-6 flex flex-col gap-6">
        {/* Format Selector */}
        <div>
          <label className="text-xs font-semibold text-text-primary/50 uppercase tracking-widest mb-3 block">Target Format</label>
          <div className="flex bg-text-primary/[0.03] p-1.5 rounded-lg border border-text-primary/[0.05]">
            {["webp", "jpeg", "png", "bmp"].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f as any)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all uppercase tracking-wider ${
                  format === f
                    ? "bg-text-primary text-bg-base shadow-md"
                    : "text-text-primary/40 hover:text-text-primary hover:bg-text-primary/[0.05]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Slider (only for webp/jpeg) */}
        <AnimatePresence>
          {(format === "webp" || format === "jpeg") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-3 overflow-hidden"
            >
              <div className="flex justify-between text-xs font-semibold uppercase tracking-widest">
                <span className="text-text-primary/50">Quality</span>
                <span className="text-text-primary">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-white h-1.5 bg-text-primary/10 rounded-full appearance-none cursor-pointer"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resize Options */}
        <div className="pt-2 border-t border-text-primary/[0.05]">
          <label className="text-xs font-semibold text-text-primary/50 uppercase tracking-widest mb-3 block">Resize Mode</label>
          <div className="flex bg-text-primary/[0.03] p-1.5 rounded-lg border border-text-primary/[0.05] mb-4">
            {[
              { id: "none", label: "Original" },
              { id: "scale", label: "Scale %" },
              { id: "exact", label: "Dimensions" }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setResizeMode(m.id as any)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  resizeMode === m.id
                    ? "bg-text-primary text-bg-base shadow-md"
                    : "text-text-primary/40 hover:text-text-primary hover:bg-text-primary/[0.05]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {resizeMode === "scale" && (
              <motion.div
                key="scale"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-4 bg-text-primary/[0.02] p-3 rounded-lg border border-text-primary/[0.05]"
              >
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={scalePercent}
                  onChange={(e) => setScalePercent(Number(e.target.value))}
                  className="flex-1 accent-white h-1.5 bg-text-primary/10 rounded-full appearance-none cursor-pointer"
                />
                <span className="text-sm font-mono text-text-primary min-w-[3rem] text-right">{scalePercent}%</span>
              </motion.div>
            )}

            {resizeMode === "exact" && (
              <motion.div
                key="exact"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 bg-text-primary/[0.02] p-3 rounded-lg border border-text-primary/[0.05]"
              >
                <div className="flex flex-col flex-1 gap-1">
                  <label className="text-[10px] text-text-primary/40 uppercase tracking-widest">Width</label>
                  <input
                    type="number"
                    value={exactWidth || ""}
                    onChange={(e) => handleExactChange("width", e.target.value)}
                    placeholder="Auto"
                    className="input-base px-3 py-1.5 text-sm font-mono outline-none"
                  />
                </div>
                
                <button
                  onClick={() => setLockAspect(!lockAspect)}
                  className={`mt-4 p-2 rounded-md transition-colors ${lockAspect ? "text-text-primary bg-text-primary/10" : "text-text-primary/30 hover:text-text-primary/60"}`}
                  title={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
                >
                  {lockAspect ? <LinkIcon size={14} /> : <Unlink size={14} />}
                </button>

                <div className="flex flex-col flex-1 gap-1">
                  <label className="text-[10px] text-text-primary/40 uppercase tracking-widest">Height</label>
                  <input
                    type="number"
                    value={exactHeight || ""}
                    onChange={(e) => handleExactChange("height", e.target.value)}
                    placeholder="Auto"
                    className="input-base px-3 py-1.5 text-sm font-mono outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dropzone */}
      <NeoDropzone
        onDropAccepted={handleDrop}
        accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif", ".tiff", ".svg"] }}
        multiple={true}
        label="Drop images to convert"
        sublabel={`Will convert to ${format.toUpperCase()}`}
        icon={<ImageIcon size={40} strokeWidth={1.5} />}
      />

      {/* File List & Results */}
      {files.length > 0 && (
        <div className="w-full max-w-2xl glass-panel p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-text-primary/[0.05] pb-4">
            <h3 className="font-semibold text-lg tracking-tight">
              {files.length} Image{files.length !== 1 ? "s" : ""}
            </h3>
            <button onClick={clearAll} className="text-xs text-text-primary/40 hover:text-text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-text-primary/[0.05]">
              <Trash2 size={14} /> Clear all
            </button>
          </div>

          <motion.div layout className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2">
            <AnimatePresence>
              {files.map((file, index) => {
                const res = results[index];
                const isProcessing = res?.status === "processing";
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.98, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -10 }}
                    key={`${file.name}-${index}`}
                    className="bg-text-primary/[0.02] border border-text-primary/[0.04] p-3 rounded-lg hover:bg-text-primary/[0.04] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="p-2 rounded bg-text-primary/[0.05] text-text-primary/70 shrink-0">
                          <ImageIcon size={16} />
                        </div>
                        <div className="min-w-0 pr-4">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-[11px] text-text-primary/40 font-mono mt-0.5">{formatBytes(file.size)}</p>
                        </div>
                      </div>
                      
                      {res?.status === "done" && res.url ? (
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right hidden sm:block">
                            <span className="text-xs font-semibold text-[#34d399] uppercase tracking-wider block">Done</span>
                            <span className="text-[10px] text-text-primary/40 font-mono">{formatBytes(res.size || 0)}</span>
                          </div>
                          <a href={res.url} download={res.newName}>
                            <button className="btn-primary px-3 py-1.5 text-xs bg-text-primary text-bg-base flex items-center gap-1.5">
                              <Download size={14} /> Save
                            </button>
                          </a>
                        </div>
                      ) : isProcessing ? (
                        <div className="flex items-center gap-2 text-text-primary/50 text-xs font-semibold uppercase tracking-widest shrink-0">
                          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                          Processing
                        </div>
                      ) : (
                        <button
                          onClick={() => removeFile(index)}
                          className="text-text-primary/30 hover:text-text-primary p-1.5 rounded-md hover:bg-text-primary/10 transition-colors shrink-0"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Action bar */}
          {!hasResults && (
            <div className="pt-4 mt-2 border-t border-text-primary/[0.05]">
              <button
                onClick={processAll}
                disabled={isAnyProcessing}
                className="btn-primary px-8 py-3 w-full sm:w-auto flex items-center justify-center gap-2 text-sm mx-auto"
              >
                {isAnyProcessing ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    Converting...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Convert {files.length} Image{files.length !== 1 ? "s" : ""}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
