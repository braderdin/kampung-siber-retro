"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import ProductCard from '@/components/ProductCard';
import PixelCursorEffect from '@/components/PixelCursorEffect';
import HydrationGuard from '@/components/HydrationGuard';

interface AssetItem {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
  tags: string[];
  downloads: number;
}

const ASSET_CATALOG: AssetItem[] = [
  {
    id: 'retro-btn-primary',
    title: 'Butang Utama Retro',
    category: 'CSS Component',
    description: 'Butang utama dengan batasan 8-bit dan efek hover neon.',
    code: `<button class="retro-btn-primary px-4 py-2 rounded pixel-font font-bold text-white bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105 transition-transform shadow-lg">Klik Saya</button>`,
    tags: ['button', 'css', 'retro', 'neon'],
    downloads: 1247
  },
  {
    id: 'retro-btn-secondary',
    title: 'Butang Sekunder Retro',
    category: 'CSS Component',
    description: 'Butang sekunder dengan batasan tipis dan corak 8-bit.',
    code: `<button class="retro-btn-secondary px-3 py-1 rounded pixel-font text-gray-700 dark:text-gray-300 border-2 border-gray-400 hover:border-pink-400 transition-colors">Tindakan</button>`,
    tags: ['button', 'css', 'retro', 'secondary'],
    downloads: 982
  },
  {
    id: 'pixel-frame',
    title: 'Cadangan Pixcel',
    category: 'CSS Frame',
    description: 'Kotak papan dengan bingkai hitam 8-bit untuk papar kandungan.',
    code: `<div class="pixel-frame bg-gray-100 dark:bg-gray-800 border-4 border-black dark:border-white rounded-pixel p-4 shadow-inner">Kandungan anda di sini</div>`,
    tags: ['frame', 'css', 'pixel', 'container'],
    downloads: 756
  },
  {
    id: 'mouse-dust-effect',
    title: 'Efek Debu Embah',
    category: 'JavaScript',
    description: 'Skrip ringkas untuk menambah efek debu mengikuti penunjuk mouse.',
    code: "const mouseTrail = (e) => { const dust = document.createElement('div'); dust.style.cssText = 'position:fixed;left:' + e.clientX + 'px;top:' + e.clientY + 'px;width:4px;height:4px;background:rgba(255,255,255,0.8);border-radius:50%;pointer-events:none;z-index:9999;'; document.body.appendChild(dust); setTimeout(() => dust.remove(), 500); }",
    tags: ['effect', 'mouse', 'js', 'particle'],
    downloads: 543
  },
  {
    id: 'audio-loop-bg',
    title: 'Larangan Audio Latar',
    category: 'Audio',
    description: 'Kod untuk memulakan larangan audio latar tidak terbongkar.',
    code: `const playLoop = (url) => { const audio = new Audio(url); audio.loop = true; audio.volume = 0.3; audio.play().catch(e => console.log('Autoplay blocked')); return audio; }`,
    tags: ['audio', 'loop', 'js', 'background'],
    downloads: 421
  },
  {
    id: 'crt-scanlines',
    title: 'Garis Gatian CRT',
    category: 'CSS Overlay',
    description: 'Lapisan CSS untuk menambah efek garis ganjil monitor CRT klasik.',
    code: `.crt-scanlines { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 2px); pointer-events: none; z-index: 9998; }`,
    tags: ['css', 'crt', 'retro', 'overlay'],
    downloads: 634
  },
  {
    id: 'terminal-cursor',
    title: 'Kursor Terminal',
    category: 'CSS Animation',
    description: 'Kursor berkedip untuk meniru konsol terminal klasik.',
    code: `.terminal-cursor { display: inline-block; width: 10px; height: 20px; background: #00ff00; animation: blink 1s infinite; } @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }`,
    tags: ['cursor', 'animation', 'css', 'terminal'],
    downloads: 389
  },
  {
    id: 'glitch-text',
    title: 'Teks Glitch',
    category: 'CSS/JS',
    description: 'Efek teks glitch untuk elemen teks statik.',
    code: `.glitch { position: relative; color: #ff00ff; } .glitch::before, .glitch::after { content: attr(data-text); position: absolute; left: 0; top: 0; }`,
    tags: ['text', 'glitch', 'css', 'effect'],
    downloads: 298
  }
];

export default function AssetStorePage() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
        </div>
      </main>
    );
  }

  const categories = ['all', ...Array.from(new Set(ASSET_CATALOG.map(a => a.category)))];

  const filteredAssets = ASSET_CATALOG.filter(asset => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesSearch = searchTerm.toLowerCase() === '' || 
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-16">
      <PixelCursorEffect />

      {/* Start: Header Section */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-cyan-400 pixel-font flex items-center gap-3">
            <span className="text-4xl">💎</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-300">
              Kedai Runcit Digital Pak Samad
            </span>
          </h1>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-1 pixel-font">
            Koleksi aset-retro untuk projek anda
          </p>
        </div>
      </div>
      {/* End: Header Section */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Start: Search and Filter */}
        <div className="retro-card mb-6">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder={t.searchPlaceholder || 'Cari aset...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="retro-input flex-1"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="retro-input w-auto"
              >
                <option value="all">{t.allCategories || 'Semua Kategori'}</option>
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* End: Search and Filter */}

        {/* Start: Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 pixel-font">
                Tiada aset yang padu dengan carian anda.
              </p>
            </div>
          ) : (
            filteredAssets.map(asset => (
              <HydrationGuard key={asset.id}>
                <ProductCard
                  id={asset.id}
                  title={asset.title}
                  category={asset.category}
                  description={asset.description}
                  code={asset.code}
                  tags={asset.tags}
                  downloads={asset.downloads}
                />
              </HydrationGuard>
            ))
          )}
        </div>
        {/* End: Asset Grid */}
      </div>
    </main>
  );
}