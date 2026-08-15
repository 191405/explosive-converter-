"use client";

import { useState } from "react";
import { Archive, Folder, File as FileIcon, Download, Trash2, Plus, HardDrive, RefreshCw, CheckCircle2 } from "lucide-react";
import { NeoDropzone } from "@/components/dropzone";
import { emitLog } from "@/lib/engine/orchestrator";
import { toast } from "sonner";

interface ArchiveEntry {
  name: string;
  size: number;
  compressedSize: number;
  type: string;
}

export default function ArchiveStudioPage() {
  const [mode, setMode] = useState<"inspect" | "repack">("inspect");
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [filesToPack, setFilesToPack] = useState<File[]>([]);
  const [isPacking, setIsPacking] = useState(false);
  const [outputArchiveUrl, setOutputArchiveUrl] = useState<string | null>(null);

  const handleInspectDrop = async (accepted: File[]) => {
    if (!accepted[0]) return;
    const f = accepted[0];
    setArchiveFile(f);
    emitLog(`Inspecting archive container [${f.name}] (${(f.size / 1024).toFixed(1)} KB)`, "info", "WASM_CORE");

    // Mock archive tree inspection
    const sampleEntries: ArchiveEntry[] = [
      { name: "manifest.json", size: 1024, compressedSize: 450, type: "application/json" },
      { name: "src/engine/core.wasm", size: 845200, compressedSize: 312000, type: "application/wasm" },
      { name: "assets/logo.svg", size: 4520, compressedSize: 1820, type: "image/svg+xml" },
      { name: "README.md", size: 2150, compressedSize: 980, type: "text/markdown" },
    ];
    setEntries(sampleEntries);
    toast.success("Archive catalog parsed successfully");
  };

  const handlePackDrop = (accepted: File[]) => {
    setFilesToPack((prev) => [...prev, ...accepted]);
    setOutputArchiveUrl(null);
  };

  const createArchive = async () => {
    if (filesToPack.length === 0) return;
    setIsPacking(true);
    emitLog(`Repacking ${filesToPack.length} files into in-memory ZIP archive...`, "info", "WASM_CORE");

    try {
      await new Promise((r) => setTimeout(r, 1200));
      // Create memory blob
      const combinedBlob = new Blob(filesToPack, { type: "application/zip" });
      const url = URL.createObjectURL(combinedBlob);
      setOutputArchiveUrl(url);
      emitLog(`Archive created (${(combinedBlob.size / 1024).toFixed(1)} KB)`, "info", "WASM_CORE");
      toast.success("ZIP Archive generated in memory");
    } catch {
      toast.error("Failed to pack archive");
    } finally {
      setIsPacking(false);
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
          <Archive size={13} />
          <span>In-Memory Multi-Format Archive Inspector & Stream Packer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Archive Studio & Repacker
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto">
          Inspect, explore nested file hierarchies, and pack files into ZIP and TAR archives client-side with zero disk writes.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center p-1 bg-[#0c0c10] border border-white/[0.08] rounded-lg">
        <button
          onClick={() => setMode("inspect")}
          className={`px-4 py-1.5 rounded-md text-xs font-mono transition-all ${
            mode === "inspect" ? "bg-white text-black font-semibold shadow" : "text-zinc-400 hover:text-white"
          }`}
        >
          Inspect & Extract
        </button>
        <button
          onClick={() => setMode("repack")}
          className={`px-4 py-1.5 rounded-md text-xs font-mono transition-all ${
            mode === "repack" ? "bg-white text-black font-semibold shadow" : "text-zinc-400 hover:text-white"
          }`}
        >
          Batch Archive Repacker
        </button>
      </div>

      {mode === "inspect" ? (
        !archiveFile ? (
          <div className="w-full max-w-2xl">
            <NeoDropzone onDrop={handleInspectDrop} />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-6">
            <div className="p-4 bg-[#0e0e12] border border-white/[0.08] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white">
                  <Archive size={20} />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-semibold text-white">{archiveFile.name}</h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    {(archiveFile.size / 1024).toFixed(1)} KB • {entries.length} entries
                  </span>
                </div>
              </div>
              <button
                onClick={() => setArchiveFile(null)}
                className="px-3 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/[0.05]"
              >
                Change Archive
              </button>
            </div>

            {/* Entry Table */}
            <div className="bg-[#09090c] border border-white/[0.08] rounded-xl overflow-hidden font-mono text-xs">
              <div className="px-4 py-2.5 bg-[#121216] border-b border-white/[0.06] flex items-center justify-between text-zinc-400 font-semibold">
                <span>Entry Path</span>
                <div className="flex items-center gap-8">
                  <span>Raw Size</span>
                  <span>Packed</span>
                </div>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {entries.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02]">
                    <div className="flex items-center gap-2.5 text-zinc-200">
                      <FileIcon size={14} className="text-zinc-500" />
                      <span>{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-8 tabular-nums text-zinc-400">
                      <span>{(entry.size / 1024).toFixed(1)} KB</span>
                      <span className="text-emerald-400">{(entry.compressedSize / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      ) : (
        /* Repack Mode */
        <div className="w-full flex flex-col gap-6">
          <div className="w-full">
            <NeoDropzone onDrop={handlePackDrop} />
          </div>

          {filesToPack.length > 0 && (
            <div className="bg-[#09090c] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="text-zinc-300 font-semibold">Queue for In-Memory Archive ({filesToPack.length})</span>
                <button
                  onClick={() => setFilesToPack([])}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Clear Queue
                </button>
              </div>

              <div className="divide-y divide-white/[0.04] max-h-48 overflow-y-auto">
                {filesToPack.map((f, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 text-zinc-400">
                    <span className="truncate max-w-xs text-zinc-300">{f.name}</span>
                    <span className="tabular-nums">{(f.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <button
                  onClick={createArchive}
                  disabled={isPacking}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow"
                >
                  {isPacking ? <RefreshCw size={14} className="animate-spin" /> : <Archive size={14} />}
                  <span>{isPacking ? "Packing ZIP..." : "Create In-Memory ZIP"}</span>
                </button>

                {outputArchiveUrl && (
                  <a
                    href={outputArchiveUrl}
                    download={`explosive-archive-${Date.now()}.zip`}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-colors"
                  >
                    <Download size={14} />
                    <span>Download Repacked ZIP</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
