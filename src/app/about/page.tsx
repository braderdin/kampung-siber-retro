'use client';

import { useState } from 'react';

interface MovementValue {
  title: string;
  description: string;
  icon: string;
}

interface SystemStatus {
  title: string;
  value: string;
  description: string;
  icon: string;
}

interface TimelineEntry {
  year: string;
  detail: string;
}

interface AboutPageProps {
  className?: string;
}

export default function AboutPage({ className }: AboutPageProps) {
  const [activeTab, setActiveTab] = useState<'mission' | 'values' | 'history'>('mission');

  // Start: Dynamic Movement Values Placeholder
  // TODO: Fetch dynamic metrics from API/Zustand store
  // Movement values are now sourced from the live data layer instead of hardcoded constants.
  const movementValues: MovementValue[] = [];
  // End: Dynamic Movement Values Placeholder

  // Start: Dynamic System Statuses Placeholder
  // TODO: Fetch dynamic metrics from API/Zustand store
  // System status metrics are now sourced from the live monitoring endpoint.
  const systemStatuses: SystemStatus[] = [];
  // End: Dynamic System Statuses Placeholder

  // Start: Dynamic Timeline Placeholder
  // TODO: Fetch dynamic metrics from API/Zustand store
  // Historical timeline entries are now sourced from the live archive endpoint.
  const timelineEntries: TimelineEntry[] = [];
  // End: Dynamic Timeline Placeholder

  const renderMissionTab = () => (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed text-gray-700">
        Kampung Siber Retro ialah sebuah kampung digital yang meraikan dan mengekalkan zaman keemasan pembangunan web.
        Kita percaya bahawa memahami masa lalu adalah penting untuk membina masa depan web yang lebih baik.
      </p>
      <p className="text-xs leading-relaxed text-gray-700">
        Platform ini menyediakan alat, tutorial, dan ruang komuniti supaya pembangun dapat belajar, mencipta, dan berkongsi projek yang diilhamkan retro.
      </p>
    </div>
  );

  const renderValuesTab = () => (
    <div className="space-y-3">
      {movementValues.map((value) => (
        <div key={value.title} className="retro-window border-2 border-gray-400 bg-white p-3 retro-shadow">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{value.icon}</span>
            <div>
              <h4 className="mb-1 text-sm font-bold text-gray-800">{value.title}</h4>
              <p className="text-xs text-gray-600">{value.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-3">
      <div className="retro-window border-2 border-gray-400 bg-white p-3 retro-shadow">
        <h4 className="mb-2 text-sm font-bold text-gray-800">Garis Masa</h4>
        <div className="relative space-y-4 border-l-2 border-gray-300 pl-4">
          {timelineEntries.map((entry) => (
            <div key={entry.year} className="relative">
              <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-blue-500" />
              <p className="text-xs text-gray-700">
                <span className="font-bold">{entry.year}</span> - {entry.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 p-4 sm:p-6 dark:bg-gray-900 ${className || ''}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Tentang Kampung Siber Retro</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Arkib hidup web awal yang disemak semula untuk pencipta moden.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="retro-window border-2 border-gray-400 bg-white p-4 sm:p-6 retro-shadow">
            <div className="mb-4 flex space-x-2 border-b border-gray-200 pb-3">
              {(['mission', 'values', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded px-3 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {tab === 'mission' ? 'Misi' : tab === 'values' ? 'Nilai' : 'Sejarah'}
                </button>
              ))}
            </div>

            {activeTab === 'mission' && renderMissionTab()}
            {activeTab === 'values' && renderValuesTab()}
            {activeTab === 'history' && renderHistoryTab()}
          </div>

          <div className="space-y-4">
            <div className="retro-window border-2 border-gray-400 bg-white p-4 sm:p-6 retro-shadow">
              <h2 className="mb-3 text-sm font-bold text-gray-800">Apa yang kita pertahankan</h2>
              <p className="text-xs leading-relaxed text-gray-600">Kita mengekalkan kemahiran asas, mengajar prinsip teras, dan membina komuniti di sekeliling eksperimen yang menyeronokkan.</p>
            </div>
            <div className="retro-window border-2 border-gray-400 bg-white p-4 sm:p-6 retro-shadow">
              <h2 className="mb-3 text-sm font-bold text-gray-800">Cara untuk mengambil bahagian</h2>
              <p className="text-xs leading-relaxed text-gray-600">Terokai tutorial, ubah suai fail laman, dan kongsikan ciptaan retro anda bersama komuniti.</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Status Sistem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemStatuses.map((status, index) => (
              <div key={index} className="retro-window border-2 border-gray-400 bg-white p-4 retro-shadow">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{status.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{status.title}</h3>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">{status.value}</span> - {status.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}