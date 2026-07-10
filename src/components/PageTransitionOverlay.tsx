"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionOverlayProps {
  children: React.ReactNode;
}

export default function PageTransitionOverlay({ children }: PageTransitionOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] = useState<string | null>(null);

  useEffect(() => {
    if (previousPathname !== null && previousPathname !== pathname) {
      setIsVisible(true);
      setIsTransitioning(true);

      // Fade out after 500ms
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setTimeout(() => {
          setIsVisible(false);
        }, 300);
      }, 500);

      return () => clearTimeout(timer);
    }
    setPreviousPathname(pathname);
  }, [pathname, previousPathname]);

  return (
    <>
      {children}
      <div 
        className={`page-transition-overlay ${
          isVisible ? 'visible' : 'invisible'
        } ${
          isTransitioning ? 'transitioning' : ''
        }`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 500ms ease-in-out',
          pointerEvents: isVisible ? 'none' : 'none',
          zIndex: 9999,
        }}
      />
    </>
  );
}