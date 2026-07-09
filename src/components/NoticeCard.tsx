"use client";

import { useState } from 'react';

interface NoticeCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority?: 'high' | 'normal' | 'low';
  isActive?: boolean;
}

export default function NoticeCard({
  id,
  title,
  content,
  author,
  date,
  priority = 'normal',
  isActive = true
}: NoticeCardProps) {
  const [isTilted, setIsTilted] = useState(false);

  const getPriorityStyles = () => {
    switch (priority) {
      case 'high':
        return 'border-red-400 bg-red-50 dark:bg-red-900/20';
      case 'normal':
        return 'border-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'low':
        return 'border-green-400 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const handleTouchStart = () => {
    setIsTilted(true);
  };

  const handleTouchEnd = () => {
    setIsTilted(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div
      className={`
        notice-card
        retro-card
        border-l-4 ${getPriorityStyles()}
        transition-transform duration-200
        ${isTilted ? 'transform -rotate-1' : ''}
        hover:shadow-xl
        active:transform active:-rotate-1
      `}
      onMouseEnter={() => setIsTilted(true)}
      onMouseLeave={() => setIsTilted(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isTilted ? 'rotate(-1deg)' : 'rotate(0deg)',
        willChange: 'transform'
      }}
    >
      {/* Start: Card Header */}
      <div className="retro-card-header bg-gray-100 dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-2">
          <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 pixel-font break-words">
            {title}
          </h3>
          {priority === 'high' && (
            <span className="text-xs font-bold text-red-600 dark:text-red-400 pixel-font">
              PENTING
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font mt-1">
          Diterbitkan: {formatDate(date)} | Penulis: {author}
        </div>
      </div>
      {/* End: Card Header */}

      {/* Start: Card Content */}
      <div className="p-3 bg-white dark:bg-gray-900">
        <p className="text-sm text-gray-700 dark:text-gray-300 pixel-font leading-relaxed break-words">
          {content}
        </p>
      </div>
      {/* End: Card Content */}

      {/* Start: Card Footer */}
      <div className="retro-card-footer bg-gray-50 dark:bg-gray-800 px-3 py-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
          #{id}
        </span>
        <div className="flex gap-1">
          <button
            className="retro-btn-secondary text-xs px-1 py-0.5"
            title="Kongsi"
          >
            📤
          </button>
          <button
            className="retro-btn-secondary text-xs px-1 py-0.5"
            title="Bookmark"
          >
            🔖
          </button>
        </div>
      </div>
      {/* End: Card Footer */}

      {/* Start: CSS Styles */}
      <style jsx>{`
        .notice-card {
          transform-origin: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .notice-card:hover {
          transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        @media (hover: none) and (pointer: coarse) {
          .notice-card:active {
            transform: perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(0.98);
          }
        }

        .retro-card-header {
          position: relative;
        }

        .retro-card-header::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 4px;
          right: 4px;
          height: 6px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);
          border-radius: 50%;
        }
      `}</style>
      {/* End: CSS Styles */}
    </div>
  );
}