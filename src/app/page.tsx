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
  HardDrive,
  FileUp,
  Sliders,
  CheckCircle2,
  Lock,
  Layers,
  Cpu,
  Search,
  Settings2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { emitLog } from "@/lib/engine/orchestrator";

interface ToolItem {
  href: string;
  title: string;
  category: "forensics" | "audio" | "code" | "media";
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
    description: "Deep-scan binary headers for GPS coordinates, camera serial numbers, and inspect LSB bitplane steganography.",
    icon: ShieldCheck,
    formats: "JPG, PNG, MP4, WebP",
    tag: "RAW EXIF",
  },
  {
    href: "/vectorize",
    title: "Raster to SVG Vectorizer",
    category: "forensics",
    description: "Convert pixel images, logos, and technical drawings into infinitely scalable Bézier vector curves.",
    icon: Shapes,
    formats: "PNG, JPG, BMP",
    tag: "Vector",
  },
  {
    href: "/ocr",
    title: "Neural Document OCR",
    category: "forensics",
    description: "Extract clean text layers and bounding box coordinates directly in browser RAM with Tesseract WASM.",
    icon: ScanText,
    formats: "PNG, JPG, PDF",
    tag: "Neural",
  },
  {
    href: "/dsp",
    title: "Spatial Audio & Stem DSP",
    category: "audio",
    description: "Real-time WebAudio Biquad filter matrix, vocal center phase cancellation, and 3D binaural panning.",
    icon: Radio,
    formats: "WAV, MP3, FLAC, AAC",
    tag: "48kHz DSP",
  },
  {
    href: "/animator",
    title: "Animated WebP / GIF Diff",
    category: "audio",
    description: "Temporal delta deduplication and 256-color palette dithering to produce ultra-lightweight animations.",
    icon: Film,
    formats: "MP4, WebM, MOV, GIF",
    tag: "Delta Diff",
  },
  {
    href: "/data-morph",
    title: "Universal Code AST Morph",
    category: "code",
    description: "Bi-directional instant schema conversion between JSON, YAML, TOML, CSV, XML, and TypeScript types.",
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
    category: "media",
    description: "CRF quality tuning and speed presets to reduce video file sizes locally with FFmpeg WASM.",
    icon: FileDown,
    formats: "MP4, MOV, WebM, MKV",
    tag: "libx264",
  },
  {
    href: "/audio",
    title: "Audio Stream Converter",
    category: "audio",
    description: "Transcode bitrates, sample rates (44.1k/48k/96k), and extract raw audio tracks from video containers.",
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
    category: "media",
    description: "Batch transcode image formats, adjust compression levels, and resize dimensions with GPU acceleration.",
    icon: ImageIcon,
    formats: "PNG, JPG, WebP, AVIF",
    tag: "Canvas GPU",
  },
  {
    href: "/pdf",
    title: "PDF Document Studio",
    category: "media",
    description: "Merge multiple documents, extract specific page ranges, and rotate page orientations in-memory.",
    icon: FileText,
    formats: "PDF",
    tag: "PDF-Lib",
  },
];

export default function Home() {
  const router = useRouter();
  const [analyzedFile, setAnalyzedFile] = useState<File | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "forensics" | "audio" | "code" | "media">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleUniversalIngest = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAnalyzedFile(f);
    emitLog(`Ingest Probe: [${f.name}] (${(f.size / 1024).toFixed(1)} KB, MIME: ${f.type || "unknown"})`, "info", "ORCHESTRATOR");
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

  const filteredTools = TOOLS_LIST.filter((t) => {
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.formats.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full gap-8 max-w-6xl mx-auto font-sans pb-12">
      {/* ── Workbench Header & Ingest Dock ── */}
      <section className="w-full bg-[#0d0e14] border border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-lg flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
          <div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white font-sans">
              Universal File Ingest & Processing Dock
            </h1>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Drop any media container, audio track, document, or code schema for instant zero-server conversion.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>Client Memory Active</span>
          </div>
        </div>

        {!analyzedFile ? (
          <label className="w-full border border-dashed border-white/[0.1] hover:border-amber-400/50 hover:bg-white/[0.02] transition-all rounded-lg p-6 sm:p-7 flex flex-col items-center justify-center gap-2.5 cursor-pointer bg-[#090a0f] select-none group">
            <input type="file" onChange={handleUniversalIngest} className="hidden" />
            <div className="p-2.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300 group-hover:text-amber-400 transition-colors">
              <FileUp size={20} />
            </div>

            <div className="text-center space-y-0.5">
              <span className="text-xs font-medium text-white block">
                Drag and drop files here, or click to browse
              </span>
              <span className="text-[11px] text-zinc-500 font-mono block">
                Video • Audio • Scans • Images • PDFs • JSON/YAML • Archives (Up to 2 GB)
              </span>
            </div>
          </label>
        ) : (
          <div className="p-4 bg-[#090a0f] border border-white/[0.08] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-amber-400 text-black font-bold">
                <HardDrive size={18} />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">{analyzedFile.name}</span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {(analyzedFile.size / 1024).toFixed(1)} KB • {analyzedFile.type || "Container"}
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow cursor-pointer"
                  >
                    <Icon size={12} />
                    <span>{route.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setAnalyzedFile(null)}
                className="px-2.5 py-1.5 text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                Change File
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Workstations Directory ── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {(
              [
                { id: "all", label: "All Tools (12)" },
                { id: "forensics", label: "Forensics & Vectors" },
                { id: "audio", label: "Audio & DSP" },
                { id: "code", label: "Code & Data" },
                { id: "media", label: "Video & Documents" },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-white/[0.1] text-white font-semibold border border-white/[0.12]"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative shrink-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter workstations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0c0d14] border border-white/[0.08] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60 w-full sm:w-56 font-sans"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group p-4 rounded-lg bg-[#0c0d13] hover:bg-[#11131a] border border-white/[0.06] hover:border-white/[0.16] transition-all flex flex-col justify-between gap-3 shadow-sm hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-300 group-hover:text-amber-400 transition-colors">
                      <Icon size={16} />
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.05] text-zinc-400">
                      {tool.tag}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                      <span>{tool.title}</span>
                      <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                    </h2>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed line-clamp-2 font-sans">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>Formats:</span>
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
