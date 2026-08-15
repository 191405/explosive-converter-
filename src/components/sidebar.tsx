"use client";

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
  BookOpen,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  tag?: string;
  tagColor?: string;
}

interface NavGroup {
  section: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    section: "Forensics & Synthetic Vectors",
    items: [
      { href: "/metadata", label: "Metadata & Steganography", icon: ShieldCheck, tag: "RAW" },
      { href: "/vectorize", label: "Raster to SVG Vectorizer", icon: Shapes, tag: "SVG" },
      { href: "/ocr", label: "Neural Document OCR", icon: ScanText, tag: "WASM" },
    ],
  },
  {
    section: "Spatial Audio & Media",
    items: [
      { href: "/dsp", label: "Spatial Audio & Stem Isolator", icon: Radio, tag: "DSP" },
      { href: "/animator", label: "Animated WebP / GIF Diff", icon: Film, tag: "DIFF" },
      { href: "/audio", label: "Audio Stream Converter", icon: Music },
      { href: "/trim", label: "Waveform PCM Slicer", icon: Scissors },
    ],
  },
  {
    section: "Code, Containers & Tools",
    items: [
      { href: "/data-morph", label: "Universal Code AST Morph", icon: Binary, tag: "AST" },
      { href: "/archive", label: "In-Memory Archive Studio", icon: Archive },
      { href: "/compress", label: "H.264 Video Compressor", icon: FileDown },
      { href: "/image", label: "Canvas Image Transcoder", icon: ImageIcon },
      { href: "/pdf", label: "PDF Document Studio", icon: FileText },
      { href: "/record", label: "Screen & Camera Recorder", icon: Video },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-[280px] h-screen fixed left-0 top-0 bg-[#090a0f] border-r border-white/[0.07] z-40 justify-between select-none">
        <div className="flex flex-col overflow-y-auto scrollbar-none">
          {/* Brand Header */}
          <div className="px-5 py-4 border-b border-white/[0.06] bg-[#0c0d13]">
            <Link href="/" className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 text-black flex items-center justify-center font-bold text-xs shadow-md shadow-amber-500/10">
                  <Zap size={15} className="fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                      Explosive
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-white/[0.08] text-zinc-300 px-1.5 py-0.2 rounded">
                      v2.0
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-sans block -mt-0.5">
                    Studio Engineering Suite
                  </span>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-400 led-active" title="WASM Engine Ready" />
            </Link>
          </div>

          {/* Nav Groups */}
          <nav className="p-3.5 flex flex-col gap-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.section} className="flex flex-col gap-1">
                <span className="px-2.5 py-1 text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
                  {group.section}
                </span>

                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href} className="group">
                        <div
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-sans transition-all ${
                            isActive
                              ? "bg-white/[0.08] text-white font-medium shadow-sm border border-white/[0.08]"
                              : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              size={15}
                              className={isActive ? "text-amber-400 shrink-0" : "text-zinc-500 group-hover:text-zinc-300 shrink-0"}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.tag && (
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold shrink-0 ml-2 ${
                                isActive
                                  ? "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                                  : "bg-white/[0.04] text-zinc-500 border border-white/[0.05]"
                              }`}
                            >
                              {item.tag}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-[#0c0d13] border-t border-white/[0.06] flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => window.dispatchEvent(new Event("toggle-console-drawer"))}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 text-xs font-mono border border-white/[0.06] transition-colors cursor-pointer"
            >
              <Terminal size={13} className="text-amber-400" />
              <span>Console</span>
            </button>

            <button
              onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 text-xs font-mono border border-white/[0.06] transition-colors cursor-pointer"
            >
              <Search size={13} className="text-zinc-400" />
              <span>Quick (⌘K)</span>
            </button>
          </div>

          <div className="flex items-center justify-between px-1 text-[10px] font-mono text-zinc-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>WASM SIMD 128</span>
            </span>
            <span>Zero Server IO</span>
          </div>
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-13 bg-[#090a0f]/95 backdrop-blur-md border-b border-white/[0.07] px-4 flex items-center justify-between z-40">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-md bg-amber-400 text-black flex items-center justify-center font-bold text-xs">
            <Zap size={13} className="fill-current" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">Explosive</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="p-2 rounded-md bg-white/[0.05] border border-white/[0.08] text-zinc-300"
          >
            <Search size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
