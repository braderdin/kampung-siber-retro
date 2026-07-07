// Start: Imports
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
// End: Imports

// Start: Supabase Client Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// End: Supabase Client Configuration

// Start: Type Definitions
interface ProfileUpdateBoxProps {
  username: string;
  className?: string;
}

interface StatusUpdate {
  id: number;
  username: string;
  status: string;
  created_at: string;
}
// End: Type Definitions

// Start: ProfileUpdateBox Component
export default function ProfileUpdateBox({ username, className }: ProfileUpdateBoxProps) {
  // Start: State Management
  const [status, setStatus] = useState('');
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  // End: State Management

  // Start: Fetch Status Updates
  const fetchUpdates = async () => {
    const { data, error } = await supabase
      .from('status_updates')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false });

    if (data) {
      setUpdates(data as StatusUpdate[]);
    }
  };

  // Start: Load Updates on Mount
  useEffect(() => {
    fetchUpdates();
  }, [username]);
  // End: Load Updates on Mount

  // Start: Handle Status Submission
  const handleSubmitStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.trim()) {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('status_updates').insert({
          username,
          status: status.trim(),
          created_at: new Date().toISOString(),
        }).select();

        if (data) {
          setUpdates([data[0] as StatusUpdate, ...updates]);
          setStatus('');
        }
      } catch (err) {
        console.error('Error updating status:', err);
      } finally {
        setLoading(false);
      }
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
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="retro-btn-primary text-xs"
            >
              {loading ? 'Hantar...' : 'Hantar'}
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
            updates.map((update) => (
              <div key={update.id} className="p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                <p className="text-xs text-gray-700 dark:text-gray-300">{update.status}</p>
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
