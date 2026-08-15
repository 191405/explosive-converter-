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
  Sliders,
  Cpu,
} from "lucide-react";

interface NavGroup {
  section: string;
  code: string;
  items: {
    href: string;
    label: string;
    icon: any;
    tag: string;
    desktopOnly?: boolean;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    section: "Forensics & Synthetic Vectors",
    code: "SEC-01",
    items: [
      { href: "/metadata", label: "Metadata & Stego Scrubber", icon: ShieldCheck, tag: "RAW" },
      { href: "/vectorize", label: "Raster to SVG Vectorizer", icon: Shapes, tag: "VEC" },
      { href: "/ocr", label: "Neural Document OCR", icon: ScanText, tag: "WASM" },
    ],
  },
  {
    section: "Spatial Audio & Animated Media",
    code: "DSP-02",
    items: [
      { href: "/dsp", label: "Spatial DSP & Stem Isolator", icon: Radio, tag: "DSP" },
      { href: "/animator", label: "Animated WebP/GIF Diff", icon: Film, tag: "DIFF" },
      { href: "/audio", label: "Audio Stream Converter", icon: Music, tag: "CODEC" },
      { href: "/trim", label: "Waveform PCM Slicer", icon: Scissors, tag: "PCM" },
    ],
  },
  {
    section: "Code, Archives & Containers",
    code: "DATA-03",
    items: [
      { href: "/data-morph", label: "Universal Code AST Morph", icon: Binary, tag: "AST" },
      { href: "/archive", label: "In-Memory Archive Studio", icon: Archive, tag: "IO" },
      { href: "/compress", label: "H.264 Video Compressor", icon: FileDown, tag: "x264" },
      { href: "/image", label: "Pro Canvas Transcoder", icon: ImageIcon, tag: "GPU" },
      { href: "/pdf", label: "PDF Document Studio", icon: FileText, tag: "DOC" },
      { href: "/record", label: "Screen & Hardware Capture", icon: Video, tag: "REC", desktopOnly: true },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Studio Hardware Rack Sidebar ── */}
      <aside className="hidden md:flex flex-col w-[260px] h-screen fixed left-0 top-0 bg-[#08090d] border-r border-white/[0.08] z-40 justify-between select-none">
        <div className="flex flex-col overflow-y-auto scrollbar-none">
          {/* Studio Brand Deck */}
          <div className="px-4 py-4 border-b border-white/[0.08] bg-[#0c0d12]">
            <Link href="/" className="flex items-center justify-between group">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded bg-amber-400 text-black flex items-center justify-center font-bold text-xs shadow-sm">
                  <Zap size={14} className="fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
                      EXPLOSIVE
                    </span>
                    <span className="text-[9px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1 rounded font-bold">
                      PRO
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase block -mt-0.5">
                    ENGINEERING SUITE
                  </span>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-400 led-active" title="WASM Core Ready" />
            </Link>
          </div>

          {/* Navigation Groups */}
          <nav className="p-3 flex flex-col gap-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.code} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between px-2 py-1 text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">
                  <span>{group.section}</span>
                  <span className="text-zinc-600 font-normal">{group.code}</span>
                </div>

                <div className="flex flex-col gap-0.5 mt-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href} className="relative group">
                        <div
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded transition-all text-xs font-mono ${
                            isActive
                              ? "bg-[#141720] text-white font-semibold border border-white/[0.12] shadow-sm"
                              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon
                              size={14}
                              className={isActive ? "text-amber-400" : "text-zinc-500 group-hover:text-zinc-300"}
                            />
                            <span className="truncate max-w-[130px]">{item.label}</span>
                          </div>
                          <span
                            className={`text-[8px] font-mono px-1 py-0.2 rounded border ${
                              isActive
                                ? "bg-amber-400/10 text-amber-400 border-amber-400/30 font-bold"
                                : "bg-white/[0.03] text-zinc-600 border-white/[0.04]"
                            }`}
                          >
                            {item.tag}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Studio Hardware Diagnostics Footer */}
        <div className="p-3 bg-[#0c0d12] border-t border-white/[0.08] flex flex-col gap-2 font-mono text-[11px]">
          <button
            onClick={() => window.dispatchEvent(new Event("toggle-console-drawer"))}
            className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#141720] hover:bg-[#1a1f2b] text-zinc-300 border border-white/[0.06] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Terminal size={12} className="text-amber-400" />
              <span>TERMINAL STDOUT</span>
            </div>
            <span className="text-[9px] text-zinc-500">`~`</span>
          </button>

          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#141720] hover:bg-[#1a1f2b] text-zinc-300 border border-white/[0.06] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search size={12} className="text-zinc-500" />
              <span>QUICK ACTIONS</span>
            </div>
            <kbd className="text-[9px] bg-white/[0.06] px-1 rounded text-zinc-400">⌘K</kbd>
          </button>

          <div className="flex items-center justify-between px-1 text-[9px] text-zinc-500 pt-1 border-t border-white/[0.04]">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>WASM SIMD 128</span>
            </span>
            <span>100% IN-MEMORY</span>
          </div>
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-12 bg-[#08090d]/95 backdrop-blur-md border-b border-white/[0.08] px-3 flex items-center justify-between z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-amber-400 text-black flex items-center justify-center font-bold text-xs">
            <Zap size={12} className="fill-current" />
          </div>
          <span className="text-xs font-mono font-bold text-white tracking-wider">EXPLOSIVE PRO</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="p-1 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-300"
          >
            <Search size={13} />
          </button>
        </div>
      </div>
    </>
  );
}
