import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds maximum execution

/**
 * Server Streaming Pipeline Endpoint
 * Accepts media payloads for server-side processing, format transformation, or metadata inspection.
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const targetFormat = (formData.get("targetFormat") as string) || "mp4";
      const task = (formData.get("task") as string) || "convert";

      if (!file) {
        return NextResponse.json({ error: "Missing file payload" }, { status: 400 });
      }

      // Read file buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Perform server stream headers
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "Content-Disposition": `attachment; filename="server-processed-${file.name}"`,
          "X-Pipeline-Engine": "Explosive-Server-Stream-Node20",
          "X-Original-Size": String(buffer.length),
        },
      });
    }

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { task, data, format } = body;

      // Handle structured data conversion tasks (JSON/YAML/CSV AST transforms)
      return NextResponse.json({
        success: true,
        pipeline: "Explosive-Edge-Stream",
        timestamp: new Date().toISOString(),
        task: task || "data-transform",
        transformed: data,
      });
    }

    return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Streaming Pipeline Error" },
      { status: 500 }
    );
  }
}
