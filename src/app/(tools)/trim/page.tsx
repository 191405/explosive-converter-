"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Scissors, Play, Pause, RotateCcw, Download, X, Volume2, Music, Sparkles, Check } from "lucide-react";
import { NeoDropzone } from "@/components/dropzone";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00.00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Convert AudioBuffer slice directly to WAV ArrayBuffer client-side
function audioBufferToWav(buffer: AudioBuffer, startSec: number, endSec: number): Blob {
  const sampleRate = buffer.sampleRate;
  const startOffset = Math.floor(Math.max(0, startSec) * sampleRate);
  const endOffset = Math.min(buffer.length, Math.floor(endSec * sampleRate));
  const frameCount = Math.max(0, endOffset - startOffset);
  const numChannels = buffer.numberOfChannels;

  // WAV header is 44 bytes
  const byteLength = frameCount * numChannels * 2 + 44;
  const out = new ArrayBuffer(byteLength);
  const view = new DataView(out);

  function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF identifier
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + frameCount * numChannels * 2, true);
  writeString(view, 8, "WAVE");
  // fmt subchunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true); // ByteRate
  view.setUint16(32, numChannels * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  // data subchunk
  writeString(view, 36, "data");
  view.setUint32(40, frameCount * numChannels * 2, true);

  // Interleave audio samples
  let offset = 44;
  const channelData: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channelData.push(buffer.getChannelData(i));
  }

  for (let i = 0; i < frameCount; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channelData[ch][startOffset + i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([out], { type: "audio/wav" });
}

export default function AudioTrimPage() {
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [trimmedSize, setTrimmedSize] = useState<number>(0);
  const [isExporting, setIsExporting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const playStartTimeRef = useRef<number>(0);
  const pauseOffsetRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Load and decode audio into Web Audio API Buffer
  const handleDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const selected = acceptedFiles[0];
    setFile(selected);
    setIsLoading(true);
    setDownloadUrl(null);

    try {
      const arrayBuf = await selected.arrayBuffer();
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const decoded = await ctx.decodeAudioData(arrayBuf);
      setAudioBuffer(decoded);
      setDuration(decoded.duration);
      setStartTime(0);
      setEndTime(decoded.duration);
      setCurrentTime(0);
      pauseOffsetRef.current = 0;
    } catch (err) {
      console.error("Error decoding audio file:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Draw Waveform Canvas
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // Extract peaks
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    const startX = (startTime / duration) * width;
    const endX = (endTime / duration) * width;
    const playX = (currentTime / duration) * width;

    // Background Waveform (Inactive / Outside Cut)
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      const barH = Math.max(2, (max - min) * amp * 0.9);
      ctx.fillRect(i, amp - barH / 2, 1, barH);
    }

    // Active Selection Overlay Highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(startX, 0, endX - startX, height);

    // Active Waveform inside Selection
    ctx.fillStyle = "#ffffff";
    for (let i = Math.floor(startX); i < Math.ceil(endX); i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      const barH = Math.max(2, (max - min) * amp * 0.9);
      ctx.fillRect(i, amp - barH / 2, 1, barH);
    }

    // Start Boundary Marker
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(startX - 1.5, 0, 3, height);
    ctx.beginPath();
    ctx.arc(startX, 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // End Boundary Marker
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(endX - 1.5, 0, 3, height);
    ctx.beginPath();
    ctx.arc(endX, 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // Current Playhead Cursor
    if (currentTime >= 0 && currentTime <= duration) {
      ctx.fillStyle = "#34d399";
      ctx.shadowColor = "rgba(52, 211, 153, 0.6)";
      ctx.shadowBlur = 8;
      ctx.fillRect(playX - 1, 0, 2, height);
      ctx.shadowBlur = 0; // reset
    }
  }, [audioBuffer, duration, startTime, endTime, currentTime]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  // Handle Play / Stop / Pause
  const stopPlayback = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {}
      sourceNodeRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsPlaying(false);
  }, []);

  const playRange = useCallback(
    (startSec: number, endSec: number) => {
      if (!audioBuffer || !audioCtxRef.current) return;

      stopPlayback();

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const offset = startSec;
      const playDuration = Math.max(0.1, endSec - startSec);

      source.start(0, offset, playDuration);
      sourceNodeRef.current = source;
      playStartTimeRef.current = ctx.currentTime;
      pauseOffsetRef.current = offset;
      setIsPlaying(true);

      const updateProgress = () => {
        if (!audioCtxRef.current || !sourceNodeRef.current) return;
        const elapsed = audioCtxRef.current.currentTime - playStartTimeRef.current;
        const cur = pauseOffsetRef.current + elapsed;

        if (cur >= endSec) {
          if (isLooping) {
            playRange(startSec, endSec);
          } else {
            setCurrentTime(startSec);
            stopPlayback();
          }
          return;
        }

        setCurrentTime(cur);
        animFrameRef.current = requestAnimationFrame(updateProgress);
      };

      animFrameRef.current = requestAnimationFrame(updateProgress);

      source.onended = () => {
        if (!isLooping) {
          setIsPlaying(false);
          setCurrentTime(startSec);
        }
      };
    },
    [audioBuffer, isLooping, stopPlayback]
  );

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      const start = currentTime >= startTime && currentTime < endTime ? currentTime : startTime;
      playRange(start, endTime);
    }
  };

  const handleResetCurrent = () => {
    stopPlayback();
    setCurrentTime(startTime);
  };

  // Canvas Click / Scrubbing
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!duration || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickedTime = (clickX / rect.width) * duration;
    const clampedTime = Math.max(0, Math.min(duration, clickedTime));

    stopPlayback();
    setCurrentTime(clampedTime);
  };

  // Export Trimmed Audio directly to Lossless WAV
  const handleExport = () => {
    if (!audioBuffer || !file) return;
    setIsExporting(true);

    setTimeout(() => {
      try {
        const wavBlob = audioBufferToWav(audioBuffer, startTime, endTime);
        const url = URL.createObjectURL(wavBlob);
        setTrimmedSize(wavBlob.size);
        setDownloadUrl(url);
      } catch (err) {
        console.error("Export error:", err);
      } finally {
        setIsExporting(false);
      }
    }, 150);
  };

  const handleClearAll = () => {
    stopPlayback();
    setFile(null);
    setAudioBuffer(null);
    setDownloadUrl(null);
    setCurrentTime(0);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6">
      {/* Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Audio</span>
            <span>/</span>
            <span className="text-zinc-300">PCM Waveform Slicer</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            Waveform Audio Cutter & Slicer
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl">
            Precision visual waveform slicing with millisecond range selection, real-time playback preview, and lossless client export.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            AudioBuffer PCM
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
            Lossless
          </span>
        </div>
      </div>

      {!file ? (
        <div className="w-full">
          <NeoDropzone
            onDropAccepted={handleDrop}
            accept={{
              "audio/*": [".mp3", ".wav", ".aac", ".flac", ".ogg", ".m4a", ".opus"],
            }}
            multiple={false}
            label="Drop an audio file to trim"
            sublabel="MP3, WAV, AAC, FLAC, OGG & M4A supported"
          />
        </div>
      ) : isLoading ? (
        <div className="glass-panel p-8 rounded-xl flex flex-col items-center gap-4 animate-pulse max-w-md w-full">
          <svg className="animate-spin text-text-primary/50" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <p className="text-text-primary/50 font-medium tracking-wide text-sm">Decoding Audio Waveform...</p>
        </div>
      ) : (
        <div className="w-full glass-panel p-6 sm:p-8 flex flex-col gap-8">
          {/* File Header */}
          <div className="flex items-center justify-between border-b border-text-primary/[0.05] pb-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-2.5 rounded-lg bg-text-primary/[0.05] text-text-primary/70 shrink-0">
                <Music size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-base tracking-tight truncate max-w-[200px] sm:max-w-md">
                  {file.name}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-text-primary/40 font-mono mt-0.5">
                  <span>{formatBytes(file.size)}</span>
                  <span>•</span>
                  <span>Duration: {formatTime(duration)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClearAll}
              className="text-text-primary/40 hover:text-text-primary p-2 rounded-md hover:bg-text-primary/[0.05] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Interactive Waveform Canvas Container */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs font-mono text-text-primary/50">
              <span>Position: <strong className="text-text-primary">{formatTime(currentTime)}</strong></span>
              <span>Selection Duration: <strong className="text-[#34d399] font-mono">{formatTime(Math.max(0, endTime - startTime))}</strong></span>
            </div>

            <div
              ref={containerRef}
              className="relative w-full h-36 bg-text-primary/[0.02] border border-text-primary/[0.08] rounded-xl overflow-hidden cursor-crosshair shadow-inner"
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full h-full block"
              />
            </div>
          </div>

          {/* Precision Controls: Start, End, Scrub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-text-primary/[0.02] border border-text-primary/[0.05]">
            {/* Start Handle Control */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-text-primary/50">
                <span>Start Cut Point</span>
                <span className="font-mono text-text-primary">{formatTime(startTime)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                step="0.05"
                value={startTime}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), endTime - 0.1);
                  setStartTime(Math.max(0, val));
                }}
                className="w-full accent-white h-1.5 bg-text-primary/10 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* End Handle Control */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-text-primary/50">
                <span>End Cut Point</span>
                <span className="font-mono text-text-primary">{formatTime(endTime)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                step="0.05"
                value={endTime}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), startTime + 0.1);
                  setEndTime(Math.min(duration, val));
                }}
                className="w-full accent-white h-1.5 bg-text-primary/10 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Playback Controls & Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-text-primary/[0.05]">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="btn-primary px-5 py-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              >
                {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
                {isPlaying ? "Pause Preview" : "Play Selection"}
              </button>

              <button
                onClick={handleResetCurrent}
                title="Rewind to start of selection"
                className="btn-secondary p-2.5 rounded-lg text-text-primary/70 hover:text-text-primary"
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`px-3 py-2 text-xs font-mono rounded-lg border transition-all ${
                  isLooping
                    ? "bg-text-primary/10 border-text-primary/30 text-text-primary"
                    : "border-text-primary/5 text-text-primary/40 hover:text-text-primary"
                }`}
              >
                Loop: {isLooping ? "ON" : "OFF"}
              </button>
            </div>

            {!downloadUrl ? (
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="btn-primary px-6 py-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-text-primary text-bg-base"
              >
                <Scissors size={15} />
                {isExporting ? "Slicing Audio..." : "Trim & Export (WAV)"}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <a
                  href={downloadUrl}
                  download={`trimmed_${file.name.replace(/\.[^/.]+$/, "")}.wav`}
                >
                  <button className="btn-primary px-6 py-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#34d399] text-black hover:bg-[#34d399]/90">
                    <Download size={15} /> Download Trimmed WAV ({formatBytes(trimmedSize)})
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
