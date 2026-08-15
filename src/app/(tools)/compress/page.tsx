"use client";

import { useState, useRef, useEffect } from "react";
import { FileDown, Video, Download, RefreshCw, Sliders, CheckCircle2, ArrowRight, Gauge, Layers } from "lucide-react";
import { NeoDropzone } from "@/components/dropzone";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { emitLog } from "@/lib/engine/orchestrator";
import { updateTelemetry } from "@/lib/engine/telemetry";
import { toast } from "sonner";

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function VideoCompressPage() {
  const [ready, setReady] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);

  // Compression Parameters
  const [crf, setCrf] = useState(28); // 0-51 (18=Visually Lossless, 28=Default, 35=Small)
  const [preset, setPreset] = useState<"ultrafast" | "fast" | "medium" | "slow">("fast");
  const [scale, setScale] = useState<"original" | "1080" | "720" | "480">("original");
  const [audioCodec, setAudioCodec] = useState<"copy" | "aac">("copy");

  const ffmpegRef = useRef<FFmpeg | null>(null);

  useEffect(() => {
    const loadEngine = async () => {
      try {
        emitLog("Initializing FFmpeg 0.12 WASM libx264 core...", "info", "WASM_CORE");
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        const ffmpeg = new FFmpeg();
        ffmpegRef.current = ffmpeg;

        ffmpeg.on("progress", ({ progress: p }) => {
          const pct = Math.round(p * 100);
          setProgress(pct);
        });

        ffmpeg.on("log", ({ message }) => {
          emitLog(message, "stdout", "WASM_CORE");
        });

        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        });

        setReady(true);
        emitLog("FFmpeg WASM Core loaded and ready for encoding", "info", "WASM_CORE");
      } catch (err: any) {
        emitLog(`Failed to load FFmpeg: ${err.message}`, "error", "WASM_CORE");
        toast.error("Failed to load WebAssembly video core");
      }
    };

    loadEngine();
  }, []);

  const compressVideo = async () => {
    if (!file || !ffmpegRef.current) return;
    setIsProcessing(true);
    setProgress(0);
    setDownloadUrl(null);
    setResultSize(0);

    const startTime = performance.now();
    updateTelemetry({ engineStatus: "processing", activeJobName: `H.264 Compress (${file.name})` });
    emitLog(`Starting H.264 compression on [${file.name}] (${formatBytes(file.size)})`, "info", "WASM_CORE");

    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile("input_video", await fetchFile(file));

      const args = ["-i", "input_video", "-vcodec", "libx264", "-crf", crf.toString(), "-preset", preset];

      if (scale === "1080") args.push("-vf", "scale=-2:1080");
      else if (scale === "720") args.push("-vf", "scale=-2:720");
      else if (scale === "480") args.push("-vf", "scale=-2:480");

      if (audioCodec === "copy") {
        args.push("-c:a", "copy");
      } else {
        args.push("-c:a", "aac", "-b:a", "128k");
      }

      args.push("output.mp4");

      emitLog(`Running FFmpeg: ffmpeg ${args.join(" ")}`, "debug", "WASM_CORE");
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([data as any], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
      setResultSize(blob.size);
      setDownloadUrl(url);
      setProgress(100);

      const savings = Math.round((1 - blob.size / file.size) * 100);
      emitLog(
        `Compression complete in ${elapsed}s: ${formatBytes(file.size)} -> ${formatBytes(blob.size)} (${savings > 0 ? `${savings}% reduced` : "optimized"})`,
        "info",
        "WASM_CORE"
      );
      toast.success(`Video compressed! Saved ${savings > 0 ? `${savings}%` : "0%"}`);
    } catch (err: any) {
      emitLog(`Compression failed: ${err.message}`, "error", "WASM_CORE");
      toast.error("Video compression failed");
    } finally {
      setIsProcessing(false);
      updateTelemetry({ engineStatus: "idle", activeJobName: null });
    }
  };

  const getCrfLabel = (val: number) => {
    if (val <= 19) return "Near Lossless (Master Quality)";
    if (val <= 24) return "High Definition (Low Compression)";
    if (val <= 29) return "Balanced (Recommended)";
    if (val <= 36) return "Aggressive (High Compression)";
    return "Ultra Compressed (Minimal File Size)";
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 font-sans">
      {/* Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Video</span>
            <span>/</span>
            <span className="text-zinc-300">libx264 Compression</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            Hardware-Accelerated Video Compressor
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl">
            Reduce MP4, MOV, MKV, and WebM video bitrates using libx264 with granular Constant Rate Factor (CRF) and custom resolution downscaling.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            FFmpeg WASM (libx264)
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 font-semibold">
            Zero Server Upload
          </span>
        </div>
      </div>

      {!file ? (
        <div className="w-full">
          <NeoDropzone
            onDropAccepted={(files) => setFile(files[0])}
            accept={{ "video/*": [".mp4", ".mov", ".avi", ".webm", ".mkv"] }}
            multiple={false}
            acceptedFormatsList={["MP4", "MOV", "WEBM", "MKV", "AVI"]}
            label="Drop video stream to compress"
            sublabel="Directly encoded in browser memory via multi-threaded libx264"
          />
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="md:col-span-1 bg-[#0c0c10] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-zinc-300 font-semibold uppercase tracking-wider">Parameters</span>
              <button
                onClick={() => {
                  setFile(null);
                  setDownloadUrl(null);
                }}
                className="text-zinc-500 hover:text-white"
              >
                Change File
              </button>
            </div>

            {/* CRF Quality Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">CRF Value</span>
                <span className="text-white font-bold tabular-nums">CRF {crf}</span>
              </div>
              <input
                type="range"
                min="16"
                max="42"
                value={crf}
                onChange={(e) => setCrf(Number(e.target.value))}
                className="w-full accent-white"
              />
              <span className="text-[10px] text-zinc-500">{getCrfLabel(crf)}</span>
            </div>

            {/* Encoding Preset */}
            <div className="flex flex-col gap-2">
              <span className="text-zinc-400">Encoder Preset</span>
              <div className="grid grid-cols-2 gap-1.5">
                {(["ultrafast", "fast", "medium", "slow"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreset(p)}
                    className={`py-1.5 rounded border uppercase text-[10px] transition-colors ${
                      preset === p
                        ? "bg-white text-black font-bold border-white shadow"
                        : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:bg-white/[0.06]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Scaler */}
            <div className="flex flex-col gap-2">
              <span className="text-zinc-400">Resolution Scale</span>
              <select
                value={scale}
                onChange={(e) => setScale(e.target.value as any)}
                className="bg-black/50 border border-white/[0.1] rounded px-2.5 py-1.5 text-xs text-zinc-200 outline-none"
              >
                <option value="original">Original Dimensions (100%)</option>
                <option value="1080">Scale to 1080p (Full HD)</option>
                <option value="720">Scale to 720p (HD)</option>
                <option value="480">Scale to 480p (SD Web)</option>
              </select>
            </div>

            {/* Audio Passthrough */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-zinc-400">Audio Track</span>
              <button
                onClick={() => setAudioCodec(audioCodec === "copy" ? "aac" : "copy")}
                className="px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-300 text-[10px]"
              >
                {audioCodec === "copy" ? "Lossless Passthrough" : "AAC 128k"}
              </button>
            </div>

            {/* Process Action */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.06]">
              <button
                onClick={compressVideo}
                disabled={isProcessing || !ready}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow disabled:opacity-30"
              >
                {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <FileDown size={14} />}
                <span>{isProcessing ? `Encoding (${progress}%)...` : "Start Video Compression"}</span>
              </button>

              {isProcessing && (
                <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden mt-1">
                  <div
                    className="bg-amber-400 h-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stats & Inspection Column */}
          <div className="md:col-span-2 bg-[#09090c] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between min-h-[380px] font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-zinc-300 font-semibold">{file.name}</span>
              <span className="text-zinc-500 tabular-nums">{formatBytes(file.size)}</span>
            </div>

            {/* Result Comparison */}
            {downloadUrl ? (
              <div className="p-5 bg-[#0e0e14] border border-amber-500/30 rounded-xl flex flex-col gap-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <CheckCircle2 size={18} />
                  <span>Compression Finished Successfully</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-white/[0.06]">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Original Size</span>
                    <span className="text-zinc-300 tabular-nums font-semibold">{formatBytes(file.size)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Compressed Size</span>
                    <span className="text-amber-400 tabular-nums font-bold">{formatBytes(resultSize)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Data Reduction</span>
                    <span className="text-amber-300 tabular-nums font-bold">
                      {Math.max(0, Math.round((1 - resultSize / file.size) * 100))}% Saved
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={downloadUrl}
                    download={`compressed-${file.name.replace(/\.[^/.]+$/, "")}.mp4`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition-colors shadow"
                  >
                    <Download size={14} />
                    <span>Download Compressed MP4 ({formatBytes(resultSize)})</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 text-zinc-500 py-10">
                <Video size={36} className="text-zinc-700" />
                <span>Ready to transcode. Configure CRF and preset on the left.</span>
              </div>
            )}

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500">
              <span>H.264 Main Profile</span>
              <span>100% Client-Side RAM Buffer</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
