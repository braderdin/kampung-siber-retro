"use client";

import { useState, useEffect } from 'react';

interface Resident {
  id: number;
  username: string;
  avatar: string;
  visitorCount: number;
  rank: number;
  badges: string[];
}

interface TopResidentsLeaderboardProps {
  limit?: number;
  className?: string;
}

const MOCK_RESIDENTS: Resident[] = [
  {
    id: 1,
    username: 'cyber_pioneer',
    avatar: '🚀',
    visitorCount: 12847,
    rank: 1,
    badges: ['🏆', '⭐', '💎']
  },
  {
    id: 2,
    username: 'pixel_warrior',
    avatar: '⚔️',
    visitorCount: 9823,
    rank: 2,
    badges: ['⭐', '💎']
  },
  {
    id: 3,
    username: 'byte_collector',
    avatar: '💎',
    visitorCount: 7541,
    rank: 3,
    badges: ['💎']
  },
  {
    id: 4,
    username: 'retro_hacker',
    avatar: '🔧',
    visitorCount: 6234,
    rank: 4,
    badges: []
  },
  {
    id: 5,
    username: 'neon_drifter',
    avatar: '🌙',
    visitorCount: 5892,
    rank: 5,
    badges: ['⭐']
  }
];

export default function TopResidentsLeaderboard({ 
  limit = 5,
  className
}: TopResidentsLeaderboardProps) {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResidents = async () => {
      setIsLoading(true);
      
      // Simulate loading from API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would fetch from an API
      const sortedResidents = [...MOCK_RESIDENTS]
        .sort((a, b) => b.visitorCount - a.visitorCount)
        .slice(0, limit);
      
      setResidents(sortedResidents);
      setIsLoading(false);
    };

    loadResidents();
  }, [limit]);

  const getRankBadge = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number): string => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-500';
    return 'text-gray-500';
  };

  const getNeonShadow = (rank: number): string => {
    if (rank === 1) return 'shadow-[0_0_10px_#fbbf24,_0_0_20px_#fbbf24]';
    if (rank === 2) return 'shadow-[0_0_10px_#9ca3af,_0_0_20px_#9ca3af]';
    if (rank === 3) return 'shadow-[0_0_10px_#d97706,_0_0_20px_#d97706]';
    return '';
  };

  const getRankBadgeClass = (rank: number): string => {
    const baseClass = 'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm text-white';
    const colorClass = getRankColor(rank);
    const shadowClass = getNeonShadow(rank);
    return `${baseClass} ${colorClass} ${shadowClass}`;
  };

  const getResidentItemClass = (rank: number): string => {
    const baseClass = 'flex items-center gap-3 p-2 rounded border transition-all duration-300';
    if (rank <= 3) {
      return `${baseClass} border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20`;
    }
    return `${baseClass} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800`;
  };

  if (isLoading) {
    return (
      <div className={`retro-window ${className || ''}`}>
        <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
            <span className="mr-2">🏆</span>
            Top Residents
          </h3>
        </div>
        <div className="p-4 text-center">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`retro-window ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          <span className="mr-2">🏆</span>
          Top Residents
        </h3>
      </div>
      {/* End: Window Header */}

      {/* Start: Window Content */}
      <div className="p-3">
        <div className="space-y-2">
          {residents.map((resident) => (
            <div
              key={resident.id}
              className={getResidentItemClass(resident.rank)}
            >
              {/* Start: Rank Badge */}
              <div className={getRankBadgeClass(resident.rank)}>
                {getRankBadge(resident.rank)}
              </div>
              {/* End: Rank Badge */}

              {/* Start: Avatar */}
              <div className="text-2xl">{resident.avatar}</div>
              {/* End: Avatar */}

              {/* Start: Resident Info */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 dark:text-gray-200 text-sm truncate">
                  @{resident.username}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {resident.badges.join(' ')}
                </div>
              </div>
              {/* End: Resident Info */}

              {/* Start: Visitor Count */}
              <div className="text-right">
                <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                  {resident.visitorCount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  visitors
                </div>
              </div>
              {/* End: Visitor Count */}
            </div>
          ))}
        </div>
        {/* End: Resident List */}

        {/* Start: Footer */}
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            Updated: Just now
          </span>
        </div>
        {/* End: Footer */}
      </div>
      {/* End: Window Content */}
    </div>
  );
}