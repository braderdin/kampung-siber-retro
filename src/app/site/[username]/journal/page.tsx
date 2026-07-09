"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import PixelCursorEffect from '@/components/PixelCursorEffect';
import HydrationGuard from '@/components/HydrationGuard';

interface LogPost {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  tags: string[];
}

interface JournalPageProps {
  params: { username: string };
}

// Sample log posts - in production this would come from an API
const SAMPLE_LOGS: Record<string, LogPost[]> = {
  'cyber-pioneer': [
    {
      id: '1',
      title: 'Petualangan Pertama Saya',
      content: 'Hari ini saya mula menjelajah dunia retro internet. Saya telah menemui banyak teknologi yang menarik dan komuniti yang sangat mesra.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['permainan', 'komuniti']
    },
    {
      id: '2',
      title: 'Pembangunan Proyek Pertama',
      content: 'Saya telah selesai mencuba membuat satu laman web kecil dengan gaya retro. Hasilnya sangat memuaskan!',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['pembangunan', 'web']
    }
  ],
  'pixel-warrior': [
    {
      id: '1',
      title: 'Update Terbaru',
      content: 'Saya baru saja menyiapkan ciri-ciri baru untuk projek saya. Saya sangat teruas dengan kemaklumannya.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['update', 'berita']
    }
  ],
  'retro-hacker': [
    {
      id: '1',
      title: 'Penemuan Kaunter',
      content: 'Saya telah menemui satu kod yang menarik untuk mengubah laluan pengguna pada laman web retro.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['kod', 'retro']
    }
  ]
};

export default function JournalPage({ params }: JournalPageProps) {
  const { username } = params;
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const [isClient, setIsClient] = useState(false);
  const [logPosts, setLogPosts] = useState<LogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    setIsClient(true);
    
    // Load posts from sample data or localStorage
    const storedPosts = localStorage.getItem(`journal_${username}`);
    if (storedPosts) {
      setLogPosts(JSON.parse(storedPosts));
    } else if (SAMPLE_LOGS[username]) {
      setLogPosts(SAMPLE_LOGS[username]);
    } else {
      setLogPosts([]);
    }
  }, [username]);

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    const post: LogPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      timestamp: new Date().toISOString(),
      tags: []
    };
    
    const updatedPosts = [post, ...logPosts];
    setLogPosts(updatedPosts);
    localStorage.setItem(`journal_${username}`, JSON.stringify(updatedPosts));
    setNewPost({ title: '', content: '' });
    setShowForm(false);
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ms-MY') + ' ' + date.toLocaleTimeString();
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
      <div className="sticky top-16 z-40 bg-gradient-to-r from-green-900/80 to-teal-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-cyan-400 pixel-font flex items-center gap-3">
            <span className="text-4xl">📔</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-300">
              Diari {username}
            </span>
          </h1>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-1 pixel-font">
            Catatan peribadi dan petuaan harian
          </p>
        </div>
      </div>
      {/* End: Header Section */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Start: New Post Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="retro-btn-primary text-sm px-4 py-2"
          >
            ✍️ {t.newPost || 'Buat Entri Baru'}
          </button>
        </div>
        {/* End: New Post Button */}

        {/* Start: New Post Form */}
        {showForm && (
          <div className="retro-card mb-6">
            <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font">
                {t.newPost || 'Buat Entri Baru'}
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <input
                type="text"
                placeholder={t.postTitle || 'Tajuk entri...'}
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="retro-input w-full"
              />
              <textarea
                placeholder={t.postContent || 'Kandungan entri...'}
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="retro-textarea w-full"
                rows={4}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreatePost}
                  className="retro-btn-primary text-xs px-3 py-1"
                >
                  {t.save || 'Simpan'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="retro-btn-secondary text-xs px-3 py-1"
                >
                  {t.cancel || 'Batal'}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* End: New Post Form */}

        {/* Start: Timeline Stream */}
        <div className="space-y-4">
          {logPosts.length === 0 ? (
            <div className="retro-card text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 pixel-font">
                Tiada entri lagi. Jadilah yang pertama menulis!
              </p>
            </div>
          ) : (
            logPosts.map((post, index) => (
              <HydrationGuard key={post.id}>
                <div className="retro-card">
                  <div className="retro-card-header bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 pixel-font">
                        {post.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                        {formatTimestamp(post.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 pixel-font leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded pixel-font"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </HydrationGuard>
            ))
          )}
        </div>
        {/* End: Timeline Stream */}
      </div>
    </main>
  );
}