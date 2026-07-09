"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SitemapPage {
  title: string;
  href: string;
  icon: string;
  description?: string;
}

const sitemapPages: SitemapPage[] = [
  { title: 'Dashboard', href: '/dashboard', icon: '🏠', description: 'Central hub for your retro workspace' },
  { title: 'Site Files', href: '/site_files', icon: '📁', description: 'Manage your files and folders' },
  { title: 'Guestbook', href: '/guestbook', icon: '📝', description: 'Community messages and feedback' },
  { title: 'Settings', href: '/settings', icon: '⚙️', description: 'Configure your preferences' },
  { title: 'About', href: '/about', icon: 'ℹ️', description: 'Learn about Kampung Siber Retro' },
  { title: 'Activity', href: '/activity', icon: '📊', description: 'Recent activities and updates' },
  { title: 'Asset Store', href: '/asset-store', icon: '🎨', description: 'Downloadable assets and themes' },
  { title: 'Balai Raya', href: '/balai_raya', icon: '🏛️', description: 'Community center' },
  { title: 'Browse', href: '/browse', icon: '🔍', description: 'Explore the platform' },
  { title: 'Cyber Cafe', href: '/cyber-cafe', icon: '☕', description: 'Virtual hangout space' },
  { title: 'Cyber Museum', href: '/cyber-museum', icon: '🎭', description: 'Historical tech exhibits' },
  { title: 'Forgot Username', href: '/forgot_username', icon: '❓', description: 'Recover your username' },
  { title: 'Kedai Runcit', href: '/kedai_runcit', icon: '🛍️', description: 'Mini shop marketplace' },
  { title: 'Muzium', href: '/muzium', icon: '🏛️', description: 'Digital museum collection' },
  { title: 'Password Reset', href: '/password_reset', icon: '🔐', description: 'Reset your password' },
  { title: 'Press', href: '/press', icon: '📰', description: 'News and announcements' },
  { title: 'Search', href: '/search', icon: '🔎', description: 'Find content across the platform' },
  { title: 'Sign In', href: '/signin', icon: '🔑', description: 'Log in to your account' },
  { title: 'Site', href: '/site', icon: '🌐', description: 'Main site landing page' },
  { title: 'Supporters', href: '/supporter', icon: '🤝', description: 'Thank you to our supporters' },
  { title: 'Terms', href: '/terms', icon: '📜', description: 'Terms of service' },
  { title: 'Town Hall', href: '/town-hall', icon: '🗣️', description: 'Community discussions' },
  { title: 'Tutorials', href: '/tutorials', icon: '🎓', description: 'Learn to use the platform' },
  { title: 'Directory', href: '/directory', icon: '👥', description: 'Resident portfolio directory' },
  { title: 'Status', href: '/status', icon: '📈', description: 'System health dashboard' },
  { title: 'Contact', href: '/contact', icon: '✉️', description: 'Email the admin' },
  { title: 'Privacy', href: '/privacy', icon: '🔒', description: 'Privacy policy' },
  { title: 'Themes', href: '/themes', icon: '🎨', description: 'Available site themes' },
];

// Tier 1: Core Pages (alphabetically sorted)
const tier1Pages = sitemapPages.filter(p => 
  ['Dashboard', 'Site Files', 'Guestbook', 'Settings', 'About', 'Activity'].includes(p.title)
).sort((a, b) => a.title.localeCompare(b.title));

// Tier 2: Community Pages (alphabetically sorted)
const tier2Pages = sitemapPages.filter(p => 
  ['Asset Store', 'Balai Raya', 'Browse', 'Cyber Cafe', 'Cyber Museum', 'Muzium', 'Town Hall', 'Tutorials'].includes(p.title)
).sort((a, b) => a.title.localeCompare(b.title));

// Tier 3: Account & Support Pages (alphabetically sorted)
const tier3Pages = sitemapPages.filter(p => 
  ['Forgot Username', 'Password Reset', 'Sign In', 'Supporters', 'Terms', 'Privacy', 'Press', 'Search', 'Site'].includes(p.title)
).sort((a, b) => a.title.localeCompare(b.title));

// Tier 4: Special Pages (alphabetically sorted)
const tier4Pages = sitemapPages.filter(p => 
  ['Kedai Runcit', 'Contact', 'Directory', 'Status', 'Themes'].includes(p.title)
).sort((a, b) => a.title.localeCompare(b.title));

