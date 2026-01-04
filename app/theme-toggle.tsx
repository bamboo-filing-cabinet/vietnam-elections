"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "theme";

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (mode: ThemeMode) => {
  document.documentElement.setAttribute("data-theme", mode);
};

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => getPreferredTheme());

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  const nextMode: ThemeMode = mode === "light" ? "dark" : "light";

  const handleToggle = () => {
    const updated = nextMode;
    setMode(updated);
    applyTheme(updated);
    window.localStorage.setItem(STORAGE_KEY, updated);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--surface-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flag-yellow)]/70"
      aria-label={`Switch to ${nextMode} mode`}
    >
      {mode === "light" ? "Dark" : "Light"}
    </button>
  );
}
