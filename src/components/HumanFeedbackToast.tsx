// Start: Imports
"use client";
import { useEffect, useState } from 'react';
// End: Imports

// Start: Type Definitions
interface HumanFeedbackToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}
// End: Type Definitions

// Start: HumanFeedbackToast Component
export default function HumanFeedbackToast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: HumanFeedbackToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger hardware-accelerated fade-in
    requestAnimationFrame(() => {
      setAnimate(true);
    });

    const timer = setTimeout(() => {
      setAnimate(false);
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = 'fixed bottom-4 right-4 md:bottom-6 md:right-6 max-w-xs w-full px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300 ease-out';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-white`;
      default:
        return `${baseStyles} bg-blue-500 text-white`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getAnimationStyles = () => {
    if (!animate) return 'opacity-0 translate-y-4';
    return 'opacity-100 translate-y-0';
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`${getToastStyles()} ${getAnimationStyles()}`}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">{getIcon()}</span>
        <span className="font-mono text-sm">{message}</span>
      </div>
    </div>
  );
}
// End: HumanFeedbackToast Component