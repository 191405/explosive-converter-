"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal, X, Trash2, Download, Minimize2, Maximize2, ChevronUp } from "lucide-react";
import { LogEntry, subscribeLogs, clearLogs } from "@/lib/engine/orchestrator";

export function ConsoleDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-console-drawer", handleToggle);
    const unsubscribe = subscribeLogs(setLogs);

    return () => {
      window.removeEventListener("toggle-console-drawer", handleToggle);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (autoScroll && isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll, isOpen]);

  const exportLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.source}] [${l.level.toUpperCase()}] ${l.message}`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `explosive-engine-logs-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 left-0 md:left-[280px] z-50 bg-[#09090b] border-t border-white/[0.1] shadow-2xl flex flex-col h-64 max-h-[50vh] transition-all font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111114] border-b border-white/[0.06] text-xs text-zinc-400 select-none">
        <div className="flex items-center gap-2 font-medium text-zinc-200">
          <Terminal size={14} className="text-amber-400" />
          <span>WASM & Engine Stdout Terminal</span>
          <span className="text-[10px] text-zinc-500 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.05]">
            {logs.length} events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-1 rounded text-[10px] border transition-colors ${
              autoScroll
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-white/[0.05] text-zinc-400 border-white/[0.08]"
            }`}
          >
            Auto-Scroll: {autoScroll ? "ON" : "OFF"}
          </button>

          <button
            onClick={exportLogs}
            disabled={logs.length === 0}
            className="p-1 hover:bg-white/[0.08] rounded text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-30"
            title="Export Log File"
          >
            <Download size={14} />
          </button>

          <button
            onClick={clearLogs}
            disabled={logs.length === 0}
            className="p-1 hover:bg-white/[0.08] rounded text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-30"
            title="Clear Console"
          >
            <Trash2 size={14} />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/[0.08] rounded text-zinc-400 hover:text-zinc-200 transition-colors ml-1"
            title="Close Terminal"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-3 text-[11px] leading-relaxed space-y-1 bg-[#050507]">
        {logs.length === 0 ? (
          <div className="text-zinc-600 flex items-center justify-center h-full">
            No active jobs. Engine stdout will stream here in real-time during processing.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 hover:bg-white/[0.02] px-1 rounded">
              <span className="text-zinc-500 tabular-nums shrink-0">{log.timestamp}</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded shrink-0 font-bold ${
                  log.source === "WASM_CORE"
                    ? "bg-purple-950/60 text-purple-300 border border-purple-800/40"
                    : log.source === "SERVER_STREAM"
                    ? "bg-blue-950/60 text-blue-300 border border-blue-800/40"
                    : log.source === "DSP_ENGINE"
                    ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                    : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                }`}
              >
                {log.source}
              </span>
              <span
                className={`break-all ${
                  log.level === "error"
                    ? "text-red-400 font-semibold"
                    : log.level === "warn"
                    ? "text-amber-400"
                    : log.level === "debug"
                    ? "text-zinc-500"
                    : "text-zinc-300"
                }`}
              >
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
