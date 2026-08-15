"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  ChevronDown,
  Shield,
  Cpu,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
  Clock,
  HardDrive,
  Lock,
  Check,
  X as XIcon,
  Plus,
  Minus,
  Zap,
} from "lucide-react";
import { SIDEBAR_CATEGORIES } from "@/components/sidebar";

export default function HomePage() {
  const [activeCat, setActiveCat] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const allTools = useMemo(() => {
    return SIDEBAR_CATEGORIES.flatMap((cat) =>
      cat.items.map((tool) => ({
        ...tool,
        categoryId: cat.id,
        categoryName: cat.name,
      }))
    );
  }, []);

  const filtered = useMemo(() => {
    return allTools.filter((t) => {
      const tab = activeCat === "all" || t.categoryId === activeCat;
      const q = search.trim().toLowerCase();
      const s =
        !q ||
        t.label.toLowerCase().includes(q) ||
        t.sublabel.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q);
      return tab && s;
    });
  }, [allTools, activeCat, search]);

  const faqItems = [
    {
      q: "How does file processing work without a server?",
      a: "We compile native C/C++ and Rust libraries to WebAssembly. Your browser executes these binaries locally with hardware SIMD acceleration â€” no upload, no queue, no waiting.",
    },
    {
      q: "Is there a file size limit?",
      a: "Files up to 2 GB are supported on standard 64-bit systems. Processing speed scales with your available RAM.",
    },
    {
      q: "Are my cryptographic keys safe?",
      a: "All keys use the W3C WebCrypto API with non-extractable CryptoKey handles. Keys never leave your browser's memory boundary.",
    },
    {
      q: "Does it work offline?",
      a: "Yes. All WASM modules and assets are cached by the Progressive Web App service worker. Full offline capability.",
    },
  ];

  return (
    <div className="flex flex-col w-full font-sans text-zinc-300 -mt-20">

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          LAYER 1 â€” IMMERSIVE HERO
          Full-viewport with artwork as background
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="relative w-screen -mx-3 sm:-mx-6 min-h-[92vh] flex items-end justify-center overflow-hidden">
        {/* Background Artwork â€” fills entire viewport */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-artwork.jpg')" }}
        />
        {/* Deep vignette layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080b]/50 via-transparent to-[#07080b]/50" />

        {/* Hero Content â€” anchored to bottom for layered depth */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16 sm:pb-24 text-center flex flex-col items-center gap-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-[-0.03em] text-white leading-[1.08]">
            Convert. Process.
            <br />
            <span className="font-medium">Entirely Yours.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300/80 max-w-xl leading-relaxed font-light">
            A private engineering studio that runs entirely in your browser.
            No uploads. No servers. No compromise.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() =>
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true })
                )
              }
              className="h-12 flex items-center gap-2.5 px-7 rounded-lg bg-white text-black font-semibold text-sm shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Search size={16} />
              <span>Find a Tool</span>
            </button>

            <a
              href="#tools"
              className="h-12 flex items-center gap-2 px-7 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.12] text-sm font-medium transition-all backdrop-blur-sm"
            >
              <span>Browse All {allTools.length} Tools</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 text-xs animate-bounce z-10">
          <ChevronDown size={18} />
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 2 — TRUST STRIP
          Neumorphic stats strip
      ────────────────────────────────────────── */}
      <section className="w-screen -mx-3 sm:-mx-6 py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { num: "0 bytes", desc: "uploaded to any server" },
            { num: "100%", desc: "client-side execution" },
            { num: "19", desc: "engineering workstations" },
            { num: "PWA", desc: "works fully offline" },
          ].map((stat, i) => (
            <div key={i} className="neu-tile p-6 text-center">
              <div className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                {stat.num}
              </div>
              <div className="mt-1.5 text-[11px] text-zinc-500 uppercase tracking-widest font-medium">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 3 — HOW IT WORKS
          Tactile 3-step neumorphic cards
      ────────────────────────────────────────── */}
      <section id="how" className="w-screen -mx-3 sm:-mx-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="max-w-lg mb-12">
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight leading-snug">
              How it works
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Three steps. Zero accounts, no sign-ups, and complete offline capability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "Drop",
                body: "Drag any file into a workstation. It is loaded directly into browser volatile RAM — zero bytes leave your hardware.",
              },
              {
                step: "Process",
                body: "WebAssembly SIMD compute kernels execute transformations locally at hardware speeds.",
              },
              {
                step: "Export",
                body: "Save output instantly to your disk. Memory buffers are immediately flushed. Zero residual data.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="neu-tile p-8 flex flex-col gap-4"
              >
                <div className="w-10 h-10 neu-icon-raised text-xs font-mono text-white font-bold">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-medium text-white tracking-tight">{item.step}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 4 — TOOL CATALOG
          Neumorphic E-Commerce Grid with Tactile Tiles
      ────────────────────────────────────────── */}
      <section
        id="tools"
        className="w-screen -mx-3 sm:-mx-6 py-20 sm:py-28 scroll-mt-20 border-t border-white/[0.04]"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {/* Section Header + Search */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
                Engineering Workstations
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {allTools.length} private workstations across {SIDEBAR_CATEGORIES.length} suites
              </p>
            </div>

            {/* Tactile Inset Search Bar */}
            <div className="relative w-full sm:w-80 neu-inset flex items-center px-3.5 py-1">
              <Search
                size={16}
                className="text-zinc-500 shrink-0"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search workstations..."
                className="w-full h-10 px-3 bg-transparent text-sm text-zinc-200 placeholder-zinc-500 outline-none"
              />
            </div>
          </div>

          {/* Tactile Tab Selector */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCat("all")}
              className={`shrink-0 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeCat === "all"
                  ? "neu-btn-primary"
                  : "neu-btn text-zinc-400 hover:text-white"
              }`}
            >
              All Suites ({allTools.length})
            </button>
            {SIDEBAR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`shrink-0 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeCat === cat.id
                    ? "neu-btn-primary"
                    : "neu-btn text-zinc-400 hover:text-white"
                }`}
              >
                {cat.name} ({cat.items.length})
              </button>
            ))}
          </div>

          {/* Neumorphic Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="neu-tile-interactive group p-6 flex flex-col justify-between gap-5 relative"
                >
                  {/* Subtle top bevel specular glow on hover */}
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 neu-icon-raised text-zinc-300 group-hover:text-white group-hover:scale-105 transition-all">
                        <Icon size={20} />
                      </div>
                      <span className="px-2.5 py-1 neu-icon-inset text-[10px] font-mono text-zinc-400 tracking-wider">
                        {tool.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-white group-hover:text-white transition-colors leading-tight">
                        {tool.label}
                      </h3>
                      <p className="mt-2 text-xs text-zinc-400 leading-relaxed line-clamp-2 font-light">
                        {tool.sublabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {tool.categoryName}
                    </span>
                    <span className="text-xs px-3 py-1.5 neu-btn text-zinc-300 group-hover:text-white flex items-center gap-1.5 font-medium transition-colors">
                      Launch
                      <ArrowRight
                        size={12}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 5 — SECURITY & ARCHITECTURE
          Tactile Dual Comparison
      ────────────────────────────────────────── */}
      <section className="w-screen -mx-3 sm:-mx-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="max-w-lg mb-12">
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
              Why In-Browser?
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Tactile side-by-side: hardware client-side execution versus third-party cloud converters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Our approach */}
            <div className="neu-tile p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 neu-icon-raised text-white">
                  <Shield size={22} />
                </div>
                <div>
                  <div className="text-base font-semibold text-white">Explosive Studio</div>
                  <div className="text-xs text-zinc-500 font-mono">Hardware SIMD Execution</div>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                {[
                  "Files never leave your device boundary",
                  "Instant processing — zero server queue",
                  "100% offline via Progressive Web App",
                  "Volatile memory only — zero residual cache",
                  "Compliant with GDPR & HIPAA by architecture",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 neu-icon-raised shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-sm text-zinc-300 font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cloud approach */}
            <div className="neu-inset p-8 flex flex-col gap-6 opacity-75">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 neu-icon-inset text-zinc-500">
                  <Cpu size={22} />
                </div>
                <div>
                  <div className="text-base font-semibold text-zinc-400">Cloud Converters</div>
                  <div className="text-xs text-zinc-600 font-mono">Remote Server Ingestion</div>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                {[
                  "Full file uploaded over public internet",
                  "Queued behind other users' conversion jobs",
                  "Requires permanent online connection",
                  "Data cached and indexed on remote disks",
                  "Subject to changing third-party policies",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 neu-icon-inset shrink-0">
                      <XIcon size={12} className="text-zinc-600" />
                    </div>
                    <span className="text-sm text-zinc-500 font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="w-screen -mx-3 sm:-mx-6 py-20 sm:py-28 border-t border-white/[0.04]"
      >
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-10">
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-4">
            {faqItems.map((item, i) => (
              <div key={i} className="neu-tile overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
                >
                  <span className="text-[15px] font-medium text-zinc-200 group-hover:text-white transition-colors pr-4">
                    {item.q}
                  </span>
                  <div className="w-8 h-8 neu-icon-raised shrink-0">
                    {openFaq === i ? (
                      <Minus size={14} className="text-zinc-400" />
                    ) : (
                      <Plus size={14} className="text-zinc-400" />
                    )}
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 pt-1 text-sm text-zinc-400 leading-relaxed font-light border-t border-white/[0.03]">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          LAYER 7 — FOOTER
          Tactile Minimal Footer
      ────────────────────────────────────────── */}
      <footer className="w-screen -mx-3 sm:-mx-6 border-t border-white/[0.04] py-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-white to-zinc-200 flex items-center justify-center">
              <Zap size={10} className="text-black fill-current" />
            </div>
            <span className="text-zinc-400 font-medium">Explosive Studio</span>
            <span className="text-zinc-700">Â·</span>
            <span>All processing happens locally</span>
          </div>
          <div className="flex items-center gap-5 text-zinc-600">
            <a href="#how" className="hover:text-zinc-400 transition-colors">
              How it Works
            </a>
            <a href="#tools" className="hover:text-zinc-400 transition-colors">
              Tools
            </a>
            <a href="#faq" className="hover:text-zinc-400 transition-colors">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
