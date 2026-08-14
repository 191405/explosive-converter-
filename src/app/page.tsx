"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Image as ImageIcon,
  FileDown,
  Music,
  Scissors,
  Video,
  ShieldCheck,
  Zap,
  WifiOff,
  HardDrive,
  Monitor,
  Sparkles,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface ToolItem {
  href: string;
  title: string;
  category: "audio" | "video" | "document" | "image" | "studio";
  categoryLabel: string;
  desc: string;
  icon: any;
  tags: string[];
  desktopOnly?: boolean;
}

const tools: ToolItem[] = [
  {
    href: "/pdf",
    title: "PDF Studio",
    category: "document",
    categoryLabel: "Document",
    desc: "Merge, split, and manipulate PDF documents securely with zero server uploads.",
    icon: FileText,
    tags: ["Merge", "Split", "Encrypted"],
    desktopOnly: false,
  },
  {
    href: "/image",
    title: "Image Transcoder",
    category: "image",
    categoryLabel: "Graphics",
    desc: "Instantly transcode between PNG, JPG, WEBP, and BMP with precision quality control.",
    icon: ImageIcon,
    tags: ["Lossless", "Batch", "Resize"],
    desktopOnly: false,
  },
  {
    href: "/compress",
    title: "Video Compressor",
    category: "video",
    categoryLabel: "Video Lab",
    desc: "Shrink video files using multi-threaded WebAssembly with CRF rate control.",
    icon: FileDown,
    tags: ["H.264", "WASM", "No Size Limit"],
    desktopOnly: false,
  },
  {
    href: "/audio",
    title: "Audio Converter",
    category: "audio",
    categoryLabel: "Audio Lab",
    desc: "Extract audio tracks from video or convert between MP3, WAV, AAC, FLAC & OGG.",
    icon: Music,
    tags: ["Extract Video", "320kbps", "FLAC/WAV"],
    desktopOnly: false,
  },
  {
    href: "/trim",
    title: "Audio Waveform Trimmer",
    category: "audio",
    categoryLabel: "Audio Lab",
    desc: "Interactive visual waveform cutter with millisecond trim precision & lossless export.",
    icon: Scissors,
    tags: ["Waveform", "Real-time", "PCM 16-bit"],
    desktopOnly: false,
  },
  {
    href: "/record",
    title: "Screen & Camera Studio",
    category: "studio",
    categoryLabel: "Studio Capture",
    desc: "High-frame-rate screen, window, and webcam capture with microphone mixing.",
    icon: Video,
    tags: ["Display Media", "WebM/MP4", "VU Meter"],
    desktopOnly: true,
  },
];

