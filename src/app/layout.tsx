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
    default: "Explosive Tools — In-Browser Media & File Engineering Studio",
    template: "%s | Explosive Tools",
  },
  description:
    "High-performance client-side media converter and forensic engineering studio powered by WebAssembly SIMD. Audio DSP, H.264 video compression, OCR, raster-to-SVG vectorization, PDF manipulation, and in-memory archive repacking. 100% private.",
  keywords: [
    "Explosive Tools",
    "Explosive Converter",
    "file converter",
    "webassembly media converter",
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
  ],
  authors: [{ name: "Explosive Tools" }],
  creator: "Explosive Tools",
  publisher: "Explosive Tools",
  applicationName: "Explosive Tools",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
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
    "name": "Explosive Tools",
    "alternateName": ["Explosive Converter", "Explosive Studio", "Explosive"],
    "url": "https://explosivetools.dpdns.org",
  };

  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Explosive Tools",
    "url": "https://explosivetools.dpdns.org",
    "logo": "https://explosivetools.dpdns.org/icon-512.png",
    "image": "https://explosivetools.dpdns.org/icon-512.png",
    "description":
      "High-performance client-side WebAssembly media converter and document processing suite. Convert audio, compress video, transcode images, extract OCR, vectorize graphics, scrub metadata, and manipulate PDFs in memory.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
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
