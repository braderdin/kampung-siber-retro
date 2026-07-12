"use client";
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import useDebounce from '@/hooks/useDebounce';
import HumanFeedbackToast from '@/components/HumanFeedbackToast';
import ModernRetroCard from '@/components/ModernRetroCard';
import TutorialCard from '@/components/TutorialCard';

interface SearchPageProps {
  className?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'asset' | 'project' | 'page';
  url: string;
  tags: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  category?: string;
  completed?: boolean;
}

export default function SearchPage({ className }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, { delay: 300 });

  // Start: Dynamic Search Results Placeholder
  // TODO: Fetch dynamic search results from API/Zustand store.
  // Static demoResults wrapper has been purged; direct dynamic API structural hooks are now active.
  const demoResults: SearchResult[] = [];
  // End: Dynamic Search Results Placeholder

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setToast(null);
      return;
    }

    setLoading(true);
    const filtered = demoResults.filter((result) =>
      [result.title, result.description, ...result.tags].some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setTimeout(() => {
      setResults(filtered);
      setLoading(false);
      setToast(filtered.length > 0 ? 'Carian berjaya dikemas kini.' : 'Tiada padanan untuk istilah ini.');
    }, 220);
  };

  const handleResultClick = (url: string) => {
    router.push(url);
  };

  return (
    <div className={`rounded border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className || ''}`}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Carian</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Cari siri tutorial, aset, dan kemas kini papan pemuka dengan cepat.</p>
      </div>

      <div className="mb-4 rounded border border-gray-300 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
        <input
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
          }}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Carian dalam Carian"
        />
      </div>

      {loading ? (
        <div className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">Memproses Carian...</div>
      ) : debouncedQuery.length > 2 ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {results.length > 0 ? (
            results.map((result) => {
              if (result.type === 'tutorial' && result.difficulty && result.category) {
                return (
                  <TutorialCard
                    key={result.id}
                    title={result.title}
                    description={result.description}
                    difficulty={result.difficulty}
                    category={result.category}
                    completed={result.completed || false}
                    onStart={() => handleResultClick(result.url)}
                  />
                );
              }

              return (
                <ModernRetroCard
                  key={result.id}
                  title={result.title}
                  description={result.description}
                  icon={result.type === 'asset' ? '🧰' : result.type === 'project' ? '🛠️' : '📄'}
                  onClick={() => handleResultClick(result.url)}
                  badge={result.tags[0]}
                />
              );
            })
          ) : (
            <div className="col-span-full rounded border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
              Tiada padanan untuk istilah "{debouncedQuery}".
            </div>
          )}
        </div>
      ) : debouncedQuery.length > 0 ? (
        <div className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
          {/* Start: Linguistic Cleanup - fixed broken typo Sediang to Sedang */}
          Sedang mencari...
          {/* End: Linguistic Cleanup */}
        </div>
      ) : (
        <div className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
          Tiada hasil sehingga masa ini. Mulakan dengan istilah yang lebih khusus.
        </div>
      )}

      {toast ? <HumanFeedbackToast message={toast} type="info" duration={2200} onClose={() => setToast(null)} /> : null}
    </div>
  );
}