"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useLanguageStore } from "@/store/useLanguageStore";
import { enDictionary, msDictionary } from "@/lib/dictionary";
import CodeMirrorEditor from "@/components/CodeMirrorEditor";

interface TextEditorProps {
  className?: string;
}

interface FileContent {
  filename: string;
  content: string;
  language: string;
}

const mockFiles: Record<string, FileContent> = {
  'galeri/index.html': {
    filename: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Galeri Project</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      background: #000;
      color: #0f0;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Galeri Project</h1>
    <p>Welcome to the galeri project page.</p>
  </div>
</body>
</html>`,
    language: 'html',
  },
  'styles.css': {
    filename: 'styles.css',
    content: `/* Main Styles */
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}`,
    language: 'css',
  },
};

function TextEditorContent({ className }: TextEditorProps) {
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  const [filename, setFilename] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [fileLanguage, setFileLanguage] = useState<string>('html');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (!searchParams) return;
    const filenameParam = searchParams.get('filename');
    if (filenameParam) {
      setFilename(filenameParam);
      const fileData = mockFiles[filenameParam];
      if (fileData) {
        setContent(fileData.content);
        setFileLanguage(fileData.language);
      } else {
        setContent('');
        setFileLanguage('html');
      }
    }
  }, [searchParams]);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleRename = () => {
    const newFilename = prompt('Sila masukkan nama fail baru:', filename);
    if (newFilename && newFilename.trim()) {
      setFilename(newFilename.trim());
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 ${className || ''}`}>
      <div className="retro-window w-full max-w-4xl">
        <div className="retro-window-title-bar">
          <div className="retro-window-title">
            {filename || t.fileEditor}
          </div>
        </div>
        <div className="retro-window-client p-6">
          <div className="flex flex-col h-full bg-gray-900 border border-gray-600 rounded-lg overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 font-mono bg-gray-700 px-2 py-1 rounded font-mono">Line 1</span>
                <span className="text-xs text-gray-500">Col 1</span>
                {isSaved && (
                  <span className="text-xs text-green-400 font-semibold">✓ Simpan</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className="retro-btn-secondary text-xs px-3 py-1"
                >
                  SIMPAN
                </button>
                <button
                  onClick={handleRename}
                  className="retro-btn-secondary text-xs px-3 py-1"
                >
                  TUKAR NAMA
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-140px)] bg-gray-900 border-2 border-gray-600 rounded-md overflow-hidden">
                <CodeMirrorEditor 
                  value={content}
                  language={fileLanguage}
                  onChange={setContent}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TextEditorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading editor...</div>}>
      <TextEditorContent />
    </Suspense>
  );
}