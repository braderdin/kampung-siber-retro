// Start: Guestbook Component with Win95 Empty State
"use client";

import { useState, useEffect, useRef } from 'react';
import GuestbookModeratorControls from './GuestbookModeratorControls';
import Win95DialogEmptyState from './ui/Win95DialogEmptyState';

const supabase = createMockClient();

interface GuestbookEntry {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}

interface GuestbookComponentProps {
  className?: string;
}

interface Payload {
  new: GuestbookEntry;
}

interface QueryResult {
  data?: GuestbookEntry[];
  error: Error | null;
}

interface RealtimeSubscription {
  on: (
    event: string,
    config: { event: string; schema: string; table: string },
    callback: (payload: Payload) => void
  ) => RealtimeSubscription;
  subscribe: () => { unsubscribe: () => void };
}

interface QueryBuilder {
  select: (columns: string) => QueryBuilder;
  order: (column: string, options: { ascending: boolean }) => QueryBuilder;
  limit: (limit: number) => QueryBuilder;
  insert: (data: GuestbookEntry[]) => QueryBuilder;
  then: (callback: (result: QueryResult) => void) => Promise<QueryResult>;
}

interface SupabaseClient {
  from: (table: string) => QueryBuilder;
  channel: (table: string) => RealtimeSubscription;
}

function createMockClient(): SupabaseClient {
  const createQueryBuilder = (): QueryBuilder => ({
    select: () => createQueryBuilder(),
    order: () => createQueryBuilder(),
    limit: () => createQueryBuilder(),
    insert: () => createQueryBuilder(),
    then: async (callback: (result: QueryResult) => void) => {
      const result: QueryResult = { data: [], error: null };
      await callback(result);
      return result;
    }
  });

  const createSubscription = (): RealtimeSubscription => ({
    on: () => createSubscription(),
    subscribe: () => ({ unsubscribe: () => {} })
  });

  return {
    from: () => createQueryBuilder(),
    channel: () => createSubscription()
  };
}