const categories = [
  { id: "all", label: "All Utilities" },
  { id: "audio", label: "Audio Lab" },
  { id: "video", label: "Video" },
  { id: "image", label: "Graphics" },
  { id: "document", label: "Documents" },
  { id: "studio", label: "Studio" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const filteredTools = tools.filter(
    (t) => selectedCategory === "all" || t.category === selectedCategory
  );

  const handleToolClick = (e: React.MouseEvent, tool: ToolItem) => {
    if (tool.desktopOnly && isMobile) {
      e.preventDefault();
      toast.info("Desktop Exclusive", {
        description: "Screen & Window Recording requires a desktop browser (Chrome, Firefox, or Edge on PC/Mac).",
        icon: <Monitor className="w-4 h-4 text-text-primary" />,
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-10 sm:gap-16">
      {/* ── Hero Section ── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-4 max-w-3xl pt-2 sm:pt-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-text-primary/[0.04] border border-text-primary/[0.08] text-[11px] font-mono tracking-wider text-text-primary/70 mb-2">
          <Sparkles size={12} className="text-text-primary" />
          <span>ZERO-SERVER • CLIENT-SIDE ARCHITECTURE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-tight text-glow">
          Client-Side<br />
          <span className="text-text-primary/40">Superpowers.</span>
        </h1>

        <p className="text-sm sm:text-lg text-text-primary/60 leading-relaxed font-light px-4 max-w-2xl mx-auto">
          High-performance media manipulation suite running WebAssembly and native browser engines.
          Zero uploads, absolute privacy.
        </p>
      </motion.section>

      {/* ── Category Filter Bar ── */}
      <div className="w-full flex justify-center px-2">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-bg-surface/80 border border-border-subtle backdrop-blur-md overflow-x-auto scrollbar-none max-w-full">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-text-primary text-bg-base shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-text-primary/[0.03]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tools Grid ── */}
      <motion.section
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
      >
        <AnimatePresence mode="popLayout">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isGreyedOut = tool.desktopOnly && isMobile;

            return (
              <motion.div
                key={tool.href}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <Link
                  href={tool.href}
                  onClick={(e) => handleToolClick(e, tool)}
                  className={`group block h-full outline-none select-none ${
                    isGreyedOut ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <div
                    className={`glass-panel p-6 flex flex-col items-start gap-4 h-full relative overflow-hidden transition-all duration-300 ${
                      isGreyedOut
                        ? "opacity-45 grayscale bg-bg-surface/40 border-border-subtle"
                        : "hover:border-border-focus"
                    }`}
                  >
                    {/* Hover Glow */}
                    {!isGreyedOut && (
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-text-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    )}

                    {/* Top Row: Icon & Badges */}
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`p-2.5 rounded-lg border transition-colors ${
                          isGreyedOut
                            ? "bg-text-primary/[0.02] border-text-primary/[0.05] text-text-primary/40"
                            : "bg-text-primary/[0.03] border-text-primary/[0.05] text-text-primary group-hover:bg-text-primary group-hover:text-bg-base"
                        }`}
                      >
                        <Icon size={22} strokeWidth={1.5} />
                      </div>

                      {/* Desktop Only / Platform Badge */}
                      {tool.desktopOnly ? (
                        <span
                          className={`flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                            isGreyedOut
                              ? "bg-text-primary/5 text-text-tertiary border-text-primary/10"
                              : "bg-text-primary/10 text-text-primary/80 border-text-primary/20"
                          }`}
                        >
                          <Monitor size={11} />
                          {isMobile ? "Desktop Only" : "Desktop Optimized"}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                          {tool.categoryLabel}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h2 className="text-lg font-bold tracking-tight text-text-primary">
                          {tool.title}
                        </h2>
                        {isGreyedOut && (
                          <Lock size={13} className="text-text-tertiary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-primary/50 leading-relaxed font-light">
                        {tool.desc}
                      </p>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-text-primary/[0.03] border border-text-primary/[0.05] text-text-primary/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Link Footer */}
                    <div className="mt-auto pt-3 flex items-center justify-between w-full border-t border-text-primary/[0.04]">
                      <span
                        className={`text-[11px] font-semibold tracking-widest uppercase transition-colors ${
                          isGreyedOut
                            ? "text-text-tertiary flex items-center gap-1"
                            : "text-text-primary/30 group-hover:text-text-primary"
                        }`}
                      >
                        {isGreyedOut ? "Requires Desktop Screen" : "Launch Utility →"}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.section>

      {/* ── Verified Infrastructure Strip ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-wrap justify-center gap-6 sm:gap-12 text-[11px] font-mono text-text-primary/40 tracking-wider w-full max-w-4xl pt-6 border-t border-border-subtle"
      >
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-text-primary/60" />
          100% PRIVATE
        </span>
        <span className="flex items-center gap-1.5">
          <HardDrive size={14} className="text-text-primary/60" />
          UNLIMITED RAM SIZES
        </span>
        <span className="flex items-center gap-1.5">
          <WifiOff size={14} className="text-text-primary/60" />
          OFFLINE READY
        </span>
        <span className="flex items-center gap-1.5">
          <Zap size={14} className="text-text-primary/60" />
          WASM & WEB AUDIO
        </span>
      </motion.section>
    </div>
  );
}
