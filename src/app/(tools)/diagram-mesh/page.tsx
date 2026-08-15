"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Network,
  Download,
  Copy,
  Check,
  Play,
  FileCode,
  Sparkles,
  Layers,
  RefreshCw,
  Image as ImageIcon,
  Code,
} from "lucide-react";
import { toast } from "sonner";

const PRESETS: Record<string, string> = {
  architecture: `graph TD
  Client[Web / Mobile Client] -->|HTTPS / WSS| Gateway[API Gateway / Envoy]
  Gateway --> Auth[Auth Microservice]
  Gateway --> Media[WebAssembly Media Engine]
  Gateway --> DB[(PostgreSQL Cache)]
  Media --> S3[Local Storage Blob]
  Auth --> JWT[Ed25519 Token Signer]`,

  oauth: `sequenceDiagram
  autonumber
  actor User
  participant App as Client SPA
  participant Auth as OAuth2 Server
  participant API as Resource API

  User->>App: Click 'Login with SSO'
  App->>Auth: Redirect with PKCE Challenge
  Auth->>User: Display Auth Consent
  User->>Auth: Approve Permissions
  Auth-->>App: Authorization Code
  App->>Auth: Exchange Code + PKCE Verifier
  Auth-->>App: JWT ID & Access Token
  App->>API: Fetch /v1/user/profile (Bearer JWT)
  API-->>App: 200 OK (User Data)`,

  gitflow: `gitGraph
  commit id: "Init Repo"
  commit id: "Setup Core"
  branch feature/wasm
  checkout feature/wasm
  commit id: "Add SIMD"
  commit id: "Optimize DSP"
  checkout main
  merge feature/wasm id: "Merge PR #14"
  commit id: "v1.0.0 Release" tag: "v1.0.0"`,

  state: `stateDiagram-v2
  [*] --> Idle
  Idle --> Ingesting: File Drop Event
  Ingesting --> Processing: Parse ArrayBuffer
  Processing --> RenderSVG: Compile Vector Mesh
  RenderSVG --> Ready: Output Cached
  Ready --> Idle: Reset State`,
};

export default function DiagramMeshPage() {
  const [code, setCode] = useState<string>(PRESETS.architecture);
  const [svgOutput, setSvgOutput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<"dark" | "neutral">("dark");

  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Compile Mermaid into SVG client-side
  const compileDiagram = async (sourceCode: string) => {
    setIsCompiling(true);
    try {
      // Dynamic import of mermaid to keep bundle lightweight
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: themeMode === "dark" ? "dark" : "neutral",
        securityLevel: "loose",
        fontFamily: "var(--font-geist-sans), sans-serif",
      });

      const id = `mermaid-svg-${Date.now()}`;
      const { svg } = await mermaid.render(id, sourceCode);
      setSvgOutput(svg);
    } catch (err: any) {
      console.error(err);
      toast.error("Syntax Error in Diagram", {
        description: err.message || "Please check your Mermaid syntax.",
      });
    } finally {
      setIsCompiling(false);
    }
  };

  useEffect(() => {
    compileDiagram(code);
  }, [themeMode]);

  // Export SVG
  const exportSvg = () => {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "architecture_diagram.svg";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Vector diagram exported as SVG");
  };

  // Export PNG via Canvas
  const exportPng = () => {
    if (!svgOutput) return;
    const img = new Image();
    const svgBlob = new Blob([svgOutput], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 2; // 2x high-DPI
      canvas.width = (img.width || 800) * scale;
      canvas.height = (img.height || 600) * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0c0d12";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = "architecture_diagram_2x.png";
            a.click();
            URL.revokeObjectURL(pngUrl);
            toast.success("High-DPI PNG exported");
          }
        }, "image/png");
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // Export Standalone HTML
  const exportHtml = () => {
    if (!svgOutput) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Architecture Diagram — Explosive Tools</title>
  <style>
    body { background: #0b0c10; color: #f0f2f6; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; font-family: sans-serif; }
    .container { max-width: 90vw; padding: 2rem; background: #101218; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    svg { width: 100%; height: auto; display: block; }
  </style>
</head>
<body>
  <div class="container">
    ${svgOutput}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram_standalone.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Standalone interactive HTML exported");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Mermaid syntax copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Engineering Architecture</span>
            <span>/</span>
            <span className="text-zinc-300">Mermaid Vector Compiler</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            Architecture Diagram & Topology Vector Engine
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl">
            In-browser code-to-vector compiler. Convert Mermaid flowcharts, sequence diagrams, Git graphs, and state machines into high-DPI PNGs, vector SVGs, and standalone HTML packages.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            Mermaid.js Core
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 font-semibold">
            100% In-Memory
          </span>
        </div>
      </div>

      {/* Preset Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <span className="text-zinc-500 text-[11px]">PRESETS:</span>
          {Object.keys(PRESETS).map((pKey) => (
            <button
              key={pKey}
              onClick={() => {
                setCode(PRESETS[pKey]);
                compileDiagram(PRESETS[pKey]);
              }}
              className="neu-btn px-3 py-1 text-xs capitalize whitespace-nowrap"
            >
              {pKey}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportSvg}
            className="neu-btn px-3 py-1.5 text-xs text-amber-400 flex items-center gap-1.5"
          >
            <Download size={13} />
            <span>SVG</span>
          </button>
          <button
            onClick={exportPng}
            className="neu-btn px-3 py-1.5 text-xs text-zinc-300 flex items-center gap-1.5"
          >
            <ImageIcon size={13} />
            <span>PNG 2x</span>
          </button>
          <button
            onClick={exportHtml}
            className="neu-btn px-3 py-1.5 text-xs text-zinc-300 flex items-center gap-1.5"
          >
            <FileCode size={13} />
            <span>HTML</span>
          </button>
        </div>
      </div>

      {/* Grid: Editor + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Editor */}
        <div className="neu-tile p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <span className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-2">
              <Code size={14} className="text-amber-400" />
              <span>Diagram Code (Mermaid Syntax)</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={copyCode}
                className="neu-btn px-2.5 py-1 text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
              >
                {copied ? <Check size={11} className="text-amber-400" /> : <Copy size={11} />}
                <span>Copy</span>
              </button>
              <button
                onClick={() => compileDiagram(code)}
                className="neu-btn-primary px-3 py-1 text-xs flex items-center gap-1"
              >
                <Play size={11} />
                <span>Run</span>
              </button>
            </div>
          </div>

          <textarea
            rows={16}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="neu-inset p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none font-mono leading-relaxed"
            placeholder="Enter mermaid graph syntax..."
          />
        </div>

        {/* Live Vector Canvas Preview */}
        <div className="neu-tile p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <span className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-2">
              <Network size={14} className="text-amber-400" />
              <span>Vector Canvas Preview</span>
            </span>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-500 text-[11px]">Theme:</span>
              <button
                onClick={() => setThemeMode(themeMode === "dark" ? "neutral" : "dark")}
                className="neu-btn px-2.5 py-1 text-[11px] capitalize"
              >
                {themeMode}
              </button>
            </div>
          </div>

          <div
            ref={previewContainerRef}
            className="neu-inset p-4 flex items-center justify-center min-h-[380px] overflow-auto"
            dangerouslySetInnerHTML={{ __html: svgOutput }}
          />
        </div>
      </div>
    </div>
  );
}
