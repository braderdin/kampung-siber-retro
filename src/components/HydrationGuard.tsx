"use client";

import { useState, useEffect } from 'react';

interface HydrationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

export default function HydrationGuard({ 
  children, 
  fallback = null, 
  delay = 0 
}: HydrationGuardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
    }
  }, [delay]);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Higher-order component version
export function withHydrationGuard<P extends {}>(Component: React.ComponentType<P>) {
  return function HydrationGuardedComponent(props: P) {
    return (
      <HydrationGuard>
        <Component {...props} />
      </HydrationGuard>
    );
  };
}

// Hook version for custom usage
export function useHydrationGuard(delay: number = 0) {
  const [isMounted, setIsMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
    }
  }, [delay]);

  return { isMounted, shouldRender };
}