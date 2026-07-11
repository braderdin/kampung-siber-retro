"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import ProfileStatusBadge from '@/components/ProfileStatusBadge';
import ProfileBioEditor from '@/components/ProfileBioEditor';
import HydrationGuard from '@/components/HydrationGuard';

type BackgroundTheme = 'space_neon' | 'windows_gray' | 'retro_matrix' | 'neon_cyan' | 'retro_orange';

interface SiteProfileProps {
  params: { username: string };
}

interface ThemeConfig {
  id: BackgroundTheme;
  name: string;
  description: string;
  previewClass: string;
  primaryColor: string;
  secondaryColor: string;
  icon: string;
}

const THEME_OPTIONS: ThemeConfig[] = [
  {
    id: 'space_neon',
    name: 'Space Neon',
    description: 'Cosmic glow with vibrant neon accents',
    previewClass: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black',
    primaryColor: 'from-indigo-600 via-purple-600 to-pink-600',
    secondaryColor: 'text-cyan-400',
    icon: '🌌'
  },
  {
    id: 'windows_gray',
    name: 'Windows Gray',
    description: 'Classic Windows 95 style with muted tones',
    previewClass: 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300',
    primaryColor: 'from-blue-600 to-blue-700',
    secondaryColor: 'text-blue-600',
    icon: '🪟'
  },
  {
    id: 'retro_matrix',
    name: 'Retro Matrix',
    description: 'Classic green code rain aesthetic',
    previewClass: 'bg-gradient-to-br from-black via-green-900 to-black',
    primaryColor: 'from-green-400 to-emerald-500',
    secondaryColor: 'text-green-400',
    icon: '💚'
  },
  {
    id: 'neon_cyan',
    name: 'Neon Cyan',
    description: 'Bright cyan with electric accents',
    previewClass: 'bg-gradient-to-br from-cyan-900 via-teal-900 to-black',
    primaryColor: 'from-cyan-400 to-teal-500',
    secondaryColor: 'text-cyan-400',
    icon: '🔵'
  },
  {
    id: 'retro_orange',
    name: 'Retro Orange',
    description: 'Warm orange with vintage vibes',
    previewClass: 'bg-gradient-to-br from-orange-900 via-amber-900 to-black',
    primaryColor: 'from-orange-400 to-amber-500',
    secondaryColor: 'text-amber-400',
    icon: '🧡'
  }
];

export default function SiteProfilePage({ params }: SiteProfileProps) {
  const { username } = params;
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [selectedTheme, setSelectedTheme] = useState<BackgroundTheme>('space_neon');
  const [liveStatus, setLiveStatus] = useState<'online' | 'coding' | 'makan'>('online');
  const [publicBio, setPublicBio] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'journal' | 'links' | 'stats'>('profile');

  useEffect(() => {
    setIsClient(true);
    
    // Load user's selected theme
    const savedTheme = localStorage.getItem('background_theme') as BackgroundTheme;
    if (savedTheme && THEME_OPTIONS.some(t => t.id === savedTheme)) {
      setSelectedTheme(savedTheme);
    }

    // Load user's status
    const savedStatus = localStorage.getItem('user_status') as 'online' | 'coding' | 'makan';
    if (savedStatus && ['online', 'coding', 'makan'].includes(savedStatus)) {
      setLiveStatus(savedStatus);
    }

    // Load user's bio
    const savedBio = localStorage.getItem('user_bio');
    if (savedBio) {
      setPublicBio(savedBio);
    }
  }, []);

  const getCurrentTheme = () => THEME_OPTIONS.find(t => t.id === selectedTheme);

  if (!isClient) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
        </div>
      </main>
    );
  }

  return (
    <main className={`
      min-h-screen transition-all duration-500
      ${getCurrentTheme()?.previewClass || THEME_OPTIONS[0].previewClass}
      relative
    `}>
      {/* Start: Background Wall Skin Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/20 rounded-full filter blur-3xl" />
      </div>
      {/* End: Background Wall Skin Overlay */}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Start: Profile Header */}
        <div className="retro-card mb-6">
          <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-6 py-4 border-b border-gray-300 dark:border-gray-600">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{getCurrentTheme()?.icon || '👤'}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 pixel-font">
                  @{username}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                    <HydrationGuard>
                      <ProfileStatusBadge 
                        initialStatus={liveStatus}
                        onStatusChange={(status: string) => setLiveStatus(status as 'online' | 'coding' | 'makan')}
                      />
                    </HydrationGuard>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            {/* Start: Adaptive Dual-Column Tab Bar */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Link 
                href={`/site/${username}/journal`}
                className={`
                  flex items-center justify-center gap-2 px-3 py-2 rounded pixel-font font-bold text-center
                  transition-all duration-200
                  ${activeSection === 'journal' 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }
                `}
                onClick={() => setActiveSection('journal')}
              >
                <span className="text-lg">📖</span>
                <span className="hidden xs:inline">Jurnal</span>
              </Link>
              <Link 
                href={`/site/${username}/links`}
                className={`
                  flex items-center justify-center gap-2 px-3 py-2 rounded pixel-font font-bold text-center
                  transition-all duration-200
                  ${activeSection === 'links' 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }
                `}
                onClick={() => setActiveSection('links')}
              >
                <span className="text-lg">🔗</span>
                <span className="hidden xs:inline">Pautan</span>
              </Link>
              <Link 
                href={`/site/${username}/stats`}
                className={`
                  flex items-center justify-center gap-2 px-3 py-2 rounded pixel-font font-bold text-center
                  transition-all duration-200
                  ${activeSection === 'stats' 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }
                `}
                onClick={() => setActiveSection('stats')}
              >
                <span className="text-lg">📊</span>
                <span className="hidden xs:inline">Statistik</span>
              </Link>
            </div>
            {/* End: Adaptive Dual-Column Tab Bar */}

            {/* Start: Live Status Indicator */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
              <span className="text-2xl">
                {liveStatus === 'online' ? '🟢' : liveStatus === 'coding' ? '💻' : '☕'}
              </span>
              <div>
                <div className="font-bold text-gray-800 dark:text-gray-200 text-sm pixel-font">
                  Status: {liveStatus === 'online' ? 'Online' : liveStatus === 'coding' ? 'Koding' : 'Makan'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                  Last active: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
            {/* End: Live Status Indicator */}

            {/* Start: Public Bio */}
            <div className="retro-terminal retro-window-sm">
              <div className="retro-terminal-header bg-gray-800 px-3 py-2 border-b border-gray-700 flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="text-xs text-gray-400">🔴</span>
                  <span className="text-xs text-gray-400">🟡</span>
                  <span className="text-xs text-gray-400">🟢</span>
                </div>
                <span className="text-xs text-gray-500 pixel-font">bio.txt</span>
              </div>
              <div className="retro-terminal-body p-3">
                <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                  {publicBio || 'Belum mempunyai bio. Klik untuk mengedit!'}
                </pre>
              </div>
            </div>
            {/* End: Public Bio */}
          </div>
        </div>
        {/* End: Profile Header */}

        {/* Start: Theme Info */}
        <div className="retro-card">
          <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
              <span className="text-xl">🎨</span>
              <span>Tema Pilihan</span>
            </h2>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCurrentTheme()?.icon || '🌌'}</span>
              <div>
                <div className="font-bold text-gray-800 dark:text-gray-200 text-sm pixel-font">
                  {getCurrentTheme()?.name || 'Space Neon'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                  {getCurrentTheme()?.description || 'Cosmic glow with vibrant neon accents'}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End: Theme Info */}
      </div>
    </main>
  );
}