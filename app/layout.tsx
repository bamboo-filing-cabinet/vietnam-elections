import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import MobileNav from "./mobile-nav";
import ThemeToggle from "./theme-toggle";
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
    <html lang="en" data-theme="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-[var(--flag-red)] focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-white"
        >
          Skip to content
        </a>
        <div className="min-h-screen bg-[var(--app-bg)] text-[var(--ink)]">
          <header className="border-b-4 border-[var(--flag-red)] bg-[var(--surface)]/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
              <Link className="flex items-center gap-3" href="/">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--flag-red)] text-xs font-semibold tracking-[0.2em] text-white shadow-sm ring-2 ring-[var(--flag-yellow)]">
                  VE
                </div>
                <div>
                  <p className="text-lg font-semibold leading-tight text-[var(--ink)]">Vietnam Elections</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">Open Data Vietnam</p>
                </div>
              </Link>
              <div className="hidden items-center gap-4 md:flex">
                <nav className="flex items-center gap-5 text-sm font-medium text-[var(--ink-muted)]">
                  <Link className="hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flag-yellow)]/70" href="/">
                  Home
                  </Link>
                  <Link className="hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flag-yellow)]/70" href="/elections">
                  Elections
                  </Link>
                  <Link className="hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flag-yellow)]/70" href="/methodology">
                  Methodology
                  </Link>
                  <Link className="hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flag-yellow)]/70" href="/sources">
                  Sources
                  </Link>
                  <Link className="hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flag-yellow)]/70" href="/disclaimer">
                  Disclaimer
                  </Link>
                </nav>
                <ThemeToggle />
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle />
                <MobileNav />
              </div>
            </div>
          </header>
          <main id="main-content" className="mx-auto w-full max-w-6xl px-6 py-12">
            {children}
          </main>
          <footer className="border-t-4 border-[var(--flag-red)] bg-[var(--surface)]/90">
            <div className="mx-auto w-full max-w-6xl px-6 py-8 text-xs text-[var(--ink-muted)]">
              <p>Vietnam Elections is a static, source-linked directory. No endorsements or commentary.</p>
              <div className="mt-3 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                <Link className="hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flag-yellow)]/70" href="/privacy">
                  Privacy
                </Link>
                <Link className="hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flag-yellow)]/70" href="/terms">
                  Terms
                </Link>
                <Link className="hover:text-[var(--ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flag-yellow)]/70" href="/changelog">
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
