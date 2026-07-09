"use client";

import { useState } from 'react';

interface MuseumExhibitCardProps {
  id: string;
  title: string;
  era: string;
  description: string;
  imagePlaceholder: string;
  codeSnippet: string;
  historicalSignificance: string;
}

export default function MuseumExhibitCard({
  id,
  title,
  era,
  description,
  imagePlaceholder,
  codeSnippet,
  historicalSignificance
}: MuseumExhibitCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getEraColor = (era: string): string => {
    if (era.includes('1980')) return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300';
    if (era.includes('1990')) return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300';
    if (era.includes('1995')) return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
    return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300';
  };

  return (
    <div 
      className={`
        museum-exhibit-card
        retro-card
        border-2 border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-out
        ${isHovered ? 'shadow-xl scale-102 rotate-1' : 'shadow-md'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {/* Start: Card Header */}
      <div className="retro-card-header bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 pixel-font break-words">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span 
            className={`text-xs px-2 py-0.5 rounded pixel-font ${getEraColor(era)}`}
          >
            {era}
          </span>
        </div>
      </div>
      {/* End: Card Header */}

      {/* Start: Card Image/Illustration */}
      <div className="p-4 bg-white dark:bg-gray-900">
        <div className="retro-illustration bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded p-4 mb-3 text-center">
          <div className="text-4xl mb-2">{imagePlaceholder}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            {description}
          </p>
        </div>

        {/* Start: Toggle Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="retro-btn-secondary text-xs w-full mb-3"
        >
          {showDetails ? '🔍 Tutup' : '👁️ Lihat Detail'}
        </button>
        {/* End: Toggle Details Button */}

        {/* Start: Detailed Content */}
        {showDetails && (
          <div className="retro-details border-t border-gray-200 dark:border-gray-700 pt-3">
            {/* Historical Significance */}
            <div className="mb-3">
              <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 pixel-font mb-1">
                Kesan Sejarah
              </h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 pixel-font leading-relaxed">
                {historicalSignificance}
              </p>
            </div>

            {/* Code Snippet */}
            <div className="mb-3">
              <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 pixel-font mb-1">
                Kod Contoh
              </h4>
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-600">
                <pre className="whitespace-pre-wrap break-all text-xs font-mono text-gray-800 dark:text-gray-200 pixel-font">
                  {codeSnippet}
                </pre>
              </div>
            </div>
          </div>
        )}
        {/* End: Detailed Content */}
      </div>

      {/* Start: Footer Actions */}
      <div className="retro-card-footer bg-gray-50 dark:bg-gray-800 px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
          Museum Khazanah
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => navigator.clipboard.writeText(codeSnippet)}
            className="retro-btn-secondary text-xs px-2 py-0.5"
            title="Salin kod"
          >
            📋
          </button>
          <button
            onClick={() => {
              alert('Terima kasih untuk menilai artefak ini!');
            }}
            className="retro-btn-secondary text-xs px-2 py-0.5"
            title="Tagih"
          >
            ⭐
          </button>
        </div>
      </div>
      {/* End: Footer Actions */}

      {/* Start: Hover Effect Styles */}
      <style jsx>{`
        @keyframes paperTilt {
          0% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1); }
          100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1); }
        }
        
        .museum-exhibit-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        @media (hover: none) and (pointer: coarse) {
          .museum-exhibit-card:active {
            transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) scale(0.98);
          }
        }
      `}</style>
      {/* End: Hover Effect Styles */}
    </div>
  );
}