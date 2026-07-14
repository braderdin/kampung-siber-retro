'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import HydrationGuard from '@/components/HydrationGuard';

interface MuseumExhibit {
  id: string;
  title: string;
  description: string;
  era: string;
  imagePlaceholder: string;
  artifacts: string[];
  year?: number;
  rarity: 'common' | 'rare' | 'legendary';
}

const MUSEUM_EXHIBITS: MuseumExhibit[] = [
  {
    id: 'dialup-modem-1995',
    title: 'Pemodem Dial-Up 1995',
    description: 'Pemodem pemampat data asli dari tahun 1990-an, membolehkan sambungan internet melalui telefon rangkaian. Kelajuan maksimum 56kbps.',
    era: 'Era Dial-Up',
    imagePlaceholder: '🖥️',
    artifacts: ['Kabel telefon analog', 'Modem 56k', 'Manual penggunaan', 'Catatan log sambungan'],
    year: 1995,
    rarity: 'legendary'
  },
  {
    id: 'floppy-disk-set',
    title: 'Set Disket 3.5-inch',
    description: 'Kumpulan disket fleksibel berwarna-warni yang menyimpan data penting pada zaman sebelum hard drive banyak digunakan.',
    era: 'Pre-Digital',
    imagePlaceholder: '💾',
    artifacts: ['Disket 1.44MB', 'Drive eksternal', 'Stiker label', 'Dokumentasi data'],
    year: 1998,
    rarity: 'rare'
  },
  {
    id: 'windows-95-wallpaper',
    title: 'Latar Belakang Windows 95',
    description: 'Gambar latar belakang ikonik "Bilangan" dan "Peacock" yang menjadi saksi kehadiran komputer rumah pada masa itu.',
    era: 'Windows Era',
    imagePlaceholder: '🖼️',
    artifacts: ['File BMP asli', 'Kod warna palet 256', 'Screengrab', 'Catatan penggunaan'],
    year: 1995,
    rarity: 'common'
  },
  {
    id: 'pixel-art-collection',
    title: 'Koleksi Seni Pixel 16-bit',
    description: 'Karya seni pixel yang ditulis secara manual pada editor teks, memaparkan karakter ASCII dan Unicode untuk mencipta karya seni digital.',
    era: 'Pixel Art Golden Age',
    imagePlaceholder: '🎨',
    artifacts: ['Gambar ASCII', 'Generator teks', 'Kamus karakter', 'Dokumentasi proses'],
    year: 2002,
    rarity: 'rare'
  },
  {
    id: 'winamp-skin-archive',
    title: 'Arkib Paparan Winamp',
    description: 'Koleksi paparan kustom untuk pemain audio Winamp popular, termasuk tema neon, futuristik, dan retro.',
    era: 'Media Player Culture',
    imagePlaceholder: '🎵',
    artifacts: ['File .wsz', 'Pemetaan warna', 'ikon kustom', 'Instruksi pemasangan'],
    year: 2001,
    rarity: 'common'
  },
  {
    id: 'siber-history-docs',
    title: 'Dokumen Sejarah Siber Kampung',
    description: 'Dokumen-dokumen penting yang mengawal perkembangan komuniti digital kampung siber, termasuk dasar, panduan, dan rekod pendaftaran.',
    era: 'Kampung Siber Founding',
    imagePlaceholder: '📜',
    artifacts: ['Akta pendaftaran', 'Panduan pengguna', 'Versi log perisian', 'Surat cadangan'],
    year: 2023,
    rarity: 'legendary'
  },
  {
    id: 'retro-game-cartridge',
    title: 'Kartridge Permainan Retro',
    description: 'Kartridge game klasik dengan tema kampung dan cyberpunk yang dapat dimuat dalam emulater.',
    era: 'Gaming Heritage',
    imagePlaceholder: '🕹️',
    artifacts: ['Kod binari', 'Pemetaan kontrol', 'Skrip permainan', 'Catatan debugging'],
    year: 2020,
    rarity: 'common'
  },
  {
    id: 'neon-badge-collection',
    title: 'Pengekodan Neon Digital',
    description: 'Koleksi pengekodan neon dengan kesan cahaya yang digunakan untuk antara muka pengguna kampung.',
    era: 'Cyberpunk UI',
    imagePlaceholder: '⚡',
    artifacts: ['CSS keyframes', 'CSS variables', 'HTML struktur', 'Demo interaktif'],
    year: 2024,
    rarity: 'legendary'
  }
];

