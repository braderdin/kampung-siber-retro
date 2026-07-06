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
interface SiteFile {
  id: string;
  filename: string;
  size: number;
  contentType: string;
  uploadedAt: string;
  url: string;
}

interface SiteFilesResponse {
  success: boolean;
  data?: SiteFile[];
  error?: string;
}
// End: Type Definitions

// Start: SiteFilesPage Component
export default function SiteFilesPage() {
  // Start: State Management
  const [files, setFiles] = useState<SiteFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // End: State Management

  // Start: Fetch Files
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('site_files')
          .select('*')
          .order('uploadedAt', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        const typedFiles = (data as SiteFile[] | null) ?? [];
        setFiles(typedFiles);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch files';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);
  // End: Fetch Files

  // Start: Format File Size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  // End: Format File Size

  // Start: Render Site Files Page
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Site Files Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your personal asset files (25MB tier)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Your Files
          </h2>
        </div>

        {loading && (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading files...</p>
          </div>
        )}

        {error && (
          <div className="p-6 text-center">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && files.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No files uploaded yet. Start uploading assets to see them here.
            </p>
          </div>
        )}

        {!loading && !error && files.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Uploaded
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {file.filename}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {file.contentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
// End: SiteFilesPage Component
