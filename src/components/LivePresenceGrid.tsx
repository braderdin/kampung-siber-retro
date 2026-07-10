"use client";

import React, { useState, useEffect, useCallback } from "react";

interface PresenceUser {
  id: string;
  username: string;
  avatar?: string;
  status?: "online" | "away" | "offline";
  lastSeen?: string;
}

interface LivePresenceGridProps {
  users?: PresenceUser[];
  refreshInterval?: number;
  className?: string;
  maxUsers?: number;
}

export const LivePresenceGrid: React.FC<LivePresenceGridProps> = ({
  users: initialUsers = [],
  refreshInterval = 30000,
  className = "",
  maxUsers = 20,
}) => {
  const [users, setUsers] = useState<PresenceUser[]>(initialUsers);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchPresence = useCallback(async () => {
    setIsAnimating(true);
    
    try {
      const response = await fetch("/api/presence/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users.slice(0, maxUsers));
      }
    } catch (error) {
      console.error("Failed to fetch presence:", error);
    } finally {
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [maxUsers]);

  useEffect(() => {
    fetchPresence();
    
    const interval = setInterval(fetchPresence, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPresence, refreshInterval]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "away": return "bg-amber-500";
      case "offline": return "bg-gray-500";
      default: return "bg-green-500";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "away": return "☕";
      case "offline": return "⏰";
      default: return "●";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-pixel text-sm text-gray-400">Live Presence</h3>
        <button
          onClick={fetchPresence}
          className="p-1 hover:bg-gray-800/50 rounded transition-colors"
          aria-label="Refresh presence"
        >
          <span className="font-pixel text-xs text-gray-500">⟳</span>
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div className={`marquee whitespace-nowrap ${isAnimating ? "marquee-animate" : ""}`}>
          <div className="inline-flex gap-2">
            {users.map((user, index) => (
              <div
                key={user.id}
                className={`inline-flex items-center gap-1 px-2 py-1 bg-gray-800/30 rounded border border-gray-700/30 transition-all duration-300 ${
                  isAnimating ? "translate-y-[-5px]" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-blue-500/50 flex items-center justify-center">
                    <span className="font-pixel text-xs text-white">👤</span>
                  </div>
                )}
                
                <span className="font-pixel text-xs text-gray-300 max-w-[80px] truncate">
                  {user.username}
                </span>
                
                <span className={`font-pixel text-xs ${getStatusColor(user.status)}`}>
                  {getStatusIcon(user.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-2">
          <p className="font-pixel text-xs text-gray-600">No users online</p>
        </div>
      )}

      <style jsx>{`
        .marquee {
          display: inline-block;
        }
        .marquee-animate {
          animation: marquee-scroll 2s linear infinite;
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default LivePresenceGrid;