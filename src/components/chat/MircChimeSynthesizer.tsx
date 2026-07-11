"use client";

import { useEffect, useRef, useCallback } from "react";

// Start: MIRC Chime Synthesizer Types
export interface MircChimeConfig {
  frequency?: number;
  type?: OscillatorType;
  duration?: number;
  volume?: number;
}

export interface UseMircChimeReturn {
  playChime: (config?: MircChimeConfig) => void;
  playConnectSound: () => void;
  playDisconnectSound: () => void;
  playMessageSound: () => void;
  playJoinSound: () => void;
  isSupported: boolean;
}

// End: MIRC Chime Synthesizer Types

// Start: Global Audio Context Management
let globalAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  
  if (!globalAudioContext) {
    globalAudioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return globalAudioContext;
}
// End: Global Audio Context Management

// Start: MIRC Chime Synthesizer Hook
export function useMircChime(): UseMircChimeReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isSupported = typeof window !== "undefined" && !!(window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);

  useEffect(() => {
    audioContextRef.current = getAudioContext();
    
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playChime = useCallback((config: MircChimeConfig = {}) => {
    const {
      frequency = 880,
      type = "square",
      duration = 0.15,
      volume = 0.3,
    } = config;

    const ctx = audioContextRef.current || getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, []);

  const playConnectSound = useCallback(() => {
    playChime({ frequency: 523, type: "square", duration: 0.2, volume: 0.25 });
  }, [playChime]);

  const playDisconnectSound = useCallback(() => {
    playChime({ frequency: 330, type: "sawtooth", duration: 0.3, volume: 0.2 });
  }, [playChime]);

  const playMessageSound = useCallback(() => {
    playChime({ frequency: 880, type: "square", duration: 0.1, volume: 0.15 });
  }, [playChime]);

  const playJoinSound = useCallback(() => {
    playChime({ frequency: 660, type: "square", duration: 0.25, volume: 0.3 });
  }, [playChime]);

  return {
    playChime,
    playConnectSound,
    playDisconnectSound,
    playMessageSound,
    playJoinSound,
    isSupported,
  };
}
// End: MIRC Chime Synthesizer Hook

// Start: MIRC Chime Synthesizer Component
export function MircChimeSynthesizer() {
  const { isSupported } = useMircChime();

  if (!isSupported) {
    return (
      <div className="text-xs text-retro-text-muted font-pixel">
        Audio Web API tidak disokong
      </div>
    );
  }

  return (
    <div className="hidden">
      <span className="sr-only">MIRC Chime Synthesizer Active</span>
    </div>
  );
}
// End: MIRC Chime Synthesizer Component