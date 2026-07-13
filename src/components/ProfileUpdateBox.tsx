// Start: Imports
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
// End: Imports

// Start: Type Definitions
interface ProfileUpdateBoxProps {
  username: string;
  userId?: string;
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
export default function ProfileUpdateBox({ username, userId, className }: ProfileUpdateBoxProps) {
  // Start: State Management
  const [status, setStatus] = useState('');
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  // End: State Management

  // Start: Fetch Status Updates
  const fetchUpdates = async () => {
    const { data, error: fetchErr } = await supabase
      .from('status_updates')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false });

    if (fetchErr) {
      setError('Gagal memuat khabar terkini.');
      return;
    }
    if (data) {
      setUpdates(data as StatusUpdate[]);
    }
  };
  // End: Fetch Status Updates

  // Start: Enforce Session Check Before Allowing Inserts
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      const hasSession = Boolean(data.session);
      setIsAuthed(hasSession);
      setSessionChecked(true);
    })();
    fetchUpdates();
    return () => {
      cancelled = true;
    };
  }, [username]);
  // End: Enforce Session Check Before Allowing Inserts

  // Start: Handle Status Submission
  const handleSubmitStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthed) {
      setError('Sila log masuk untuk menghantar khabar.');
      return;
    }

    if (status.trim()) {
      setLoading(true);
      try {
        const insertPayload: Record<string, unknown> = {
          username,
          status: status.trim(),
          created_at: new Date().toISOString(),
        };
        if (userId) insertPayload.user_id = userId;

        const { data, error: insertErr } = await supabase
          .from('status_updates')
          .insert(insertPayload)
          .select();

        if (insertErr) {
          setError(insertErr.message || 'Gagal menghantar khabar.');
          return;
        }

        if (data && data.length > 0) {
          setUpdates([data[0] as StatusUpdate, ...updates]);
          setStatus('');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ralat tidak diketahui.');
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
        {/* Start: Error Boundary Display */}
        {error && (
          <div className="mb-3 p-2 rounded border border-red-500/50 bg-red-500/10 text-xs text-red-400">
            {error}
          </div>
        )}
        {/* End: Error Boundary Display */}

        {/* Start: Auth Gate */}
        {sessionChecked && !isAuthed && (
          <p className="text-xs text-amber-400 mb-2">
            Log masuk diperlukan untuk menghantar khabar.
          </p>
        )}
        {/* End: Auth Gate */}

        {/* Start: Status Input */}
        <form onSubmit={handleSubmitStatus} className="mb-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Berikan khabar terkini anda..."
              className="flex-1 retro-input text-xs"
              disabled={loading || (sessionChecked && !isAuthed)}
            />
            <button
              type="submit"
              disabled={loading || (sessionChecked && !isAuthed)}
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