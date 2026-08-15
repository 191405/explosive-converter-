"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Shield,
  Cpu,
  Check,
  X as XIcon,
  Plus,
  Minus,
  Zap,
  Menu,
} from "lucide-react";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const openSidebar = () => {
    window.dispatchEvent(new CustomEvent("open-sidebar"));
  };

  const openCommandPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true })
    );
  };

  const faqItems = [
    {
      q: "How does file processing work without a server?",
      a: "We compile native C/C++ and Rust libraries to WebAssembly. Your browser executes these binaries locally with hardware SIMD acceleration — no upload, no remote queue, and no waiting.",
    },
    {
      q: "Where do I access the 19 engineering workstations?",
      a: "All 19 tools are housed directly in the Sidebar Directory (open via the top-left hamburger menu or 'Explore Workstations' CTA) and the Command Palette (⌘K). This keeps the main studio view clean, focused, and distraction-free.",
    },
    {
      q: "Is there a file size limit?",
      a: "Files up to 2 GB are supported on standard 64-bit systems. Processing speed scales directly with your device's available RAM and CPU cores.",
    },
    {
      q: "Are my cryptographic keys and sensitive files safe?",
      a: "All keys use the W3C WebCrypto API with non-extractable handles. Files are processed entirely in browser volatile RAM and flushed immediately on export with zero residual cache.",
    },
    {
      q: "Does it work completely offline?",
      a: "Yes. All WASM modules, UI engines, and assets are cached by our Progressive Web App (PWA) service worker. You can disconnect from the internet and continue converting seamlessly.",
    },
  ];

  const heroContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const heroItem = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="flex flex-col w-full font-sans text-[var(--text-muted)]">
      {/* ──────────────────────────────────────────
          LAYER 1 — IMMERSIVE EXECUTIVE HERO
      ────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full min-h-[82vh] flex items-center justify-center overflow-hidden rounded-3xl mb-12 border border-black/[0.06] dark:border-white/[0.08] shadow-2xl"
      >
        {/* Background Artwork */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('/hero-artwork.jpg')" }}
        />
        {/* Deep adaptive vignette gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/80 to-[var(--bg-main)]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)]/70 via-transparent to-[var(--bg-main)]/70" />

        {/* Hero Content with Staggered Framer Motion Reveal */}
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-4xl mx-auto px-6 py-16 sm:py-24 text-center flex flex-col items-center gap-6"
        >
          <motion.div
            variants={heroItem}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/10 dark:bg-white/[0.08] border border-black/10 dark:border-white/15 text-xs font-mono text-[var(--text-main)] backdrop-blur-md shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            100% Client-Side WebAssembly SIMD
          </motion.div>

          <motion.h1
            variants={heroItem}
            className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-[-0.03em] text-[var(--text-main)] leading-[1.08]"
          >
            Convert. Process.
            <br />
            <span className="font-semibold text-[var(--text-main)]">Entirely Yours.</span>
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl leading-relaxed font-light"
          >
            A private engineering studio that runs entirely in your browser memory.
            No cloud uploads. Zero data retention. Full offline execution across 19 workstations.
          </motion.p>

          <motion.div
            variants={heroItem}
            className="flex flex-wrap items-center justify-center gap-3.5 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={openSidebar}
              className="neu-btn-primary h-12 flex items-center gap-2.5 px-8 rounded-xl text-sm font-semibold shadow-xl cursor-pointer"
            >
              <Menu size={16} />
              <span>Explore Workstations</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={openCommandPalette}
              className="neu-btn h-12 flex items-center gap-2 px-6 rounded-xl text-[var(--text-main)] text-sm font-medium transition-all backdrop-blur-sm cursor-pointer"
            >
              <Search size={15} />
              <span>Quick Search (⌘K)</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ──────────────────────────────────────────
          LAYER 2 — TRUST STRIP
      ────────────────────────────────────────── */}
      <section className="w-full py-6 px-2 mb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { num: "0 bytes", desc: "uploaded to any remote server" },
            { num: "100%", desc: "client-side memory execution" },
            { num: "19 Tools", desc: "accessible in sidebar directory" },
            { num: "PWA Offline", desc: "runs with zero internet connection" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="neu-tile p-6 text-center cursor-default transition-shadow hover:shadow-lg"
            >
              <div className="text-2xl sm:text-3xl font-light text-[var(--text-main)] tracking-tight">
                {stat.num}
              </div>
              <div className="mt-1.5 text-[11px] text-[var(--text-dim)] uppercase tracking-widest font-medium">
                {stat.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 3 — HOW IT WORKS
      ────────────────────────────────────────── */}
      <section id="how" className="w-full py-16 sm:py-24 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-lg mb-12">
            <h2 className="text-3xl sm:text-4xl font-light text-[var(--text-main)] tracking-tight leading-snug">
              How it works
            </h2>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
              Three simple steps. Zero accounts, no logins, and complete privacy by architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "Drop",
                body: "Open any workstation from the sidebar drawer and drop your file in. It streams into browser volatile RAM — 0 bytes touch any network.",
              },
              {
                step: "Process",
                body: "WebAssembly SIMD compute kernels and Web Audio DSP execute transformations directly on your hardware at peak performance.",
              },
              {
                step: "Export",
                body: "Save your processed media instantly to disk. Memory buffers are immediately purged with zero residual cache.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="neu-tile p-8 flex flex-col gap-4 cursor-default transition-shadow hover:shadow-xl"
              >
                <div className="w-10 h-10 neu-icon-raised text-xs font-mono text-[var(--text-main)] font-bold">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-medium text-[var(--text-main)] tracking-tight">
                  {item.step}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 4 — SECURITY & ARCHITECTURE COMPARISON
      ────────────────────────────────────────── */}
      <section className="w-full py-16 sm:py-24 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-lg mb-12">
            <h2 className="text-3xl sm:text-4xl font-light text-[var(--text-main)] tracking-tight">
              Why In-Browser?
            </h2>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
              Hardware client-side execution compared to traditional cloud conversion pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* In-Browser approach */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -3 }}
              className="neu-tile p-8 flex flex-col gap-6"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 neu-icon-raised text-[var(--text-main)]">
                  <Shield size={22} />
                </div>
                <div>
                  <div className="text-base font-semibold text-[var(--text-main)]">
                    Explosive Studio
                  </div>
                  <div className="text-xs text-[var(--text-dim)] font-mono">
                    Hardware SIMD Execution
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                {[
                  "Files never leave your device boundary",
                  "Instant processing — zero remote server queue",
                  "100% offline via Progressive Web App",
                  "Volatile RAM only — immediate buffer flushes",
                  "Compliant with GDPR & HIPAA by architecture",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 neu-icon-raised shrink-0">
                      <Check size={12} className="text-emerald-500" />
                    </div>
                    <span className="text-sm text-[var(--text-main)] font-light">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Cloud approach */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="neu-inset p-8 flex flex-col gap-6 opacity-75"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 neu-icon-inset text-[var(--text-dim)]">
                  <Cpu size={22} />
                </div>
                <div>
                  <div className="text-base font-semibold text-[var(--text-muted)]">
                    Cloud Converters
                  </div>
                  <div className="text-xs text-[var(--text-dim)] font-mono">
                    Remote Server Ingestion
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                {[
                  "Full file uploaded over public internet",
                  "Queued behind other users' conversion jobs",
                  "Requires permanent online connection",
                  "Data cached and indexed on remote storage",
                  "Subject to third-party retention policies",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 neu-icon-inset shrink-0">
                      <XIcon size={12} className="text-red-500/80" />
                    </div>
                    <span className="text-sm text-[var(--text-dim)] font-light">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 5 — FAQ (Framer Motion Height Accordion)
      ────────────────────────────────────────── */}
      <section
        id="faq"
        className="w-full py-16 sm:py-24 border-t border-black/[0.06] dark:border-white/[0.06]"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-light text-[var(--text-main)] tracking-tight mb-10">
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-4">
            {faqItems.map((item, i) => {
              const isOpen = openFaq === i;

              return (
                <div key={i} className="neu-tile overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
                  >
                    <span className="text-[15px] font-medium text-[var(--text-main)] transition-colors pr-4">
                      {item.q}
                    </span>
                    <div className="w-8 h-8 neu-icon-raised shrink-0 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {isOpen ? (
                          <Minus size={14} className="text-[var(--text-main)]" />
                        ) : (
                          <Plus size={14} className="text-[var(--text-dim)]" />
                        )}
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-t border-black/[0.04] dark:border-white/[0.03]"
                      >
                        <div className="px-6 pb-6 pt-2 text-sm text-[var(--text-muted)] leading-relaxed font-light">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 6 — MINIMAL FOOTER
      ────────────────────────────────────────── */}
      <footer className="w-full border-t border-black/[0.06] dark:border-white/[0.06] py-10 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-dim)]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-zinc-900 dark:bg-white flex items-center justify-center">
              <Zap size={10} className="text-white dark:text-black fill-current" />
            </div>
            <span className="text-[var(--text-main)] font-medium">Explosive Studio</span>
            <span>·</span>
            <span>Zero-Server Private Media Engine</span>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={openSidebar}
              className="hover:text-[var(--text-main)] transition-colors cursor-pointer"
            >
              Workstation Directory
            </button>
            <a href="#how" className="hover:text-[var(--text-main)] transition-colors">
              How it Works
            </a>
            <a href="#faq" className="hover:text-[var(--text-main)] transition-colors">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
