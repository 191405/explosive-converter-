import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandPalette } from "@/components/command-palette";
import { OnboardingTutorial } from "@/components/onboarding-tutorial";
import { FeedbackModal } from "@/components/feedback-modal";
import { EngineTelemetryBar } from "@/components/engine-telemetry-bar";
import { ConsoleDrawer } from "@/components/console-drawer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://explosivetools.dpdns.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Explosive Converter & Studio Suite — High-Performance File & Media Engineering",
    template: "%s | Explosive Tools",
  },
  description:
    "Industrial-grade media converter and document studio powered by WebAssembly SIMD and stream pipelines. Forensic metadata scrubbing, vector tracing, OCR, spatial audio DSP, video compression, PDF manipulation, and in-memory archive repacking.",
  keywords: [
    "file converter",
    "media studio",
    "webassembly converter",
    "metadata scrubber",
    "steganography inspector",
    "image vectorizer",
    "client-side ocr",
    "audio dsp stem isolator",
    "video compressor",
    "animated gif optimizer",
    "data format morph",
    "archive inspector",
    "pdf tools",
    "ffmpeg wasm",
    "private file tools",
    "offline converter",
  ],
  authors: [{ name: "Explosive Tools" }],
  creator: "Explosive Tools",
  publisher: "Explosive Tools",
  applicationName: "Explosive Studio Suite",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon.svg", sizes: "180x180", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Explosive Tools",
    title: "Explosive Converter & Studio Suite",
    description:
      "High-grade client-side WebAssembly media and document engineering suite with zero-server privacy.",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Explosive Tools Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Explosive Converter & Studio Suite",
    description:
      "High-performance in-browser media suite powered by WebAssembly SIMD.",
    images: ["/icon.svg"],
  },
  verification: {
    google: "w4UVOlECyiP4Dmq5bhe59smLzIO1USAxJUl-UFRmMCI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Explosive Converter",
    "url": "https://explosivetools.dpdns.org",
    "logo": "https://explosivetools.dpdns.org/icon.svg",
    "image": "https://explosivetools.dpdns.org/icon.svg",
    "description":
      "High-performance client-side WebAssembly media converter and document processing suite. Convert audio, compress video, transcode images, extract OCR, vectorize graphics, scrub metadata, and manipulate PDFs in memory.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Zero-Server In-Memory Processing",
      "Forensic Metadata Scrubber & Stego Inspector",
      "High-Precision Raster to SVG Vectorizer",
      "Client-Side OCR & Searchable PDF Synthesizer",
      "Spatial Audio DSP & Stem Phase Isolator",
      "Video Compression with CRF Controls",
      "Animated GIF/WebP Frame-Diff Optimizer",
      "Universal Code & Data AST Serialization Morph",
      "In-Memory Multi-Format Archive Inspector",
      "PDF Merge, Split and Rotation",
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#050507] text-zinc-100 font-sans antialiased selection:bg-zinc-700 selection:text-white" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:ml-[280px] min-h-screen relative z-10 w-full overflow-x-hidden">
              <EngineTelemetryBar />
              <main className="flex-1 flex flex-col items-center px-4 sm:px-8 py-6 md:py-10 w-full max-w-6xl mx-auto">
                {children}
              </main>
              <ConsoleDrawer />
            </div>
          </div>
          <CommandPalette />
          <OnboardingTutorial />
          <FeedbackModal />
          <Toaster position="bottom-right" theme="dark" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
