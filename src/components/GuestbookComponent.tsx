"use client";

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface GuestbookEntry {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}

interface GuestbookComponentProps {
  className?: string;
}

// Start: Input Sanitization Guardrail - XSS Protection
function sanitizeInput(input: string): string {
  // Remove any HTML tags using regex
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove any script tag content specifically
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove javascript: protocol URLs
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove on* event handlers
  sanitized = sanitized.replace(/\bon\w+\s*=/gi, '');
  
  // Remove data: URLs that could contain malicious content
  sanitized = sanitized.replace(/data:\s*[^;]+;base64[^"]*/gi, '');
  
  // Remove vbscript: protocol
  sanitized = sanitized.replace(/vbscript:/gi, '');
  
  // Remove expression() CSS injection
  sanitized = sanitized.replace(/expression\s*\(/gi, '');
  
  // Remove any remaining potentially dangerous characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove any URL that might be dangerous
  sanitized = sanitized.replace(/https?:\/\/[^\s"']*/gi, (url) => {
    // Only allow safe domains or relative URLs
    if (url.startsWith('/') || url.startsWith('mailto:')) {
      return url;
    }
    return '';
  });
  
  return sanitized.trim();
}

function sanitizeUsername(username: string): string {
  // Only allow alphanumeric characters, underscores, hyphens, and spaces
  let sanitized = username.replace(/[^a-zA-Z0-9_\- ]/g, '');
  // Remove any HTML-like content
  sanitized = sanitized.replace(/[<>]/g, '');
  // Limit length
  return sanitized.substring(0, 30);
}
// End: Input Sanitization Guardrail - XSS Protection

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
      const { data, error } = await supabase
        .from('guestbook_entries')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setEntries(data as GuestbookEntry[] || []);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('Gagal memuat entri buku pelawat');
    }
  };

  useEffect(() => {
    const subscription = supabase
      .channel('guestbook_entries')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'guestbook_entries' },
        (payload) => {
          const newEntry = payload.new as GuestbookEntry;
          setEntries(prev => [newEntry, ...prev]);
        }
      )
      .subscribe();
    
    setSubscription(subscription);
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
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

  // Start: Handle Form Submission with XSS Sanitization
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Anti-spam honeypot check
    if (honeypot) {
      console.log('Spam bot detected');
      return;
    }
    
    if (!username.trim() || !message.trim()) {
      setError('Nama pengguna dan mesej adalah diperlukan');
      return;
    }
    
    // Apply XSS sanitization to both username and message
    const sanitizedUsername = sanitizeUsername(username);
    const sanitizedMessage = sanitizeInput(message);
    
    // Log if sanitization changed the input
    if (sanitizedUsername !== username.trim() || sanitizedMessage !== message.trim()) {
      console.warn('Input was sanitized for security');
    }
    
    // Additional validation after sanitization
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
      const { error } = await supabase
        .from('guestbook_entries')
        .insert([newEntry]);
      
      if (error) throw error;
      setMessage('');
      setUsername('');
      setSuccessMessage('Berjaya menandatangani buku pelawat!');
      
      // Auto-hide success message
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error adding entry:', err);
      setError('Gagal menambah entri');
    }
    
    setLoading(false);
  };
  // End: Handle Form Submission with XSS Sanitization

  return (
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

      {/* Start: Entries List */}
      <div className="mb-4 max-h-60 overflow-y-auto retroscrollbar">
        {entries.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4 pixel-font">
            Tiada entri lagi. Jadilah yang pertama menandatangani!
          </p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="retro-entry mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 pixel-font">
                  {entry.username}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 pixel-font">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pixel-font break-words">
                {entry.message}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* End: Entries List */}

      {/* Start: Submission Form */}
      <form onSubmit={handleSubmit} className="retro-form">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Nama anda..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="retro-input w-full"
            maxLength={30}
            disabled={loading}
            autoComplete="off"
          />
          <textarea
            placeholder="Mesej anda..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="retro-textarea w-full"
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
          className="retro-btn-primary w-full mt-2"
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
  );
}