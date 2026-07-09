"use client";

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
  tags: string[];
  downloads: number;
}

export default function ProductCard({ 
  id,
  title, 
  category, 
  description, 
  code,
  tags,
  downloads
}: ProductCardProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleCopy = async (codeContent: string, cardId: string) => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopiedId(cardId);
      setCopied(true);
      setAlertMessage(language === 'ms' ? 'Berjaya disalin!' : 'Copied successfully!');
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
        setCopied(false);
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error('Gagal menyalin kod:', err);
      setAlertMessage(language === 'ms' ? 'Gagal menyalin' : 'Failed to copy');
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="product-card retro-window-client rounded-lg shadow-lg overflow-hidden">
      {/* Start: Card Header */}
      <div className="retro-card-header bg-gray-800 dark:bg-gray-700 px-4 py-2 border-b border-gray-600 dark:border-gray-500">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-100 dark:text-gray-200 pixel-font">
            {title}
          </h3>
          <span className="text-xs text-gray-400 pixel-font">
            ⬇ {downloads}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
          {category}
        </span>
      </div>
      {/* End: Card Header */}

      {/* Start: Card Body */}
      <div className="p-4 bg-white dark:bg-gray-900">
        <p className="text-sm text-gray-700 dark:text-gray-300 pixel-font mb-3">
          {description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map(tag => (
            <span 
              key={tag} 
              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded pixel-font"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      {/* End: Card Body */}

      {/* Start: Card Actions */}
      <div className="retro-card-footer bg-gray-50 dark:bg-gray-800 px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <button
          onClick={() => setShowCode(!showCode)}
          className="retro-btn-secondary text-xs px-2 py-1 flex items-center gap-1"
        >
          {showCode ? '🔍' : '👁️'}
          <span>{showCode ? ' Tutup' : ' Lihat Kod'}</span>
        </button>
        
        <button
          onClick={() => handleCopy(code, id)}
          className="retro-btn-secondary text-xs px-2 py-1 flex items-center gap-1"
        >
          {copiedId === id ? '✅' : '📋'}
          <span>{copiedId === id ? ' Disalin!' : ' Salin Kod Aset'}</span>
        </button>
        
        <button
          onClick={handleDownload}
          className="retro-btn-secondary text-xs px-2 py-1 flex items-center gap-1"
        >
          ⬇️
          <span>Muat Turun</span>
        </button>
      </div>
      {/* End: Card Actions */}

      {/* Start: Code Preview */}
      {showCode && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="retro-card-header bg-gray-700 dark:bg-gray-600 px-3 py-1 flex justify-between items-center">
            <span className="text-xs text-gray-300 pixel-font">Code Preview</span>
            <button
              onClick={() => setShowCode(false)}
              className="text-xs text-gray-400 hover:text-gray-200 pixel-font"
            >
              ✕
            </button>
          </div>
          <div className="p-3 max-h-48 overflow-y-auto">
            <pre className="whitespace-pre-wrap break-all text-xs">
              <code className="font-mono text-gray-800 dark:text-gray-200 pixel-font">
                {code}
              </code>
            </pre>
          </div>
        </div>
      )}
      {/* End: Code Preview */}

      {/* Start: Success Alert */}
      {showAlert && (
        <div 
          className="fixed bottom-4 right-4 z-50 retro-alert bg-green-500 text-white pixel-font text-xs px-4 py-2 rounded shadow-lg animate-fade-in"
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          {alertMessage}
        </div>
      )}
      {/* End: Success Alert */}
    </div>
  );
}

// Add CSS for alert animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}