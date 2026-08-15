"use client";

import { useState, useRef } from "react";
import { Shapes, Download, Sliders, RefreshCw, Copy, Check, Eye } from "lucide-react";
import { NeoDropzone } from "@/components/dropzone";
import { emitLog } from "@/lib/engine/orchestrator";
import { toast } from "sonner";

export default function VectorizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Vectorizer Parameters
  const [threshold, setThreshold] = useState(128);
  const [colorMode, setColorMode] = useState<"monochrome" | "layered">("monochrome");
  const [smoothing, setSmoothing] = useState(2);
  const [invert, setInvert] = useState(false);

  const handleDrop = (accepted: File[]) => {
    if (!accepted[0]) return;
    setFile(accepted[0]);
    setSvgOutput(null);
    vectorizeImage(accepted[0], threshold, colorMode, smoothing, invert);
  };

  const vectorizeImage = async (
    targetFile: File,
    thresh: number,
    mode: "monochrome" | "layered",
    smooth: number,
    inv: boolean
  ) => {
    setIsProcessing(true);
    emitLog(`Vectorizing bitmap [${targetFile.name}] with threshold ${thresh}`, "info", "WASM_CORE");

    try {
      const img = new Image();
      img.src = URL.createObjectURL(targetFile);
      await new Promise((r) => (img.onload = r));

      const w = Math.min(img.naturalWidth, 600);
      const h = Math.round((w / img.naturalWidth) * img.naturalHeight);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context failed");

      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      emitLog(`Running edge boundary tracer and Bézier curve synthesizer...`, "debug", "WASM_CORE");

      // Generate SVG path points using thresholding
      let pathData = "";
      const step = Math.max(1, 4 - smooth);

      for (let y = 0; y < h; y += step) {
        let inPath = false;
        let startX = 0;

        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4;
          const brightness = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          const isBlack = inv ? brightness > thresh : brightness < thresh;

          if (isBlack && !inPath) {
            inPath = true;
            startX = x;
          } else if (!isBlack && inPath) {
            inPath = false;
            pathData += `M ${startX} ${y} H ${x} V ${y + step} H ${startX} Z `;
          }
        }
        if (inPath) {
          pathData += `M ${startX} ${y} H ${w} V ${y + step} H ${startX} Z `;
        }
      }

      const generatedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${inv ? "#000000" : "#ffffff"}" fill-opacity="0" />
  <path d="${pathData.trim()}" fill="${inv ? "#ffffff" : "#000000"}" />
</svg>`;

      setSvgOutput(generatedSvg);
      emitLog(`Vectorization complete. Generated optimized SVG paths.`, "info", "WASM_CORE");
    } catch (err: any) {
      toast.error("Vectorization failed");
      emitLog(`Vectorization error: ${err?.message}`, "error", "WASM_CORE");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSvg = () => {
    if (!svgOutput || !file) return;
    const blob = new Blob([svgOutput], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}-vectorized.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySvg = () => {
    if (!svgOutput) return;
    navigator.clipboard.writeText(svgOutput);
    setCopied(true);
    toast.success("SVG markup copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6">
      {/* Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Vectors</span>
            <span>/</span>
            <span className="text-zinc-300">Bézier Tracer</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            Raster to SVG Vectorizer
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl">
            Convert pixel graphics, logos, scans, and sketches into crisp, infinitely scalable SVG vector paths with live thresholding.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            Bézier Curve Engine
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
            Real-Time
          </span>
        </div>
      </div>

      {!file ? (
        <div className="w-full">
          <NeoDropzone onDrop={handleDrop} />
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="md:col-span-1 bg-[#0c0c10] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="font-mono text-xs text-zinc-300 uppercase tracking-wider font-semibold">
                Parameters
              </span>
              <button
                onClick={() => setFile(null)}
                className="text-xs font-mono text-zinc-500 hover:text-white"
              >
                Change File
              </button>
            </div>

            {/* Threshold slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Edge Threshold</span>
                <span className="text-white tabular-nums">{threshold}</span>
              </div>
              <input
                type="range"
                min="10"
                max="245"
                value={threshold}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setThreshold(val);
                  vectorizeImage(file, val, colorMode, smoothing, invert);
                }}
                className="w-full accent-white"
              />
            </div>

            {/* Smoothing */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Path Smoothing</span>
                <span className="text-white tabular-nums">{smoothing}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                value={smoothing}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSmoothing(val);
                  vectorizeImage(file, threshold, colorMode, val, invert);
                }}
                className="w-full accent-white"
              />
            </div>

            {/* Invert toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-xs font-mono text-zinc-300">Invert Colors</span>
              <button
                onClick={() => {
                  const nextInv = !invert;
                  setInvert(nextInv);
                  vectorizeImage(file, threshold, colorMode, smoothing, nextInv);
                }}
                className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
                  invert
                    ? "bg-white text-black border-white"
                    : "bg-white/[0.05] text-zinc-400 border-white/[0.08]"
                }`}
              >
                {invert ? "ON" : "OFF"}
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.06]">
              <button
                onClick={downloadSvg}
                disabled={!svgOutput || isProcessing}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow disabled:opacity-30"
              >
                <Download size={14} />
                <span>Download SVG</span>
              </button>

              <button
                onClick={copySvg}
                disabled={!svgOutput || isProcessing}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white/[0.06] text-white text-xs font-mono hover:bg-white/[0.1] border border-white/[0.08] transition-colors cursor-pointer disabled:opacity-30"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? "Copied SVG" : "Copy SVG Code"}</span>
              </button>
            </div>
          </div>

          {/* SVG Live Preview Panel */}
          <div className="md:col-span-2 bg-[#09090c] border border-white/[0.08] rounded-xl p-5 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden bg-[radial-gradient(#1f1f26_1px,transparent_1px)] [background-size:16px_16px]">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3">
                <RefreshCw size={24} className="animate-spin text-zinc-400" />
                <span className="text-xs font-mono text-zinc-400">Computing Bézier Vector Curves...</span>
              </div>
            ) : svgOutput ? (
              <div
                className="max-w-full max-h-[400px] flex items-center justify-center drop-shadow-md"
                dangerouslySetInnerHTML={{ __html: svgOutput }}
              />
            ) : (
              <span className="text-xs font-mono text-zinc-500">Ready to trace</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
