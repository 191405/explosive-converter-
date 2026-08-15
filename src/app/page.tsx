"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Radio,
  Music,
  Scissors,
  Clock,
  Shapes,
  Binary,
  ScanText,
  FileDown,
  Image as ImageIcon,
  Film,
  Video,
  Type,
  FileText,
  Key,
  Network,
  Archive,
  ArrowRight,
  Search,
  Cpu,
  Lock,
  Zap,
  HardDrive,
  Sliders,
  CheckCircle2,
  Terminal,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Info,
  Server,
  Layers,
  FileCode,
  ShieldAlert,
  Flame,
} from "lucide-react";
import { SIDEBAR_CATEGORIES } from "@/components/sidebar";

export default function HomePage() {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");
  const [catalogSearch, setCatalogSearch] = useState<string>("");

  // Flatten all tools with category metadata
  const allTools = useMemo(() => {
    return SIDEBAR_CATEGORIES.flatMap((cat) =>
      cat.items.map((tool) => ({
        ...tool,
        categoryId: cat.id,
        categoryName: cat.name,
      }))
    );
  }, []);

  // Filter tools based on tab and search query
  const displayedTools = useMemo(() => {
    return allTools.filter((tool) => {
      const matchesTab = activeCategoryTab === "all" || tool.categoryId === activeCategoryTab;
      const matchesSearch =
        !catalogSearch.trim() ||
        tool.label.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        tool.sublabel.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        tool.tag.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        tool.categoryName.toLowerCase().includes(catalogSearch.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [allTools, activeCategoryTab, catalogSearch]);

  return (
    <div className="flex flex-col gap-16 sm:gap-24 w-full max-w-5xl mx-auto py-6 sm:py-12 font-sans text-zinc-300">
      
      {/* ── 1. Ethereal Hero Section (Aethera & Sukoya Style) ── */}
      <section className="relative flex flex-col items-center text-center gap-8 pt-4 pb-4">
        
        {/* Subtle Ambient Golden / Tungsten Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Minimalist Micro-Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-xs font-mono tracking-wide shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Client-Side SIMD Architecture</span>
          <span className="text-zinc-600">·</span>
          <span className="text-amber-400 font-semibold">100% In-Memory Sandbox</span>
        </div>

        {/* Cinematic Main Headline */}
        <div className="flex flex-col gap-4 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.12]">
            A New Standard in Local <br className="hidden sm:inline" />
            <span className="font-semibold text-white">Media & Forensic Engineering</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans max-w-2xl mx-auto font-light">
            Execute high-throughput media transformations, deep forensic telemetry, audio DSP, and cryptographic hashing natively on your device. Zero cloud staging. Zero telemetry.
          </p>
        </div>

        {/* Floating Minimalist Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true })
              )
            }
            className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs sm:text-sm shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Search size={15} />
            <span>Search Workstations (⌘K)</span>
          </button>

          <a
            href="#guidelines"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.09] text-zinc-200 hover:text-white border border-white/[0.08] text-xs sm:text-sm font-medium transition-all backdrop-blur-md"
          >
            <Info size={15} className="text-amber-400" />
            <span>Operating Guidelines</span>
          </a>

          <a
            href="#catalog"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.02] hover:bg-white/[0.05] text-zinc-400 hover:text-zinc-200 border border-white/[0.05] text-xs sm:text-sm font-medium transition-all"
          >
            <Layers size={15} />
            <span>Browse Catalog ({allTools.length})</span>
          </a>
        </div>

        {/* Hero Artwork Centerpiece (Sukoya & Aethera Fine Art Showcase) */}
        <div className="relative w-full max-w-4xl mt-4 rounded-3xl overflow-hidden border border-white/[0.1] bg-[#0c0e15] shadow-2xl shadow-black/90 group">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src="/hero-artwork.jpg"
              alt="Explosive In-Memory Computing Monolith"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />
            {/* Soft Ambient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-transparent to-transparent opacity-80" />
            
            {/* Artwork Floating Metadata Caption (Sukoya Style) */}
            <div className="absolute bottom-4 inset-x-6 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>HARDWARE ARCHITECTURE // 07</span>
              </span>
              <span className="text-zinc-500 hidden sm:inline">ZERO-CLOUD IN-MEMORY EXECUTION</span>
              <span className="text-amber-400 font-semibold">100% PRIVATE</span>
            </div>
          </div>
        </div>

        {/* High-Trust Telemetry Strip (Aethera Reviews Score Pattern) */}
        <div className="w-full max-w-3xl flex flex-wrap items-center justify-around gap-4 py-3 px-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-amber-400" />
            <span className="text-zinc-200">100% In-Memory Sandbox</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">★★★★★</span>
            <span className="text-zinc-200">Zero Cloud Egress</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-amber-400" />
            <span className="text-zinc-200">WASM SIMD Hardware V8</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-amber-400" />
            <span className="text-zinc-200">W3C WebCrypto Compliant</span>
          </div>
        </div>
      </section>

      {/* ── 2. Operating Guidelines & Engineering Principles (01 - 04 Editorial) ── */}
      <section id="guidelines" className="flex flex-col gap-8 scroll-mt-20">
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
            Operational Protocol
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            How the Platform Operates
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl font-light">
            Explosive Studio treats your browser as a dedicated hardware appliance. Follow these standard operational principles for optimal throughput.
          </p>
        </div>

        {/* 4-Step Editorial Grid (Lassain Meri & Sukoya Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between hover:border-amber-400/30 transition-all group">
            <div className="flex flex-col gap-3">
              <span className="text-2xl font-light text-amber-400/60 font-mono group-hover:text-amber-400 transition-colors">
                01
              </span>
              <h3 className="text-sm font-semibold text-white">Local Ingestion</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Drop your assets into any workstation. Files are mounted directly into client volatile RAM via typed ArrayBuffers and Blob URLs.
              </p>
            </div>
            <div className="pt-4 text-[10px] font-mono text-zinc-500 uppercase">
              No Network Transmission
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between hover:border-amber-400/30 transition-all group">
            <div className="flex flex-col gap-3">
              <span className="text-2xl font-light text-amber-400/60 font-mono group-hover:text-amber-400 transition-colors">
                02
              </span>
              <h3 className="text-sm font-semibold text-white">SIMD Acceleration</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Compute kernels execute via multi-threaded WebAssembly leveraging 128-bit vector CPU registers for near-native throughput.
              </p>
            </div>
            <div className="pt-4 text-[10px] font-mono text-zinc-500 uppercase">
              Hardware Vectorization
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between hover:border-amber-400/30 transition-all group">
            <div className="flex flex-col gap-3">
              <span className="text-2xl font-light text-amber-400/60 font-mono group-hover:text-amber-400 transition-colors">
                03
              </span>
              <h3 className="text-sm font-semibold text-white">Memory Cleansing</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Sensitive metadata, intermediate frame buffers, and temporary caches are zeroed out and garbage collected upon task completion.
              </p>
            </div>
            <div className="pt-4 text-[10px] font-mono text-zinc-500 uppercase">
              Automated Zero-Fill
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between hover:border-amber-400/30 transition-all group">
            <div className="flex flex-col gap-3">
              <span className="text-2xl font-light text-amber-400/60 font-mono group-hover:text-amber-400 transition-colors">
                04
              </span>
              <h3 className="text-sm font-semibold text-white">Zero-Trace Export</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Transcoded streams are packaged and written straight to your local file system with cryptographic checksums for data integrity.
              </p>
            </div>
            <div className="pt-4 text-[10px] font-mono text-zinc-500 uppercase">
              Direct Binary Stream
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Curated Workstation Catalog (Editorial Showcase) ── */}
      <section id="catalog" className="flex flex-col gap-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
              Workstation Registry
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              Engineering Suites & Tools
            </h2>
          </div>

          {/* Search Filter Input */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search tools or specs..."
              className="w-full pl-9 pr-3 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] focus:border-amber-400/60 focus:bg-white/[0.05] text-xs text-zinc-200 placeholder-zinc-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Minimalist Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategoryTab("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeCategoryTab === "all"
                ? "bg-amber-400 text-black font-semibold shadow-md shadow-amber-400/20"
                : "bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 border border-white/[0.06]"
            }`}
          >
            All Workstations ({allTools.length})
          </button>
          {SIDEBAR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryTab(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeCategoryTab === cat.id
                  ? "bg-amber-400 text-black font-semibold shadow-md shadow-amber-400/20"
                  : "bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 border border-white/[0.06]"
              }`}
            >
              {cat.name} ({cat.items.length})
            </button>
          ))}
        </div>

        {/* Workstation Product Cards Grid (Lassain Meri Editorial Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-amber-400/40 shadow-sm transition-all duration-200 flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-amber-400 group-hover:scale-105 transition-transform">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-zinc-400 group-hover:border-amber-400/30 group-hover:text-amber-400 transition-colors">
                      {tool.tag}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {tool.label}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-light line-clamp-2">
                      {tool.sublabel}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-[11px] text-zinc-500 group-hover:text-amber-400 transition-colors font-medium">
                  <span className="text-[10px] font-mono uppercase text-zinc-500">
                    {tool.categoryName}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>Launch</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 4. Architectural Comparison & Zero-Cloud Matrix ── */}
      <section id="comparison" className="flex flex-col gap-6 scroll-mt-20">
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
            Security Specification
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            In-Browser Sandbox vs Cloud Converters
          </h2>
        </div>

        <div className="w-full overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0c0e15]/60 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 font-mono text-[11px]">
                <th className="py-3.5 px-5 font-semibold">Architectural Vector</th>
                <th className="py-3.5 px-5 font-semibold text-amber-400">Explosive In-Memory WASM</th>
                <th className="py-3.5 px-5 font-semibold text-zinc-500">Legacy Cloud Converters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              <tr>
                <td className="py-3.5 px-5 font-medium text-white">Network Staging</td>
                <td className="py-3.5 px-5 text-zinc-300 font-mono">0 Bytes Uploaded (RAM Local)</td>
                <td className="py-3.5 px-5 text-zinc-500 font-mono">100% Uploaded to Remote Server</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-medium text-white">Confidentiality & Compliance</td>
                <td className="py-3.5 px-5 text-zinc-300">Strictly client-side, GDPR/HIPAA immune</td>
                <td className="py-3.5 px-5 text-zinc-500">Subject to server logs, leaks & retention</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-medium text-white">Processing Latency</td>
                <td className="py-3.5 px-5 text-zinc-300">Instant silicon execution, no queue</td>
                <td className="py-3.5 px-5 text-zinc-500">Upload lag + server queue + download lag</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-medium text-white">Offline Capability</td>
                <td className="py-3.5 px-5 text-zinc-300 font-mono">Fully functional offline (PWA)</td>
                <td className="py-3.5 px-5 text-zinc-500 font-mono">Fails without internet connection</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-medium text-white">Data Retention</td>
                <td className="py-3.5 px-5 text-amber-400 font-mono">Zero retention (Volatile RAM)</td>
                <td className="py-3.5 px-5 text-zinc-500 font-mono">Stored on remote disk cache</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 5. Technical FAQ & Reference ── */}
      <section id="faq" className="flex flex-col gap-6 scroll-mt-20">
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
            Technical Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-white">How is data processed without server uploads?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              We compile high-performance C, C++, and Rust libraries into WebAssembly (WASM). Your browser's JavaScript V8 engine runs these binaries locally with hardware SIMD acceleration.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-white">Are there file size limitations?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Because execution occurs in your browser's heap, files up to 2GB are supported on standard 64-bit systems. For larger files, processing speed depends on your available system RAM.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-white">Are cryptographic keys extractable?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              No. Our Crypto Vault uses the standard W3C WebCrypto API with non-extractable CryptoKey handles in memory, ensuring military-grade key isolation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-white">Does the app work when disconnected from Wi-Fi?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Yes. All WebAssembly modules and static assets are cached locally via Progressive Web App (PWA) service workers, enabling 100% offline file transformations.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. Minimalist Editorial Footer ── */}
      <footer className="pt-8 pb-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[9px] font-bold">
            ⚡
          </div>
          <span className="text-zinc-400">Explosive Studio v2.4</span>
          <span>·</span>
          <span>In-Memory Silicon Computation</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-500">
          <a href="#guidelines" className="hover:text-zinc-300 transition-colors">Guidelines</a>
          <a href="#comparison" className="hover:text-zinc-300 transition-colors">Security</a>
          <a href="#faq" className="hover:text-zinc-300 transition-colors">Architecture</a>
        </div>
      </footer>
    </div>
  );
}
