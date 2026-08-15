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
  Cpu,
  Layers,
  Terminal,
  Activity,
  HardDrive,
  FileUp,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { emitLog } from "@/lib/engine/orchestrator";

interface ToolSpec {
  href: string;
  title: string;
  code: string;
  description: string;
  icon: any;
  engine: string;
  formats: string;
  tag: string;
  badgeColor?: string;
}

interface RackCategory {
  title: string;
  code: string;
  summary: string;
  tools: ToolSpec[];
}

const STUDIO_RACKS: RackCategory[] = [
  {
    title: "Forensics, Vectors & OCR",
    code: "01-SEC",
    summary: "Deep binary header inspection, Bézier curve vectorization, and client-side optical character recognition.",
    tools: [
      {
        href: "/metadata",
        title: "Metadata & Stego Scrubber",
        code: "META-01",
        description: "Scrub GPS & hardware identifiers, inspect EXIF markers, and visualize LSB steganography bitplanes.",
        icon: ShieldCheck,
        engine: "In-Memory Header Parser",
        formats: "JPG, PNG, TIFF, MP4, WebP",
        tag: "RAW EXIF",
      },
      {
        href: "/vectorize",
        title: "Raster to SVG Vectorizer",
        code: "VEC-02",
        description: "Convert pixel images, sketches, and scans into infinitely scalable, smooth SVG vector paths.",
        icon: Shapes,
        engine: "Bézier Boundary Tracer",
        formats: "PNG, JPG, BMP, Scans",
        tag: "VECTOR",
      },
      {
        href: "/ocr",
        title: "Neural Document OCR",
        code: "OCR-03",
        description: "Extract text layers, bounding box coordinates, and searchable PDFs directly in browser RAM.",
        icon: ScanText,
        engine: "Tesseract WASM SIMD",
        formats: "PNG, JPG, PDF, TIFF",
        tag: "NEURAL",
      },
    ],
  },
  {
    title: "Spatial Audio & Animated Media",
    code: "02-DSP",
    summary: "Real-time WebAudio Biquad filter matrix, vocal stem phase cancellation, and frame-diffing optimization.",
    tools: [
      {
        href: "/dsp",
        title: "Spatial DSP & Stem Isolator",
        code: "DSP-01",
        description: "Stereo phase cancellation for vocal cut / isolation, 3D binaural panning, and 8-band parametric EQ.",
        icon: Radio,
        engine: "WebAudio Biquad Node Matrix",
        formats: "WAV, MP3, AAC, FLAC, OGG",
        tag: "48kHz DSP",
      },
      {
        href: "/animator",
        title: "Animated WebP/GIF Diff",
        code: "DIFF-02",
        description: "Generate lightweight animations with temporal delta deduplication and 256-color palette dithering.",
        icon: Film,
        engine: "FFmpeg WASM PaletteGen",
        formats: "MP4, WebM, MOV, GIF",
        tag: "DELTA DIFF",
      },
      {
        href: "/audio",
        title: "Audio Stream Converter",
        code: "AUD-03",
        description: "Extract audio streams from video files or transcode between audio formats with custom bitrates.",
        icon: Music,
        engine: "libmp3lame / opus",
        formats: "MP3, WAV, AAC, FLAC, OGG",
        tag: "CODEC",
      },
      {
        href: "/trim",
        title: "Waveform PCM Slicer",
        code: "PCM-04",
        description: "Interactive visual waveform cutting with millisecond precision and lossless client-side PCM export.",
        icon: Scissors,
        engine: "AudioBuffer PCM Slicer",
        formats: "MP3, WAV, AAC, FLAC",
        tag: "PCM 16-BIT",
      },
    ],
  },
  {
    title: "Code, Containers & Document Studio",
    code: "03-IO",
    summary: "AST schema transformations, in-memory archive repacking, video compression, and PDF manipulation.",
    tools: [
      {
        href: "/data-morph",
        title: "Universal Code AST Morph",
        code: "AST-01",
        description: "Bi-directional instant conversion between JSON, YAML, TOML, CSV, XML, and TypeScript interfaces.",
        icon: Binary,
        engine: "AST Parser & Serializer",
        formats: "JSON, YAML, CSV, TS, XML",
        tag: "AST SCHEMA",
      },
      {
        href: "/archive",
        title: "In-Memory Archive Studio",
        code: "ARC-02",
        description: "Inspect nested directory catalogs, extract selective files, and pack in-memory ZIP/TAR archives.",
        icon: Archive,
        engine: "Fflate In-Memory Stream",
        formats: "ZIP, TAR, GZ, ZSTD",
        tag: "STREAM IO",
      },
      {
        href: "/compress",
        title: "H.264 Video Compressor",
        code: "x264-03",
        description: "Reduce video bitrate using H.264 encoding with Constant Rate Factor (CRF) and preset speed tuning.",
        icon: FileDown,
        engine: "FFmpeg WASM (libx264)",
        formats: "MP4, MOV, MKV, WebM",
        tag: "libx264",
      },
      {
        href: "/image",
        title: "Pro Canvas Transcoder",
        code: "IMG-04",
        description: "Batch transcode image formats, adjust compression quality, and apply proportional dimension scaling.",
        icon: ImageIcon,
        engine: "HTML5 Canvas Engine",
        formats: "PNG, JPG, WEBP, BMP",
        tag: "CANVAS",
      },
      {
        href: "/pdf",
        title: "PDF Document Studio",
        code: "PDF-05",
        description: "Split document page ranges, merge multiple PDF files, and reorder document structures locally.",
        icon: FileText,
        engine: "PDF-Lib Core",
        formats: "PDF",
        tag: "PDF-LIB",
      },
      {
        href: "/record",
        title: "Screen & Hardware Capture",
        code: "REC-06",
        description: "Capture application windows, full displays, or webcams with synchronized microphone audio.",
        icon: Video,
        engine: "MediaRecorder API",
        formats: "WebM, MP4 (VP9 / Opus)",
        tag: "DISPLAY",
      },
    ],
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
        { label: "Transcode Bitrate & Sample Rate", href: "/audio", icon: Music },
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
    <div className="flex flex-col w-full gap-8 max-w-6xl mx-auto font-sans pb-16">
      {/* ── Studio Command Header & Telemetry Summary ── */}
      <section className="w-full flex flex-col gap-4 border-b border-white/[0.08] pb-6 pt-2 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              <span className="text-amber-400 font-bold">EXPLOSIVE STUDIO</span>
              <span>//</span>
              <span>WASM SIMD INSTRUMENTATION RACK</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white mt-1">
              Industrial Media & Data Engineering Suite
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new Event("open-system-tour"))}
              className="btn-studio-secondary flex items-center gap-1.5"
            >
              <Cpu size={13} className="text-amber-400" />
              <span>ARCHITECTURE GUIDE</span>
            </button>
            <button
              onClick={() => window.dispatchEvent(new Event("open-feedback-modal"))}
              className="btn-studio-secondary flex items-center gap-1.5"
            >
              <span>FEEDBACK</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Universal Multi-Format Ingest Deck ── */}
      <section className="w-full studio-panel p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <HardDrive size={14} className="text-amber-400" />
            <span className="font-bold text-white uppercase tracking-wider">Universal File Ingest Deck</span>
          </div>
          <span className="text-[10px] text-zinc-500">100% CLIENT-SIDE IN-MEMORY DISPATCH</span>
        </div>

        {!analyzedFile ? (
          <label className="w-full border border-dashed border-white/[0.12] hover:border-amber-400/60 hover:bg-[#11131a] transition-all rounded p-6 sm:p-8 flex flex-col items-center justify-center gap-2.5 cursor-pointer bg-[#0a0b0f] select-none">
            <input type="file" onChange={handleUniversalIngest} className="hidden" />
            <div className="p-2.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
              <FileUp size={20} className="text-amber-400" />
            </div>
            <div className="text-center">
              <span className="font-mono text-xs font-bold text-zinc-200 block uppercase tracking-wider">
                Drop any file to analyze container and route to workstations
              </span>
              <span className="font-mono text-[10px] text-zinc-500 block mt-0.5">
                Video, Audio, Images, Scans, PDFs, JSON/YAML, and Archives supported
              </span>
            </div>
          </label>
        ) : (
          <div className="p-4 bg-[#11131a] border border-white/[0.08] rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-amber-400 text-black font-bold">
                <HardDrive size={18} />
              </div>
              <div>
                <span className="text-white font-bold block">{analyzedFile.name}</span>
                <span className="text-[10px] text-zinc-400">
                  {(analyzedFile.size / 1024).toFixed(1)} KB • {analyzedFile.type || "binary payload"}
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
                    className="btn-studio-accent flex items-center gap-1.5"
                  >
                    <Icon size={12} />
                    <span>{route.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setAnalyzedFile(null)}
                className="px-2.5 py-1 text-[10px] text-zinc-500 hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Studio Racks Grid ── */}
      <div className="w-full flex flex-col gap-8">
        {STUDIO_RACKS.map((rack) => (
          <section key={rack.code} className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                  {rack.code}
                </span>
                <h2 className="font-bold text-white uppercase tracking-wider">{rack.title}</h2>
              </div>
              <span className="text-[10px] text-zinc-500 hidden sm:inline">{rack.summary}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {rack.tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group studio-panel p-4 flex flex-col justify-between gap-4 hover:border-amber-400/50 hover:bg-[#11131a] transition-all"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <div className="p-2 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300 group-hover:text-amber-400 group-hover:bg-amber-400/10 transition-colors">
                          <Icon size={16} />
                        </div>
                        <span className="bg-[#161922] text-zinc-400 px-1.5 py-0.5 rounded border border-white/[0.06] font-bold">
                          {tool.tag}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xs font-mono font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                          <span>{tool.title}</span>
                          <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                        </h3>
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between font-mono text-[9px] text-zinc-500 uppercase">
                      <span>{tool.engine}</span>
                      <span className="text-zinc-400">{tool.formats}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
