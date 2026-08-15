"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Terminal,
  Search,
  ChevronDown,
  Key,
  Network,
  Type,
  Clock,
  X,
} from "lucide-react";

export interface SidebarTool {
  href: string;
  label: string;
  sublabel: string;
  icon: any;
  tag: string;
}

export interface SidebarCategory {
  id: string;
  name: string;
  icon: any;
  items: SidebarTool[];
}

export const SIDEBAR_CATEGORIES: SidebarCategory[] = [
  {
    id: "forensics",
    name: "Forensics & Security",
    icon: ShieldCheck,
    items: [
      { href: "/hex-diff", label: "Binary Hex & Entropy Disasm", sublabel: "Shannon H(X) & Byte Diff", icon: Binary, tag: "SIMD" },
      { href: "/metadata", label: "Metadata & Steganography", sublabel: "EXIF/GPS Scrubber & LSB Bitplane", icon: ShieldCheck, tag: "RAW" },
      { href: "/vectorize", label: "Raster to SVG Vectorizer", sublabel: "BÃ©zier Trace & Infinite Scaling", icon: Shapes, tag: "SVG" },
      { href: "/ocr", label: "Neural Document OCR", sublabel: "Tesseract.js WASM In-Memory", icon: ScanText, tag: "OCR" },
    ],
  },
  {
    id: "audio",
    name: "Audio, Acoustics & DSP",
    icon: Radio,
    items: [
      { href: "/dsp", label: "Spatial Audio & Stem DSP", sublabel: "Binaural HRTF & Vocal Extraction", icon: Radio, tag: "DSP" },
      { href: "/audio", label: "Audio Stream Converter", sublabel: "Lossless FLAC/WAV/MP3 Resampler", icon: Music, tag: "WASM" },
      { href: "/trim", label: "Waveform PCM Slicer", sublabel: "Millisecond Sub-Sample Trimmer", icon: Scissors, tag: "PCM" },
      { href: "/subtitles", label: "SMPTE Subtitle Sync", sublabel: "SRT/VTT Framerate & CPS Retimer", icon: Clock, tag: "SMPTE" },
    ],
  },
  {
    id: "code",
    name: "Code, Vault & Schematics",
    icon: Binary,
    items: [
      { href: "/crypto-vault", label: "WebCrypto & JWK Studio", sublabel: "X.509/PEM & DER/JWK Keys", icon: Key, tag: "W3C" },
      { href: "/diagram-mesh", label: "Diagram & Vector Mesh", sublabel: "Mermaid Architecture Render", icon: Network, tag: "SVG" },
      { href: "/data-morph", label: "Universal Code AST Morph", sublabel: "JSON/YAML/CSV/TOML Engine", icon: Binary, tag: "AST" },
    ],
  },
  {
    id: "video",
    name: "Video, Stream & Motion",
    icon: Video,
    items: [
      { href: "/compress", label: "H.264 Video Compressor", sublabel: "Bitrate & CRF Downscaling", icon: FileDown, tag: "CRF" },
      { href: "/animator", label: "Animated WebP / GIF Diff", sublabel: "Lossless Frame Stacker & Delay", icon: Film, tag: "DIFF" },
      { href: "/record", label: "Screen & Camera Recorder", sublabel: "Multi-Track WebM Hardware Capture", icon: Video, tag: "REC" },
    ],
  },
  {
    id: "documents",
    name: "Documents, Fonts & Arch",
    icon: FileText,
    items: [
      { href: "/font-lab", label: "OpenType & WOFF2 Subsetter", sublabel: "Glyph Outline & Font Shrinker", icon: Type, tag: "TTF" },
      { href: "/pdf", label: "PDF Document Studio", sublabel: "Split, Merge & Page Manipulation", icon: FileText, tag: "PDF" },
      { href: "/image", label: "Canvas Image Transcoder", sublabel: "AVIF/WebP/PNG Lossless Engine", icon: ImageIcon, tag: "AVIF" },
      { href: "/archive", label: "In-Memory Archive Studio", sublabel: "ZIP / Tarball Repacker", icon: Archive, tag: "ZIP" },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Track open dropdown accordion states (default: all open for easy access)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    forensics: true,
    audio: true,
    code: true,
    video: true,
    documents: true,
  });

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter categories and tools by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return SIDEBAR_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return SIDEBAR_CATEGORIES.map((cat) => {
      const matchingItems = cat.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.sublabel.toLowerCase().includes(q) ||
          item.tag.toLowerCase().includes(q)
      );
      return {
        ...cat,
        items: matchingItems,
      };
    }).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  return (
    <aside className="flex flex-col h-full bg-[#090a0f] border-r border-white/[0.08] select-none text-zinc-300">
      {/* â”€â”€ Brand & Search Header â”€â”€ */}
      <div className="p-4 border-b border-white/[0.08] bg-[#0c0d14] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg bg-white text-black flex items-center justify-center font-bold text-xs shadow-md shadow-white/[0.04] group-hover:bg-zinc-100 transition-colors">
              <Zap size={15} className="fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-tight text-white group-hover:text-zinc-100 transition-colors">
                  Explosive
                </span>
                <span className="text-[10px] font-mono font-bold bg-white/[0.08] text-zinc-300 px-1.5 py-0.5 rounded">
                  v2.0
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-sans block">
                Engineering Suite & Directory
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Filter Input */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search workstations & tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-white/[0.18] focus:ring-1 focus:ring-white/30 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
            >
              Ã—
            </button>
          )}
        </div>
      </div>

      {/* â”€â”€ Category Accordion Navigation â”€â”€ */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8 px-4 text-xs text-zinc-500 font-mono">
            No matching tools found for "{searchQuery}"
          </div>
        ) : (
          filteredCategories.map((category) => {
            const isCategoryOpen = openCategories[category.id] ?? true;
            const CategoryIcon = category.icon;
            const hasActiveTool = category.items.some((i) => i.href === pathname);

            return (
              <div
                key={category.id}
                className="rounded-xl border border-white/[0.06] bg-[#0d0e15]/90 overflow-hidden transition-all"
              >
                {/* Accordion Dropdown Tab Header with Down Arrow */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                    hasActiveTool
                      ? "bg-white/5 text-zinc-100"
                      : "hover:bg-white/[0.03] text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CategoryIcon size={14} className={hasActiveTool ? "text-white" : "text-zinc-500"} />
                    <span className="text-xs font-semibold tracking-tight truncate font-sans">
                      {category.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400">
                      {category.items.length}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-zinc-500 transition-transform duration-200 ${
                        isCategoryOpen ? "rotate-180 text-white" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Dropdown Items List */}
                {isCategoryOpen && (
                  <div className="p-1.5 pt-0.5 flex flex-col gap-1 border-t border-white/[0.04]">
                    {category.items.map((tool) => {
                      const isActive = pathname === tool.href;
                      const ToolIcon = tool.icon;

                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={onClose}
                          className={`group flex items-start gap-2.5 p-2 rounded-lg text-xs transition-all ${
                            isActive
                              ? "bg-white/10 text-white font-medium border border-white/25 shadow-sm"
                              : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-md shrink-0 mt-0.5 transition-colors ${
                              isActive
                                ? "bg-white/20 text-zinc-100"
                                : "bg-white/[0.04] text-zinc-500 group-hover:text-zinc-300"
                            }`}
                          >
                            <ToolIcon size={13} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold text-zinc-200 group-hover:text-white truncate">
                                {tool.label}
                              </span>
                              <span
                                className={`text-[9px] font-mono font-bold px-1 rounded shrink-0 ${
                                  isActive
                                    ? "bg-white/20 text-zinc-100"
                                    : "bg-white/[0.04] text-zinc-500"
                                }`}
                              >
                                {tool.tag}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 truncate mt-0.5 font-sans">
                              {tool.sublabel}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* â”€â”€ Sidebar Footer / Quick Tools â”€â”€ */}
      <div className="p-3 bg-[#0c0d14] border-t border-white/[0.08] flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              if (onClose) onClose();
              window.dispatchEvent(new Event("toggle-console-drawer"));
            }}
            className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 text-xs font-mono border border-white/[0.06] transition-colors cursor-pointer"
          >
            <Terminal size={12} className="text-white" />
            <span>Terminal</span>
          </button>

          <button
            onClick={() => {
              if (onClose) onClose();
              document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
            }}
            className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 text-xs font-mono border border-white/[0.06] transition-colors cursor-pointer"
          >
            <Search size={12} className="text-zinc-400" />
            <span>Search âŒ˜K</span>
          </button>
        </div>

        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/[0.04]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
            <span>Client RAM Sandbox</span>
          </span>
          <span className="text-zinc-400 font-semibold">0B Cloud IO</span>
        </div>
      </div>
    </aside>
  );
}
