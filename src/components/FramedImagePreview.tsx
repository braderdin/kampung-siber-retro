"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Image, Download, Copy, ExternalLink, ZoomIn, ZoomOut, X, RefreshCw, Heart, Star, Crown } from "lucide-react";

interface FramedImagePreviewProps {
  src?: string;
  alt?: string;
  title?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  showControls?: boolean;
  showDownload?: boolean;
  showActions?: boolean;
  frameless?: boolean;
  borderRadius?: number;
}

interface ImageState {
  loaded: boolean;
  error: boolean;
  imageUrl: string;
  scale: number;
  isDragging: boolean;
}

const DEFAULT_WIDTH = "100%";
const DEFAULT_HEIGHT = "300px";

export default function FramedImagePreview({ 
  src,
  alt = "Image preview",
  title,
  className,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  showControls = true,
  showDownload = true,
  showActions = true,
  frameless = false,
  borderRadius = 16,
}: FramedImagePreviewProps) {
  const [state, setState] = useState<ImageState>({
    loaded: false,
    error: false,
    imageUrl: "",
    scale: 1,
    isDragging: false,
  });
  
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [initialDrag, setInitialDrag] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (src) {
      setState(prev => ({ ...prev, imageUrl: src, loaded: false, error: false }));
    }
  }, [src]);

  const handleImageLoad = useCallback(() => {
    setState(prev => ({ ...prev, loaded: true, error: false }));
  }, []);

  const handleImageError = useCallback(() => {
    setState(prev => ({ ...prev, error: true, loaded: false }));
  }, []);

  const handleDownload = useCallback(async () => {
    if (!state.imageUrl) return;

    try {
      const response = await fetch(state.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = title ? `${title}.png` : "image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed:", e);
    }
  }, [state.imageUrl, title]);

  const copyToClipboard = useCallback(async () => {
    if (!state.imageUrl) return;
    
    try {
      await navigator.clipboard.writeText(state.imageUrl);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  }, [state.imageUrl]);

  const zoomIn = useCallback(() => {
    setState(prev => ({ ...prev, scale: Math.min(prev.scale + 0.2, 3) }));
  }, []);

  const zoomOut = useCallback(() => {
    setState(prev => ({ ...prev, scale: Math.max(prev.scale - 0.2, 0.5) }));
  }, []);

  const resetZoom = useCallback(() => {
    setState(prev => ({ ...prev, scale: 1 }));
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    setState(prev => ({ ...prev, isDragging: true }));
    setInitialDrag({ x: e.clientX, y: e.clientY });
  }, []);

  const handleDragMove = useCallback((e: React.MouseEvent) => {
    if (!state.isDragging || !containerRef.current) return;
    
    const deltaX = e.clientX - initialDrag.x;
    const deltaY = e.clientY - initialDrag.y;
    setDragPosition({ x: deltaX, y: deltaY });
  }, [state.isDragging, initialDrag]);

  const handleDragEnd = useCallback(() => {
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const renderPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="p-4 rounded-full bg-gray-800/50 mb-3">
        <Image className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="pixel-font text-lg font-semibold text-gray-200 mb-2">
        {title || "Imej Tidak Ditunjukkan"}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 pixel-font">
        Masukkan URL imej untuk memuat prasyaran
      </p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="p-4 rounded-full bg-red-500/20 mb-3">
        <X className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="pixel-font text-lg font-semibold text-red-200 mb-2">
        Gagal Memuat Imej
      </h3>
      <p className="text-sm text-red-300 pixel-font mb-3">
        {src || "URL tidak sah"}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-3 py-1 text-sm rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors pixel-font"
      >
        <RefreshCw className="h-4 w-4 inline mr-1" />
        Cuba Semula
      </button>
    </div>
  );

  const renderImage = () => (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ cursor: state.isDragging ? "grabbing" : "grab" }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <img
        ref={imageRef}
        src={state.imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          transform: `scale(${state.scale}) translate(${dragPosition.x}px, ${dragPosition.y}px)`,
          transition: state.isDragging ? "none" : "transform 0.2s ease",
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {state.loaded && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            title "Zum bolak"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            title "Zum tinggi"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );

  if (!src) {
    return (
      <div 
        className={`border-2 border-dashed rounded-[${borderRadius}px] ${className || ""}`}
        style={{ width, height }}
      >
        {renderPlaceholder()}
      </div>
    );
  }

  if (state.error) {
    return (
      <div 
        className={`border-2 border-dashed rounded-[${borderRadius}px] ${className || ""}`}
        style={{ width, height }}
      >
        {renderError()}
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className || ""}`}
      style={{ width, height, borderRadius: frameless ? 0 : borderRadius }}
    >
      <div 
        className={`flex items-center justify-between p-3 border-b border-gray-700 ${
          frameless ? "rounded-t-[${borderRadius}px]" : "rounded-[${borderRadius}px]"
        }`}
        style={{ borderBottomLeftRadius: frameless ? 0 : borderRadius, borderBottomRightRadius: frameless ? 0 : borderRadius }}
      >
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-cyan-400" />
          <h3 className="pixel-font text-sm font-semibold text-gray-200">
            {title || "Imej Preview"}
          </h3>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1">
            <button
              onClick={copyToClipboard}
              className="p-1 rounded-full hover:bg-gray-800/50 text-gray-400 transition-colors"
              title="Salin URL"
            >
              <Copy className="h-3 w-3" />
            </button>
            
            {showDownload && (
              <button
                onClick={handleDownload}
                className="p-1 rounded-full hover:bg-gray-800/50 text-gray-400 transition-colors"
                title="Muat turun"
              >
                <Download className="h-3 w-3" />
              </button>
            )}
            
            <button
              onClick={() => resetZoom()}
              className="p-1 rounded-full hover:bg-gray-800/50 text-gray-400 transition-colors"
              title="Reset zoom"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      
      <div 
        className="bg-gradient-to-br from-gray-900 to-gray-950"
        style={{ 
          height: `calc(100% - 48px)`,
          borderTopLeftRadius: frameless ? 0 : borderRadius,
          borderTopRightRadius: frameless ? 0 : borderRadius,
        }}
      >
        {state.loaded ? renderImage() : (
          <div className="w-full h-full">
            <img
              src={state.imageUrl}
              alt={alt}
              className="w-full h-full object-cover"
              style={{ transform: `scale(${state.scale})` }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export const useImagePreview = (initialSrc?: string) => {
  const [state, setState] = useState<ImageState>({
    loaded: false,
    error: false,
    imageUrl: initialSrc || "",
    scale: 1,
    isDragging: false,
  });

  const loadImage = useCallback((src: string) => {
    setState(prev => ({ 
      ...prev, 
      imageUrl: src, 
      loaded: false, 
      error: false,
      scale: 1,
    }));
  }, []);

  const zoomIn = useCallback(() => {
    setState(prev => ({ ...prev, scale: Math.min(prev.scale + 0.2, 3) }));
  }, []);

  const zoomOut = useCallback(() => {
    setState(prev => ({ ...prev, scale: Math.max(prev.scale - 0.2, 0.5) }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({ ...prev, scale: 1 }));
  }, []);

  return {
    state,
    setState,
    loadImage,
    zoomIn,
    zoomOut,
    reset,
  };
};

export const ImageGalleryPreview = ({ 
  images,
  className,
}: {
  images: Array<{ src: string; alt: string; title?: string }>;
  className?: string;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`flex gap-2 ${className || ""}`}>
        <div className="text-center py-8">
          <Image className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 pixel-font">Tiada imej</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex gap-2 overflow-x-auto ${className || ""}`}>
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => openModal(index)}
            className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-emerald-500 transition-all"
          >
            <img 
              src={img.src} 
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative bg-gray-900 rounded-xl p-4 max-w-2xl w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            
            <img
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              className="w-full h-96 object-contain rounded-lg"
            />
            
            {images[selectedIndex].title && (
              <p className="mt-2 text-center text-gray-300 pixel-font">
                {images[selectedIndex].title}
              </p>
            )}
            
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedIndex 
                      ? "bg-emerald-400" 
                      : "bg-gray-600 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};