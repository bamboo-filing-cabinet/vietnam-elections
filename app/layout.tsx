import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Vietnam Elections Data",
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
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f3f0e8_0%,_#f7f6f2_40%,_#ffffff_100%)] text-zinc-900">
          <header className="border-b border-zinc-200/80 bg-white/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold tracking-[0.2em] text-white shadow-sm">
                  VED
                </div>
                <div>
                  <p className="text-lg font-semibold leading-tight">Vietnam Elections Data</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Static directory</p>
                </div>
              </div>
              <nav className="hidden items-center gap-5 text-sm font-medium text-zinc-600 md:flex">
                <Link className="hover:text-zinc-900" href="/">
                  Home
                </Link>
                <Link className="hover:text-zinc-900" href="/elections">
                  Elections
                </Link>
                <Link className="hover:text-zinc-900" href="/methodology">
                  Methodology
                </Link>
                <Link className="hover:text-zinc-900" href="/sources">
                  Sources
                </Link>
                <Link className="hover:text-zinc-900" href="/disclaimer">
                  Disclaimer
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl px-6 py-12">{children}</main>
          <footer className="border-t border-zinc-200/80 bg-white/70">
            <div className="mx-auto w-full max-w-6xl px-6 py-8 text-xs text-zinc-500">
              <p>Vietnam Elections Data is a static, source-linked directory. No endorsements or commentary.</p>
              <div className="mt-3 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                <Link className="hover:text-zinc-600" href="/privacy">
                  Privacy
                </Link>
                <Link className="hover:text-zinc-600" href="/terms">
                  Terms
                </Link>
                <Link className="hover:text-zinc-600" href="/changelog">
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
