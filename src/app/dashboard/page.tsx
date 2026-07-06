// Start: Imports
'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
// End: Imports

// Start: Type Definitions
interface DashboardProps {
  className?: string;
}

interface PageInfo {
  number: number;
  totalPages: number;
}
// End: Type Definitions

function DashboardContent({ className }: DashboardProps) {
  const searchParams = useSearchParams();
  const [pageInfo, setPageInfo] = useState<PageInfo>({ number: 1, totalPages: 10 });

  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10);
      if (!isNaN(pageNumber) && pageNumber > 0) {
        setPageInfo(prev => ({
          ...prev,
          number: pageNumber,
        }));
      }
    }
  }, [searchParams]);

  return (
    <div className={`p-6 max-w-7xl mx-auto ${className || ''}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your personalized workspace
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Page Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Page</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {pageInfo.number}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Pages</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {pageInfo.totalPages}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <span className="block text-2xl mb-2">📁</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">My Files</span>
            </button>
            <button
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <span className="block text-2xl mb-2">📊</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Analytics</span>
            </button>
            <button
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <span className="block text-2xl mb-2">⚙️</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage({ className }: DashboardProps) {
  return (
    <Suspense fallback={<div className="p-6 max-w-7xl mx-auto">Loading dashboard...</div>}>
      <DashboardContent className={className} />
    </Suspense>
  );
}
// End: DashboardPage Component
