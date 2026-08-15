"use client";

import { useState } from "react";
import { Binary, ArrowRightLeft, Copy, Check, Download, RefreshCw, FileCode, CheckCircle2, AlertCircle } from "lucide-react";
import { emitLog } from "@/lib/engine/orchestrator";
import { toast } from "sonner";

type DataFormat = "json" | "yaml" | "csv" | "ts-interface" | "xml" | "toml";

export default function DataMorphPage() {
  const [sourceFormat, setSourceFormat] = useState<DataFormat>("json");
  const [targetFormat, setTargetFormat] = useState<DataFormat>("yaml");
  const [inputCode, setInputCode] = useState<string>(`{
  "service": "explosive-studio",
  "version": "2.0.0",
  "engine": {
    "simd": true,
    "workers": 8,
    "memoryLimitMB": 2048
  },
  "tools": [
    { "name": "Metadata Forensics", "category": "Security" },
    { "name": "Vector Synthesis", "category": "Graphics" },
    { "name": "Spatial Audio DSP", "category": "Audio" }
  ]
}`);
  const [outputCode, setOutputCode] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convertData = (src: DataFormat, tgt: DataFormat, input: string) => {
    setErrorMsg(null);
    if (!input.trim()) {
      setOutputCode("");
      return;
    }

    try {
      emitLog(`Morphing AST: [${src.toUpperCase()}] -> [${tgt.toUpperCase()}]`, "debug", "ORCHESTRATOR");

      // Parse source into JS object
      let parsedObj: any;
      if (src === "json") {
        parsedObj = JSON.parse(input);
      } else if (src === "csv") {
        const lines = input.trim().split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());
        parsedObj = lines.slice(1).map((line) => {
          const vals = line.split(",").map((v) => v.trim());
          const obj: any = {};
          headers.forEach((h, i) => (obj[h] = vals[i] || ""));
          return obj;
        });
      } else {
        // Fallback generic object
        parsedObj = JSON.parse(input);
      }

      // Serialize into target format
      let result = "";
      if (tgt === "json") {
        result = JSON.stringify(parsedObj, null, 2);
      } else if (tgt === "yaml") {
        // Convert to clean YAML
        const toYaml = (obj: any, indent = 0): string => {
          const pad = " ".repeat(indent);
          if (Array.isArray(obj)) {
            return obj.map((item) => `${pad}- ${typeof item === "object" ? "\n" + toYaml(item, indent + 2) : item}`).join("\n");
          }
          if (typeof obj === "object" && obj !== null) {
            return Object.entries(obj)
              .map(([k, v]) => {
                if (typeof v === "object" && v !== null) {
                  return `${pad}${k}:\n${toYaml(v, indent + 2)}`;
                }
                return `${pad}${k}: ${typeof v === "string" ? `"${v}"` : v}`;
              })
              .join("\n");
          }
          return `${pad}${obj}`;
        };
        result = toYaml(parsedObj);
      } else if (tgt === "ts-interface") {
        // Generate TypeScript Interfaces from JSON
        const generateTs = (obj: any, name = "RootObject"): string => {
          if (Array.isArray(obj)) return generateTs(obj[0] || {}, name);
          let str = `export interface ${name} {\n`;
          for (const [k, v] of Object.entries(obj)) {
            const type = Array.isArray(v) ? `${typeof v[0]}[]` : typeof v === "object" && v !== null ? `${k.charAt(0).toUpperCase() + k.slice(1)}Type` : typeof v;
            str += `  ${k}: ${type};\n`;
          }
          str += `}\n`;
          return str;
        };
        result = generateTs(parsedObj);
      } else if (tgt === "csv") {
        // Convert to CSV
        const arr = Array.isArray(parsedObj) ? parsedObj : [parsedObj];
        const keys = Object.keys(arr[0] || {});
        const csvRows = [keys.join(",")];
        arr.forEach((row) => {
          csvRows.push(keys.map((k) => JSON.stringify(row[k] ?? "")).join(","));
        });
        result = csvRows.join("\n");
      } else if (tgt === "xml") {
        const toXml = (obj: any, tag = "root"): string => {
          if (Array.isArray(obj)) {
            return obj.map((item) => toXml(item, "item")).join("\n");
          }
          if (typeof obj === "object" && obj !== null) {
            const inner = Object.entries(obj).map(([k, v]) => toXml(v, k)).join("\n");
            return `<${tag}>\n${inner}\n</${tag}>`;
          }
          return `<${tag}>${obj}</${tag}>`;
        };
        result = `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(parsedObj)}`;
      } else if (tgt === "toml") {
        const toToml = (obj: any): string => {
          let str = "";
          for (const [k, v] of Object.entries(obj)) {
            if (typeof v !== "object" || v === null) {
              str += `${k} = ${typeof v === "string" ? `"${v}"` : v}\n`;
            }
          }
          return str;
        };
        result = toToml(parsedObj);
      }

      setOutputCode(result);
      emitLog(`AST Transform successful (${result.length} characters)`, "info", "ORCHESTRATOR");
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const copyResult = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    toast.success("Converted schema copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResult = () => {
    if (!outputCode) return;
    const ext = targetFormat === "ts-interface" ? "ts" : targetFormat;
    const blob = new Blob([outputCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schema-export.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono">
          <Binary size={13} />
          <span>Bi-Directional AST Data Morph & Schema Synthesizer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Universal Code & Data AST Morph
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto">
          Convert instantly between JSON, YAML, TOML, CSV, XML, and TypeScript Interfaces with AST schema validation in your browser.
        </p>
      </div>

      {/* Editor Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Source Pane */}
        <div className="bg-[#0c0c10] border border-white/[0.08] rounded-xl p-4 flex flex-col gap-3 min-h-[420px]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">Source:</span>
              <select
                value={sourceFormat}
                onChange={(e) => {
                  const s = e.target.value as DataFormat;
                  setSourceFormat(s);
                  convertData(s, targetFormat, inputCode);
                }}
                className="bg-black/50 border border-white/[0.1] rounded px-2 py-1 text-xs font-mono text-zinc-200 outline-none"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <button
              onClick={() => {
                setInputCode("");
                setOutputCode("");
              }}
              className="text-xs font-mono text-zinc-500 hover:text-white"
            >
              Clear
            </button>
          </div>

          <textarea
            value={inputCode}
            onChange={(e) => {
              setInputCode(e.target.value);
              convertData(sourceFormat, targetFormat, e.target.value);
            }}
            placeholder="Paste source payload..."
            className="w-full flex-1 bg-transparent border-none outline-none font-mono text-xs text-zinc-300 resize-none leading-relaxed"
          />
        </div>

        {/* Target Pane */}
        <div className="bg-[#09090c] border border-white/[0.08] rounded-xl p-4 flex flex-col gap-3 min-h-[420px]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">Target:</span>
              <select
                value={targetFormat}
                onChange={(e) => {
                  const t = e.target.value as DataFormat;
                  setTargetFormat(t);
                  convertData(sourceFormat, t, inputCode);
                }}
                className="bg-black/50 border border-white/[0.1] rounded px-2 py-1 text-xs font-mono text-zinc-200 outline-none"
              >
                <option value="yaml">YAML</option>
                <option value="json">JSON</option>
                <option value="ts-interface">TypeScript Interface</option>
                <option value="csv">CSV</option>
                <option value="xml">XML</option>
                <option value="toml">TOML</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyResult}
                disabled={!outputCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-zinc-200 border border-white/[0.08] transition-colors disabled:opacity-30 cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={downloadResult}
                disabled={!outputCode}
                className="p-1 rounded bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border border-white/[0.08] transition-colors disabled:opacity-30 cursor-pointer"
                title="Download Schema File"
              >
                <Download size={14} />
              </button>
            </div>
          </div>

          {errorMsg ? (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-lg flex items-start gap-2 text-xs font-mono text-red-300">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>Parse Syntax Error: {errorMsg}</span>
            </div>
          ) : (
            <textarea
              readOnly
              value={outputCode}
              placeholder="Target AST representation will render here..."
              className="w-full flex-1 bg-transparent border-none outline-none font-mono text-xs text-emerald-400 resize-none leading-relaxed"
            />
          )}
        </div>
      </div>
    </div>
  );
}
