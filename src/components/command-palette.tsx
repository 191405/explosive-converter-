"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  Zap,
  Image as ImageIcon,
  FileDown,
  FileText,
  Music,
  Scissors,
  Video,
  ShieldCheck,
  Shapes,
  ScanText,
  Radio,
  Film,
  Binary,
  Archive,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TOOLS = [
  { href: "/metadata", label: "Metadata & Steganography Inspector", icon: ShieldCheck, category: "Forensics & Vectors" },
  { href: "/vectorize", label: "Raster to SVG Vectorizer", icon: Shapes, category: "Forensics & Vectors" },
  { href: "/ocr", label: "Client-Side Document OCR", icon: ScanText, category: "Forensics & Vectors" },
  { href: "/dsp", label: "Spatial Audio DSP & Stem Isolator", icon: Radio, category: "Spatial Audio & Video" },
  { href: "/animator", label: "Animated WebP & GIF Diff", icon: Film, category: "Spatial Audio & Video" },
  { href: "/data-morph", label: "Universal Code & AST Morph", icon: Binary, category: "Data & Documents" },
  { href: "/archive", label: "Archive Inspector & Repacker", icon: Archive, category: "Data & Documents" },
  { href: "/compress", label: "Video Compressor", icon: FileDown, category: "Core Tools" },
  { href: "/image", label: "Image Transcoder", icon: ImageIcon, category: "Core Tools" },
  { href: "/audio", label: "Audio Converter", icon: Music, category: "Core Tools" },
  { href: "/trim", label: "Audio Trimmer", icon: Scissors, category: "Core Tools" },
  { href: "/pdf", label: "PDF Studio", icon: FileText, category: "Core Tools" },
  { href: "/record", label: "Screen Recorder", icon: Video, category: "Core Tools" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "`" && !e.metaKey && !e.ctrlKey) {
        // Toggle terminal on tilde
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          window.dispatchEvent(new Event("toggle-console-drawer"));
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Command className="bg-[#0e0e12] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden flex flex-col font-sans">
              <Command.Input
                autoFocus
                placeholder="Type a tool name or command..."
                className="w-full bg-transparent border-none px-4 py-3.5 text-zinc-100 text-sm focus:outline-none placeholder:text-zinc-500 font-mono"
              />

              <Command.List className="max-h-[320px] overflow-y-auto p-2 border-t border-white/[0.08] scrollbar-none font-mono text-xs">
                <Command.Empty className="py-8 text-center text-xs text-zinc-500">
                  No tools found matching query.
                </Command.Empty>

                <Command.Group heading="Studio Engineering Tools" className="text-[10px] text-zinc-500 px-2 py-1 uppercase tracking-wider font-semibold">
                  {TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Command.Item
                        key={tool.href}
                        onSelect={() => runCommand(() => router.push(tool.href))}
                        className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-white/[0.08] cursor-pointer text-zinc-300 hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={15} className="text-zinc-400" />
                          <span>{tool.label}</span>
                        </div>
                        <span className="text-[10px] text-zinc-600 uppercase">{tool.category}</span>
                      </Command.Item>
                    );
                  })}
                </Command.Group>

                <Command.Group heading="Diagnostics & DevTools" className="text-[10px] text-zinc-500 px-2 py-1 uppercase tracking-wider font-semibold mt-2">
                  <Command.Item
                    onSelect={() =>
                      runCommand(() => window.dispatchEvent(new Event("toggle-console-drawer")))
                    }
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-white/[0.08] cursor-pointer text-zinc-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Terminal size={15} className="text-amber-400" />
                      <span>Toggle Stdout Terminal Drawer</span>
                    </div>
                    <kbd className="text-[10px] bg-white/[0.06] px-1 rounded text-zinc-400">`~`</kbd>
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
