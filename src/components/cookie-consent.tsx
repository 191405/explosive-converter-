"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Cookie, Settings2, Check, X, Lock, Cpu, Database } from "lucide-react";

interface CookiePreferences {
  essential: boolean;
  wasmCache: boolean;
  hardwareTelemetry: boolean;
  timestamp: string;
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    wasmCache: true,
    hardwareTelemetry: true,
    timestamp: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("explosive_cookie_consent");
    if (!saved) {
      // Small delay for smooth entry
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    } else {
      try {
        setPrefs(JSON.parse(saved));
      } catch {}
    }

    const handleOpenSettings = () => {
      setShowDetails(true);
      setIsVisible(true);
    };

    window.addEventListener("open-cookie-settings", handleOpenSettings);
    return () => window.removeEventListener("open-cookie-settings", handleOpenSettings);
  }, []);

  const savePreferences = (preferences: CookiePreferences) => {
    const finalPrefs = { ...preferences, timestamp: new Date().toISOString() };
    localStorage.setItem("explosive_cookie_consent", JSON.stringify(finalPrefs));
    setPrefs(finalPrefs);
    setIsVisible(false);
    setShowDetails(false);
  };

  const acceptAll = () => {
    savePreferences({
      essential: true,
      wasmCache: true,
      hardwareTelemetry: true,
      timestamp: "",
    });
  };

  const acceptEssentialOnly = () => {
    savePreferences({
      essential: true,
      wasmCache: false,
      hardwareTelemetry: false,
      timestamp: "",
    });
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy & Cookie Preferences"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[120] max-w-lg w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto bg-[#0d0e15]/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-2xl p-4 sm:p-5 text-zinc-200 font-sans text-xs flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
            <Cookie size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Privacy & Local Storage Controls
            </h2>
            <span className="text-[11px] text-zinc-400 font-mono">
              100% In-Browser • Zero Remote Tracking
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
          aria-label="Dismiss cookie notice"
        >
          <X size={15} />
        </button>
      </div>

      <p className="text-zinc-400 text-xs leading-relaxed">
        Explosive Tools processes all audio, video, PDFs, and files directly inside your browser’s local memory sandbox. We use local storage purely to maintain your workspace state and cache WebAssembly compilation modules for faster startup.
      </p>

      {showDetails && (
        <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.08] font-mono text-[11px]">
          {/* Essential */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Lock size={14} className="text-emerald-400 shrink-0" />
              <div>
                <span className="text-white font-semibold block">Essential Workspace State</span>
                <span className="text-[10px] text-zinc-500">Theme, tool parameters, and session state (Required)</span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
              ALWAYS ACTIVE
            </span>
          </div>

          {/* WASM Cache */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Database size={14} className="text-amber-400 shrink-0" />
              <div>
                <span className="text-white font-semibold block">WebAssembly Binary Cache</span>
                <span className="text-[10px] text-zinc-500">Caches compiled WASM cores locally in IndexedDB for instant load</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.wasmCache}
              onChange={(e) => setPrefs({ ...prefs, wasmCache: e.target.checked })}
              className="accent-amber-400 h-4 w-4 cursor-pointer"
            />
          </div>

          {/* Hardware Diagnostics */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Cpu size={14} className="text-cyan-400 shrink-0" />
              <div>
                <span className="text-white font-semibold block">Hardware Telemetry Probing</span>
                <span className="text-[10px] text-zinc-500">Probes CPU cores and SIMD 128-bit vector support to optimize rendering</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.hardwareTelemetry}
              onChange={(e) => setPrefs({ ...prefs, hardwareTelemetry: e.target.checked })}
              className="accent-amber-400 h-4 w-4 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs"
        >
          <Settings2 size={13} />
          <span>{showDetails ? "Hide Preferences" : "Customize Preferences"}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={acceptEssentialOnly}
            className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer text-xs font-medium"
          >
            Essential Only
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-1.5 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-colors shadow cursor-pointer text-xs"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
