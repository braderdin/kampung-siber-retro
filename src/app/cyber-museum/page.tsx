// Start: Cyber Museum Page with Empty State
"use client";

import { useState, useEffect } from 'react';
import CyberMuseumArchive from '@/components/CyberMuseumArchive';
import PixelCursorEffect from '@/components/PixelCursorEffect';
import HydrationGuard from '@/components/HydrationGuard';
import Win95DialogEmptyState from '@/components/ui/Win95DialogEmptyState';

// Start: Empty Collection Placeholder
const EMPTY_COLLECTION: MuseumArtifact[] = [];
// End: Empty Collection Placeholder

interface MuseumArtifact {
  id: string;
  title: string;
  era: string;
  description: string;
  imagePlaceholder: string;
  codeSnippet: string;
  historicalSignificance: string;
}

export default function CyberMuseumPage() {
  const [isClient, setIsClient] = useState(false);
  const [artifacts, setArtifacts] = useState<MuseumArtifact[]>([]);

  useEffect(() => {
    setIsClient(true);
    // Load from actual data source or keep empty for empty state demonstration
    setArtifacts(EMPTY_COLLECTION);
  }, []);

  const handleArtifactClick = (artifact: MuseumArtifact) => {
    console.log('Artifact clicked:', artifact.title);
  };

  if (!isClient) {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
        </div>
      </main>
    );
  }

  return (
    // Start: Main Container
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-16">
      <PixelCursorEffect />

      {/* Start: Header Section with Retro Dashed Borders */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-md border-b-2 border-dashed border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-cyan-400 pixel-font flex items-center gap-3">
            <span className="text-4xl">🏛️</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-300">
              Muzium Khazanah Siber
            </span>
          </h1>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-1 pixel-font border-l-2 border-dashed border-pink-400/50 pl-3">
            Arkib sejarah internet kami - 56k, mIRC, dan lagu latar
          </p>
        </div>
      </div>
      {/* End: Header Section */}

      {/* Start: Museum Gallery with Empty State Injection */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HydrationGuard>
          {artifacts.length === 0 ? (
            // Start: Win95 Empty State for No Artifacts
            <Win95DialogEmptyState 
              message="Tiada artifak yang telah dikatalog buat masa ini. Wargalaya dijemput untuk menyumbang benda-benda sejarah digital!"
            />
            // End: Win95 Empty State for No Artifacts
          ) : (
            <CyberMuseumArchive
              artifacts={artifacts}
              onArtifactClick={handleArtifactClick}
            />
          )}
        </HydrationGuard>
      </div>
      {/* End: Museum Gallery */}

      {/* Start: Museum Notes Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="retro-card border-2 border-dashed border-purple-400/30">
          <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span>Nota Sejarah</span>
            </h2>
          </div>
          <div className="p-4">
            <div className="text-sm text-gray-700 dark:text-gray-300 pixel-font space-y-3 border-l-2 border-dashed border-cyan-400 pl-4">
              <p>
                <strong>56k Dial-Up:</strong> Kelajuan pautan dial-up 56k melambatkan muat turun tetapi membuka pintu ke internet global.
              </p>
              <p>
                <strong>mIRC & IRC:</strong> Internet Relay Chat membolehkan komunikasi langsung dalam bilik perbincangan.
              </p>
              <p>
                <strong>Geocities & Tripod:</strong> Perkhidmatan ini membolehkan pengguna membuat laman web percuma dengan ruang penyimpanan terhad.
              </p>
              <p>
                <strong>BBS & FidoNet:</strong> Sistem bulletin board adalah asas komuniti talian sebelum internet komersial.
              </p>
              <p className="border-t-2 border-dashed border-pink-400/30 pt-3">
                <strong>Kesedaran:</strong> Klik pada setiap artifak untuk melihat detail sejarahnya dengan mod interaktif.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* End: Museum Notes Section */}
    </main>
    // End: Main Container
  );
}
// End: Cyber Museum Page with Empty State