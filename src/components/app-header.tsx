"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Search,
  Menu,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { Sidebar, SIDEBAR_CATEGORIES, type ToolCategory } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

export function AppHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDrawerOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleOpenSidebar = () => setDrawerOpen(true);
    window.addEventListener("open-sidebar", handleOpenSidebar);
    return () => window.removeEventListener("open-sidebar", handleOpenSidebar);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile drawer is open to prevent floating/bouncing
  useEffect(() => {
    if (drawerOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
      };
    }
  }, [drawerOpen]);

  const handleMouseEnter = (catId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredCat(catId);
    setActiveDropdown(catId);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCat(null);
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 select-none ${
          scrolled
            ? "bg-[var(--header-bg)] backdrop-blur-2xl border-b border-black/[0.08] dark:border-white/[0.06] shadow-lg shadow-black/5 dark:shadow-black/40"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-8">
          {/* Left: Hamburger + Brand */}
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setDrawerOpen(true)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer"
              aria-label="Open directory"
            >
              <Menu size={20} strokeWidth={1.5} />
            </motion.button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="h-8 w-8 rounded-lg bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-black dark:text-white flex items-center justify-center shadow-md transition-colors"
              >
                <Zap size={16} className="fill-current text-black dark:text-white" />
              </motion.div>
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--text-main)]">
                Explosive
              </span>
            </Link>
          </div>

          {/* Center: Desktop Category Tabs with Direct Navigation & Dropdown Popovers */}
          <nav className="hidden lg:flex items-center h-full gap-1" onMouseLeave={handleMouseLeave}>
            {SIDEBAR_CATEGORIES.map((cat: ToolCategory) => {
              const primaryHref = cat.items[0]?.href || "/";
              const isCatActive = cat.items.some((item) => item.href === pathname);
              const isHovered = hoveredCat === cat.id;

              return (
                <div
                  key={cat.id}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                >
                  <Link
                    href={primaryHref}
                    className={`relative h-full flex items-center gap-1.5 px-3.5 text-[13px] font-medium transition-colors cursor-pointer ${
                      isCatActive
                        ? "text-[var(--text-main)] font-semibold"
                        : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    <span className="relative z-10">{cat.name}</span>
                    <ChevronDown
                      size={12}
                      className={`relative z-10 transition-transform duration-200 ${
                        activeDropdown === cat.id ? "rotate-180 text-[var(--text-main)]" : "text-[var(--text-dim)]"
                      }`}
                    />

                    {(isHovered || isCatActive) && (
                      <motion.span
                        layoutId="header-category-underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-[var(--text-main)] rounded-full"
                      />
                    )}
                  </Link>

                  {/* Category Dropdown Menu */}
                  <AnimatePresence>
                    {activeDropdown === cat.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-[58px] left-1/2 -translate-x-1/2 w-72 rounded-2xl bg-[var(--bg-main)]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-2xl p-2 z-50 flex flex-col gap-1"
                        onMouseEnter={() => handleMouseEnter(cat.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="px-3 py-2 border-b border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[var(--text-main)] uppercase tracking-wider font-mono">
                            {cat.name}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-dim)]">
                            {cat.items.length} tools
                          </span>
                        </div>

                        <div className="flex flex-col gap-0.5 py-1">
                          {cat.items.map((item) => {
                            const ItemIcon = item.icon;
                            const isCurrent = pathname === item.href;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className={`flex items-start gap-2.5 px-2.5 py-2 rounded-xl transition-all ${
                                  isCurrent
                                    ? "bg-black/[0.06] dark:bg-white/[0.08] text-[var(--text-main)]"
                                    : "hover:bg-black/[0.03] dark:hover:bg-white/[0.04] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                                }`}
                              >
                                <div className="p-1.5 rounded-lg bg-[var(--bg-tile)] border border-black/[0.06] dark:border-white/[0.06] shrink-0 mt-0.5">
                                  <ItemIcon size={13} className="text-[var(--text-main)]" />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-medium text-[var(--text-main)] truncate">
                                      {item.label}
                                    </span>
                                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/5 dark:bg-white/5 text-[var(--text-dim)] shrink-0">
                                      {item.tag}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-[var(--text-dim)] line-clamp-1">
                                    {item.sublabel}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        <div className="pt-1 border-t border-black/[0.04] dark:border-white/[0.04]">
                          <Link
                            href={primaryHref}
                            onClick={() => setActiveDropdown(null)}
                            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-medium text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                          >
                            <span>Open {cat.name} workstation</span>
                            <ArrowRight size={11} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Right: Search + Theme Toggle */}
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
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
            </motion.button>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Full-screen Slide Drawer with Spring Physics & Locked Touch Container */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex h-[100dvh] w-screen overflow-hidden touch-none pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.8 }}
              className="relative w-[85vw] max-w-[340px] sm:max-w-sm bg-[var(--bg-main)] border-r border-black/[0.08] dark:border-white/[0.06] h-[100dvh] shadow-2xl flex flex-col z-10 overscroll-contain touch-auto"
            >
              <Sidebar onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
