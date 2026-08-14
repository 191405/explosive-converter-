"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Monitor, Camera, Mic, MicOff, Play, Pause, Square, Download, RotateCcw, Sparkles, Volume2 } from "lucide-react";

function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function ScreenRecordPage() {
  const [sourceType, setSourceType] = useState<"screen" | "webcam">("screen");
  const [enableMic, setEnableMic] = useState(true);
  const [enableSystemAudio, setEnableSystemAudio] = useState(true);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const resultVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, []);

  const stopAllMedia = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Start Media Stream Preview
  const startPreview = async () => {
    try {
      stopAllMedia();
      let combinedStream: MediaStream;

      if (sourceType === "screen") {
        // Capture Screen + System Audio
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: { ideal: 30 } },
          audio: enableSystemAudio,
        });

        combinedStream = displayStream;

        // Optionally mix in Microphone
        if (enableMic) {
          try {
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const tracks = [...displayStream.getVideoTracks(), ...displayStream.getAudioTracks(), ...micStream.getAudioTracks()];
            combinedStream = new MediaStream(tracks);
          } catch (micErr) {
            console.warn("Microphone permission denied or not available:", micErr);
          }
        }
      } else {
        // Webcam + Microphone
        combinedStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
          audio: enableMic,
        });
      }

      setStream(combinedStream);
      setDownloadUrl(null);
      setRecordedBlob(null);

      // Listen for user clicking "Stop Sharing" on browser's native banner
      combinedStream.getVideoTracks()[0].onended = () => {
        if (isRecording) stopRecording();
        else handleReset();
      };

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = combinedStream;
        videoPreviewRef.current.play().catch(() => {});
      }

      // Setup audio VU meter if audio tracks present
      if (combinedStream.getAudioTracks().length > 0) {
        setupAudioVisualizer(combinedStream);
      }
    } catch (err) {
      console.error("Failed to access media stream:", err);
    }
  };

  const setupAudioVisualizer = (mediaStream: MediaStream) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      animFrameRef.current = requestAnimationFrame(checkVolume);
    } catch (e) {
      console.warn("Visualizer setup skipped:", e);
    }
  };

  const startRecording = () => {
    if (!stream) return;
    recordedChunksRef.current = [];

    const options = { mimeType: "video/webm; codecs=vp9,opus" };
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, options);
    } catch (e) {
      recorder = new MediaRecorder(stream);
    }

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setDownloadUrl(url);
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    recorder.start(1000); // 1-second chunks
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    setIsPaused(false);
    setDuration(0);

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleReset = () => {
    stopAllMedia();
    setStream(null);
    setIsRecording(false);
    setIsPaused(false);
    setRecordedBlob(null);
    setDownloadUrl(null);
    setDuration(0);
    setAudioLevel(0);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-glow tracking-tight flex items-center justify-center gap-3">
          <Video className="w-9 h-9 sm:w-11 sm:h-11" strokeWidth={1.75} />
          Screen & Camera Studio
        </h1>
        <p className="text-text-primary/50 font-light text-lg max-w-2xl mx-auto">
          Record screen captures, presentation windows, or webcam with crystal-clear audio directly to WebM/MP4.
        </p>
      </div>

      {!stream && !downloadUrl ? (
        <div className="w-full max-w-xl glass-panel p-8 flex flex-col gap-6">
          {/* Source Picker */}
          <div>
            <label className="text-xs font-semibold text-text-primary/50 uppercase tracking-widest mb-3 block">
              Recording Source
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSourceType("screen")}
                className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                  sourceType === "screen"
                    ? "bg-text-primary text-bg-base border-transparent shadow-lg"
                    : "border-text-primary/10 text-text-primary hover:bg-text-primary/5"
                }`}
              >
                <Monitor size={28} strokeWidth={1.75} />
                <div className="text-center">
                  <span className="text-sm font-bold block">Screen / Window</span>
                  <span className="text-[11px] opacity-70">Capture desktop or browser tab</span>
                </div>
              </button>

              <button
                onClick={() => setSourceType("webcam")}
                className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                  sourceType === "webcam"
                    ? "bg-text-primary text-bg-base border-transparent shadow-lg"
                    : "border-text-primary/10 text-text-primary hover:bg-text-primary/5"
                }`}
              >
                <Camera size={28} strokeWidth={1.75} />
                <div className="text-center">
                  <span className="text-sm font-bold block">Camera</span>
                  <span className="text-[11px] opacity-70">Capture front/external webcam</span>
                </div>
              </button>
            </div>
          </div>

          {/* Audio Toggles */}
          <div className="flex flex-col gap-3 pt-2 border-t border-text-primary/[0.05]">
            <label className="text-xs font-semibold text-text-primary/50 uppercase tracking-widest block">
              Audio Channels
            </label>

            <div className="flex items-center justify-between p-3 rounded-lg bg-text-primary/[0.02] border border-text-primary/[0.05]">
              <div className="flex items-center gap-3">
                <Mic size={18} className="text-text-primary/70" />
                <div>
                  <p className="text-sm font-medium">Microphone Voice</p>
                  <p className="text-[11px] text-text-primary/40">Record your voice via built-in / USB mic</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableMic}
                onChange={(e) => setEnableMic(e.target.checked)}
                className="w-5 h-5 accent-white cursor-pointer rounded"
              />
            </div>

            {sourceType === "screen" && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-text-primary/[0.02] border border-text-primary/[0.05]">
                <div className="flex items-center gap-3">
                  <Volume2 size={18} className="text-text-primary/70" />
                  <div>
                    <p className="text-sm font-medium">System / Tab Audio</p>
                    <p className="text-[11px] text-text-primary/40">Capture music or video playing in background</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableSystemAudio}
                  onChange={(e) => setEnableSystemAudio(e.target.checked)}
                  className="w-5 h-5 accent-white cursor-pointer rounded"
                />
              </div>
            )}
          </div>

          <button
            onClick={startPreview}
            className="btn-primary py-3.5 px-8 w-full flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider mt-2 shadow-lg"
          >
            <Video size={16} /> Open Studio Preview
          </button>
        </div>
      ) : stream ? (
        /* Live Preview & Recording Workspace */
        <div className="w-full glass-panel p-6 sm:p-8 flex flex-col gap-6">
          {/* Live Video Monitor */}
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-text-primary/[0.1] shadow-2xl flex items-center justify-center">
            <video
              ref={videoPreviewRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />

            {/* Recording Indicator Overlay */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-red-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-red-400">
                  REC • {formatSeconds(duration)}
                </span>
              </div>
            )}

            {/* Live Audio VU Level Bar */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-text-primary/10">
              <Mic size={13} className="text-text-primary/60" />
              <div className="w-16 h-1.5 bg-text-primary/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#34d399] transition-all duration-75"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* Controller Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="btn-primary px-6 py-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-red-500 text-white hover:bg-red-600 shadow-red-500/20 shadow-lg"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  Start Recording
                </button>
              ) : (
                <>
                  <button
                    onClick={stopRecording}
                    className="btn-primary px-6 py-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-red-500 text-white hover:bg-red-600"
                  >
                    <Square size={14} fill="currentColor" /> Stop Recording
                  </button>

                  <button
                    onClick={pauseRecording}
                    className="btn-secondary px-4 py-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                  >
                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={handleReset}
              className="btn-secondary px-4 py-3 text-xs flex items-center gap-2"
            >
              <RotateCcw size={14} /> Reset / Change Source
            </button>
          </div>
        </div>
      ) : (
        /* Finished Clip Review & Export */
        <div className="w-full glass-panel p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-text-primary/[0.05] pb-4">
            <h3 className="font-semibold text-lg tracking-tight flex items-center gap-2 text-[#34d399]">
              <Sparkles size={18} /> Recording Captured
            </h3>
            <span className="text-xs font-mono text-text-primary/50">
              Duration: {formatSeconds(duration)} • {recordedBlob ? formatBytes(recordedBlob.size) : ""}
            </span>
          </div>

          {/* Finished Video Player */}
          {downloadUrl && (
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-text-primary/[0.1] shadow-2xl">
              <video
                ref={resultVideoRef}
                src={downloadUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleReset}
              className="btn-secondary px-6 py-3 flex-1 text-xs font-semibold uppercase tracking-wider"
            >
              Record Another Clip
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download={`recording_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.webm`}
                className="flex-1"
              >
                <button className="btn-primary px-6 py-3 w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-text-primary text-bg-base shadow-lg">
                  <Download size={16} /> Download WebM Video
                </button>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
