"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import PixelGameCanvas from '@/components/PixelGameCanvas';
import PixelCursorEffect from '@/components/PixelCursorEffect';
import HydrationGuard from '@/components/HydrationGuard';
import ArcadeLeaderboard from '@/components/ArcadeLeaderboard';

export default function CyberCafePage() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState<'games' | 'chat' | 'tutorials'>('games');
  const [highScores, setHighScores] = useState<Array<{ name: string; score: number }>>([]);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    setIsClient(true);
    
    // Load high scores from localStorage
    const storedScores = localStorage.getItem('high_scores');
    if (storedScores) {
      setHighScores(JSON.parse(storedScores));
    } else {
      setHighScores([
        { name: 'Player1', score: 150 },
        { name: 'Player2', score: 120 },
        { name: 'Player3', score: 100 }
      ]);
    }
  }, []);

  const handleGameOver = (score: number) => {
    setCurrentScore(score);
    
    // Update high scores
    const newScores = [...highScores, { name: 'Player', score }].sort((a, b) => b.score - a.score).slice(0, 5);
    setHighScores(newScores);
    localStorage.setItem('high_scores', JSON.stringify(newScores));
  };

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
      <div className="sticky top-16 z-40 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-md border-b-2 border-dashed border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-cyan-400 pixel-font flex items-center gap-3">
            <span className="text-4xl">🎮</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-300">
              {t.cyberCafeTitle || 'Kafe Siber Arcade'}
            </span>
          </h1>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-1 pixel-font border-l-2 border-dashed border-pink-400/50 pl-3">
            {t.cafeSubtitle || 'Village Gaming Arcade - Retro Games & Community'}
          </p>
        </div>
      </div>
      {/* End: Header Section */}

      {/* Start: Pixel Art Canvas Cabinet Buttons - Arcade Anchoring */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Start: Retro Snake Cabinet Button */}
          <Link
            href="/arcade/retro-snake"
            className="retro-card border-2 border-dashed border-green-400/50 bg-gradient-to-br from-green-900/40 to-emerald-900/40 hover:from-green-800/60 hover:to-emerald-800/60 transition-all duration-300 group"
          >
            <div className="p-6 flex items-center gap-4">
              <div className="text-6xl group-hover:scale-110 transition-transform">🐍</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-400 pixel-font mb-1">
                  Retro Snake
                </h3>
                <p className="text-xs text-gray-400 pixel-font">
                  Klasik ular hijau yang menyesuaikan cabang
                </p>
                <div className="mt-2 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded w-fit">
                  Score: <span className="font-mono">0</span>
                </div>
              </div>
              <div className="text-3xl text-green-400 group-hover:translate-x-1 transition-transform">
                ▶
              </div>
            </div>
          </Link>
          {/* End: Retro Snake Cabinet Button */}

          {/* Start: Retro Pong Cabinet Button */}
          <Link
            href="/arcade/retro-pong"
            className="retro-card border-2 border-dashed border-cyan-400/50 bg-gradient-to-br from-cyan-900/40 to-teal-900/40 hover:from-cyan-800/60 hover:to-teal-800/60 transition-all duration-300 group"
          >
            <div className="p-6 flex items-center gap-4">
              <div className="text-6xl group-hover:scale-110 transition-transform">🏓</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-cyan-400 pixel-font mb-1">
                  Retro Pong
                </h3>
                <p className="text-xs text-gray-400 pixel-font">
                  Permainan ping-pong klasik era 8-bit
                </p>
                <div className="mt-2 text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded w-fit">
                  Score: <span className="font-mono">0</span>
                </div>
              </div>
              <div className="text-3xl text-cyan-400 group-hover:translate-x-1 transition-transform">
                ▶
              </div>
            </div>
          </Link>
          {/* End: Retro Pong Cabinet Button */}
        </div>
      </div>
      {/* End: Pixel Art Canvas Cabinet Buttons */}

      {/* Start: High Scores Table Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="retro-card border-2 border-dashed border-yellow-400/30">
          <div className="retro-card-header bg-gradient-to-r from-yellow-900/80 to-amber-800/80 text-yellow-100 px-4 py-2 border-b-2 border-dashed border-yellow-500/50">
            <h2 className="text-lg font-bold pixel-font flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>High Scores</span>
            </h2>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-3 gap-2 text-xs pixel-font">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">#</span>
                <span>Rank</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-cyan-400">👤</span>
                <span>Player</span>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <span className="text-green-400">🔢</span>
                <span>Score</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs pixel-font border-t-2 border-dashed border-yellow-400/30 pt-2">
              {highScores.map((entry, index) => (
                <React.Fragment key={entry.name}>
                  <div className="text-center">
                    <span className={`font-bold ${index < 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-cyan-400">{entry.name}</span>
                  </div>
                  <div className="text-center justify-end">
                    <span className="text-green-400 font-mono">{entry.score}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* End: High Scores Table Header */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Start: Navigation Tabs */}
        <div className="flex space-x-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 w-fit">
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

        {/* Start: Games Section - Two Column Grid */}
        {activeSection === 'games' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Start: Main Game Viewport */}
            <div className="lg:col-span-2 retro-card border-2 border-dashed border-cyan-400/30">
              <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
                  <span className="text-xl">🕹️</span>
                  <span>{t.gameTitle || 'Brick Breaker Classic'}</span>
                </h2>
              </div>
              <div className="p-4">
                <HydrationGuard>
                  <PixelGameCanvas
                    className="w-full"
                    onScoreUpdate={setCurrentScore}
                    onGameOver={handleGameOver}
                  />
                </HydrationGuard>
              </div>
            </div>
            {/* End: Main Game Viewport */}

            {/* Start: Arcade Leaderboard Card */}
            <div className="retro-card h-full border-2 border-dashed border-purple-400/30">
              <ArcadeLeaderboard gameId="retro-pong" className="h-full" />
            </div>
            {/* End: Arcade Leaderboard Card */}
          </div>
        )}
        {/* End: Games Section */}

        {/* Start: Chat Section */}
        {activeSection === 'chat' && (
          <div className="retro-card h-96 flex flex-col border-2 border-dashed border-purple-400/30">
            <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
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
        )}
        {/* End: Chat Section */}

        {/* Start: Tutorials Section */}
        {activeSection === 'tutorials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="retro-card border-2 border-dashed border-blue-400/30">
              <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font">🎮 Brick Breaker Guide</h3>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 pixel-font">
                  Klik atau ketuk untuk mula. Usahakan untuk pecahkan semua blok. Gulakan papan dengan mouse atau sentuh.
                </p>
              </div>
            </div>
            <div className="retro-card border-2 border-dashed border-green-400/30">
              <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font">🎨 Pixel Art Tips</h3>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 pixel-font">
                  Mulakan dengan grid 8x8. Gunakan palet 8-bit. Selalukan efek CRT untuk gaya 90an.
                </p>
              </div>
            </div>
            <div className="retro-card border-2 border-dashed border-cyan-400/30">
              <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
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
    </main>
  );
}