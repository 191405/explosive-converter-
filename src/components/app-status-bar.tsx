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
    <footer className="fixed bottom-0 left-0 right-0 z-30 h-7 bg-[#07080b] border-t border-white/[0.08] px-4 flex items-center justify-between text-[11px] font-mono text-zinc-400 select-none">
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
        {/* State */}
        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              telemetry.engineStatus === "processing"
                ? "bg-amber-400 animate-pulse"
                : "bg-emerald-400"
            }`}
          />
          <span className="text-zinc-200">
            {telemetry.engineStatus === "processing"
              ? `RUNNING: ${telemetry.activeJobName || "PIPELINE"}`
              : "READY"}
          </span>
        </div>

        {/* SIMD */}
        <div className="flex items-center gap-1">
          <Zap size={11} className={telemetry.simdActive ? "text-amber-400" : "text-zinc-600"} />
          <span>SIMD:</span>
          <span className={telemetry.simdActive ? "text-emerald-400" : "text-zinc-500"}>
            {telemetry.simdActive ? "128-BIT" : "STANDARD"}
          </span>
        </div>

        {/* CPU Concurrency */}
        {caps && (
          <div className="hidden sm:flex items-center gap-1">
            <Cpu size={11} className="text-zinc-500" />
            <span>CORES:</span>
            <span className="text-zinc-200 tabular-nums">{caps.hardwareConcurrency}</span>
          </div>
        )}

        {/* Heap */}
        {caps && (
          <div className="hidden md:flex items-center gap-1">
            <Layers size={11} className="text-zinc-500" />
            <span>HEAP:</span>
            <span className="text-zinc-200 tabular-nums">{caps.wasmMemoryLimitMB} MB</span>
          </div>
        )}

        <div className="hidden lg:flex items-center gap-1 text-zinc-500">
          <ShieldCheck size={11} className="text-emerald-400" />
          <span>ZERO-SERVER PRIVACY BUFFER</span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
          className="flex items-center gap-1 hover:text-zinc-200 transition-colors cursor-pointer text-[10px]"
        >
          <Settings2 size={11} />
          <span>PRIVACY & COOKIES</span>
        </button>

        <button
          onClick={() => window.dispatchEvent(new Event("toggle-console-drawer"))}
          className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer text-[10px]"
        >
          <Terminal size={11} />
          <span>STDOUT</span>
        </button>
      </div>
    </footer>
  );
}
