"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, Heart, Star, User, Share2, Check, X, RefreshCw, HeartHandshake } from "lucide-react";

interface CssConfettiTriggerProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
  onTrigger?: () => void;
  autoTrigger?: boolean;
  triggerDelay?: number;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: "heart" | "star" | "circle" | "pixel";
  delay: number;
  duration: number;
  dx: number;
  dy: number;
  rotation: number;
  rotationSpeed: number;
}

const DEFAULT_PARTICLE_COUNT = 50;
const DEFAULT_COLORS = ["#ff6b6b", "#ffa502", "#ffef00", "#2ecc71", "#9b59b6", "#1abc9c", "#e74c3c", "#f39c12"];

export default function CssConfettiTrigger({ 
  className,
  particleCount = DEFAULT_PARTICLE_COUNT,
  colors = DEFAULT_COLORS,
  onTrigger,
  autoTrigger = false,
  triggerDelay = 0,
}: CssConfettiTriggerProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isTriggered, setIsTriggered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  useEffect(() => {
    if (autoTrigger) {
      const timer = setTimeout(() => {
        triggerConfetti();
      }, triggerDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoTrigger, triggerDelay]);

  const getRandomColor = useCallback(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, [colors]);

  const getRandomShape = useCallback(() => {
    const shapes: ("heart" | "star" | "circle" | "pixel")[] = ["heart", "star", "circle", "pixel"];
    return shapes[Math.floor(Math.random() * shapes.length)];
  }, []);

  const createParticle = useCallback((index: number): ConfettiParticle => {
    return {
      id: particleIdRef.current++,
      x: Math.random() * 100,
      y: -10,
      size: Math.random() * 10 + 8,
      color: getRandomColor(),
      shape: getRandomShape(),
      delay: Math.random() * 2,
      duration: Math.random() * 1.5 + 1,
      dx: (Math.random() - 0.5) * 10,
      dy: Math.random() * 5 + 5,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 + 5,
    };
  }, [getRandomColor, getRandomShape]);

  const triggerConfetti = useCallback(() => {
    const newParticles: ConfettiParticle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push(createParticle(i));
    }
    
    setParticles(newParticles);
    setIsTriggered(true);
    onTrigger?.();
    
    setTimeout(() => {
      setParticles([]);
      setIsTriggered(false);
    }, 3000);
  }, [particleCount, createParticle, onTrigger]);

  const renderHeart = (size: number, color: string) => {
    return (
      <svg viewBox="0 0 24 24" className="absolute" style={{ width: size, height: size }}>
        <path 
          fill={color} 
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
    );
  };

  const renderStar = (size: number, color: string) => {
    return (
      <svg viewBox="0 0 24 24" className="absolute" style={{ width: size, height: size }}>
        <path 
          fill={color} 
          d="M12 2l2.9 5.9h6.1l-4.7 3.6 1.8 6.6-5.2-3.4-5.2 3.4 1.8-6.6-4.7-3.6h6.1z"
        />
      </svg>
    );
  };

  const renderCircle = (size: number, color: string) => {
    return (
      <svg viewBox="0 0 24 24" className="absolute" style={{ width: size, height: size }}>
        <circle cx="12" cy="12" r="12" fill={color} />
      </svg>
    );
  };

  const renderPixel = (size: number, color: string) => {
    return (
      <div 
        className="pixelated"
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: color,
          imageRendering: "pixelated",
          border: "1px solid " + color,
        }}
      />
    );
  };

  const renderParticle = (particle: ConfettiParticle) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      animationDelay: `${particle.delay}s`,
      animationDuration: `${particle.duration}s`,
      animationTimingFunction: "ease-out",
      animationFillMode: "forwards",
      transform: `rotate(${particle.rotation}deg)`,
      animationName: "confetti-fall",
    };

    switch (particle.shape) {
      case "heart":
        return (
          <div key={particle.id} style={style}>
            {renderHeart(particle.size, particle.color)}
          </div>
        );
      case "star":
        return (
          <div key={particle.id} style={style}>
            {renderStar(particle.size, particle.color)}
          </div>
        );
      case "circle":
        return (
          <div key={particle.id} style={style}>
            {renderCircle(particle.size, particle.color)}
          </div>
        );
      case "pixel":
      default:
        return (
          <div key={particle.id} style={style}>
            {renderPixel(particle.size, particle.color)}
          </div>
        );
    }
  };

  return (
    <div className={`relative ${className || ""}`}>
      <button
        onClick={triggerConfetti}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 
          text-emerald-400 transition-colors pixel-font"
      >
        <Sparkles className="h-4 w-4" />
        Trigger Confetti
      </button>

      <div ref={containerRef} className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {particles.map(renderParticle)}
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            top: -10%;
            opacity: 1;
            transform: rotate(0deg) translateY(0);
          }
          100% {
            top: 110%;
            opacity: 0;
            transform: rotate(720deg) translateY(200vh);
          }
        }
        
        .pixelated {
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  );
}

