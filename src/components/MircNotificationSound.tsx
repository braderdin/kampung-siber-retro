"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface MircNotificationSoundProps {
  enabled?: boolean;
  volume?: number;
  frequency?: number;
  duration?: number;
  onSoundComplete?: () => void;
}

interface AudioContextType {
  context: AudioContext | null;
  isSupported: boolean;
}

const DEFAULT_VOLUME = 0.5;
const DEFAULT_FREQUENCY = 800;
const DEFAULT_DURATION = 200;

export default function MircNotificationSound({ 
  enabled = true,
  volume = DEFAULT_VOLUME,
  frequency = DEFAULT_FREQUENCY,
  duration = DEFAULT_DURATION,
  onSoundComplete,
}: MircNotificationSoundProps) {
  const [isClient, setIsClient] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof AudioContext !== "undefined") {
      const ctx = new AudioContext();
      setAudioContext(ctx);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.disconnect();
        oscillatorRef.current.stop();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
    };
  }, []);

  const generateChiptuneSound = useCallback(async () => {
    if (!isClient || !audioContext || !enabled) return;

    try {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const compressor = audioContext.createDynamicsCompressor();

      compressor.threshold.value = -50;
      compressor.knee.value = 40;
      compressor.ratio.value = 12;
      compressor.attack.value = 0;
      compressor.release.value = 0.1;

      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);

      oscillator.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(audioContext.destination);

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration / 1000);

      setIsPlaying(true);

      oscillator.onended = () => {
        setIsPlaying(false);
        onSoundComplete?.();
      };
    } catch (error) {
      console.error("Error playing sound:", error);
      setIsPlaying(false);
    }
  }, [isClient, audioContext, enabled, frequency, volume, duration, onSoundComplete]);

  const play = useCallback(() => {
    generateChiptuneSound();
  }, [generateChiptuneSound]);

  const stop = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
    }
    setIsPlaying(false);
  }, []);

  return {
    play,
    stop,
    isPlaying,
    audioContext,
    isClient,
  };
}

export const useMircSound = (options?: {
  enabled?: boolean;
  volume?: number;
  frequency?: number;
  duration?: number;
}) => {
  const [isClient, setIsClient] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof AudioContext !== "undefined") {
      const ctx = new AudioContext();
      setAudioContext(ctx);
    }
  }, []);

  const playSound = useCallback(async (type: "ping" | "chime" | "whistle" | "beep" = "ping") => {
    if (!isClient || !audioContext) return;

    const configs = {
      ping: { freq: 800, dur: 150 },
      chime: { freq: 1000, dur: 200 },
      whistle: { freq: 600, dur: 300 },
      beep: { freq: 1200, dur: 100 },
    };

    const config = configs[type];

    try {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(config.freq, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(options?.volume || 0.5, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config.dur / 1000);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      oscillator.start();
      oscillator.stop(audioContext.currentTime + config.dur / 1000);

      setIsPlaying(true);

      oscillator.onended = () => {
        setIsPlaying(false);
      };
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, [isClient, audioContext, options?.volume]);

  const stop = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
    }
    setIsPlaying(false);
  }, []);

  return {
    playSound,
    stop,
    isPlaying,
    isClient,
  };
};

export const createMircChime = () => {
  const [active, setActive] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    if (typeof AudioContext !== "undefined") {
      setAudioContext(new AudioContext());
    }
  }, []);

  const play = useCallback(async () => {
    if (!audioContext) return;
    
    try {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const now = audioContext.currentTime;
      
      const frequencies = [660, 880, 1040, 1240, 1480];
      const durations = [80, 60, 60, 60, 80];
      
      frequencies.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        
        gain.gain.setValueAtTime(0, now + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.5, now + i * 0.07 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + durations[i] / 1000);
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + durations[i] / 1000);
      });
    } catch (e) {}
  }, [audioContext]);

  const start = () => {
    setActive(true);
    play();
  };

  const stop = () => setActive(false);

  return {
    active,
    start,
    stop,
    play,
  };
};

export const createChatNotificationSound = (callback?: () => void) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof AudioContext !== "undefined") {
      audioContextRef.current = new AudioContext();
      setIsReady(true);
    }
  }, []);

  const trigger = useCallback(async () => {
    if (!audioContextRef.current) return;

    try {
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      const osc = audioContextRef.current.createOscillator();
      const gain = audioContextRef.current.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(700, audioContextRef.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioContextRef.current.currentTime + 0.1);

      gain.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(audioContextRef.current.destination);

      osc.start();
      osc.stop(audioContextRef.current.currentTime + 0.2);

      callback?.();
    } catch (e) {
      console.error("Sound error:", e);
    }
  }, [callback]);

  return {
    trigger,
    isReady,
  };
};

export const useNotificationSound = () => {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const soundRef = useRef<MircNotificationSound | null>(null);

  useEffect(() => {
    soundRef.current = new MircNotificationSound({
      enabled: !muted,
      volume,
    });
  }, [muted, volume]);

  const notify = useCallback(() => {
    if (!muted && soundRef.current) {
      soundRef.current.play();
    }
  }, [muted]);

  return {
    muted,
    setMuted,
    volume,
    setVolume,
    notify,
  };
};

export const NotificationSoundWrapper = ({ 
  children,
  onMessage,
}: {
  children: React.ReactNode;
  onMessage?: () => void;
}) => {
  const sound = useNotificationSound();
  const isClient = typeof window !== "undefined";

  useEffect(() => {
    if (onMessage) {
      const handleMessage = () => {
        sound.notify();
        onMessage();
      };

      window.addEventListener("notification-triggered", handleMessage as EventListener);
      
      return () => {
        window.removeEventListener("notification-triggered", handleMessage as EventListener);
      };
    }
  }, [onMessage, sound]);

  return <>{children}</>;
};

export const triggerNotification = (options?: {
  type?: "ping" | "chime" | "whistle";
  volume?: number;
  frequency?: number;
  duration?: number;
}) => {
  if (typeof window === "undefined") return;

  const event = new CustomEvent("notification-triggered", {
    detail: options,
  });
  
  window.dispatchEvent(event);
};