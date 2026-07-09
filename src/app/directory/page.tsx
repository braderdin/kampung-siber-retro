"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import DirectoryList from '@/components/DirectoryList';
import HydrationGuard from '@/components/HydrationGuard';

export default function DirectoryPage() {
  const [isClient, setIsClient] = useState(false);
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Start: Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 pixel-font mb-4">
            👥 Resident Directory
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t.dashboardSubtitle || 'Browse our community of active residents'}
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Directory Grid Container */}
        <div className="retro-card border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,0.3)]">
          <div className="p-4">
            <HydrationGuard>
              <DirectoryList />
            </HydrationGuard>
          </div>
        </div>
        {/* End: Directory Grid Container */}

        {/* Start: Stats Bar */}
        <div className="mt-6 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 pixel-font">
            Showing 44 active residents • Alphabetically sorted • Searchable
          </p>
        </div>
        {/* End: Stats Bar */}
      </div>
    </main>
  );
}