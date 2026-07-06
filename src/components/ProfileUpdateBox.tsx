// Start: Imports
'use client';
import { useState } from 'react';
// End: Imports

// Start: Type Definitions
interface ProfileUpdateBoxProps {
  username: string;
  className?: string;
}
// End: Type Definitions

// Start: ProfileUpdateBox Component
export default function ProfileUpdateBox({ username, className }: ProfileUpdateBoxProps) {
  // Start: State Management
  const [status, setStatus] = useState('');
  const [updates, setUpdates] = useState<string[]>([]);
  // End: State Management

  // Start: Handle Status Submission
  const handleSubmitStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (status.trim()) {
      setUpdates([...updates, `${username}: ${status.trim()}`]);
      setStatus('');
    }
  };
  // End: Handle Status Submission

  // Start: Render ProfileUpdateBox Component
  return (
    <div className={`retro-window ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          <span className="mr-2">📡</span>
          Penerangan Profil
        </h3>
      </div>
      {/* End: Window Header */}

      {/* Start: Window Content */}
      <div className="p-3">
        {/* Start: Status Input */}
        <form onSubmit={handleSubmitStatus} className="mb-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Berikan khabar terkini anda..."
              className="flex-1 retro-input text-xs"
            />
            <button
              type="submit"
              className="retro-btn-primary text-xs"
            >
              Hantar
            </button>
          </div>
        </form>
        {/* End: Status Input */}

        {/* Start: Updates List */}
        <div className="retro-controls-grid">
          <div className="retro-control-item">
            <span className="retro-control-label">📋</span>
            <span className="retro-control-name">Senarai Khabar</span>
          </div>
        </div>
        
        <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
          {updates.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">Tiada khabar terkini</p>
          ) : (
            updates.map((update, index) => (
              <div key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                <p className="text-xs text-gray-700 dark:text-gray-300">{update}</p>
              </div>
            ))
          )}
        </div>
        {/* End: Updates List */}
      </div>
      {/* End: Window Content */}
    </div>
  );
}
// End: ProfileUpdateBox Component
