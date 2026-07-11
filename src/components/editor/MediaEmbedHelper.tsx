// Start: Media Embed Helper Component
import React, { useState } from 'react';

// Start: Media Embed Helper Props Interface
interface MediaEmbedHelperProps {
  onInsertEmbed: (embedCode: string) => void;
  className?: string;
}
// End: Media Embed Helper Props Interface

export default function MediaEmbedHelper({ onInsertEmbed, className }: MediaEmbedHelperProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Start: Embed Snippet Templates
  const embedTemplates = {
    spotify: '<iframe src="https://open.spotify.com/embed/track/XXXXXXXXXXXXXXXXX" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>',
    youtube: '<iframe src="https://www.youtube.com/embed/XXXXXXXXXXXXX" width="560" height="315" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    soundcloud: '<iframe src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/XXXXXXXXXXXXX&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true" width="100%" height="166" frameborder="0" allow="autoplay"></iframe>',
    vimeo: '<iframe src="https://player.vimeo.com/video/XXXXXXXXXXXXX" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>',
    tiktok: '<iframe src="https://www.tiktok.com/embed/v2/XXXXXXXXXXXXX" width="300" height="500" frameborder="0" scrolling="no"></iframe>',
  };
  // End: Embed Snippet Templates

  // Start: Insert Embed Handler
  const handleInsert = (type: keyof typeof embedTemplates) => {
    onInsertEmbed(embedTemplates[type]);
    setIsOpen(false);
  };
  // End: Insert Embed Handler

  return (
    // Start: Floating Media Embed Drawer Container
    <div className={`relative ${className || ''}`}>
      {/* Start: Toggle Drawer Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="retro-btn-secondary flex items-center gap-2 px-3 py-2 pixel-font text-xs"
        title="Buka Panel Media"
      >
        <span>📎</span>
        <span>Media Embed</span>
      </button>
      {/* End: Toggle Drawer Button */}

      {/* Start: Floating Drawer Panel - Responsive Bottom Docking */}
      {isOpen && (
        <div className={`
          absolute top-full right-0 mt-2 w-64 
          bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl z-50 p-3
          md:w-64
          max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:top-auto 
          max-md:w-auto max-md:mt-0 max-md:mx-2 max-md:mb-2 max-md:max-w-none
          max-md:rounded-b-none
        `}>
          {/* Start: Drawer Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-600">
            <h3 className="text-xs font-bold text-gray-200 pixel-font">
              Penyisipan Media
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-200 text-lg"
              title="Tutup"
            >
              ×
            </button>
          </div>
          {/* End: Drawer Header */}

          {/* Start: Embed Options Grid */}
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleInsert('spotify')}
              className="retro-btn-embed-spotify flex items-center gap-2 px-3 py-2 pixel-font text-xs"
            >
              <span className="text-green-400">🎵</span>
              <span>Embed Spotify</span>
            </button>
            
            <button
              onClick={() => handleInsert('youtube')}
              className="retro-btn-embed-youtube flex items-center gap-2 px-3 py-2 pixel-font text-xs"
            >
              <span className="text-red-400">▶️</span>
              <span>Embed YouTube</span>
            </button>
            
            <button
              onClick={() => handleInsert('soundcloud')}
              className="retro-btn-embed-soundcloud flex items-center gap-2 px-3 py-2 pixel-font text-xs"
            >
              <span className="text-orange-400">☁️</span>
              <span>Embed SoundCloud</span>
            </button>
            
            <button
              onClick={() => handleInsert('vimeo')}
              className="retro-btn-embed-vimeo flex items-center gap-2 px-3 py-2 pixel-font text-xs"
            >
              <span className="text-blue-400">🎞️</span>
              <span>Embed Vimeo</span>
            </button>
            
            <button
              onClick={() => handleInsert('tiktok')}
              className="retro-btn-embed-tiktok flex items-center gap-2 px-3 py-2 pixel-font text-xs"
            >
              <span className="text-pink-400">🎵</span>
              <span>Embed TikTok</span>
            </button>
          </div>
          {/* End: Embed Options Grid */}

          {/* Start: Instruction Text */}
          <div className="mt-3 pt-2 border-t border-gray-600">
            <p className="text-xs text-gray-500 pixel-font">
              * Gantikan XXXX dengan ID kandungan anda
            </p>
          </div>
          {/* End: Instruction Text */}
        </div>
      )}
      {/* End: Floating Drawer Panel */}
    </div>
    // End: Floating Media Embed Drawer Container
  );
}