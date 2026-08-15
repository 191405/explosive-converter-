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
    try {
      const saved = localStorage.getItem("explosive_cookie_consent");
      if (!saved) {
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      } else {
        setPrefs(JSON.parse(saved));
      }
    } catch {
      setIsVisible(false);
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
    try {
      localStorage.setItem("explosive_cookie_consent", JSON.stringify(finalPrefs));
    } catch {}
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

  const dismiss = () => {
    savePreferences(prefs);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy & Cookie Preferences"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[120] max-w-lg w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto bg-[var(--bg-tile)]/95 backdrop-blur-xl border border-black/10 dark:border-white/[0.12] rounded-2xl shadow-2xl p-4 sm:p-5 text-[var(--text-main)] font-sans text-xs flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/[0.12] text-[var(--text-main)]">
            <Cookie size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-main)] tracking-tight">
              Privacy & Local Storage Controls
            </h2>
            <span className="text-[11px] text-[var(--text-dim)] font-mono">
              100% In-Browser • Zero Remote Tracking
            </span>
          </div>
        </div>

        <button
          onClick={dismiss}
          className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors p-1 cursor-pointer"
          aria-label="Dismiss cookie notice"
        >
          <X size={15} />
        </button>
      </div>

      <p className="text-[var(--text-muted)] text-xs leading-relaxed">
        Explosive Tools processes all audio, video, PDFs, and files directly inside your browser’s local memory sandbox. We use local storage purely to maintain your workspace state and cache WebAssembly compilation modules for faster startup.
      </p>

      {showDetails && (
        <div className="flex flex-col gap-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] font-mono text-[11px]">
          {/* Essential */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-tile-inset)] border border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Lock size={14} className="text-[var(--text-main)] shrink-0" />
              <div>
                <span className="text-[var(--text-main)] font-semibold block">Essential Workspace State</span>
                <span className="text-[10px] text-[var(--text-dim)]">Theme, tool parameters, and session state (Required)</span>
              </div>
            </div>
            <span className="text-[10px] bg-black/5 dark:bg-white/10 text-[var(--text-main)] px-2 py-0.5 rounded font-bold border border-black/10 dark:border-white/[0.12]">
              ALWAYS ACTIVE
            </span>
          </div>

          {/* WASM Cache */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-tile-inset)] border border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Cpu size={14} className="text-[var(--text-dim)] shrink-0" />
              <div>
                <span className="text-[var(--text-main)] font-semibold block">WebAssembly Binary Cache</span>
                <span className="text-[10px] text-[var(--text-dim)]">Cache compiled FFmpeg and Tesseract modules in IndexedDB</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.wasmCache}
              onChange={(e) => setPrefs({ ...prefs, wasmCache: e.target.checked })}
              className="accent-zinc-900 dark:accent-white w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {/* Hardware Telemetry */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-tile-inset)] border border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Database size={14} className="text-[var(--text-dim)] shrink-0" />
              <div>
                <span className="text-[var(--text-main)] font-semibold block">Hardware Telemetry</span>
                <span className="text-[10px] text-[var(--text-dim)]">Measure SIMD throughput and GPU canvas rendering locally</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.hardwareTelemetry}
              onChange={(e) => setPrefs({ ...prefs, hardwareTelemetry: e.target.checked })}
              className="accent-zinc-900 dark:accent-white w-4 h-4 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors flex items-center gap-1 font-mono cursor-pointer"
        >
          <Settings2 size={13} />
          <span>{showDetails ? "Hide Options" : "Customize"}</span>
        </button>

        <div className="flex items-center gap-2">
          {showDetails && (
            <button
              onClick={() => savePreferences(prefs)}
              className="neu-btn px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              Save Preferences
            </button>
          )}
          <button
            onClick={acceptAll}
            className="neu-btn-primary px-4 py-1.5 text-xs flex items-center gap-1.5"
          >
            <Check size={13} />
            <span>Accept & Close</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
