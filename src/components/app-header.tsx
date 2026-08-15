"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Search,
  Terminal,
  ShieldCheck,
  Radio,
  Binary,
  Layers,
  HelpCircle,
  MessageSquarePlus,
  Cpu,
} from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();

  const NAV_LINKS = [
    { href: "/metadata", label: "Forensics" },
    { href: "/vectorize", label: "Vectorizer" },
    { href: "/dsp", label: "Spatial DSP" },
    { href: "/compress", label: "Compress" },
    { href: "/data-morph", label: "AST Morph" },
    { href: "/pdf", label: "PDF Studio" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090a0f]/95 backdrop-blur-md border-b border-white/[0.08] select-none">
      <div className="flex items-center justify-between h-13 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Brand & Category Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-6 w-6 rounded-md bg-amber-400 text-black flex items-center justify-center font-bold text-xs shadow-sm group-hover:bg-amber-300 transition-colors">
              <Zap size={14} className="fill-current" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-white font-sans">
                Explosive
              </span>
              <span className="text-[10px] font-mono text-zinc-500 font-normal">
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
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
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

        {/* Global Command Search Bar */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.07] transition-all text-xs font-sans cursor-pointer w-44 sm:w-56 justify-between"
          >
            <div className="flex items-center gap-1.5">
              <Search size={13} className="text-zinc-500" />
              <span>Search tools...</span>
            </div>
            <kbd className="text-[10px] font-mono bg-white/[0.06] text-zinc-400 px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => window.dispatchEvent(new Event("toggle-console-drawer"))}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.07] transition-colors text-xs font-mono cursor-pointer"
            title="Toggle Console (`~`)"
          >
            <Terminal size={12} className="text-amber-400" />
            <span>Terminal</span>
          </button>

          <button
            onClick={() => window.dispatchEvent(new Event("open-system-tour"))}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.07] transition-colors cursor-pointer"
            title="System Guide"
          >
            <HelpCircle size={14} />
          </button>

          <button
            onClick={() => window.dispatchEvent(new Event("open-feedback-modal"))}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.07] transition-colors cursor-pointer"
            title="Feedback"
          >
            <MessageSquarePlus size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
