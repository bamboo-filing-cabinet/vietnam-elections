import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import MobileNav from "./mobile-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vietnam Elections",
  description: "A static, sourced directory of official Vietnam election candidates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-white"
        >
          Skip to content
        </a>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f3f0e8_0%,_#f7f6f2_40%,_#ffffff_100%)] text-zinc-900">
          <header className="border-b border-zinc-200/80 bg-white/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
              <Link className="flex items-center gap-3" href="/">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold tracking-[0.2em] text-white shadow-sm">
                  VE
                </div>
                <div>
                  <p className="text-lg font-semibold leading-tight">Vietnam Elections</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Open Data Vietnam</p>
                </div>
              </Link>
              <nav className="hidden items-center gap-5 text-sm font-medium text-zinc-600 md:flex">
                <Link className="hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30" href="/">
                  Home
                </Link>
                <Link className="hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30" href="/elections">
                  Elections
                </Link>
                <Link className="hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30" href="/methodology">
                  Methodology
                </Link>
                <Link className="hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30" href="/sources">
                  Sources
                </Link>
                <Link className="hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30" href="/disclaimer">
                  Disclaimer
                </Link>
              </nav>
              <MobileNav />
            </div>
          </header>
          <main id="main-content" className="mx-auto w-full max-w-6xl px-6 py-12">
            {children}
          </main>
          <footer className="border-t border-zinc-200/80 bg-white/70">
            <div className="mx-auto w-full max-w-6xl px-6 py-8 text-xs text-zinc-500">
              <p>Vietnam Elections is a static, source-linked directory. No endorsements or commentary.</p>
              <div className="mt-3 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                <Link className="hover:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30" href="/privacy">
                  Privacy
                </Link>
                <Link className="hover:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30" href="/terms">
                  Terms
                </Link>
                <Link className="hover:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/30" href="/changelog">
                  Changelog
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
