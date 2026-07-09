"use client";

import { useState, useRef, useEffect } from 'react';
import { CyberICMetadata, formatICNumber } from '@/types/cyberIC';

interface CyberICCardProps {
  metadata: CyberICMetadata;
  className?: string;
  showDownload?: boolean;
}

export default function CyberICCard({ 
  metadata, 
  className,
  showDownload = true 
}: CyberICCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDownload = () => {
    if (!isMounted || !cardRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up retro styling
    ctx.fillStyle = '#d3d3d3';
    ctx.fillRect(0, 0, 400, 200);

    // Draw pixel border
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 396, 196);

    // Fill with inner color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, 4, 392, 192);

    // Draw header bar
    ctx.fillStyle = '#a9a9a9';
    ctx.fillRect(4, 4, 392, 30);

    // Draw title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('KAMPUNG SIBER RETRO', 12, 22);

    // Draw citizen name
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(metadata.citizenName, 12, 70);

    // Draw IC number
    ctx.fillStyle = '#333333';
    ctx.font = '14px monospace';
    ctx.fillText(`IC: ${formatICNumber(metadata.icNumber)}`, 12, 100);

    // Draw title
    ctx.fillStyle = '#666666';
    ctx.font = '12px monospace';
    ctx.fillText(`Jawatan: ${metadata.activeTitle}`, 12, 125);

    // Draw village zone
    ctx.fillStyle = '#666666';
    ctx.font = '12px monospace';
    ctx.fillText(`Zon: ${metadata.villageZone}`, 12, 145);

    // Draw registration date
    ctx.fillStyle = '#999999';
    ctx.font = '11px monospace';
    ctx.fillText(`Tarikh Daftar: ${metadata.registrationDate}`, 12, 165);

    // Draw footer
    ctx.fillStyle = '#a9a9a9';
    ctx.fillRect(4, 170, 392, 26);

    // Draw footer text
    ctx.fillStyle = '#000000';
    ctx.font = '10px monospace';
    ctx.fillText('DICETAK: ' + new Date().toLocaleDateString('ms-MY'), 12, 185);

    // Convert to PNG and trigger download
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `cyber-ic-${metadata.citizenName.replace(/\s+/g, '_').toLowerCase()}.png`;
    link.href = dataURL;
    link.click();
  };

  const handlePrint = () => {
    if (!isMounted || !cardRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cardContent = cardRef.current.outerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cyber IC - ${metadata.citizenName}</title>
        <style>
          body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; }
          .card-container { background: #fff; border: 2px solid #808080; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        </style>
      </head>
      <body>
        <div class="card-container">${cardContent}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div 
      ref={cardRef}
      className={`
        retro-ic-card 
        bg-gray-100 dark:bg-gray-800 
        border-4 border-gray-400 dark:border-gray-500 
        rounded-pixel shadow-inner
        w-full max-w-sm
        ${isMounted ? 'block' : 'invisible'}
        ${className || ''}
      `}
    >
      {/* Start: Header Bar */}
      <div className="retro-ic-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b-2 border-gray-300 dark:border-gray-400">
        <div className="text-center font-bold text-sm text-gray-800 dark:text-gray-200 pixel-font">
          KAMPUNG SIBER RETRO
        </div>
      </div>
      {/* End: Header Bar */}

      {/* Start: Body Content */}
      <div className="p-4 bg-white dark:bg-gray-900">
        {/* Citizen Name */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide pixel-font">
            Nama Penduduk
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100 pixel-font break-words">
            {metadata.citizenName}
          </div>
        </div>

        {/* IC Number */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide pixel-font">
            No. IC
          </div>
          <div className="font-mono text-lg text-gray-800 dark:text-gray-200 pixel-font">
            {formatICNumber(metadata.icNumber)}
          </div>
        </div>

        {/* Active Title */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide pixel-font">
            Jawatan
          </div>
          <div className="text-base text-gray-700 dark:text-gray-300 pixel-font">
            {metadata.activeTitle}
          </div>
        </div>

        {/* Village Zone */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide pixel-font">
            Zon Desa
          </div>
          <div className="text-base text-gray-700 dark:text-gray-300 pixel-font">
            {metadata.villageZone}
          </div>
        </div>

        {/* Registration Date */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide pixel-font">
            Tarikh Daftar
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 pixel-font">
            {new Date(metadata.registrationDate).toLocaleDateString('ms-MY')}
          </div>
        </div>
      </div>
      {/* End: Body Content */}

      {/* Start: Footer Bar */}
      <div className="retro-ic-footer bg-gray-200 dark:bg-gray-700 px-4 py-2 border-t-2 border-gray-300 dark:border-gray-400 flex justify-between items-center">
        <div className="text-xs text-gray-600 dark:text-gray-400 pixel-font">
          Dicetak: {new Date().toLocaleDateString('ms-MY')}
        </div>
        {showDownload && (
          <div className="flex gap-1">
            <button
              onClick={handleDownload}
              className="retro-btn-secondary text-xs px-2 py-1 flex items-center gap-1"
            >
              📥 Muat Turun
            </button>
            <button
              onClick={handlePrint}
              className="retro-btn-secondary text-xs px-2 py-1 flex items-center gap-1"
            >
              🖨️ Cetak
            </button>
          </div>
        )}
      </div>
      {/* End: Footer Bar */}
    </div>
  );
}