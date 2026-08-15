"use client";

import { useEffect, useState } from "react";
import { Cpu, Zap, Layers, ShieldCheck, Terminal, Settings2 } from "lucide-react";
import {
  subscribeTelemetry,
  probeSystemCapabilities,
  SystemCapabilities,
  TelemetrySnapshot,
} from "@/lib/engine/telemetry";

export function AppStatusBar() {
  const [caps, setCaps] = useState<SystemCapabilities | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetrySnapshot>({
    activeWorkers: 0,
    wasmHeapAllocatedMB: 0,
    simdActive: false,
    throughputMBps: 0,
    engineStatus: "idle",
    activeJobName: null,
  });

  useEffect(() => {
    probeSystemCapabilities().then(setCaps);
    const unsubscribe = subscribeTelemetry(setTelemetry);
    return () => unsubscribe();
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 h-7 bg-[var(--bg-main)] border-t border-black/[0.08] dark:border-white/[0.08] px-4 flex items-center justify-between text-[11px] font-mono text-[var(--text-dim)] select-none">
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
        {/* State */}
        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              telemetry.engineStatus === "processing"
                ? "bg-emerald-500 animate-pulse"
                : "bg-emerald-500/60"
            }`}
          />
          <span className="text-[var(--text-main)] font-medium">
            {telemetry.engineStatus === "processing"
              ? `RUNNING: ${telemetry.activeJobName || "PIPELINE"}`
              : "READY"}
          </span>
        </div>

        {/* SIMD */}
        <div className="flex items-center gap-1">
          <Zap size={11} className={telemetry.simdActive ? "text-emerald-500" : "text-[var(--text-dim)]"} />
          <span>SIMD:</span>
          <span className={telemetry.simdActive ? "text-[var(--text-main)] font-semibold" : "text-[var(--text-dim)]"}>
            {telemetry.simdActive ? "128-BIT" : "STANDARD"}
          </span>
        </div>

        {/* CPU Concurrency */}
        {caps && (
          <div className="hidden sm:flex items-center gap-1">
            <Cpu size={11} className="text-[var(--text-dim)]" />
            <span>CORES:</span>
            <span className="text-[var(--text-main)] tabular-nums">{caps.hardwareConcurrency}</span>
          </div>
        )}

        {/* Heap */}
        {caps && (
          <div className="hidden md:flex items-center gap-1">
            <Layers size={11} className="text-[var(--text-dim)]" />
            <span>HEAP:</span>
            <span className="text-[var(--text-main)] tabular-nums">{caps.wasmMemoryLimitMB} MB</span>
          </div>
        )}

        <div className="hidden lg:flex items-center gap-1 text-[var(--text-dim)]">
          <ShieldCheck size={11} className="text-emerald-500" />
          <span>ZERO-SERVER PRIVACY BUFFER</span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
          className="flex items-center gap-1 hover:text-[var(--text-main)] transition-colors cursor-pointer text-[10px]"
        >
          <Settings2 size={11} />
          <span>PRIVACY & COOKIES</span>
        </button>

        <button
          onClick={() => window.dispatchEvent(new Event("toggle-console-drawer"))}
          className="flex items-center gap-1 text-[var(--text-main)] hover:text-[var(--text-muted)] transition-colors cursor-pointer text-[10px]"
        >
          <Terminal size={11} />
          <span>STDOUT</span>
        </button>
      </div>
    </footer>
  );
}
