"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
interface Html2CanvasOptions {
  backgroundColor?: string;
  scale?: number;
}

interface ProfileCardExporterProps {
  username: string;
  avatar?: string;
  bio?: string;
  joinDate?: string;
  className?: string;
}

export const ProfileCardExporter: React.FC<ProfileCardExporterProps> = ({
  username,
  avatar,
  bio,
  joinDate,
  className = "",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const captureCard = useCallback(async () => {
    if (!cardRef.current) return;

    setIsExporting(true);

    try {
      // Start: Dynamic import html2canvas
      const html2canvasModule = await import("html2canvas");
      const html2canvasFn = html2canvasModule.default || html2canvasModule;
      // End: Dynamic import html2canvas
      
      const canvas = await html2canvasFn(cardRef.current, {
        backgroundColor: "#0a0a0a",
        scale: 2,
      } as Html2CanvasOptions) as HTMLCanvasElement;
      
      const dataURL = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = `${username}-profile-card.png`;
      link.href = dataURL;
      link.click();
    } catch (error) {
      console.error("Failed to export profile card:", error);
    } finally {
      setIsExporting(false);
    }
  }, [username]);

  return (
    <div className={`inline-block ${className}`}>
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4 w-64"
      >
        <div className="flex items-center gap-3 mb-3">
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/50"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-600/50 flex items-center justify-center">
              <span className="font-pixel text-xs text-white">{username[0].toUpperCase()}</span>
            </div>
          )}
          <div>
            <h3 className="font-pixel text-sm text-white">{username}</h3>
            <p className="font-pixel text-xs text-gray-400">
              {mounted && joinDate ? new Date(joinDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              }) : "Resident"}
            </p>
          </div>
        </div>

        {bio && (
          <p className="font-pixel text-xs text-gray-300 line-clamp-3 mb-3">
            {bio}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={captureCard}
            disabled={isExporting}
            className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-pixel text-xs rounded transition-colors"
          >
            {isExporting ? "Exporting..." : "Export PNG"}
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(`https://kampung-siber-retro.vercel.app/site/${username}`)}
            className="px-3 py-1 bg-gray-800/30 hover:bg-gray-700/50 text-gray-300 font-pixel text-xs rounded transition-colors"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardExporter;
