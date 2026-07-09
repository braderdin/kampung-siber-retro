'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface NewUserSignup {
  id: string;
  username: string;
  email: string;
  timestamp: string;
  avatar?: string;
}

interface SirenKampungProps {
  className?: string;
}

export default function SirenKampung({ className }: SirenKampungProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [newUsers, setNewUsers] = useState<NewUserSignup[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    // Load existing recent signups
    const loadRecentSignups = async () => {
      try {
        const { data, error } = await supabase
          .from('user_signups')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(5) as { data: NewUserSignup[]; error: any };

        if (data && data.length > 0) {
          setNewUsers(data);
        }
      } catch (err) {
        console.error('Error loading recent signups:', err);
      }
    };

    loadRecentSignups();

    // Subscribe to new user signups
    subscriptionRef.current = supabase
      .channel('public:user_signups')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_signups'
        },
        (payload: any) => {
          const newUser = payload.new as NewUserSignup;
          setNewUsers(prev => [newUser, ...prev.slice(0, 4)]);
          
          // Trigger animation
          setIsVisible(true);
          setAnimationKey(prev => prev + 1);
          
          setTimeout(() => {
            setIsVisible(false);
          }, 5000);
        }
      )
      .subscribe();

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, []);

  const getWelcomeMessage = (username: string): string => {
    const messages = language === 'ms'
      ? [
          `Selamat datang ${username}!` ,
          `${username} telah menyertai kampung!`,
          ` ${username} baru sahaja mendaftar!`
        ]
      : [
          `Welcome ${username} to the village!`,
          `${username} has joined the community!`,
          `${username} just registered!`
        ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (!isVisible) return null;

  return (
    <div 
      key={animationKey}
      className={`
        siren-kampung
        ${className || ''}
        fixed
        top-16 left-1/2
        -translate-x-1/2
        z-50
        animate-blink-yellow
      `}
    >
      <div className="retro-alert-pulse flex items-center gap-3 px-4 py-2 bg-yellow-800 dark:bg-yellow-900 border-2 border-yellow-400 dark:border-yellow-300 rounded-lg shadow-xl">
        {/* Start: Blinking Yellow Icon */}
        <div className="flex-shrink-0">
          <span className="text-2xl animate-pulse">🔔</span>
        </div>
        {/* End: Blinking Yellow Icon */}

        {/* Start: Message Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {newUsers.length > 0 ? (
              <>
                <span className="text-yellow-300 font-bold pixel-font text-sm">
                  🚨 {language === 'ms' ? 'BERITA!' : 'NEWS!'}
                </span>
                <span className="text-yellow-200 pixel-font text-sm">
                  {getWelcomeMessage(newUsers[0]?.username || 'Pengguna')}
                </span>
              </>
            ) : (
              <span className="text-yellow-200 pixel-font text-sm">
                {language === 'ms' 
                  ? 'Pengesahan pendaftaran pengguna baharu' 
                  : 'New user registration detected'}
              </span>
            )}
          </div>
        </div>
        {/* End: Message Content */}

        {/* Start: Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 text-yellow-300 hover:text-yellow-100 pixel-font text-sm"
        >
          ✕
        </button>
        {/* End: Close Button */}
      </div>

      {/* Start: Blinking Animation Styles */}
      <style jsx>{`
        @keyframes blink-yellow {
          0%, 100% {
            opacity: 1;
            transform: translateY(0);
          }
          50% {
            opacity: 0.9;
            transform: translateY(-2px);
          }
        }
        
        .animate-blink-yellow {
          animation: blink-yellow 1.5s ease-in-out infinite;
        }
      `}</style>
      {/* End: Blinking Animation Styles */}
    </div>
  );
}

/**
 * Hook for using SirenKampung notifications in any component
 */
export function useSirenKampung() {
  const [notification, setNotification] = useState<NewUserSignup | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const subscription = supabase
      .channel('public:user_signups_hook')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_signups'
        },
        (payload: any) => {
          const newUser = payload.new as NewUserSignup;
          setNotification(newUser);
          setShowNotification(true);
          
          setTimeout(() => {
            setShowNotification(false);
            setTimeout(() => setNotification(null), 500);
          }, 4000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { notification, showNotification, setNotification, setShowNotification };
}