// Start: Input Sanitization Utilities
function sanitizeInput(input: string): string {
  let sanitized = input.replace(/<[^>]*>/g, '');
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/\bon\w+\s*=/gi, '');
  sanitized = sanitized.replace(/data:\s*[^;]+;base64[^"]*/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  sanitized = sanitized.replace(/expression\s*\(/gi, '');
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  sanitized = sanitized.replace(/https?:\/\/[^\s"']*/gi, (url) => {
    if (url.startsWith('/') || url.startsWith('mailto:')) {
      return url;
    }
    return '';
  });
  return sanitized.trim();
}

function sanitizeUsername(username: string): string {
  let sanitized = username.replace(/[^a-zA-Z0-9_\- ]/g, '');
  sanitized = sanitized.replace(/[<>]/g, '');
  return sanitized.substring(0, 30);
}
// End: Input Sanitization Utilities

export default function GuestbookComponent({ className }: GuestbookComponentProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const result = await supabase
        .from('guestbook_entries')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50)
        .then((res: QueryResult) => res);
      
      if (result.error) throw result.error;
      setEntries(result.data || []);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('Gagal memuat entri buku pelawat');
    }
  };

  useEffect(() => {
    const sub = supabase
      .channel('guestbook_entries')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'guestbook_entries' },
        (payload: Payload) => {
          const newEntry = payload.new as GuestbookEntry;
          setEntries(prev => [newEntry, ...prev]);
        }
      )
      .subscribe();
    
    setSubscription(sub);
    
    return () => {
      if (sub) {
        (sub as { unsubscribe: () => void }).unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteEntry = (entryId: number) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const handleFlagUser = (flaggedUsername: string) => {
    console.log(`User ${flaggedUsername} has been flagged for moderation`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (honeypot) {
      console.log('Spam bot detected');
      return;
    }
    
    if (!username.trim() || !message.trim()) {
      setError('Nama pengguna dan mesej adalah diperlukan');
      return;
    }
    
    const sanitizedUsername = sanitizeUsername(username);
    const sanitizedMessage = sanitizeInput(message);
    
    if (sanitizedUsername !== username.trim() || sanitizedMessage !== message.trim()) {
      console.warn('Input was sanitized for security');
    }
    
    if (!sanitizedUsername || sanitizedUsername.length === 0) {
      setError('Nama pengguna tidak sah');
      return;
    }
    
    if (sanitizedMessage.length < 3) {
      setError('Mesej mesti sekurang-kurang 3 aksara');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    const newEntry: GuestbookEntry = {
      id: Date.now(),
      username: sanitizedUsername,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
    };
    
    try {
      const result = await supabase
        .from('guestbook_entries')
        .insert([newEntry])
        .then((res: QueryResult) => res);
      
      if (result.error) throw result.error;
      setMessage('');
      setUsername('');
      setSuccessMessage('Berjaya menandatangani buku pelawat!');
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error adding entry:', err);
      setError('Gagal menambah entri');
    }
    
    setLoading(false);
  };

  return (
    // Start: Guestbook Card Container
    <div className={`retro-card ${className || ''}`}>
      {/* Start: Card Header */}
      <div className="retro-card-header">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 pixel-font">
          🖋️ Buku Pelawat Retro
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Tandatangani buku dan lihat apa yang orang lain telah katakan!
        </p>
      </div>
      {/* End: Card Header */}

      {/* Start: Success Message */}
      {successMessage && (
        <div className="mb-3 p-3 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-500 rounded pixel-font text-sm text-green-800 dark:text-green-300">
          {successMessage}
        </div>
      )}
      {/* End: Success Message */}

      {/* Start: Entries List with Empty State */}
      <div className="mb-4 max-h-60 overflow-y-auto retroscrollbar">
        {entries.length === 0 ? (
          // Start: Win95 Empty State Injection
          <Win95DialogEmptyState 
            message="Buku Pelawat masih suci. Menjadi wargalaya pertama meninggalkan jejak!"
          />
          // End: Win95 Empty State Injection
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="retro-entry mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-blue-500 relative"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 pixel-font">
                  {entry.username}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 pixel-font">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pixel-font break-words pr-20">
                {entry.message}
              </p>
              
              {/* Start: Moderator Controls */}
              <div className="absolute top-2 right-2">
                <GuestbookModeratorControls
                  entryId={entry.id}
                  username={entry.username}
                  onEntryDelete={handleDeleteEntry}
                  onUserFlag={handleFlagUser}
                />
              </div>
              {/* End: Moderator Controls */}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* End: Entries List */}

      {/* Start: Submission Form with Rigid Flex-Layout Bounds */}
      <form onSubmit={handleSubmit} className="retro-form flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
          <input
            type="text"
            placeholder="Nama anda..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="retro-input flex-1 min-w-0"
            maxLength={30}
            disabled={loading}
            autoComplete="off"
          />
          <textarea
            placeholder="Mesej anda..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="retro-textarea flex-1 min-w-0"
            rows={2}
            maxLength={200}
            disabled={loading}
          />
        </div>
        
        {/* Start: Honeypot Field (Hidden from users) */}
        <div className="hidden">
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {/* End: Honeypot Field */}
        
        {error && (
          <p className="text-xs text-red-500 mt-1 pixel-font">{error}</p>
        )}
        
        <button
          type="submit"
          disabled={loading || !username.trim() || !message.trim()}
          className="retro-btn-primary w-full sm:w-auto self-end"
        >
          {loading ? 'Menandatangani...' : 'Tandatangani Buku Pelawat'}
        </button>
      </form>
      {/* End: Submission Form */}

      {/* Start: Footer Controls */}
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="text-xs text-gray-400 dark:text-gray-500 pixel-font">
          {entries.length} {entries.length === 1 ? 'entri' : 'entri'}
        </div>
      </div>
      {/* End: Footer Controls */}
    </div>
    // End: Guestbook Card Container
  );
}
// End: Guestbook Component with Win95 Empty State