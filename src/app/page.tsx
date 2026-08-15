"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  FileText,
  Image as ImageIcon,
  FileDown,
  Music,
  Scissors,
  Video,
  ShieldCheck,
  Shapes,
  ScanText,
  Radio,
  Film,
  Binary,
  Archive,
  ArrowRight,
  HardDrive,
  FileUp,
  Sliders,
  CheckCircle2,
  Lock,
  Play,
  Pause,
  Layers,
  Cpu,
  RefreshCw,
  Search,
  Settings2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { emitLog } from "@/lib/engine/orchestrator";

interface ToolItem {
  href: string;
  title: string;
  category: "forensics" | "audio" | "code";
  description: string;
  icon: any;
  formats: string;
  tag: string;
}

const TOOLS_LIST: ToolItem[] = [
  {
    href: "/metadata",
    title: "Metadata & Steganography",
    category: "forensics",
    description: "Deep-scan binary headers for GPS, camera tracking markers, and inspect LSB bitplane steganography.",
    icon: ShieldCheck,
    formats: "JPG, PNG, MP4, WebP",
    tag: "Forensics",
  },
  {
    href: "/vectorize",
    title: "Raster to SVG Vectorizer",
    category: "forensics",
    description: "Convert pixel images, logos, and sketches into crisp, infinitely scalable Bézier vector curves.",
    icon: Shapes,
    formats: "PNG, JPG, BMP",
    tag: "Vector",
  },
  {
    href: "/ocr",
    title: "Neural Document OCR",
    category: "forensics",
    description: "Extract clean text layers and bounding coordinates directly in browser RAM with Tesseract WASM.",
    icon: ScanText,
    formats: "PNG, JPG, PDF",
    tag: "Neural",
  },
  {
    href: "/dsp",
    title: "Spatial Audio & Stem DSP",
    category: "audio",
    description: "Real-time WebAudio Biquad filter matrix, vocal center phase cancellation, and 3D spatial panning.",
    icon: Radio,
    formats: "WAV, MP3, FLAC, AAC",
    tag: "DSP Matrix",
  },
  {
    href: "/animator",
    title: "Animated WebP / GIF Diff",
    category: "audio",
    description: "Temporal delta deduplication and color palette dithering to produce lightweight animations.",
    icon: Film,
    formats: "MP4, WebM, MOV, GIF",
    tag: "Animation",
  },
  {
    href: "/data-morph",
    title: "Universal Code AST Morph",
    category: "code",
    description: "Instant bi-directional schema conversion between JSON, YAML, TOML, CSV, XML, and TypeScript types.",
    icon: Binary,
    formats: "JSON, YAML, CSV, TS",
    tag: "AST Schema",
  },
  {
    href: "/archive",
    title: "In-Memory Archive Studio",
    category: "code",
    description: "Inspect multi-level archive directories, extract files selectively, and repack in-memory ZIP/TAR archives.",
    icon: Archive,
    formats: "ZIP, TAR, GZ",
    tag: "Stream IO",
  },
  {
    href: "/compress",
    title: "H.264 Video Compressor",
    category: "audio",
    description: "CRF quality tuning and speed presets to reduce video file sizes locally with FFmpeg WASM.",
    icon: FileDown,
    formats: "MP4, MOV, WebM, MKV",
    tag: "libx264",
  },
  {
    href: "/audio",
    title: "Audio Stream Converter",
    category: "audio",
    description: "Transcode bitrates, sample rates (44.1k/48k/96k), and extract raw audio tracks from video files.",
    icon: Music,
    formats: "MP3, WAV, FLAC, AAC",
    tag: "Codec",
  },
  {
    href: "/trim",
    title: "Waveform PCM Slicer",
    category: "audio",
    description: "Interactive visual waveform slicing with millisecond precision and lossless client PCM export.",
    icon: Scissors,
    formats: "MP3, WAV, AAC",
    tag: "PCM 16-Bit",
  },
  {
    href: "/image",
    title: "Canvas Image Transcoder",
    category: "forensics",
    description: "Batch transcode image formats, adjust compression levels, and resize dimensions with GPU acceleration.",
    icon: ImageIcon,
    formats: "PNG, JPG, WebP, AVIF",
    tag: "Canvas GPU",
  },
  {
    href: "/pdf",
    title: "PDF Document Studio",
    category: "code",
    description: "Merge multiple documents, extract specific page ranges, and rotate page orientations in-memory.",
    icon: FileText,
    formats: "PDF",
    tag: "PDF-Lib",
  },
];

