"use client";

import { useEffect, useState } from "react";
import { Cpu, Zap, Layers, Terminal, ShieldCheck } from "lucide-react";
import {
  subscribeTelemetry,
  probeSystemCapabilities,
  SystemCapabilities,
  TelemetrySnapshot,
} from "@/lib/engine/telemetry";

export function EngineTelemetryBar() {
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
    <header className="w-full bg-[#0a0b10] border-b border-white/[0.06] text-xs font-mono text-zinc-400 py-2 px-5 flex items-center justify-between overflow-x-auto scrollbar-none select-none z-30">
      <div className="flex items-center gap-5 sm:gap-6 shrink-0">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              telemetry.engineStatus === "processing"
                ? "bg-amber-400 animate-pulse"
                : "bg-zinc-400"
            }`}
          />
          <span className="font-semibold text-zinc-200">
            {telemetry.engineStatus === "processing"
              ? `Processing: ${telemetry.activeJobName || "Job"}`
              : "Engine Ready"}
          </span>
        </div>

        {/* SIMD */}
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Zap size={13} className={telemetry.simdActive ? "text-amber-400" : "text-zinc-600"} />
          <span>WASM SIMD:</span>
          <span className={telemetry.simdActive ? "text-amber-400 font-semibold" : "text-zinc-400"}>
            {telemetry.simdActive ? "128-bit Active" : "Standard"}
          </span>
        </div>

        {/* CPU Concurrency */}
        {caps && (
          <div className="hidden sm:flex items-center gap-1.5">
            <Cpu size={13} className="text-zinc-500" />
            <span>Threads:</span>
            <span className="text-zinc-200 tabular-nums font-semibold">{caps.hardwareConcurrency}</span>
          </div>
        )}

        {/* Memory Limit */}
        {caps && (
          <div className="hidden md:flex items-center gap-1.5">
            <Layers size={13} className="text-zinc-500" />
            <span>RAM Pool:</span>
            <span className="text-zinc-200 tabular-nums font-semibold">{caps.wasmMemoryLimitMB} MB</span>
          </div>
        )}

        <div className="hidden lg:flex items-center gap-1.5 text-zinc-500">
          <ShieldCheck size={13} className="text-amber-400" />
          <span>Zero Server Upload</span>
        </div>
      </div>

      {/* Terminal stdout trigger */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => window.dispatchEvent(new Event("toggle-console-drawer"))}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] transition-colors cursor-pointer text-xs"
          title="Toggle Terminal Output (`~`)"
        >
          <Terminal size={12} className="text-amber-400" />
          <span>Console Logs</span>
        </button>
      </div>
    </header>
  );
}
