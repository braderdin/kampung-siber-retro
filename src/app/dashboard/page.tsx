// Start: Dashboard Page with Pixel Shadow and Tablet Optimizations
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import Shoutbox from '@/components/Shoutbox';
import RetroCalendar from '@/components/RetroCalendar';
import VisitorStatGraph from '@/components/VisitorStatGraph';
import RetroMarqueeTicker from '@/components/RetroMarqueeTicker';
import TopResidentsLeaderboard from '@/components/TopResidentsLeaderboard';
import HydrationGuard from '@/components/HydrationGuard';
import FeedbackWidget from '@/components/FeedbackWidget';

type ActiveTab = 'main' | 'community';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('main');
  const [showMarquee, setShowMarquee] = useState(false);
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  // Start: Marquee Auto-Show Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMarquee(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  // End: Marquee Auto-Show Effect

  // Start: Tab Toggle Handler
  const handleTabToggle = () => {
    setActiveTab(prev => prev === 'main' ? 'community' : 'main');
  };
  // End: Tab Toggle Handler

  return (
    // Start: Main Dashboard Container
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Start: Navigation Toolbar with Retro Sitemap Button */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b-2 border-dashed border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font">
              {t.dashboardTitle || 'Dashboard'}
            </h2>
          </div>
          {/* Start: Retro Sitemap Access Button */}
          <Link href="/sitemap" className="retro-btn-secondary flex items-center gap-2 px-4 py-2 pixel-font font-bold">
            <span className="text-lg">🗺️</span>
            <span>{t.sitemapTitle || 'Site Sitemap'}</span>
          </Link>
          {/* End: Retro Sitemap Access Button */}
        </div>
      </div>
      {/* End: Navigation Toolbar */}

      {/* Start: Dashboard Header with Editor Link Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Start: Editor Link Card Container with Pixel Shadow */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pixel-font">
            {t.dashboardTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t.welcomeMessage || 'Welcome to your retro dashboard!'}
          </p>
          {/* Start: Editor Access Button with Extreme Pixel Shadow */}
          <div className="mt-4">
            <Link
              href="/site_files/text_editor"
              className="retro-btn-primary inline-flex items-center gap-2 px-6 py-3 pixel-font font-bold text-lg shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all"
            >
              <span className="text-xl">💻</span>
              <span>Buka Editor Kod Teratak Anda</span>
            </Link>
          </div>
          {/* End: Editor Access Button with Extreme Pixel Shadow */}
        </div>
        {/* End: Editor Link Card Container */}
      </div>
      {/* End: Dashboard Header */}

      {/* Start: Marquee Ticker */}
      {showMarquee && (
        <div className="fixed top-16 left-0 right-0 z-40">
          <RetroMarqueeTicker 
            messages={[
              '🚀 Selamat datang di Kampung Siber Retro Dashboard!',
              '🌟 Kunjungi komuniti kami untuk berkongsi idea dan projek.',
              '🔧 Kami sentiasa memperbarui platform dengan ciri-ciri baru.',
            ]}
            speed={15}
          />
        </div>
      )}
      {/* End: Marquee Ticker */}

      {/* Start: Tab Navigation and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Start: Main Content Area */}

        {/* Start: Tab Navigation */}
        <div className="mb-6">
          <div className="retro-tab-navigation flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setActiveTab('main')}
              className={`
                retro-btn-secondary flex-1 text-center
                transition-all duration-200
                ${activeTab === 'main' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="text-xl">🏠</span>
              <div className="pixel-font text-xs">Main View</div>
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`
                retro-btn-secondary flex-1 text-center
                transition-all duration-200
                ${activeTab === 'community' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="text-xl">👥</span>
              <div className="pixel-font text-xs">Community Board</div>
            </button>
          </div>
        </div>
        {/* End: Tab Navigation */}

        {/* Start: Tab Content with Tablet Optimizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Start: Main View Tab Content - Tablet Padding Adjustments */}
          {activeTab === 'main' && (
            <>
              {/* Start: Clean Grey Layout Frame - Tablet Responsive */}
              <div className="lg:col-span-3">
                <HydrationGuard>
                  <div className="retro-card bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 min-h-[200px] flex items-center justify-center p-4 sm:p-6 md:p-8">
                    <p className="text-gray-500 dark:text-gray-400 pixel-font text-sm text-center sm:text-left">
                      {t.dashboardReady || 'Dashboard bersedia menerima data berasal daripada pengguna'}
                    </p>
                  </div>
                </HydrationGuard>
              </div>
              {/* End: Clean Grey Layout Frame */}
            </>
          )}
          {/* End: Main View Tab Content */}

          {/* Start: Community Board Tab Content */}
          {activeTab === 'community' && (
            <div className="lg:col-span-3">
              <HydrationGuard>
                <Shoutbox />
              </HydrationGuard>
            </div>
          )}
          {/* End: Community Board Tab Content */}
        </div>
        {/* End: Tab Content with Tablet Optimizations */}
      </div>
      {/* End: Tab Navigation and Content */}

      {/* Start: Feedback Widget - Fixed bottom-right corner */}
      <div className="fixed bottom-6 right-6 z-40">
        <FeedbackWidget />
      </div>
      {/* End: Feedback Widget */}
    </main>
    // End: Main Dashboard Container
  );
}
// End: Dashboard Page with Pixel Shadow and Tablet Optimizations