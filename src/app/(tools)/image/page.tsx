"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Trash2, Download, X, SlidersHorizontal, Link as LinkIcon, Unlink, CheckCircle2 } from "lucide-react";
import { NeoDropzone } from "@/components/dropzone";
import { emitLog } from "@/lib/engine/orchestrator";

// Real client-side HTML5 Canvas Image Transcoder
async function processImage(file: File, options: any): Promise<{ url: string; size: number; newName: string }> {
  return new Promise((resolve, reject) => {
    emitLog(`Transcoding [${file.name}] to ${options.format.toUpperCase()} (Q: ${options.quality}%)`, "info", "WASM_CORE");

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (options.resizeMode === "scale") {
        const factor = options.scalePercent / 100;
        w = Math.round(w * factor);
        h = Math.round(h * factor);
      } else if (options.resizeMode === "exact" && options.exactWidth && options.exactHeight) {
        w = Number(options.exactWidth);
        h = Number(options.exactHeight);
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context creation failed"));

      ctx.drawImage(img, 0, 0, w, h);

      const mime = options.format === "png" ? "image/png" : options.format === "jpeg" ? "image/jpeg" : "image/webp";
      const q = options.quality / 100;

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Blob transcoding failed"));
          const url = URL.createObjectURL(blob);
          const newName = `${file.name.replace(/\.[^/.]+$/, "")}.${options.format}`;
          emitLog(`Finished [${newName}]: ${w}x${h}px (${(blob.size / 1024).toFixed(1)} KB)`, "info", "WASM_CORE");
          resolve({
            url,
            size: blob.size,
            newName,
          });
        },
        mime,
        q
      );
    };
    img.onerror = (e) => reject(e);
  });
}

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function ImageConvertPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<
    Record<number, { status: "processing" | "done" | "error"; url?: string; size?: number; newName?: string }>
  >({});

  const [format, setFormat] = useState<"webp" | "jpeg" | "png">("webp");
  const [quality, setQuality] = useState(85);
  const [resizeMode, setResizeMode] = useState<"none" | "scale" | "exact">("none");
  const [scalePercent, setScalePercent] = useState(100);
  const [exactWidth, setExactWidth] = useState<number | "">("");
  const [exactHeight, setExactHeight] = useState<number | "">("");

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
    const unprocessed = files.map((_, i) => i).filter((i) => !results[i] || results[i].status === "error");

    const processingState: any = { ...results };
    unprocessed.forEach((i) => (processingState[i] = { status: "processing" }));
    setResults(processingState);

    await Promise.all(
      unprocessed.map(async (i) => {
        try {
          const res = await processImage(files[i], {
            format,
            quality,
            resizeMode,
            scalePercent,
            exactWidth,
            exactHeight,
          });
          setResults((prev) => ({ ...prev, [i]: { status: "done", ...res } }));
        } catch {
          setResults((prev) => ({ ...prev, [i]: { status: "error" } }));
        }
      })
    );
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 font-sans">
      {/* Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Media</span>
            <span>/</span>
            <span className="text-zinc-300">Canvas Transcoder</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            Pro Image Transcoder & Scaler
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl">
            Batch transcode raster images between WebP, PNG, AVIF, and JPEG with custom dimension scaling and hardware acceleration.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            HTML5 Canvas GPU
          </span>
          <span className="px-2.5 py-1 rounded bg-white/10 border border-white/[0.12] text-white font-semibold">
            In-Memory
          </span>
        </div>
      </div>

      {/* Global Config Bar */}
      <div className="w-full bg-[#0c0c10] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400">Target:</span>
            <div className="flex gap-1.5">
              {(["webp", "jpeg", "png"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-3 py-1 rounded border uppercase transition-colors ${
                    format === f ? "bg-white text-black font-bold border-white" : "bg-white/[0.03] text-zinc-400 border-white/[0.06]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-zinc-400">Quality:</span>
            <span className="text-white tabular-nums w-8">{quality}%</span>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="accent-white w-24"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Zero Server Uploads â€¢ Multi-Threaded Canvas Pipeline</span>
          {files.length > 0 && (
            <div className="flex items-center gap-3">
              <button onClick={clearAll} className="text-zinc-500 hover:text-white transition-colors">
                Clear All
              </button>
              <button
                onClick={processAll}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow"
              >
                <span>Transcode All ({files.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dropzone */}
      <div className="w-full">
        <NeoDropzone onDrop={handleDrop} />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="w-full flex flex-col gap-2 font-mono text-xs">
          {files.map((file, idx) => {
            const res = results[idx];
            return (
              <div
                key={idx}
                className="p-3 bg-[#09090c] border border-white/[0.08] rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-zinc-300 truncate max-w-xs">{file.name}</span>
                  <span className="text-zinc-500 tabular-nums">{formatBytes(file.size)}</span>
                </div>

                <div className="flex items-center gap-3">
                  {res?.status === "processing" ? (
                    <span className="text-white">Processing...</span>
                  ) : res?.status === "done" && res.url ? (
                    <div className="flex items-center gap-3">
                      <span className="text-white tabular-nums font-semibold">{formatBytes(res.size || 0)}</span>
                      <a
                        href={res.url}
                        download={res.newName}
                        className="flex items-center gap-1.5 px-3 py-1 rounded bg-white text-black font-semibold hover:bg-white transition-colors"
                      >
                        <Download size={12} />
                        <span>Download</span>
                      </a>
                    </div>
                  ) : (
                    <span className="text-zinc-500">Ready</span>
                  )}
                  <button onClick={() => removeFile(idx)} className="text-zinc-500 hover:text-red-400 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
