"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, FileAudio, Download, X, Volume2, Play, Pause, Sparkles } from "lucide-react";
import { NeoDropzone } from "@/components/dropzone";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

type AudioFormat = "mp3" | "wav" | "aac" | "flac" | "ogg" | "m4a";
type Bitrate = "128k" | "192k" | "256k" | "320k";
type SampleRate = "44100" | "48000";

export default function AudioConvertPage() {
  const [ready, setReady] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<AudioFormat>("mp3");
  const [bitrate, setBitrate] = useState<Bitrate>("256k");
  const [sampleRate, setSampleRate] = useState<SampleRate>("44100");
  const [channels, setChannels] = useState<"2" | "1">("2");
  
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [outputName, setOutputName] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  // Lazy-load FFmpeg on mount
  useState(() => {
    const load = async () => {
      try {
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
      } catch (err) {
        console.error("FFmpeg load failed:", err);
      }
    };
    if (typeof window !== "undefined") load();
  });

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const convertAudio = async () => {
    if (!file || !ffmpegRef.current) return;
    setIsProcessing(true);
    setProgress(0);
    setDownloadUrl(null);
    setIsPlaying(false);

    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile(file.name, await fetchFile(file));

      const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      const outFilename = `${baseName}_converted.${format}`;

      const args: string[] = ["-i", file.name, "-vn"]; // -vn: disable video recording/extract audio only

      if (format === "mp3") {
        args.push("-c:a", "libmp3lame", "-b:a", bitrate, "-ar", sampleRate, "-ac", channels);
      } else if (format === "wav") {
        args.push("-c:a", "pcm_s16le", "-ar", sampleRate, "-ac", channels);
      } else if (format === "aac" || format === "m4a") {
        args.push("-c:a", "aac", "-b:a", bitrate, "-ar", sampleRate, "-ac", channels);
      } else if (format === "flac") {
        args.push("-c:a", "flac", "-ar", sampleRate, "-ac", channels);
      } else if (format === "ogg") {
        args.push("-c:a", "libvorbis", "-b:a", bitrate, "-ar", sampleRate, "-ac", channels);
      }

      args.push(outFilename);

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outFilename);
      const mimeMap: Record<AudioFormat, string> = {
        mp3: "audio/mpeg",
        wav: "audio/wav",
        aac: "audio/aac",
        flac: "audio/flac",
        ogg: "audio/ogg",
        m4a: "audio/mp4",
      };

      const blob = new Blob([data as any], { type: mimeMap[format] || "audio/mpeg" });
      const url = URL.createObjectURL(blob);

      setResultSize(blob.size);
      setOutputName(outFilename);
      setDownloadUrl(url);
    } catch (error) {
      console.error("Audio conversion failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setFile(null);
    setDownloadUrl(null);
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-glow tracking-tight flex items-center justify-center gap-3">
          <Music className="w-9 h-9 sm:w-11 sm:h-11" strokeWidth={1.75} />
          Audio Converter
        </h1>
        <p className="text-text-primary/50 font-light text-lg max-w-2xl mx-auto">
          Rip audio from any video (MP4, MKV, MOV) or convert between high-res audio formats with zero server uploads.
        </p>
      </div>

      {!ready ? (
        <div className="glass-panel p-8 rounded-xl flex flex-col items-center gap-4 animate-pulse max-w-md w-full">
          <svg className="animate-spin text-text-primary/50" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <p className="text-text-primary/50 font-medium tracking-wide text-sm">Loading FFmpeg WASM Audio Engine...</p>
        </div>
      ) : (
        <>
          {/* Main Controls Panel */}
          <div className="w-full max-w-xl glass-panel p-6 flex flex-col gap-6">
            {/* Format Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-semibold text-text-primary/50 uppercase tracking-widest">
                  Target Audio Format
                </label>
                <span className="text-[11px] font-mono text-text-primary/40 uppercase">
                  {format === "wav" || format === "flac" ? "Lossless" : "Compressed"}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-text-primary/[0.03] p-1.5 rounded-lg border border-text-primary/[0.05]">
                {(["mp3", "wav", "aac", "flac", "ogg", "m4a"] as AudioFormat[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`py-2 text-xs font-semibold rounded-md transition-all uppercase tracking-wider ${
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

            {/* Quality & Bitrate Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-text-primary/[0.05]">
              {/* Bitrate (if lossy) */}
              {format !== "wav" && format !== "flac" && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-text-primary/50 uppercase tracking-widest">
                    Bitrate
                  </span>
                  <select
                    value={bitrate}
                    onChange={(e) => setBitrate(e.target.value as Bitrate)}
                    className="input-base px-3 py-2 text-xs font-mono outline-none cursor-pointer bg-bg-surface"
                  >
                    <option value="128k" className="bg-bg-surface">128 kbps</option>
                    <option value="192k" className="bg-bg-surface">192 kbps</option>
                    <option value="256k" className="bg-bg-surface">256 kbps</option>
                    <option value="320k" className="bg-bg-surface">320 kbps</option>
                  </select>
                </div>
              )}

              {/* Sample Rate */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold text-text-primary/50 uppercase tracking-widest">
                  Sample Rate
                </span>
                <select
                  value={sampleRate}
                  onChange={(e) => setSampleRate(e.target.value as SampleRate)}
                  className="input-base px-3 py-2 text-xs font-mono outline-none cursor-pointer bg-bg-surface"
                >
                  <option value="44100" className="bg-bg-surface">44.1 kHz</option>
                  <option value="48000" className="bg-bg-surface">48.0 kHz</option>
                </select>
              </div>

              {/* Channels */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold text-text-primary/50 uppercase tracking-widest">
                  Channels
                </span>
                <select
                  value={channels}
                  onChange={(e) => setChannels(e.target.value as "2" | "1")}
                  className="input-base px-3 py-2 text-xs font-mono outline-none cursor-pointer bg-bg-surface"
                >
                  <option value="2" className="bg-bg-surface">Stereo</option>
                  <option value="1" className="bg-bg-surface">Mono</option>
                </select>
              </div>
            </div>
          </div>

          {/* Upload Dropzone */}
          {!file ? (
            <NeoDropzone
              onDropAccepted={(files) => setFile(files[0])}
              accept={{
                "audio/*": [".mp3", ".wav", ".aac", ".flac", ".ogg", ".m4a", ".wma", ".opus"],
                "video/*": [".mp4", ".mkv", ".mov", ".webm", ".avi", ".flv", ".wmv"],
              }}
              multiple={false}
              label="Drop audio or video file here"
              sublabel={`Extracts or converts directly to ${format.toUpperCase()}`}
              icon={<FileAudio size={40} strokeWidth={1.5} />}
            />
          ) : (
            <div className="w-full max-w-2xl glass-panel p-6 flex flex-col gap-6">
              {/* File Info Bar */}
              <div className="flex items-center justify-between border-b border-text-primary/[0.05] pb-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2.5 rounded-lg bg-text-primary/[0.05] text-text-primary/70 shrink-0">
                    <FileAudio size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base tracking-tight truncate max-w-[220px] sm:max-w-md">
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-text-primary/40 font-mono mt-0.5">
                      <span>{formatBytes(file.size)}</span>
                      <span>•</span>
                      <span className="uppercase text-text-primary/60">{file.name.split(".").pop()}</span>
                    </div>
                  </div>
                </div>
                {!isProcessing && !downloadUrl && (
                  <button
                    onClick={handleReset}
                    className="text-text-primary/40 hover:text-text-primary p-2 rounded-md hover:bg-text-primary/[0.05] transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              {isProcessing && (
                <div className="flex flex-col gap-2 bg-text-primary/[0.02] p-4 rounded-lg border border-text-primary/[0.05]">
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-text-primary/50">
                    <span className="flex items-center gap-2">
                      <Sparkles size={14} className="animate-spin text-text-primary" />
                      Converting Audio Track
                    </span>
                    <span className="text-text-primary font-mono">{Math.round(progress * 100)}%</span>
                  </div>
                  <div className="w-full h-2 progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-text-primary/30 text-center mt-2">
                    Running WebAssembly audio decoders locally in your browser.
                  </p>
                </div>
              )}

              {/* Conversion Action / Result */}
              <div className="pt-2">
                {!downloadUrl ? (
                  <button
                    onClick={convertAudio}
                    disabled={isProcessing}
                    className="btn-primary px-8 py-3.5 w-full sm:w-auto flex items-center justify-center gap-2 text-sm mx-auto shadow-lg"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Processing WASM Stream...
                      </>
                    ) : (
                      <>
                        <Music size={16} /> Extract / Convert to {format.toUpperCase()}
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Audio Player Preview */}
                    <audio
                      ref={audioRef}
                      src={downloadUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />

                    <div className="bg-[#34d399]/5 border border-[#34d399]/15 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={togglePlay}
                          className="w-10 h-10 rounded-full bg-text-primary text-bg-base flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                        >
                          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} className="ml-0.5" fill="currentColor" />}
                        </button>
                        <div>
                          <p className="text-sm font-semibold text-[#34d399] tracking-tight">Audio Ready for Download</p>
                          <p className="text-[11px] text-text-primary/50 font-mono mt-0.5">
                            {outputName} • {formatBytes(resultSize)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-text-primary/5 border border-text-primary/10 font-mono">
                        {format.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={handleReset} className="btn-secondary px-6 py-3 flex-1 text-sm">
                        Convert Another File
                      </button>
                      <a href={downloadUrl} download={outputName} className="flex-1">
                        <button className="btn-primary px-6 py-3 w-full flex items-center justify-center gap-2 text-sm bg-text-primary text-bg-base">
                          <Download size={16} /> Download {format.toUpperCase()}
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