export default function SitemapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredTier1 = tier1Pages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTier2 = tier2Pages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTier3 = tier3Pages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTier4 = tier4Pages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Start: Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 pixel-font mb-4 inline-block">
            🗺️ Site Map
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Navigate through all 44+ pages of Kampung Siber Retro
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full px-4 py-2 pl-10 
                border-2 border-cyan-500 rounded-none
                bg-white dark:bg-gray-900
                text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400
                font-mono
                focus:outline-none focus:ring-2 focus:ring-pink-500
              "
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 text-xl">
              🔍
            </span>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✖️
              </button>
            )}
          </div>
        </div>
        {/* End: Search Bar */}

        {/* Start: Tiered Directory View */}
        <div className="space-y-8">
          {/* Tier 1: Core Pages */}
          <section>
            <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4 pixel-font border-b-2 border-cyan-500 pb-2">
              🏠 Core Pages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTier1.length > 0 ? (
                filteredTier1.map((page) => (
                  <div
                    key={page.href}
                    className="
                      retro-card border-2 border-gray-300 dark:border-gray-600
                      bg-white dark:bg-gray-900 p-4 rounded-none
                      hover:shadow-[4px_4px_0_0_rgba(255,255,0,0.3)] hover:transform hover:translate-[-2px_-2px]
                      transition-all duration-200
                    "
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{page.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 pixel-font">
                          {page.title}
                        </h3>
                        {page.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {page.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavigation(page.href)}
                      className="
                        mt-3 w-full py-2
                        border-2 border-pink-400 bg-pink-100 dark:bg-pink-900/20
                        text-pink-700 dark:text-pink-300 font-bold
                        hover:bg-pink-200 dark:hover:bg-pink-900/40
                        rounded-none
                        pixel-font text-sm
                      "
                    >
                      Go to {page.title}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 col-span-full">
                  No pages found in Core Pages
                </p>
              )}
            </div>
          </section>

          {/* Tier 2: Community Pages */}
          <section>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4 pixel-font border-b-2 border-green-500 pb-2">
              👥 Community Pages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTier2.length > 0 ? (
                filteredTier2.map((page) => (
                  <div
                    key={page.href}
                    className="
                      retro-card border-2 border-gray-300 dark:border-gray-600
                      bg-white dark:bg-gray-900 p-4 rounded-none
                      hover:shadow-[4px_4px_0_0_rgba(0,255,0,0.3)] hover:transform hover:translate-[-2px_-2px]
                      transition-all duration-200
                    "
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{page.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 pixel-font">
                          {page.title}
                        </h3>
                        {page.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {page.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavigation(page.href)}
                      className="
                        mt-3 w-full py-2
                        border-2 border-green-400 bg-green-100 dark:bg-green-900/20
                        text-green-700 dark:text-green-300 font-bold
                        hover:bg-green-200 dark:hover:bg-green-900/40
                        rounded-none
                        pixel-font text-sm
                      "
                    >
                      Go to {page.title}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 col-span-full">
                  No pages found in Community Pages
                </p>
              )}
            </div>
          </section>

          {/* Tier 3: Account & Support Pages */}
          <section>
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 pixel-font border-b-2 border-blue-500 pb-2">
              🔐 Account & Support Pages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTier3.length > 0 ? (
                filteredTier3.map((page) => (
                  <div
                    key={page.href}
                    className="
                      retro-card border-2 border-gray-300 dark:border-gray-600
                      bg-white dark:bg-gray-900 p-4 rounded-none
                      hover:shadow-[4px_4px_0_0_rgba(0,0,255,0.3)] hover:transform hover:translate-[-2px_-2px]
                      transition-all duration-200
                    "
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{page.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 pixel-font">
                          {page.title}
                        </h3>
                        {page.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {page.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavigation(page.href)}
                      className="
                        mt-3 w-full py-2
                        border-2 border-blue-400 bg-blue-100 dark:bg-blue-900/20
                        text-blue-700 dark:text-blue-300 font-bold
                        hover:bg-blue-200 dark:hover:bg-blue-900/40
                        rounded-none
                        pixel-font text-sm
                      "
                    >
                      Go to {page.title}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 col-span-full">
                  No pages found in Account & Support Pages
                </p>
              )}
            </div>
          </section>

          {/* Tier 4: Special Pages */}
          <section>
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4 pixel-font border-b-2 border-purple-500 pb-2">
              ⭐ Special Pages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTier4.length > 0 ? (
                filteredTier4.map((page) => (
                  <div
                    key={page.href}
                    className="
                      retro-card border-2 border-gray-300 dark:border-gray-600
                      bg-white dark:bg-gray-900 p-4 rounded-none
                      hover:shadow-[4px_4px_0_0_rgba(128,0,128,0.3)] hover:transform hover:translate-[-2px_-2px]
                      transition-all duration-200
                    "
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{page.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 pixel-font">
                          {page.title}
                        </h3>
                        {page.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {page.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleNavigation(page.href)}
                      className="
                        mt-3 w-full py-2
                        border-2 border-purple-400 bg-purple-100 dark:bg-purple-900/20
                        text-purple-700 dark:text-purple-300 font-bold
                        hover:bg-purple-200 dark:hover:bg-purple-900/40
                        rounded-none
                        pixel-font text-sm
                      "
                    >
                      Go to {page.title}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 col-span-full">
                  No pages found in Special Pages
                </p>
              )}
            </div>
          </section>
        </div>
        {/* End: Tiered Directory View */}

        {/* Start: Footer Stats */}
        <div className="mt-12 pt-6 border-t-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
          <p className="text-gray-500 dark:text-gray-400 pixel-font text-sm">
            Total Pages: {sitemapPages.length} | {filteredTier1.length} Core | {filteredTier2.length} Community | {filteredTier3.length} Account | {filteredTier4.length} Special
          </p>
        </div>
        {/* End: Footer Stats */}
      </div>
    </main>
  );
}