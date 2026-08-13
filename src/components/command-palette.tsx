"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Zap, Image as ImageIcon, FileDown, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-text-primary/40 backdrop-blur-sm flex items-start justify-center pt-32"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Command
              className="bg-bg-surface border border-border-focus rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <Command.Input 
                autoFocus
                placeholder="Search tools..." 
                className="w-full bg-transparent border-none px-4 py-4 text-text-primary text-sm focus:outline-none focus:ring-0 placeholder:text-text-tertiary"
              />
              <Command.List className="max-h-[300px] overflow-y-auto p-2 border-t border-border-subtle scrollbar-hide">
                <Command.Empty className="py-6 text-center text-sm text-text-secondary">
                  No tools found.
                </Command.Empty>
                <Command.Group heading="Tools" className="text-xs font-mono text-text-tertiary px-2 py-1 uppercase tracking-wider mb-2">
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-text-primary aria-selected:bg-text-primary/10 cursor-pointer transition-colors"
                  >
                    <Zap size={16} className="text-text-secondary" />
                    Home
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/pdf"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-text-primary aria-selected:bg-text-primary/10 cursor-pointer transition-colors"
                  >
                    <FileText size={16} className="text-text-secondary" />
                    PDF Studio
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/image"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-text-primary aria-selected:bg-text-primary/10 cursor-pointer transition-colors"
                  >
                    <ImageIcon size={16} className="text-text-secondary" />
                    Image Convert
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/compress"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-text-primary aria-selected:bg-text-primary/10 cursor-pointer transition-colors"
                  >
                    <FileDown size={16} className="text-text-secondary" />
                    Video Compress
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
