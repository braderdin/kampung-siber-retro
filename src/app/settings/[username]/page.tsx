"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import ProfileStatusBadge from '@/components/ProfileStatusBadge';
import ProfileBioEditor from '@/components/ProfileBioEditor';
import SettingsTipping from '@/components/SettingsTipping';
import { showSuccess, showError, showWarning, showInfo } from '@/components/RetroToast';

type BackgroundTheme = 'space_neon' | 'windows_gray' | 'retro_matrix' | 'neon_cyan' | 'retro_orange';

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

export default function SettingsPage({ params }: { params: { username: string } }) {
  const { username } = params;
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [selectedTheme, setSelectedTheme] = useState<BackgroundTheme>('space_neon');
  const [customBio, setCustomBio] = useState('');
  const [liveStatus, setLiveStatus] = useState<'online' | 'coding' | 'makan'>('online');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedTheme = localStorage.getItem('background_theme') as BackgroundTheme;
    if (savedTheme && THEME_OPTIONS.some(t => t.id === savedTheme)) {
      setSelectedTheme(savedTheme);
    }

    const savedBio = localStorage.getItem('user_bio');
    if (savedBio) {
      setCustomBio(savedBio);
    }

    const savedStatus = localStorage.getItem('user_status') as 'online' | 'coding' | 'makan';
    if (savedStatus && ['online', 'coding', 'makan'].includes(savedStatus)) {
      setLiveStatus(savedStatus);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('background_theme', selectedTheme);
  }, [selectedTheme]);

  useEffect(() => {
    localStorage.setItem('user_bio', customBio);
  }, [customBio]);

  useEffect(() => {
    localStorage.setItem('user_status', liveStatus);
  }, [liveStatus]);

  const handleThemeChange = (themeId: BackgroundTheme) => {
    setSelectedTheme(themeId);
    
    // Show success toast
    showSuccess(`Tema latar ${THEME_OPTIONS.find(t => t.id === themeId)?.name} telah disemak!`, 3000);
    setCustomBio(prev => prev); // Trigger re-render
  };

  const handleStatusChange = (status: string) => {
    setLiveStatus(status as 'online' | 'coding' | 'makan');
  };

  const handleBioChange = (bio: string) => {
    setCustomBio(bio);
  };

  const getCurrentTheme = () => THEME_OPTIONS.find(t => t.id === selectedTheme);

  return (
    <main className={`
      min-h-screen transition-all duration-500
      ${getCurrentTheme()?.previewClass || THEME_OPTIONS[0].previewClass}
    `}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Start: Page Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pixel-font mb-2">
            {t.settingsTitle || 'Settings'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t.manageProfile || `Kelola profil ${username}`}
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Theme Picker Section */}
        <div className="retro-card mb-6">
          <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
              <span className="text-xl">🎨</span>
              <span>{t.themeSettings || 'Latar Belakang Tema'}</span>
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`
                    retro-card retro-window-sm p-3 text-center transition-all duration-200
                    ${selectedTheme === theme.id 
                      ? 'ring-2 ring-purple-500 transform scale-105' 
                      : 'hover:transform hover:scale-105'
                    }
                  `}
                >
                  <div className="text-3xl mb-2">{theme.icon}</div>
                  <div className={`font-bold text-sm text-gray-800 dark:text-gray-200 mb-1`}>
                    {theme.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                    {theme.description}
                  </div>
                  <div className={`
                    mt-2 h-2 rounded-full
                    ${selectedTheme === theme.id ? 'opacity-100' : 'opacity-30'}
                  `}
                    style={{
                      background: `linear-gradient(90deg, var(--tw-gradient-stops))`
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* End: Theme Picker Section */}

        {/* Start: Status and Bio Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Start: Live Status */}
          <div className="retro-card">
            <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
                <span className="text-xl">🟢</span>
                <span>{t.liveStatus || 'Status Langsung'}</span>
              </h2>
            </div>
            <div className="p-4">
              <ProfileStatusBadge 
                initialStatus={liveStatus}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
          {/* End: Live Status */}

          {/* Start: Bio Editor */}
          <div className="retro-card">
            <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
                <span className="text-xl">📝</span>
                <span>{t.bioEditor || 'Bio Editor'}</span>
              </h2>
            </div>
            <div className="p-4">
              <ProfileBioEditor 
                initialBio={customBio || 'Saya warga kampung siber retro yang antara.'}
                onBioChange={handleBioChange}
              />
            </div>
          </div>
          {/* End: Bio Editor */}
        </div>
        {/* End: Status and Bio Section */}

        {/* Start: Tipping Section */}
        <div className="mt-6">
          <SettingsTipping />
        </div>
        {/* End: Tipping Section */}
      </div>
    </main>
  );
}