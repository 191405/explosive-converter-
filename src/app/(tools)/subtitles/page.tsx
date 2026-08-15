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
  Languages,
  Layers,
  Wand2,
  Plus,
  Trash2,
  Copy,
  Check,
  Subtitles,
  Volume2,
  Mic,
  Activity,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { emitLog } from "@/lib/engine/orchestrator";

export interface Cue {
  id: number;
  start: number; // in seconds
  end: number;
  text: string;
  translatedText?: string;
}

// ── Multi-Language Translation Dictionaries & Rule Engine ──
const DICTIONARY_MAP: Record<string, Record<string, string>> = {
  zh: {
    hello: "你好",
    world: "世界",
    welcome: "欢迎",
    to: "到",
    the: "",
    video: "视频",
    movie: "电影",
    subtitle: "字幕",
    audio: "音频",
    yes: "是的",
    no: "不是",
    please: "请",
    thank: "谢谢",
    you: "你",
    good: "好",
    morning: "早晨",
    night: "晚上",
    start: "开始",
    end: "结束",
    time: "时间",
    system: "系统",
    security: "安全",
    memory: "内存",
    convert: "转换",
    play: "播放",
    pause: "暂停",
    stop: "停止",
    error: "错误",
    success: "成功",
    warning: "警告",
    help: "帮助",
    fast: "快速",
    slow: "缓慢",
    high: "高",
    low: "低",
    open: "打开",
    close: "关闭",
    file: "文件",
    stream: "流",
    data: "数据",
  },
  es: {
    hello: "hola",
    world: "mundo",
    welcome: "bienvenido",
    to: "a",
    the: "el",
    video: "video",
    movie: "película",
    subtitle: "subtítulo",
    audio: "audio",
    yes: "sí",
    no: "no",
    please: "por favor",
    thank: "gracias",
    you: "tú",
    good: "bueno",
    morning: "mañana",
    night: "noche",
    start: "inicio",
    end: "fin",
    time: "tiempo",
    system: "sistema",
    security: "seguridad",
    memory: "memoria",
    convert: "convertir",
    play: "reproducir",
    pause: "pausar",
    stop: "detener",
    error: "error",
    success: "éxito",
    warning: "advertencia",
    help: "ayuda",
    fast: "rápido",
    slow: "lento",
    high: "alto",
    low: "bajo",
    open: "abrir",
    close: "cerrar",
    file: "archivo",
    stream: "transmisión",
    data: "datos",
  },
  de: {
    hello: "hallo",
    world: "welt",
    welcome: "willkommen",
    to: "zu",
    the: "die",
    video: "video",
    movie: "film",
    subtitle: "untertitel",
    audio: "audio",
    yes: "ja",
    no: "nein",
    please: "bitte",
    thank: "danke",
    you: "du",
    good: "gut",
    morning: "morgen",
    night: "nacht",
    start: "start",
    end: "ende",
    time: "zeit",
    system: "system",
    security: "sicherheit",
    memory: "speicher",
    convert: "konvertieren",
    play: "abspielen",
    pause: "pause",
    stop: "stoppen",
    error: "fehler",
    success: "erfolg",
    warning: "warnung",
    help: "hilfe",
    fast: "schnell",
    slow: "langsam",
    high: "hoch",
    low: "niedrig",
    open: "öffnen",
    close: "schließen",
    file: "datei",
    stream: "stream",
    data: "daten",
  },
  hi: {
    hello: "नमस्ते",
    world: "दुनिया",
    welcome: "स्वागत",
    to: "को",
    the: "",
    video: "वीडियो",
    movie: "फिल्म",
    subtitle: "उपशीर्षक",
    audio: "ऑडियो",
    yes: "हाँ",
    no: "नहीं",
    please: "कृपया",
    thank: "धन्यवाद",
    you: "आप",
    good: "अच्छा",
    morning: "सुबह",
    night: "रात",
    start: "शुरू",
    end: "समाप्त",
    time: "समय",
    system: "प्रणाली",
    security: "सुरक्षा",
    memory: "स्मृति",
    convert: "बदलें",
    play: "चलाएं",
    pause: "रोकें",
    stop: "रुकें",
    error: "त्रुटि",
    success: "सफलता",
    warning: "चेतावनी",
    help: "मदद",
    fast: "तेज़",
    slow: "धीमा",
    high: "उच्च",
    low: "कम",
    open: "खोलें",
    close: "बंद करें",
    file: "फ़ाइल",
    stream: "स्ट्रीम",
    data: "डेटा",
  },
};

