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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          LAYER 2 â€” TRUST STRIP
          Horizontal proof points, no badges, no icons spam
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="w-screen -mx-3 sm:-mx-6 bg-[#0a0b10] border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.04]">
          {[
            { num: "0 bytes", desc: "uploaded to any server" },
            { num: "100%", desc: "client-side execution" },
            { num: "18", desc: "engineering workstations" },
            { num: "PWA", desc: "works fully offline" },
          ].map((stat, i) => (
            <div key={i} className="py-8 sm:py-10 px-6 text-center">
              <div className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                {stat.num}
              </div>
              <div className="mt-1 text-xs text-zinc-500 uppercase tracking-widest">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          LAYER 3 â€” HOW IT WORKS
          Three clean steps, no numbered AI cards
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="how" className="w-screen -mx-3 sm:-mx-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="max-w-lg mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight leading-snug">
              How it works
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Three steps. No accounts, no sign-ups, no cloud dependency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {[
              {
                step: "Drop",
                body: "Drag any file into a workstation. It's read directly into your browser's volatile memory â€” nothing leaves your machine.",
              },
              {
                step: "Process",
                body: "WebAssembly compute kernels execute the transformation using your CPU's hardware SIMD registers at near-native speed.",
              },
              {
                step: "Export",
                body: "Download the result straight to your disk. All buffers are garbage collected. Zero residual data.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#0a0b10] p-8 sm:p-10 flex flex-col gap-4"
              >
                <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  Step {i + 1}
                </div>
                <h3 className="text-xl font-medium text-white">{item.step}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          LAYER 4 â€” TOOL CATALOG
          E-commerce product grid with proper tabs
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        id="tools"
        className="w-screen -mx-3 sm:-mx-6 bg-[#0a0b10] border-t border-white/[0.04] py-20 sm:py-28 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {/* Section Header + Search */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
                All Tools
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {allTools.length} workstations across {SIDEBAR_CATEGORIES.length} engineering suites
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#0d0e15] border border-white/[0.08] focus:border-white/[0.2] text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* E-Commerce Style Tab Bar (underline tabs, not pills) */}
          <div className="flex items-center gap-0 border-b border-white/[0.06] mb-8 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveCat("all")}
              className={`shrink-0 px-5 pb-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                activeCat === "all"
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              All
            </button>
            {SIDEBAR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`shrink-0 px-5 pb-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeCat === cat.id
                    ? "border-white text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group relative bg-[#0d0e15] rounded-xl border border-white/[0.06] hover:border-white/[0.14] transition-all duration-200 overflow-hidden"
                >
                  {/* Card top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.25] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/[0.12] transition-colors">
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1">
                        {tool.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-[15px] font-medium text-white group-hover:text-zinc-100 transition-colors leading-tight">
                        {tool.label}
                      </h3>
                      <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed line-clamp-2">
                        {tool.sublabel}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                      <span className="text-[11px] text-zinc-600 font-medium">
                        {tool.categoryName}
                      </span>
                      <span className="text-xs text-zinc-500 group-hover:text-white flex items-center gap-1 font-medium transition-colors">
                        Open
                        <ArrowRight
                          size={12}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          LAYER 5 â€” SECURITY / COMPARISON
          Side-by-side, no table â€” stacked comparison cards
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="w-screen -mx-3 sm:-mx-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="max-w-lg mb-14">
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
              Why in-browser?
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Side-by-side: what happens here versus what happens when you upload to a cloud converter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Our approach */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0b10] p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/[0.12] flex items-center justify-center">
                  <Shield size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Explosive Studio</div>
                  <div className="text-[11px] text-zinc-500">In-browser execution</div>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                {[
                  "Files never leave your device",
                  "Instant processing, no server queue",
                  "Works completely offline",
                  "Zero data retention â€” volatile RAM only",
                  "GDPR & HIPAA compliant by architecture",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={15} className="text-white shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cloud approach */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0d0e15]/50 p-8 flex flex-col gap-6 opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <Cpu size={18} className="text-zinc-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-400">Cloud Converters</div>
                  <div className="text-[11px] text-zinc-600">Server-side processing</div>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                {[
                  "Full file uploaded to remote servers",
                  "Queued behind other users' jobs",
                  "Requires active internet connection",
                  "Data cached on remote disk storage",
                  "Subject to third-party data policies",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XIcon size={15} className="text-zinc-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-500">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          LAYER 6 â€” FAQ
          Clean accordion, no generic cards
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section
        id="faq"
        className="w-screen -mx-3 sm:-mx-6 bg-[#0a0b10] border-t border-white/[0.04] py-20 sm:py-28"
      >
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-12">
            Questions
          </h2>

          <div className="flex flex-col divide-y divide-white/[0.06]">
            {faqItems.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
                >
                  <span className="text-[15px] font-medium text-zinc-200 group-hover:text-white transition-colors pr-4">
                    {item.q}
                  </span>
                  {openFaq === i ? (
                    <Minus size={16} className="text-zinc-500 shrink-0" />
                  ) : (
                    <Plus size={16} className="text-zinc-500 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="pb-5 text-sm text-zinc-400 leading-relaxed pr-10 animate-in fade-in duration-150">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          LAYER 7 â€” FOOTER
          Minimal, no emoji, no version badges
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