export default function MuziumPage() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const [selectedExhibit, setSelectedExhibit] = useState<MuseumExhibit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEra, setSelectedEra] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');

  const eras = ['All', 'Era Dial-Up', 'Pre-Digital', 'Windows Era', 'Pixel Art Golden Age', 'Media Player Culture', 'Kampung Siber Founding', 'Gaming Heritage', 'Cyberpunk UI'];
  const rarities = ['All', 'common', 'rare', 'legendary'];

  const filteredExhibits = MUSEUM_EXHIBITS.filter(exhibit => {
    const matchesSearch = exhibit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exhibit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exhibit.artifacts.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesEra = selectedEra === 'All' || exhibit.era === selectedEra;
    const matchesRarity = selectedRarity === 'All' || exhibit.rarity === selectedRarity;
    
    return matchesSearch && matchesEra && matchesRarity;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-400 bg-purple-900/20 border-purple-500';
      case 'rare': return 'text-blue-400 bg-blue-900/20 border-blue-500';
      case 'common': return 'text-green-400 bg-green-900/20 border-green-500';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500';
    }
  };

  const getRarityLabel = (rarity: string) => {
    const labels: Record<string, string> = {
      legendary: language === 'ms' ? 'Legendaran' : 'Legendary',
      rare: language === 'ms' ? 'Jarang' : 'Rare',
      common: language === 'ms' ? 'Biasa' : 'Common'
    };
    return labels[rarity] || rarity;
  };

  return (
    <HydrationGuard>
      <main className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Start: Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white dark:text-gray-100 pixel-font mb-2 flex items-center justify-center gap-3">
              <span className="text-5xl">🏛️</span>
              <span>Muzium Khazanah Siber</span>
            </h1>
            <p className="text-gray-300 dark:text-gray-400 pixel-font text-sm">
              {language === 'ms' 
                ? 'Arkib bersejarah digital kampung siber retro' 
                : 'Digital heritage archive of retro cyber village'}
            </p>
          </div>
          {/* End: Header */}

          {/* Start: Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={language === 'ms' ? 'Cari galeri...' : 'Search exhibits...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pixel-font text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pixel-font text-sm focus:ring-2 focus:ring-purple-500"
            >
              {eras.map(era => (
                <option key={era} value={era}>{era}</option>
              ))}
            </select>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pixel-font text-sm focus:ring-2 focus:ring-purple-500"
            >
              {rarities.map(rarity => (
                <option key={rarity} value={rarity}>{getRarityLabel(rarity)}</option>
              ))}
            </select>
          </div>
          {/* End: Search and Filters */}

          {/* Start: Exhibit Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExhibits.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 dark:text-gray-500 pixel-font">
                  {language === 'ms' 
                    ? 'Tiada galeri yang sepadan' 
                    : 'No matching exhibits found'}
                </p>
              </div>
            ) : (
              filteredExhibits.map(exhibit => (
                <MuseumExhibitCard
                  key={exhibit.id}
                  exhibit={exhibit}
                  onSelect={() => setSelectedExhibit(exhibit)}
                  getRarityColor={getRarityColor}
                  getRarityLabel={getRarityLabel}
                />
              ))
            )}
          </div>
          {/* End: Exhibit Grid */}

          {/* Start: Stats */}
          <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500 pixel-font">
            <p>
              {language === 'ms' ? 'Menunjukkan' : 'Showing'} {filteredExhibits.length} {language === 'ms' ? 'dari' : 'of'} {MUSEUM_EXHIBITS.length} {language === 'ms' ? 'galeri' : 'exhibits'}
            </p>
          </div>
          {/* End: Stats */}
        </div>
      </main>
    </HydrationGuard>
  );
}

interface MuseumExhibitCardProps {
  exhibit: MuseumExhibit;
  onSelect: () => void;
  getRarityColor: (rarity: string) => string;
  getRarityLabel: (rarity: string) => string;
}

function MuseumExhibitCard({ exhibit, onSelect, getRarityColor, getRarityLabel }: MuseumExhibitCardProps) {
  const { language } = useLanguageStore();
  
  return (
    <div 
      onClick={onSelect}
      className="retro-museum-card retro-window-client rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{exhibit.imagePlaceholder}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 pixel-font">
              {exhibit.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded pixel-font ${getRarityColor(exhibit.rarity)}`}>
              {getRarityLabel(exhibit.rarity)}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 pixel-font mb-2">
            {exhibit.description.substring(0, 80)}...
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-500 pixel-font">
            {exhibit.era} {exhibit.year && `• ${exhibit.year}`}
          </div>
        </div>
      </div>
    </div>
  );
}
