// Start: Imports
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
// End: Imports

// Start: Supabase Client Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// End: Supabase Client Configuration

// Start: Type Definitions
interface CommunityInteractionProps {
  username: string;
  className?: string;
}

interface Interaction {
  id: number;
  username: string;
  type: 'like' | 'follow' | 'comment';
  content?: string;
  created_at: string;
}
// End: Type Definitions

// Start: CommunityInteraction Component
export default function CommunityInteraction({ username, className }: CommunityInteractionProps) {
  // Start: State Management
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  // End: State Management

  // Start: Fetch Initial Interactions
  useEffect(() => {
    const fetchInteractions = async () => {
      const { data, error } = await supabase
        .from('interactions')
        .select('*')
        .eq('username', username)
        .order('created_at', { ascending: false });

      if (data) {
        const likes = data.filter((item: Interaction) => item.type === 'like').length;
        const follows = data.filter((item: Interaction) => item.type === 'follow').length;
        const userComments = data.filter((item: Interaction) => item.type === 'comment');
        
        setLiked(likes > 0);
        setFollowing(follows > 0);
        setComments(userComments.map((item: Interaction) => item.content || ''));
      }
    };

    fetchInteractions();
  }, [username]);
  // End: Fetch Initial Interactions

  // Start: Handle Like
  const handleLike = async () => {
    setLoading(true);
    try {
      if (!liked) {
        await supabase.from('interactions').insert({
          username,
          type: 'like',
          created_at: new Date().toISOString(),
        });
        setLiked(true);
      } else {
        await supabase
          .from('interactions')
          .delete()
          .eq('username', username)
          .eq('type', 'like');
        setLiked(false);
      }
    } catch (err) {
      console.error('Error updating like:', err);
    } finally {
      setLoading(false);
    }
  };
  // End: Handle Like

  // Start: Handle Follow
  const handleFollow = async () => {
    setLoading(true);
    try {
      if (!following) {
        await supabase.from('interactions').insert({
          username,
          type: 'follow',
          created_at: new Date().toISOString(),
        });
        setFollowing(true);
      } else {
        await supabase
          .from('interactions')
          .delete()
          .eq('username', username)
          .eq('type', 'follow');
        setFollowing(false);
      }
    } catch (err) {
      console.error('Error updating follow:', err);
    } finally {
      setLoading(false);
    }
  };
  // End: Handle Follow

  // Start: Handle Comment Submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setLoading(true);
      try {
        await supabase.from('interactions').insert({
          username,
          type: 'comment',
          content: newComment.trim(),
          created_at: new Date().toISOString(),
        });
        setComments([...comments, newComment.trim()]);
        setNewComment('');
      } catch (err) {
        console.error('Error adding comment:', err);
      } finally {
        setLoading(false);
      }
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
            disabled={loading}
            className={`retro-btn-secondary text-xs ${liked ? 'bg-green-500 text-white' : ''}`}
          >
            ❤️ Suka
          </button>
          <button
            onClick={handleFollow}
            disabled={loading}
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
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
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
