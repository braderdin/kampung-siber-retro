"use client";

import React, { useState, useEffect, useCallback } from "react";

interface HitCounterProps {
  identifier: string;
  label?: string;
  showTrend?: boolean;
  className?: string;
}

interface CounterData {
  current: number;
  previous?: number;
  trend?: number;
}

export const RedisHitCounter: React.FC<HitCounterProps> = ({
  identifier,
  label,
  showTrend = true,
  className = "",
}) => {
  const [data, setData] = useState<CounterData>({ current: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isIncrementing, setIsIncrementing] = useState(false);

  const fetchCounter = useCallback(async () => {
    try {
      const response = await fetch(`/api/analytics/${identifier}/views`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error(`Failed to fetch counter for ${identifier}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [identifier]);

  const incrementCounter = useCallback(async () => {
    setIsIncrementing(true);
    try {
      const response = await fetch(`/api/analytics/${identifier}/views`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "increment" }),
      });

      if (response.ok) {
        await fetchCounter();
      }
    } catch (error) {
      console.error(`Failed to increment counter for ${identifier}:`, error);
    } finally {
      setIsIncrementing(false);
    }
  }, [identifier, fetchCounter]);

  useEffect(() => {
    fetchCounter();

    const interval = setInterval(fetchCounter, 60000);
    return () => clearInterval(interval);
  }, [fetchCounter]);

  useEffect(() => {
    incrementCounter();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const trendColor = (trend?: number) => {
    if (trend === undefined) return "text-gray-500";
    if (trend > 0) return "text-green-400";
    if (trend < 0) return "text-red-400";
    return "text-gray-500";
  };

  const trendIcon = (trend?: number) => {
    if (trend === undefined) return "—";
    if (trend > 0) return "↑";
    if (trend < 0) return "↓";
    return "→";
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
          <div className="font-pixel text-2xl font-bold text-white">
            {isLoading ? "…" : formatNumber(data.current)}
          </div>
          <div className="font-pixel text-xs text-gray-400">Views</div>
        </div>

        {showTrend && (
          <>
            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
              <div className={`font-pixel text-sm font-bold ${trendColor(data.trend)}`}>
                {isLoading ? "…" : trendIcon(data.trend)}
              </div>
              <div className="font-pixel text-xs text-gray-400">Trend</div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
              <div className="font-pixel text-xs font-bold text-white">
                {isLoading ? "…" : data.trend !== undefined ? `${data.trend}%` : "—"}
              </div>
              <div className="font-pixel text-xs text-gray-400">Change</div>
            </div>
          </>
        )}
      </div>

      {label && (
        <div className="flex flex-col">
          <span className="font-pixel text-xs text-gray-400">{label}</span>
          <span className="font-pixel text-xs text-gray-500">/{identifier}</span>
        </div>
      )}

      {isIncrementing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
          <span className="font-pixel text-xs text-gray-400">Updating…</span>
        </div>
      )}
    </div>
  );
};

export default RedisHitCounter;