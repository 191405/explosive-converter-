"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Download, RefreshCw, Volume2, Play, Pause, Disc, ArrowRight, CheckCircle2 } from "lucide-react";
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

type AudioFormat = "mp3" | "wav" | "aac" | "flac" | "ogg" | "m4a";
type Bitrate = "128k" | "192k" | "256k" | "320k";
type SampleRate = "44100" | "48000" | "96000";

export default function AudioConvertPage() {
  const [ready, setReady] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<AudioFormat>("mp3");
  const [bitrate, setBitrate] = useState<Bitrate>("256k");
  const [sampleRate, setSampleRate] = useState<SampleRate>("48000");
  const [channels, setChannels] = useState<"2" | "1">("2");

  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [outputName, setOutputName] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        emitLog("Initializing FFmpeg 0.12 WASM Audio Codec Engine (libmp3lame/opus/flac)...", "info", "WASM_CORE");
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        const ffmpeg = new FFmpeg();
        ffmpegRef.current = ffmpeg;

        ffmpeg.on("progress", ({ progress: p }) => {
          setProgress(Math.round(p * 100));
        });

        ffmpeg.on("log", ({ message }) => {
          emitLog(message, "stdout", "WASM_CORE");
        });

        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        });

        setReady(true);
        emitLog("Audio Transcoding Core initialized in browser RAM", "info", "WASM_CORE");
      } catch (err: any) {
        emitLog(`Audio engine load failure: ${err.message}`, "error", "WASM_CORE");
      }
    };
    load();
  }, []);

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

    updateTelemetry({ engineStatus: "processing", activeJobName: `Audio Transcode (${file.name})` });
    emitLog(`Starting audio transcode: [${file.name}] -> [${format.toUpperCase()}] @ ${bitrate}`, "info", "WASM_CORE");

    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile("audio_in", await fetchFile(file));

      const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      const outFilename = `${baseName}.${format}`;

      const args: string[] = ["-i", "audio_in", "-vn"];

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
      const mimeType = format === "wav" ? "audio/wav" : format === "mp3" ? "audio/mp3" : format === "flac" ? "audio/flac" : "audio/aac";
      const blob = new Blob([data as any], { type: mimeType });
      const url = URL.createObjectURL(blob);

      setResultSize(blob.size);
      setOutputName(outFilename);
      setDownloadUrl(url);
      setProgress(100);

      emitLog(`Transcode finished. Output file size: ${formatBytes(blob.size)}`, "info", "WASM_CORE");
      toast.success(`Converted to ${format.toUpperCase()} successfully!`);
    } catch (err: any) {
      emitLog(`Audio transcode failed: ${err.message}`, "error", "WASM_CORE");
      toast.error("Audio conversion failed");
    } finally {
      setIsProcessing(false);
      updateTelemetry({ engineStatus: "idle", activeJobName: null });
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-8 font-sans">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-zinc-300 text-xs font-mono">
          <Music size={13} />
          <span>Multi-Stream Audio Transcoder & Video Extractor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Audio Converter & Stream Extractor
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto">
          Extract audio streams from video files or transcode audio between MP3, WAV, AAC, FLAC, and OGG with custom bitrates and sample rates.
        </p>
      </div>

      {!file ? (
        <div className="w-full max-w-2xl">
          <NeoDropzone
            onDropAccepted={(files) => setFile(files[0])}
            accept={{ "audio/*": [".mp3", ".wav", ".aac", ".flac", ".ogg", ".m4a", ".wma"], "video/*": [".mp4", ".mov", ".mkv", ".webm", ".avi"] }}
            multiple={false}
            acceptedFormatsList={["MP3", "WAV", "AAC", "FLAC", "OGG", "M4A", "MP4", "MKV"]}
            label="Drop audio file or video stream"
            sublabel="Extract audio or transcode formats directly in browser memory"
          />
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Controls */}
          <div className="md:col-span-1 bg-[#0c0c10] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-zinc-300 font-semibold uppercase tracking-wider">Codec Parameters</span>
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

            {/* Target format */}
            <div className="flex flex-col gap-2">
              <span className="text-zinc-400">Target Container</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(["mp3", "wav", "aac", "flac", "ogg", "m4a"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-1.5 rounded border uppercase text-[10px] transition-colors ${
                      format === fmt
                        ? "bg-white text-black font-bold border-white shadow"
                        : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:bg-white/[0.06]"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Bitrate (if lossy) */}
            {format !== "wav" && format !== "flac" && (
              <div className="flex flex-col gap-2">
                <span className="text-zinc-400">Bitrate Density</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["128k", "192k", "256k", "320k"] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBitrate(b)}
                      className={`py-1.5 rounded border text-[10px] transition-colors ${
                        bitrate === b
                          ? "bg-white text-black font-bold border-white"
                          : "bg-white/[0.03] text-zinc-400 border-white/[0.06]"
                      }`}
                    >
                      {b.replace("k", " kbps")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Rate */}
            <div className="flex flex-col gap-2">
              <span className="text-zinc-400">Sample Rate</span>
              <select
                value={sampleRate}
                onChange={(e) => setSampleRate(e.target.value as SampleRate)}
                className="bg-black/50 border border-white/[0.1] rounded px-2.5 py-1.5 text-xs text-zinc-200 outline-none"
              >
                <option value="48000">48,000 Hz (Pro Audio Master)</option>
                <option value="44100">44,100 Hz (Standard CD Quality)</option>
                <option value="96000">96,000 Hz (High Resolution)</option>
              </select>
            </div>

            {/* Channels */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-zinc-400">Topology</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setChannels("2")}
                  className={`px-2.5 py-1 rounded text-[10px] border ${
                    channels === "2" ? "bg-white text-black font-bold border-white" : "bg-white/[0.03] text-zinc-400 border-white/[0.06]"
                  }`}
                >
                  Stereo
                </button>
                <button
                  onClick={() => setChannels("1")}
                  className={`px-2.5 py-1 rounded text-[10px] border ${
                    channels === "1" ? "bg-white text-black font-bold border-white" : "bg-white/[0.03] text-zinc-400 border-white/[0.06]"
                  }`}
                >
                  Mono Downmix
                </button>
              </div>
            </div>

            {/* Action */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.06]">
              <button
                onClick={convertAudio}
                disabled={isProcessing || !ready}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow disabled:opacity-30"
              >
                {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Music size={14} />}
                <span>{isProcessing ? `Transcoding (${progress}%)...` : "Start Audio Transcode"}</span>
              </button>
            </div>
          </div>

          {/* Inspection Column */}
          <div className="md:col-span-2 bg-[#09090c] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between min-h-[380px]">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-zinc-300 font-semibold">{file.name}</span>
              <span className="text-zinc-500 tabular-nums">{formatBytes(file.size)}</span>
            </div>

            {downloadUrl ? (
              <div className="p-5 bg-[#0e0e14] border border-emerald-500/30 rounded-xl flex flex-col gap-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 size={18} />
                  <span>Audio Transcoding Complete</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Output Container</span>
                    <span className="text-zinc-200 font-bold uppercase">{format}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Output File Size</span>
                    <span className="text-emerald-400 tabular-nums font-bold">{formatBytes(resultSize)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <audio ref={audioRef} src={downloadUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                  <button
                    onClick={togglePlay}
                    className="flex items-center gap-1.5 px-3 py-2 rounded bg-white/[0.08] text-white hover:bg-white/[0.12] transition-colors"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    <span>{isPlaying ? "Pause Preview" : "Play Preview"}</span>
                  </button>

                  <a
                    href={downloadUrl}
                    download={outputName}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-colors shadow"
                  >
                    <Download size={14} />
                    <span>Download {format.toUpperCase()}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 text-zinc-500 py-10">
                <Disc size={36} className="text-zinc-700" />
                <span>Configure codec parameters and sample rate on the left.</span>
              </div>
            )}

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500">
              <span>libmp3lame / opus / pcm_s16le</span>
              <span>100% In-Memory RAM Buffer</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
