"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Radio,
  Music,
  Scissors,
  Clock,
  Shapes,
  Binary,
  ScanText,
  FileDown,
  Image as ImageIcon,
  Film,
  Video,
  Type,
  FileText,
  Key,
  Network,
  Archive,
  ArrowRight,
  Search,
  Cpu,
  Lock,
  Zap,
  HardDrive,
  Sparkles,
  Sliders,
  CheckCircle2,
  Terminal,
} from "lucide-react";

interface WorkstationItem {
  id: string;
  href: string;
  title: string;
  category: "forensics" | "audio" | "code" | "media" | "documents";
  categoryLabel: string;
  techSpec: string;
  description: string;
  features: string[];
  icon: any;
  accent: string;
}

const WORKSTATIONS: WorkstationItem[] = [
  // ── Forensics & Security ──
  {
    id: "hex-diff",
    href: "/hex-diff",
    title: "Binary Hex & Entropy Inspector",
    category: "forensics",
    categoryLabel: "Forensics & Security",
    techSpec: "Shannon Entropy • SIMD",
    description: "In-memory binary hex disassembler, byte entropy distribution heatmap, ASCII string extractor, and live binary diffing.",
    features: ["Shannon H(X) Curve", "Virtual Hex Grid", "Printable ASCII Dump", "Side-by-Side Diff"],
    icon: Binary,
    accent: "text-amber-400",
  },
  {
    id: "metadata",
    href: "/metadata",
    title: "Forensic Metadata & LSB Steganography",
    category: "forensics",
    categoryLabel: "Forensics & Security",
    techSpec: "EXIF 2.32 • LSB Bitplane",
    description: "Deep-scan binary containers for GPS, camera serials, and tracking tags. Inspect least-significant bitplanes and sanitize in 1 click.",
    features: ["GPS & Serial Wiper", "LSB Bitplane 0 Analyzer", "EXIF/XMP/IPTC Parser", "Zero File Alteration"],
    icon: ShieldCheck,
    accent: "text-amber-400",
  },
  {
    id: "vectorize",
    href: "/vectorize",
    title: "Raster to Scalable SVG Vectorizer",
    category: "forensics",
    categoryLabel: "Forensics & Security",
    techSpec: "Bézier Curve Engine",
    description: "Converts pixel bitmap logos, sketches, and icons into mathematically clean, infinite-resolution vector SVGs.",
    features: ["Dynamic Thresholding", "Path Smoothing Control", "Monochrome & Invert", "Direct SVG Export"],
    icon: Shapes,
    accent: "text-zinc-300",
  },
  {
    id: "ocr",
    href: "/ocr",
    title: "Neural Document OCR & Text Extractor",
    category: "forensics",
    categoryLabel: "Forensics & Security",
    techSpec: "Tesseract.js WASM",
    description: "High-accuracy client-side optical character recognition. Extracts structured text from scans and invoices without cloud APIs.",
    features: ["Multi-Language Support", "Binarization Preprocessing", "One-Click Clipboard", "100% Client Memory"],
    icon: ScanText,
    accent: "text-zinc-300",
  },

  // ── Audio & Acoustics ──
  {
    id: "dsp",
    href: "/dsp",
    title: "Spatial Audio & Stem DSP Studio",
    category: "audio",
    categoryLabel: "Audio & Acoustics",
    techSpec: "48kHz WebAudio Pipeline",
    description: "Real-time stereo phase cancellation for center vocal extraction, 3D binaural spatial HRTF panning, and parametric EQ.",
    features: ["Phase Inversion Vocal Cut", "3D Binaural HRTF", "Parametric 3-Band EQ", "Lossless WAV Render"],
    icon: Radio,
    accent: "text-amber-400",
  },
  {
    id: "audio",
    href: "/audio",
    title: "Multi-Track Audio Converter & Resampler",
    category: "audio",
    categoryLabel: "Audio & Acoustics",
    techSpec: "FFmpeg WASM Core",
    description: "High-fidelity audio transcoding and sample rate conversion across FLAC, WAV, MP3, AAC, and OGG containers.",
    features: ["Lossless FLAC/WAV", "Custom Bitrate 320kbps", "Sample Rate Resampling", "Batch Transcoding"],
    icon: Music,
    accent: "text-zinc-300",
  },
  {
    id: "trim",
    href: "/trim",
    title: "Waveform Slicer & Audio Trimmer",
    category: "audio",
    categoryLabel: "Audio & Acoustics",
    techSpec: "Sub-Sample Precision",
    description: "Visual waveform audio cutter with millisecond-accurate markers, dual-range boundaries, and lossless container export.",
    features: ["Interactive Waveform Canvas", "Millisecond Precision", "Fast Local Preview", "Instant Slice Save"],
    icon: Scissors,
    accent: "text-zinc-300",
  },
  {
    id: "subtitles",
    href: "/subtitles",
    title: "Subtitle & Caption Synchronizer",
    category: "audio",
    categoryLabel: "Audio & Acoustics",
    techSpec: "SMPTE Timecode",
    description: "Millisecond time-shifting, automatic framerate re-timing (23.976 to 60 fps), CPS reading speed diagnostics, and SRT/VTT/ASS export.",
    features: ["FPS Frame Conversion", "Millisecond Offset Shift", "CPS Speed Health Check", "SRT / VTT / ASS Export"],
    icon: Clock,
    accent: "text-amber-400",
  },

  // ── Code, AST & Diagrams ──
  {
    id: "crypto-vault",
    href: "/crypto-vault",
    title: "Cryptographic Key & JWK Vault",
    category: "code",
    categoryLabel: "Code & Security",
    techSpec: "W3C WebCrypto Subtle",
    description: "In-memory X.509 certificate and key inspector, PEM to DER to JWK transcoder, and in-browser ECDSA/RSA keypair generation.",
    features: ["SHA-256 Fingerprints", "PEM ↔ JWK ↔ DER", "ECDSA P-256 Generator", "Zero Cloud Exposure"],
    icon: Key,
    accent: "text-amber-400",
  },
  {
    id: "diagram-mesh",
    href: "/diagram-mesh",
    title: "Architecture Diagram & Vector Engine",
    category: "code",
    categoryLabel: "Code & Security",
    techSpec: "Mermaid.js Vector Core",
    description: "Code-to-vector compiler. Convert Mermaid flowcharts, sequence diagrams, Git graphs, and state machines into high-DPI PNGs and SVGs.",
    features: ["Live Vector Compilation", "High-DPI PNG 2x", "Vector SVG Export", "Standalone HTML Packages"],
    icon: Network,
    accent: "text-zinc-300",
  },
  {
    id: "data-morph",
    href: "/data-morph",
    title: "Universal Code & AST Schema Morph",
    category: "code",
    categoryLabel: "Code & Security",
    techSpec: "AST Transpiler",
    description: "In-memory cross-transpilation between JSON, YAML, TOML, XML, CSV, Protocol Buffers, and TypeScript interfaces.",
    features: ["JSON/YAML/TOML/XML", "TypeScript Interface Gen", "Protocol Buffer Schema", "AST Syntax Checking"],
    icon: Binary,
    accent: "text-zinc-300",
  },

  // ── Video & Motion ──
  {
    id: "compress",
    href: "/compress",
    title: "Hardware Video Transcoder & Compressor",
    category: "media",
    categoryLabel: "Video & Motion",
    techSpec: "WebCodecs + FFmpeg",
    description: "GPU-accelerated video compression. Dial in Constant Rate Factor (CRF) and preset encoding speeds to slash video payloads.",
    features: ["CRF Compression (18-36)", "H.264 / VP9 / WebM", "Resolution Downscaler", "In-Browser Transcode"],
    icon: FileDown,
    accent: "text-amber-400",
  },
  {
    id: "image",
    href: "/image",
    title: "Next-Gen Image Transcoder & Quantizer",
    category: "media",
    categoryLabel: "Video & Motion",
    techSpec: "Canvas 2D SIMD",
    description: "Convert, quantize, and resize images across WebP, AVIF, PNG, and JPEG with custom compression quality and dimension controls.",
    features: ["AVIF & WebP Next-Gen", "Quality Factor (1-100%)", "Aspect Ratio Resizer", "Batch Image Transcoding"],
    icon: ImageIcon,
    accent: "text-zinc-300",
  },
  {
    id: "animator",
    href: "/animator",
    title: "Animated WebP & GIF Diff Studio",
    category: "media",
    categoryLabel: "Video & Motion",
    techSpec: "Delta Deduplication",
    description: "Produce lightweight animated WebP and GIF files using temporal frame deduplication and NeuQuant color palette quantization.",
    features: ["Temporal Frame Delta", "Color Dithering Control", "Custom Frame Rate (10-30)", "Lightweight Payload"],
    icon: Film,
    accent: "text-zinc-300",
  },
  {
    id: "record",
    href: "/record",
    title: "Studio Screen & Audio Loopback Recorder",
    category: "media",
    categoryLabel: "Video & Motion",
    techSpec: "MediaRecorder API",
    description: "Capture 4K 60fps screen displays, window viewports, microphone audio, and system loopback into local MP4 / WebM video files.",
    features: ["4K 60fps Screen Capture", "Mic + System Audio Mix", "Zero Watermarks", "Immediate WebM/MP4 Save"],
    icon: Video,
    accent: "text-amber-400",
  },

  // ── Documents & Typography ──
  {
    id: "font-lab",
    href: "/font-lab",
    title: "Font Subsetter & Glyph Studio",
    category: "documents",
    categoryLabel: "Documents & Typography",
    techSpec: "OpenType.js Engine",
    description: "Parse OpenType/TrueType/WOFF fonts, extract Bézier glyph curves to SVG, and subset unused characters to reduce payload sizes by 90%.",
    features: ["TTF/OTF/WOFF2 Parser", "Bézier Curve to SVG", "Unicode Coverage Table", "Payload Subsetter (-90%)"],
    icon: Type,
    accent: "text-amber-400",
  },
  {
    id: "pdf",
    href: "/pdf",
    title: "Client-Side PDF Document Studio",
    category: "documents",
    categoryLabel: "Documents & Typography",
    techSpec: "PDF-Lib Memory Core",
    description: "Merge multiple PDFs, extract and re-order page ranges, apply watermarks, and password-protect documents entirely in RAM.",
    features: ["Lossless PDF Merger", "Page Range Slicer", "Custom Watermarker", "Password Encryption"],
    icon: FileText,
    accent: "text-zinc-300",
  },
  {
    id: "archive",
    href: "/archive",
    title: "Zero-Extraction Archive Inspector",
    category: "documents",
    categoryLabel: "Documents & Typography",
    techSpec: "JSZip + LibArchive",
    description: "Inspect, extract, preview, and repack ZIP and TAR archives in browser memory without writing unpacked data to disk.",
    features: ["Inspect Container Tree", "Selective File Extraction", "In-Memory Repacker", "Instant ZIP Download"],
    icon: Archive,
    accent: "text-zinc-300",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<"all" | "forensics" | "audio" | "code" | "media" | "documents">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkstations = useMemo(() => {
    return WORKSTATIONS.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.techSpec.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="w-full flex flex-col gap-12 sm:gap-16 py-4 sm:py-8">
      {/* ── Hero Section ── */}
      <section className="flex flex-col items-center text-center max-w-4xl mx-auto gap-5 px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-[11px] font-mono text-zinc-300 border border-white/[0.06]">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>ZERO-SERVER CLIENT ARCHITECTURE • WEBENGINE V3.4</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-sans leading-[1.12]">
          In-Browser Media, Forensic & File Engineering Studio
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed font-sans">
          17 specialized workstations powered by WebAssembly SIMD, WebCodecs, and WebCrypto. Process audio DSP, compress 4K video, parse OpenType fonts, inspect binary entropy, and vectorize graphics with zero cloud uploads.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#catalog"
            className="neu-btn-primary px-6 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2"
          >
            <span>Explore 17 Workstations</span>
            <ArrowRight size={15} />
          </a>
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
            className="neu-btn px-5 py-3 text-xs sm:text-sm text-zinc-300 hover:text-white flex items-center gap-2"
          >
            <Search size={14} className="text-amber-400" />
            <span>Quick Palette</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono border border-white/[0.08] text-zinc-400">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Hardware Capability Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl pt-6 font-mono text-xs">
          <div className="neu-inset p-3 rounded-xl flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-amber-400 font-bold text-base">0 Bytes</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Cloud Uploads</span>
          </div>
          <div className="neu-inset p-3 rounded-xl flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-white font-bold text-base">17 Suites</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">In-Memory Tools</span>
          </div>
          <div className="neu-inset p-3 rounded-xl flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-white font-bold text-base">WASM SIMD</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Multi-Threaded</span>
          </div>
          <div className="neu-inset p-3 rounded-xl flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-amber-400 font-bold text-base">100% Local</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">RAM Sandbox</span>
          </div>
        </div>
      </section>

      {/* ── Product Catalog Section (E-Commerce Style Showcase) ── */}
      <section id="catalog" className="w-full flex flex-col gap-6 scroll-mt-20">
        {/* Catalog Header & Category Navigation */}
        <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
                Workstation Catalog & Software Suites
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Select a software workstation below to launch its dedicated in-memory processing environment.
              </p>
            </div>

            <div className="relative shrink-0">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search workstations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="neu-inset pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none w-full sm:w-64 font-sans"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {(
              [
                { id: "all", label: "All Suites", count: 17 },
                { id: "forensics", label: "Forensics & Security", count: 4 },
                { id: "audio", label: "Audio & Acoustics", count: 4 },
                { id: "code", label: "Code & Diagrams", count: 3 },
                { id: "media", label: "Video & Motion", count: 4 },
                { id: "documents", label: "Documents & Fonts", count: 3 },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`neu-btn px-4 py-2 text-xs font-sans whitespace-nowrap flex items-center gap-2 ${
                  activeCategory === cat.id ? "active text-white border-amber-400/40" : "text-zinc-400"
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-zinc-400">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>Showing {filteredWorkstations.length} of 17 workstations</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* ── E-Commerce Style Product Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkstations.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="neu-tile p-5 flex flex-col justify-between gap-5 group hover:border-amber-400/20 transition-all"
              >
                <div className="space-y-3.5">
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl neu-btn ${tool.accent}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#090a0d] border border-white/[0.04] text-zinc-400">
                      {tool.techSpec}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <Link
                      href={tool.href}
                      className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between"
                    >
                      <span>{tool.title}</span>
                      <ArrowRight
                        size={15}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400 shrink-0 ml-1"
                      />
                    </Link>
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-sans">
                      {tool.description}
                    </p>
                  </div>

                  {/* Feature Tags */}
                  <div className="neu-inset p-2.5 rounded-xl flex flex-wrap gap-1.5">
                    {tool.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-zinc-300 border border-white/[0.03]"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Button */}
                <Link
                  href={tool.href}
                  className="neu-btn text-center py-2.5 text-xs font-semibold text-zinc-200 hover:text-white flex items-center justify-center gap-1.5 group-hover:bg-amber-400/10 group-hover:border-amber-400/30"
                >
                  <span>Open Workstation</span>
                  <ArrowRight size={13} className="text-amber-400" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Architecture & Security Sandbox ── */}
      <section className="w-full neu-inset p-6 sm:p-8 rounded-2xl border border-white/[0.06] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              <Lock size={12} className="text-amber-400" />
              <span>Zero-Cloud Security Model</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
              How the In-Browser Memory Sandbox Works
            </h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
            W3C WebAssembly Standard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
          <div className="p-4 rounded-xl bg-[#101218] border border-white/[0.04] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
              <span>01.</span>
              <span>LOCAL ARRAYBUFFER</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Direct Memory Ingestion</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Files dragged into the browser are sliced into binary typed arrays directly in client RAM. No HTTP upload requests or remote sockets are opened.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#101218] border border-white/[0.04] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
              <span>02.</span>
              <span>HARDWARE SIMD</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Multi-Core Processing</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Workstations leverage WebAssembly SIMD (128-bit vector instructions) and WebCodecs to execute audio DSP and video compression across your device CPU/GPU.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#101218] border border-white/[0.04] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
              <span>03.</span>
              <span>ZERO-LATENCY BLOB</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Immediate Local Save</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Synthesized outputs are packaged as local `blob:` URLs for instant download. Once closed, the memory buffer is garbage-collected with zero telemetry footprint.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
