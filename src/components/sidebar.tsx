"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavGroup {
  category: string;
  items: {
    href: string;
    label: string;
    icon: any;
    badge?: string;
    desktopOnly?: boolean;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    category: "Pro Engineering & Forensics",
    items: [
      { href: "/metadata", label: "Metadata & Stego", icon: ShieldCheck, badge: "PRO" },
      { href: "/vectorize", label: "Raster to Vector", icon: Shapes, badge: "SVG" },
      { href: "/ocr", label: "Client-Side OCR", icon: ScanText, badge: "WASM" },
      { href: "/dsp", label: "Spatial Audio DSP", icon: Radio, badge: "DSP" },
      { href: "/animator", label: "Animation Diff", icon: Film, badge: "DIFF" },
      { href: "/data-morph", label: "Data AST Morph", icon: Binary, badge: "AST" },
      { href: "/archive", label: "Archive Repacker", icon: Archive, badge: "IO" },
    ],
  },
  {
    category: "Core Media & Documents",
    items: [
      { href: "/pdf", label: "PDF Studio", icon: FileText },
      { href: "/image", label: "Image Transcoder", icon: ImageIcon },
      { href: "/compress", label: "Video Compressor", icon: FileDown },
      { href: "/audio", label: "Audio Converter", icon: Music },
      { href: "/trim", label: "Audio Trimmer", icon: Scissors },
      { href: "/record", label: "Screen Recorder", icon: Video, desktopOnly: true },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Pro Sidebar ── */}
      <aside className="hidden md:flex flex-col w-[280px] h-[calc(100vh-24px)] fixed left-3 top-3 p-4 bg-[#09090c] border border-white/[0.08] rounded-xl z-40 justify-between overflow-y-auto scrollbar-none shadow-2xl">
        <div className="flex flex-col gap-5">
          {/* Brand Header */}
          <Link href="/" className="flex items-center gap-3 px-2 py-1 group">
            <div className="p-2 rounded-lg bg-white text-black transition-all shadow-md group-hover:scale-105">
              <Zap size={18} className="fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white block leading-tight">
                  Explosive
                </span>
                <span className="text-[9px] font-mono uppercase bg-white/[0.08] text-zinc-400 px-1 py-0.2 rounded border border-white/[0.06]">
                  v2.0
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase">
                Studio Engineering
              </span>
            </div>
          </Link>

          {/* Nav Groups */}
          <nav className="flex flex-col gap-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.category} className="flex flex-col gap-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2.5 mb-1 font-semibold">
                  {group.category}
                </span>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} className="relative group">
                      <div
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-md transition-all text-xs relative z-10 ${
                          isActive
                            ? "text-white font-semibold bg-white/[0.08] border border-white/[0.1]"
                            : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            size={15}
                            className={isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[8px] font-mono px-1 py-0.2 rounded border ${
                              item.badge === "PRO"
                                ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                : item.badge === "WASM"
                                ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                                : "bg-white/[0.05] text-zinc-400 border-white/[0.06]"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.desktopOnly && (
                          <span className="text-[8px] font-mono uppercase px-1 py-0.2 rounded bg-white/[0.04] text-zinc-500 border border-white/[0.04]">
                            PC
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 pt-4 border-t border-white/[0.06] mt-4">
          <button
            onClick={() => window.dispatchEvent(new Event("toggle-console-drawer"))}
            className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors border border-white/[0.06] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-amber-400" />
              <span>Stdout Terminal</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500">`~`</span>
          </button>

          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors border border-white/[0.06] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-zinc-500" />
              <span>Command Deck</span>
            </div>
            <kbd className="text-[9px] font-mono bg-white/[0.06] px-1 rounded text-zinc-400">⌘K</kbd>
          </button>

          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-zinc-500 font-mono">
            <span>100% In-Memory WASM</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* ── Mobile Header & Bottom Navigation Bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#09090c]/90 backdrop-blur-md border-b border-white/[0.08] px-4 flex items-center justify-between z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-white text-black">
            <Zap size={14} className="fill-current" />
          </div>
          <span className="text-sm font-bold text-white">Explosive Studio</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="p-1.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-300"
          >
            <Search size={14} />
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#09090c]/95 backdrop-blur-lg border-t border-white/[0.08] px-3 flex items-center justify-around z-40">
        <Link href="/" className={`flex flex-col items-center gap-0.5 text-[10px] ${pathname === "/" ? "text-white" : "text-zinc-500"}`}>
          <Zap size={16} />
          <span>Home</span>
        </Link>
        <Link href="/metadata" className={`flex flex-col items-center gap-0.5 text-[10px] ${pathname === "/metadata" ? "text-white" : "text-zinc-500"}`}>
          <ShieldCheck size={16} />
          <span>Forensics</span>
        </Link>
        <Link href="/vectorize" className={`flex flex-col items-center gap-0.5 text-[10px] ${pathname === "/vectorize" ? "text-white" : "text-zinc-500"}`}>
          <Shapes size={16} />
          <span>Vector</span>
        </Link>
        <Link href="/ocr" className={`flex flex-col items-center gap-0.5 text-[10px] ${pathname === "/ocr" ? "text-white" : "text-zinc-500"}`}>
          <ScanText size={16} />
          <span>OCR</span>
        </Link>
        <Link href="/data-morph" className={`flex flex-col items-center gap-0.5 text-[10px] ${pathname === "/data-morph" ? "text-white" : "text-zinc-500"}`}>
          <Binary size={16} />
          <span>Morph</span>
        </Link>
      </div>
    </>
  );
}
