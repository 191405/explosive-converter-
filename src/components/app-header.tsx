"use client";

import { useState, useEffect } from "react";
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
  LayoutGrid,
  ChevronDown,
  ShieldCheck,
  Radio,
  Binary,
  Video,
  FileText,
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
      <header className="sticky top-0 z-40 w-full bg-[#08090d]/95 backdrop-blur-md border-b border-white/[0.08] select-none">
        <div className="flex items-center justify-between h-14 px-3 sm:px-6 max-w-7xl mx-auto">
          {/* Brand & Category Navigation */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Mobile / Global Sidebar Drawer Trigger */}
            <button
              onClick={() => setSidebarDrawerOpen(true)}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.07] transition-colors flex items-center gap-1.5 cursor-pointer"
              aria-label="Open tool directory sidebar"
            >
              <Menu size={16} />
              <span className="text-xs font-semibold font-sans hidden sm:inline">Directory</span>
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-7 w-7 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold text-xs shadow-md shadow-amber-400/10 group-hover:bg-amber-300 transition-colors">
                <Zap size={15} className="fill-current" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-tight text-white font-sans group-hover:text-amber-300 transition-colors">
                  Explosive
                </span>
                <span className="text-[10px] font-mono text-zinc-400 font-medium px-1.5 py-0.5 rounded bg-white/[0.06] hidden xs:inline">
                  Studio
                </span>
              </div>
            </Link>

            {/* Desktop Category Dropdown Tab */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 hover:text-white border border-white/[0.06] transition-all text-xs font-sans cursor-pointer"
              >
                <LayoutGrid size={13} className="text-amber-400" />
                <span>Workstation Suites</span>
                <ChevronDown
                  size={13}
                  className={`text-zinc-500 transition-transform duration-150 ${
                    categoryDropdownOpen ? "rotate-180 text-amber-400" : ""
                  }`}
                />
              </button>

              {/* Desktop Category Dropdown Flyout */}
              {categoryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCategoryDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-[520px] rounded-2xl bg-[#0c0d15] border border-white/[0.1] shadow-2xl shadow-black/80 p-3 z-50 grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-100">
                    {SIDEBAR_CATEGORIES.map((cat) => {
                      const CatIcon = cat.icon;
                      return (
                        <div
                          key={cat.id}
                          className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-amber-400/30 hover:bg-white/[0.04] transition-all"
                        >
                          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-zinc-200">
                            <CatIcon size={14} className="text-amber-400" />
                            <span>{cat.name}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            {cat.items.map((tool) => (
                              <Link
                                key={tool.href}
                                href={tool.href}
                                onClick={() => setCategoryDropdownOpen(false)}
                                className="flex items-center justify-between px-2 py-1 rounded text-[11px] text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                              >
                                <span className="truncate">{tool.label}</span>
                                <span className="text-[9px] font-mono text-zinc-500">{tool.tag}</span>
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

            {/* Quick Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/metadata"
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  pathname === "/metadata"
                    ? "text-white bg-white/[0.08]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                }`}
              >
                Forensics
              </Link>
              <Link
                href="/dsp"
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  pathname === "/dsp"
                    ? "text-white bg-white/[0.08]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                }`}
              >
                Spatial DSP
              </Link>
              <Link
                href="/hex-diff"
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  pathname === "/hex-diff"
                    ? "text-white bg-white/[0.08]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                }`}
              >
                Hex Diff
              </Link>
              <Link
                href="/crypto-vault"
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  pathname === "/crypto-vault"
                    ? "text-white bg-white/[0.08]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                }`}
              >
                Crypto Vault
              </Link>
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
                <span className="hidden sm:inline">Search directory...</span>
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
              title="System Guidelines & Instructions"
            >
              <HelpCircle size={14} />
            </button>

            <button
              onClick={() => window.dispatchEvent(new Event("open-feedback-modal"))}
              className="p-2 sm:p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.07] transition-colors cursor-pointer"
              title="Send Feedback"
            >
              <MessageSquarePlus size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Slide-Over Sidebar Drawer (Mobile & Desktop) ── */}
      {sidebarDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarDrawerOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-[320px] sm:max-w-[360px] h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar isOpen={sidebarDrawerOpen} onClose={() => setSidebarDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
