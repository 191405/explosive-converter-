"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Image as ImageIcon,
  FileDown,
  Music,
  Scissors,
  Video,
  Monitor,
  Lock,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";

interface ToolItem {
  href: string;
  title: string;
  description: string;
  icon: any;
  engine: string;
  supportedFormats: string;
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
    id: "audio",
    category: "Audio Processing",
    summary: "Conversion, track extraction, and lossless waveform editing.",
    tools: [
      {
        href: "/audio",
        title: "Audio Converter & Extractor",
        description: "Extract audio streams from video files or transcode between audio formats with bitrate and sample rate configuration.",
        icon: Music,
        engine: "FFmpeg WASM (libmp3lame, opus)",
        supportedFormats: "MP3, WAV, AAC, FLAC, OGG, M4A",
        desktopOnly: false,
      },
      {
        href: "/trim",
        title: "Audio Waveform Trimmer",
        description: "Interactive visual waveform cutting with millisecond range controls and lossless client-side PCM audio slicing.",
        icon: Scissors,
        engine: "Web Audio API (AudioBuffer)",
        supportedFormats: "MP3, WAV, AAC, FLAC, OGG",
        desktopOnly: false,
      },
    ],
  },
  {
    id: "video-graphics",
    category: "Video & Graphics",
    summary: "Compression and image format transcoding.",
    tools: [
      {
        href: "/compress",
        title: "Video Compressor",
        description: "Reduce video bitrate and file size using H.264 encoding with adjustable Constant Rate Factor (CRF) and preset speed.",
        icon: FileDown,
        engine: "FFmpeg WASM (libx264)",
        supportedFormats: "MP4, MOV, MKV, WebM, AVI",
        desktopOnly: false,
      },
      {
        href: "/image",
        title: "Image Transcoder",
        description: "Batch transcode image formats, adjust compression quality, and apply proportional or exact dimension scaling.",
        icon: ImageIcon,
        engine: "HTML5 Canvas Transcoder",
        supportedFormats: "PNG, JPG, WEBP, BMP, SVG",
        desktopOnly: false,
      },
    ],
  },
  {
    id: "documents-capture",
    category: "Documents & Recording",
    summary: "Document manipulation and display media capture.",
    tools: [
      {
        href: "/pdf",
        title: "PDF Studio",
        description: "Split document page ranges, merge multiple PDF files, and reorder document structures locally.",
        icon: FileText,
        engine: "PDF-Lib Core",
        supportedFormats: "PDF",
        desktopOnly: false,
      },
      {
        href: "/record",
        title: "Screen & Camera Recorder",
        description: "Capture application windows, full displays, or webcams with synchronized microphone and system audio streams.",
        icon: Video,
        engine: "MediaRecorder API",
        supportedFormats: "WebM, MP4 (VP9 / Opus)",
        desktopOnly: true,
      },
    ],
  },
];

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleToolClick = (e: React.MouseEvent, tool: ToolItem) => {
    if (tool.desktopOnly && isMobile) {
      e.preventDefault();
      toast.info("Desktop Exclusive Tool", {
        description: "Screen & Window Recording requires desktop display capture APIs (Chrome, Firefox, or Edge on PC/Mac).",
        icon: <Monitor className="w-4 h-4 text-text-primary" />,
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-12 sm:gap-16 max-w-5xl mx-auto">
      {/* ── Headline & Overview ── */}
      <section className="w-full text-left pt-2 sm:pt-10 border-b border-border-subtle pb-8">
        <div className="flex flex-col gap-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary uppercase tracking-wider">
            <span>Media & Document Suite</span>
            <span>•</span>
            <span>Client-Side Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-text-primary">
            Local Media & Document Processing
          </h1>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
            A privacy-focused suite of media conversion and document utilities running entirely inside your browser. 
            All operations execute on your device’s processor with zero server uploads or external network requests.
          </p>
        </div>

        {/* Technical Specs Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-border-subtle">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-surface border border-border-subtle">
            <Shield size={18} className="text-text-secondary mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-text-primary block">Private by Design</span>
              <span className="text-[11px] text-text-tertiary font-mono">Files never leave memory</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-surface border border-border-subtle">
            <Cpu size={18} className="text-text-secondary mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-text-primary block">WebAssembly Execution</span>
              <span className="text-[11px] text-text-tertiary font-mono">Native C/C++ codecs in browser</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-surface border border-border-subtle">
            <Layers size={18} className="text-text-secondary mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-text-primary block">Offline Capable</span>
              <span className="text-[11px] text-text-tertiary font-mono">Works without internet once loaded</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Organized Tool Sections ── */}
      <section className="flex flex-col gap-12 w-full">
        {TOOL_GROUPS.map((group) => (
          <div key={group.id} className="flex flex-col gap-4">
            {/* Group Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-border-subtle">
              <h2 className="text-lg font-semibold tracking-tight text-text-primary">
                {group.category}
              </h2>
              <span className="text-xs text-text-tertiary font-mono">
                {group.summary}
              </span>
            </div>

            {/* Tools Grid for this Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.tools.map((tool) => {
                const Icon = tool.icon;
                const isGreyedOut = tool.desktopOnly && isMobile;

                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={(e) => handleToolClick(e, tool)}
                    className={`group block outline-none select-none ${
                      isGreyedOut ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <div
                      className={`h-full p-5 sm:p-6 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-5 ${
                        isGreyedOut
                          ? "bg-bg-surface/30 border-border-subtle opacity-40 grayscale"
                          : "bg-bg-surface/80 border-border-subtle hover:border-border-focus hover:bg-bg-surface-hover shadow-sm"
                      }`}
                    >
                      {/* Top Info */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-text-primary/[0.04] border border-border-subtle text-text-primary">
                              <Icon size={18} strokeWidth={1.75} />
                            </div>
                            <h3 className="text-base font-semibold tracking-tight text-text-primary">
                              {tool.title}
                            </h3>
                          </div>

                          {tool.desktopOnly && (
                            <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-text-primary/5 text-text-tertiary border border-border-subtle">
                              <Monitor size={10} />
                              {isMobile ? "Desktop Only" : "Desktop"}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-text-secondary leading-relaxed font-normal">
                          {tool.description}
                        </p>
                      </div>

                      {/* Technical Footer Metadata */}
                      <div className="pt-3 border-t border-border-subtle flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-text-tertiary">
                          <span>Engine: <span className="text-text-secondary">{tool.engine}</span></span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-text-tertiary">
                          <span>Formats: <span className="text-text-secondary">{tool.supportedFormats}</span></span>
                          <span className={`inline-flex items-center gap-1 font-sans text-xs font-medium transition-colors ${
                            isGreyedOut ? "text-text-tertiary" : "text-text-primary group-hover:underline"
                          }`}>
                            {isGreyedOut ? "Requires Desktop" : "Open"}
                            {!isGreyedOut && <ArrowRight size={12} />}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
