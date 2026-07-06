// Start: Imports
'use client';
import { useState } from 'react';
// End: Imports

// Start: Type Definitions
interface CommunityInteractionProps {
  username: string;
  className?: string;
}
// End: Type Definitions

// Start: CommunityInteraction Component
export default function CommunityInteraction({ username, className }: CommunityInteractionProps) {
  // Start: State Management
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  // End: State Management

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

  // Start: Handle Comment Submission
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, newComment.trim()]);
      setNewComment('');
    }
  };
  // End: Handle Comment Submission

  // Start: Render CommunityInteraction Component
  return (
    <div className={`retro-window ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          <span className="mr-2">👥</span>
          Interaksi Komuniti
        </h3>
      </div>
      {/* End: Window Header */}

      {/* Start: Window Content */}
      <div className="p-3">
        {/* Start: Action Buttons */}
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
        {/* End: Action Buttons */}

        {/* Start: Comments Section */}
        <div className="retro-controls-grid">
          <div className="retro-control-item">
            <span className="retro-control-label">💬</span>
            <span className="retro-control-name">Komen</span>
          </div>
        </div>
        
        <div className="mt-2 space-y-2">
          {comments.map((comment, index) => (
            <div key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
              <p className="text-sm text-gray-700 dark:text-gray-300">{comment}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmitComment} className="mt-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis komen anda..."
              className="flex-1 retro-input text-xs"
            />
            <button
              type="submit"
              className="retro-btn-primary text-xs"
            >
              Hantar
            </button>
          </div>
        </form>
        {/* End: Comments Section */}
      </div>
      {/* End: Window Content */}
    </div>
  );
}
// End: CommunityInteraction Component
