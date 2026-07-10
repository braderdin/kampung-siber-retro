"use client";

import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Volume1, VolumeMute, Zap, Bell, BellOff } from "lucide-react";
import { useStore } from "@/store";

interface GlobalAudioToggleProps {
  className?: string;
  showLabel?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "switch" | "button" | "toggle";
  onToggle?: (enabled: boolean) => void;
}

type AudioState = {
  enabled: boolean;
  volume: number;
  muteAll: boolean;
};

const DEFAULT_SIZE = "md";
const DEFAULT_VARIANT: "switch" | "button" | "toggle" = "switch";

export default function GlobalAudioToggle({ 
  className,
  showLabel = true,
  label = "Audio",
  size = DEFAULT_SIZE,
  variant = DEFAULT_VARIANT,
  onToggle,
}: GlobalAudioToggleProps) {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [muteAll, setMuteAll] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("audioSettings");
        if (stored) {
          const settings = JSON.parse(stored);
          setEnabled(settings.enabled ?? true);
          setVolume(settings.volume ?? 0.7);
          setMuteAll(settings.muteAll ?? false);
        }
      } catch (e) {
        console.error("Error loading audio settings:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const saveSettings = () => {
      if (typeof window !== "undefined") {
        localStorage.setItem("audioSettings", JSON.stringify({
          enabled,
          volume,
          muteAll,
        }));
      }
    };
    
    saveSettings();
  }, [enabled, volume, muteAll, isClient]);

  const toggleEnabled = useCallback(() => {
    const newState = !enabled;
    setEnabled(newState);
    onToggle?.(newState);
    
    if (typeof window !== "undefined") {
      const storage = useStore.getState();
      if (storage && storage.setAudioEnabled) {
        storage.setAudioEnabled(newState);
      }
    }
  }, [enabled, onToggle]);

  const toggleMute = useCallback(() => {
    const newMute = !muteAll;
    setMuteAll(newMute);
    
    if (typeof window !== "undefined") {
      const storage = useStore.getState();
      if (storage && storage.setMuteAll) {
        storage.setMuteAll(newMute);
      }
    }
  }, [muteAll]);

  const adjustVolume = useCallback((amount: number) => {
    setVolume((prev) => {
      const newVolume = Math.max(0, Math.min(1, prev + amount));
      return newVolume;
    });
  }, []);

  const getIcon = () => {
    if (muteAll || !enabled) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "lg":
        return "h-12 w-12";
      case "md":
      default:
        return "h-10 w-10";
    }
  };

  const getLabelSize = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base";
      case "md":
      default:
        return "text-sm";
    }
  };

  const renderSwitch = () => (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        checked={enabled && !muteAll}
        onChange={toggleEnabled}
        className="sr-only"
      />
      <div 
        className={`relative inline-flex items-center w-14 h-8 rounded-full transition-colors 
          ${enabled && !muteAll ? "bg-emerald-500" : "bg-gray-600"}`}
      >
        <div 
          className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition-transform 
            ${enabled && !muteAll ? "translate-x-6" : "translate-x-1"}`}
        />
      </div>
    </div>
  );

  const renderToggle = () => (
    <button
      onClick={toggleEnabled}
      className={`${getSizeClasses()} rounded-full flex items-center justify-center transition-all 
        ${enabled && !muteAll ? "bg-emerald-500 hover:bg-emerald-400" : "bg-gray-700 hover:bg-gray-600"} 
        text-white`}
    >
      {getIcon()}
    </button>
  );

  const renderButton = () => (
    <button
      onClick={toggleEnabled}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-700 
        text-gray-300 transition-colors pixel-font"
    >
      {getIcon()}
      {showLabel && <span>{label}</span>}
    </button>
  );

  const renderVolumeSlider = () => (
    <div className="w-24">
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer 
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
          [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full"
      />
    </div>
  );

  if (variant === "button") {
    return (
      <div className={`flex items-center gap-2 ${className || ""}`}>
        {renderButton()}
        {showLabel && (
          <div className="flex items-center gap-2">
            <span className={`${getLabelSize()} text-gray-300 pixel-font`}>
              {volume > 0 ? "Aktif" : "Bising"}
            </span>
            {renderVolumeSlider()}
          </div>
        )}
      </div>
    );
  }

  if (variant === "toggle") {
    return (
      <div className={`flex items-center gap-2 ${className || ""}`}>
        {renderToggle()}
        {showLabel && (
          <span className={`${getLabelSize()} text-gray-300 pixel-font`}>
            {enabled && !muteAll ? "Bising Aktif" : "Bising Mati"}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className || ""}`}>
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-cyan-400" />
        {renderSwitch()}
        {showLabel && (
          <span className={`${getLabelSize()} text-gray-300 pixel-font`}>
            {enabled && !muteAll ? "Bising Aktif" : "Bising Mati"}
          </span>
        )}
      </div>
      
      {showLabel && (
        <div className="flex items-center gap-2">
          <BellOff className="h-4 w-4 text-gray-500" />
          <button
            onClick={toggleMute}
            className="px-2 py-1 text-xs rounded bg-gray-800/50 hover:bg-gray-700 
              text-gray-300 transition-colors pixel-font"
          >
            {muteAll ? "Buka Semua" : "Bising Semua"}
          </button>
        </div>
      )}
      
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 pixel-font">
          {Math.round(volume * 100)}%
        </span>
        {renderVolumeSlider()}
      </div>
    </div>
  );
}

export const useGlobalAudio = () => {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [muteAll, setMuteAll] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("audioSettings");
        if (stored) {
          const settings = JSON.parse(stored);
          setEnabled(settings.enabled ?? true);
          setVolume(settings.volume ?? 0.7);
          setMuteAll(settings.muteAll ?? false);
        }
      } catch (e) {
        console.error("Error loading audio settings:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    localStorage.setItem("audioSettings", JSON.stringify({
      enabled,
      volume,
      muteAll,
    }));
  }, [enabled, volume, muteAll, isClient]);

  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  const mute = useCallback(() => {
    setMuteAll(true);
  }, []);

  const unmute = useCallback(() => {
    setMuteAll(false);
  }, []);

  const setVolumeLevel = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const adjustVolume = useCallback((amount: number) => {
    setVolume(prev => Math.max(0, Math.min(1, prev + amount)));
  }, []);

  return {
    enabled,
    setEnabled,
    volume,
    setVolume: setVolumeLevel,
    muteAll,
    setMuteAll: mute,
    unmute,
    toggle,
    muteAllToggle: mute,
    adjustVolume,
  };
};

export const AudioProvider = ({ 
  children,
}: {
  children: React.ReactNode;
}) => {
  const audio = useGlobalAudio();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "audioSettings" && e.newValue) {
          try {
            const settings = JSON.parse(e.newValue);
            audio.setEnabled(settings.enabled ?? true);
            audio.setVolume(settings.volume ?? 0.7);
            audio.setMuteAll(settings.muteAll ?? false);
          } catch (err) {}
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [audio]);

  return (
    <div>
      {children}
    </div>
  );
};