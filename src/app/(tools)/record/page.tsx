"use client";

import { useState, useRef, useEffect } from "react";
import { Video, Monitor, Camera, Mic, MicOff, Play, Pause, Square, Download, RotateCcw, Volume2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { emitLog } from "@/lib/engine/orchestrator";
import { toast } from "sonner";

function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function ScreenRecordPage() {
  const [sourceType, setSourceType] = useState<"screen" | "webcam">("screen");
  const [enableMic, setEnableMic] = useState(true);
  const [enableSystemAudio, setEnableSystemAudio] = useState(true);
  const [fps, setFps] = useState<30 | 60>(60);
  const [resolution, setResolution] = useState<"1080" | "4k" | "720">("1080");

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);

  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, []);

  const stopAllMedia = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const startPreview = async () => {
    try {
      stopAllMedia();
      let combinedStream: MediaStream;

      emitLog(`Requesting ${sourceType.toUpperCase()} capture stream @ ${fps} FPS...`, "info", "DSP_ENGINE");

      if (sourceType === "screen") {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: { ideal: fps } },
          audio: enableSystemAudio,
        });

        combinedStream = displayStream;

        if (enableMic) {
          try {
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const tracks = [...displayStream.getVideoTracks(), ...displayStream.getAudioTracks(), ...micStream.getAudioTracks()];
            combinedStream = new MediaStream(tracks);
          } catch {
            // microphone optional
          }
        }
      } else {
        combinedStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: fps } },
          audio: enableMic,
        });
      }

      setStream(combinedStream);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = combinedStream;
        videoPreviewRef.current.play();
      }

      // Audio level analyser
      const audioTracks = combinedStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = audioCtx;
        const sourceNode = audioCtx.createMediaStreamSource(combinedStream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        sourceNode.connect(analyser);
        analyserRef.current = analyser;

        const updateMeter = () => {
          const data = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      }

      emitLog("Live display capture stream active", "info", "DSP_ENGINE");
    } catch (err: any) {
      emitLog(`Display capture permission denied: ${err.message}`, "error", "DSP_ENGINE");
      toast.error("Capture permission denied");
    }
  };

  const startRecording = () => {
    if (!stream) return;
    recordedChunksRef.current = [];
    setDownloadUrl(null);
    setRecordedBlob(null);

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : MediaRecorder.isTypeSupported("video/mp4")
      ? "video/mp4"
      : "video/webm";

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8000000 });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setDownloadUrl(url);
      setIsRecording(false);
      setIsPaused(false);
      emitLog(`Recording finished. Captured ${formatBytes(blob.size)} in-memory`, "info", "DSP_ENGINE");
      toast.success("Recording captured successfully!");
    };

    recorder.start(1000); // 1s slice chunking
    setIsRecording(true);
    setIsPaused(false);
    setDuration(0);

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    emitLog(`Recording started [${mimeType}]`, "info", "DSP_ENGINE");
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 font-sans">
      {/* Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Hardware</span>
            <span>/</span>
            <span className="text-zinc-300">Display Capture</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            Screen & Camera Studio Recorder
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl">
            Capture desktop applications, browser tabs, webcams, and synchronized system audio up to 60 FPS directly in memory.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            VP9 / Opus Hardware Stream
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
            60 FPS
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        {/* Controls */}
        <div className="md:col-span-1 bg-[#0c0c10] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-zinc-300 font-semibold uppercase tracking-wider">Capture Source</span>
            {stream && (
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> LIVE
              </span>
            )}
          </div>

          {/* Source Type Selector */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                setSourceType("screen");
                stopAllMedia();
                setStream(null);
              }}
              className={`py-2 rounded border flex items-center justify-center gap-2 transition-colors ${
                sourceType === "screen" ? "bg-white text-black font-bold border-white shadow" : "bg-white/[0.03] text-zinc-400 border-white/[0.06]"
              }`}
            >
              <Monitor size={14} />
              <span>Screen / Tab</span>
            </button>
            <button
              onClick={() => {
                setSourceType("webcam");
                stopAllMedia();
                setStream(null);
              }}
              className={`py-2 rounded border flex items-center justify-center gap-2 transition-colors ${
                sourceType === "webcam" ? "bg-white text-black font-bold border-white shadow" : "bg-white/[0.03] text-zinc-400 border-white/[0.06]"
              }`}
            >
              <Camera size={14} />
              <span>Webcam</span>
            </button>
          </div>

          {/* FPS & Audio Switches */}
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Target Framerate</span>
            <div className="flex gap-1.5">
              {([30, 60] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFps(f)}
                  className={`px-2.5 py-1 rounded border text-[10px] ${
                    fps === f ? "bg-white text-black font-bold border-white" : "bg-white/[0.03] text-zinc-400 border-white/[0.06]"
                  }`}
                >
                  {f} FPS
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Microphone</span>
            <button
              onClick={() => setEnableMic(!enableMic)}
              className={`px-2.5 py-1 rounded border text-[10px] ${
                enableMic ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-white/[0.03] text-zinc-500 border-white/[0.06]"
              }`}
            >
              {enableMic ? "Enabled" : "Muted"}
            </button>
          </div>

          {/* VU Level Meter */}
          {enableMic && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/[0.06]">
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Audio VU Input Level</span>
                <span className="tabular-nums">{audioLevel}%</span>
              </div>
              <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-75"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.06]">
            {!stream ? (
              <button
                onClick={startPreview}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow"
              >
                <Play size={14} />
                <span>Initialize Capture Stream</span>
              </button>
            ) : !isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-red-500 text-white font-semibold text-xs hover:bg-red-600 transition-all cursor-pointer shadow"
              >
                <div className="h-2 w-2 rounded-full bg-white animate-ping"></div>
                <span>Start Recording</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={pauseRecording}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-white/[0.08] text-white hover:bg-white/[0.12] transition-colors"
                >
                  {isPaused ? <Play size={13} /> : <Pause size={13} />}
                  <span>{isPaused ? "Resume" : "Pause"}</span>
                </button>
                <button
                  onClick={stopRecording}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                >
                  <Square size={13} />
                  <span>Stop</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Canvas Monitor */}
        <div className="md:col-span-2 bg-[#09090c] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between min-h-[380px]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-zinc-300 font-semibold">Live Monitor Output</span>
            {isRecording && (
              <span className="text-red-400 font-bold tabular-nums flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                REC {formatSeconds(duration)}
              </span>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center py-4 relative">
            <video
              ref={videoPreviewRef}
              muted
              playsInline
              className={`max-w-full max-h-[300px] rounded-lg border border-white/[0.08] bg-black ${
                !stream ? "hidden" : "block"
              }`}
            />

            {!stream && !downloadUrl && (
              <div className="flex flex-col items-center justify-center gap-3 text-zinc-500 py-12">
                <Monitor size={42} className="text-zinc-700" />
                <span>Click &quot;Initialize Capture Stream&quot; to begin window selection.</span>
              </div>
            )}

            {downloadUrl && !stream && (
              <div className="w-full p-5 bg-[#0e0e14] border border-emerald-500/30 rounded-xl flex flex-col gap-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 size={18} />
                  <span>Recording Captured Successfully ({formatSeconds(duration)})</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <span className="text-zinc-400 tabular-nums">Size: {formatBytes(recordedBlob?.size || 0)}</span>
                  <a
                    href={downloadUrl}
                    download={`recording-${Date.now()}.webm`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-colors shadow"
                  >
                    <Download size={14} />
                    <span>Download Video Recording</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500">
            <span>VP9 / Opus Hardware Stream</span>
            <span>Zero-Disk RAM Buffer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
