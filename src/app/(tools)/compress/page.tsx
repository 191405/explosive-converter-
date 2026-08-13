"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FileDown, FileVideo, X, Download } from "lucide-react";
import { NeoDropzone } from "@/components/dropzone";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default function VideoCompressPage() {
  const [ready, setReady] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);

  const [crf, setCrf] = useState(28);
  const [preset, setPreset] = useState<"ultrafast" | "fast" | "medium" | "slow">("fast");

  const ffmpegRef = useRef<FFmpeg | null>(null);
  
  // Auto-load FFmpeg on mount
  useState(() => {
    const load = async () => {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;
      
      ffmpeg.on("progress", ({ progress }) => {
        setProgress(progress);
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setReady(true);
    };
    if (typeof window !== "undefined") load();
  });

  const compressVideo = async () => {
    if (!file || !ffmpegRef.current) return;
    setIsProcessing(true);
    setProgress(0);
    setDownloadUrl(null);
    
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(file.name, await fetchFile(file));

    // Basic compression: libx264, set CRF and Preset
    const ext = file.name.split('.').pop() || 'mp4';
    const outputName = `output.${ext}`;
    
    await ffmpeg.exec([
      "-i", file.name,
      "-vcodec", "libx264",
      "-crf", crf.toString(),
      "-preset", preset,
      outputName
    ]);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as any], { type: `video/${ext}` });
    const url = URL.createObjectURL(blob);
    
    setResultSize(blob.size);
    setDownloadUrl(url);
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-glow tracking-tight">Video Compress</h1>
        <p className="text-text-primary/50 font-light text-lg">Shrink video files directly in your browser. No server required.</p>
      </div>

      {!ready ? (
        <div className="glass-panel p-8 rounded-xl flex flex-col items-center gap-4 animate-pulse max-w-md w-full">
          <svg className="animate-spin text-text-primary/50" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          <p className="text-text-primary/50 font-medium tracking-wide text-sm">Loading FFmpeg WASM Core...</p>
        </div>
      ) : (
        <>
          {/* Settings Panel */}
          <div className="w-full max-w-xl glass-panel p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-widest">
                <span className="text-text-primary/50">Compression Preset</span>
                <span className="text-text-primary">{preset}</span>
              </div>
              <div className="flex bg-text-primary/[0.03] p-1.5 rounded-lg border border-text-primary/[0.05]">
                {["ultrafast", "fast", "medium", "slow"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreset(p as any)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all uppercase tracking-wider ${
                      preset === p
                        ? "bg-text-primary text-bg-base shadow-md"
                        : "text-text-primary/40 hover:text-text-primary hover:bg-text-primary/[0.05]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-widest">
                <span className="text-text-primary/50">Video Quality (CRF)</span>
                <span className="text-text-primary">{crf}</span>
              </div>
              <input
                type="range"
                min="0"
                max="51"
                step="1"
                value={crf}
                onChange={(e) => setCrf(Number(e.target.value))}
                className="w-full accent-white h-1.5 bg-text-primary/10 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-text-primary/30 uppercase tracking-widest font-semibold">
                <span>Lossless (Large)</span>
                <span>Balanced</span>
                <span>Low Quality (Small)</span>
              </div>
            </div>
          </div>

          {!file ? (
            <NeoDropzone
              onDropAccepted={(files) => setFile(files[0])}
              accept={{ "video/*": [".mp4", ".mov", ".avi", ".webm", ".mkv"] }}
              multiple={false}
              label="Drop a video file here"
              sublabel="MP4, MOV, AVI, WEBM, MKV supported"
              icon={<FileVideo size={40} strokeWidth={1.5} />}
            />
          ) : (
            <div className="w-full max-w-2xl glass-panel p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-text-primary/[0.05] pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded bg-text-primary/[0.05] text-text-primary/70">
                    <FileVideo size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg tracking-tight truncate max-w-[200px] sm:max-w-xs">{file.name}</h3>
                    <p className="text-[11px] text-text-primary/40 font-mono mt-0.5">{formatBytes(file.size)}</p>
                  </div>
                </div>
                {!isProcessing && !downloadUrl && (
                  <button onClick={() => setFile(null)} className="text-text-primary/40 hover:text-text-primary p-2 rounded-md hover:bg-text-primary/[0.05] transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              {isProcessing && (
                <div className="flex flex-col gap-2 bg-text-primary/[0.02] p-4 rounded-lg border border-text-primary/[0.05]">
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-text-primary/50">
                    <span>Compressing</span>
                    <span className="text-text-primary">{Math.round(progress * 100)}%</span>
                  </div>
                  <div className="w-full h-2 progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-text-primary/30 text-center mt-2">This happens in your browser and may take a while.</p>
                </div>
              )}

              {/* Action bar */}
              <div className="pt-2">
                {!downloadUrl ? (
                  <button
                    onClick={compressVideo}
                    disabled={isProcessing}
                    className="btn-primary px-8 py-3 w-full sm:w-auto flex items-center justify-center gap-2 text-sm mx-auto"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                        Compressing...
                      </>
                    ) : (
                      <>
                        <FileDown size={16} /> Compress Video
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="bg-[#34d399]/5 border border-[#34d399]/10 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#34d399] tracking-tight">Compression Complete</p>
                        <p className="text-[11px] text-text-primary/50 font-mono mt-1">
                          Original: {formatBytes(file.size)} → New: {formatBytes(resultSize)}
                        </p>
                      </div>
                      <span className="text-lg font-black text-text-primary/90 bg-text-primary/5 px-3 py-1.5 rounded-lg border border-text-primary/10 shadow-inner">
                        -{Math.round((1 - resultSize / file.size) * 100)}%
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={() => { setFile(null); setDownloadUrl(null); }} className="btn-secondary px-6 py-3 flex-1 text-sm">
                        Compress Another
                      </button>
                      <a href={downloadUrl} download={`compressed_${file.name}`} className="flex-1">
                        <button className="btn-primary px-6 py-3 w-full flex items-center justify-center gap-2 text-sm bg-text-primary text-bg-base">
                          <Download size={16} /> Download Result
                        </button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
