import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory encrypted key-value vault store (backed by process memory or persistent KV)
const encryptedVaultStore = new Map<string, { ciphertext: string; updatedAt: string; size: number }>();

/**
 * Zero-Knowledge Encrypted Preset & Workspace Sync
 * Clients encrypt their workspace state using AES-GCM-256 with their private client key
 * and pass the SHA-256 hash of their key as vaultId. The server only sees ciphertext.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vaultId, ciphertext } = body;

    if (!vaultId || typeof vaultId !== "string" || vaultId.length < 16) {
      return NextResponse.json(
        { error: "Invalid vaultId identifier. Must be a valid SHA-256 key hash." },
        { status: 400 }
      );
    }

    if (!ciphertext || typeof ciphertext !== "string") {
      return NextResponse.json(
        { error: "Missing encrypted ciphertext payload." },
        { status: 400 }
      );
    }

    // Limit payload size to 1MB per encrypted preset
    const byteSize = Buffer.byteLength(ciphertext, "utf8");
    if (byteSize > 1024 * 1024) {
      return NextResponse.json(
        { error: "Ciphertext payload exceeds 1MB quota limit." },
        { status: 413 }
      );
    }

    const record = {
      ciphertext,
      updatedAt: new Date().toISOString(),
      size: byteSize,
    };

    encryptedVaultStore.set(vaultId, record);

    return NextResponse.json({
      success: true,
      message: "Encrypted vault record synced successfully.",
      updatedAt: record.updatedAt,
      sizeBytes: record.size,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process vault sync." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vaultId = searchParams.get("vaultId");

    if (!vaultId) {
      return NextResponse.json(
        { error: "Missing vaultId query parameter." },
        { status: 400 }
      );
    }

    const record = encryptedVaultStore.get(vaultId);
    if (!record) {
      return NextResponse.json(
        { error: "No encrypted record found for this vaultId." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ciphertext: record.ciphertext,
      updatedAt: record.updatedAt,
      sizeBytes: record.size,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch vault record." },
      { status: 500 }
    );
  }
}
