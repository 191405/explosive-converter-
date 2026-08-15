"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl opacity-0" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="neu-btn relative flex items-center justify-center w-9 h-9 rounded-xl text-[var(--text-main)] transition-all cursor-pointer overflow-hidden p-0"
      aria-label="Toggle light/dark theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50 pointer-events-none"
        }`}
      >
        <Moon size={16} strokeWidth={2} />
      </div>
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          !isDark ? "opacity-100 rotate-0 scale-100 text-amber-500" : "opacity-0 rotate-90 scale-50 pointer-events-none"
        }`}
      >
        <Sun size={16} strokeWidth={2} className="text-zinc-900 dark:text-amber-500" />
      </div>
    </button>
  );
}
