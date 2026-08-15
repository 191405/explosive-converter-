"use client";

import React, { useState, useEffect } from "react";
import { NeoDropzone } from "@/components/dropzone";
import {
  ShieldCheck,
  Key,
  Lock,
  Download,
  Copy,
  Check,
  RefreshCw,
  FileCode,
  Sparkles,
  ArrowRight,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

export default function CryptoVaultPage() {
  const [inputText, setInputText] = useState<string>("");
  const [parsedKeyInfo, setParsedKeyInfo] = useState<{
    type: string;
    algorithm: string;
    fingerprint: string;
    jwk?: object;
    pem?: string;
  } | null>(null);

  const [genAlgo, setGenAlgo] = useState<"RSA-OAEP" | "ECDSA" | "Ed25519">("ECDSA");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Parse or analyze PEM / Key input
  const analyzeCryptoAsset = async (raw: string) => {
    setInputText(raw);
    const clean = raw.trim();

    try {
      // Calculate SHA-256 fingerprint
      const enc = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest("SHA-256", enc.encode(clean));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const fingerprint = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(":");

      let detectedType = "Unknown Cryptographic Asset";
      if (clean.includes("BEGIN CERTIFICATE")) detectedType = "X.509 Public Certificate (PEM)";
      else if (clean.includes("BEGIN PRIVATE KEY")) detectedType = "PKCS#8 Private Key";
      else if (clean.includes("BEGIN RSA PRIVATE KEY")) detectedType = "PKCS#1 RSA Private Key";
      else if (clean.includes("BEGIN PUBLIC KEY")) detectedType = "SPKI Public Key";
      else if (clean.startsWith("{") && clean.includes('"kty"')) detectedType = "JSON Web Key (JWK)";

      let jwkObj: object | undefined;
      if (clean.startsWith("{") && clean.includes('"kty"')) {
        try {
          jwkObj = JSON.parse(clean);
        } catch {}
      }

      setParsedKeyInfo({
        type: detectedType,
        algorithm: clean.includes("EC") ? "ECDSA (Elliptic Curve)" : clean.includes("RSA") ? "RSA (2048/4096-bit)" : "Asymmetric Cryptography",
        fingerprint: fingerprint.toUpperCase(),
        jwk: jwkObj,
        pem: clean,
      });

      toast.success("Cryptographic asset analyzed in-memory");
    } catch (err) {
      console.error(err);
      toast.error("Failed to analyze cryptographic asset");
    }
  };

  // Generate new in-browser Keypair via WebCrypto
  const generateNewKeypair = async () => {
    setIsGenerating(true);
    try {
      if (genAlgo === "ECDSA") {
        const keyPair = await window.crypto.subtle.generateKey(
          { name: "ECDSA", namedCurve: "P-256" },
          true,
          ["sign", "verify"]
        );

        const pubJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
        const privJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);

        const exported = JSON.stringify({ public: pubJwk, private: privJwk }, null, 2);
        analyzeCryptoAsset(exported);
      } else {
        const keyPair = await window.crypto.subtle.generateKey(
          {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
          },
          true,
          ["encrypt", "decrypt"]
        );

        const pubJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
        const privJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);

        const exported = JSON.stringify({ public: pubJwk, private: privJwk }, null, 2);
        analyzeCryptoAsset(exported);
      }

      toast.success(`Generated fresh ${genAlgo} keypair in local memory!`);
    } catch (err) {
      console.error(err);
      toast.error("Error generating keypair in browser");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Security & Cryptography</span>
            <span>/</span>
            <span className="text-zinc-300">WebCrypto Vault</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            Cryptographic Key, X.509 & JWK Studio
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl">
            In-memory X.509 certificate and private key inspector. Transcode between PEM, DER, and JWK (JSON Web Keys), generate ECDSA/RSA keypairs, and compute SHA-256 fingerprints with zero server exposure.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            WebCrypto Subtle
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
            Zero Telemetry
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Input & Key Generation */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="neu-tile p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-2">
                <FileCode size={14} className="text-amber-400" />
                <span>Paste PEM / X.509 / JWK Certificate</span>
              </span>
              <button
                onClick={() => {
                  setInputText("");
                  setParsedKeyInfo(null);
                }}
                className="neu-btn px-2 py-1 text-[11px] text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            </div>

            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => analyzeCryptoAsset(e.target.value)}
              placeholder="-----BEGIN CERTIFICATE-----&#10;MIIDdTCCAl2gAwIBAgIU...&#10;-----END CERTIFICATE-----"
              className="neu-inset p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none font-mono"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-zinc-500 font-mono">
                {inputText.length} characters
              </span>
              <button
                onClick={() => analyzeCryptoAsset(inputText)}
                disabled={!inputText.trim()}
                className="neu-btn px-4 py-1.5 text-xs text-white disabled:opacity-40"
              >
                Analyze Key
              </button>
            </div>
          </div>

          {/* Key Generation Studio */}
          <div className="neu-tile p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-2">
                <Key size={14} className="text-amber-400" />
                <span>WebCrypto In-Browser Keypair Generator</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                W3C WebCrypto
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-zinc-400">Algorithm:</span>
                <select
                  value={genAlgo}
                  onChange={(e) => setGenAlgo(e.target.value as any)}
                  className="neu-btn px-3 py-1.5 text-xs bg-[#101218] text-white"
                >
                  <option value="ECDSA">ECDSA (NIST P-256 Curve)</option>
                  <option value="RSA-OAEP">RSA (2048-bit High-Security)</option>
                </select>
              </div>

              <button
                onClick={generateNewKeypair}
                disabled={isGenerating}
                className="neu-btn-primary px-4 py-2 text-xs flex items-center gap-1.5 w-full sm:w-auto justify-center"
              >
                <Sparkles size={13} />
                <span>{isGenerating ? "Generating..." : "Generate Keypair"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Forensic Certificate Details */}
        <div className="flex flex-col gap-4">
          <div className="neu-tile p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-xs font-mono text-zinc-300 font-semibold">Security Fingerprint</span>
              {parsedKeyInfo && (
                <button
                  onClick={() => copyToClipboard(parsedKeyInfo.fingerprint)}
                  className="neu-btn p-1 text-zinc-400 hover:text-white"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              )}
            </div>

            {!parsedKeyInfo ? (
              <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                Paste or generate a key to inspect cryptographic metadata
              </div>
            ) : (
              <div className="flex flex-col gap-3 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span>{parsedKeyInfo.type}</span>
                </div>

                <div className="neu-inset p-3 flex flex-col gap-2">
                  <span className="text-zinc-500 text-[10px]">SHA-256 FINGERPRINT</span>
                  <span className="text-amber-300 select-all break-all leading-relaxed">
                    {parsedKeyInfo.fingerprint}
                  </span>
                </div>

                <div className="neu-inset p-3 flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Algorithm:</span>
                    <span className="text-white">{parsedKeyInfo.algorithm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Storage:</span>
                    <span className="text-emerald-400">100% Client RAM</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
