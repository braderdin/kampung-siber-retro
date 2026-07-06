'use client';

import { notFound } from 'next/navigation';
import { useState } from 'react';
import CommunityInteraction from '@/components/CommunityInteraction';

interface UserSitePageProps {
  params: {
    username: string;
  };
}

// Start: UserSitePage Component
export default function UserSitePage({ params }: UserSitePageProps) {
  const { username } = params;
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);

  if (!username || username.length < 2) {
    notFound();
  }

  // Start: Handle Like
  const handleLike = () => {
    setLiked(!liked);
  };
  // End: Handle Like

  // Start: Handle Follow
  const handleFollow = () => {
    setFollowing(!following);
  };
  // End: Handle Follow

  // Start: Render UserSitePage Component
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="retro-window w-full max-w-4xl">
        <div className="retro-window-title-bar">
          <div className="retro-window-title">{username}'s Site</div>
        </div>
        <div className="retro-window-client p-6">
          <h1 className="text-2xl font-bold mb-4 retro-heading">
            Welcome to {username}'s Retro Website
          </h1>
          
          {/* Start: Interaction Buttons */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleLike}
              className={`retro-btn-secondary text-xs ${liked ? 'bg-green-500 text-white' : ''}`}
            >
              ❤️ Suka
            </button>
            <button
              onClick={handleFollow}
              className={`retro-btn-secondary text-xs ${following ? 'bg-blue-500 text-white' : ''}`}
            >
              👤 Ikut
            </button>
          </div>
          {/* End: Interaction Buttons */}
          
          <div className="retro-controls-grid">
            <div className="retro-control-item">
              <span className="retro-control-label">📁</span>
              <span className="retro-control-name">My Files</span>
            </div>
            <div className="retro-control-item">
              <span className="retro-control-label">📊</span>
              <span className="retro-control-name">Statistics</span>
            </div>
            <div className="retro-control-item">
              <span className="retro-control-label">⚙️</span>
              <span className="retro-control-name">Tetapan</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white rounded border-2 retro-border">
            <p className="text-gray-600">
              This is a placeholder for {username}'s personal retro website.
              Content will be loaded dynamically based on user configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// End: UserSitePage Component
