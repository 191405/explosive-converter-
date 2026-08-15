"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Search,
  Menu,
  X,
} from "lucide-react";
import { Sidebar, SIDEBAR_CATEGORIES } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOpenSidebar = () => setDrawerOpen(true);
    window.addEventListener("open-sidebar", handleOpenSidebar);
    return () => window.removeEventListener("open-sidebar", handleOpenSidebar);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 select-none ${
          scrolled
            ? "bg-[var(--header-bg)] backdrop-blur-2xl border-b border-black/[0.08] dark:border-white/[0.06] shadow-lg shadow-black/5 dark:shadow-black/40"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-5 sm:px-8">
          {/* Left: Hamburger + Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer"
              aria-label="Open directory"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-200 text-white dark:text-black flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
                <Zap size={16} className="fill-current" />
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--text-main)]">
                Explosive
              </span>
            </Link>
          </div>

          {/* Center: Tabs — styled like e-commerce mega-nav */}
          <nav className="hidden lg:flex items-center h-full">
            {SIDEBAR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setDrawerOpen(true)}
                className="relative h-full flex items-center px-4 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors group cursor-pointer"
              >
                <span>{cat.name}</span>
                <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[var(--text-main)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>
            ))}
          </nav>

          {/* Right: Search + Theme Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() =>
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true })
                )
              }
              className="neu-btn h-9 flex items-center gap-2 px-3.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] text-[12px] transition-all cursor-pointer"
              title="Search (⌘K)"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline text-[10px] font-mono text-[var(--text-dim)] ml-1 px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/[0.05]">
                ⌘K
              </kbd>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Full-screen Slide Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-[var(--bg-main)] border-r border-black/[0.08] dark:border-white/[0.06] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
