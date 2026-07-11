// Start: Imports
"use client";

import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import FooterLinks from './footer-links';
// End: Imports

// Start: Type Definitions
interface RetroFooterProps {
  className?: string;
}
// End: Type Definitions

// Start: Legal Routes Configuration
const LEGAL_ROUTES = [
  { name: 'Privacy Policy', href: '/privacy', icon: '🔒' },
  { name: 'Terms of Service', href: '/terms', icon: '📜' },
  { name: 'System Status', href: '/status', icon: '📡' },
  { name: 'Sitemap', href: '/sitemap', icon: '🗺️' },
];
// End: Legal Routes Configuration

// Start: RetroFooter Component
export default function RetroFooter({ className }: RetroFooterProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  // Start: Get Footer Links
  const footerLinks = FooterLinks();
  // End: Get Footer Links

  // Start: Handle Navigation
  const handleNavigation = (href: string) => {
    window.location.href = href;
  };
  // End: Handle Navigation

  // Start: Render RetroFooter */}
  return (
    <footer className={`bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 py-6 ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Start: Footer Grid Structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Start: Dashboard Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.dashboardTitle}
            </h4>
            <ul className="space-y-2">
              {footerLinks.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavigation(link.href)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* End: Dashboard Section */}

          {/* Start: Settings Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.settings}
            </h4>
            <ul className="space-y-2">
              {footerLinks.slice(3, 5).map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavigation(link.href)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* End: Settings Section */}

          {/* Start: Guestbook Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.guestbookTitle}
            </h4>
            <ul className="space-y-2">
              {footerLinks.slice(5).map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavigation(link.href)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* End: Guestbook Section */}
        </div>
        {/* End: Footer Grid Structure */}

        {/* Start: Legal Validation Routing Anchors - Lower Footer Grid */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {LEGAL_ROUTES.map((route) => (
              <button
                key={route.href}
                onClick={() => handleNavigation(route.href)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                <span className="text-sm">{route.icon}</span>
                <span className="pixel-font">{route.name}</span>
              </button>
            ))}
          </div>
        </div>
        {/* End: Legal Validation Routing Anchors */}

        {/* Start: Copyright Section */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            &copy; {new Date().getFullYear()} Kampung Siber Retro Workspace. {t.dashboardSubtitle || 'All rights reserved.'}
          </p>
        </div>
        {/* End: Copyright Section */}
      </div>
    </footer>
  );
}
// End: RetroFooter Component