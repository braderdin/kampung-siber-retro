"use client";

import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "crtThemeEnabled";

interface CrtThemeControllerProps {
  className?: string;
}

export default function CrtThemeController({ className }: CrtThemeControllerProps) {
  // Hydration guard – start as null so the first render is skipped on the server
  const [isCrtEnabled, setIsCrtEnabled] = useState<boolean | null>(null);

  // Load persisted value from localStorage on the client
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const enabled = stored === "true";
    setIsCrtEnabled(enabled);
    document.documentElement.classList.toggle("crt-theme", enabled);
  }, []);

  // Toggle handler – persist & toggle class on <html>
  const toggleTheme = () => {
    const newVal = !(isCrtEnabled ?? false);
    setIsCrtEnabled(newVal);
    localStorage.setItem(LOCAL_STORAGE_KEY, String(newVal));
    document.documentElement.classList.toggle("crt-theme", newVal);
  };

  // While waiting for hydration, render nothing → avoids SSR mismatch
  if (isCrtEnabled === null) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className || ""}`}>
      <button
        onClick={toggleTheme}
        className={`
          flex items-center justify-center w-12 h-6
          bg-gray-800 border-2 border-gray-600 rounded
          focus:outline-none focus:ring-2 focus:ring-green-400
          hover:bg-gray-700 transition-colors
        `}
        aria-pressed={isCrtEnabled}
        aria-label="Toggle CRT terminal theme"
      >
        <span
          className={`
            block w-5 h-5 bg-gray-300 rounded-full
            transform transition-transform
            ${isCrtEnabled ? "translate-x-6" : "translate-x-0"}
          `}
        />
      </button>
      <span className="sr-only">
        CRT Theme {isCrtEnabled ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}