"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Search,
  Terminal,
  Menu,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";
import { Sidebar, SIDEBAR_CATEGORIES } from "@/components/sidebar";

export function AppHeader() {
  const pathname = usePathname();
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Close dropdown on route change
  useEffect(() => {
    setSidebarDrawerOpen(false);
    setCategoryDropdownOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Floating Minimalist Pill Header */}
      <header className="sticky top-3 z-40 w-full px-3 sm:px-6 select-none">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-12 px-3 sm:px-5 rounded-full bg-[#0a0c12]/85 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/80 transition-all">
          
          {/* Brand Mark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarDrawerOpen(true)}
              className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.07] transition-all flex items-center gap-1.5 cursor-pointer"
              aria-label="Open tool directory sidebar"
            >
              <Menu size={14} />
              <span className="text-[11px] font-semibold font-sans hidden sm:inline px-1">Directory</span>
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-6 w-6 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-[11px] shadow-sm shadow-amber-400/20 group-hover:scale-105 transition-transform">
                <Zap size={13} className="fill-current" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold tracking-tight text-white font-sans group-hover:text-amber-300 transition-colors">
                  Explosive
                </span>
                <span className="text-[9px] font-mono text-zinc-400 font-medium px-1.5 py-0.5 rounded-full bg-white/[0.06] hidden md:inline">
                  Studio
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links (Aethera Pill Style) */}
          <nav className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-zinc-400">
            <Link
              href="/"
              className={`px-3 py-1 rounded-full transition-colors ${
                pathname === "/" ? "text-white bg-white/[0.06]" : "hover:text-zinc-200"
              }`}
            >
              Overview
            </Link>

            <span className="text-zinc-600 text-[9px]">•</span>

            {/* Desktop Category Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1 px-3 py-1 rounded-full hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <span>Suites</span>
                <ChevronDown
                  size={11}
                  className={`transition-transform duration-150 ${
                    categoryDropdownOpen ? "rotate-180 text-amber-400" : "text-zinc-500"
                  }`}
                />
              </button>

              {/* Desktop Category Flyout */}
              {categoryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCategoryDropdownOpen(false)}
                  />
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[480px] rounded-2xl bg-[#0c0e15]/95 backdrop-blur-2xl border border-white/[0.1] shadow-2xl shadow-black/90 p-3 z-50 grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-100">
                    {SIDEBAR_CATEGORIES.map((cat) => {
                      const CatIcon = cat.icon;
                      return (
                        <div
                          key={cat.id}
                          className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-amber-400/30 hover:bg-white/[0.04] transition-all"
                        >
                          <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-zinc-200">
                            <CatIcon size={13} className="text-amber-400" />
                            <span>{cat.name}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            {cat.items.slice(0, 3).map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setCategoryDropdownOpen(false)}
                                className="text-[11px] text-zinc-400 hover:text-white truncate flex items-center justify-between"
                              >
                                <span>{item.label}</span>
                                <span className="text-[9px] font-mono text-zinc-500">{item.tag}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <span className="text-zinc-600 text-[9px]">•</span>

            <a href="/#guidelines" className="px-3 py-1 rounded-full hover:text-zinc-200 transition-colors">
              Guidelines
            </a>

            <span className="text-zinc-600 text-[9px]">•</span>

            <a href="/#comparison" className="px-3 py-1 rounded-full hover:text-zinc-200 transition-colors">
              Security
            </a>

            <span className="text-zinc-600 text-[9px]">•</span>

            <a href="/#faq" className="px-3 py-1 rounded-full hover:text-zinc-200 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Quick Actions (Right) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true })
                )
              }
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] text-[11px] font-sans transition-all cursor-pointer"
              title="Search tool registry (⌘K)"
            >
              <Search size={12} className="text-amber-400/80" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block text-[9px] font-mono text-zinc-500 px-1 rounded bg-white/[0.04]">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => {
                const event = new CustomEvent("toggle-console");
                window.dispatchEvent(event);
              }}
              className="p-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.07] text-zinc-400 hover:text-white border border-white/[0.05] transition-colors cursor-pointer"
              title="Toggle Hardware Terminal (~)"
            >
              <Terminal size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Mobile & Global Sidebar Drawer */}
      {sidebarDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarDrawerOpen(false)}
          />

          {/* Drawer Content Panel */}
          <div className="relative w-full max-w-sm bg-[#08090d] border-r border-white/[0.08] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setSidebarDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
