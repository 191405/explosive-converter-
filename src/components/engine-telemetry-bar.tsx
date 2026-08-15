"use client";

import { useEffect, useState } from "react";
import { Cpu, Zap, Layers, Terminal, Activity, ShieldCheck } from "lucide-react";
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
    <header className="w-full bg-[#0b0c10] border-b border-white/[0.08] text-[10px] font-mono text-zinc-400 py-1.5 px-4 flex items-center justify-between overflow-x-auto scrollbar-none select-none z-30">
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        {/* Active Engine State */}
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              telemetry.engineStatus === "processing"
                ? "bg-amber-400 led-busy animate-pulse"
                : "bg-emerald-400 led-active"
            }`}
          />
          <span className="font-bold tracking-wider uppercase text-zinc-200">
            {telemetry.engineStatus === "processing"
              ? `RUNNING: ${telemetry.activeJobName || "PIPELINE"}`
              : "CORE: READY"}
          </span>
        </div>

        {/* Hardware SIMD Vector Acceleration */}
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Zap size={11} className={telemetry.simdActive ? "text-amber-400" : "text-zinc-600"} />
          <span className="text-zinc-500">SIMD:</span>
          <span className={telemetry.simdActive ? "text-emerald-400 font-bold" : "text-zinc-500"}>
            {telemetry.simdActive ? "128-BIT ACTIVE" : "STANDARD"}
          </span>
        </div>

        {/* Multi-thread Concurrency */}
        {caps && (
          <div className="hidden sm:flex items-center gap-1.5">
            <Cpu size={11} className="text-zinc-500" />
            <span className="text-zinc-500">CONCURRENCY:</span>
            <span className="text-zinc-200 tabular-nums font-bold">{caps.hardwareConcurrency} CORES</span>
          </div>
        )}

        {/* In-Memory Heap Limit */}
        {caps && (
          <div className="hidden md:flex items-center gap-1.5">
            <Layers size={11} className="text-zinc-500" />
            <span className="text-zinc-500">HEAP:</span>
            <span className="text-zinc-200 tabular-nums font-bold">{caps.wasmMemoryLimitMB} MB RAM</span>
          </div>
        )}

        <div className="hidden lg:flex items-center gap-1.5 text-zinc-500">
          <ShieldCheck size={11} className="text-emerald-400" />
          <span>ZERO-SERVER PRIVACY BUFFER</span>
        </div>
      </div>

      {/* Terminal stdout toggle trigger */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => window.dispatchEvent(new Event("toggle-console-drawer"))}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#141720] hover:bg-[#1c212e] text-zinc-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
          title="Toggle Stdout Terminal (`~`)"
        >
          <Terminal size={11} className="text-amber-400" />
          <span className="font-bold">STDOUT LOGS</span>
        </button>
      </div>
    </header>
  );
}
