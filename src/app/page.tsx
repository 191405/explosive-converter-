"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  ChevronDown,
  Shield,
  Cpu,
  Check,
  X as XIcon,
  Plus,
  Minus,
  Zap,
  Menu,
} from "lucide-react";
import { SIDEBAR_CATEGORIES } from "@/components/sidebar";

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
      a: "We compile native C/C++ and Rust libraries to WebAssembly. Your browser executes these binaries locally with hardware SIMD acceleration — no upload, no queue, no waiting.",
    },
    {
      q: "Is there a file size limit?",
      a: "Files up to 2 GB are supported on standard 64-bit systems. Processing speed scales with your available RAM.",
    },
    {
      q: "Are my cryptographic keys and files safe?",
      a: "All keys use the W3C WebCrypto API with non-extractable CryptoKey handles. Files are processed entirely in browser volatile RAM and flushed immediately on export.",
    },
    {
      q: "Does it work offline?",
      a: "Yes. All WASM modules and assets are cached by the Progressive Web App service worker. Full offline capability without internet connectivity.",
    },
    {
      q: "Where do I find all 19 engineering workstations?",
      a: "Click 'Explore Workstations' or open the Directory menu in the top left header to access all forensic, audio DSP, video streaming, schematic, and document tools.",
    },
  ];

  return (
    <div className="flex flex-col w-full font-sans text-[var(--text-muted)] -mt-20">
      {/* ──────────────────────────────────────────
          LAYER 1 — IMMERSIVE HERO
      ────────────────────────────────────────── */}
      <section className="relative w-screen -mx-3 sm:-mx-6 min-h-[92vh] flex items-end justify-center overflow-hidden">
        {/* Background Artwork */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-artwork.jpg')" }}
        />
        {/* Deep vignette layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)]/60 via-transparent to-[var(--bg-main)]/60" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-20 sm:pb-28 text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 dark:bg-white/[0.06] border border-black/10 dark:border-white/10 text-xs font-mono text-[var(--text-main)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            100% Client-Side WebAssembly SIMD
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-[-0.03em] text-[var(--text-main)] leading-[1.08]">
            Convert. Process.
            <br />
            <span className="font-semibold">Entirely Yours.</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl leading-relaxed font-light">
            A private engineering studio that runs entirely in your browser memory.
            No cloud uploads. Zero data retention. Full offline execution.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <button
              onClick={openSidebar}
              className="neu-btn-primary h-12 flex items-center gap-2.5 px-8 rounded-xl text-sm font-semibold shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Menu size={16} />
              <span>Explore Workstations</span>
            </button>

            <button
              onClick={openCommandPalette}
              className="neu-btn h-12 flex items-center gap-2 px-6 rounded-xl text-[var(--text-main)] text-sm font-medium transition-all backdrop-blur-sm cursor-pointer"
            >
              <Search size={15} />
              <span>Quick Search (⌘K)</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-dim)] text-xs animate-bounce z-10">
          <ChevronDown size={18} />
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 2 — TRUST STRIP
      ────────────────────────────────────────── */}
      <section className="w-screen -mx-3 sm:-mx-6 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { num: "0 bytes", desc: "uploaded to any server" },
            { num: "100%", desc: "client-side execution" },
            { num: "19 Tools", desc: "accessible via sidebar" },
            { num: "PWA Offline", desc: "runs with zero internet" },
          ].map((stat, i) => (
            <div key={i} className="neu-tile p-6 text-center">
              <div className="text-2xl sm:text-3xl font-light text-[var(--text-main)] tracking-tight">
                {stat.num}
              </div>
              <div className="mt-1.5 text-[11px] text-[var(--text-dim)] uppercase tracking-widest font-medium">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 3 — HOW IT WORKS
      ────────────────────────────────────────── */}
      <section id="how" className="w-screen -mx-3 sm:-mx-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="max-w-lg mb-12">
            <h2 className="text-3xl sm:text-4xl font-light text-[var(--text-main)] tracking-tight leading-snug">
              How it works
            </h2>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
              Three steps. Zero accounts, no sign-ups, and complete offline capability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "Drop",
                body: "Open any workstation from the sidebar and drag your file in. It loads directly into browser volatile RAM — zero bytes leave your hardware.",
              },
              {
                step: "Process",
                body: "WebAssembly SIMD compute kernels and Web Audio DSP execute transformations locally at hardware speeds.",
              },
              {
                step: "Export",
                body: "Save the processed output instantly to your disk. Memory buffers are immediately flushed with zero residual footprint.",
              },
            ].map((item, i) => (
              <div key={i} className="neu-tile p-8 flex flex-col gap-4">
                <div className="w-10 h-10 neu-icon-raised text-xs font-mono text-[var(--text-main)] font-bold">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-medium text-[var(--text-main)] tracking-tight">
                  {item.step}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 4 — SECURITY & ARCHITECTURE COMPARISON
      ────────────────────────────────────────── */}
      <section className="w-screen -mx-3 sm:-mx-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="max-w-lg mb-12">
            <h2 className="text-3xl sm:text-4xl font-light text-[var(--text-main)] tracking-tight">
              Why In-Browser?
            </h2>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
              Hardware client-side execution versus traditional cloud conversion pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* In-Browser approach */}
            <div className="neu-tile p-8 flex flex-col gap-6">
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
                      <Check size={12} className="text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm text-[var(--text-main)] font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cloud approach */}
            <div className="neu-inset p-8 flex flex-col gap-6 opacity-75">
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
                  "Data cached and indexed on remote cloud storage",
                  "Subject to changing third-party data policies",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 neu-icon-inset shrink-0">
                      <XIcon size={12} className="text-red-500/80" />
                    </div>
                    <span className="text-sm text-[var(--text-dim)] font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 5 — FAQ
      ────────────────────────────────────────── */}
      <section
        id="faq"
        className="w-screen -mx-3 sm:-mx-6 py-20 sm:py-28 border-t border-black/[0.04] dark:border-white/[0.04]"
      >
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-light text-[var(--text-main)] tracking-tight mb-10">
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-4">
            {faqItems.map((item, i) => (
              <div key={i} className="neu-tile overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
                >
                  <span className="text-[15px] font-medium text-[var(--text-main)] transition-colors pr-4">
                    {item.q}
                  </span>
                  <div className="w-8 h-8 neu-icon-raised shrink-0">
                    {openFaq === i ? (
                      <Minus size={14} className="text-[var(--text-dim)]" />
                    ) : (
                      <Plus size={14} className="text-[var(--text-dim)]" />
                    )}
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 pt-1 text-sm text-[var(--text-muted)] leading-relaxed font-light border-t border-black/[0.04] dark:border-white/[0.03]">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 6 — FOOTER
      ────────────────────────────────────────── */}
      <footer className="w-screen -mx-3 sm:-mx-6 border-t border-black/[0.04] dark:border-white/[0.04] py-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-dim)]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-200 flex items-center justify-center">
              <Zap size={10} className="text-white dark:text-black fill-current" />
            </div>
            <span className="text-[var(--text-main)] font-medium">Explosive Studio</span>
            <span>·</span>
            <span>All processing happens locally</span>
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
