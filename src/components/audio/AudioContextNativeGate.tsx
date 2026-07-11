"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAudioContextReturn {
  context: AudioContext | null;
  isReady: boolean;
  isSuspended: boolean;
  error: string | null;
  resume: () => Promise<void>;
  suspend: () => void;
  close: () => void;
}

interface AudioContextNativeGateProps {
  className?: string;
}

// Start: Audio Context Native Gate Hook
export function useAudioContextNativeGate(): UseAudioContextReturn {
  const [context, setContext] = useState<AudioContext | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contextRef = useRef<AudioContext | null>(null);

  const initContext = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      const AudioContextConstructor = window.AudioContext || (window as any).webkitAudioContext;
      
      if (!AudioContextConstructor) {
        throw new Error('AudioContext not supported in this browser');
      }

      const newContext = new AudioContextConstructor();
      contextRef.current = newContext;
      setContext(newContext);
      setIsReady(true);
      setIsSuspended(newContext.state === 'suspended');
      setError(null);

      const handleStateChange = () => {
        setIsSuspended(newContext.state === 'suspended');
      };

      newContext.addEventListener('statechange', handleStateChange);

      return () => {
        newContext.removeEventListener('statechange', handleStateChange);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize audio context');
      setIsReady(false);
    }
  }, []);

  useEffect(() => {
    initContext();

    return () => {
      if (contextRef.current) {
        contextRef.current.close().catch(() => {});
      }
    };
  }, [initContext]);

  const resume = useCallback(async () => {
    if (!contextRef.current) return;
    
    if (contextRef.current.state === 'suspended') {
      await contextRef.current.resume();
      setIsSuspended(false);
    }
  }, []);

  const suspend = useCallback(() => {
    if (!contextRef.current) return;
    
    contextRef.current.suspend().catch(() => {});
    setIsSuspended(true);
  }, []);

  const close = useCallback(() => {
    if (!contextRef.current) return;
    
    contextRef.current.close().catch(() => {});
    contextRef.current = null;
    setContext(null);
    setIsReady(false);
    setIsSuspended(false);
  }, []);

  return {
    context,
    isReady,
    isSuspended,
    error,
    resume,
    suspend,
    close
  };
}
// End: Audio Context Native Gate Hook

// Start: Audio Context Gate Component
export default function AudioContextNativeGate({ className }: AudioContextNativeGateProps) {
  const { isReady, isSuspended, error, resume } = useAudioContextNativeGate();

  return (
    <div className={`audio-context-gate ${className || ''}`}>
      {error && (
        <div className="p-2 bg-red-900/20 border-2 border-red-500 rounded">
          <span className="text-xs text-red-400 font-mono">
            AUDIO ERROR: {error}
          </span>
        </div>
      )}
      {!isReady && !error && (
        <div className="p-2 bg-gray-800/50 border-2 border-gray-600 rounded">
          <span className="text-xs text-gray-400 font-mono animate-pulse">
            INITIALIZING AUDIO CONTEXT...
          </span>
        </div>
      )}
      {isSuspended && isReady && (
        <button
          onClick={resume}
          className="px-3 py-1 bg-purple-700/50 hover:bg-purple-600 border-2 border-purple-500 rounded transition-colors duration-200"
        >
          <span className="text-xs text-purple-300 font-mono pixel-font">
            🔊 CLICK TO ENABLE AUDIO
          </span>
        </button>
      )}
    </div>
  );
}