export const useConfettiTrigger = (options?: {
  particleCount?: number;
  colors?: string[];
  autoTrigger?: boolean;
  triggerDelay?: number;
}) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isTriggered, setIsTriggered] = useState(false);
  const particleIdRef = useRef(0);

  const getRandomColor = useCallback(() => {
    const colors = options?.colors || DEFAULT_COLORS;
    return colors[Math.floor(Math.random() * colors.length)];
  }, [options?.colors]);

  const getRandomShape = useCallback(() => {
    const shapes: ("heart" | "star" | "circle" | "pixel")[] = ["heart", "star", "circle", "pixel"];
    return shapes[Math.floor(Math.random() * shapes.length)];
  }, []);

  const createParticle = useCallback((index: number): ConfettiParticle => {
    return {
      id: particleIdRef.current++,
      x: Math.random() * 100,
      y: -10,
      size: Math.random() * 10 + 8,
      color: getRandomColor(),
      shape: getRandomShape(),
      delay: Math.random() * 2,
      duration: Math.random() * 1.5 + 1,
      dx: (Math.random() - 0.5) * 10,
      dy: Math.random() * 5 + 5,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 + 5,
    };
  }, [getRandomColor, getRandomShape]);

  const trigger = useCallback(() => {
    const count = options?.particleCount || DEFAULT_PARTICLE_COUNT;
    const newParticles: ConfettiParticle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push(createParticle(i));
    }
    
    setParticles(newParticles);
    setIsTriggered(true);
    
    setTimeout(() => {
      setParticles([]);
      setIsTriggered(false);
    }, 3000);
  }, [options?.particleCount, createParticle]);

  return {
    particles,
    isTriggered,
    trigger,
  };
};

export const createRetroConfetti = () => {
  const Hearts = () => {
    const [active, setActive] = useState(false);
    const [particles, setParticles] = useState<ConfettiParticle[]>([]);
    
    const trigger = () => {
      const newParticles: ConfettiParticle[] = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: 50,
          y: -10,
          size: 12,
          color: "#ff6b6b",
          shape: "heart",
          delay: 0,
          duration: 2,
          dx: 0,
          dy: 8,
          rotation: Math.random() * 360,
          rotationSpeed: 5,
        });
      }
      setParticles(newParticles);
      setActive(true);
      setTimeout(() => {
        setActive(false);
        setParticles([]);
      }, 2000);
    };
    
    return { trigger, active, particles };
  };
  
  const Stars = () => {
    const [active, setActive] = useState(false);
    const [particles, setParticles] = useState<ConfettiParticle[]>([]);
    
    const trigger = () => {
      const newParticles: ConfettiParticle[] = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: 50,
          y: -10,
          size: 10,
          color: "#ffd93d",
          shape: "star",
          delay: 0,
          duration: 2,
          dx: 0,
          dy: 8,
          rotation: Math.random() * 360,
          rotationSpeed: 5,
        });
      }
      setParticles(newParticles);
      setActive(true);
      setTimeout(() => {
        setActive(false);
        setParticles([]);
      }, 2000);
    };
    
    return { trigger, active, particles };
  };
  
  const PixelRain = () => {
    const [active, setActive] = useState(false);
    const [particles, setParticles] = useState<ConfettiParticle[]>([]);
    
    const trigger = () => {
      const newParticles: ConfettiParticle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: -10,
          size: 6,
          color: ["#00d2d3", "#3f729b", "#6a11cb"][Math.floor(Math.random() * 3)],
          shape: "pixel",
          delay: Math.random() * 1,
          duration: Math.random() * 2 + 1,
          dx: (Math.random() - 0.5) * 5,
          dy: Math.random() * 5 + 5,
          rotation: 0,
          rotationSpeed: 0,
        });
      }
      setParticles(newParticles);
      setActive(true);
      setTimeout(() => {
        setActive(false);
        setParticles([]);
      }, 3000);
    };
    
    return { trigger, active, particles };
  };
  
  return { Hearts, Stars, PixelRain };
};