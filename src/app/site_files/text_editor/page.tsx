// Start: Text Editor Page with R2 Integration and Split View
"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, useCallback } from 'react';
import { useLanguageStore } from "@/store/useLanguageStore";
import { enDictionary, msDictionary } from "@/lib/dictionary";
import EditorHtmlPreview from '@/components/editor/EditorHtmlPreview';
import MediaEmbedHelper from '@/components/editor/MediaEmbedHelper';
import PublishSiteButton from '@/components/editor/PublishSiteButton';
import { useEditorAutosave } from '@/hooks/useEditorAutosave';
import { getAutosavedContent } from '@/hooks/useEditorAutosave';

interface TextEditorProps {
  className?: string;
}

// Start: Default HTML Template
const DEFAULT_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Saya</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      background: #1a1a2e;
      color: #eaeaea;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: #00ff88;
      text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Selamat Datang ke Teratak Saya!</h1>
    <p>Halaman ini mempunyai kandungan dari Cloudflare R2.</p>
  </div>
</body>
</html>`;
// End: Default HTML Template

function TextEditorContent({ className }: TextEditorProps) {
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  // Start: Core State Variables
  const [filename, setFilename] = useState<string>('index.html');
  const [content, setContent] = useState<string>('');
  const [fileLanguage, setFileLanguage] = useState<string>('html');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // End: Core State Variables

  // Start: Autosave Hook Integration
  const { hasAutosavedContent, clearAutosavedContent } = useEditorAutosave({
    content,
    filename,
    enabled: true,
    intervalMs: 5000,
  });
  // End: Autosave Hook Integration

  // Start: Restore Autosaved Content on Mount
  useEffect(() => {
    if (hasAutosavedContent()) {
      const autosaved = getAutosavedContent(filename);
      if (autosaved) {
        setContent(autosaved);
        clearAutosavedContent();
      }
    }
  }, [filename, hasAutosavedContent, clearAutosavedContent]);
  // End: Restore Autosaved Content on Mount

  // Start: Fetch R2 Content Function
  const fetchR2Content = useCallback(async (file: string) => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      const sessionToken = localStorage.getItem('sb-access-token');
      if (!sessionToken) {
        throw new Error('Sesi tidak sah');
      }

      const response = await fetch(`/api/storage/read?filename=${encodeURIComponent(file)}`, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      const data = await response.json();
      
      if (data.success && data.content !== undefined) {
        setContent(data.content);
      } else {
        setContent(DEFAULT_HTML_TEMPLATE);
      }
    } catch (error) {
      console.error('Fetch R2 content error:', error);
      setContent(DEFAULT_HTML_TEMPLATE);
    } finally {
      setIsLoading(false);
    }
  }, []);
  // End: Fetch R2 Content Function

  useEffect(() => {
    if (!searchParams) return;
    const filenameParam = searchParams.get('filename');
    if (filenameParam) {
      setFilename(filenameParam);
      fetchR2Content(filenameParam);
    } else {
      setFilename('index.html');
      setContent(DEFAULT_HTML_TEMPLATE);
    }
  }, [searchParams, fetchR2Content]);

  // Start: Handle Insert Embed
  const handleInsertEmbed = (embedCode: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const cursorPos = textarea.selectionStart || content.length;
      const newContent = content.substring(0, cursorPos) + embedCode + content.substring(cursorPos);
      setContent(newContent);
      textarea.focus();
    }
  };
  // End: Handle Insert Embed

  // Start: Handle Save
  const handleSave = () => {
    saveToR2();
  };
  // End: Handle Save

  // Start: Handle Rename
  const handleRename = () => {
    const newFilename = prompt('Sila masukkan nama fail baru:', filename);
    if (newFilename && newFilename.trim()) {
      setFilename(newFilename.trim());
    }
  };
  // End: Handle Rename

  // Start: Save to R2 Function
  const saveToR2 = useCallback(async () => {
    if (!filename) return;
    
    setIsLoading(true);
    setSaveError(null);
    
    try {
      const sessionToken = localStorage.getItem('sb-access-token');
      if (!sessionToken) {
        throw new Error('Sesi tidak sah - sila log masuk semula');
      }

      const response = await fetch('/api/storage/upload', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          fileName: filename,
          content: content,
          mimeType: fileLanguage === 'html' ? 'text/html' : 
                   fileLanguage === 'css' ? 'text/css' : 'text/javascript',
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Gagal menyimpan fail');
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error('Save to R2 error:', error);
      setSaveError(error instanceof Error ? error.message : 'Gagal menyimpan kandungan');
    } finally {
      setIsLoading(false);
    }
  }, [filename, content, fileLanguage]);
  // End: Save to R2 Function

  // Start: Handle Publish Complete Callback
  const handlePublishComplete = (success: boolean) => {
    if (success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };
  // End: Handle Publish Complete Callback

  return (
    <div className={`flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 ${className || ''}`}>
      {/* Start: Back Navigation Button */}
      <div className="absolute top-4 left-4 z-50">
        <a
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 border-2 border-gray-600 rounded pixel-font text-xs text-gray-300 hover:bg-gray-700 transition-colors"
          title="Kembali ke Papan Kawalan"
        >
          <span className="text-lg">🔙</span>
          <span>Kembali ke Papan Kawalan</span>
        </a>
      </div>
      {/* End: Back Navigation Button */}

      {/* Start: Editor Header Toolbar */}
      <div className="bg-gray-800 border-b-2 border-gray-300 px-4 py-3 flex items-center justify-between flex-shrink-0 pt-14">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold text-gray-200 pixel-font">
            {filename || 'Editor Fail'}
          </h2>
          {isSaved && (
            <span className="text-xs text-green-400 pixel-font">✓ Disimpan</span>
          )}
          {saveError && (
            <span className="text-xs text-red-400 pixel-font">{saveError}</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <MediaEmbedHelper onInsertEmbed={handleInsertEmbed} />
          <PublishSiteButton
            filename={filename}
            content={content}
            mimeType={fileLanguage === 'html' ? 'text/html' : fileLanguage === 'css' ? 'text/css' : 'text/javascript'}
            onPublishComplete={handlePublishComplete}
          />
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="retro-btn-primary flex items-center gap-2 px-3 py-2 pixel-font text-xs disabled:opacity-50"
          >
            {isLoading ? 'MENYIMPAN...' : 'SIMPAN'}
          </button>
          <button
            onClick={handleRename}
            className="retro-btn-secondary px-3 py-2 pixel-font text-xs"
          >
            TUKAR NAMA
          </button>
        </div>
      </div>
      {/* End: Editor Header Toolbar */}

      {/* Start: Responsive FlexGrid Split Screen Container */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Start: Editor Panel (Left on Desktop, Top on Mobile) */}
        <div className="flex-1 flex flex-col min-h-0 md:max-w-1/2 lg:max-w-3/5">
          <div className="retro-window-slate flex-1 flex flex-col overflow-hidden m-2 md:m-4">
            <div className="retro-window-title-bar-slate flex items-center justify-between px-3 py-2 flex-shrink-0">
              <span className="text-xs font-mono text-gray-300">
                📄 {filename}
              </span>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-500">Line: {content.split('\n').length}</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-500">Col: {content.length}</span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm p-4 resize-none outline-none border-2 border-gray-600 rounded-b-lg"
                placeholder="Masukkan kandungan HTML anda di sini..."
                spellCheck={false}
              />
            </div>
          </div>
        </div>
        {/* End: Editor Panel */}

        {/* Start: Preview Panel (Right on Desktop, Bottom on Mobile) */}
        <div className="flex-1 flex flex-col min-h-0 md:max-w-1/2 lg:max-w-2/5">
          <EditorHtmlPreview content={content} />
        </div>
        {/* End: Preview Panel */}
      </div>
      {/* End: Responsive FlexGrid Split Screen Container */}

      {/* Start: Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2" />
            <p className="text-gray-300 pixel-font text-sm">Memuat naik ke Cloudflare R2...</p>
          </div>
        </div>
      )}
      {/* End: Loading Overlay */}
    </div>
  );
}

export default function TextEditorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-400 pixel-font">Memuat editor...</p>
        </div>
      </div>
    }>
      <TextEditorContent />
    </Suspense>
  );
}