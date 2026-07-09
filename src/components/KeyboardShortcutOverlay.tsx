"use client";

import { useState, useEffect, useCallback } from 'react';

interface Shortcut {
  key: string;
  action: string;
  description: string;
}

const shortcuts: Shortcut[] = [
  { key: 'H', action: 'Toggle Help', description: 'Show keyboard shortcuts' },
  { key: 'D', action: 'Dashboard', description: 'Go to dashboard' },
  { key: 'C', action: 'Contact', description: 'Open contact page' },
  { key: 'S', action: 'Search', description: 'Focus search' },
  { key: 'T', action: 'Themes', description: 'View available themes' },
  { key: '?', action: 'Help', description: 'Show this overlay' },
  { key: 'ESC', action: 'Close', description: 'Close current modal' },
];

export default function KeyboardShortcutOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const openOverlay = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeOverlay = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H' || (e.key === '?' && e.shiftKey)) {
        e.preventDefault();
        openOverlay();
      } else if (e.key === 'Escape' || e.key === 'Esc') {
        closeOverlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClient, openOverlay, closeOverlay]);

  return (
    <>
      {/* Start: Global Keyboard Listener (hidden) */}
      <div 
        className="fixed top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'h' || e.key === 'H' || (e.key === '?' && e.shiftKey)) {
            setIsOpen(true);
          }
        }}
      />
      {/* End: Global Keyboard Listener */}

      {/* Start: Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeOverlay}
        >
          <div 
            className="relative retro-card border-2 border-cyan-500 bg-white dark:bg-gray-900 rounded-none 
                         w-full max-w-lg mx-4 p-8 shadow-[10px_10px_0_0_rgba(0,0,0,0.5)]
                         animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Start: Close Button */}
            <button
              onClick={closeOverlay}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              title="Close"
            >
              ✕
            </button>
            {/* End: Close Button */}

            {/* Start: Modal Content */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 pixel-font mb-2">
                ⌨️ Keyboard Shortcuts
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Press the keys to navigate faster
              </p>
            </div>
            {/* End: Modal Content */}

            {/* Start: Shortcuts List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {shortcuts.map((shortcut, index) => (
                <div 
                  key={shortcut.key}
                  className="retro-card border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-none p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 dark:text-gray-100 pixel-font">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-yellow-300 border border-yellow-400 rounded font-mono text-xs font-bold text-gray-900">
                        {shortcut.key}
                      </kbd>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {shortcut.action}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* End: Shortcuts List */}

            {/* Start: Footer */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono text-xs">H</kbd> or <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono text-xs">?</kbd> to open this help
              </p>
            </div>
            {/* End: Footer */}
          </div>
        </div>
      )}
      {/* End: Modal Overlay */}

      {/* Start: Custom Styles */}
      <style jsx>{`
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
      {/* End: Custom Styles */}
    </>
  );
}