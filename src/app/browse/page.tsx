"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import HumanFeedbackToast from '@/components/HumanFeedbackToast';
import PaginationButton from '@/components/PaginationButton';
import SiteDirectoryGrid from '@/components/SiteDirectoryGrid';

interface BrowsePageProps {
  className?: string;
}

interface BrowseItem {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'asset' | 'project' | 'template';
  thumbnail: string;
  author: string;
  tags: string[];
  downloads: number;
  rating: number;
  url: string;
}

interface BrowseResponse {
  success: boolean;
  data?: BrowseItem[];
  error?: string;
}

interface FilterOptions {
  type: BrowseItem['type'] | 'all';
  sortBy: 'popular' | 'newest' | 'rating';
  search: string;
}

export default function BrowsePage({ className }: BrowsePageProps) {
  const [items, setItems] = useState<BrowseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams?.get('category') || 'all';
  const activeSortBy = searchParams?.get('sortBy') || 'popular';
  const activeSearch = searchParams?.get('search') || '';

  const updateUrlParams = (updates: { category?: string; sortBy?: string; search?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    if (updates.category !== undefined) {
      if (updates.category === 'all') {
        params.delete('category');
      } else {
        params.set('category', updates.category);
      }
    }
    
    if (updates.sortBy !== undefined) {
      params.set('sortBy', updates.sortBy);
    }
    
    if (updates.search !== undefined) {
      if (updates.search === '') {
        params.delete('search');
      } else {
        params.set('search', updates.search);
      }
    }
    
    if (updates.page !== undefined) {
      params.set('page', updates.page.toString());
    }
    
    router.push(`/browse?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    updateUrlParams({ category });
    setCurrentPage(1);
    setToastMessage(`Kategori dipilih: ${category === 'all' ? 'Semua' : category}`);
    setToastType('info');
  };

  const handleSortChange = (sortBy: string) => {
    updateUrlParams({ sortBy });
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    updateUrlParams({ search });
    setCurrentPage(1);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        type: activeCategory,
        sortBy: activeSortBy,
        search: activeSearch,
        page: currentPage.toString(),
      });

      const response = await fetch(`/api/browse?${queryParams}`);
      const data: BrowseResponse = await response.json();

      if (data.success && data.data) {
        setItems(data.data);
      } else {
        setError(data.error || 'Gagal memuat sumber');
        setToastMessage(data.error || 'Gagal memuat sumber');
        setToastType('error');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Gagal memuat sumber');
      setToastMessage('Gagal memuat sumber');
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    window.scrollTo(0, 0);
  }, [activeCategory, activeSortBy, activeSearch, currentPage]);

  const handleItemClick = (item: BrowseItem) => {
    router.push(item.url);
  };

  const directorySites = items.map((item) => ({
    id: item.id,
    title: item.title,
    description: `${item.description} · ${item.author}`,
    tags: item.tags.slice(0, 3),
    href: item.url,
  }));

  return (
    <div className={`retro-window flex flex-col ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <span className="mr-2">🛒</span>
          Lihat Sumber
        </h3>
      </div>
      {/* End: Window Header */}

      {/* Start: Window Content */}
      <div className="p-3 flex-1 overflow-y-auto">
        {/* Start: Filters */}
        <div className="retro-filters mb-3 p-2 bg-gray-50 dark:bg-gray-900/20 rounded border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <select
              value={activeCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="retro-select text-xs"
            >
              <option value="all">Semua Jenis</option>
              <option value="tutorial">Tutorial</option>
              <option value="asset">Aset</option>
              <option value="project">Projek</option>
              <option value="template">Template</option>
            </select>

            <select
              value={activeSortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="retro-select text-xs"
            >
              <option value="popular">Paling Popular</option>
              <option value="newest">Terbaru</option>
              <option value="rating">Rating Tertinggi</option>
            </select>

            <input
              type="text"
              placeholder="Cari..."
              value={activeSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="retro-input text-xs w-32"
            />
          </div>
        </div>
        {/* End: Filters */}

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Memuat sumber...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <button
              onClick={fetchItems}
              className="retro-btn-secondary text-xs"
            >
              Cuba Semula
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Tiada sumber ditemui</p>
          </div>
        ) : (
          <SiteDirectoryGrid sites={directorySites} />
        )}
      </div>
      {/* End: Window Content */}

      {/* Start: Window Footer */}
      <div className="retro-window-footer border-t border-gray-300 bg-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <PaginationButton currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      {/* End: Window Footer */}

      {toastMessage ? (
        <HumanFeedbackToast message={toastMessage} type={toastType} duration={3000} onClose={() => setToastMessage(null)} />
      ) : null}
    </div>
  );
}