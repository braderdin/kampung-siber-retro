// Start: Streamlined Retro Navigation Bar (Rule 31 Cyber-Neon Overhaul)
"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/store/useLanguageStore";
import { enDictionary, msDictionary } from "@/i18n/dictionaries";
import { useEffect, useRef, useState } from "react";
import RandomExplorerBtn from "@/components/RandomExplorerBtn";
import NeonButton from "@/components/ui/NeonButton";
import { setCookie, getCookie, COOKIE_KEYS, SEVEN_DAYS_SECONDS } from "@/lib/cookies";

type ThemeId = "space-neon" | "windows-gray" | "retro-matrix";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

export default function RetroNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguageStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuHeight, setMobileMenuHeight] = useState(0);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
  const helpContainerRef = useRef<HTMLDivElement | null>(null);
  const helpMobileContainerRef = useRef<HTMLDivElement | null>(null);

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
        setMobileMenuHeight(totalHeight);
        menuElement.style.height = `${totalHeight}px`;
      }
    }
  }, [mobileMenuOpen, navItems.length]);
  // End: Mobile Menu Height Calculation

  // Start: Navigation Handler
  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    router.push(href);
  };
  // End: Navigation Handler

  // Start: Help Links Configuration
  const helpLinks = [
    { name: "Help Center", href: "/help", icon: "❓" },
    { name: "System Status", href: "/status", icon: "📡" },
    { name: "Contact Support", href: "/contact", icon: "📧" },
  ];
  // End: Help Links Configuration

  // Start: Theme Toggle (persists to cookie, 7-day parity)
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
    if (!helpDropdownOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const insideDesktop = helpContainerRef.current?.contains(target) ?? false;
      const insideMobile = helpMobileContainerRef.current?.contains(target) ?? false;
      if (!insideDesktop && !insideMobile) {
        setHelpDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHelpDropdownOpen(false);
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
  }, [helpDropdownOpen]);
  // End: Help Dropdown Outside-Click + Escape Dismissal

  return (
    // Start: Navigation Container
    <nav className="fixed top-0 left-0 right-0 z-50 retro-nav bg-[#060814]/80 backdrop-blur-md border-b border-[#00ffff]/30 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Start: Logo/Brand — KAMPUNG SIBER (rebranded, reset-to-home link) */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="group flex items-center gap-2 select-none"
              aria-label="Kembali ke laman utama Kampung Siber"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 text-lg rounded-md border border-[#00ffff]/40 bg-[#0e1330]/80 shadow-[0_0_12px_rgba(0,255,255,0.25)] group-hover:shadow-[0_0_18px_rgba(0,255,255,0.45)] transition-all">
                🖥️
              </span>
              <span className="hidden sm:inline font-pixel text-xl tracking-wide text-[#00ffff] group-hover:text-white transition-colors neon-text-glow">
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
                  variant={pathname === item.href ? "primary" : "ghost"}
                  size="md"
                  onClick={() => handleNavClick(item.href)}
                  className="!font-pixel"
                >
                  <span className="text-base inline-flex items-center justify-center w-5 h-5">{item.icon}</span>
                  <span className="hidden sm:inline inline-flex items-center gap-1 align-middle">{item.name}</span>
                </NeonButton>
              ))}
            </div>
          </div>
          {/* End: Navigation Items - Desktop */}

          {/* Start: Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md border border-[#00ffff]/30 bg-[#0e1330]/70 hover:shadow-[0_0_12px_rgba(0,255,255,0.3)] transition-all"
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
            <div className="hidden md:block relative" ref={helpContainerRef}>
              <NeonButton
                variant="secondary"
                size="md"
                onClick={() => setHelpDropdownOpen(!helpDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={helpDropdownOpen}
              >
                <span className="text-base inline-flex items-center justify-center w-5 h-5">❓</span>
                <span className="hidden sm:inline inline-flex items-center gap-1 align-middle">Help</span>
                <span className="text-xs">{helpDropdownOpen ? "▲" : "▼"}</span>
              </NeonButton>
              {helpDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-md border border-[#00ffff]/30 bg-[#0e1330]/95 backdrop-blur-sm shadow-[0_0_18px_rgba(0,255,255,0.25)] py-1 z-50">
                  {helpLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => {
                        setHelpDropdownOpen(false);
                        router.push(link.href);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#00ffff]/10 transition-colors"
                    >
                      <span className="text-base mr-2 inline-flex items-center justify-center w-4 h-4">{link.icon}</span>
                      <span className="inline-flex items-center gap-1 align-middle">{link.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* End: Desktop Help Dropdown */}

            {/* Start: Theme Toggle */}
            <NeonButton
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
          className="md:hidden bg-[#060814]/90 border-t border-[#00ffff]/30 transition-all duration-300 ease-out"
          style={{ height: mobileMenuHeight ? `${mobileMenuHeight}px` : "auto" }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <NeonButton
                key={item.href}
                variant={pathname === item.href ? "primary" : "ghost"}
                size="md"
                onClick={() => handleNavClick(item.href)}
                className="w-full !justify-start"
              >
                <span className="text-lg mr-2 inline-flex items-center justify-center w-5 h-5">{item.icon}</span>
                <span className="inline-flex items-center gap-1 align-middle">{item.name}</span>
              </NeonButton>
            ))}

            {/* Start: Help & FAQ Dropdown Controller */}
            <div className="relative" ref={helpMobileContainerRef}>
              <NeonButton
                variant="secondary"
                size="md"
                onClick={() => setHelpDropdownOpen(!helpDropdownOpen)}
                className="w-full !justify-start"
              >
                <span className="text-lg mr-2 inline-flex items-center justify-center w-4 h-4">❓</span>
                <span className="inline-flex items-center gap-1 align-middle">Help & FAQ</span>
                <span className="ml-auto text-xs">{helpDropdownOpen ? "▲" : "▼"}</span>
              </NeonButton>

              {/* Start: Help Dropdown Menu */}
              {helpDropdownOpen && (
                <div className="mt-1 ml-8 space-y-1">
                  {helpLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setHelpDropdownOpen(false);
                        router.push(link.href);
                      }}
                      className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-400 hover:text-white hover:bg-[#00ffff]/10 border border-transparent hover:border-[#00ffff]/30"
                    >
                      <span className="text-base mr-2 inline-flex items-center justify-center w-4 h-4">{link.icon}</span>
                      <span className="inline-flex items-center gap-1 align-middle">{link.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {/* End: Help Dropdown Menu */}
            </div>
            {/* End: Help & FAQ Dropdown Controller */}
          </div>
        </div>
      )}
      {/* End: Mobile Navigation Menu */}
    </nav>
    // End: Navigation Container
  );
}
// End: Streamlined Retro Navigation Bar (Rule 31 Cyber-Neon Overhaul)