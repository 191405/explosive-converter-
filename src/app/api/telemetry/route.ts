import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  const memUsage = process.memoryUsage ? process.memoryUsage() : null;

  return NextResponse.json({
    status: "operational",
    architecture: "Hybrid-Edge-Client-WASM",
    timestamp: new Date().toISOString(),
    latencyMs: Date.now() - startTime,
    edge: {
      runtime: "Node.js / Edge Compatible",
      region: process.env.VERCEL_REGION || "local-edge",
      simdSupported: true,
      maxClientPayloadMB: 2048,
    },
    capabilities: {
      workstationsTotal: 19,
      clientSideEngines: [
        "FFmpeg WASM (AV1/H.264/WebM/VP9)",
        "Web Audio DSP (VAD Silence Tracing & Stem Separation)",
        "Tesseract OCR (Client Multilingual)",
        "OpenCV / Canvas Image Transformations (Cloudinary Syntax)",
        "Babel / AST Morph Engine",
        "OpenType / WOFF2 Subsetter",
        "WebCrypto Key Derivation & Vault",
      ],
      serverSideEngines: [
        "Dynamic OpenGraph Image Generation (Edge ImageResponse)",
        "Headless Media Streaming & Transcoding API (/api/v1/transform)",
        "Zero-Knowledge Vault Sync (/api/vault/sync)",
        "Feedback & Bug Reporting Dispatch (/api/feedback)",
      ],
    },
    memory: memUsage
      ? {
          rssMB: Math.round(memUsage.rss / (1024 * 1024)),
          heapTotalMB: Math.round(memUsage.heapTotal / (1024 * 1024)),
          heapUsedMB: Math.round(memUsage.heapUsed / (1024 * 1024)),
        }
      : null,
  });
}
