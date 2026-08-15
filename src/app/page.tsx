"use client";

import { useState } from "react";
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
  Sparkles,
  Layers,
  HardDrive,
  FileUp,
  Sliders,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { emitLog } from "@/lib/engine/orchestrator";

interface ToolItem {
  href: string;
  title: string;
  description: string;
  icon: any;
  formats: string;
  tag: string;
  highlight?: boolean;
}

const TOOLS_LIST: ToolItem[] = [
  {
    href: "/metadata",
    title: "Metadata & Steganography",
    description: "Deep-scan binary headers for GPS, camera tracking markers, and inspect LSB bitplane steganography.",
    icon: ShieldCheck,
    formats: "JPG, PNG, MP4, WebP",
    tag: "Forensics",
    highlight: true,
  },
  {
    href: "/vectorize",
    title: "Raster to SVG Vectorizer",
    description: "Convert pixel images, logos, and sketches into crisp, infinitely scalable Bézier vector curves.",
    icon: Shapes,
    formats: "PNG, JPG, BMP",
    tag: "Vector",
  },
  {
    href: "/ocr",
    title: "Neural Document OCR",
    description: "Extract clean text layers and bounding coordinates directly in browser RAM with Tesseract WASM.",
    icon: ScanText,
    formats: "PNG, JPG, PDF",
    tag: "Neural",
  },
  {
    href: "/dsp",
    title: "Spatial Audio & Stem Isolator",
    description: "Real-time WebAudio Biquad filter matrix, vocal center phase cancellation, and 3D spatial panning.",
    icon: Radio,
    formats: "WAV, MP3, FLAC, AAC",
    tag: "Spatial DSP",
    highlight: true,
  },
  {
    href: "/animator",
    title: "Animated WebP / GIF Diff",
    description: "Temporal delta deduplication and color palette dithering to produce lightweight animations.",
    icon: Film,
    formats: "MP4, WebM, MOV, GIF",
    tag: "Animation",
  },
  {
    href: "/data-morph",
    title: "Universal Code AST Morph",
    description: "Instant bi-directional schema conversion between JSON, YAML, TOML, CSV, XML, and TypeScript types.",
    icon: Binary,
    formats: "JSON, YAML, CSV, TS",
    tag: "AST Schema",
  },
  {
    href: "/archive",
    title: "In-Memory Archive Studio",
    description: "Inspect multi-level archive directories, extract files selectively, and repack in-memory ZIP/TAR archives.",
    icon: Archive,
    formats: "ZIP, TAR, GZ",
    tag: "Stream IO",
  },
  {
    href: "/compress",
    title: "H.264 Video Compressor",
    description: "CRF quality tuning and speed presets to reduce video file sizes locally with FFmpeg WASM.",
    icon: FileDown,
    formats: "MP4, MOV, WebM, MKV",
    tag: "libx264",
  },
  {
    href: "/audio",
    title: "Audio Stream Converter",
    description: "Transcode bitrates, sample rates (44.1k/48k/96k), and extract raw audio tracks from video files.",
    icon: Music,
    formats: "MP3, WAV, FLAC, AAC",
    tag: "Codec",
  },
  {
    href: "/trim",
    title: "Waveform PCM Slicer",
    description: "Interactive visual waveform slicing with millisecond precision and lossless client PCM export.",
    icon: Scissors,
    formats: "MP3, WAV, AAC",
    tag: "PCM 16-Bit",
  },
  {
    href: "/image",
    title: "Canvas Image Transcoder",
    description: "Batch transcode image formats, adjust compression levels, and resize dimensions with GPU acceleration.",
    icon: ImageIcon,
    formats: "PNG, JPG, WebP, AVIF",
    tag: "Canvas GPU",
  },
  {
    href: "/pdf",
    title: "PDF Document Studio",
    description: "Merge multiple documents, extract specific page ranges, and rotate page orientations in-memory.",
    icon: FileText,
    formats: "PDF",
    tag: "PDF-Lib",
  },
];

