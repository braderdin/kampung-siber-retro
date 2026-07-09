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

  // Start: Render RetroFooter
  return (
    <footer className={`bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 py-6 ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Kampung Siber Retro Workspace. {t.dashboardSubtitle}
          </p>
        </div>
      </div>
    </footer>
  );
}
// End: RetroFooter Component