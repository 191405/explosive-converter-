"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Search,
  Terminal,
  HelpCircle,
  MessageSquarePlus,
  Menu,
  X,
  Radio,
  Shapes,
  FileDown,
  Binary,
  ShieldCheck,
  ScanText,
  FileText,
  Archive,
  Music,
  Scissors,
  Image as ImageIcon,
  Film,
  Video,
} from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAV_LINKS = [
    { href: "/metadata", label: "Forensics" },
    { href: "/vectorize", label: "Vectorizer" },
    { href: "/dsp", label: "Spatial DSP" },
    { href: "/compress", label: "Compress" },
    { href: "/data-morph", label: "AST Morph" },
    { href: "/pdf", label: "PDF Studio" },
  ];

  const ALL_TOOLS = [
    { href: "/dsp", label: "Spatial Audio DSP", icon: Radio, category: "Audio" },
    { href: "/audio", label: "Audio Transcoder", icon: Music, category: "Audio" },
    { href: "/trim", label: "Waveform Slicer", icon: Scissors, category: "Audio" },
    { href: "/vectorize", label: "SVG Vectorizer", icon: Shapes, category: "Forensics" },
    { href: "/metadata", label: "Metadata & Stego", icon: ShieldCheck, category: "Forensics" },
    { href: "/ocr", label: "Document OCR", icon: ScanText, category: "Forensics" },
    { href: "/compress", label: "Video Compressor", icon: FileDown, category: "Media" },
    { href: "/image", label: "Image Transcoder", icon: ImageIcon, category: "Media" },
    { href: "/animator", label: "Animated WebP/GIF", icon: Film, category: "Media" },
    { href: "/record", label: "Display Recorder", icon: Video, category: "Media" },
    { href: "/pdf", label: "PDF Document Studio", icon: FileText, category: "Documents" },
    { href: "/data-morph", label: "Code AST Morpher", icon: Binary, category: "Code" },
    { href: "/archive", label: "Archive Studio", icon: Archive, category: "Containers" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#090a0f]/95 backdrop-blur-md border-b border-white/[0.08] select-none">
        <div className="flex items-center justify-between h-13 px-3 sm:px-6 max-w-7xl mx-auto">
          {/* Brand & Category Navigation */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg neu-btn text-zinc-400 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-6 w-6 rounded-md bg-amber-400 text-black flex items-center justify-center font-bold text-xs shadow-sm group-hover:bg-amber-300 transition-colors">
                <Zap size={14} className="fill-current" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-tight text-white font-sans">
                  Explosive
                </span>
                <span className="text-[10px] font-mono text-zinc-500 font-normal hidden xs:inline">
                  Studio
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? "text-white bg-white/[0.08]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Global Command Search Bar & Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.07] transition-all text-xs font-sans cursor-pointer justify-between"
            >
              <div className="flex items-center gap-1.5">
                <Search size={13} className="text-zinc-500" />
                <span className="hidden sm:inline">Search tools...</span>
                <span className="sm:hidden">Search</span>
              </div>
              <kbd className="hidden sm:inline text-[10px] font-mono bg-white/[0.06] text-zinc-400 px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => window.dispatchEvent(new Event("toggle-console-drawer"))}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.07] transition-colors text-xs font-mono cursor-pointer"
              title="Toggle Console (`~`)"
            >
              <Terminal size={12} className="text-amber-400" />
              <span>Terminal</span>
            </button>

            <button
              onClick={() => window.dispatchEvent(new Event("open-system-tour"))}
              className="p-2 sm:p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.07] transition-colors cursor-pointer"
              title="System Guide"
            >
              <HelpCircle size={14} />
            </button>

            <button
              onClick={() => window.dispatchEvent(new Event("open-feedback-modal"))}
              className="p-2 sm:p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.07] transition-colors cursor-pointer"
              title="Feedback"
            >
              <MessageSquarePlus size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-35 lg:hidden bg-black/80 backdrop-blur-md pt-14 pb-12 px-4 overflow-y-auto font-sans">
          <div className="max-w-md mx-auto flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Workstation Directory
              </span>
              <span className="text-[10px] font-mono text-amber-400">100% In-Memory</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ALL_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isActive = pathname === tool.href;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-xl neu-btn flex items-center gap-3 transition-all ${
                      isActive ? "active text-amber-400" : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-black/40 text-amber-400 shrink-0">
                      <Icon size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">{tool.label}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{tool.category}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new Event("toggle-console-drawer"));
                }}
                className="neu-btn px-4 py-2 text-xs flex items-center gap-2 text-zinc-300"
              >
                <Terminal size={13} className="text-amber-400" />
                <span>Open Terminal</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new Event("open-cookie-settings"));
                }}
                className="text-xs font-mono text-zinc-500 hover:text-zinc-300"
              >
                Privacy Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
