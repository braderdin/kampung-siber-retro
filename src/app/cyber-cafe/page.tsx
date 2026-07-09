"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import ArcadeGame from '@/components/ArcadeGame';
import PixelCursorEffect from '@/components/PixelCursorEffect';
import HydrationGuard from '@/components/HydrationGuard';

export default function CyberCafePage() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState<'games' | 'chat' | 'tutorials'>('games');

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-16">
      <PixelCursorEffect />

      {/* Start: Header Section */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-cyan-400 pixel-font flex items-center gap-3">
            <span className="text-4xl">🎮</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-300">
              {t.cyberCafeTitle || 'Kafe Siber Arcade'}
            </span>
          </h1>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-1 pixel-font">
            {t.cafeSubtitle || 'Village Gaming Arcade - Retro Games & Community'}
          </p>
        </div>
      </div>
      {/* End: Header Section */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Start: Navigation Tabs */}
        <div className="flex space-x-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-300 dark:border-gray-600 w-fit">
          <button
            onClick={() => setActiveSection('games')}
            className={`
              retro-btn-secondary text-xs px-4 py-2 transition-all duration-200
              ${activeSection === 'games' 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            🎮 Games
          </button>
          <button
            onClick={() => setActiveSection('chat')}
            className={`
              retro-btn-secondary text-xs px-4 py-2 transition-all duration-200
              ${activeSection === 'chat' 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveSection('tutorials')}
            className={`
              retro-btn-secondary text-xs px-4 py-2 transition-all duration-200
              ${activeSection === 'tutorials' 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            📚 Tutorials
          </button>
        </div>
        {/* End: Navigation Tabs */}

        {/* Start: Dual Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Start: Games Section */}
          {activeSection === 'games' && (
            <div className="lg:col-span-3">
              <div className="retro-card">
                <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
                    <span className="text-xl">🕹️</span>
                    <span>{t.gameTitle || 'Brick Breaker Classic'}</span>
                  </h2>
                </div>
                <div className="p-4">
                  <HydrationGuard>
                    <ArcadeGame className="w-full" />
                  </HydrationGuard>
                </div>
              </div>
            </div>
          )}
          {/* End: Games Section */}

          {/* Start: Chat Section */}
          {activeSection === 'chat' && (
            <div className="lg:col-span-3">
              <div className="retro-card h-96 flex flex-col">
                <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    <span>{t.chatTitle || 'Siber Chat Room'}</span>
                  </h2>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded p-3 mb-3 overflow-y-auto retroscrollbar">
                    <div className="space-y-2">
                      <div className="retro-entry bg-white dark:bg-gray-700 p-2 rounded border-l-4 border-pink-400">
                        <span className="text-xs text-pink-400 pixel-font">👾</span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 pixel-font ml-2">Selamat datang ke kafe siber! Main game atau chat dengan rakan.</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.messagePlaceholder || 'Taip mesej anda...'}
                      className="retro-input flex-1"
                    />
                    <button className="retro-btn-primary text-xs px-3 py-1">
                      {t.sendButton || 'Hantar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* End: Chat Section */}

          {/* Start: Tutorials Section */}
          {activeSection === 'tutorials' && (
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="retro-card">
                <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font">🎮 Brick Breaker Guide</h3>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 pixel-font">
                    Klik atau ketuk untuk mula. Usahakan untuk pecahkan semua blok. Gulakan papan dengan mouse atau sentuh.
                  </p>
                </div>
              </div>
              <div className="retro-card">
                <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font">🎨 Pixel Art Tips</h3>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 pixel-font">
                    Mulakan dengan grid 8x8. Gunakan palet 8-bit. Selalukan efek CRT untuk gaya 90an.
                  </p>
                </div>
              </div>
              <div className="retro-card">
                <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font">💻 HTML5 Canvas</h3>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 pixel-font">
                    Gunakan requestAnimationFrame untuk loop permainan. Simpan status dalam state React.
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* End: Tutorials Section */}
        </div>
      </div>
    </main>
  );
}