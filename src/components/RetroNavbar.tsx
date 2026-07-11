"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import { useEffect, useState } from 'react';
import RandomExplorerBtn from '@/components/RandomExplorerBtn';
import LanguageToggleSwitch from '@/components/LanguageToggleSwitch';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

export default function RetroNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguageStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuHeight, setMobileMenuHeight] = useState(0);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);

  const t = language === 'ms' ? msDictionary : enDictionary;

  const navItems: NavItem[] = [
    { name: t.dashboardTitle, href: '/dashboard', icon: '🏠' },
    { name: 'Directory', href: '/directory', icon: '👥' },
    { name: t.fileEditor, href: '/site_files', icon: '📝' },
    { name: t.guestbookTitle, href: '/guestbook', icon: '📘' },
    { name: t.settings, href: '/settings', icon: '⚙️' },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Start: Mobile Drawer Padding Calculation
  useEffect(() => {
    if (mobileMenuOpen) {
      const menuElement = document.getElementById('mobile-nav');
      if (menuElement) {
        const itemsCount = navItems.length + 2; // +2 for Help & Random Explorer
        const itemHeight = 48;
        const paddingBase = 24;
        const totalHeight = itemsCount * itemHeight + paddingBase;
        setMobileMenuHeight(totalHeight);
        menuElement.style.height = `${totalHeight}px`;
      }
    }
  }, [mobileMenuOpen, navItems.length]);
  // End: Mobile Drawer Padding Calculation

  const handleLanguageToggle = (lang: 'en' | 'ms') => {
    setLanguage(lang);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    router.push(href);
  };

  const helpLinks = [
    { name: 'Help Center', href: '/help', icon: '❓' },
    { name: 'FAQ', href: '/faq', icon: '📋' },
    { name: 'System Status', href: '/status', icon: '📡' },
    { name: 'Contact Support', href: '/contact', icon: '📧' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 retro-nav bg-black/30 backdrop-blur-md border-b border-cyan-500/20 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Start: Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-pixel text-pink-500 dark:text-pink-400 inline-flex items-center gap-2 align-middle">
              <span className="inline-flex items-center justify-center w-8 h-8">🖥️</span>
              <span className="hidden sm:inline">Penjelajah Laman</span>
            </span>
          </div>
          {/* End: Logo/Brand */}

          {/* Start: Navigation Items - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-pink-500/20 text-pink-400 dark:bg-pink-500/30 dark:text-pink-300'
                      : 'text-gray-300 hover:text-white hover:bg-cyan-500/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-cyan-500/10'
                  }`}
                >
                  <span className="text-lg inline-flex items-center justify-center w-5 h-5">{item.icon}</span>
                  <span className="hidden sm:inline inline-flex items-center gap-1 align-middle">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          {/* End: Navigation Items */}

          {/* Start: Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
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

          {/* Start: Controls Container */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Start: Language Toggle Switch (replaces dropdown) */}
            <LanguageToggleSwitch
              currentLanguage={language}
              onToggle={handleLanguageToggle}
            />
            {/* End: Language Toggle Switch */}

            {/* Start: Random Explorer Button */}
            <div className="hidden sm:block">
              <RandomExplorerBtn 
                label="🌐"
                className="px-2 py-1 text-xs min-w-[60px]"
              />
            </div>
            {/* End: Random Explorer Button */}

            {/* Start: Dark Mode Toggle */}
            <button
              onClick={handleDarkModeToggle}
              className="retro-btn-secondary text-xs px-2 py-1 flex items-center space-x-1 border-pink-400 hover:border-pink-300 min-w-[80px] justify-center"
            >
              <span className="inline-flex items-center justify-center w-5 h-5">{isDarkMode ? '☀️' : '🌙'}</span>
              <span className="hidden sm:inline inline-flex items-center gap-1 align-middle">{isDarkMode ? t.modernTheme : t.crtTheme}</span>
            </button>
            {/* End: Dark Mode Toggle */}
          </div>
          {/* End: Controls Container */}
        </div>
      </div>

      {/* Start: Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav" 
          className="md:hidden bg-black/50 border-t border-cyan-500/20 transition-all duration-300 ease-out"
          style={{ height: mobileMenuHeight ? `${mobileMenuHeight}px` : 'auto' }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-pink-500/20 text-pink-400'
                    : 'text-gray-300 hover:text-white hover:bg-cyan-500/10'
                }`}
              >
                <span className="text-lg mr-2 inline-flex items-center justify-center w-5 h-5">{item.icon}</span>
                <span className="inline-flex items-center gap-1 align-middle">{item.name}</span>
              </button>
            ))}
            
            {/* Start: Help & FAQ Dropdown Controller Button */}
            <div className="relative">
              <button
                onClick={() => setHelpDropdownOpen(!helpDropdownOpen)}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-300 hover:text-white hover:bg-cyan-500/10"
              >
                <span className="text-lg mr-2 inline-flex items-center justify-center w-5 h-5">❓</span>
                <span className="inline-flex items-center gap-1 align-middle">Help & FAQ</span>
                <span className="ml-auto text-xs">{helpDropdownOpen ? '▲' : '▼'}</span>
              </button>
              
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
                      className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-400 hover:text-white hover:bg-cyan-500/10"
                    >
                      <span className="text-base mr-2 inline-flex items-center justify-center w-4 h-4">{link.icon}</span>
                      <span className="inline-flex items-center gap-1 align-middle">{link.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {/* End: Help Dropdown Menu */}
            </div>
            {/* End: Help & FAQ Dropdown Controller Button */}
            
            {/* Start: Mobile Random Explorer Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const randomIndex = Math.floor(Math.random() * 20);
                const randomUser = [
                  'cyber-pioneer', 'pixel-warrior', 'byte-collector', 'retro-hacker', 'glitch-master',
                  'neon-drifter', 'terminal-wizard', 'code-archaeologist', 'synth-wave', 'digital-trailblazer',
                  'analog-dreamer', 'floppy-disk', 'modem-rider', 'BBS-legend', 'phreaker-legend',
                  'telnet-navigator', 'gopher-guru', 'usenet-explorer', 'ftp-finder', 'irc-wanderer'
                ][randomIndex];
                router.push('/site/' + randomUser);
              }}
              className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors text-gray-300 hover:text-white hover:bg-cyan-500/10"
            >
              <span className="text-lg mr-2 inline-flex items-center justify-center w-5 h-5">🌐</span>
              <span className="inline-flex items-center gap-1 align-middle">Jelajah Rawak</span>
            </button>
            {/* End: Mobile Random Explorer Button */}
          </div>
        </div>
      )}
      {/* End: Mobile Navigation Menu */}
    </nav>
  );
}