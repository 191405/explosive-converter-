"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { NeoDropzone } from "@/components/dropzone";
import {
  Binary,
  Layers,
  FileCode,
  Download,
  Search,
  Hash,
  Activity,
  ArrowRight,
  ShieldCheck,
  Columns,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface ExtractedString {
  offset: number;
  text: string;
  type: "ascii" | "utf16";
}

export default function HexDiffPage() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [bufferA, setBufferA] = useState<Uint8Array | null>(null);
  const [bufferB, setBufferB] = useState<Uint8Array | null>(null);

  const [activeTab, setActiveTab] = useState<"hex" | "entropy" | "strings" | "diff">("hex");
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(512); // bytes per page
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [extractedStrings, setExtractedStrings] = useState<ExtractedString[]>([]);
  const [entropyData, setEntropyData] = useState<number[]>([]);
  const [avgEntropy, setAvgEntropy] = useState<number>(0);
  const [sha256Hash, setSha256Hash] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const entropyCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load File A
  const handleDropA = async (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setFileA(f);
    const arrayBuf = await f.arrayBuffer();
    const bytes = new Uint8Array(arrayBuf);
    setBufferA(bytes);
    setPageOffset(0);

    // Compute SHA-256
    const hashBuf = await crypto.subtle.digest("SHA-256", arrayBuf);
    const hashHex = Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setSha256Hash(hashHex);

    // Compute Shannon Entropy chunks
    computeEntropy(bytes);

    // Extract ASCII / UTF-16 strings
    extractStrings(bytes);
  };

  // Load File B for Diffing
  const handleDropB = async (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setFileB(f);
    const arrayBuf = await f.arrayBuffer();
    const bytes = new Uint8Array(arrayBuf);
    setBufferB(bytes);
    setActiveTab("diff");
  };

  // Compute Shannon Entropy per 256-byte block
  const computeEntropy = (bytes: Uint8Array) => {
    const blockSize = 256;
    const blocks = Math.ceil(bytes.length / blockSize);
    const entropies: number[] = [];
    let totalEntropy = 0;

    for (let i = 0; i < blocks; i++) {
      const start = i * blockSize;
      const end = Math.min(start + blockSize, bytes.length);
      const chunk = bytes.subarray(start, end);

      const freq: Record<number, number> = {};
      for (let j = 0; j < chunk.length; j++) {
        freq[chunk[j]] = (freq[chunk[j]] || 0) + 1;
      }

      let ent = 0;
      for (const count of Object.values(freq)) {
        const p = count / chunk.length;
        ent -= p * Math.log2(p);
      }
      entropies.push(ent);
      totalEntropy += ent;
    }

    setEntropyData(entropies);
    setAvgEntropy(blocks > 0 ? totalEntropy / blocks : 0);
  };

  // Extract printable strings >= 4 chars
  const extractStrings = (bytes: Uint8Array) => {
    const list: ExtractedString[] = [];
    let currentStr = "";
    let startOffset = 0;

    for (let i = 0; i < Math.min(bytes.length, 500000); i++) {
      const byte = bytes[i];
      if (byte >= 32 && byte <= 126) {
        if (currentStr.length === 0) startOffset = i;
        currentStr += String.fromCharCode(byte);
      } else {
        if (currentStr.length >= 4) {
          list.push({ offset: startOffset, text: currentStr, type: "ascii" });
          if (list.length >= 1000) break;
        }
        currentStr = "";
      }
    }
    setExtractedStrings(list);
  };

  // Draw Entropy Graph
  useEffect(() => {
    if (activeTab !== "entropy" || !entropyCanvasRef.current || entropyData.length === 0) return;
    const canvas = entropyCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw baseline grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let y = 0; y <= height; y += height / 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Entropy bars / gradient curve
    const barWidth = Math.max(1, width / entropyData.length);
    for (let i = 0; i < entropyData.length; i++) {
      const val = entropyData[i]; // 0.0 to 8.0
      const normH = (val / 8.0) * height;
      const x = i * barWidth;
      const y = height - normH;

      // Color mapping: low entropy (blue/steel), medium (amber), high/encrypted (red/crimson)
      if (val > 7.5) {
        ctx.fillStyle = "#ef4444"; // packed / encrypted / compressed
      } else if (val > 5.0) {
        ctx.fillStyle = "#e69d28"; // code / structured binary
      } else if (val > 2.0) {
        ctx.fillStyle = "#3b82f6"; // text / ascii
      } else {
        ctx.fillStyle = "#64748b"; // sparse / null bytes
      }

      ctx.fillRect(x, y, Math.ceil(barWidth), normH);
    }
  }, [activeTab, entropyData]);

  // Hex Slice
  const visibleBytes = useMemo(() => {
    if (!bufferA) return [];
    const end = Math.min(pageOffset + pageSize, bufferA.length);
    const rows: { offset: number; hex: string[]; ascii: string }[] = [];

    for (let i = pageOffset; i < end; i += 16) {
      const rowChunk = bufferA.subarray(i, Math.min(i + 16, end));
      const hexArr: string[] = [];
      let asciiStr = "";

      for (let j = 0; j < 16; j++) {
        if (j < rowChunk.length) {
          const b = rowChunk[j];
          hexArr.push(b.toString(16).padStart(2, "0").toUpperCase());
          asciiStr += b >= 32 && b <= 126 ? String.fromCharCode(b) : "·";
        } else {
          hexArr.push("  ");
          asciiStr += " ";
        }
      }
      rows.push({ offset: i, hex: hexArr, ascii: asciiStr });
    }
    return rows;
  }, [bufferA, pageOffset, pageSize]);

  // Copy SHA-256
  const copyHash = () => {
    if (!sha256Hash) return;
    navigator.clipboard.writeText(sha256Hash);
    setCopied(true);
    toast.success("SHA-256 copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6">
      {/* ── Workbench Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Forensics & Security</span>
            <span>/</span>
            <span className="text-zinc-300">Binary Byte Disassembler</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            Binary Hex, Shannon Entropy & Byte Diff Inspector
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl">
            In-memory hex viewer, Shannon entropy distribution curve (detects hidden encrypted/packed payloads), ASCII/UTF-16 string extractor, and byte-level binary comparison.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            ArrayBuffer SIMD
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
            100% In-Memory
          </span>
        </div>
      </div>

      {!fileA ? (
        <div className="w-full">
          <NeoDropzone
            onDropAccepted={handleDropA}
            maxFiles={1}
            sublabel="Drop any binary, executable, payload, firmware, or document (.bin, .exe, .wasm, .dat, .jpg, .pdf, .raw)"
          />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-5">
          {/* File Overview Card */}
          <div className="neu-tile p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 neu-btn text-amber-400">
                <Binary size={20} />
              </div>
              <div>
                <h3 className="font-mono text-sm font-semibold text-white">{fileA.name}</h3>
                <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-0.5">
                  <span>{(fileA.size / 1024).toFixed(1)} KB ({fileA.size.toLocaleString()} bytes)</span>
                  <span>•</span>
                  <span>Avg Entropy: <strong className="text-white">{avgEntropy.toFixed(2)} / 8.00</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyHash}
                className="neu-btn px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5"
                title={sha256Hash}
              >
                <Hash size={13} />
                <span>SHA-256: {sha256Hash.slice(0, 8)}...</span>
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
              <button
                onClick={() => {
                  setFileA(null);
                  setBufferA(null);
                  setFileB(null);
                  setBufferB(null);
                }}
                className="neu-btn px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white"
              >
                Change File
              </button>
            </div>
          </div>

          {/* Workbench Tabs */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("hex")}
              className={`neu-btn px-4 py-1.5 text-xs font-mono flex items-center gap-2 whitespace-nowrap ${
                activeTab === "hex" ? "active text-white border-amber-400/40" : "text-zinc-400"
              }`}
            >
              <Binary size={14} />
              <span>Hex Dump</span>
            </button>
            <button
              onClick={() => setActiveTab("entropy")}
              className={`neu-btn px-4 py-1.5 text-xs font-mono flex items-center gap-2 whitespace-nowrap ${
                activeTab === "entropy" ? "active text-white border-amber-400/40" : "text-zinc-400"
              }`}
            >
              <Activity size={14} />
              <span>Entropy Heatmap</span>
            </button>
            <button
              onClick={() => setActiveTab("strings")}
              className={`neu-btn px-4 py-1.5 text-xs font-mono flex items-center gap-2 whitespace-nowrap ${
                activeTab === "strings" ? "active text-white border-amber-400/40" : "text-zinc-400"
              }`}
            >
              <FileCode size={14} />
              <span>Extracted Strings ({extractedStrings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("diff")}
              className={`neu-btn px-4 py-1.5 text-xs font-mono flex items-center gap-2 whitespace-nowrap ${
                activeTab === "diff" ? "active text-white border-amber-400/40" : "text-zinc-400"
              }`}
            >
              <Columns size={14} />
              <span>Binary Diff {fileB ? `(${fileB.name})` : "(2nd File)"}</span>
            </button>
          </div>

          {/* Tab 1: Hex View */}
          {activeTab === "hex" && (
            <div className="neu-inset p-4 flex flex-col gap-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Offset:</span>
                  <span className="text-white font-bold">
                    0x{pageOffset.toString(16).padStart(8, "0").toUpperCase()} – 0x
                    {Math.min(pageOffset + pageSize, bufferA ? bufferA.length : 0)
                      .toString(16)
                      .padStart(8, "0")
                      .toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={pageOffset === 0}
                    onClick={() => setPageOffset(Math.max(0, pageOffset - pageSize))}
                    className="neu-btn px-3 py-1 text-xs disabled:opacity-40"
                  >
                    Prev Page
                  </button>
                  <button
                    disabled={!bufferA || pageOffset + pageSize >= bufferA.length}
                    onClick={() => setPageOffset(pageOffset + pageSize)}
                    className="neu-btn px-3 py-1 text-xs disabled:opacity-40"
                  >
                    Next Page
                  </button>
                </div>
              </div>

              {/* Hex Grid */}
              <div className="overflow-x-auto scrollbar-none py-2">
                <table className="w-full text-left font-mono">
                  <thead>
                    <tr className="text-zinc-500 border-b border-white/[0.04] text-[11px]">
                      <th className="py-1.5 pr-4 w-28">OFFSET</th>
                      <th className="py-1.5 px-2">00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F</th>
                      <th className="py-1.5 pl-4">DECODED TEXT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {visibleBytes.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="py-1 text-zinc-500 select-none">
                          0x{row.offset.toString(16).padStart(8, "0").toUpperCase()}
                        </td>
                        <td className="py-1 px-2 text-amber-200 tracking-wider">
                          <span className="text-zinc-200">
                            {row.hex.slice(0, 8).join(" ")}
                          </span>
                          <span className="text-zinc-600 mx-2">|</span>
                          <span className="text-zinc-300">
                            {row.hex.slice(8, 16).join(" ")}
                          </span>
                        </td>
                        <td className="py-1 pl-4 text-zinc-400 select-text tracking-widest whitespace-pre font-mono">
                          {row.ascii}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Shannon Entropy Heatmap */}
          {activeTab === "entropy" && (
            <div className="neu-inset p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <h3 className="font-semibold text-sm text-white">Shannon Entropy Distribution Curve</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Measures randomness per 256-byte sector (0.0 = uniform null bytes, ~4.0 = plaintext/code, ~7.95+ = high-entropy encrypted/compressed payloads).
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                    &gt;7.5 Encrypted/Packed
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    5-7 Structured
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    &lt;3 Sparse/Text
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#050608] rounded-xl p-3 border border-white/[0.04]">
                <canvas
                  ref={entropyCanvasRef}
                  width={900}
                  height={220}
                  className="w-full h-56 block rounded"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Extracted Strings */}
          {activeTab === "strings" && (
            <div className="neu-inset p-4 flex flex-col gap-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="text-zinc-300 font-semibold">
                  Printable Text Signatures ({extractedStrings.length})
                </span>
                <span className="text-zinc-500 text-[11px]">Min 4 Characters</span>
              </div>

              <div className="max-h-96 overflow-y-auto divide-y divide-white/[0.03] pr-2">
                {extractedStrings.map((s, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between hover:bg-white/[0.02] px-2">
                    <span className="text-zinc-500 select-none w-24">
                      0x{s.offset.toString(16).toUpperCase()}
                    </span>
                    <span className="text-zinc-200 flex-1 select-text break-all">
                      {s.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Binary Diff */}
          {activeTab === "diff" && (
            <div className="neu-inset p-5 flex flex-col gap-4">
              {!fileB ? (
                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold text-sm text-white">Compare with Second Binary File</h3>
                  <p className="text-xs text-zinc-400">
                    Drop a second version of this binary to highlight byte-for-byte insertions, modifications, and offsets.
                  </p>
                  <NeoDropzone onDropAccepted={handleDropB} maxFiles={1} sublabel="Drop comparison file here" />
                </div>
              ) : (
                <div className="flex flex-col gap-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold">{fileA.name}</span>
                      <ArrowRight size={14} className="text-amber-400" />
                      <span className="text-white font-bold">{fileB.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        setFileB(null);
                        setBufferB(null);
                      }}
                      className="neu-btn px-3 py-1 text-xs text-zinc-400 hover:text-white"
                    >
                      Remove Comparison
                    </button>
                  </div>

                  <div className="p-3 bg-[#050608] rounded-xl border border-white/[0.04]">
                    <span className="text-zinc-400 block mb-2">
                      Binary Delta Summary:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-2 rounded bg-white/[0.02]">
                        <span className="text-zinc-500 text-[10px] block">FILE A SIZE</span>
                        <span className="text-white">{bufferA?.length.toLocaleString()} bytes</span>
                      </div>
                      <div className="p-2 rounded bg-white/[0.02]">
                        <span className="text-zinc-500 text-[10px] block">FILE B SIZE</span>
                        <span className="text-white">{bufferB?.length.toLocaleString()} bytes</span>
                      </div>
                      <div className="p-2 rounded bg-white/[0.02]">
                        <span className="text-zinc-500 text-[10px] block">DELTA STATUS</span>
                        <span className={bufferA?.length === bufferB?.length ? "text-emerald-400" : "text-amber-400"}>
                          {bufferA?.length === bufferB?.length ? "Identical Length" : "Shifted / Resized"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
