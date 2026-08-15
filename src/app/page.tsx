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
} from "lucide-react";

interface ToolItem {
  href: string;
  title: string;
  description: string;
  icon: any;
  engine: string;
  supportedFormats: string;
  badge?: string;
  desktopOnly?: boolean;
}

interface ToolGroup {
  id: string;
  category: string;
  summary: string;
  tools: ToolItem[];
}

const TOOL_GROUPS: ToolGroup[] = [
  {
    id: "forensics-vectors",
    category: "Forensics, Vectors & OCR",
    summary: "Deep binary header inspection, raster-to-vector tracing, and local OCR text extraction.",
    tools: [
      {
        href: "/metadata",
        title: "Metadata & Stego Inspector",
        description: "Scrub GPS & hardware identifiers, inspect EXIF tags, and visualize LSB steganography bitplanes.",
        icon: ShieldCheck,
        engine: "In-Memory Header Parser",
        supportedFormats: "JPG, PNG, TIFF, MP4, WebP",
        badge: "PRO",
      },
      {
        href: "/vectorize",
        title: "Raster to SVG Vectorizer",
        description: "Convert bitmap images, logos, and scans into infinitely scalable, smooth SVG vector paths.",
        icon: Shapes,
        engine: "Bézier Boundary Tracer",
        supportedFormats: "PNG, JPG, BMP, Scans",
        badge: "SVG",
      },
      {
        href: "/ocr",
        title: "Client-Side Document OCR",
        description: "Neural optical character recognition with layout analysis and plain text / searchable PDF layer extraction.",
        icon: ScanText,
        engine: "Tesseract WASM Core",
        supportedFormats: "PNG, JPG, PDF, TIFF",
        badge: "WASM",
      },
    ],
  },
  {
    id: "audio-dsp-animation",
    category: "Spatial Audio & Animated Media",
    summary: "Real-time Web Audio DSP matrix and frame-diffing animated media optimization.",
    tools: [
      {
        href: "/dsp",
        title: "Spatial Audio DSP & Stem Isolator",
        description: "Stereo phase cancellation for vocal cut / isolation, 3D binaural panning, and 8-band parametric EQ.",
        icon: Radio,
        engine: "WebAudio Biquad Matrix",
        supportedFormats: "WAV, MP3, AAC, FLAC, OGG",
        badge: "DSP",
      },
      {
        href: "/animator",
        title: "Animated WebP & GIF Diff",
        description: "Generate lightweight animations with temporal delta deduplication and 256-color palette dithering.",
        icon: Film,
        engine: "FFmpeg WASM PaletteGen",
        supportedFormats: "MP4, WebM, MOV, GIF",
        badge: "DIFF",
      },
      {
        href: "/audio",
        title: "Audio Converter & Extractor",
        description: "Extract audio streams from video files or transcode between formats with custom sample rate controls.",
        icon: Music,
        engine: "FFmpeg WASM (libmp3lame)",
        supportedFormats: "MP3, WAV, AAC, FLAC, OGG",
      },
      {
        href: "/trim",
        title: "Audio Waveform Trimmer",
        description: "Interactive visual waveform slicing with millisecond precision and lossless client-side PCM export.",
        icon: Scissors,
        engine: "AudioBuffer PCM Slicer",
        supportedFormats: "MP3, WAV, AAC, FLAC",
      },
    ],
  },
  {
    id: "code-archive-documents",
    category: "Code Morph, Archives & Documents",
    summary: "AST schema transformations, in-memory archive repacking, video compression, and PDF manipulation.",
    tools: [
      {
        href: "/data-morph",
        title: "Universal Code & AST Morph",
        description: "Bi-directional instant conversion between JSON, YAML, TOML, CSV, XML, and TypeScript interfaces.",
        icon: Binary,
        engine: "AST Parser & Serializer",
        supportedFormats: "JSON, YAML, CSV, TS, XML",
        badge: "AST",
      },
      {
        href: "/archive",
        title: "Archive Inspector & Repacker",
        description: "Inspect nested directories, extract selective files, and pack in-memory ZIP/TAR archives.",
        icon: Archive,
        engine: "Fflate In-Memory Stream",
        supportedFormats: "ZIP, TAR, GZ, ZSTD",
        badge: "IO",
      },
      {
        href: "/compress",
        title: "Video Compressor",
        description: "Reduce video bitrate using H.264 encoding with Constant Rate Factor (CRF) and preset speed tuning.",
        icon: FileDown,
        engine: "FFmpeg WASM (libx264)",
        supportedFormats: "MP4, MOV, MKV, WebM",
      },
      {
        href: "/image",
        title: "Image Transcoder",
        description: "Batch transcode image formats, adjust compression quality, and apply proportional dimension scaling.",
        icon: ImageIcon,
        engine: "HTML5 Canvas Engine",
        supportedFormats: "PNG, JPG, WEBP, BMP",
      },
      {
        href: "/pdf",
        title: "PDF Studio",
        description: "Split document page ranges, merge multiple PDF files, and reorder document structures locally.",
        icon: FileText,
        engine: "PDF-Lib Core",
        supportedFormats: "PDF",
      },
      {
        href: "/record",
        title: "Screen & Camera Recorder",
        description: "Capture application windows, full displays, or webcams with synchronized microphone audio.",
        icon: Video,
        engine: "MediaRecorder API",
        supportedFormats: "WebM, MP4 (VP9 / Opus)",
        desktopOnly: true,
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full gap-10 sm:gap-14 max-w-5xl mx-auto">
      {/* ── Studio Hero & Spec Matrix ── */}
      <section className="w-full text-left pt-2 sm:pt-6 border-b border-white/[0.08] pb-8">
        <div className="flex flex-col gap-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <span className="text-emerald-400 font-semibold">Explosive Studio v2.0</span>
            <span>•</span>
            <span>WebAssembly SIMD & Stream Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            High-Grade Media & Data Engineering Suite
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Industrial-strength media processing, forensic file inspection, and schema serialization. Powered 100% in-browser by WebAssembly SIMD and Web Streams with zero server data exfiltration.
          </p>

          {/* Quick Spec Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.08] flex items-center gap-1.5">
              <Cpu size={13} className="text-amber-400" />
              <span>Multi-Threaded Workers</span>
            </span>
            <span className="px-2.5 py-1 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.08] flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>100% In-Memory Privacy</span>
            </span>
            <span className="px-2.5 py-1 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.08] flex items-center gap-1.5">
              <Terminal size={13} className="text-cyan-400" />
              <span>Real-Time Stdout Telemetry</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Tool Categories Grid ── */}
      <div className="w-full flex flex-col gap-10">
        {TOOL_GROUPS.map((group) => (
          <section key={group.id} className="flex flex-col gap-4">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/[0.2]"></span>
                <h2 className="text-base font-semibold text-white font-mono tracking-tight uppercase">
                  {group.category}
                </h2>
              </div>
              <p className="text-xs text-zinc-400 font-mono pl-4">{group.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {group.tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group relative p-4 rounded-xl bg-[#09090c] border border-white/[0.07] hover:border-white/[0.2] hover:bg-[#111116] transition-all flex flex-col justify-between gap-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white group-hover:scale-105 transition-transform">
                          <Icon size={18} />
                        </div>
                        {tool.badge && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300 border border-white/[0.08]">
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                          <span>{tool.title}</span>
                          <ArrowRight
                            size={12}
                            className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-300"
                          />
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-white/[0.05] flex flex-col gap-1 text-[10px] font-mono text-zinc-500">
                      <div className="flex items-center justify-between">
                        <span>Engine:</span>
                        <span className="text-zinc-400 truncate max-w-[150px]">{tool.engine}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Formats:</span>
                        <span className="text-zinc-400 truncate max-w-[150px]">{tool.supportedFormats}</span>
                      </div>
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
