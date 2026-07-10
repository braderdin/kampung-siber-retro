"use client";

import React, { useState, useEffect } from "react";

interface StorageUsageBarProps {
  usedBytes: number;
  maxBytes?: number;
  showLabel?: boolean;
  className?: string;
}

const STORAGE_LIMIT_BYTES = 25 * 1024 * 1024; // 25MB default

export const StorageUsageBar: React.FC<StorageUsageBarProps> = ({
  usedBytes,
  maxBytes = STORAGE_LIMIT_BYTES,
  showLabel = true,
  className = "",
}) => {
  const [usagePercent, setUsagePercent] = useState(0);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    const percent = Math.min((usedBytes / maxBytes) * 100, 100);
    setUsagePercent(percent);
    setIsWarning(percent >= 75);
    setIsCritical(percent >= 95);
  }, [usedBytes, maxBytes]);

  const getBarColor = () => {
    if (isCritical) return "bg-red-500";
    if (isWarning) return "bg-amber-500";
    return "bg-green-500";
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const remainingBytes = Math.max(0, maxBytes - usedBytes);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="font-pixel text-xs text-gray-400">Storage</span>
          <span className={`font-pixel text-xs ${isWarning ? "text-amber-400" : "text-gray-300"}`}>
            {formatBytes(usedBytes)} / {formatBytes(maxBytes)}
          </span>
        </div>
      )}
      
      <div className="relative h-3 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50">
        <div
          className={`h-full transition-all duration-300 ease-out ${getBarColor()}`}
          style={{ width: `${usagePercent}%` }}
        />
        <div className="absolute inset-0 flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`w-px h-full ${
                (i + 1) / 10 === usagePercent / 100 ? "bg-white/30" : "bg-gray-700/30"
              }`}
            />
          ))}
        </div>
      </div>

      {showLabel && (
        <div className="mt-1 text-xs font-pixel text-gray-500 text-center">
          {isCritical ? "Storage full!" : isWarning ? "Approaching limit" : "Good"}
        </div>
      )}

      {isWarning && (
        <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded" role="alert">
          <p className="font-pixel text-xs text-amber-400">
            ⚠️ Approaching storage limit. Consider cleaning up files.
          </p>
        </div>
      )}
    </div>
  );
};

export default StorageUsageBar;