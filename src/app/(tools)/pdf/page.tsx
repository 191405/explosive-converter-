"use client";

import { useState } from "react";
import { NeoDropzone } from "@/components/dropzone";
import { PDFDocument, degrees } from "pdf-lib";
import { Merge, Scissors, RotateCw, FileDown, Trash2, FileText, Download, CheckCircle2, Layers } from "lucide-react";
import { emitLog } from "@/lib/engine/orchestrator";
import { toast } from "sonner";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

type PDFMode = "merge" | "split" | "rotate";

const modes: { value: PDFMode; label: string; icon: typeof Merge; desc: string }[] = [
  { value: "merge", label: "Merge Documents", icon: Merge, desc: "Combine multiple PDF files into one single document" },
  { value: "split", label: "Split / Extract Pages", icon: Scissors, desc: "Extract specific page numbers or ranges (e.g. 1-3, 5)" },
  { value: "rotate", label: "Rotate Orientation", icon: RotateCw, desc: "Rotate document page orientations by 90°, 180° or 270°" },
];

export default function PDFTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<PDFMode>("merge");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const [resultName, setResultName] = useState("output.pdf");

  // Split-specific
  const [pageRange, setPageRange] = useState("1-3");
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // Rotate-specific
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90);

  const handleDrop = async (acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setDownloadUrl(null);

    if ((mode === "split" || mode === "rotate") && acceptedFiles.length > 0) {
      try {
        const buf = await acceptedFiles[0].arrayBuffer();
        const pdf = await PDFDocument.load(buf);
        setTotalPages(pdf.getPageCount());
      } catch {
        setTotalPages(null);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setDownloadUrl(null);
  };

  const clearAll = () => {
    setFiles([]);
    setDownloadUrl(null);
    setTotalPages(null);
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    emitLog(`Merging ${files.length} PDF documents in memory...`, "info", "WASM_CORE");

    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const buf = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buf);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
      }
      const bytes = await mergedPdf.save();
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      setResultSize(blob.size);
      setResultName("merged-document.pdf");
      setDownloadUrl(URL.createObjectURL(blob));
      emitLog(`Merge completed. Document size: ${formatBytes(blob.size)}`, "info", "WASM_CORE");
      toast.success("PDFs merged successfully!");
    } catch {
      toast.error("Failed to merge PDFs. Ensure all files are valid.");
    } finally {
      setIsProcessing(false);
    }
  };

  const splitPDF = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    emitLog(`Extracting page range [${pageRange}] from [${files[0].name}]...`, "info", "WASM_CORE");

    try {
      const buf = await files[0].arrayBuffer();
      const srcPdf = await PDFDocument.load(buf);
      const total = srcPdf.getPageCount();

      const pageIndices: number[] = [];
      const parts = pageRange.split(",").map((s) => s.trim());
      for (const part of parts) {
        if (part.includes("-")) {
          const [startStr, endStr] = part.split("-");
          const s = Math.max(1, parseInt(startStr, 10));
          const e = Math.min(total, parseInt(endStr, 10));
          for (let i = s; i <= e; i++) {
            if (!pageIndices.includes(i - 1)) pageIndices.push(i - 1);
          }
        } else {
          const p = parseInt(part, 10);
          if (p >= 1 && p <= total && !pageIndices.includes(p - 1)) {
            pageIndices.push(p - 1);
          }
        }
      }

      if (pageIndices.length === 0) {
        toast.error(`Invalid page range. Document has ${total} pages.`);
        setIsProcessing(false);
        return;
      }

      const outPdf = await PDFDocument.create();
      const pages = await outPdf.copyPages(srcPdf, pageIndices);
      pages.forEach((p) => outPdf.addPage(p));

      const bytes = await outPdf.save();
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      setResultSize(blob.size);
      setResultName(`extracted-pages-${files[0].name}`);
      setDownloadUrl(URL.createObjectURL(blob));
      emitLog(`Extraction complete. ${pages.length} pages extracted.`, "info", "WASM_CORE");
      toast.success(`Extracted ${pages.length} pages.`);
    } catch {
      toast.error("Extraction failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const rotatePDF = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    emitLog(`Rotating [${files[0].name}] by ${rotateAngle}°...`, "info", "WASM_CORE");

    try {
      const buf = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const total = pdf.getPageCount();

      for (let i = 0; i < total; i++) {
        const page = pdf.getPage(i);
        const currentRot = page.getRotation().angle;
        page.setRotation(degrees((currentRot + rotateAngle) % 360));
      }

      const bytes = await pdf.save();
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      setResultSize(blob.size);
      setResultName(`rotated-${files[0].name}`);
      setDownloadUrl(URL.createObjectURL(blob));
      emitLog(`Rotated ${total} pages by ${rotateAngle}°.`, "info", "WASM_CORE");
      toast.success(`Rotated ${total} pages by ${rotateAngle}°.`);
    } catch {
      toast.error("Rotation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6 font-sans">
      {/* Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Documents</span>
            <span>/</span>
            <span className="text-zinc-300">PDF Studio</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            PDF Studio & Document Synthesizer
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl">
            Merge documents, extract custom page ranges, and rotate page orientations locally in browser RAM with zero file uploads.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            PDF-Lib Core
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
            In-Memory
          </span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-2xl font-mono text-xs">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => {
                setMode(m.value);
                setDownloadUrl(null);
              }}
              className={`p-3 rounded-xl border flex flex-col items-start gap-1.5 transition-all text-left cursor-pointer ${
                isActive
                  ? "bg-white text-black font-semibold border-white shadow"
                  : "bg-[#0c0c10] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-[#121218]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={15} />
                <span>{m.label}</span>
              </div>
              <span className={`text-[10px] line-clamp-1 ${isActive ? "text-zinc-700" : "text-zinc-500"}`}>
                {m.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dropzone */}
      <div className="w-full max-w-2xl">
        <NeoDropzone
          onDropAccepted={handleDrop}
          accept={{ "application/pdf": [".pdf"] }}
          multiple={mode === "merge"}
          acceptedFormatsList={["PDF"]}
          label={mode === "merge" ? "Drop multiple PDFs to combine" : "Drop single PDF document"}
          sublabel="100% Client-side in-memory document parsing"
        />
      </div>

      {/* File List & Parameters */}
      {files.length > 0 && (
        <div className="w-full max-w-2xl bg-[#0c0c10] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <span className="text-zinc-300 font-semibold">
              Selected Document{files.length > 1 ? "s" : ""} ({files.length})
            </span>
            <button onClick={clearAll} className="text-zinc-500 hover:text-red-400 transition-colors">
              Clear All
            </button>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-2 text-zinc-300">
                <span className="truncate max-w-xs">{f.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 tabular-nums">{formatBytes(f.size)}</span>
                  <button onClick={() => removeFile(i)} className="text-zinc-500 hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mode-specific configuration inputs */}
          {mode === "split" && (
            <div className="pt-2 flex flex-col gap-2 border-t border-white/[0.06]">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Page Range (Total Pages: {totalPages ?? "..."})</span>
                <span className="text-white font-bold">{pageRange}</span>
              </div>
              <input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="e.g. 1-3, 5"
                className="input-base px-3 py-2 w-full"
              />
            </div>
          )}

          {mode === "rotate" && (
            <div className="pt-2 flex items-center justify-between border-t border-white/[0.06]">
              <span className="text-zinc-400">Rotation Angle</span>
              <div className="flex gap-1.5">
                {([90, 180, 270] as const).map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setRotateAngle(deg)}
                    className={`px-3 py-1 rounded border text-xs ${
                      rotateAngle === deg ? "bg-white text-black font-bold border-white" : "bg-white/[0.03] text-zinc-400 border-white/[0.06]"
                    }`}
                  >
                    +{deg}°
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Execute Button */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
            <button
              onClick={() => {
                if (mode === "merge") mergePDFs();
                else if (mode === "split") splitPDF();
                else if (mode === "rotate") rotatePDF();
              }}
              disabled={isProcessing || (mode === "merge" && files.length < 2)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow disabled:opacity-30"
            >
              <FileDown size={14} />
              <span>
                {isProcessing
                  ? "Processing Document..."
                  : mode === "merge"
                  ? `Merge ${files.length} PDFs`
                  : mode === "split"
                  ? "Extract Specified Pages"
                  : `Rotate Pages +${rotateAngle}°`}
              </span>
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download={resultName}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-colors shadow"
              >
                <Download size={14} />
                <span>Download ({formatBytes(resultSize)})</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
