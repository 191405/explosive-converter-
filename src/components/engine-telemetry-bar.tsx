"use client";

import { useEffect, useState } from "react";
import { Cpu, Zap, Activity, Terminal, Layers } from "lucide-react";
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
    <div className="w-full bg-[#08080a] border-y border-white/[0.06] text-[11px] font-mono text-zinc-400 py-1.5 px-4 flex items-center justify-between overflow-x-auto scrollbar-none select-none">
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        {/* Engine Status */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {telemetry.engineStatus === "processing" ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            )}
          </span>
          <span className="uppercase font-semibold tracking-wider text-zinc-300">
            {telemetry.engineStatus === "processing"
              ? `RUNNING: ${telemetry.activeJobName || "JOB"}`
              : "ENGINE: IDLE"}
          </span>
        </div>

        {/* SIMD Acceleration */}
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Zap size={13} className={telemetry.simdActive ? "text-amber-400" : "text-zinc-600"} />
          <span>WASM SIMD:</span>
          <span className={telemetry.simdActive ? "text-emerald-400 font-semibold" : "text-zinc-500"}>
            {telemetry.simdActive ? "ENABLED" : "STANDARD"}
          </span>
        </div>

        {/* CPU Cores / Hardware concurrency */}
        {caps && (
          <div className="hidden sm:flex items-center gap-1.5">
            <Cpu size={13} className="text-zinc-500" />
            <span>THREADS:</span>
            <span className="text-zinc-200 tabular-nums font-semibold">{caps.hardwareConcurrency}</span>
          </div>
        )}

        {/* Memory Tier */}
        {caps && (
          <div className="hidden md:flex items-center gap-1.5">
            <Layers size={13} className="text-zinc-500" />
            <span>HEAP LIMIT:</span>
            <span className="text-zinc-200 tabular-nums">{caps.wasmMemoryLimitMB} MB</span>
          </div>
        )}
      </div>

      {/* Terminal stdout toggle trigger button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => window.dispatchEvent(new Event("toggle-console-drawer"))}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
          title="Toggle Pro Console Logs"
        >
          <Terminal size={12} className="text-zinc-400" />
          <span>CONSOLE LOGS</span>
        </button>
      </div>
    </div>
  );
}
