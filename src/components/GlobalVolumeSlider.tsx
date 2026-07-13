"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useThemeStore } from "@/store/useThemeStore";

interface GlobalVolumeSliderProps {
  initialVolume?: number;
  className?: string;
}

export const GlobalVolumeSlider: React.FC<GlobalVolumeSliderProps> = ({
  initialVolume = 50,
  className = "",
}) => {
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const { currentTheme } = useThemeStore();

  const getThemeColors = () => {
    switch (currentTheme) {
      case "retro-matrix":
        return {
          track: "bg-green-800/50",
          fill: "bg-green-400",
          thumb: "bg-green-300",
          mute: "text-green-400",
        };
      case "windows-gray":
        return {
          track: "bg-gray-700/50",
          fill: "bg-gray-300",
          thumb: "bg-gray-200",
          mute: "text-gray-400",
        };
      default:
        return {
          track: "bg-blue-800/50",
          fill: "bg-blue-400",
          thumb: "bg-blue-300",
          mute: "text-blue-400",
        };
    }
  };

  const colors = getThemeColors();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    localStorage.setItem("global-volume", newVolume.toString());
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newState = !prev;
      if (newState) {
        localStorage.setItem("volume-muted", "true");
      } else {
        localStorage.removeItem("volume-muted");
      }
      return newState;
    });
  }, []);

  useEffect(() => {
    const savedVolume = localStorage.getItem("global-volume");
    if (savedVolume) {
      setVolume(parseInt(savedVolume, 10));
    }

    const muted = localStorage.getItem("volume-muted");
    if (muted === "true") {
      setIsMuted(true);
    }
  }, []);

  const effectiveVolume = isMuted ? 0 : volume;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={toggleMute}
        className={`font-pixel text-xs transition-colors ${colors.mute} hover:text-white`}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={effectiveVolume}
          onChange={handleChange}
          className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${colors.fill} 0%, ${colors.fill} ${effectiveVolume}%, ${colors.track} ${effectiveVolume}%, ${colors.track} 100%)`,
          }}
        />
        <span className="font-pixel text-xs text-gray-400 w-10 text-center">
          {isMuted ? "0" : volume}
        </span>
      </div>

      <div className="hidden sm:block">
        <span className="font-pixel text-xs text-gray-500">Volume</span>
      </div>
    </div>
  );
};

export default GlobalVolumeSlider;
