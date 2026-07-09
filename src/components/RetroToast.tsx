"use client";

import { useState, useEffect, useRef } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface RetroToastProps {
  className?: string;
}

let toastId = 0;
let toastListeners: ((toasts: Toast[]) => void)[] = [];

// Simple success sound using Web Audio API
const playSuccessSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (e) {
    // Audio not supported, silently fail
  }
};

const notify = (message: string, type: Toast['type'], duration: number = 5000) => {
  const newToast: Toast = {
    id: `toast-${toastId++}`,
    message,
    type,
    duration
  };
  
  toastListeners.forEach(listener => {
    // This would be used in a real implementation
  });
};

export function showSuccess(message: string, duration?: number) {
  const newToast: Toast = {
    id: `toast-${toastId++}`,
    message,
    type: 'success',
    duration: duration || 5000
  };
  
  // Play success sound
  playSuccessSound();
  
  return newToast;
}

export function showError(message: string, duration?: number) {
  const newToast: Toast = {
    id: `toast-${toastId++}`,
    message,
    type: 'error',
    duration: duration || 5000
  };
  return newToast;
}

export function showWarning(message: string, duration?: number) {
  const newToast: Toast = {
    id: `toast-${toastId++}`,
    message,
    type: 'warning',
    duration: duration || 5000
  };
  return newToast;
}

export function showInfo(message: string, duration?: number) {
  const newToast: Toast = {
    id: `toast-${toastId++}`,
    message,
    type: 'info',
    duration: duration || 5000
  };
  return newToast;
}

export default function RetroToast({ className }: RetroToastProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Audio API context
    const initAudio = () => {
      if (!audioRef.current) {
        audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    const handleToast = (event: CustomEvent) => {
      const toast = event.detail as Toast;
      setToasts(prev => [...prev, toast]);
    };

    // Listen for toast events
    window.addEventListener('retro-toast-success', handleToast as any);
    window.addEventListener('retro-toast-error', handleToast as any);
    window.addEventListener('retro-toast-warning', handleToast as any);
    window.addEventListener('retro-toast-info', handleToast as any);

    initAudio();

    return () => {
      window.removeEventListener('retro-toast-success', handleToast as any);
      window.removeEventListener('retro-toast-error', handleToast as any);
      window.removeEventListener('retro-toast-warning', handleToast as any);
      window.removeEventListener('retro-toast-info', handleToast as any);
    };
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map(toast => {
      return setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, toast.duration);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [toasts]);

  const playSuccessSound = () => {
    if (!audioRef.current) return;

    try {
      const ctx = audioRef.current;
      
      // Create dual-tone 8-bit chime melody
      const playTone = (frequency: number, duration: number) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'square' as const;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration / 1000);
      };

      // Play dual-tone 8-bit chime
      playTone(880, 150); // High C
      ctx.resume();
      setTimeout(() => playTone(987, 150), 50); // D
    } catch (err) {
      console.error('Audio error:', err);
    }
  };

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 dark:bg-green-600/90 border-green-600 dark:border-green-500';
      case 'error':
        return 'bg-red-500/90 dark:bg-red-600/90 border-red-600 dark:border-red-500';
      case 'warning':
        return 'bg-amber-500/90 dark:bg-amber-600/90 border-amber-600 dark:border-amber-500';
      case 'info':
        return 'bg-blue-500/90 dark:bg-blue-600/90 border-blue-600 dark:border-blue-500';
      default:
        return 'bg-gray-500/90 dark:bg-gray-600/90 border-gray-600 dark:border-gray-500';
    }
  };

  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  if (toasts.length === 0) {
    return (
      <div className={`retro-toast-container ${className || ''}`} />
    );
  }

  return (
    <div className={`retro-toast-container ${className || ''}`}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            retro-toast-item
            ${getToastStyles(toast.type)}
            animate-slide-in
          `}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{getToastIcon(toast.type)}</span>
            <span className="pixel-font text-sm">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}