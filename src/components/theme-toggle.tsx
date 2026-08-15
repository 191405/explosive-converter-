"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle({ className = "" }: { showLabel?: boolean; className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 h-9 rounded-xl border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[var(--text-main)] shadow-sm cursor-pointer select-none group ${className}`}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {mounted ? (
            isDark ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center"
              >
                <Moon size={15} className="text-zinc-200 group-hover:text-white transition-colors" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center"
              >
                <Sun size={15} className="text-amber-500 group-hover:text-amber-600 transition-colors" />
              </motion.div>
            )
          ) : (
            <Moon size={15} className="text-zinc-400" />
          )}
        </AnimatePresence>
      </div>

      <motion.span
        key={mounted ? (isDark ? "Dark" : "Light") : "Theme"}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-xs font-mono font-medium text-[var(--text-main)]"
      >
        {mounted ? (isDark ? "Dark" : "Light") : "Theme"}
      </motion.span>
    </motion.button>
  );
}
