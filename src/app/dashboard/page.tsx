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
import AccountAllocationBox from '@/components/AccountAllocationBox';
import NewsletterSubscription from '@/components/NewsletterSubscription';
import HydrationGuard from '@/components/HydrationGuard';
import FeedbackWidget from '@/components/FeedbackWidget';

type ActiveTab = 'main' | 'community';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('main');
  const [showMarquee, setShowMarquee] = useState(false);
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  useEffect(() => {
    // Auto-show marquee on first load
    const timer = setTimeout(() => {
      setShowMarquee(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleTabToggle = () => {
    setActiveTab(prev => prev === 'main' ? 'community' : 'main');
  };

  return (
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Start: Dashboard Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pixel-font">
            {t.dashboardTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t.welcomeMessage || 'Welcome to your retro dashboard!'}
          </p>
        </div>
        {/* End: Dashboard Header */}

        {/* Start: Newsletter Subscription */}
        <div className="mb-8">
          <HydrationGuard>
            <NewsletterSubscription 
              triggerText="📧 Subscribe to Updates"
              className="border-2 border-pink-400 bg-pink-500/10 hover:bg-pink-500/20"
            />
          </HydrationGuard>
        </div>
        {/* End: Newsletter Subscription */}

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
              <span className="text-xl mb-1">🏠</span>
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
              <span className="text-xl mb-1">👥</span>
              <div className="pixel-font text-xs">Community Board</div>
            </button>
          </div>
        </div>
        {/* End: Tab Navigation */}

        {/* Start: Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Start: Main View Tab Content */}
          {activeTab === 'main' && (
            <>
              {/* Start: Account Allocation Card */}
              <div className="lg:col-span-1">
                <HydrationGuard>
                  <AccountAllocationBox />
                </HydrationGuard>
              </div>
              {/* End: Account Allocation Card */}

              {/* Start: Visitor Stats Card */}
              <div className="lg:col-span-2">
                <HydrationGuard>
                  <VisitorStatGraph title="Visitor Statistics" />
                </HydrationGuard>
              </div>
              {/* End: Visitor Stats Card */}

              {/* Start: Calendar Card */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start: Calendar Card */}
                <HydrationGuard>
                  <RetroCalendar />
                </HydrationGuard>
                {/* End: Calendar Card */}

                {/* Start: Leaderboard Card */}
                <HydrationGuard>
                  <TopResidentsLeaderboard />
                </HydrationGuard>
                {/* End: Leaderboard Card */}
              </div>
            </>
          )}

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
        {/* End: Tab Content */}
      </div>

      {/* Start: Feedback Widget - Fixed bottom-right corner */}
      <div className="fixed bottom-6 right-6 z-40">
        <FeedbackWidget />
      </div>
      {/* End: Feedback Widget */}
    </main>
  );
}