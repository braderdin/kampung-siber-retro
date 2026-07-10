"use client";

import React, { useState, useEffect, useCallback } from "react";

interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  url?: string;
  isPlaying?: boolean;
}

interface WinampPlaylistDrawerProps {
  tracks?: PlaylistTrack[];
  currentTrack?: PlaylistTrack;
  onTrackSelect?: (track: PlaylistTrack) => void;
  onPlayPause?: () => void;
  className?: string;
  autoCollapse?: boolean;
}

export const WinampPlaylistDrawer: React.FC<WinampPlaylistDrawerProps> = ({
  tracks: initialTracks = [],
  currentTrack,
  onTrackSelect,
  onPlayPause,
  className = "",
  autoCollapse = false,
}) => {
  const [tracks, setTracks] = useState<PlaylistTrack[]>(initialTracks);
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const toggleDrawer = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("winamp-drawer-open", String(newState));
  }, [isOpen]);

  useEffect(() => {
    const savedState = localStorage.getItem("winamp-drawer-open");
    if (savedState !== null) {
      setIsOpen(savedState === "true");
    }
  }, []);

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTrackClick = (track: PlaylistTrack) => {
    if (onTrackSelect) {
      onTrackSelect(track);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, track: PlaylistTrack) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTrackClick(track);
    }
  };

  if (autoCollapse && !isOpen) {
    return (
      <div
        className={`fixed bottom-4 right-4 z-50 ${className}`}
        onClick={toggleDrawer}
      >
        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-pixel text-xs rounded shadow-lg transition-colors">
          <span>🎵</span>
          <span>Playlist ({tracks.length})</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDrawer}
            className="font-pixel text-xs text-gray-400 hover:text-white transition-colors"
            aria-label={isOpen ? "Collapse playlist" : "Expand playlist"}
          >
            {isOpen ? "▲" : "▼"}
          </button>
          <h3 className="font-pixel text-xs text-gray-300">Playlist</h3>
          <span className="font-pixel text-xs text-gray-600">({tracks.length})</span>
        </div>

        {currentTrack && (
          <div className="flex items-center gap-2">
            <button
              onClick={onPlayPause}
              className="font-pixel text-xs text-gray-400 hover:text-white transition-colors"
              aria-label="Play/Pause"
            >
              {currentTrack.isPlaying ? "⏸" : "▶"}
            </button>
          </div>
        )}
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${
        isOpen ? "max-h-96" : "max-h-0"
      }`}>
        <div className="space-y-1">
          {tracks.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                className={`font-pixel text-xs rounded transition-all duration-200 ${
                  isCurrent
                    ? "bg-blue-900/50 border border-blue-500/50"
                    : "bg-gray-800/30 hover:bg-gray-700/50"
                }`}
                onClick={() => handleTrackClick(track)}
                onKeyDown={(e) => handleKeyDown(e, track)}
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
                tabIndex={0}
                role="button"
                aria-selected={isCurrent}
              >
                <div className="flex items-center justify-between p-2">
                  <div className="flex-1 min-w-0">
                    <div className={`truncate ${
                      isCurrent ? "text-white font-bold" : "text-gray-300"
                    }`}>
                      {track.title}
                    </div>
                    <div className="text-gray-500 text-xs truncate">
                      {track.artist}
                      {track.album && ` • ${track.album}`}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="text-xs">
                      {formatDuration(track.duration)}
                    </span>
                    
                    {isCurrent && (
                      <span className="text-xs animate-pulse">▶</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isOpen && (
        <div className="mt-2">
          <button
            onClick={toggleDrawer}
            className="w-full font-pixel text-xs text-center text-gray-400 hover:text-white transition-colors"
          >
            Click to expand playlist
          </button>
        </div>
      )}

      {tracks.length === 0 && isOpen && (
        <div className="py-4 text-center">
          <p className="font-pixel text-xs text-gray-600">No tracks in playlist</p>
        </div>
      )}
    </div>
  );
};

export default WinampPlaylistDrawer;