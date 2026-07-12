"use client";

import { useState, useEffect } from 'react';

interface MuseumArtifact {
  id: string;
  title: string;
  era: string;
  description: string;
  imagePlaceholder: string;
  codeSnippet: string;
  historicalSignificance: string;
}

interface CyberMuseumArchiveProps {
  artifacts?: MuseumArtifact[];
  className?: string;
  onArtifactClick?: (artifact: MuseumArtifact) => void;
}

// Start: Dynamic Artifacts Placeholder
// TODO: Fetch dynamic museum artifacts from API/Zustand store.
// Static mock records within DEFAULT_ARTIFACTS have been purged to prepare clean database sync hooks.
const DEFAULT_ARTIFACTS: MuseumArtifact[] = [];
// End: Dynamic Artifacts Placeholder

export default function CyberMuseumArchive({
  artifacts = DEFAULT_ARTIFACTS,
  className,
  onArtifactClick
}: CyberMuseumArchiveProps) {
  const [isClient, setIsClient] = useState(false);
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedArtifact, setSelectedArtifact] = useState<MuseumArtifact | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const eras = ['all', '1980-an', '1990-an', '1995', '2000-an'];

  const filteredArtifacts = artifacts.filter(artifact => {
    const matchesEra = selectedEra === 'all' || artifact.era.includes(selectedEra.replace('-an', ''));
    const matchesSearch = searchTerm.toLowerCase() === '' ||
      artifact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artifact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artifact.historicalSignificance.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEra && matchesSearch;
  });

  const handleArtifactClick = (artifact: MuseumArtifact) => {
    setSelectedArtifact(artifact);
    setShowModal(true);
    onArtifactClick?.(artifact);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArtifact(null);
  };

  const getEraColor = (era: string): string => {
    if (era.includes('1980')) return 'border-orange-400 bg-orange-50/50';
    if (era.includes('1990')) return 'border-purple-400 bg-purple-50/50';
    if (era.includes('1995')) return 'border-blue-400 bg-blue-50/50';
    if (era.includes('2000')) return 'border-green-400 bg-green-50/50';
    return 'border-gray-400 bg-gray-50/50';
  };

  const getEraBadgeColor = (era: string): string => {
    if (era.includes('1980')) return 'bg-orange-500 text-white';
    if (era.includes('1990')) return 'bg-purple-500 text-white';
    if (era.includes('1995')) return 'bg-blue-500 text-white';
    if (era.includes('2000')) return 'bg-green-500 text-white';
    return 'bg-gray-500 text-white';
  };

  if (!isClient) {
    return (
      <div className={`cyber-museum-archive ${className || ''}`}>
        <div className="retro-card p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className={`cyber-museum-archive ${className || ''}`}>
      {/* Start: Filter Controls */}
      <div className="retro-card mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Cari artifak..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="retro-input flex-1"
          />
          <select
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            className="retro-input w-auto"
          >
            <option value="all">Semua Era</option>
            {eras.slice(1).map(era => (
              <option key={era} value={era}>{era}</option>
            ))}
          </select>
        </div>
      </div>
      {/* End: Filter Controls */}

      {/* Start: Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredArtifacts.length === 0 ? (
          <div className="retro-card text-center py-8 col-span-full">
            <p className="text-gray-500 dark:text-gray-400 pixel-font mb-4">
              {/* Start: Linguistic Cleanup - Tiada artefak yang padu mapped to Tiada artifak yang sepadan */}
              Tiada artifak yang sepadan dengan carian anda.
              {/* End: Linguistic Cleanup */}
            </p>
          </div>
        ) : (
          filteredArtifacts.map((artifact, index) => (
            <div
              key={artifact.id}
              onClick={() => handleArtifactClick(artifact)}
              className="masonry-item cursor-pointer transform transition-all duration-300 hover:scale-102 hover:shadow-xl"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <div className={`retro-card border-2 ${getEraColor(artifact.era)}`}>
                {/* Start: Card Header */}
                <div className="retro-card-header bg-gray-100/80 dark:bg-gray-800/80 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font break-words">
                    {artifact.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${getEraBadgeColor(artifact.era)} ml-auto`}>
                    {artifact.era}
                  </span>
                </div>
                {/* End: Card Header */}

                {/* Start: Card Content */}
                <div className="p-3">
                  <div className="text-3xl mb-2">{artifact.imagePlaceholder}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 pixel-font mb-3 line-clamp-3">
                    {artifact.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                    {artifact.historicalSignificance.substring(0, 80)}...
                  </div>
                </div>
                {/* End: Card Content */}

                {/* Start: Card Footer */}
                <div className="retro-card-footer bg-gray-50/80 dark:bg-gray-800/80 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                    {/* Start: Linguistic Cleanup - Klik untuk lihat detail mapped to Klik untuk lihat butiran */}
                    Klik untuk lihat butiran
                    {/* End: Linguistic Cleanup */}
                  </span>
                </div>
                {/* End: Card Footer */}
              </div>
            </div>
          ))
        )}
      </div>
      {/* End: Masonry Grid */}

      {/* Start: Modal Overlay */}
      {showModal && selectedArtifact && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="retro-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font">
                {selectedArtifact.title}
              </h3>
              <button
                onClick={closeModal}
                className="retro-btn-secondary text-xs px-2 py-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-4xl text-center">{selectedArtifact.imagePlaceholder}</div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 pixel-font mb-2">
                  Perihak
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 pixel-font leading-relaxed">
                  {selectedArtifact.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 pixel-font mb-2">
                  Kesan Sejarah
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 pixel-font leading-relaxed">
                  {selectedArtifact.historicalSignificance}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 pixel-font mb-2">
                  Kod Contoh
                </h4>
                <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-600">
                  <pre className="whitespace-pre-wrap break-all text-xs font-mono text-gray-800 dark:text-gray-200 pixel-font">
                    {selectedArtifact.codeSnippet}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End: Modal Overlay */}

      {/* Start: Custom Styles */}
      <style jsx>{`
        .masonry-item {
          break-inside: avoid;
        }

        @media (hover: none) and (pointer: coarse) {
          .masonry-item {
            break-inside: avoid;
          }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      {/* End: Custom Styles */}
    </div>
  );
}