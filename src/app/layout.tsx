import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandPalette } from "@/components/command-palette";
import { OnboardingTutorial } from "@/components/onboarding-tutorial";
import { FeedbackModal } from "@/components/feedback-modal";
import { ConsoleDrawer } from "@/components/console-drawer";
import { CookieConsent } from "@/components/cookie-consent";
import { AppHeader } from "@/components/app-header";
import { AppStatusBar } from "@/components/app-status-bar";
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
    default: "Explosive Tools — 100% Client-Side In-Browser Media & File Engineering Studio",
    template: "%s | Explosive Tools",
  },
  description:
    "High-performance client-side media converter and forensic engineering studio powered by WebAssembly SIMD. Audio DSP, H.264 video compression, OCR, raster-to-SVG vectorization, PDF manipulation, and in-memory archive repacking. 100% private with zero server uploads.",
  keywords: [
    "Explosive Tools",
    "ExplosiveTools",
    "Explosive Converter",
    "Explosive Studio",
    "file converter",
    "converter tools",
    "free online converter",
    "client-side converter",
    "webassembly media converter",
    "audio converter",
    "video compressor",
    "pdf editor",
    "metadata scrubber",
    "exif remover",
    "image vectorizer",
    "client-side ocr",
    "audio dsp stem isolator",
    "animated gif optimizer",
    "data format morph",
    "archive inspector",
    "ffmpeg wasm",
    "private file tools",
  ],
  authors: [{ name: "Explosive Tools", url: SITE_URL }],
  creator: "Explosive Tools",
  publisher: "Explosive Tools",
  applicationName: "Explosive Tools",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
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
    title: "Explosive Tools — In-Browser Media & File Engineering Studio",
    description:
      "High-grade client-side WebAssembly media and document engineering suite with zero-server privacy.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Explosive Tools Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explosive Tools — In-Browser Media & File Engineering Studio",
    description:
      "High-performance in-browser media suite powered by WebAssembly SIMD.",
    images: ["/icon-512.png"],
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
  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://explosivetools.dpdns.org/#website",
    "name": "Explosive Tools",
    "alternateName": [
      "ExplosiveTools",
      "Explosive Converter",
      "Explosive Studio",
      "Explosive Tools & Converter",
      "Explosive"
    ],
    "url": "https://explosivetools.dpdns.org",
    "description": "High-performance client-side in-browser file converter and media engineering studio powered by WebAssembly SIMD.",
    "inLanguage": "en-US",
    "publisher": {
      "@type": "Organization",
      "@id": "https://explosivetools.dpdns.org/#organization",
      "name": "Explosive Tools",
      "url": "https://explosivetools.dpdns.org",
      "logo": {
        "@type": "ImageObject",
        "url": "https://explosivetools.dpdns.org/icon-512.png",
        "width": 512,
        "height": 512
      }
    }
  };

  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Explosive Tools",
    "alternateName": "Explosive Converter",
    "url": "https://explosivetools.dpdns.org",
    "logo": "https://explosivetools.dpdns.org/icon-512.png",
    "image": "https://explosivetools.dpdns.org/icon-512.png",
    "description":
      "High-performance client-side WebAssembly media converter and document processing suite. Convert audio, compress video, transcode images, extract OCR, vectorize graphics, scrub metadata, and manipulate PDFs in memory.",
    "applicationCategory": "MultimediaApplication",
    "applicationSubCategory": "File Converter & Media Studio",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "100% Client-Side WebAssembly Processing",
      "Zero Server Uploads & Complete Privacy",
      "Audio DSP Synthesizer and Stem Slicer",
      "FFmpeg Video Transcoding and Compression",
      "In-Memory PDF Page Assembly & Watermarking",
      "Optical Character Recognition (OCR)",
      "Bitmap to Vector SVG Tracing",
      "EXIF and Steganography Forensics Scrubber",
      "JSON, YAML, CSV, TOML Data Morphing"
    ]
  };

  const jsonLdSiteLinks = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Audio DSP Workstation",
        "description": "Stem slicer, synth tone generator, and audio frequency analyzer",
        "url": "https://explosivetools.dpdns.org/dsp"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Video Transcoder & Compressor",
        "description": "FFmpeg WASM multi-threaded video shrink and MP4/WebM transcoder",
        "url": "https://explosivetools.dpdns.org/compress"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "PDF Engine & Assembler",
        "description": "In-memory PDF merge, split, watermark, and page organizer",
        "url": "https://explosivetools.dpdns.org/pdf"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Metadata & EXIF Scrubber",
        "description": "EXIF/XMP forensics, privacy sanitizer, and hidden channel detector",
        "url": "https://explosivetools.dpdns.org/metadata"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 5,
        "name": "OCR Text Extractor",
        "description": "Tesseract WASM client-side optical character recognition",
        "url": "https://explosivetools.dpdns.org/ocr"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 6,
        "name": "Bitmap to Vector SVG Tracer",
        "description": "Vectorize PNG and JPG images into scalable SVGs instantly",
        "url": "https://explosivetools.dpdns.org/vectorize"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 7,
        "name": "Data Morph & AST Formatter",
        "description": "JSON, YAML, TOML, CSV, XML conversion and syntax tree parser",
        "url": "https://explosivetools.dpdns.org/data-morph"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 8,
        "name": "Universal Image Converter",
        "description": "Convert WebP, PNG, JPEG, AVIF, HEIC, TIFF, BMP with quality tuning",
        "url": "https://explosivetools.dpdns.org/image"
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <meta name="application-name" content="Explosive Tools" />
        <meta name="apple-mobile-web-app-title" content="Explosive Tools" />
        <meta property="og:site_name" content="Explosive Tools" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/icon-512.png" sizes="512x512" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSiteLinks) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased selection:bg-zinc-700 selection:text-white" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
          <div className="flex flex-col min-h-screen w-full">
            <AppHeader />
            <main className="flex-1 flex flex-col items-center px-3 sm:px-6 pt-20 pb-16 w-full">
              {children}
            </main>
            <AppStatusBar />
            <ConsoleDrawer />
          </div>
          <CommandPalette />
          <OnboardingTutorial />
          <FeedbackModal />
          <CookieConsent />
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
