"use client";

import { useState, useEffect, useRef } from 'react';

interface Announcement {
  id: string;
  message: string;
  timestamp: number;
  author: string;
}

export default function CommunityBulletin() {
  const [isClient, setIsClient] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);

    // Initialize with sample announcements
    const initialAnnouncements: Announcement[] = [
      {
        id: '1',
        message: 'Selamat datang di Bilik Pengumuman Komuniti! Disini kita kongsi berita berhadapan.',
        timestamp: Date.now() - 1000 * 60 * 5,
        author: 'Pejelat'
      },
      {
        id: '2',
        message: 'Jangan lupa serahkan feedback mengenai kempen baharu kami.',
        timestamp: Date.now() - 1000 * 60 * 30,
        author: 'Pengarah'
      }
    ];
    setAnnouncements(initialAnnouncements);

    // Check if Supabase URL is available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && typeof window !== 'undefined') {
      try {
        // Create WebSocket connection for real-time updates
        const wsUrl = supabaseUrl.replace(/^https?:\/\//, 'wss://') + '/realtime/v1/websocket';
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
          // Subscribe to announcements channel
          ws.send(JSON.stringify({
            type: 'subscribe',
            channel: 'public:announcements',
            message: {}
          }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'broadcast' && data.message?.content) {
              setAnnouncements(prev => [
                {
                  id: Date.now().toString(),
                  message: data.message.content,
                  timestamp: Date.now(),
                  author: data.message.author || 'Sistem'
                },
                ...prev
              ]);
            }
          } catch (e) {
            console.warn('WebSocket message parse error:', e);
          }
        };

        ws.onerror = (error) => {
          console.warn('WebSocket error:', error);
        };

        setWebsocket(ws);
      } catch (error) {
        console.warn('WebSocket initialization failed:', error);
      }
    }

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [announcements]);

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp) / 60000);
    
    if (diffMinutes < 1) {
      return 'Baru sahaja';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min yang lalu`;
    } else if (diffMinutes < 1440) {
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours} jam yang lalu`;
    } else {
      return date.toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (!isClient) {
    return (
      <div className="retro-bulletin bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-pixel p-4">
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="retro-bulletin bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-pixel flex flex-col">
      {/* Start: Bulletin Header */}
      <div className="retro-bulletin-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
          <span className="text-xl">📢</span>
          <span>Bilik Pengumuman</span>
        </h3>
        <div className="flex items-center gap-2">
          <span className={`
            text-xs px-2 py-1 rounded pixel-font
            ${isConnected ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-900/20 text-gray-500 dark:text-gray-400'}
          `}>
            {isConnected ? 'Sambung' : 'putus'}
          </span>
        </div>
      </div>
      {/* End: Bulletin Header */}

      {/* Start: Announcements List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {announcements.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 pixel-font text-sm">
              Tiada pengumuman semasa
            </p>
          </div>
        ) : (
          announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              className="
                retro-announcement
                bg-white dark:bg-gray-900
                border-l-4 border-cyan-400
                rounded
                p-3
                animate-fade-in
              "
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm">💬</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300 pixel-font">
                    {announcement.message}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font mt-1">
                    {announcement.author && `Diterbitkan oleh: ${announcement.author} | `}
                    {formatTime(announcement.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* End: Announcements List */}

      {/* Start: Connection Status */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      {/* End: Connection Status */}
    </div>
  );
}