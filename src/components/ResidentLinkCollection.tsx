"use client";

import React, { useState, useEffect } from "react";
import { ResidentLink } from "@/types/links";
import { useThemeStore } from "@/store/useThemeStore";

interface ResidentLinkCollectionProps {
  links?: ResidentLink[];
  username?: string;
  className?: string;
  maxLinks?: number;
}

export const ResidentLinkCollection: React.FC<ResidentLinkCollectionProps> = ({
  links: initialLinks = [],
  username = "resident",
  className = "",
  maxLinks = 50,
}) => {
  const [links, setLinks] = useState<ResidentLink[]>(initialLinks);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    const fetchLinks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/${username}/links`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLinks(data.links.slice(0, maxLinks));
        }
      } catch (error) {
        console.error(`Failed to fetch links for ${username}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, [username, maxLinks]);

  const handleLinkClick = async (link: ResidentLink) => {
    try {
      const response = await fetch(`/api/links/${link.id}/click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setLinks(prev =>
          prev.map(l =>
            l.id === link.id ? { ...l, clickCount: (l.clickCount || 0) + 1 } : l
          )
        );
      }

      window.open(link.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to track link click:", error);
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  const getThemeColors = () => {
    switch (currentTheme) {
      case "retro-matrix":
        return {
          bg: "bg-green-900/20",
          border: "border-green-500/30",
          hover: "hover:bg-green-800/30",
          text: "text-green-300",
          icon: "text-green-400",
        };
      case "windows-gray":
        return {
          bg: "bg-gray-800/30",
          border: "border-gray-600/30",
          hover: "hover:bg-gray-700/30",
          text: "text-gray-300",
          icon: "text-gray-400",
        };
      default:
        return {
          bg: "bg-blue-900/20",
          border: "border-blue-500/30",
          hover: "hover:bg-blue-800/30",
          text: "text-blue-300",
          icon: "text-blue-400",
        };
    }
  };

  const colors = getThemeColors();

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <h3 className="font-pixel text-sm text-gray-400 mb-3">Bilik Rakan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-800/20 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <h3 className="font-pixel text-sm text-gray-400 mb-3">Bilik Rakan</h3>
        <div className="p-4 bg-gray-800/20 rounded border border-gray-700/30">
          <p className="font-pixel text-xs text-gray-500 text-center">
            Tidak ada pautan rakan yang ditemui
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <h3 className="font-pixel text-sm text-gray-400 mb-3">Bilik Rakan</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick(link);
            }}
            className={`flex items-center gap-3 p-3 ${colors.bg} ${colors.border} rounded transition-all duration-200 ${colors.hover}`}
          >
            <div className={`flex-shrink-0 ${colors.icon} text-xl`}>
              {link.icon || "🔗"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-pixel text-xs text-white truncate">
                {link.label}
              </div>
              <div className="font-pixel text-xs text-gray-500 truncate">
                {link.url}
              </div>
              {link.clickCount && (
                <div className="font-pixel text-xs text-gray-600 mt-1">
                  {link.clickCount} clicks
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResidentLinkCollection;
