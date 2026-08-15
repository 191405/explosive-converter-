"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ showLabel = false, className = "" }: { showLabel?: boolean; className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 h-9 rounded-xl border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[var(--text-main)] shadow-sm transition-all duration-200 cursor-pointer select-none group ${className}`}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        {mounted ? (
          isDark ? (
            <Moon size={15} className="text-zinc-200 group-hover:text-white transition-colors" />
          ) : (
            <Sun size={15} className="text-amber-500 group-hover:text-amber-600 transition-colors" />
          )
        ) : (
          <Moon size={15} className="text-zinc-400" />
        )}
      </div>

      <span className="text-xs font-mono font-medium text-[var(--text-main)]">
        {mounted ? (isDark ? "Dark" : "Light") : "Theme"}
      </span>
    </button>
  );
}
