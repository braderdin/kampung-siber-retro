'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import HydrationGuard from '@/components/HydrationGuard';
import RetroCalendar from '@/components/RetroCalendar';
import NoticeCard from '@/components/NoticeCard';

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  isMandatory: boolean;
  participants: number;
  maxParticipants: number;
}

const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: 'event-001',
    title: 'Pertubuhan Baharu',
    description: 'Sambangi program pendaftaran ahli kampung komuniti',
    date: '2026-07-15',
    time: '09:00 - 12:00',
    location: 'Balai Raya Kampung',
    organizer: 'Pejelat Komuniti',
    isMandatory: false,
    participants: 23,
    maxParticipants: 50
  },
  {
    id: 'event-002',
    title: 'Jimat Elektrik',
    description: 'Program pengajaran amalan penggunaan elektrik yang berbaik',
    date: '2026-07-18',
    time: '14:00 - 16:00',
    location: ' dewan serbaguna',
    organizer: 'Jabatan Tenaga',
    isMandatory: true,
    participants: 45,
    maxParticipants: 50
  },
  {
    id: 'event-003',
    title: 'Pesta Makanan Kita',
    description: 'Pameran makanan tradisional dan buatan sendiri',
    date: '2026-07-22',
    time: '10:00 - 18:00',
    location: 'Taman Komuniti',
    organizer: 'Badan Budaya',
    isMandatory: false,
    participants: 12,
    maxParticipants: 100
  },
  {
    id: 'event-004',
    title: 'Bengkel IT Ringkas',
    description: 'Latihan asas penggunaan komputer dan internet',
    date: '2026-07-25',
    time: '15:00 - 17:00',
    location: 'Pusat Telekomunikasi',
    organizer: 'Bengkel Digital',
    isMandatory: false,
    participants: 18,
    maxParticipants: 30
  },
  {
    id: 'event-005',
    title: 'Bersihkan Semangat',
    description: 'Sedekakan bersih bersama kampung',
    date: '2026-07-28',
    time: '08:00 - 11:00',
    location: 'Semua Bahagian',
    organizer: 'Pejelat Komuniti',
    isMandatory: true,
    participants: 38,
    maxParticipants: 50
  }
];

const MAINTENANCE_HOURS = [
  { day: 'Isnin', time: '02:00 - 04:00', description: 'Penyelenggaraan Sistem' },
  { day: 'Jumaat', time: '03:00 - 05:00', description: 'Penyelenggaraan Bas' },
  { day: 'Cuti Umum', time: '01:00 - 03:00', description: 'Penyelenggaraan Menara' }
];

// Simple date formatter without external libraries
const formatDateSimple = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export default function BalaiRayaPage() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<CommunityEvent[]>([]);

  useEffect(() => {
    const now = new Date();
    const upcoming = MOCK_EVENTS.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setUpcomingEvents(upcoming.slice(0, 3));
  }, []);

  const formatDate = (dateString: string): string => {
    return formatDateSimple(dateString);
  };

  return (
    <HydrationGuard>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Start: Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pixel-font mb-2 flex items-center justify-center gap-3">
              <span className="text-4xl">🎪</span>
              <span>Balai Raya Komuniti</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 pixel-font text-sm">
              {language === 'ms' 
                ? 'Pusat perhubungan untuk aktiviti komuniti' 
                : 'Community gathering center'}
            </p>
          </div>
          {/* End: Header */}

          {/* Start: Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="retro-window-client p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 pixel-font">
                {MOCK_EVENTS.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                {language === 'ms' ? 'Aktiviti' : 'Events'}
              </div>
            </div>
            <div className="retro-window-client p-4 text-center">
              <div className="text-2xl font-bold text-green-600 pixel-font">
                {upcomingEvents.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                {language === 'ms' ? 'Aktif' : 'Upcoming'}
              </div>
            </div>
            <div className="retro-window-client p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 pixel-font">
                3
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                {language === 'ms' ? 'Pautan' : 'Links'}
              </div>
            </div>
          </div>
          {/* End: Quick Stats */}

          {/* Start: Calendar Section */}
          <div className="retro-window-client mb-6">
            <div className="retro-card-header bg-indigo-600 dark:bg-indigo-700 px-4 py-2 border-b border-indigo-500 dark:border-indigo-600">
              <h2 className="text-lg font-bold text-white pixel-font flex items-center gap-2">
                <span>📅</span>
                {language === 'ms' ? 'Kalendar Komuniti' : 'Community Calendar'}
              </h2>
            </div>
            <div className="p-4">
              <RetroCalendar 
                events={MOCK_EVENTS.map(e => ({ date: e.date, title: e.title }))}
              />
            </div>
          </div>
          {/* End: Calendar Section */}

          {/* Start: Upcoming Events */}
          <div className="retro-window-client mb-6">
            <div className="retro-card-header bg-green-600 dark:bg-green-700 px-4 py-2 border-b border-green-500 dark:border-green-600">
              <h2 className="text-lg font-bold text-white pixel-font flex items-center gap-2">
                <span>🚀</span>
                {language === 'ms' ? 'Aktiviti Mendatang' : 'Upcoming Events'}
              </h2>
            </div>
            <div className="p-4">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 pixel-font">
                    {language === 'ms' 
                      ? 'Tiada aktiviti mendatang yang diumumkan' 
                      : 'No upcoming events scheduled'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {upcomingEvents.map(event => (
                    <div 
                      key={event.id} 
                      className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-green-800 dark:text-green-300 pixel-font">
                          {event.title}
                        </h3>
                        <span className="text-xs text-green-600 dark:text-green-400 pixel-font">
                          {event.isMandatory ? 'WAJIB' : 'MUSAJIT'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 pixel-font mb-2">
                        {event.description}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400 pixel-font">
                        <span>📅 {formatDate(event.date)}</span>
                        <span>🕐 {event.time}</span>
                        <span>📍 {event.location}</span>
                        <span>👥 {event.participants}/{event.maxParticipants}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* End: Upcoming Events */}

          {/* Start: Maintenance Schedule */}
          <div className="retro-window-client">
            <div className="retro-card-header bg-yellow-600 dark:bg-yellow-700 px-4 py-2 border-b border-yellow-500 dark:border-yellow-600">
              <h2 className="text-lg font-bold text-white pixel-font flex items-center gap-2">
                <span>🛠️</span>
                {language === 'ms' ? 'Jadual Penyelenggaraan' : 'Maintenance Schedule'}
              </h2>
            </div>
            <div className="p-4">
              <div className="grid gap-3">
                {MAINTENANCE_HOURS.map((maintenance, index) => (
                  <div 
                    key={index}
                    className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-yellow-800 dark:text-yellow-300 pixel-font">
                          {maintenance.day}
                        </div>
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 pixel-font">
                          {maintenance.description}
                        </div>
                      </div>
                      <span className="text-xs text-yellow-700 dark:text-yellow-400 pixel-font">
                        {maintenance.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* End: Maintenance Schedule */}
        </div>
      </main>
    </HydrationGuard>
  );
}