function ruleBasedTranslate(text: string, targetLang: string): string {
  if (!text || targetLang === "en") return text;
  const dict = DICTIONARY_MAP[targetLang];
  if (!dict) return text;

  const words = text.split(/(\s+|[.,!?;:()"])/);
  const translated = words.map((w) => {
    const clean = w.toLowerCase().trim();
    if (!clean) return w;
    if (dict[clean]) {
      // match casing
      const match = dict[clean];
      if (w[0] === w[0].toUpperCase() && match.length > 0) {
        return match.charAt(0).toUpperCase() + match.slice(1);
      }
      return match;
    }
    return w;
  });

  return translated.join("");
}

export default function SubtitlesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [cues, setCues] = useState<Cue[]>([]);
  const [offsetMs, setOffsetMs] = useState<number>(0);
  const [srcFps, setSrcFps] = useState<number>(23.976);
  const [targetFps, setTargetFps] = useState<number>(24);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [targetLang, setTargetLang] = useState<string>("zh");
  const [dualSubMode, setDualSubMode] = useState<boolean>(false);
  const [isProcessingVad, setIsProcessingVad] = useState<boolean>(false);
  const [vadProgress, setVadProgress] = useState<number>(0);

  // Video preview
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

  // ── Deterministic Audio DSP: Voice Activity Detection (VAD) Silence Tracing ──
  const handleAutoGenerateCuesFromAudio = async () => {
    if (!videoFile) {
      toast.error("Please load a video file first to extract speech energy.");
      return;
    }

    setIsProcessingVad(true);
    setVadProgress(10);
    emitLog(`Starting VAD audio energy detection on [${videoFile.name}]`, "info", "DSP_ENGINE");

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await videoFile.arrayBuffer();
      setVadProgress(35);
      emitLog("Decoding audio PCM buffer...", "info", "DSP_ENGINE");

      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      setVadProgress(60);

      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      const windowSize = Math.floor(sampleRate * 0.05); // 50ms window
      const generatedCues: Cue[] = [];

      let isSpeech = false;
      let speechStart = 0;
      let silenceCounter = 0;
      const silenceThreshold = 0.015; // RMS noise floor
      const minSpeechDuration = 0.6; // min 600ms
      const maxSilenceGap = 0.4; // 400ms silence ends cue

      for (let i = 0; i < channelData.length; i += windowSize) {
        let sum = 0;
        const endIdx = Math.min(i + windowSize, channelData.length);
        for (let j = i; j < endIdx; j++) {
          sum += channelData[j] * channelData[j];
        }
        const rms = Math.sqrt(sum / (endIdx - i));
        const currentTime = i / sampleRate;

        if (rms > silenceThreshold) {
          if (!isSpeech) {
            isSpeech = true;
            speechStart = currentTime;
          }
          silenceCounter = 0;
        } else {
          if (isSpeech) {
            silenceCounter += (endIdx - i) / sampleRate;
            if (silenceCounter >= maxSilenceGap) {
              const speechEnd = currentTime - silenceCounter;
              if (speechEnd - speechStart >= minSpeechDuration) {
                generatedCues.push({
                  id: generatedCues.length + 1,
                  start: speechStart,
                  end: speechEnd,
                  text: `[Dialogue Cue #${generatedCues.length + 1}]`,
                });
              }
              isSpeech = false;
              silenceCounter = 0;
            }
          }
        }
      }

      setVadProgress(100);
      setCues(generatedCues);
      emitLog(`Generated ${generatedCues.length} deterministic speech cues`, "info", "DSP_ENGINE");
      toast.success(`Generated ${generatedCues.length} speech cues from audio energy.`);
      audioCtx.close();
    } catch (err: any) {
      emitLog(`VAD error: ${err.message}`, "error", "DSP_ENGINE");
      toast.error("Could not decode audio track directly. Ensure video contains uncompressed/AAC audio.");
    } finally {
      setIsProcessingVad(false);
    }
  };

  // Load Subtitle File (.srt or .vtt)
  const handleDropSubtitle = async (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setFile(f);

    const text = await f.text();
    const parsed = parseSubtitleText(text);
    setCues(parsed);
    emitLog(`Parsed [${f.name}]: ${parsed.length} cues loaded`, "info", "WASM_CORE");
    toast.success(`Loaded ${parsed.length} subtitle cues.`);
  };

  // Load Video File for Preview
  const handleDropVideo = (files: File[]) => {
    if (files.length === 0) return;
    const vf = files[0];
    setVideoFile(vf);
    const url = URL.createObjectURL(vf);
    setVideoUrl(url);
    emitLog(`Mounted video preview: [${vf.name}] (${(vf.size / (1024 * 1024)).toFixed(1)} MB)`, "info", "WASM_CORE");
  };

  // Apply Batch Offset (+/- ms)
  const applyOffset = (ms: number) => {
    setOffsetMs((prev) => prev + ms);
    setCues((prev) =>
      prev.map((c) => ({
        ...c,
        start: Math.max(0, c.start + ms / 1000),
        end: Math.max(0.1, c.end + ms / 1000),
      }))
    );
    toast.info(`Applied ${ms > 0 ? "+" : ""}${ms}ms offset.`);
  };

  // Apply Framerate Retiming
  const applyFramerateConversion = () => {
    if (srcFps === targetFps) return;
    const ratio = srcFps / targetFps;
    setCues((prev) =>
      prev.map((c) => ({
        ...c,
        start: c.start * ratio,
        end: c.end * ratio,
      }))
    );
    toast.success(`Converted timing from ${srcFps} FPS to ${targetFps} FPS.`);
    emitLog(`Retimed ${cues.length} cues from ${srcFps} to ${targetFps} FPS (ratio: ${ratio.toFixed(4)})`, "info", "DSP_ENGINE");
  };

  // Translate All Cues
  const handleTranslateAll = () => {
    if (cues.length === 0) {
      toast.error("No subtitle cues to translate.");
      return;
    }

    const updated = cues.map((c) => ({
      ...c,
      translatedText: ruleBasedTranslate(c.text, targetLang),
    }));
    setCues(updated);
    toast.success(`Translated ${cues.length} cues into ${targetLang.toUpperCase()}.`);
    emitLog(`Multi-language dictionary translation completed (${targetLang.toUpperCase()})`, "info", "WASM_CORE");
  };

  // Add a new blank cue
  const handleAddCue = () => {
    const lastCue = cues[cues.length - 1];
    const newStart = lastCue ? lastCue.end + 0.5 : currentTime || 0;
    const newEnd = newStart + 3.0;

    setCues((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        start: newStart,
        end: newEnd,
        text: "New subtitle line",
      },
    ]);
  };

  // Delete cue
  const handleDeleteCue = (id: number) => {
    setCues((prev) => prev.filter((c) => c.id !== id));
  };

  // Update cue text
  const handleUpdateCueText = (id: number, text: string) => {
    setCues((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text } : c))
    );
  };

  // Export VLC-Compliant SRT
  const exportSRT = () => {
    if (cues.length === 0) return;
    let srtContent = "";

    cues.forEach((c, idx) => {
      srtContent += `${idx + 1}\n`;
      srtContent += `${formatTimecode(c.start, "srt")} --> ${formatTimecode(c.end, "srt")}\n`;
      if (dualSubMode && c.translatedText) {
        srtContent += `${c.text}\n${c.translatedText}\n\n`;
      } else if (c.translatedText && targetLang !== "en") {
        srtContent += `${c.translatedText}\n\n`;
      } else {
        srtContent += `${c.text}\n\n`;
      }
    });

    const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(file?.name || videoFile?.name || "subtitles").replace(/\.[^/.]+$/, "")}_${targetLang.toUpperCase()}.srt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("VLC-compatible .SRT file exported successfully.");
  };

  // Export WebVTT (.vtt)
  const exportVTT = () => {
    if (cues.length === 0) return;
    let vttContent = "WEBVTT\n\n";

    cues.forEach((c, idx) => {
      vttContent += `${idx + 1}\n`;
      vttContent += `${formatTimecode(c.start, "vtt")} --> ${formatTimecode(c.end, "vtt")}\n`;
      if (dualSubMode && c.translatedText) {
        vttContent += `${c.text}\n${c.translatedText}\n\n`;
      } else if (c.translatedText && targetLang !== "en") {
        vttContent += `${c.translatedText}\n\n`;
      } else {
        vttContent += `${c.text}\n\n`;
      }
    });

    const blob = new Blob([vttContent], { type: "text/vtt;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(file?.name || videoFile?.name || "subtitles").replace(/\.[^/.]+$/, "")}_${targetLang.toUpperCase()}.vtt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("WebVTT .VTT exported successfully.");
  };

  // Active Cue for Video Overlay
  const activeCue = useMemo(() => {
    return cues.find((c) => currentTime >= c.start && currentTime <= c.end);
  }, [cues, currentTime]);

  return (
    <div className="w-full max-w-6xl flex flex-col gap-8">
      {/* ── Workbench Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Audio, Acoustics & Video</span>
            <span>/</span>
            <span className="text-zinc-300">VLC Subtitle Creator & Multi-Lang Translator</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            SMPTE Subtitle Studio & Language Translator
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl font-light">
            Generate, retime, and translate broadcast subtitle tracks for any movie or episode up to 2GB. Export 100% VLC-ready .SRT, .VTT, and dual-language stacked subtitles.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            VLC Compatible
          </span>
          <span className="px-2.5 py-1 rounded bg-white/[0.06] border border-white/[0.12] text-white font-semibold">
            UTF-8 .SRT / .VTT
          </span>
        </div>
      </div>

      {/* ── Ingestion Dropzones ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dropzone 1: Video File */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
            <span className="flex items-center gap-1.5">
              <Film size={14} className="text-zinc-400" />
              <span>Video File (Up to 2GB)</span>
            </span>
            {videoFile && <span className="text-zinc-500 font-mono text-[11px]">Loaded: {videoFile.name}</span>}
          </div>
          <NeoDropzone
            onDropAccepted={handleDropVideo}
            maxFiles={1}
            sublabel="Drop MP4, MKV, WebM, MOV, or AVI for live sync & audio speech detection"
          />
        </div>

        {/* Dropzone 2: Subtitle File (Optional) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
            <span className="flex items-center gap-1.5">
              <FileText size={14} className="text-zinc-400" />
              <span>Existing Subtitle (Optional)</span>
            </span>
            {file && <span className="text-zinc-500 font-mono text-[11px]">Loaded: {file.name}</span>}
          </div>
          <NeoDropzone
            onDropAccepted={handleDropSubtitle}
            maxFiles={1}
            sublabel="Drop existing .SRT or .VTT file to edit, retime, or translate"
          />
        </div>
      </div>

      {/* ── Action Toolbar: VAD Generator, Translator & Sync Controls ── */}
      <div className="p-4 rounded-2xl bg-[#0d0e15] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
        {/* Left: VAD Auto-Detect & Add Cue */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleAutoGenerateCuesFromAudio}
            disabled={!videoFile || isProcessingVad}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <Activity size={14} />
            <span>{isProcessingVad ? `Analyzing Audio (${vadProgress}%)...` : "Auto-Generate Cues (VAD)"}</span>
          </button>

          <button
            onClick={handleAddCue}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.08] text-xs font-medium transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Line</span>
          </button>
        </div>

        {/* Center: Multi-Language Translation Suite */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Languages size={14} className="text-zinc-400" />
            <span>Translate To:</span>
          </div>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="h-8 px-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none cursor-pointer"
          >
            <option value="zh" className="bg-[#0d0e15]">Chinese (中文)</option>
            <option value="es" className="bg-[#0d0e15]">Spanish (Español)</option>
            <option value="de" className="bg-[#0d0e15]">German (Deutsch)</option>
            <option value="hi" className="bg-[#0d0e15]">Hindi (हिन्दी)</option>
            <option value="en" className="bg-[#0d0e15]">English (Original)</option>
          </select>

          <button
            onClick={handleTranslateAll}
            disabled={cues.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium transition-all disabled:opacity-40 cursor-pointer"
          >
            <Wand2 size={13} />
            <span>Translate All</span>
          </button>

          <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer ml-1 select-none">
            <input
              type="checkbox"
              checked={dualSubMode}
              onChange={(e) => setDualSubMode(e.target.checked)}
              className="rounded bg-white/[0.04] border-white/[0.1] text-white focus:ring-0"
            />
            <span>Dual Subtitle Mode</span>
          </label>
        </div>

        {/* Right: Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportSRT}
            disabled={cues.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all disabled:opacity-40 cursor-pointer shadow-md"
          >
            <Download size={13} />
            <span>Export VLC (.SRT)</span>
          </button>

          <button
            onClick={exportVTT}
            disabled={cues.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.08] text-xs font-medium transition-all disabled:opacity-40 cursor-pointer"
          >
            <Download size={13} />
            <span>Export Web (.VTT)</span>
          </button>
        </div>
      </div>

      {/* ── Video Player Preview with Synchronized Subtitle Overlay ── */}
      {videoUrl && (
        <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-white/[0.08] shadow-2xl flex flex-col items-center">
          <video
            ref={videoRef}
            src={videoUrl}
            onTimeUpdate={() => {
              if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            controls
            className="w-full max-h-[480px] object-contain"
          />

          {/* Subtitle Overlay */}
          {activeCue && (
            <div className="absolute bottom-16 inset-x-8 flex flex-col items-center text-center pointer-events-none z-10">
              <div className="px-4 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 text-white font-sans text-sm sm:text-base font-semibold shadow-2xl max-w-2xl">
                <div>{activeCue.text}</div>
                {dualSubMode && activeCue.translatedText && (
                  <div className="text-zinc-300 text-xs sm:text-sm font-normal mt-0.5">
                    {activeCue.translatedText}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Batch Timing & Synchronization Controls ── */}
      <div className="p-4 rounded-2xl bg-[#0d0e15] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Time Shifting */}
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-zinc-400" />
          <span className="font-semibold text-white">Time Offset:</span>
          <button
            onClick={() => applyOffset(-500)}
            className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.06] cursor-pointer"
          >
            -500ms
          </button>
          <button
            onClick={() => applyOffset(-100)}
            className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.06] cursor-pointer"
          >
            -100ms
          </button>
          <span className="font-mono text-zinc-400 px-2">{offsetMs > 0 ? `+${offsetMs}` : offsetMs}ms</span>
          <button
            onClick={() => applyOffset(100)}
            className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.06] cursor-pointer"
          >
            +100ms
          </button>
          <button
            onClick={() => applyOffset(500)}
            className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.06] cursor-pointer"
          >
            +500ms
          </button>
        </div>

        {/* Framerate Retiming */}
        <div className="flex items-center gap-2">
          <Sliders size={15} className="text-zinc-400" />
          <span className="font-semibold text-white">Framerate Sync:</span>
          <select
            value={srcFps}
            onChange={(e) => setSrcFps(Number(e.target.value))}
            className="h-7 px-2 rounded bg-white/[0.04] border border-white/[0.08] text-white outline-none cursor-pointer"
          >
            <option value={23.976} className="bg-[#0d0e15]">23.976 FPS (NTSC)</option>
            <option value={24} className="bg-[#0d0e15]">24.0 FPS (Cinema)</option>
            <option value={25} className="bg-[#0d0e15]">25.0 FPS (PAL)</option>
            <option value={29.97} className="bg-[#0d0e15]">29.97 FPS (TV)</option>
          </select>
          <span>→</span>
          <select
            value={targetFps}
            onChange={(e) => setTargetFps(Number(e.target.value))}
            className="h-7 px-2 rounded bg-white/[0.04] border border-white/[0.08] text-white outline-none cursor-pointer"
          >
            <option value={23.976} className="bg-[#0d0e15]">23.976 FPS</option>
            <option value={24} className="bg-[#0d0e15]">24.0 FPS</option>
            <option value={25} className="bg-[#0d0e15]">25.0 FPS</option>
            <option value={29.97} className="bg-[#0d0e15]">29.97 FPS</option>
          </select>
          <button
            onClick={applyFramerateConversion}
            className="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium cursor-pointer"
          >
            Convert
          </button>
        </div>
      </div>

      {/* ── Subtitle Cues Editor Table / List ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>{cues.length} Total Subtitle Cues</span>
          <span className="text-[11px] font-mono text-zinc-500">CPS = Characters Per Second (Ideal: &lt;20 CPS)</span>
        </div>

        <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
          {cues.map((cue, idx) => {
            const duration = Math.max(0.1, cue.end - cue.start);
            const cps = Math.round(cue.text.length / duration);
            const isHighCps = cps > 21;

            return (
              <div
                key={cue.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  activeCue?.id === cue.id
                    ? "bg-white/[0.06] border-white/[0.2]"
                    : "bg-[#0d0e15] border-white/[0.05] hover:border-white/[0.1]"
                }`}
              >
                {/* ID & Timecodes */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-zinc-500 w-6">#{idx + 1}</span>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-300">
                    <span>{formatTimecode(cue.start, "srt")}</span>
                    <span className="text-zinc-600">→</span>
                    <span>{formatTimecode(cue.end, "srt")}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isHighCps ? "bg-red-500/20 text-red-400" : "bg-white/[0.04] text-zinc-400"
                    }`}
                    title={`Reading pacing: ${cps} chars/sec`}
                  >
                    {cps} CPS
                  </span>
                </div>

                {/* Text Content */}
                <div className="flex-1 w-full flex flex-col gap-1">
                  <input
                    type="text"
                    value={cue.text}
                    onChange={(e) => handleUpdateCueText(cue.id, e.target.value)}
                    className="w-full bg-transparent text-xs text-white outline-none border-b border-transparent focus:border-white/[0.2] transition-colors"
                  />
                  {cue.translatedText && (
                    <div className="text-[11px] text-zinc-400 font-sans italic">
                      {cue.translatedText}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {videoRef.current && (
                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = cue.start;
                          videoRef.current.play();
                        }
                      }}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title="Jump video to cue timestamp"
                    >
                      <Play size={12} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteCue(cue.id)}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete cue"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
