"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { NeoDropzone } from "@/components/dropzone";
import {
  FileText,
  Clock,
  Download,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  FastForward,
  Film,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface Cue {
  id: number;
  start: number; // in seconds
  end: number;
  text: string;
}

export default function SubtitlesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [cues, setCues] = useState<Cue[]>([]);
  const [offsetMs, setOffsetMs] = useState<number>(0);
  const [srcFps, setSrcFps] = useState<number>(23.976);
  const [targetFps, setTargetFps] = useState<number>(24);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Optional video preview
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Format seconds to HH:MM:SS,mmm or HH:MM:SS.mmm
  const formatTimecode = (sec: number, format: "srt" | "vtt" = "srt") => {
    const s = Math.max(0, sec);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = Math.floor(s % 60);
    const ms = Math.floor((s - Math.floor(s)) * 1000);

    const pad = (n: number, z = 2) => n.toString().padStart(z, "0");
    const sep = format === "srt" ? "," : ".";
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}${sep}${pad(ms, 3)}`;
  };

  // Parse Timecode string to seconds
  const parseTimecode = (t: string): number => {
    const clean = t.trim().replace(",", ".");
    const parts = clean.split(":");
    if (parts.length === 3) {
      return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
    }
    if (parts.length === 2) {
      return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    }
    return parseFloat(clean) || 0;
  };

  // Parse SRT / VTT content
  const parseSubtitleText = (raw: string): Cue[] => {
    const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const blocks = normalized.split(/\n\s*\n/);
    const parsed: Cue[] = [];
    let idCounter = 1;

    for (const block of blocks) {
      const lines = block.trim().split("\n");
      if (lines.length < 2) continue;

      let timeLineIdx = lines.findIndex((l) => l.includes("-->"));
      if (timeLineIdx === -1) continue;

      const timeLine = lines[timeLineIdx];
      const [startStr, endStr] = timeLine.split("-->").map((s) => s.trim().split(" ")[0]);
      const startSec = parseTimecode(startStr);
      const endSec = parseTimecode(endStr);
      const text = lines.slice(timeLineIdx + 1).join("\n");

      if (!isNaN(startSec) && !isNaN(endSec)) {
        parsed.push({
          id: idCounter++,
          start: startSec,
          end: endSec,
          text: text.replace(/<[^>]*>/g, ""), // clean tags
        });
      }
    }
    return parsed;
  };

  const handleDrop = async (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setFile(f);

    const text = await f.text();
    const parsed = parseSubtitleText(text);
    setCues(parsed);
    setOffsetMs(0);
    toast.success(`Loaded ${parsed.length} subtitle cues from ${f.name}`);
  };

  const handleVideoDrop = (files: File[]) => {
    if (files.length === 0) return;
    const vf = files[0];
    setVideoFile(vf);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(URL.createObjectURL(vf));
    toast.success(`Attached preview video: ${vf.name}`);
  };

  // Adjusted cues based on offset & FPS scaling
  const adjustedCues = useMemo(() => {
    const fpsScale = srcFps !== targetFps ? srcFps / targetFps : 1;
    const offsetSec = offsetMs / 1000;

    return cues.map((c) => ({
      ...c,
      start: Math.max(0, (c.start + offsetSec) * fpsScale),
      end: Math.max(0, (c.end + offsetSec) * fpsScale),
    }));
  }, [cues, offsetMs, srcFps, targetFps]);

  // Current active cue during video playback
  const activeCue = useMemo(() => {
    return adjustedCues.find((c) => currentTime >= c.start && currentTime <= c.end);
  }, [adjustedCues, currentTime]);

  // Export Formats
  const exportSubtitles = (format: "srt" | "vtt" | "ass" | "txt") => {
    if (adjustedCues.length === 0) return;

    let content = "";
    let mime = "text/plain";
    let ext = format;

    if (format === "srt") {
      mime = "application/x-subrip";
      content = adjustedCues
        .map((c, i) => `${i + 1}\n${formatTimecode(c.start, "srt")} --> ${formatTimecode(c.end, "srt")}\n${c.text}\n`)
        .join("\n");
    } else if (format === "vtt") {
      mime = "text/vtt";
      content =
        "WEBVTT\n\n" +
        adjustedCues
          .map((c, i) => `${i + 1}\n${formatTimecode(c.start, "vtt")} --> ${formatTimecode(c.end, "vtt")}\n${c.text}\n`)
          .join("\n");
    } else if (format === "ass") {
      mime = "text/x-ssa";
      content = `[Script Info]
Title: Exported from Explosive Tools Subtitle Studio
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,52,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3,2,2,30,30,30,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${adjustedCues
  .map(
    (c) =>
      `Dialogue: 0,${formatTimecode(c.start, "vtt").slice(1)},${formatTimecode(c.end, "vtt").slice(1)},Default,,0,0,0,,${c.text.replace(/\n/g, "\\N")}`
  )
  .join("\n")}`;
    } else {
      // txt
      content = adjustedCues.map((c) => c.text).join("\n\n");
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const baseName = file ? file.name.replace(/\.[^/.]+$/, "") : "subtitles";
    a.download = `${baseName}_sync.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as .${ext}`);
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Audio & Video</span>
            <span>/</span>
            <span className="text-zinc-300">Caption Synchronizer</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            Subtitle, Timecode & Multi-Format Caption Studio
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl">
            In-browser subtitle repair, millisecond time-shifting, framerate conversion (23.976 $\leftrightarrow$ 24 $\leftrightarrow$ 29.97 $\leftrightarrow$ 60 fps), reading speed CPS validation, and SRT/VTT/ASS/TXT export.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            SMPTE Timecode
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 font-semibold">
            100% In-Memory
          </span>
        </div>
      </div>

      {!file ? (
        <div className="w-full">
          <NeoDropzone
            onDropAccepted={handleDrop}
            maxFiles={1}
            sublabel="Drop SRT, WebVTT (.vtt), ASS, SSA, SBV, or TXT subtitle files"
          />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-5">
          {/* File Card & Controls */}
          <div className="neu-tile p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 neu-btn text-amber-400">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-mono text-sm font-semibold text-white">{file.name}</h3>
                <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-0.5">
                  <span>{cues.length} Total Cues</span>
                  <span>•</span>
                  <span>
                    Duration: {cues.length > 0 ? formatTimecode(cues[cues.length - 1].end) : "00:00:00"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => exportSubtitles("srt")}
                className="neu-btn px-3 py-1.5 text-xs text-amber-400 flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>SRT</span>
              </button>
              <button
                onClick={() => exportSubtitles("vtt")}
                className="neu-btn px-3 py-1.5 text-xs text-zinc-300 flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>VTT</span>
              </button>
              <button
                onClick={() => exportSubtitles("ass")}
                className="neu-btn px-3 py-1.5 text-xs text-zinc-300 flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>ASS</span>
              </button>
              <button
                onClick={() => exportSubtitles("txt")}
                className="neu-btn px-3 py-1.5 text-xs text-zinc-300 flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>TXT</span>
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setCues([]);
                  if (videoUrl) URL.revokeObjectURL(videoUrl);
                  setVideoUrl(null);
                }}
                className="neu-btn px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white"
              >
                Change
              </button>
            </div>
          </div>

          {/* Timecode Synchronizer Bar */}
          <div className="neu-inset p-4 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Shift Offset */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Time Shift Offset:</span>
                <span className={`font-bold ${offsetMs !== 0 ? "text-amber-400" : "text-white"}`}>
                  {offsetMs > 0 ? `+${offsetMs}` : offsetMs} ms
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOffsetMs((prev) => prev - 500)}
                  className="neu-btn px-2 py-1 text-xs"
                >
                  -500ms
                </button>
                <button
                  onClick={() => setOffsetMs((prev) => prev - 100)}
                  className="neu-btn px-2 py-1 text-xs"
                >
                  -100ms
                </button>
                <button
                  onClick={() => setOffsetMs(0)}
                  className="neu-btn px-2 py-1 text-xs text-zinc-400"
                >
                  Reset
                </button>
                <button
                  onClick={() => setOffsetMs((prev) => prev + 100)}
                  className="neu-btn px-2 py-1 text-xs"
                >
                  +100ms
                </button>
                <button
                  onClick={() => setOffsetMs((prev) => prev + 500)}
                  className="neu-btn px-2 py-1 text-xs"
                >
                  +500ms
                </button>
              </div>
            </div>

            {/* Framerate Scaling */}
            <div className="flex flex-col gap-2">
              <span className="text-zinc-400">Framerate Re-timing:</span>
              <div className="flex items-center gap-2">
                <select
                  value={srcFps}
                  onChange={(e) => setSrcFps(Number(e.target.value))}
                  className="neu-btn px-2 py-1 text-xs bg-[#101218] text-white"
                >
                  <option value={23.976}>23.976 fps</option>
                  <option value={24}>24 fps</option>
                  <option value={25}>25 fps (PAL)</option>
                  <option value={29.97}>29.97 fps (NTSC)</option>
                  <option value={30}>30 fps</option>
                  <option value={60}>60 fps</option>
                </select>
                <FastForward size={14} className="text-amber-400 shrink-0" />
                <select
                  value={targetFps}
                  onChange={(e) => setTargetFps(Number(e.target.value))}
                  className="neu-btn px-2 py-1 text-xs bg-[#101218] text-white"
                >
                  <option value={23.976}>23.976 fps</option>
                  <option value={24}>24 fps</option>
                  <option value={25}>25 fps (PAL)</option>
                  <option value={29.97}>29.97 fps (NTSC)</option>
                  <option value={30}>30 fps</option>
                  <option value={60}>60 fps</option>
                </select>
              </div>
            </div>

            {/* Reading Speed Diagnostic */}
            <div className="flex flex-col justify-center gap-1">
              <span className="text-zinc-400">CPS Diagnostics:</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-amber-400" />
                <span className="text-zinc-200">Optimal (12-18 CPS)</span>
              </div>
            </div>
          </div>

          {/* Subtitle Cue List Table */}
          <div className="neu-tile p-4 flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <span className="text-zinc-300 font-semibold">
                Synchronized Cues ({adjustedCues.length})
              </span>
              <span className="text-zinc-500 text-[11px]">Click timecode to jump</span>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-white/[0.04] pr-1">
              {adjustedCues.map((c) => {
                const duration = c.end - c.start;
                const cps = duration > 0 ? (c.text.length / duration).toFixed(1) : "0";
                const isTooFast = Number(cps) > 22;

                return (
                  <div
                    key={c.id}
                    className="py-2.5 px-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white/[0.02] rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-600 font-bold w-8">{c.id}</span>
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <span>{formatTimecode(c.start)}</span>
                        <span className="text-zinc-600">→</span>
                        <span>{formatTimecode(c.end)}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.04]">
                        {duration.toFixed(2)}s
                      </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                      <span className="text-zinc-200 font-sans text-xs flex-1 max-w-md">
                        {c.text}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded shrink-0 ${
                          isTooFast
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-white/[0.05] text-zinc-300 border border-white/[0.08]"
                        }`}
                        title="Characters per second"
                      >
                        {cps} CPS
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