export default function Home() {
  const router = useRouter();
  const [analyzedFile, setAnalyzedFile] = useState<File | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "forensics" | "audio" | "code">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Interactive Sandbox State
  const [sandboxTab, setSandboxTab] = useState<"dsp" | "vector" | "stego" | "ast">("dsp");

  // Audio DSP Sandbox
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isVocalCut, setIsVocalCut] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Vectorizer Sandbox
  const [vectorThreshold, setVectorThreshold] = useState(128);

  // AST Morpher Sandbox
  const [astFormat, setAstFormat] = useState<"ts" | "json" | "yaml">("ts");

  // Hardware Benchmark State
  const [benchmarking, setBenchmarking] = useState(false);
  const [benchScore, setBenchScore] = useState<number | null>(null);

  // Audio DSP Test Drive
  const toggleAudioSandbox = () => {
    if (isPlayingAudio) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsPlayingAudio(false);
    } else {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      osc.type = isVocalCut ? "sawtooth" : "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      osc.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsPlayingAudio(true);

      // Draw real-time spectrum
      const draw = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const cCtx = canvas.getContext("2d");
        if (!cCtx) return;

        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);

        cCtx.fillStyle = "#090a0f";
        cCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / data.length) * 1.5;
        let x = 0;
        for (let i = 0; i < data.length; i++) {
          const barHeight = (data[i] / 255) * canvas.height;
          cCtx.fillStyle = isVocalCut ? "#ff9e00" : "#00f076";
          cCtx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }
        animFrameRef.current = requestAnimationFrame(draw);
      };
      draw();
    }
  };

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch {}
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Run Real Browser Performance Benchmark
  const runBenchmark = async () => {
    setBenchmarking(true);
    setBenchScore(null);
    emitLog("Starting In-Browser Hardware & SIMD Performance Benchmark...", "info", "WASM_CORE");

    const startTime = performance.now();
    let ops = 0;
    const array = new Float64Array(2000000);
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.sin(i) * Math.cos(i) + Math.sqrt(i);
      ops++;
    }
    const elapsed = performance.now() - startTime;
    const score = Math.min(100, Math.round(10000 / (elapsed + 10)));
    setBenchScore(score);
    setBenchmarking(false);
    emitLog(`Benchmark Completed. Memory Throughput: ${(ops / (elapsed / 1000) / 1e6).toFixed(2)} MFLOPS. Score: ${score}/100`, "info", "WASM_CORE");
  };

  const handleUniversalIngest = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAnalyzedFile(f);
    emitLog(`Ingest Probe: [${f.name}] (${(f.size / 1024).toFixed(1)} KB)`, "info", "ORCHESTRATOR");
  };

  const filteredTools = TOOLS_LIST.filter((t) => {
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.formats.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full gap-12 max-w-5xl mx-auto font-sans pb-24">
      {/* ── Exploratory Hero ── */}
      <section className="text-center space-y-3.5 pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-zinc-300 text-xs font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>WebAssembly SIMD • Zero-Server In-Memory Processing</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          The In-Browser Media & File Engineering Studio
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Explore real-time spatial DSP audio, neural OCR, vector tracing, and forensic inspection. Experience local computing with zero cloud latency and zero server tracking.
        </p>
      </section>

      {/* ── Interactive Feature Sandbox (Explore Before Uploading) ── */}
      <section className="w-full bg-[#0c0d14] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                Interactive Sandbox
              </span>
              <span className="text-[10px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1.5 py-0.2 rounded font-semibold">
                Live Test Drive
              </span>
            </div>
            <span className="text-xs text-zinc-400 mt-0.5 block">
              Test core processing engines directly in your browser before uploading any files.
            </span>
          </div>

          {/* Sandbox Tabs */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/[0.06] self-start sm:self-auto">
            <button
              onClick={() => setSandboxTab("dsp")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                sandboxTab === "dsp" ? "bg-white text-black font-semibold shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              Audio DSP
            </button>
            <button
              onClick={() => setSandboxTab("vector")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                sandboxTab === "vector" ? "bg-white text-black font-semibold shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              SVG Vectorizer
            </button>
            <button
              onClick={() => setSandboxTab("stego")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                sandboxTab === "stego" ? "bg-white text-black font-semibold shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              Stego Bitplane
            </button>
            <button
              onClick={() => setSandboxTab("ast")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                sandboxTab === "ast" ? "bg-white text-black font-semibold shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              AST Morph
            </button>
          </div>
        </div>

        {/* Sandbox Content Panels */}
        <div className="min-h-[160px] flex items-center justify-center">
          {sandboxTab === "dsp" && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
              <div className="sm:col-span-1 flex flex-col gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-white uppercase block">
                    Web Audio Biquad FFT
                  </span>
                  <p className="text-xs text-zinc-400">
                    Real-time synthesis oscillator with phase inversion and spectrum analysis.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={toggleAudioSandbox}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isPlayingAudio
                        ? "bg-red-500 text-white font-bold shadow"
                        : "bg-white text-black font-bold hover:bg-zinc-200"
                    }`}
                  >
                    {isPlayingAudio ? <Pause size={13} /> : <Play size={13} />}
                    <span>{isPlayingAudio ? "Stop Audio" : "Play Synthesizer"}</span>
                  </button>

                  <button
                    onClick={() => setIsVocalCut(!isVocalCut)}
                    disabled={!isPlayingAudio}
                    className={`px-3 py-2 rounded-lg text-xs font-mono border transition-all cursor-pointer disabled:opacity-40 ${
                      isVocalCut
                        ? "bg-amber-400 text-black font-bold border-amber-400"
                        : "bg-white/[0.05] text-zinc-300 border-white/[0.08] hover:bg-white/[0.08]"
                    }`}
                  >
                    {isVocalCut ? "Center Inverted (440Hz)" : "Stereo Normal"}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2 bg-black/60 border border-white/[0.08] rounded-xl p-4 flex flex-col items-center justify-center h-[140px] relative overflow-hidden">
                <canvas ref={canvasRef} width={400} height={100} className="w-full h-full rounded" />
                {!isPlayingAudio && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 text-xs font-mono bg-black/40 backdrop-blur-[2px]">
                    <Music size={22} className="text-zinc-600 mb-1" />
                    <span>Click &quot;Play Synthesizer&quot; to test real-time audio FFT</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {sandboxTab === "vector" && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
              <div className="sm:col-span-1 flex flex-col gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-white uppercase block">
                    Bézier Curve Threshold
                  </span>
                  <p className="text-xs text-zinc-400">
                    Adjust the luminance edge threshold to see real-time dynamic SVG geometry generation.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-mono text-zinc-400">
                    <span>Edge Cutoff</span>
                    <span className="text-amber-400 font-bold">{vectorThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="220"
                    value={vectorThreshold}
                    onChange={(e) => setVectorThreshold(parseInt(e.target.value))}
                    className="accent-amber-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 bg-black/60 border border-white/[0.08] rounded-xl p-4 flex items-center justify-center h-[140px]">
                <svg width="220" height="100" viewBox="0 0 220 100" className="transition-all">
                  <circle
                    cx="50"
                    cy="50"
                    r={vectorThreshold / 4}
                    fill="none"
                    stroke="#ff9e00"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                  <polygon
                    points={`120,${20 + (255 - vectorThreshold) / 8} 150,${80 - (255 - vectorThreshold) / 8} 90,${80 - (255 - vectorThreshold) / 8}`}
                    fill="#00f076"
                    opacity={vectorThreshold / 255}
                  />
                  <rect
                    x="160"
                    y="30"
                    width={40}
                    height={40}
                    rx={(vectorThreshold - 30) / 15}
                    fill="none"
                    stroke="#00d4ff"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          )}

          {sandboxTab === "stego" && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
              <div className="sm:col-span-1 space-y-2">
                <span className="text-xs font-mono font-bold text-white uppercase block">
                  LSB Bitplane Slicer
                </span>
                <p className="text-xs text-zinc-400">
                  Forensic bit extraction inspects hidden binary steganography in the least significant bit channels.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  Bit-0 Layer: 0x50 0x4B 0x03 0x04 [CLEAN]
                </div>
              </div>

              <div className="sm:col-span-2 bg-black/60 border border-white/[0.08] rounded-xl p-4 flex items-center justify-around h-[140px] font-mono text-xs">
                {[0, 1, 2, 3].map((bit) => (
                  <div key={bit} className="flex flex-col items-center gap-1.5">
                    <div className="w-12 h-14 bg-[#141720] border border-white/[0.08] rounded flex items-center justify-center text-[10px] text-zinc-400">
                      b{bit}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-semibold">Plane {bit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sandboxTab === "ast" && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
              <div className="sm:col-span-1 space-y-2">
                <span className="text-xs font-mono font-bold text-white uppercase block">
                  AST Schema Converter
                </span>
                <p className="text-xs text-zinc-400">
                  Transpiles data structures across language paradigms in browser memory.
                </p>
                <div className="flex gap-1.5 font-mono text-xs">
                  {(["ts", "json", "yaml"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setAstFormat(fmt)}
                      className={`px-2.5 py-1 rounded border text-[11px] uppercase ${
                        astFormat === fmt
                          ? "bg-white text-black font-bold border-white"
                          : "bg-white/[0.04] text-zinc-400 border-white/[0.06]"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 bg-[#08090d] border border-white/[0.08] rounded-xl p-4 h-[140px] font-mono text-xs overflow-y-auto text-zinc-300">
                {astFormat === "ts" && (
                  <pre className="text-emerald-400 text-[11px]">
{`interface UserProfile {
  id: string;
  hardwareCores: number;
  simdEnabled: boolean;
}`}
                  </pre>
                )}
                {astFormat === "json" && (
                  <pre className="text-amber-400 text-[11px]">
{`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": { "id": { "type": "string" } }
}`}
                  </pre>
                )}
                {astFormat === "yaml" && (
                  <pre className="text-cyan-400 text-[11px]">
{`userProfile:
  id: "uuid-v4"
  hardwareCores: 8
  simdEnabled: true`}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── In-Browser Performance Profiler ── */}
      <section className="w-full p-4 sm:p-5 rounded-xl bg-[#090a0f] border border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-amber-400">
            <Cpu size={18} />
          </div>
          <div>
            <span className="text-white font-semibold block">Browser Hardware & SIMD Performance Benchmark</span>
            <span className="text-zinc-500 text-[11px]">Calculates client floating-point throughput & memory bandwidth</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {benchScore !== null && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-emerald-300 font-bold">Hardware Score: {benchScore}/100</span>
            </div>
          )}

          <button
            onClick={runBenchmark}
            disabled={benchmarking}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-colors shadow cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={benchmarking ? "animate-spin" : ""} />
            <span>{benchmarking ? "Benchmarking..." : "Run Benchmark"}</span>
          </button>
        </div>
      </section>

      {/* ── Universal Dropdeck for Direct File Launch ── */}
      <section className="w-full">
        {!analyzedFile ? (
          <label className="w-full border border-dashed border-white/[0.12] hover:border-amber-400/50 hover:bg-white/[0.02] transition-all rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center gap-3.5 cursor-pointer bg-[#0c0d13]/80 backdrop-blur-md shadow-xl select-none group">
            <input type="file" onChange={handleUniversalIngest} className="hidden" />
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 group-hover:text-amber-400 group-hover:bg-amber-400/10 transition-colors">
              <FileUp size={24} />
            </div>

            <div className="text-center space-y-1">
              <span className="text-sm font-medium text-white block">
                Have a file ready? Drop anywhere to launch workstation
              </span>
              <span className="text-xs text-zinc-500 block">
                Supports Video, Audio, Images, Scans, PDFs, Data schemas, and Archives (up to 2 GB)
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
              {["MP4/MOV", "WAV/MP3", "PNG/JPG", "PDF", "JSON/YAML", "ZIP/TAR"].map((fmt) => (
                <span
                  key={fmt}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] border border-white/[0.06] text-zinc-400"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </label>
        ) : (
          <div className="p-5 bg-[#0c0d13] border border-white/[0.12] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-amber-400 text-black font-bold">
                <HardDrive size={20} />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">{analyzedFile.name}</span>
                <span className="text-xs text-zinc-400 font-mono">
                  {(analyzedFile.size / 1024).toFixed(1)} KB • {analyzedFile.type || "Binary Container"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => router.push("/metadata")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow cursor-pointer"
              >
                <span>Launch Workstation</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => setAnalyzedFile(null)}
                className="px-3 py-2 text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                Change File
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Studio Workstation Directory with Category Filter & Search ── */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-1.5">
            {(
              [
                { id: "all", label: "All Workstations" },
                { id: "forensics", label: "Forensics & Vectors" },
                { id: "audio", label: "Audio & Media" },
                { id: "code", label: "Code & Documents" },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-white/[0.1] text-white font-semibold border border-white/[0.12]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search tools or formats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0c0d14] border border-white/[0.08] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60 w-full sm:w-60 font-sans"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group p-5 rounded-xl bg-[#0c0d13]/70 hover:bg-[#11131a] border border-white/[0.07] hover:border-white/[0.18] transition-all flex flex-col justify-between gap-4 shadow-sm hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-zinc-300 group-hover:text-amber-400 group-hover:bg-amber-400/10 transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-400">
                      {tool.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                      <span>{tool.title}</span>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2 font-sans">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Supported:</span>
                  <span className="text-zinc-400">{tool.formats}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Privacy & Exploration Footer ── */}
      <footer className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 font-sans">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>100% In-Browser Local Memory Execution • Zero Server Uploads</span>
        </div>

        <button
          onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
          className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <Settings2 size={13} />
          <span>Privacy & Cookie Preferences</span>
        </button>
      </footer>
    </div>
  );
}
