// Start: Publish Site Button Component with Retro Construction Loading
import React, { useState } from 'react';

// Start: Publish Site Button Props Interface
interface PublishSiteButtonProps {
  filename: string;
  content: string;
  mimeType?: string;
  onPublishComplete?: (success: boolean) => void;
  className?: string;
}
// End: Publish Site Button Props Interface

export default function PublishSiteButton({ 
  filename, 
  content, 
  mimeType = 'text/html', 
  onPublishComplete,
  className 
}: PublishSiteButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Start: Retro Construction Loading Frames
  const loadingFrames = ['🧱', '🧱🧱', '🧱🧱🧱', '🏗️', '🏗️🧱', '🏗️🧱🧱', '✅'];
  const [loadingFrameIndex, setLoadingFrameIndex] = useState(0);
  // End: Retro Construction Loading Frames

  // Start: Loading Animation Effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPublishing) {
      interval = setInterval(() => {
        setLoadingFrameIndex(prev => (prev + 1) % loadingFrames.length);
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPublishing, loadingFrames.length]);
  // End: Loading Animation Effect

  // Start: Handle Publish to R2
  const handlePublish = async () => {
    if (!filename) {
      setPublishStatus('error');
      return;
    }

    setIsPublishing(true);
    setPublishStatus('idle');

    try {
      const sessionToken = localStorage.getItem('sb-access-token');
      if (!sessionToken) {
        throw new Error('Sesi tidak sah - sila log masuk semula');
      }

      const response = await fetch('/api/storage/upload', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          fileName: filename,
          content: content,
          mimeType: mimeType,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Gagal menerbitkan kandungan');
      }

      setPublishStatus('success');
      onPublishComplete?.(true);

      // Reset status after 3 seconds
      setTimeout(() => setPublishStatus('idle'), 3000);
    } catch (error) {
      console.error('Publish error:', error);
      setPublishStatus('error');
      onPublishComplete?.(false);
      
      // Reset status after 3 seconds
      setTimeout(() => setPublishStatus('idle'), 3000);
    } finally {
      setIsPublishing(false);
      setLoadingFrameIndex(0);
    }
  };
  // End: Handle Publish to R2

  return (
    // Start: Retro Publish Button Container
    <button
      onClick={handlePublish}
      disabled={isPublishing || !filename}
      className={`
        retro-btn-publish flex items-center gap-2 px-4 py-2 pixel-font text-sm
        disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
        ${publishStatus === 'success' ? 'retro-btn-publish-success' : ''}
        ${publishStatus === 'error' ? 'retro-btn-publish-error' : ''}
        ${className || ''}
      `}
      title="Hantar & Kemas Kini Teratak"
    >
      {/* Start: Button Icon with Construction Loading Animation */}
      {isPublishing ? (
        <span className="animate-pulse">{loadingFrames[loadingFrameIndex]}</span>
      ) : publishStatus === 'success' ? (
        <span className="text-green-300">✅</span>
      ) : publishStatus === 'error' ? (
        <span className="text-red-300">❌</span>
      ) : (
        <span>🚀</span>
      )}
      {/* End: Button Icon with Construction Loading Animation */}

      {/* Start: Button Text */}
      {isPublishing ? 'MENERBITKAN... ' : publishStatus === 'success' ? 'DIKEMAS KINI!' : publishStatus === 'error' ? 'GAGAL!' : 'Hantar & Kemas Kini Teratak'}
      {/* End: Button Text */}
    </button>
    // End: Retro Publish Button Container
  );
}