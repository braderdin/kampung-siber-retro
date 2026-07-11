"use client";

import { useState, useEffect, ReactElement } from 'react';
import { ArcadeLeaderboardEntry } from '@/types/arcade';

interface ArcadeLeaderboardProps {
  gameId?: string;
  className?: string;
}

const MOCK_ARCADE_SCORES: ArcadeLeaderboardEntry[] = [
  {
    id: '1',
    username: 'pixel_champion',
    gameId: 'retro-pong',
    highScore: 999999,
    achievedAt: '2026-07-10T12:30:00Z'
  },
  {
    id: '2',
    username: 'arcade_master',
    gameId: 'retro-pong',
    highScore: 875432,
    achievedAt: '2026-07-09T18:45:00Z'
  },
  {
    id: '3',
    username: 'neon_wizard',
    gameId: 'retro-pong',
    highScore: 762109,
    achievedAt: '2026-07-08T09:15:00Z'
  },
  {
    id: '4',
    username: 'crt_legend',
    gameId: 'retro-pong',
    highScore: 654321,
    achievedAt: '2026-07-07T22:00:00Z'
  },
  {
    id: '5',
    username: 'floppy_hero',
    gameId: 'retro-pong',
    highScore: 543210,
    achievedAt: '2026-07-06T14:20:00Z'
  }
];

// Start: Arcade Leaderboard Component
export default function ArcadeLeaderboard({ 
  gameId, 
  className 
}: ArcadeLeaderboardProps) {
  const [scores, setScores] = useState<ArcadeLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flashingStars, setFlashingStars] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadScores = async () => {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let filteredScores = [...MOCK_ARCADE_SCORES];
      if (gameId) {
        filteredScores = filteredScores.filter(score => score.gameId === gameId);
      }
      
      const sortedScores = filteredScores
        .sort((a, b) => b.highScore - a.highScore)
        .slice(0, 10);
      
      setScores(sortedScores);
      setIsLoading(false);
    };

    loadScores();
  }, [gameId]);

  useEffect(() => {
    if (isLoading) return;

    const flashInterval = setInterval(() => {
      const topThreeIds = scores.slice(0, 3).map(s => s.id);
      const randomId = topThreeIds[Math.floor(Math.random() * topThreeIds.length)];
      setFlashingStars(new Set([randomId]));
      
      setTimeout(() => {
        setFlashingStars(new Set());
      }, 300);
    }, 2000);

    return () => clearInterval(flashInterval);
  }, [isLoading, scores]);

  const getRankDisplay = (rank: number): ReactElement => {
    if (rank === 1) {
      return (
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border-2 border-yellow-300">
          <span className="text-lg font-bold text-white">1</span>
          <div className={`absolute -top-1 -right-1 text-yellow-400 text-lg ${flashingStars.has(scores[0]?.id) ? 'animate-ping' : ''}`}>
            ⭐
          </div>
          <div className="absolute inset-0 rounded-full animate-pulse" style={{ boxShadow: '0 0 15px #fbbf24, 0 0 30px #fbbf24' }}></div>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-gray-200">
          <span className="text-lg font-bold text-white">2</span>
          <div className={`absolute -top-1 -right-1 text-yellow-300 text-sm ${flashingStars.has(scores[1]?.id) ? 'animate-bounce' : ''}`}>
            ⭐
          </div>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 border-2 border-amber-500">
          <span className="text-lg font-bold text-white">3</span>
          <div className={`absolute -top-1 -right-1 text-yellow-300 text-sm ${flashingStars.has(scores[2]?.id) ? 'animate-bounce' : ''}`}>
            ⭐
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600">
        <span className="text-lg font-bold text-gray-700 dark:text-gray-300">{rank}</span>
      </div>
    );
  };

  const getScoreRowClass = (rank: number): string => {
    const baseClass = 'flex items-center gap-3 p-3 rounded transition-all duration-300 border-2 relative overflow-hidden';
    if (rank === 1) {
      return `${baseClass} border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30`;
    }
    if (rank === 2) {
      return `${baseClass} border-gray-300 bg-gray-50 dark:bg-gray-800/50`;
    }
    if (rank === 3) {
      return `${baseClass} border-amber-600 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20`;
    }
    return `${baseClass} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`;
  };

  const getScoreClass = (rank: number): string => {
    if (rank === 1) return 'font-bold text-xl text-yellow-600 dark:text-yellow-400 font-mono tracking-wider';
    if (rank === 2) return 'font-bold text-lg text-gray-700 dark:text-gray-300 font-mono';
    if (rank === 3) return 'font-bold text-base text-amber-700 dark:text-amber-500 font-mono';
    return 'font-bold text-sm text-gray-600 dark:text-gray-400 font-mono';
  };

  if (isLoading) {
    return (
      <div className={`retro-window ${className || ''}`}>
        <div className="retro-window-header bg-gradient-to-r from-purple-800 to-indigo-800 px-4 py-3 border-b-2 border-purple-600">
          <h3 className="text-sm font-bold text-white pixel-font tracking-widest">
            🕹️ ARCADE HIGH SCORES
          </h3>
        </div>
        <div className="p-4 text-center bg-gray-100 dark:bg-gray-900">
          <div className="text-gray-600 dark:text-gray-400 font-mono">INSERT COIN...</div>
          <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">LOADING LEADERBOARD DATA</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`retro-window ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gradient-to-r from-purple-800 to-indigo-800 px-4 py-3 border-b-2 border-purple-600">
        <h3 className="text-sm font-bold text-white pixel-font tracking-widest">
          🕹️ ARCADE HIGH SCORES
        </h3>
      </div>
      {/* End: Window Header */}

      {/* Start: Window Content */}
      <div className="p-3 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="space-y-2">
          {scores.map((score, index) => {
            const rank = index + 1;
            return (
              <div
                key={score.id}
                className={getScoreRowClass(rank)}
              >
                {/* Start: Rank Display */}
                <div className="flex-shrink-0">
                  {getRankDisplay(rank)}
                </div>
                {/* End: Rank Display */}

                {/* Start: Username */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 dark:text-gray-200 text-sm truncate pixel-font">
                    {score.username.toUpperCase()}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    {score.gameId.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
                {/* End: Username */}

                {/* Start: High Score */}
                <div className="text-right">
                  <div className={getScoreClass(rank)}>
                    {score.highScore.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(score.achievedAt).toLocaleDateString()}
                  </div>
                </div>
                {/* End: High Score */}
              </div>
            );
          })}
        </div>

        {/* Start: Footer */}
        <div className="mt-4 pt-3 border-t-2 border-purple-200 dark:border-purple-800 text-center">
          <span className="text-xs text-purple-600 dark:text-purple-400 pixel-font">
            🔥 KEEP PLAYING TO CLIMB THE RANKS! 🔥
          </span>
        </div>
        {/* End: Footer */}
      </div>
      {/* End: Window Content */}
    </div>
  );
}
