// Start: Theme Showcase Component
"use client";

import { useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

interface Theme {
  id: ThemeId;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

type ThemeId = "space-neon" | "windows-gray" | "retro-matrix";

const themes: Theme[] = [
  {
    id: 'space-neon',
    name: 'space-neon',
    displayName: 'Space',
    description: 'Deep space aesthetic with cosmic blues and dark backgrounds',
    icon: '🌌',
    colors: {
      primary: 'bg-indigo-600',
      secondary: 'bg-blue-500',
      accent: 'bg-cyan-500',
      background: 'bg-gray-900',
    },
  },
  {
    id: 'windows-gray',
    name: 'windows-gray',
    displayName: 'Gray',
    description: 'Neutral grayscale with clean, professional appearance',
    icon: '⚪',
    colors: {
      primary: 'bg-gray-600',
      secondary: 'bg-gray-500',
      accent: 'bg-gray-400',
      background: 'bg-gray-100',
    },
  },
  {
    id: 'retro-matrix',
    name: 'retro-matrix',
    displayName: 'Matrix',
    description: 'Classic green code on black terminal style',
    icon: '💚',
    colors: {
      primary: 'bg-green-700',
      secondary: 'bg-green-600',
      accent: 'bg-green-500',
      background: 'bg-black',
    },
  },
];

// Helper function to check if style prop should be applied
function getThemeCardStyle(selected: boolean): React.CSSProperties | undefined {
  if (selected) {
    return { boxShadow: '4px 4px 0 0 rgba(255,255,0,0.3)' };
  }
  return undefined;
}

// Helper function to check if hover style should be applied
function getThemeHoverStyle(selected: boolean): React.CSSProperties | undefined {
  if (!selected) {
    return { boxShadow: '4px 4px 0 0 rgba(0,0,0,0.2)' };
  }
  return undefined;
}

export default function ThemeShowcase() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('space-neon');
  const { currentTheme, setTheme } = useThemeStore();

  const handleThemeSelect = (themeId: ThemeId) => {
    setSelectedTheme(themeId);
    setTheme(themeId);
  };

  const getThemeCardClasses = (theme: Theme) => {
    const baseClasses = "retro-card border-2 rounded-none p-4 cursor-pointer transition-all duration-300";
    
    if (selectedTheme === theme.id) {
      return `${baseClasses} border-pink-400 scale-105`;
    }
    
    return `${baseClasses} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900`;
  };

  return (
    <div className="theme-showcase">
      {/* Start: Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 pixel-font mb-2">
          🎨 Available Themes
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Choose your preferred aesthetic
        </p>
      </div>
      {/* End: Header */}

      {/* Start: Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={getThemeCardClasses(theme)}
            style={getThemeCardStyle(selectedTheme === theme.id)}
            onClick={() => handleThemeSelect(theme.id)}
          >
            {/* Start: Theme Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{theme.icon}</span>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 pixel-font text-lg">
                  {theme.displayName}
                </h3>
              </div>
              {selectedTheme === theme.id && (
                <span className="text-pink-500 text-sm pixel-font">✓ Selected</span>
              )}
            </div>
            {/* End: Theme Header */}

            {/* Start: Theme Preview */}
            <div className="mb-3">
              <div className="flex gap-1 rounded overflow-hidden">
                <div className={`w-4 h-4 ${theme.colors.primary}`}></div>
                <div className={`w-4 h-4 ${theme.colors.secondary}`}></div>
                <div className={`w-4 h-4 ${theme.colors.accent}`}></div>
                <div className={`w-4 h-4 ${theme.colors.background}`}></div>
              </div>
            </div>
            {/* End: Theme Preview */}

            {/* Start: Theme Description */}
            <p className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
              {theme.description}
            </p>
            {/* End: Theme Description */}

            {/* Start: Apply Button */}
            <button
              onClick={() => handleThemeSelect(theme.id)}
              className={`
                w-full mt-3 py-1.5 px-3 rounded font-mono text-xs font-bold
                ${selectedTheme === theme.id 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-pink-400/20 text-pink-600 dark:text-pink-400 hover:bg-pink-400/30'
                }
                transition-all duration-200
              `}
            >
              {selectedTheme === theme.id ? 'Applied ✓' : 'Apply Theme'}
            </button>
            {/* End: Apply Button */}
          </div>
        ))}
      </div>
      {/* End: Theme Grid */}

      {/* Start: Current Theme Indicator */}
      <div className="mt-6 p-4 retro-terminal bg-black border-2 border-cyan-500 rounded-none text-center">
        <div className="text-xs text-gray-400 font-mono mb-1">
          CURRENT THEME
        </div>
        <div className="text-lg font-bold text-cyan-400 pixel-font">
          {themes.find(t => t.id === currentTheme)?.displayName || 'Space'}
        </div>
      </div>
      {/* End: Current Theme Indicator */}
    </div>
  );
}
// End: Theme Showcase Component