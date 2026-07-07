// Start: Imports
'use client';
import { useEffect, useState } from 'react';
import CodeMirrorEditor from '@/components/CodeMirrorEditor';
import CrtThemeController from '@/components/CrtThemeController';
import DashboardProfileBanner from '@/components/DashboardProfileBanner';
import FileManagerActions from '@/components/FileManagerActions';
import FileManagerGrid from '@/components/FileManagerGrid';
import RetroToolbar from '@/components/RetroToolbar';
import SandboxedPreview from '@/components/SandboxedPreview';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import type { FileAction, FileManagerItem, SiteFile, SiteFolder } from '@/types/fileManager';
// End: Imports

// Start: SiteFilesPage Component
export default function SiteFilesPage() {
  // Start: State Management
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  const [files, setFiles] = useState<SiteFile[]>([]);
  const [folders, setFolders] = useState<SiteFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<SiteFile[]>([]);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [activeFileContent, setActiveFileContent] = useState<string>('');
  const [activeFileName, setActiveFileName] = useState<string>('');
  // End: State Management

  // Start: Fetch Files
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const mockFiles: SiteFile[] = [
          {
            id: '1',
            filename: 'index.html',
            size: 1024,
            contentType: 'text/html',
            uploadedAt: new Date().toISOString(),
            url: '/files/index.html',
            type: 'file',
          },
          {
            id: '2',
            filename: 'style.css',
            size: 2048,
            contentType: 'text/css',
            uploadedAt: new Date().toISOString(),
            url: '/files/style.css',
            type: 'file',
          },
          {
            id: '3',
            filename: 'script.js',
            size: 1536,
            contentType: 'text/javascript',
            uploadedAt: new Date().toISOString(),
            url: '/files/script.js',
            type: 'file',
          },
        ];

        const mockFolders: SiteFolder[] = [
          {
            id: 'f1',
            name: 'images',
            createdAt: new Date().toISOString(),
            type: 'folder',
          },
          {
            id: 'f2',
            name: 'documents',
            createdAt: new Date().toISOString(),
            type: 'folder',
          },
        ];

        setFiles(mockFiles);
        setFolders(mockFolders);
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

  // Start: Theme Sync
  useEffect(() => {
    const syncCrtState = () => {
      setCrtEnabled(document.documentElement.classList.contains('crt-enabled'));
    };

    syncCrtState();
    const observer = new MutationObserver(syncCrtState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);
  // End: Theme Sync

  // Start: Handle File Actions
  const handleFileAction = (file: FileManagerItem, action: FileAction, newName?: string) => {
    if (action === 'edit' && file.type === 'file') {
      setActiveFileName(file.filename);
      const mockContent = `/* Content of ${file.filename} */\n\n`;
      setActiveFileContent(mockContent);
    } else if (action === 'navigate' && file.type === 'folder') {
      console.log('Navigating to folder:', file.name);
    } else if (action === 'rename' && newName) {
      console.log('Renaming item to:', newName);
    } else if (action === 'delete') {
      console.log('Deleting item:', file);
    }
  };
  // End: Handle File Actions

  // Start: Handle File Upload
  const handleFileUpload = () => {
    console.log('File upload triggered');
  };
  // End: Handle File Upload

  // Start: Handle Folder Creation
  const handleFolderCreate = () => {
    console.log('Folder creation triggered');
  };
  // End: Handle Folder Creation

  // Start: Handle File Creation
  const handleFileCreate = () => {
    console.log('File creation triggered');
  };
  // End: Handle File Creation

  // Start: Handle Batch Delete
  const handleBatchDelete = () => {
    console.log('Batch delete triggered', selectedFiles);
  };
  // End: Handle Batch Delete

  // Start: Handle File Content Change
  const handleFileContentChange = (content: string) => {
    setActiveFileContent(content);
  };
  // End: Handle File Content Change

  // Start: Render Site Files Page
  return (
    <div className="mx-auto max-w-7xl p-6">
      <DashboardProfileBanner />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Papan Pemuka</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t.dashboardTitle}</p>
        </div>
        <CrtThemeController />
      </div>

      <FileManagerActions
        onFileUpload={handleFileUpload}
        onFolderCreate={handleFolderCreate}
        onFileCreate={handleFileCreate}
        selectedCount={selectedFiles.length}
        onBatchDelete={handleBatchDelete}
      />

      {loading && (
        <div className="py-8 text-center">
          <div className="mx-auto mb-2 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{t.loadingDashboard}</p>
        </div>
      )}

      {error && (
        <div className="py-8 text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className={`mt-4 rounded-2xl border p-4 transition-all duration-200 ${crtEnabled ? 'border-slate-400 bg-slate-100/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)]' : 'border-slate-300 bg-white/80 shadow-sm'}`}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t.myFiles}</h2>
              <FileManagerGrid files={files} folders={folders} onFileAction={handleFileAction} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t.fileEditor}</h2>
              <div className="mb-2 grid grid-cols-2 gap-2">
                {(['html', 'css', 'js'] as const).map((tab) => (
                  <button key={tab} className="retro-tab-btn retro-tab-active">
                    {t[`${tab}Tab` as keyof typeof t] as string}
                  </button>
                ))}
              </div>
              <div className="grid h-96 grid-cols-1 gap-4 md:grid-cols-2">
                <div className="overflow-hidden rounded-md border-2 border-gray-300 dark:border-gray-600">
                  <CodeMirrorEditor 
                    value={activeFileContent}
                    onChange={handleFileContentChange}
                  />
                </div>
                <div className="overflow-hidden rounded-md border-2 border-gray-300 dark:border-gray-600">
                  <SandboxedPreview />
                </div>
              </div>
              <RetroToolbar className="mt-2" />
            </div>
          </div>
        </div>
      )}
      {/* End: File Manager Content */}
    </div>
  );
}