export default function Home() {
  const router = useRouter();
  const [analyzedFile, setAnalyzedFile] = useState<File | null>(null);

  const handleUniversalIngest = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAnalyzedFile(f);
    emitLog(`Universal Ingest Probe: [${f.name}] (${(f.size / 1024).toFixed(1)} KB, MIME: ${f.type || "unknown"})`, "info", "ORCHESTRATOR");
  };

  const getSuggestedRoutes = (file: File) => {
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    if (type.startsWith("image/") || name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".webp")) {
      return [
        { label: "Scrub Metadata & EXIF", href: "/metadata", icon: ShieldCheck },
        { label: "Trace to Scalable SVG", href: "/vectorize", icon: Shapes },
        { label: "Extract Neural OCR Text", href: "/ocr", icon: ScanText },
        { label: "Transcode to WebP / PNG", href: "/image", icon: ImageIcon },
      ];
    }
    if (type.startsWith("video/") || name.endsWith(".mp4") || name.endsWith(".mov") || name.endsWith(".webm") || name.endsWith(".mkv")) {
      return [
        { label: "Compress with H.264 CRF", href: "/compress", icon: FileDown },
        { label: "Extract Audio Track", href: "/audio", icon: Music },
        { label: "Convert to Animated WebP/GIF", href: "/animator", icon: Film },
      ];
    }
    if (type.startsWith("audio/") || name.endsWith(".mp3") || name.endsWith(".wav") || name.endsWith(".flac") || name.endsWith(".aac")) {
      return [
        { label: "Spatial DSP & Stem Isolator", href: "/dsp", icon: Radio },
        { label: "Waveform PCM Slicer", href: "/trim", icon: Scissors },
        { label: "Transcode Audio Stream", href: "/audio", icon: Music },
      ];
    }
    if (name.endsWith(".json") || name.endsWith(".yaml") || name.endsWith(".yml") || name.endsWith(".csv") || name.endsWith(".xml")) {
      return [
        { label: "Morph Code AST Schema", href: "/data-morph", icon: Binary },
        { label: "Inspect Archive Payload", href: "/archive", icon: Archive },
      ];
    }
    if (name.endsWith(".pdf")) {
      return [
        { label: "Merge, Split & Rotate PDF", href: "/pdf", icon: FileText },
        { label: "Extract OCR Text Layer", href: "/ocr", icon: ScanText },
      ];
    }
    return [
      { label: "Inspect Container Headers", href: "/metadata", icon: ShieldCheck },
      { label: "Pack into In-Memory Archive", href: "/archive", icon: Archive },
    ];
  };

  return (
    <div className="flex flex-col w-full gap-10 max-w-5xl mx-auto font-sans pb-20">
      {/* ── Hero Section ── */}
      <section className="text-center space-y-3 pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-zinc-300 text-xs font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>WebAssembly SIMD • Zero-Server Local Processing</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          The In-Browser Media & File Engineering Studio
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          High-performance media transcoding, forensic header inspection, vectorization, and document tools running locally on your hardware.
        </p>
      </section>

      {/* ── Universal Dropdeck ── */}
      <section className="w-full">
        {!analyzedFile ? (
          <label className="w-full border border-dashed border-white/[0.12] hover:border-amber-400/50 hover:bg-white/[0.02] transition-all rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center gap-3.5 cursor-pointer bg-[#0c0d13]/80 backdrop-blur-md shadow-xl select-none group">
            <input type="file" onChange={handleUniversalIngest} className="hidden" />
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 group-hover:text-amber-400 group-hover:bg-amber-400/10 transition-colors">
              <FileUp size={24} />
            </div>

            <div className="text-center space-y-1">
              <span className="text-sm font-medium text-white block">
                Drop any file to inspect container and launch workstation
              </span>
              <span className="text-xs text-zinc-500 block">
                Supports Video, Audio, Scans, Images, PDFs, Data schemas, and Archives (up to 2 GB)
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
              {getSuggestedRoutes(analyzedFile).map((route) => {
                const Icon = route.icon;
                return (
                  <button
                    key={route.href}
                    onClick={() => router.push(route.href)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow cursor-pointer"
                  >
                    <Icon size={13} />
                    <span>{route.label}</span>
                  </button>
                );
              })}
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

      {/* ── Studio Tools Matrix ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
            Engineering Workstations ({TOOLS_LIST.length})
          </h2>
          <span className="text-xs text-zinc-500 font-mono">100% In-Memory Execution</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {TOOLS_LIST.map((tool) => {
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
                  <span>Supported Formats:</span>
                  <span className="text-zinc-400">{tool.formats}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
