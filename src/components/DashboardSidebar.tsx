// Start: Dashboard Sidebar Navigation (Rule 31 Cyber-Village Brand)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie, setCookie, COOKIE_KEYS, SEVEN_DAYS_SECONDS } from "@/lib/cookies";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  accent: "cyan" | "magenta" | "volt";
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Papan Pemuka", icon: "🏠", accent: "cyan" },
  { href: "/hub", label: "Hab Komuniti", icon: "🌐", accent: "magenta" },
  { href: "/docs", label: "Dokumentasi", icon: "📚", accent: "volt" },
  { href: "/settings", label: "Tetapan", icon: "⚙️", accent: "cyan" },
];

const ACCENT_ACTIVE: Record<NavItem["accent"], string> = {
  cyan: "border-cyan-400/70 bg-cyan-500/10 text-cyan-200 shadow-[0_0_15px_rgba(0,255,255,0.18)]",
  magenta: "border-pink-400/70 bg-pink-500/10 text-pink-200 shadow-[0_0_15px_rgba(255,0,127,0.20)]",
  volt: "border-lime-400/70 bg-lime-500/10 text-lime-200 shadow-[0_0_15px_rgba(170,255,0,0.18)]",
};

export default function DashboardSidebar() {
  const pathname = usePathname();

  // Start: Strategy 2 — Sidebar & UI State Memory (cookie persistence)
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = getCookie(COOKIE_KEYS.SIDEBAR);
    if (saved === "collapsed") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    setCookie(COOKIE_KEYS.SIDEBAR, next ? "collapsed" : "expanded", {
      maxAge: SEVEN_DAYS_SECONDS,
    });
  };
  // End: Strategy 2 — Sidebar & UI State Memory

  return (
    // Start: Responsive fluid nav — horizontal wrap on mobile, vertical on desktop
    <nav
      aria-label="Navigasi papan pemuka"
      className="flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-3"
    >
      {/* Start: Collapse Toggle (remembers layout on reload) */}
      <button
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Kembangkan bar sisi" : "Runtuhkan bar sisi"}
        className="mb-1 hidden w-full items-center justify-end gap-1 rounded-md border border-[#00ffff]/30 bg-[#0e1330]/70 px-3 py-1.5 font-pixel text-xs text-cyan-200 transition-all hover:shadow-[0_0_12px_rgba(0,255,255,0.25)] lg:flex"
      >
        <span>{collapsed ? "▶ Panjang" : "◀ Runtuh"}</span>
      </button>
      {/* End: Collapse Toggle */}

      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={[
              "group flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2.5 font-pixel text-xs sm:text-sm transition-all duration-200 lg:justify-start",
              "border-white/10 bg-[#0e1330]/70 text-gray-300 hover:border-white/20 hover:text-white hover:shadow-[0_0_12px_rgba(0,255,255,0.12)] active:scale-95",
              collapsed ? "lg:px-2 lg:justify-center" : "",
              isActive ? ACCENT_ACTIVE[item.accent] : "",
            ].join(" ")}
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span className={`whitespace-nowrap ${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
    // End: Responsive fluid nav
  );
}
// End: Dashboard Sidebar Navigation (Rule 31 Cyber-Village Brand)