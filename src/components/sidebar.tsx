"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Music,
  Scissors,
  FileDown,
  Image as ImageIcon,
  FileText,
  Video,
  ShieldCheck,
  Shapes,
  ScanText,
  Radio,
  Clock,
  Film,
  Binary,
  Archive,
  Terminal,
  Key,
  Network,
  Type,
  ChevronDown,
  Search,
  X,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export interface ToolCategory {
  id: string;
  name: string;
  icon: any;
  items: {
    label: string;
    sublabel: string;
    href: string;
    icon: any;
    tag: string;
  }[];
}

export const SIDEBAR_CATEGORIES: ToolCategory[] = [
  {
    id: "forensics",
    name: "Forensics & Security",
    icon: ShieldCheck,
    items: [
      {
        label: "Metadata & Steg Scrubber",
        sublabel: "EXIF/XMP forensics & hidden channel analysis",
        href: "/metadata",
        icon: ShieldCheck,
        tag: "EXIF/WASM",
      },
      {
        label: "Binary Hex & Shannon Diff",
        sublabel: "Byte frequency, visual entropy & diffing",
        href: "/hex-diff",
        icon: Binary,
        tag: "BYTE LEVEL",
      },
      {
        label: "Document OCR Engine",
        sublabel: "In-browser neural text recognition (Tesseract)",
        href: "/ocr",
        icon: ScanText,
        tag: "NEURAL OCR",
      },
      {
        label: "Raster to SVG Vectorizer",
        sublabel: "Bézier curve fitting & contour quantization",
        href: "/vectorize",
        icon: Shapes,
        tag: "VECTORS",
      },
    ],
  },
  {
    id: "audio",
    name: "Audio, Acoustics & DSP",
    icon: Radio,
    items: [
      {
        label: "Spatial Audio & Stem Isolator",
        sublabel: "3D binaural HRTF, vocal center cancellation",
        href: "/dsp",
        icon: Radio,
        tag: "3D HRTF",
      },
      {
        label: "Lossless Audio Transcoder",
        sublabel: "FLAC, WAV, AAC, MP3, OGG high bitrate",
        href: "/audio",
        icon: Music,
        tag: "FFMPEG",
      },
      {
        label: "Precision Sample Trimmer",
        sublabel: "Sub-millisecond audio cue slicing & fade curves",
        href: "/trim",
        icon: Scissors,
        tag: "DSP CUES",
      },
    ],
  },
  {
    id: "code",
    name: "Code, Vault & Schematics",
    icon: Key,
    items: [
      {
        label: "Cryptographic Key & JWK Vault",
        sublabel: "Zero-knowledge AES-GCM, RSA, Ed25519 keygens",
        href: "/crypto-vault",
        icon: Key,
        tag: "WEBCRYPTO",
      },
      {
        label: "Architecture Diagram Mesh",
        sublabel: "Mermaid / Graphviz live SVG renderer",
        href: "/diagram-mesh",
        icon: Network,
        tag: "GRAPHVIZ",
      },
      {
        label: "Universal AST & Data Morph",
        sublabel: "Bi-directional JSON, YAML, TOML, XML AST morph",
        href: "/data-morph",
        icon: Binary,
        tag: "AST ENGINE",
      },
    ],
  },
  {
    id: "video",
    name: "Video, Stream & Motion",
    icon: Film,
    items: [
      {
        label: "SMPTE Subtitle & Translator",
        sublabel: "Non-AI VAD voice cue sync, multi-lang SRT/VTT",
        href: "/subtitles",
        icon: Clock,
        tag: "SMPTE/VLC",
      },
      {
        label: "Cloudinary Browser Engine",
        sublabel: "URL micro-transforms: e_art, c_fill, w_auto",
        href: "/cloudinary",
        icon: Zap,
        tag: "TRANSFORMS",
      },
      {
        label: "Animated WebP & GIF Diff",
        sublabel: "Frame quantization, motion diff & palette slicing",
        href: "/animator",
        icon: Film,
        tag: "QUANTIZE",
      },
      {
        label: "H.264 / AV1 Video Compressor",
        sublabel: "Two-pass rate control, resolution scaling",
        href: "/compress",
        icon: FileDown,
        tag: "H.264 / AV1",
      },
      {
        label: "Hardware Screen Recorder",
        sublabel: "Zero-latency display capture with audio mixing",
        href: "/record",
        icon: Video,
        tag: "60 FPS 4K",
      },
    ],
  },
  {
    id: "documents",
    name: "Documents, Fonts & Arch",
    icon: FileText,
    items: [
      {
        label: "Font Subsetter & Glyph Studio",
        sublabel: "Glyph pruning, WOFF2 packing, font forensics",
        href: "/font-lab",
        icon: Type,
        tag: "WOFF2 PACK",
      },
      {
        label: "In-Memory Archive Repacker",
        sublabel: "Extract, repack, test CRC32 for TAR/ZIP",
        href: "/archive",
        icon: Archive,
        tag: "GZIP/TAR",
      },
      {
        label: "Image Transcoding Engine",
        sublabel: "Multi-format WebP, AVIF, PNG, JPEG, TIFF",
        href: "/image",
        icon: ImageIcon,
        tag: "LIBWEBP",
      },
      {
        label: "PDF Vector Studio",
        sublabel: "Merge, split, re-order, extract text & images",
        href: "/pdf",
        icon: FileText,
        tag: "PDF-LIB",
      },
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
    <aside className="flex flex-col h-full bg-[var(--bg-main)] border-r border-black/[0.08] dark:border-white/[0.08] select-none text-[var(--text-main)]">
      {/* ── Brand & Search Header ── */}
      <div className="p-4 border-b border-black/[0.08] dark:border-white/[0.08] bg-[var(--bg-tile)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs shadow-md transition-colors">
              <Zap size={15} className="fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-tight text-[var(--text-main)] transition-colors">
                  Explosive
                </span>
                <span className="text-[10px] font-mono font-bold bg-black/5 dark:bg-white/[0.08] text-[var(--text-dim)] px-1.5 py-0.5 rounded">
                  v2.0
                </span>
              </div>
              <span className="text-[10px] text-[var(--text-dim)] font-sans block">
                Engineering Suite & Directory
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.1] text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Search Filter Input */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
          <input
            type="text"
            placeholder="Search workstations & tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-tile-inset)] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text-main)] text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Category Accordion Navigation ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8 px-4 text-xs text-[var(--text-dim)] font-mono">
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
                className="rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-[var(--bg-tile)] overflow-hidden transition-all shadow-sm"
              >
                {/* Accordion Dropdown Tab Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                    hasActiveTool
                      ? "bg-black/[0.04] dark:bg-white/5 text-[var(--text-main)] font-semibold"
                      : "hover:bg-black/[0.02] dark:hover:bg-white/[0.03] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CategoryIcon size={14} className={hasActiveTool ? "text-[var(--text-main)]" : "text-[var(--text-dim)]"} />
                    <span className="text-xs font-semibold tracking-tight truncate font-sans">
                      {category.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/[0.05] text-[var(--text-dim)]">
                      {category.items.length}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-[var(--text-dim)] transition-transform duration-200 ${
                        isCategoryOpen ? "rotate-180 text-[var(--text-main)]" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Dropdown Items List */}
                {isCategoryOpen && (
                  <div className="p-1.5 pt-0.5 flex flex-col gap-1 border-t border-black/[0.04] dark:border-white/[0.04]">
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
                              ? "bg-black/[0.08] dark:bg-white/10 text-[var(--text-main)] font-medium border border-black/10 dark:border-white/20 shadow-sm"
                              : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-md shrink-0 mt-0.5 transition-colors ${
                              isActive
                                ? "bg-black/10 dark:bg-white/20 text-[var(--text-main)]"
                                : "bg-black/5 dark:bg-white/[0.04] text-[var(--text-dim)] group-hover:text-[var(--text-main)]"
                            }`}
                          >
                            <ToolIcon size={13} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold text-[var(--text-main)] truncate">
                                {tool.label}
                              </span>
                              <span
                                className={`text-[9px] font-mono font-bold px-1 rounded shrink-0 ${
                                  isActive
                                    ? "bg-black/10 dark:bg-white/20 text-[var(--text-main)]"
                                    : "bg-black/5 dark:bg-white/[0.04] text-[var(--text-dim)]"
                                }`}
                              >
                                {tool.tag}
                              </span>
                            </div>
                            <p className="text-[10px] text-[var(--text-dim)] truncate mt-0.5 font-sans">
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

      {/* ── Sidebar Footer / Quick Tools ── */}
      <div className="p-3 bg-[var(--bg-tile)] border-t border-black/[0.08] dark:border-white/[0.08] flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              if (onClose) onClose();
              window.dispatchEvent(new Event("toggle-console-drawer"));
            }}
            className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-black/5 dark:bg-white/[0.03] hover:bg-black/10 dark:hover:bg-white/[0.08] text-[var(--text-main)] text-xs font-mono border border-black/5 dark:border-white/[0.06] transition-colors cursor-pointer"
          >
            <Terminal size={12} className="text-[var(--text-main)]" />
            <span>Terminal</span>
          </button>

          <button
            onClick={() => {
              if (onClose) onClose();
              document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
            }}
            className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-black/5 dark:bg-white/[0.03] hover:bg-black/10 dark:hover:bg-white/[0.08] text-[var(--text-main)] text-xs font-mono border border-black/5 dark:border-white/[0.06] transition-colors cursor-pointer"
          >
            <Search size={12} className="text-[var(--text-dim)]" />
            <span>Search ⌘K</span>
          </button>
        </div>

        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-[var(--text-dim)] pt-1 border-t border-black/[0.04] dark:border-white/[0.04]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>Client RAM Sandbox</span>
          </span>
          <span className="text-[var(--text-main)] font-semibold">0B Cloud IO</span>
        </div>
      </div>
    </aside>
  );
}
