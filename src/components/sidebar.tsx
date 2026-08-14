"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FileDown, Image, FileText, Zap, Search, Music, Scissors, Video } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Zap },
  { href: "/pdf", label: "PDF Studio", icon: FileText },
  { href: "/image", label: "Image Convert", icon: Image },
  { href: "/compress", label: "Video Compress", icon: FileDown },
  { href: "/audio", label: "Audio Convert", icon: Music },
  { href: "/trim", label: "Audio Trimmer", icon: Scissors },
  { href: "/record", label: "Screen Recorder", icon: Video },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Floating Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] h-[calc(100vh-48px)] fixed left-6 top-6 p-5 glass-panel z-40 justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3 mb-10 pl-2 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-text-primary text-bg-base transition-all"
            >
              <Zap size={20} className="fill-black" />
            </motion.div>
            <span className="text-lg font-bold tracking-tight text-text-primary group-hover:text-glow transition-all">
              Explosive
            </span>
          </Link>

          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="relative group">
                  <div
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors relative z-10 ${
                      isActive ? "text-text-primary" : "text-[#888888] group-hover:text-text-primary"
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                    <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
                      {item.label}
                    </span>
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

        <div className="flex flex-col gap-4">
          <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
            <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-[0.2em]">
              100% Client-Side
            </div>
            <ThemeToggle />
          </div>
          
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="flex items-center justify-between px-3 py-2 text-xs rounded-lg bg-text-primary/5 text-text-secondary hover:bg-text-primary/10 transition-colors border border-border-subtle"
          >
            <div className="flex items-center gap-2">
              <Search size={14} />
              <span>Quick Search</span>
            </div>
            <kbd className="font-mono bg-bg-surface px-1.5 py-0.5 rounded border border-border-subtle">⌘K</kbd>
          </button>
        </div>
      </aside>

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 glass-panel z-50 flex items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center p-2 w-14 h-14">
              <div className={`relative z-10 transition-colors ${isActive ? "text-text-primary" : "text-text-secondary"}`}>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              </div>
              {isActive && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute inset-1 bg-text-primary/[0.08] border border-text-primary/[0.05] rounded-lg z-0"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </Link>
          );
        })}
        <div className="w-px h-8 bg-border-subtle mx-1" />
        <ThemeToggle />
      </nav>
    </>
  );
}
