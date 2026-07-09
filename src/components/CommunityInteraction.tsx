"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

interface Reply {
  id: number;
  parent_id: number;
  username: string;
  content: string;
  created_at: string;
}

export default function CommunityInteraction({ username, className }: CommunityInteractionProps) {
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [comments, setComments] = useState<Interaction[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});
  const [replyContent, setReplyContent] = useState<Record<number, string>>({});

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
        setComments(userComments);
      }
    };

    fetchInteractions();
  }, [username]);

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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setLoading(true);
      try {
        const { data: insertedComment } = await supabase.from('interactions').insert({
          username,
          type: 'comment',
          content: newComment.trim(),
          created_at: new Date().toISOString(),
        }).select();
        
        setComments([...comments, ...(insertedComment || [])]);
        setNewComment('');
      } catch (err) {
        console.error('Error adding comment:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitReply = async (parentId: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent[parentId]) return;
    
    setLoading(true);
    try {
      await supabase.from('replies').insert({
        parent_id: parentId,
        username,
        content: replyContent[parentId].trim(),
        created_at: new Date().toISOString(),
      });
      
      setExpandedReplies(prev => ({ ...prev, [parentId]: false }));
      setReplyContent(prev => ({ ...prev, [parentId]: '' }));
    } catch (err) {
      console.error('Error adding reply:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleReplies = (commentId: number) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const mockReplies: Record<number, Reply[]> = {
    1: [
      { id: 101, parent_id: 1, username: 'pixel_lover', content: 'I agree! This software is really interesting.', created_at: new Date().toISOString() },
      { id: 102, parent_id: 1, username: 'code_master', content: 'Thanks! I am also working on a new feature.', created_at: new Date().toISOString() },
    ],
    2: [
      { id: 103, parent_id: 2, username: 'retro_fan', content: 'I would like to contribute too!', created_at: new Date().toISOString() },
    ],
    3: [
      { id: 104, parent_id: 3, username: 'dev_guru', content: 'I can help with documentation!', created_at: new Date().toISOString() },
      { id: 105, parent_id: 3, username: 'doc_wizard', content: 'I am also happy to help.', created_at: new Date().toISOString() },
      { id: 106, parent_id: 3, username: 'help_hero', content: 'I have lots of experience with React.', created_at: new Date().toISOString() },
    ],
  };

  return (
    <div className={`retro-window ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          <span className="mr-2">👥</span>
          Community Interaction
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
            ❤️ Like
          </button>
          <button
            onClick={handleFollow}
            disabled={loading}
            className={`retro-btn-secondary text-xs ${following ? 'bg-blue-500 text-white' : ''}`}
          >
            👤 Follow
          </button>
        </div>
        {/* End: Action Buttons */}

        {/* Start: Comments Section */}
        <div className="retro-controls-grid">
          <div className="retro-control-item">
            <span className="retro-control-label">💬</span>
            <span className="retro-control-name">Comments</span>
          </div>
        </div>
        
        <div className="mt-2 space-y-3">
          {comments.map((comment, index) => (
            <div key={comment.id} className="comment-block">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    @{comment.username}
                  </span>
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="text-xs text-gray-500 hover:text-blue-500"
                  >
                    {expandedReplies[comment.id] ? '🔼' : '🔽'}
                  </button>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {comment.content}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.created_at).toLocaleString()}
                </div>
              </div>

              {/* Start: Nested Replies Drawer */}
              {expandedReplies[comment.id] && (
                <div className="nested-replies-container mt-2 ml-4 border-l-2 border-purple-500 pl-3">
                  <div className="retro-nested-comments">
                    {(mockReplies[comment.id] || []).map((reply) => (
                      <div key={reply.id} className="nested-reply p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 mb-2">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-xs text-gray-700 dark:text-gray-300">
                            @{reply.username}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {reply.content}
                        </p>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(reply.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                    
                    {/* Reply Input */}
                    <form onSubmit={(e) => handleSubmitReply(comment.id, e)} className="mt-2">
                      <textarea
                        value={replyContent[comment.id] || ''}
                        onChange={(e) => setReplyContent(prev => ({
                          ...prev,
                          [comment.id]: e.target.value
                        }))}
                        placeholder="Reply to this comment..."
                        className="w-full retro-input text-xs mb-2"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="retro-btn-primary text-xs px-2 py-1"
                        >
                          Send
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedReplies(prev => ({ ...prev, [comment.id]: false }))}
                          className="retro-btn-secondary text-xs px-2 py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmitComment} className="mt-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className="flex-1 retro-input text-xs"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="retro-btn-primary text-xs"
            >
              Send
            </button>
          </div>
        </form>
        {/* End: Comments Section */}
      </div>
      {/* End: Window Content */}
    </div>
  );
}