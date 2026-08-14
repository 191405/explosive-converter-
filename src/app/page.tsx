"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Image, FileDown, Music, Scissors, Video, ShieldCheck, Zap, WifiOff, HardDrive } from "lucide-react";

const tools = [
  {
    href: "/pdf",
    title: "PDF Studio",
    desc: "Merge, split & manipulate PDF documents securely in your browser.",
    icon: FileText,
  },
  {
    href: "/image",
    title: "Image Convert",
    desc: "Instantly convert between PNG, JPG & WEBP formats with zero uploads.",
    icon: Image,
  },
  {
    href: "/compress",
    title: "Video Compress",
    desc: "Shrink video files using FFmpeg WASM — no server, just your browser.",
    icon: FileDown,
  },
  {
    href: "/audio",
    title: "Audio Converter",
    desc: "Extract audio from video or convert between MP3, WAV, AAC, FLAC & OGG.",
    icon: Music,
  },
  {
    href: "/trim",
    title: "Audio Trimmer",
    desc: "Interactive waveform trimmer with real-time preview & lossless WAV export.",
    icon: Scissors,
  },
  {
    href: "/record",
    title: "Screen Recorder",
    desc: "Record desktop, tabs, windows or camera with mic & system audio.",
    icon: Video,
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full gap-12 sm:gap-20">
      {/* ── Hero ── */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-4 sm:space-y-6 max-w-3xl pt-4 sm:pt-16"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-tight text-glow">
          Client-Side<br />
          <span className="text-text-primary/40">Superpowers.</span>
        </h1>
        <p className="text-base sm:text-xl text-text-primary/60 leading-relaxed font-light px-2">
          Lightning-fast, privacy-first file tools powered by WebAssembly.
          <br className="hidden sm:block" />
          No uploads. No servers. No limits.
        </p>
      </motion.section>

      {/* ── Tool Cards ── */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 w-full"
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <motion.div key={tool.href} variants={itemVariants} className="h-full">
              <Link href={tool.href} className="group block h-full outline-none">
                <motion.div 
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-panel p-5 sm:p-7 flex flex-col items-start gap-4 h-full cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-text-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="p-2.5 rounded-lg bg-text-primary/[0.03] border border-text-primary/[0.05] text-text-primary group-hover:bg-text-primary group-hover:text-bg-base transition-colors duration-200">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight mb-1.5">{tool.title}</h2>
                    <p className="text-xs sm:text-sm text-text-primary/50 leading-relaxed font-light">
                      {tool.desc}
                    </p>
                  </div>
                  
                  <span className="mt-auto text-[11px] font-semibold text-text-primary/30 group-hover:text-text-primary transition-colors tracking-widest uppercase pt-2">
                    Open Tool →
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.section>

      {/* ── Features strip ── */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-wrap justify-center gap-4 sm:gap-10 text-[11px] sm:text-xs font-mono text-text-primary/40 tracking-wider w-full max-w-4xl pt-4 border-t border-border-subtle"
      >
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-text-primary/60" />
          100% PRIVATE
        </span>
        <span className="flex items-center gap-1.5">
          <HardDrive size={14} className="text-text-primary/60" />
          NO LIMITS
        </span>
        <span className="flex items-center gap-1.5">
          <WifiOff size={14} className="text-text-primary/60" />
          OFFLINE READY
        </span>
        <span className="flex items-center gap-1.5">
          <Zap size={14} className="text-text-primary/60" />
          WASM SPEED
        </span>
      </motion.section>
    </div>
  );
}
