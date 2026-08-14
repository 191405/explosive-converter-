import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { CinematicBackground } from "@/components/cinematic-bg";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandPalette } from "@/components/command-palette";
import { OnboardingTutorial } from "@/components/onboarding-tutorial";
import { FeedbackModal } from "@/components/feedback-modal";
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
    default: "Explosive Converter — Client-Side File Tools & Media Processing",
    template: "%s | Explosive Tools",
  },
  description:
    "Lightning-fast, 100% private in-browser media converter and document suite powered by WebAssembly. Compress videos, transcode images, convert audio, trim waveforms, merge PDFs, and record screens with zero server uploads.",
  keywords: [
    "file converter",
    "client-side converter",
    "video compressor",
    "pdf merger",
    "pdf splitter",
    "audio converter",
    "waveform trimmer",
    "image transcode",
    "screen recorder",
    "ffmpeg wasm",
    "private file tools",
    "free online converter",
    "offline converter",
  ],
  authors: [{ name: "Explosive Tools" }],
  creator: "Explosive Tools",
  publisher: "Explosive Tools",
  applicationName: "Explosive Converter",
  alternates: {
    canonical: "/",
  },
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
    title: "Explosive Converter — 100% Private Client-Side File Suite",
    description:
      "Convert audio, compress video, transcode images, manipulate PDFs, and record screens with zero server uploads. Powered by WebAssembly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explosive Converter — Client-Side File Tools",
    description:
      "Privacy-first in-memory media processing. Convert video, audio, images, and PDFs directly in your browser with zero uploads.",
  },
  verification: {
    google: "w4UVOlECyiP4Dmq5bhe59smLzIO1USAxJUl-UFRmMCI",
  },
  icons: {
    icon: "/favicon.ico",
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
    "description": "100% private, client-side WebAssembly media converter and document processing suite. Convert audio, compress video, transcode images, and manipulate PDFs in memory.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Zero-Server File Processing",
      "Offline Capable WebAssembly Execution",
      "Video Compression with CRF Controls",
      "Audio Extraction and Transcoding",
      "Lossless Waveform Audio Trimming",
      "PDF Merge, Split and Rotation",
      "High-Frame-Rate Screen and Camera Recording",
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex font-sans" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CinematicBackground />
          <Sidebar />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col md:ml-[300px] pt-16 md:pt-0 pb-24 md:pb-12 min-h-screen relative z-10">
            <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-6 md:py-12 w-full max-w-5xl mx-auto overflow-x-hidden">
              {children}
            </main>
          </div>
          <CommandPalette />
          <OnboardingTutorial />
          <FeedbackModal />
          <Toaster position="bottom-right" theme="system" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
