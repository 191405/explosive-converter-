"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { SIDEBAR_CATEGORIES } from "@/components/sidebar";

export default function HomePage() {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");
  const [catalogSearch, setCatalogSearch] = useState<string>("");

  // Flatten all tools with their category metadata
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
    <div className="flex flex-col gap-12 sm:gap-16 w-full max-w-6xl mx-auto py-4 sm:py-8 font-sans text-zinc-300">
      {/* ── 1. Hero & Value Proposition Section ── */}
      <section className="flex flex-col items-center text-center gap-6 pt-4 pb-6">
        {/* Architecture Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Client-Side WebAssembly SIMD Architecture</span>
          <span className="text-zinc-500">•</span>
          <span className="text-amber-400 font-semibold">100% In-Memory Sandbox</span>
        </div>

        {/* Main Headline */}
        <div className="flex flex-col gap-3 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            High-Performance Media & File Engineering Studio
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans max-w-2xl mx-auto">
            A comprehensive suite of client-side forensic, acoustic, visual, and cryptographic workstations. Process media, extract signals, scrub metadata, and transcode formats locally in browser memory.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs sm:text-sm shadow-lg shadow-amber-400/15 transition-all cursor-pointer"
          >
            <Search size={16} />
            <span>Search Tool Registry (⌘K)</span>
          </button>

          <a
            href="#guidelines"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-zinc-200 hover:text-white border border-white/[0.08] text-xs sm:text-sm font-semibold transition-all"
          >
            <Info size={16} className="text-amber-400" />
            <span>Operating Guidelines</span>
          </a>

          <a
            href="#catalog"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 border border-white/[0.05] text-xs sm:text-sm font-medium transition-all"
          >
            <Layers size={16} />
            <span>Browse Catalog ({allTools.length} Tools)</span>
          </a>
        </div>

        {/* System Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl pt-4">
          <div className="p-3.5 rounded-xl bg-[#0c0d14] border border-white/[0.06] flex flex-col items-center text-center">
            <span className="text-xs font-mono text-zinc-500 uppercase">Server I/O</span>
            <span className="text-lg font-bold text-white font-mono mt-0.5">0.00 B</span>
            <span className="text-[10px] text-amber-400 mt-0.5">Zero Remote Transfer</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c0d14] border border-white/[0.06] flex flex-col items-center text-center">
            <span className="text-xs font-mono text-zinc-500 uppercase">Compute Core</span>
            <span className="text-lg font-bold text-white font-mono mt-0.5">WASM SIMD</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Native Multi-Thread</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c0d14] border border-white/[0.06] flex flex-col items-center text-center">
            <span className="text-xs font-mono text-zinc-500 uppercase">Data Retention</span>
            <span className="text-lg font-bold text-white font-mono mt-0.5">Ephemeral</span>
            <span className="text-[10px] text-amber-400 mt-0.5">Wiped on Tab Close</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c0d14] border border-white/[0.06] flex flex-col items-center text-center">
            <span className="text-xs font-mono text-zinc-500 uppercase">Active Suites</span>
            <span className="text-lg font-bold text-white font-mono mt-0.5">5 Categories</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">17 Total Workstations</span>
          </div>
        </div>
      </section>

      {/* ── 2. Operating Guidelines & How It Works ── */}
      <section id="guidelines" className="flex flex-col gap-6 pt-4 scroll-mt-20">
        <div className="flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
            <Info size={14} />
            <span>Platform Guidelines</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            How The In-Memory Studio Operates
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Explosive Studio functions as a sandboxed workstation engine. Follow these 4 standard steps to execute workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-[#0c0d14] border border-white/[0.07] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                STEP 01
              </span>
              <Layers size={16} className="text-zinc-500" />
            </div>
            <h3 className="text-sm font-semibold text-white">Select from Directory</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Open the left sidebar menu or click any workstation in the catalog below to launch the dedicated hardware interface.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-[#0c0d14] border border-white/[0.07] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-300 px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">
                STEP 02
              </span>
              <HardDrive size={16} className="text-zinc-500" />
            </div>
            <h3 className="text-sm font-semibold text-white">In-Memory Buffer Ingestion</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Drop target files directly into the dropzone. Data is allocated into private <code className="text-zinc-300 font-mono">ArrayBuffer</code> RAM with 0 server uploads.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-[#0c0d14] border border-white/[0.07] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-300 px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">
                STEP 03
              </span>
              <Cpu size={16} className="text-zinc-500" />
            </div>
            <h3 className="text-sm font-semibold text-white">Local Hardware Compute</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Adjust parameters (FFmpeg CRF, EQ stems, Bézier smoothing, or AES keys). Compute executes on client CPU cores.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-[#0c0d14] border border-white/[0.07] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-300 px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">
                STEP 04
              </span>
              <FileDown size={16} className="text-zinc-500" />
            </div>
            <h3 className="text-sm font-semibold text-white">Direct Binary Export</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Download the generated binary directly through browser Blob URLs. Memory buffers are immediately reclaimed.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Architecture Specification Table ── */}
      <section className="flex flex-col gap-6 pt-4">
        <div className="flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>Technical Specifications</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Security & Memory Isolation Comparison
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            A technical breakdown of client-side WASM execution versus conventional cloud-hosted converters.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0c0d14]">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 font-mono uppercase text-[11px]">
                <th className="p-4">Specification Parameter</th>
                <th className="p-4 text-amber-400 font-bold">Explosive In-Browser Studio</th>
                <th className="p-4 text-zinc-500">Traditional Cloud Converters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-zinc-300">
              <tr>
                <td className="p-4 font-semibold text-white">Network Ingestion & Egress</td>
                <td className="p-4 font-mono text-amber-400">0 KB (Zero outbound packets)</td>
                <td className="p-4 font-mono text-zinc-400">100% Upload + Download Required</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">Data Privacy & Exposure</td>
                <td className="p-4 text-zinc-200">Air-gapped memory sandbox. Zero server retention.</td>
                <td className="p-4 text-zinc-500">Subject to server logs, storage retention & leaks.</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">Processing Latency</td>
                <td className="p-4 font-mono text-zinc-200">Instantaneous (Local CPU/SIMD speed)</td>
                <td className="p-4 font-mono text-zinc-500">High (Queue times + Network upload delays)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">File Size Limits</td>
                <td className="p-4 text-zinc-200">Limited only by available Client RAM (4GB+)</td>
                <td className="p-4 text-zinc-500">Strict 25MB–100MB paywalls</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">Offline Capability</td>
                <td className="p-4 text-amber-400 font-semibold">100% Functional Offline (PWA Ready)</td>
                <td className="p-4 text-zinc-500">Inoperable without internet access</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 4. Product Catalog Directory & Tabs ── */}
      <section id="catalog" className="flex flex-col gap-6 pt-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
              <Layers size={14} />
              <span>Workstation Directory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Engineering Workstation Catalog
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Filter by suite category or search across all {allTools.length} dedicated tools.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/30 transition-all font-sans"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategoryTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategoryTab === "all"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/10"
                : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.06]"
            }`}
          >
            All Suites ({allTools.length})
          </button>

          {SIDEBAR_CATEGORIES.map((cat) => {
            const isActive = activeCategoryTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryTab(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-amber-400 text-black shadow-md shadow-amber-400/10"
                    : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.06]"
                }`}
              >
                {cat.name} ({cat.items.length})
              </button>
            );
          })}
        </div>

        {/* Workstation Directory Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {displayedTools.map((tool) => {
            const ToolIcon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="p-4 rounded-2xl bg-[#0c0d14] border border-white/[0.07] hover:border-amber-400/30 hover:bg-[#10121b] transition-all flex flex-col justify-between group"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-white/[0.04] group-hover:bg-amber-400/10 text-zinc-400 group-hover:text-amber-400 transition-colors">
                      <ToolIcon size={16} />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.06]">
                      {tool.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {tool.label}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans mt-0.5 leading-relaxed">
                      {tool.sublabel}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>{tool.categoryName}</span>
                  <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Launch →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 5. Technical FAQ & Browser Guidance ── */}
      <section className="flex flex-col gap-6 pt-4 pb-8">
        <div className="flex flex-col gap-1.5 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
            <HelpCircle size={14} />
            <span>Technical Reference</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            System Compatibility & FAQ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 rounded-xl bg-[#0c0d14] border border-white/[0.06] flex flex-col gap-2">
            <h4 className="font-semibold text-white text-sm">Which browsers are supported?</h4>
            <p className="text-zinc-400 leading-relaxed">
              All modern browsers supporting WebAssembly SIMD and WebAudio API are fully supported, including Google Chrome 91+, Microsoft Edge 91+, Mozilla Firefox 89+, and Apple Safari 16.4+ (iOS & macOS).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0d14] border border-white/[0.06] flex flex-col gap-2">
            <h4 className="font-semibold text-white text-sm">How are large media files handled?</h4>
            <p className="text-zinc-400 leading-relaxed">
              Large files are streamed chunk-by-chunk through virtual WASM file systems without copying to disk. Allocation is bounded by your machine's available physical RAM.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0d14] border border-white/[0.06] flex flex-col gap-2">
            <h4 className="font-semibold text-white text-sm">Are cryptographic operations compliant?</h4>
            <p className="text-zinc-400 leading-relaxed">
              All key generations, certificate parses, and SHA hashes use W3C WebCrypto API (<code className="text-zinc-300 font-mono">crypto.subtle</code>), backed by the host operating system's native cryptographic primitives.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0d14] border border-white/[0.06] flex flex-col gap-2">
            <h4 className="font-semibold text-white text-sm">Can I use this completely offline?</h4>
            <p className="text-zinc-400 leading-relaxed">
              Yes. Explosive Tools leverages progressive caching. Once loaded in your browser, all WASM modules, audio DSP nodes, and engines execute with zero internet connectivity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
