"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThemeStore } from "@/store/useThemeStore";

interface VinylProfilePlayerProps {
  username?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const VinylProfilePlayer: React.FC<VinylProfilePlayerProps> = ({
  username = "resident",
  className = "",
  size = "md",
}) => {
  const { currentTheme } = useThemeStore();
  const [isSpinning, setIsSpinning] = useState(true);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef<number>(0);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const getThemeColors = () => {
    switch (currentTheme) {
      case "retro-matrix":
        return {
          label: "bg-green-800",
          text: "text-green-300",
          center: "bg-green-900/50",
          dot: "bg-green-400",
        };
      case "windows-gray":
        return {
          label: "bg-gray-700",
          text: "text-gray-300",
          center: "bg-gray-800/50",
          dot: "bg-gray-400",
        };
      default:
        return {
          label: "bg-blue-800",
          text: "text-blue-300",
          center: "bg-blue-900/50",
          dot: "bg-blue-400",
        };
    }
  };

  const colors = getThemeColors();

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => {
        const newRotation = prev + 3.6;
        rotationRef.current = newRotation;
        return newRotation % 360;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isSpinning) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setIsSpinning(false);
        } else {
          setIsSpinning(true);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, [isSpinning]);

  return (
    <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
      <div
        className={`relative rounded-full border-2 border-gray-600/50 overflow-hidden transition-transform duration-300 ${
          isSpinning ? "animate-spin" : ""
        }`}
        style={{
          transform: `rotate(${rotation}deg)`,
          animationDuration: "5s",
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="absolute inset-2 rounded-full border-2 border-gray-700/50" />
          
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 flex items-center justify-center">
            <div className={`font-pixel text-xs ${colors.text} text-center px-2`}>
              {username}
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className={`w-2 h-2 ${colors.dot} rounded-full`} />
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className={`w-8 h-1 ${colors.label} rounded`} />
          </div>
        </div>

        <div className="absolute inset-0 rounded-full bg-black/10" />
      </div>

      <div className="absolute -bottom-2 -left-2 -right-2 -top-2 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full rounded-full border-2 border-dashed border-gray-700/30" />
      </div>
    </div>
  );
};

export default VinylProfilePlayer;
