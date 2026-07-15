// Start: Streamlined Retro Navigation Bar (Rule 31 Cyber-Neon Overhaul)
"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/store/useLanguageStore";
import { enDictionary, msDictionary } from "@/i18n/dictionaries";
import { useEffect, useRef, useState } from "react";
import RandomExplorerBtn from "@/components/RandomExplorerBtn";
import NeonButton from "@/components/ui/NeonButton";
import NeonCard from "@/components/ui/NeonCard";
import { setCookie, getCookie, COOKIE_KEYS, SEVEN_DAYS_SECONDS } from "@/lib/cookies";

type ThemeId = "space-neon" | "windows-gray" | "retro-matrix";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

interface HelpLink {
  name: string;
  href: string;
  icon: string;
  desc: string;
}

export default function RetroNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguageStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Start: Independent reactive dropdown state (Desktop + Mobile split)
  const [desktopHelpOpen, setDesktopHelpOpen] = useState(false);
  const [mobileHelpOpen, setMobileHelpOpen] = useState(false);
  // End: Independent reactive dropdown state
  const desktopHelpRef = useRef<HTMLDivElement | null>(null);
  const mobileHelpRef = useRef<HTMLDivElement | null>(null);

  const t = language === "ms" ? msDictionary : enDictionary;

  // Start: Primary Navigation Items (consolidated hubs)
  const navItems: NavItem[] = [
    { name: t.dashboardTitle, href: "/dashboard", icon: "🏠" },
    { name: "Hab Komuniti", href: "/hub", icon: "🌐" },
    { name: "Dokumentasi", href: "/docs", icon: "📚" },
    { name: t.settings, href: "/settings", icon: "⚙️" },
  ];
  // End: Primary Navigation Items

  // Start: Cookie-Driven Theme Initialization (Strategy 1 — Anti-FOUC bridge)
  useEffect(() => {
    const savedTheme = getCookie(COOKIE_KEYS.THEME) as ThemeId | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme ? savedTheme !== "windows-gray" : prefersDark;
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  // End: Cookie-Driven Theme Initialization

  // Start: Mobile Menu Height Calculation
  useEffect(() => {
    if (mobileMenuOpen) {
      const menuElement = document.getElementById("mobile-nav");
      if (menuElement) {
        const itemsCount = navItems.length + 1;
        const itemHeight = 48;
        const paddingBase = 24;
        const totalHeight = itemsCount * itemHeight + paddingBase;
        menuElement.style.height = `${totalHeight}px`;
      }
    }
  }, [mobileMenuOpen, navItems.length]);
  // End: Mobile Menu Height Calculation

  // Start: Navigation Handler
  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setMobileHelpOpen(false);
    router.push(href);
  };
  // End: Navigation Handler

  // Start: Help Links Configuration (active platform support items)
  const helpLinks: HelpLink[] = [
    { name: "Help Center", href: "/help", icon: "❓", desc: "Pusat bantuan & panduan" },
    { name: "System Status", href: "/status", icon: "📡", desc: "Status server langsung" },
    { name: "Contact Support", href: "/contact", icon: "📧", desc: "Hubungi pasukan sokongan" },
    { name: "Dokumentasi", href: "/docs", icon: "📚", desc: "Manual teknikal" },
  ];
  // End: Help Links Configuration

  // Start: Theme Toggle (persists to kampung-siber-theme-cookie, 7-day expiry)
  const handleThemeToggle = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    const themeId: ThemeId = next ? "space-neon" : "windows-gray";
    setCookie(COOKIE_KEYS.THEME, themeId, { maxAge: SEVEN_DAYS_SECONDS });
  };
  // End: Theme Toggle

  // Start: Help Dropdown Outside-Click + Escape Dismissal
  useEffect(() => {
    if (!desktopHelpOpen && !mobileHelpOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const insideDesktop = desktopHelpRef.current?.contains(target) ?? false;
      const insideMobile = mobileHelpRef.current?.contains(target) ?? false;
      if (!insideDesktop) setDesktopHelpOpen(false);
      if (!insideMobile) setMobileHelpOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopHelpOpen(false);
        setMobileHelpOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [desktopHelpOpen, mobileHelpOpen]);
  // End: Help Dropdown Outside-Click + Escape Dismissal

  // Start: Render Help Panel (reactive, NeonCard premium layout)
  const renderHelpPanel = (variant: "desktop" | "mobile") => (
    <NeonCard
      accent="cyan"
      className={`z-50 border border-[#00ffff]/40 bg-[#0e1330]/95 shadow-[0_0_22px_rgba(0,255,255,0.30)] ${
        variant === "desktop"
          ? "absolute right-0 mt-2 w-60 rounded-lg"
          : "mt-2 ml-6 w-[88%] rounded-lg"
      }`}
      bodyClassName="p-1.5 space-y-1"
    >
      {helpLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => {
            setDesktopHelpOpen(false);
            setMobileHelpOpen(false);
            setMobileMenuOpen(false);
          }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-gray-300 transition-colors hover:bg-[#00ffff]/10 hover:text-white"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#00ffff]/30 bg-[#060814]/70 text-base">
            {link.icon}
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-medium">{link.name}</span>
            <span className="text-[11px] leading-tight text-gray-500">{link.desc}</span>
          </span>
        </Link>
      ))}
    </NeonCard>
  );
  // End: Render Help Panel

  return (
    // Start: Navigation Container (clip X to avoid duplicate scrollbar; keep Y visible so dropdown shows)
    <nav className="fixed left-0 right-0 top-0 z-50 w-full border-b border-[#00ffff]/30 bg-[#060814]/80 backdrop-blur-md overflow-x-clip">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Start: Logo/Brand — KAMPUNG SIBER (rebranded, reset-to-home link) */}
          <div className="flex flex-shrink-0 items-center">
            <Link
              href="/"
              className="group flex select-none items-center gap-2"
              aria-label="Kembali ke laman utama Kampung Siber"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#00ffff]/40 bg-[#0e1330]/80 shadow-[0_0_12px_rgba(0,255,255,0.25)] transition-all group-hover:shadow-[0_0_18px_rgba(0,255,255,0.45)]">
                🖥️
              </span>
              <span className="hidden font-pixel text-xl tracking-wide text-[#00ffff] transition-colors group-hover:text-white neon-text-glow sm:inline">
                KAMPUNG SIBER
              </span>
            </Link>
          </div>
          {/* End: Logo/Brand */}

          {/* Start: Navigation Items - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navItems.map((item) => (
                <NeonButton
                  key={item.href}
                  href={item.href}
                  variant={pathname === item.href ? "primary" : "ghost"}
                  size="md"
                  className="!font-pixel"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center text-base">{item.icon}</span>
                  <span className="hidden items-center gap-1 align-middle sm:inline-flex">{item.name}</span>
                </NeonButton>
              ))}
            </div>
          </div>
          {/* End: Navigation Items - Desktop */}

          {/* Start: Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[#00ffff]/30 bg-[#0e1330]/70 p-2 text-gray-300 transition-all hover:shadow-[0_0_12px_rgba(0,255,255,0.3)] focus:outline-none"
              aria-label="Buka menu navigasi"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          {/* End: Mobile Menu Button */}

          {/* Start: Controls Container - Desktop Help dropdown + theme toggle */}
          <div className="flex items-center space-x-2">
            {/* Start: Desktop Help Dropdown */}
            <div className="relative hidden md:block" ref={desktopHelpRef}>
              <NeonButton
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setDesktopHelpOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={desktopHelpOpen}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center text-base">❓</span>
                <span className="hidden items-center gap-1 align-middle sm:inline-flex">Help</span>
                <span className="text-xs">{desktopHelpOpen ? "▲" : "▼"}</span>
              </NeonButton>
              {desktopHelpOpen && renderHelpPanel("desktop")}
            </div>
            {/* End: Desktop Help Dropdown */}

            {/* Start: Theme Toggle */}
            <NeonButton
              type="button"
              variant="ghost"
              size="md"
              onClick={handleThemeToggle}
              aria-label="Tukar tema"
              className="!px-3 !py-2"
            >
              <span className="text-lg">{isDarkMode ? "☀️" : "🌙"}</span>
            </NeonButton>
            {/* End: Theme Toggle */}
          </div>
          {/* End: Controls Container */}
        </div>
      </div>

      {/* Start: Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-[#00ffff]/30 bg-[#060814]/90 transition-all duration-300 ease-out md:hidden"
        >
          <div className="space-y-1 px-2 pb-3 pt-2">
              {navItems.map((item) => (
                <NeonButton
                  key={item.href}
                  href={item.href}
                  variant={pathname === item.href ? "primary" : "ghost"}
                  size="md"
                  className="w-full !justify-start"
                >
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center text-lg">{item.icon}</span>
                  <span className="inline-flex items-center gap-1 align-middle">{item.name}</span>
                </NeonButton>
              ))}

            {/* Start: Mobile Help & FAQ Dropdown Controller */}
            <div className="relative" ref={mobileHelpRef}>
              <NeonButton
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setMobileHelpOpen((v) => !v)}
                className="w-full !justify-start"
                aria-haspopup="true"
                aria-expanded={mobileHelpOpen}
              >
                <span className="mr-2 inline-flex h-4 w-4 items-center justify-center text-lg">❓</span>
                <span className="inline-flex items-center gap-1 align-middle">Help & FAQ</span>
                <span className="ml-auto text-xs">{mobileHelpOpen ? "▲" : "▼"}</span>
              </NeonButton>

              {mobileHelpOpen && renderHelpPanel("mobile")}
            </div>
            {/* End: Mobile Help & FAQ Dropdown Controller */}
          </div>
        </div>
      )}
      {/* End: Mobile Navigation Menu */}
    </nav>
    // End: Navigation Container
  );
}
// End: Streamlined Retro Navigation Bar (Rule 31 Cyber-Neon Overhaul)