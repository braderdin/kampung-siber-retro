// Start: Town Hall Page with Empty State
"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import RetroCalendar from '@/components/RetroCalendar';
import PixelCursorEffect from '@/components/PixelCursorEffect';
import HydrationGuard from '@/components/HydrationGuard';
import CommunityBulletin from '@/components/CommunityBulletin';
import Win95DialogEmptyState from '@/components/ui/Win95DialogEmptyState';

interface EventRecord {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'maintenance' | 'event' | 'update' | 'community';
  priority: 'high' | 'normal' | 'low';
}

export default function TownHallPage() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const [isClient, setIsClient] = useState(false);
  const [events, setEvents] = useState<EventRecord[]>([]);

  // Start: Component Initialization
  useEffect(() => {
    setIsClient(true);
    // Initialize empty events array - in production this would come from an API
    setEvents([]);
  }, []);
  // End: Component Initialization

  if (!isClient) {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
        </div>
      </main>
    );
  }

  return (
    // Start: Main Container
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-16">
      <PixelCursorEffect />

      {/* Start: Header Section */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-emerald-900/80 to-teal-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-cyan-400 pixel-font flex items-center gap-3">
            <span className="text-4xl">🏛️</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-300">
              {t.townHallTitle || 'Balai Raya Komuniti'}
            </span>
          </h1>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-1 pixel-font">
            {t.townHallSubtitle || 'Jadual penyelenggaraan dan acara komuniti'}
          </p>
        </div>
      </div>
      {/* End: Header Section */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Start: Community Bulletin */}
          <div className="lg:col-span-1">
            <HydrationGuard>
              <CommunityBulletin />
            </HydrationGuard>
          </div>
          {/* End: Community Bulletin */}

          {/* Start: Calendar View */}
          <div className="lg:col-span-2">
            <HydrationGuard>
              <div className="retro-card">
                <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    <span>{t.calendarTitle || 'Kalender Komuniti'}</span>
                  </h2>
                </div>
                <div className="p-4">
                  <RetroCalendar events={events.map(e => ({ date: e.date, title: e.title }))} />
                </div>
              </div>
            </HydrationGuard>
          </div>
          {/* End: Calendar View */}
        </div>

        {/* Start: Upcoming Events List with Empty State Injection */}
        <div className="mt-6 retro-card">
          <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
              <span className="text-xl">📋</span>
              <span>{t.upcomingEvents || 'Acara Mendatang'}</span>
            </h2>
          </div>
          <div className="p-4">
            {events.length === 0 ? (
              // Start: Win95 Empty State for No Events
              <Win95DialogEmptyState 
                message="Tiada perhimpunan komunal aktif pada masa ini. Jadilah pem organizer pertama!"
              />
              // End: Win95 Empty State for No Events
            ) : (
              // Start: Events List
              <div className="space-y-4">
                {events
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((event) => (
                    <div
                      key={event.id}
                      className={`
                        p-4 rounded-lg border-l-4
                        ${event.priority === 'high' ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : ''}
                        ${event.priority === 'normal' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''}
                        ${event.priority === 'low' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {event.type === 'maintenance' ? '🔧' : 
                           event.type === 'event' ? '🎉' : 
                           event.type === 'update' ? '🆕' : '👥'}
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-gray-200 pixel-font">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 pixel-font mt-1">
                            {event.description}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-500 pixel-font mt-2">
                            📅 {new Date(event.date).toLocaleDateString('ms-MY')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              // End: Events List
            )}
          </div>
        </div>
        {/* End: Upcoming Events List */}
      </div>
    </main>
    // End: Main Container
  );
}
// End: Town Hall Page with Empty State