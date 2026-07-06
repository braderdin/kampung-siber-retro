// Start: Imports
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import { useEffect, useState } from 'react';
// End: Imports

// Start: Type Definitions
interface NavItem {
  name: string;
  href: string;
  icon: string;
}
// End: Type Definitions

// Start: RetroNavbar Component
export default function RetroNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguageStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const t = language === 'ms' ? msDictionary : enDictionary;
  
  // Start: Navigation Items
  const navItems: NavItem[] = [
    { name: t.dashboardTitle, href: '/dashboard', icon: '🏠' },
    { name: t.fileEditor, href: '/site_files/text_editor', icon: '📝' },
    { name: t.guestbookTitle, href: '/guestbook', icon: '📘' },
    { name: t.settings, href: '/settings', icon: '⚙️' },
  ];
  // End: Navigation Items

  // Start: Dark Mode Initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  // End: Dark Mode Initialization

  // Start: Handle Language Change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'ms');
  };
  // End: Handle Language Change

  // Start: Handle Dark Mode Toggle
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
  // End: Handle Dark Mode Toggle

  // Start: Handle Navigation Click
  const handleNavClick = (href: string) => {
    router.push(href);
  };
  // End: Handle Navigation Click

  // Start: Render Navbar
  return (
    <nav className="retro-nav bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Start: Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-pixel text-blue-600 dark:text-blue-400">
              🖥️ Kampung Siber
            </span>
          </div>
          {/* End: Logo/Brand */}

          {/* Start: Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          {/* End: Navigation Items */}

          {/* Start: Controls Container */}
          <div className="flex items-center space-x-4">
            {/* Start: Language Selector */}
            <div>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="retro-input w-auto text-sm"
              >
                <option value="en">EN</option>
                <option value="ms">MS</option>
              </select>
            </div>
            {/* End: Language Selector */}

            {/* Start: Dark Mode Toggle */}
            <button
              onClick={handleDarkModeToggle}
              className="retro-btn-secondary text-xs px-3 py-1 flex items-center space-x-1"
            >
              <span>{isDarkMode ? '🌙' : '☀️'}</span>
              <span>{isDarkMode ? t.greetings.hello : 'Mod Gelap'}</span>
            </button>
            {/* End: Dark Mode Toggle */}
          </div>
          {/* End: Controls Container */}
        </div>
      </div>
    </nav>
  );
}
// End: RetroNavbar Component
