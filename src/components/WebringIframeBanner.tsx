"use client";

import React, { useState, useEffect, useRef } from "react";

interface WebringEntry {
  id: string;
  username: string;
  url: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  lastVisited?: string;
  visitCount?: number;
}

interface WebringIframeBannerProps {
  entries?: WebringEntry[];
  autoRotate?: boolean;
  rotationInterval?: number;
  allowUnsafeUrls?: boolean;
  className?: string;
  height?: number;
}

export const WebringIframeBanner: React.FC<WebringIframeBannerProps> = ({
  entries: initialEntries = [],
  autoRotate = true,
  rotationInterval = 10000,
  allowUnsafeUrls = false,
  className = "",
  height = 80,
}) => {
  const [entries, setEntries] = useState<WebringEntry[]>(initialEntries);
  const [currentEntry, setCurrentEntry] = useState<WebringEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const fetchWebringEntries = async () => {
      try {
        const response = await fetch("/api/webring/next", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.entries && data.entries.length > 0) {
            setEntries(data.entries);
            setCurrentEntry(data.entries[0]);
          } else if (data.entry) {
            setEntries([data.entry]);
            setCurrentEntry(data.entry);
          }
        }
      } catch (error) {
        console.error("Failed to fetch webring entries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebringEntries();
  }, []);

  useEffect(() => {
    if (!autoRotate || entries.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentEntry((prev) => {
        const currentIndex = entries.findIndex(e => e.id === prev?.id);
        const nextIndex = (currentIndex + 1) % entries.length;
        return entries[nextIndex];
      });
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, entries, rotationInterval]);

  useEffect(() => {
    if (currentEntry && iframeRef.current) {
      const handleLoad = () => {
        setHasError(false);
      };

      const handleError = () => {
        setHasError(true);
      };

      const iframe = iframeRef.current;
      iframe.addEventListener("load", handleLoad);
      iframe.addEventListener("error", handleError);

      return () => {
        iframe.removeEventListener("load", handleLoad);
        iframe.removeEventListener("error", handleError);
      };
    }
  }, [currentEntry]);

  const isUrlSafe = (url: string): boolean => {
    if (!allowUnsafeUrls) {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "https:";
      } catch {
        return false;
      }
    }
    return true;
  };

  const handleNavigate = (entry: WebringEntry) => {
    if (isUrlSafe(entry.url) || allowUnsafeUrls) {
      window.open(entry.url, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <span className="font-pixel text-xs text-gray-500">Loading webring...</span>
        </div>
      </div>
    );
  }

  if (hasError || !currentEntry) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <div className="flex items-center justify-center h-full p-2">
          <span className="font-pixel text-xs text-gray-600 text-center">
            Webring unavailable
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <div className="relative w-full h-full rounded overflow-hidden border border-gray-700/30 bg-gray-800/30">
        {currentEntry.isActive && isUrlSafe(currentEntry.url) ? (
          <iframe
            ref={iframeRef}
            src={currentEntry.url}
            title={currentEntry.title}
            className="w-full h-full"
            style={{ border: "none" }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-2">
            <h4 className="font-pixel text-xs text-gray-300 mb-1 text-center">
              {currentEntry.title}
            </h4>
            <p className="font-pixel text-xs text-gray-500 text-center mb-2">
              {currentEntry.description}
            </p>
            <button
              onClick={() => handleNavigate(currentEntry)}
              className="px-3 py-1 bg-blue-600/50 hover:bg-blue-600 text-white font-pixel text-xs rounded transition-colors"
            >
              Visit Site
            </button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-black/50 flex items-center justify-between p-1">
          <div className="font-pixel text-xs text-gray-300">
            {currentEntry.username}
          </div>
          
          <div className="flex gap-1">
            {entries.map((entry, index) => (
              <button
                key={entry.id}
                onClick={() => setCurrentEntry(entry)}
                className={`w-2 h-2 rounded-full transition-all ${
                  entry.id === currentEntry.id
                    ? "bg-white"
                    : "bg-gray-500/50 hover:bg-gray-300"
                }`}
                aria-label={`Navigate to ${entry.username}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebringIframeBanner;