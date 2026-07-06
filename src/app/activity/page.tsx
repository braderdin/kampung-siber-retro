// Start: Imports
'use client';
import { useState, useEffect } from 'react';
import { ActivityEntry } from '@/components/LiveActivityFeed';
import ProfileUpdateBox from '@/components/ProfileUpdateBox';
import CommunityInteraction from '@/components/CommunityInteraction';
// End: Imports

// Start: Type Definitions
interface ActivityPageProps {
  className?: string;
}

interface ActivityFeedResponse {
  success: boolean;
  data?: ActivityEntry[];
  error?: string;
}
// End: Type Definitions

// Start: ActivityPage Component
export default function ActivityPage({ className }: ActivityPageProps) {
  // Start: State Management
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [username, setUsername] = useState('Pengguna');
  // End: State Management

  // Start: Component Lifecycle
  useEffect(() => {
    // Check for hash flag
    if (typeof window !== 'undefined' && window.location.hash === '#new') {
      console.log('New post detected from hash');
    }
    
    fetchActivityFeed();
    
    const interval = setInterval(fetchActivityFeed, 30000);
    setRefreshInterval(interval);
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);
  // End: Component Lifecycle

  // Start: Fetch Activity Feed
  const fetchActivityFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/activity');
      const data: ActivityFeedResponse = await response.json();
      
      if (data.success && data.data) {
        setActivities(data.data);
      } else {
        setError(data.error || 'Failed to load activity feed');
      }
    } catch (err) {
      console.error('Error fetching activity feed:', err);
      setError('Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  };
  // End: Fetch Activity Feed

  // Start: Format Timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  // End: Format Timestamp

  // Start: Get Activity Icon
  const getActivityIcon = (type: ActivityEntry['type']): string => {
    const icons: Record<ActivityEntry['type'], string> = {
      code: '💻',
      join: '👋',
      leave: '👋',
      update: '🔄',
    };
    return icons[type] || '📝';
  };
  // End: Get Activity Icon

  // Start: Render Activity Entry
  const renderActivityEntry = (entry: ActivityEntry) => {
    return (
      <div
        key={entry.id}
        className="retro-activity-entry p-3 mb-2 bg-gray-50 dark:bg-gray-800 border-l-4 border-green-500 rounded"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getActivityIcon(entry.type)}</span>
            <span className="font-mono text-xs font-bold text-green-600 dark:text-green-400">
              {entry.user}
            </span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatTimestamp(entry.timestamp)}
          </span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          {entry.action}
        </p>
      </div>
    );
  };
  // End: Render Activity Entry

  // Start: Render Activity Page
  return (
    <div className={`retro-window ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <span className="mr-2">📊</span>
          Activity Feed
        </h3>
      </div>
      {/* End: Window Header */}

      {/* Start: Window Content */}
      <div className="p-3">
        {/* Start: Profile Update Box */}
        <div className="mb-4">
          <ProfileUpdateBox username={username} />
        </div>
        {/* End: Profile Update Box */}

        {/* Start: Community Interaction */}
        <div className="mb-4">
          <CommunityInteraction username={username} />
        </div>
        {/* End: Community Interaction */}

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading activity feed...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <button
              onClick={fetchActivityFeed}
              className="retro-btn-secondary text-xs"
            >
              Retry
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map(renderActivityEntry)}
          </div>
        )}
      </div>
      {/* End: Window Content */}

      {/* Start: Window Footer */}
      <div className="retro-window-footer bg-gray-200 dark:bg-gray-700 px-3 py-2 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center">
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
        </span>
        <button
          onClick={fetchActivityFeed}
          className="retro-btn-primary text-xs"
        >
          Refresh
        </button>
      </div>
      {/* End: Window Footer */}
    </div>
  );
}
// End: ActivityPage Component
