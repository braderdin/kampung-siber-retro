'use client';

// Start: Imports
import { useMemo, useState } from 'react';
import CrtThemeController from '@/components/CrtThemeController';
import RetroHitCounter from '@/components/RetroHitCounter';
import RetroTerminalWidget from '@/components/RetroTerminalWidget';
import TutorialCard from '@/components/TutorialCard';
// End: Imports

// Start: Type Definitions
interface Tutorial {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  completed: boolean;
}

interface TutorialsPageProps {
  className?: string;
}
// End: Type Definitions

// Start: TutorialsPage Component
export default function TutorialsPage({ className }: TutorialsPageProps) {
  // Start: State Management
  // Dynamic container component injected: static tutorials index array has been stripped.
  // TODO: Fetch dynamic tutorial modules from API/Zustand store.
  const [tutorials] = useState<Tutorial[]>([]);
  const [filter, setFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  // End: State Management

  // Start: Progress Metrics
  const completedCount = useMemo(() => tutorials.filter((tutorial) => tutorial.completed).length, [tutorials]);
  const progressPercent = tutorials.length > 0 ? Math.round((completedCount / tutorials.length) * 100) : 0;
  const filteredTutorials = tutorials.filter((tutorial) => filter === 'all' || tutorial.difficulty === filter);
  // End: Progress Metrics

  // Start: Category Filter Glow Sync
  const getCategoryGlow = (category: string) => {
    const glows: Record<string, string> = {
      HTML: 'border-emerald-500',
      CSS: 'border-amber-500',
      JavaScript: 'border-sky-500',
      'Reka Bentuk': 'border-rose-500',
      Audio: 'border-cyan-500',
    };
    return glows[category] || 'border-pink-500';
  };
  // End: Category Filter Glow Sync

  // Start: Render Tutorials Page
  return (
    <div className={`p-4 ${className || ''}`}>
      <div className="retro-title-bar mb-4 flex items-center justify-between px-3 py-2">
        <h2 className="text-lg font-bold text-white">📚 Siri Tutorial</h2>
        <CrtThemeController className="hidden sm:inline-flex" />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="retro-window border-2 border-pink-500 bg-white p-3 retro-shadow">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">Peta Kursus</h3>
            <span className="rounded bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-700">Kemajuan {progressPercent}%</span>
          </div>
          <p className="mb-3 text-xs leading-relaxed text-gray-600">
            Navigasi Siri Tutorial dengan penunjuk kemajuan yang bersih bagi setiap modul retro yang disusun.
          </p>
          <div className="h-2 rounded bg-gray-200">
            <div className="h-2 rounded bg-emerald-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-gray-500">{completedCount} daripada {tutorials.length} modul siap.</p>
        </div>
<div className="space-y-3">
           <RetroHitCounter value={1200 + completedCount * 340} label="Kaunter Pelawat" />
           <RetroTerminalWidget />
         </div>
      </div>

      <div className="retro-window border-2 border-pink-500 bg-white p-3 retro-shadow">
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded px-3 py-1 text-xs border-2 transition-all duration-300 ${
              filter === 'all'
                ? 'bg-pink-500 text-white border-pink-500'
                : 'border-pink-500 bg-pink-50 hover:bg-pink-100'
            }`}
            style={filter === 'all' ? { boxShadow: '0 0 10px rgba(255,0,127,0.5)' } : undefined}
          >
            Semua Siri
          </button>
          <button
            onClick={() => setFilter('Beginner')}
            className={`rounded px-3 py-1 text-xs border-2 transition-all duration-300 ${
              filter === 'Beginner'
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100'
            }`}
            style={filter === 'Beginner' ? { boxShadow: '0 0 10px rgba(0,255,102,0.5)' } : undefined}
          >
            Pemula
          </button>
          <button
            onClick={() => setFilter('Intermediate')}
            className={`rounded px-3 py-1 text-xs border-2 transition-all duration-300 ${
              filter === 'Intermediate'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'border-amber-500 bg-amber-50 hover:bg-amber-100'
            }`}
            style={filter === 'Intermediate' ? { boxShadow: '0 0 10px rgba(255,170,0,0.5)' } : undefined}
          >
            Pertengahan
          </button>
          <button
            onClick={() => setFilter('Advanced')}
            className={`rounded px-3 py-1 text-xs border-2 transition-all duration-300 ${
              filter === 'Advanced'
                ? 'bg-rose-500 text-white border-rose-500'
                : 'border-rose-500 bg-rose-50 hover:bg-rose-100'
            }`}
            style={filter === 'Advanced' ? { boxShadow: '0 0 10px rgba(255,0,85,0.5)' } : undefined}
          >
            Lanjutan
          </button>
        </div>
        <p className="text-xs text-gray-600">Menunjukkan {filteredTutorials.length} daripada {tutorials.length} modul.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filteredTutorials.length > 0 ? (
          filteredTutorials.map((tutorial) => (
            <TutorialCard
              key={tutorial.id}
              title={tutorial.title}
              description={tutorial.description}
              difficulty={tutorial.difficulty}
              category={tutorial.category}
              completed={tutorial.completed}
              onStart={() => alert(`Memulakan ${tutorial.title}`)}
            />
          ))
        ) : (
          <div className="retro-window border-2 border-pink-500 bg-white p-4 text-center retro-shadow md:col-span-2">
            <p className="text-sm text-gray-500">Tiada modul yang sepadan dengan penapis yang dipilih.</p>
          </div>
        )}
      </div>
    </div>
  );
}
// End: TutorialsPage Component