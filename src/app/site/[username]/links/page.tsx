"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import PixelCursorEffect from '@/components/PixelCursorEffect';
import HydrationGuard from '@/components/HydrationGuard';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: 'webring' | 'social' | 'project' | 'tool';
}

interface LinksPageProps {
  params: { username: string };
}

// Sample links data - in production this would come from an API
const SAMPLE_LINKS: Record<string, LinkItem[]> = {
  'cyber-pioneer': [
    {
      id: '1',
      title: 'Retro Web Forum',
      url: 'https://retroforum.example.com',
      description: 'Komuniti pembelajar web retro',
      category: 'webring'
    },
    {
      id: '2',
      title: 'Pixel Art Gallery',
      url: 'https://pixelgallery.example.com',
      description: 'Galeri karya seni pixel',
      category: 'project'
    }
  ],
  'pixel-warrior': [
    {
      id: '1',
      title: 'Game Development Discord',
      url: 'https://discord.gg/gamedev',
      description: 'Saluran rakan rush untuk pembangunan permainan',
      category: 'social'
    }
  ],
  'retro-hacker': [
    {
      id: '1',
      title: 'Code Archive',
      url: 'https://codearchive.example.com',
      description: 'Arkib kod sumber retro',
      category: 'project'
    },
    {
      id: '2',
      title: 'Terminal Emulator',
      url: 'https://terminal.example.com',
      description: 'Emulator terminal berbasis web',
      category: 'tool'
    }
  ]
};

export default function LinksPage({ params }: LinksPageProps) {
  const { username } = params;
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const [isClient, setIsClient] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', description: '', category: 'project' as LinkItem['category'] });

  useEffect(() => {
    setIsClient(true);
    
    // Load links from localStorage or sample data
    const storedLinks = localStorage.getItem(`links_${username}`);
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    } else if (SAMPLE_LINKS[username]) {
      setLinks(SAMPLE_LINKS[username]);
    } else {
      setLinks([]);
    }
  }, [username]);

  const handleAddLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) return;
    
    const link: LinkItem = {
      id: Date.now().toString(),
      title: newLink.title,
      url: newLink.url,
      description: newLink.description,
      category: newLink.category
    };
    
    const updatedLinks = [...links, link];
    setLinks(updatedLinks);
    localStorage.setItem(`links_${username}`, JSON.stringify(updatedLinks));
    setNewLink({ title: '', url: '', description: '', category: 'project' });
    setShowForm(false);
  };

  const getCategoryIcon = (category: LinkItem['category']): string => {
    switch (category) {
      case 'webring': return '🔗';
      case 'social': return '👥';
      case 'project': return '🚀';
      case 'tool': return '🔧';
      default: return '📌';
    }
  };

  const getCategoryStyles = (category: LinkItem['category']): string => {
    switch (category) {
      case 'webring': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300';
      case 'social': return 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300';
      case 'project': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
      case 'tool': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300';
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert(language === 'ms' ? 'Ditalin: ' + url : 'Copied: ' + url);
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
      <div className="sticky top-16 z-40 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-cyan-400 pixel-font flex items-center gap-3">
            <span className="text-4xl">🏠</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-300">
              Bilik Rakan
            </span>
          </h1>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-1 pixel-font">
            Laman rakan, webring, dan projek pilihan
          </p>
        </div>
      </div>
      {/* End: Header Section */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Start: Add Link Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="retro-btn-primary text-sm px-4 py-2"
          >
            ➕ {t.addLink || 'Tambah Pautan'}
          </button>
        </div>
        {/* End: Add Link Button */}

        {/* Start: Add Link Form */}
        {showForm && (
          <div className="retro-card mb-6">
            <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font">
                {t.addLink || 'Tambah Pautan'}
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <input
                type="text"
                placeholder={t.linkTitle || 'Tajuk pautan...'}
                value={newLink.title}
                onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                className="retro-input w-full"
              />
              <input
                type="url"
                placeholder="https://contoh.com"
                value={newLink.url}
                onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                className="retro-input w-full"
              />
              <input
                type="text"
                placeholder={t.linkDescription || 'Descripsi pautan...'}
                value={newLink.description}
                onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                className="retro-input w-full"
              />
              <select
                value={newLink.category}
                onChange={(e) => setNewLink({...newLink, category: e.target.value as LinkItem['category']})}
                className="retro-input w-full"
              >
                <option value="project">{t.projects || 'Projek'}</option>
                <option value="webring">{t.webrings || 'Webring'}</option>
                <option value="social">{t.social || 'Sosial'}</option>
                <option value="tool">{t.tools || 'Alat'}</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddLink}
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
        {/* End: Add Link Form */}

        {/* Start: Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.length === 0 ? (
            <div className="retro-card text-center py-8 col-span-full">
              <p className="text-gray-500 dark:text-gray-400 pixel-font mb-4">
                Tiada pautan lagi. Tambah satu pautan baru!
              </p>
            </div>
          ) : (
            links.map((link) => (
              <HydrationGuard key={link.id}>
                <div className="retro-card hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getCategoryIcon(link.category)}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 pixel-font mb-1">
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 pixel-font mb-2">
                            {link.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <span 
                            className={`text-xs px-2 py-1 rounded pixel-font ${getCategoryStyles(link.category)}`}
                          >
                            {getCategoryIcon(link.category)} {link.category}
                          </span>
                          <button
                            onClick={() => handleCopyUrl(link.url)}
                            className="retro-btn-secondary text-xs px-2 py-1 flex items-center gap-1"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="retro-card-footer bg-gray-50 dark:bg-gray-800 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-cyan-400 hover:text-cyan-300 pixel-font"
                            >
                              {link.url}
                            </a>
                          </div>
                </div>
              </HydrationGuard>
            ))
          )}
        </div>
        {/* End: Links Grid */}
      </div>
    </main>
  );
}