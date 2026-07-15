// Start: Asset Store Page with Empty State
"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import ProductCard from '@/components/ProductCard';
import PixelCursorEffect from '@/components/PixelCursorEffect';
import HydrationGuard from '@/components/HydrationGuard';
import Win95DialogEmptyState from '@/components/ui/Win95DialogEmptyState';

// Start: Empty Asset Catalog for Empty State
const EMPTY_ASSET_CATALOG: AssetItem[] = [];
// End: Empty Asset Catalog for Empty State

interface AssetItem {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
  tags: string[];
  downloads: number;
}

export default function AssetStorePage() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [assets, setAssets] = useState<AssetItem[]>([]);

  // Start: Component Initialization
  useEffect(() => {
    setIsClient(true);
    // Load empty catalog - awaiting user uploads
    setAssets(EMPTY_ASSET_CATALOG);
  }, []);
  // End: Component Initialization

  if (!isClient) {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
        </div>
      </main>
    );
  }

  // Start: Category Extraction
  const categories = ['all', ...Array.from(new Set(assets.map(a => a.category)))];
  // End: Category Extraction

  // Start: Filtered Assets Calculation
  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesSearch = searchTerm.toLowerCase() === '' || 
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  // End: Filtered Assets Calculation

  return (
    // Start: Main Container
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

        {/* Start: Asset Grid with Empty State Injection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.length === 0 ? (
            // Start: Win95 Empty State for No Assets
            <div className="col-span-full">
              <Win95DialogEmptyState 
                message="Inventori digital Pak Samad masih menunggu muat naik wargalaya. Jadilah pemilik kandungan pertama!"
              />
            </div>
            // End: Win95 Empty State for No Assets
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
    // End: Main Container
  );
}
// End: Asset Store Page with Empty State