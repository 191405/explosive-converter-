import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { CinematicBackground } from "@/components/cinematic-bg";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandPalette } from "@/components/command-palette";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Explosive Converter — Client-Side File Tools",
  description:
    "Lightning-fast, privacy-first file conversion powered by WebAssembly. Merge PDFs, convert images, and compress videos — all in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex font-sans" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CinematicBackground />
          <Sidebar />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col md:ml-[300px] pb-32 md:pb-0 min-h-screen relative z-10">
            <main className="flex-1 flex flex-col items-center px-6 py-12 w-full max-w-5xl mx-auto overflow-x-hidden">
              {children}
            </main>
          </div>
          <CommandPalette />
          <Toaster position="bottom-right" theme="system" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
