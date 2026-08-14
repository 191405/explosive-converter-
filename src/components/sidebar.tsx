"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FileDown, Image, FileText, Zap, Search, Music, Scissors, Video, Monitor } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/", label: "Home", shortLabel: "Home", icon: Zap },
  { href: "/pdf", label: "PDF Studio", shortLabel: "PDF", icon: FileText },
  { href: "/image", label: "Image Transcoder", shortLabel: "Image", icon: Image },
  { href: "/compress", label: "Video Compressor", shortLabel: "Video", icon: FileDown },
  { href: "/audio", label: "Audio Converter", shortLabel: "Audio", icon: Music },
  { href: "/trim", label: "Audio Trimmer", shortLabel: "Trim", icon: Scissors },
  { href: "/record", label: "Screen Recorder", shortLabel: "Record", icon: Video, desktopOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Floating Sidebar ── */}
      <aside className="hidden md:flex flex-col w-[260px] h-[calc(100vh-48px)] fixed left-6 top-6 p-5 glass-panel z-40 justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3 mb-8 pl-2 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-text-primary text-bg-base transition-all shadow-md"
            >
              <Zap size={20} className="fill-current" />
            </motion.div>
            <div>
              <span className="text-lg font-bold tracking-tight text-text-primary group-hover:text-glow transition-all block leading-tight">
                Explosive
              </span>
              <span className="text-[10px] font-mono text-text-tertiary tracking-widest uppercase">
                Studio Suite
              </span>
            </div>
          </Link>

          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="relative group">
                  <div
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors relative z-10 ${
                      isActive ? "text-text-primary font-semibold" : "text-[#888888] hover:text-text-primary font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={17} strokeWidth={isActive ? 2 : 1.5} />
                      <span className="text-sm">
                        {item.label}
                      </span>
                    </div>
                    {item.desktopOnly && (
                      <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-text-primary/5 text-text-tertiary border border-border-subtle">
                        Desktop
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-text-primary/[0.08] border border-text-primary/[0.05] rounded-lg z-0"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => window.dispatchEvent(new Event("open-system-tour"))}
            className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-text-secondary hover:text-text-primary hover:bg-text-primary/5 transition-colors border border-border-subtle cursor-pointer text-left"
          >
            <FileText size={14} className="text-text-tertiary" />
            <span>Architecture & Guide</span>
          </button>

          <button
            onClick={() => window.dispatchEvent(new Event("open-feedback-modal"))}
            className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-text-secondary hover:text-text-primary hover:bg-text-primary/5 transition-colors border border-border-subtle cursor-pointer text-left"
          >
            <Zap size={14} className="text-text-tertiary" />
            <span>Suggest & Feedback</span>
          </button>

          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="flex items-center justify-between px-3 py-2 text-xs rounded-lg bg-text-primary/5 text-text-secondary hover:bg-text-primary/10 transition-colors border border-border-subtle cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search size={14} />
              <span>Quick Search</span>
            </div>
            <kbd className="font-mono bg-bg-surface px-1.5 py-0.5 rounded border border-border-subtle">⌘K</kbd>
          </button>

          <div className="pt-2.5 border-t border-border-subtle flex items-center justify-between">
            <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-[0.2em]">
              100% Client-Side
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* ── Mobile Top Sticky Header ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-bg-base/80 backdrop-blur-md border-b border-border-subtle z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-text-primary text-bg-base">
            <Zap size={16} className="fill-current" />
          </div>
          <span className="text-base font-bold tracking-tight text-text-primary">
            Explosive
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="p-2 rounded-lg bg-text-primary/5 text-text-primary/70 border border-border-subtle"
            aria-label="Search"
          >
            <Search size={16} />
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Mobile Bottom Horizontally Scrollable Dock ── */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 h-14 bg-bg-surface/90 backdrop-blur-xl border border-border-subtle rounded-2xl z-50 flex items-center px-2 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1 w-full overflow-x-auto scrollbar-none py-1 px-1 touch-pan-x">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0 transition-all ${
                  isActive
                    ? "text-text-primary font-semibold bg-text-primary/10"
                    : item.desktopOnly
                    ? "text-text-tertiary opacity-60"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-xs tracking-tight whitespace-nowrap">
                  {item.shortLabel}
                </span>
                {item.desktopOnly && (
                  <span className="text-[8px] font-mono bg-text-primary/10 px-1 py-0.2 rounded text-text-tertiary">
                    PC
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="mobile-pill-active"
                    className="absolute inset-0 border border-text-primary/20 rounded-xl pointer-events-none"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
