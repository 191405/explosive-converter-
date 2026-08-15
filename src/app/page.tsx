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
  Check,
  Play,
  Pause,
  Layers,
  Cpu,
  Search,
  Settings2,
  Maximize2,
  Type,
  Key,
  Network,
  Activity,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { emitLog } from "@/lib/engine/orchestrator";

export default function Home() {
  const router = useRouter();
  const [analyzedFile, setAnalyzedFile] = useState<File | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "forensics" | "audio" | "code" | "media">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Interactive Tile States ──
  // Audio Tile Interactive Synthesizer
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioFreq, setAudioFreq] = useState(440);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Vectorizer Tile Interactive Threshold
  const [vectorThreshold, setVectorThreshold] = useState(128);

  // Video Compressor Tile Interactive CRF Estimator
  const [crfVal, setCrfVal] = useState(24);

  // AST Morph Tile Interactive Format
  const [astFormat, setAstFormat] = useState<"ts" | "json" | "yaml">("ts");

  // Steganography Tile Bitplane Selector
  const [activeBitplane, setActiveBitplane] = useState<number>(0);

  // Audio synthesis test drive
  const toggleTileAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (audioPlaying) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      if (audioCtxRef.current) audioCtxRef.current.close();
      setAudioPlaying(false);
    } else {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(audioFreq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      setAudioPlaying(true);
    }
  };

  useEffect(() => {
    if (oscRef.current && audioCtxRef.current && audioPlaying) {
      oscRef.current.frequency.setValueAtTime(audioFreq, audioCtxRef.current.currentTime);
    }
  }, [audioFreq, audioPlaying]);

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch {}
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
      }
    };
  }, []);

  const handleUniversalIngest = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAnalyzedFile(f);
    emitLog(`Ingest Container: [${f.name}] (${(f.size / 1024).toFixed(1)} KB)`, "info", "ORCHESTRATOR");
  };

  const getEstimatedSavings = (crf: number) => {
    const origMB = 100;
    const est = Math.round(origMB * (1 - (crf - 18) / 34));
    return Math.max(12, Math.min(95, est));
  };

  return (
    <div className="flex flex-col w-full gap-8 max-w-6xl mx-auto font-sans pb-16">
      {/* ── Top Neumorphic Ingest Well ── */}
      <section className="w-full neu-tile p-6 sm:p-7 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white font-sans">
              Universal Media & Document Ingest
            </h1>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Drag and drop any file to inspect container headers and launch localized transformation tools.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="px-2.5 py-1 rounded-md bg-[#090a0d] border border-white/[0.05] text-zinc-300">
              Zero-Server Memory
            </span>
          </div>
        </div>

        {!analyzedFile ? (
          <label className="w-full neu-inset p-8 sm:p-10 flex flex-col items-center justify-center gap-3 cursor-pointer select-none group transition-all hover:border-zinc-700">
            <input type="file" onChange={handleUniversalIngest} className="hidden" />
            <div className="p-3.5 rounded-xl neu-btn text-zinc-300 group-hover:text-white transition-colors">
              <FileUp size={22} className="text-amber-400" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-sm font-medium text-zinc-200 block">
                Drop files here to load into memory
              </span>
              <span className="text-xs text-zinc-500 font-mono block">
                Audio • Video • Images • Documents • Archives • Data Schemas (Up to 2 GB)
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              {["MP4", "WAV", "PNG", "PDF", "JSON", "ZIP", "SVG"].map((fmt) => (
                <span
                  key={fmt}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#141720] text-zinc-400 border border-white/[0.04]"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </label>
        ) : (
          <div className="p-5 neu-inset rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-lg neu-btn text-amber-400 font-bold">
                <HardDrive size={20} />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">{analyzedFile.name}</span>
                <span className="text-xs text-zinc-400 font-mono">
                  {(analyzedFile.size / 1024).toFixed(1)} KB • {analyzedFile.type || "Container Stream"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => router.push("/metadata")}
                className="neu-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <span>Process File</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => setAnalyzedFile(null)}
                className="neu-btn px-3 py-2 text-xs text-zinc-400 hover:text-white"
              >
                Change
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Category Filter Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {(
            [
              { id: "all", label: "All Workstations (17)" },
              { id: "forensics", label: "Forensics & Security" },
              { id: "audio", label: "Audio & Captions" },
              { id: "code", label: "Code & Diagrams" },
              { id: "media", label: "Video, Fonts & Docs" },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`neu-btn px-3.5 py-1.5 text-xs font-sans whitespace-nowrap ${
                activeCategory === cat.id ? "active text-white border-amber-400/40" : "text-zinc-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative shrink-0">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search workstations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neu-inset pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none w-full sm:w-60 font-sans"
          />
        </div>
      </div>

      {/* ── Neumorphic Interactive Tiles Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* ── Tile 1: Spatial Audio & DSP (Interactive Synthesizer) ── */}
        {(activeCategory === "all" || activeCategory === "audio") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-amber-400">
                  <Radio size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  48kHz DSP
                </span>
              </div>

              <div>
                <Link href="/dsp" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Spatial Audio & Stem DSP</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Phase cancellation for center vocal cut, 3D binaural spatial panning, and parametric EQ.
                </p>
              </div>

              {/* Interactive Audio Widget */}
              <div className="neu-inset p-3 rounded-xl flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Tone Generator</span>
                  <span className="text-amber-400 tabular-nums">{audioFreq} Hz</span>
                </div>

                <input
                  type="range"
                  min="100"
                  max="1200"
                  value={audioFreq}
                  onChange={(e) => setAudioFreq(Number(e.target.value))}
                  className="neu-slider w-full"
                />

                <button
                  onClick={toggleTileAudio}
                  className={`neu-btn py-1.5 px-3 text-xs font-mono flex items-center justify-center gap-1.5 ${
                    audioPlaying ? "active text-amber-400" : "text-zinc-300"
                  }`}
                >
                  {audioPlaying ? <Pause size={12} /> : <Play size={12} />}
                  <span>{audioPlaying ? "Mute Tone" : "Play Tone"}</span>
                </button>
              </div>
            </div>

            <Link href="/dsp" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Audio DSP Studio
            </Link>
          </div>
        )}

        {/* ── Tile 2: Raster to SVG Vectorizer (Interactive Threshold) ── */}
        {(activeCategory === "all" || activeCategory === "forensics") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <Shapes size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  Bézier Vector
                </span>
              </div>

              <div>
                <Link href="/vectorize" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Raster to SVG Vectorizer</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Convert pixel graphics, sketches, and logos into infinitely scalable Bézier vector curves.
                </p>
              </div>

              {/* Interactive Vector Curve Geometry Widget */}
              <div className="neu-inset p-3 rounded-xl flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Cutoff Threshold</span>
                  <span className="text-white tabular-nums">{vectorThreshold}</span>
                </div>

                <input
                  type="range"
                  min="30"
                  max="220"
                  value={vectorThreshold}
                  onChange={(e) => setVectorThreshold(Number(e.target.value))}
                  className="neu-slider w-full"
                />

                <div className="h-12 bg-black/40 rounded-lg flex items-center justify-center border border-white/[0.04]">
                  <svg width="140" height="36" viewBox="0 0 140 36">
                    <path
                      d={`M 10 25 Q ${vectorThreshold / 2} ${5 + (255 - vectorThreshold) / 10} ${vectorThreshold} 25 T 130 25`}
                      fill="none"
                      stroke="#e69d28"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <Link href="/vectorize" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Vectorizer Studio
            </Link>
          </div>
        )}

        {/* ── Tile 3: Video Compressor (Interactive CRF Estimator) ── */}
        {(activeCategory === "all" || activeCategory === "media") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <FileDown size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  libx264
                </span>
              </div>

              <div>
                <Link href="/compress" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>H.264 Video Compressor</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Reduce video file sizes with Constant Rate Factor (CRF) and hardware encoder speed presets.
                </p>
              </div>

              {/* Interactive CRF Slider */}
              <div className="neu-inset p-3 rounded-xl flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">CRF Level</span>
                  <span className="text-white font-bold tabular-nums">{crfVal}</span>
                </div>

                <input
                  type="range"
                  min="18"
                  max="40"
                  value={crfVal}
                  onChange={(e) => setCrfVal(Number(e.target.value))}
                  className="neu-slider w-full"
                />

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1">
                  <span>100 MB Input File</span>
                  <span className="text-amber-400 font-bold">~{getEstimatedSavings(crfVal)} MB Output</span>
                </div>
              </div>
            </div>

            <Link href="/compress" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Compressor Studio
            </Link>
          </div>
        )}

        {/* ── Tile 4: Code & Data AST Morph (Interactive Format Switcher) ── */}
        {(activeCategory === "all" || activeCategory === "code") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <Binary size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  AST Engine
                </span>
              </div>

              <div>
                <Link href="/data-morph" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Universal Code AST Morph</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Transpile between JSON, YAML, TOML, CSV, XML, and TypeScript Interfaces in browser RAM.
                </p>
              </div>

              {/* Interactive AST Schema Preview */}
              <div className="neu-inset p-3 rounded-xl flex flex-col gap-2">
                <div className="flex gap-1.5 font-mono text-[10px]">
                  {(["ts", "json", "yaml"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setAstFormat(fmt)}
                      className={`neu-btn flex-1 py-1 uppercase ${astFormat === fmt ? "active text-amber-400" : "text-zinc-400"}`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>

                <div className="bg-black/50 p-2.5 rounded text-[10px] font-mono text-zinc-300 h-14 overflow-hidden">
                  {astFormat === "ts" && <code>interface StreamConfig &#123; fps: 60; audio: true; &#125;</code>}
                  {astFormat === "json" && <code>&#123; &quot;fps&quot;: 60, &quot;audio&quot;: true &#125;</code>}
                  {astFormat === "yaml" && <code>fps: 60<br/>audio: true</code>}
                </div>
              </div>
            </div>

            <Link href="/data-morph" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch AST Schema Studio
            </Link>
          </div>
        )}

        {/* ── Tile 5: Metadata & Steganography ── */}
        {(activeCategory === "all" || activeCategory === "forensics") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  RAW EXIF
                </span>
              </div>

              <div>
                <Link href="/metadata" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Metadata & Steganography</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Deep-scan GPS and tracking markers, and inspect least-significant-bit steganography bitplanes.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl flex items-center justify-between font-mono text-[11px]">
                <span className="text-zinc-400">Bitplane Slicer</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((b) => (
                    <button
                      key={b}
                      onClick={() => setActiveBitplane(b)}
                      className={`neu-btn px-2 py-0.5 text-[10px] ${activeBitplane === b ? "active text-amber-400 font-bold" : "text-zinc-400"}`}
                    >
                      b{b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/metadata" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Forensic Inspector
            </Link>
          </div>
        )}

        {/* ── Tile 6: Neural Document OCR ── */}
        {(activeCategory === "all" || activeCategory === "forensics") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <ScanText size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  Tesseract
                </span>
              </div>

              <div>
                <Link href="/ocr" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Neural Document OCR</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Extract plain text layers and bounding coordinates locally in browser RAM with Tesseract WASM.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Multi-Language Model:</span>
                <span className="text-zinc-200 font-semibold">ENG / SPA / FRA / DEU</span>
              </div>
            </div>

            <Link href="/ocr" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch OCR Workstation
            </Link>
          </div>
        )}

        {/* ── Tile 7: PDF Document Studio ── */}
        {(activeCategory === "all" || activeCategory === "media") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <FileText size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  PDF-Lib
                </span>
              </div>

              <div>
                <Link href="/pdf" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>PDF Document Studio</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Merge multiple documents, extract specific page ranges, and rotate page orientations.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Modes:</span>
                <span className="text-zinc-200 font-semibold">Merge • Split • Rotate</span>
              </div>
            </div>

            <Link href="/pdf" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch PDF Studio
            </Link>
          </div>
        )}

        {/* ── Tile 8: In-Memory Archive Studio ── */}
        {(activeCategory === "all" || activeCategory === "code") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <Archive size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  Stream IO
                </span>
              </div>

              <div>
                <Link href="/archive" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>In-Memory Archive Studio</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Inspect multi-level archive directories, extract files selectively, and repack ZIP/TAR archives.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Supported:</span>
                <span className="text-zinc-200 font-semibold">ZIP • TAR • GZ • ZSTD</span>
              </div>
            </div>

            <Link href="/archive" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Archive Studio
            </Link>
          </div>
        )}

        {/* ── Tile 9: Audio Stream Converter ── */}
        {(activeCategory === "all" || activeCategory === "audio") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <Music size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  Codec
                </span>
              </div>

              <div>
                <Link href="/audio" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Audio Stream Converter</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Transcode bitrates, sample rates (44.1k/48k/96k), and extract raw audio tracks from video files.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Bitrates:</span>
                <span className="text-zinc-200 font-semibold">128k • 192k • 256k • 320k</span>
              </div>
            </div>

            <Link href="/audio" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Audio Converter
            </Link>
          </div>
        )}

        {/* ── Tile 10: Waveform PCM Slicer ── */}
        {(activeCategory === "all" || activeCategory === "audio") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <Scissors size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  PCM 16-Bit
                </span>
              </div>

              <div>
                <Link href="/trim" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Waveform PCM Slicer</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Interactive visual waveform slicing with millisecond range selection and lossless export.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Range Precision:</span>
                <span className="text-zinc-200 font-semibold">0.01 ms Accuracy</span>
              </div>
            </div>

            <Link href="/trim" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Audio Slicer
            </Link>
          </div>
        )}

        {/* ── Tile 11: Canvas Image Transcoder ── */}
        {(activeCategory === "all" || activeCategory === "media") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <ImageIcon size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  Canvas GPU
                </span>
              </div>

              <div>
                <Link href="/image" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Canvas Image Transcoder</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Batch transcode image formats, adjust compression levels, and resize dimensions with GPU acceleration.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Targets:</span>
                <span className="text-zinc-200 font-semibold">WebP • PNG • AVIF • JPEG</span>
              </div>
            </div>

            <Link href="/image" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Image Transcoder
            </Link>
          </div>
        )}

        {/* ── Tile 12: Animated WebP & GIF Diff ── */}
        {(activeCategory === "all" || activeCategory === "media") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <Film size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  Delta Diff
                </span>
              </div>

              <div>
                <Link href="/animator" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Animated WebP / GIF Diff</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Temporal delta deduplication and color palette dithering to produce lightweight animations.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Sampling:</span>
                <span className="text-zinc-200 font-semibold">10 FPS - 30 FPS Dithered</span>
              </div>
            </div>

            <Link href="/animator" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Animation Studio
            </Link>
          </div>
        )}

        {/* ── Tile 13: Binary Hex & Shannon Entropy Inspector ── */}
        {(activeCategory === "all" || activeCategory === "forensics") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-amber-400">
                  <Binary size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  Entropy SIMD
                </span>
              </div>

              <div>
                <Link href="/hex-diff" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Binary Hex & Entropy Inspector</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  In-memory hex viewer, Shannon entropy distribution curve (detects hidden encrypted/packed payloads), and binary diffing.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Analysis:</span>
                <span className="text-amber-300 font-semibold">0.0 – 8.0 H(X) • SHA-256</span>
              </div>
            </div>

            <Link href="/hex-diff" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Hex & Entropy Studio
            </Link>
          </div>
        )}

        {/* ── Tile 14: Font Subsetter & WOFF2 Studio ── */}
        {(activeCategory === "all" || activeCategory === "media") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-amber-400">
                  <Type size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  OpenType.js
                </span>
              </div>

              <div>
                <Link href="/font-lab" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Font Subsetter & Glyph Studio</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Extract vector Bézier glyph curves to SVG and strip unused characters to slash font payloads by up to 90%.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Engines:</span>
                <span className="text-zinc-200 font-semibold">TTF • OTF • WOFF2 • SVG</span>
              </div>
            </div>

            <Link href="/font-lab" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Font Studio
            </Link>
          </div>
        )}

        {/* ── Tile 15: Subtitle & Caption Synchronizer ── */}
        {(activeCategory === "all" || activeCategory === "audio") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <Clock size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  SMPTE Timecode
                </span>
              </div>

              <div>
                <Link href="/subtitles" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Subtitle & Caption Synchronizer</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Millisecond time-shifting, framerate conversion (23.976 $\leftrightarrow$ 60 fps), reading speed CPS checks, and SRT/VTT/ASS export.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Formats:</span>
                <span className="text-zinc-200 font-semibold">SRT • WebVTT • ASS • TXT</span>
              </div>
            </div>

            <Link href="/subtitles" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Caption Studio
            </Link>
          </div>
        )}

        {/* ── Tile 16: Cryptographic Key & JWK Studio ── */}
        {(activeCategory === "all" || activeCategory === "forensics" || activeCategory === "code") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-amber-400">
                  <Key size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  WebCrypto
                </span>
              </div>

              <div>
                <Link href="/crypto-vault" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Cryptographic Key & JWK Studio</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  In-memory X.509 certificate inspector, PEM $\leftrightarrow$ DER $\leftrightarrow$ JWK transcoder, and ECDSA/RSA keypair generator.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Security:</span>
                <span className="text-emerald-400 font-semibold">100% In-Memory SubtleCrypto</span>
              </div>
            </div>

            <Link href="/crypto-vault" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Crypto Vault
            </Link>
          </div>
        )}

        {/* ── Tile 17: Architecture Diagram & Vector Engine ── */}
        {(activeCategory === "all" || activeCategory === "code") && (
          <div className="neu-tile p-5 flex flex-col justify-between gap-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl neu-btn text-zinc-300">
                  <Network size={18} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                  Mermaid Core
                </span>
              </div>

              <div>
                <Link href="/diagram-mesh" className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>Architecture Diagram & Vector Engine</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                </Link>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  In-browser code-to-vector compiler. Convert Mermaid syntax to high-DPI PNGs, vector SVGs, and standalone HTML packages.
                </p>
              </div>

              <div className="neu-inset p-3 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Output:</span>
                <span className="text-zinc-200 font-semibold">SVG • PNG 2x • HTML Bundle</span>
              </div>
            </div>

            <Link href="/diagram-mesh" className="neu-btn text-center py-2 text-xs font-medium text-zinc-300 hover:text-white">
              Launch Diagram Studio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
