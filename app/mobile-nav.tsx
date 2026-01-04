"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flag-yellow)]/70"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((value) => !value)}
      >
        Menu
      </button>
      {open && (
        <div
          id="mobile-nav"
          className="absolute left-0 right-0 top-[76px] z-40 border-b-4 border-[var(--flag-red)] bg-[var(--surface)]/95 px-6 py-4 shadow-lg backdrop-blur"
        >
          <nav className="grid gap-3 text-sm font-medium text-[var(--ink-muted)]">
            <Link className="hover:text-[var(--ink)]" href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link
              className="hover:text-[var(--ink)]"
              href="/elections"
              onClick={() => setOpen(false)}
            >
              Elections
            </Link>
            <Link
              className="hover:text-[var(--ink)]"
              href="/methodology"
              onClick={() => setOpen(false)}
            >
              Methodology
            </Link>
            <Link
              className="hover:text-[var(--ink)]"
              href="/sources"
              onClick={() => setOpen(false)}
            >
              Sources
            </Link>
            <Link
              className="hover:text-[var(--ink)]"
              href="/disclaimer"
              onClick={() => setOpen(false)}
            >
              Disclaimer
            </Link>
            <Link
              className="hover:text-[var(--ink)]"
              href="/privacy"
              onClick={() => setOpen(false)}
            >
              Privacy
            </Link>
            <Link
              className="hover:text-[var(--ink)]"
              href="/terms"
              onClick={() => setOpen(false)}
            >
              Terms
            </Link>
            <Link
              className="hover:text-[var(--ink)]"
              href="/changelog"
              onClick={() => setOpen(false)}
            >
              Changelog
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
