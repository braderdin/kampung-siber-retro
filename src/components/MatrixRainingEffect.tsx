"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Matrix, Zap, Shield, Activity, Settings, Play, Pause } from "lucide-react";

interface MatrixRainingEffectProps {
  className?: string;
  columnCount?: number;
  speed?: number;
  fontSize?: number;
  characters?: string;
  color?: string;
  backgroundColor?: string;
  onCharCaptured?: (char: string) => void;
}

interface Column {
  x: number;
  y: number;
  characters: string[];
  speed: number;
  headIndex: number;
  maxParticles: number;
}

const DEFAULT_COLUMN_COUNT = 20;
const DEFAULT_SPEED = 3;
const DEFAULT_FONT_SIZE = 14;
const DEFAULT_CHARACTERS = "アァィィウゥウゥエエェエオオゴオグササズズセセソソタタチチツツテテナナニニヌヌヘヘホホママミミムムワワヰヱヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*()_+-=[]{}|;':\",./<>?";
const DEFAULT_COLOR = "#00ff41";
const DEFAULT_BACKGROUND = "rgba(0, 0, 0, 0.8)";

export default function MatrixRainingEffect({ 
  className,
  columnCount = DEFAULT_COLUMN_COUNT,
  speed = DEFAULT_SPEED,
  fontSize = DEFAULT_FONT_SIZE,
  characters = DEFAULT_CHARACTERS,
  color = DEFAULT_COLOR,
  backgroundColor = DEFAULT_BACKGROUND,
  onCharCaptured,
}: MatrixRainingEffectProps) {
  const [isRunning, setIsRunning] = useState(true);
  const [columns, setColumns] = useState<Column[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const columnsRef = useRef<Column[]>([]);
  const isClient = useRef(false);

  const initColumns = useCallback(() => {
    const cols: Column[] = [];
    const characterArray = characters.split("");
    
    for (let i = 0; i < columnCount; i++) {
      const chars: string[] = [];
      const maxParticles = Math.floor(Math.random() * 10) + 5;
      
      for (let j = 0; j < maxParticles; j++) {
        chars.push(characterArray[Math.floor(Math.random() * characterArray.length)]);
      }
      
      cols.push({
        x: i * (canvasRef.current?.width || 0) / columnCount,
        y: 0,
        characters: chars,
        speed: speed * (0.5 + Math.random()),
        headIndex: 0,
        maxParticles,
      });
    }
    
    return cols;
  }, [columnCount, speed, characters]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const columns = columnsRef.current;
    const characterArray = characters.split("");
    
    columns.forEach((column) => {
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = color;
      
      const headChar = column.characters[column.headIndex % column.characters.length];
      ctx.fillText(headChar, column.x, column.y);
      
      ctx.fillStyle = "rgba(0, 255, 65, 0.5)";
      
      for (let i = 1; i < column.characters.length; i++) {
        const char = column.characters[(column.headIndex + i) % column.characters.length];
        const y = column.y + i * fontSize;
        
        if (y > canvas.height) break;
        
        ctx.fillText(char, column.x, y);
      }
      
      column.y += column.speed;
      
      if (column.y > canvas.height) {
        column.y = 0;
        column.headIndex = 0;
        column.characters = [];
        
        const maxParticles = Math.floor(Math.random() * 10) + 5;
        for (let j = 0; j < maxParticles; j++) {
          column.characters.push(characterArray[Math.floor(Math.random() * characterArray.length)]);
        }
        column.maxParticles = maxParticles;
        
        if (onCharCaptured) {
          onCharCaptured(headChar);
        }
      }
      
      column.headIndex = (column.headIndex + 1) % column.maxParticles;
    });
    
    animationRef.current = requestAnimationFrame(draw);
  }, [fontSize, color, backgroundColor, characters, onCharCaptured]);

  useEffect(() => {
    isClient.current = true;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      columnsRef.current = initColumns();
    };
    
    resize();
    
    window.addEventListener("resize", resize);
    
    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initColumns]);

  useEffect(() => {
    if (isClient.current && !animationRef.current) {
      animationRef.current = requestAnimationFrame(draw);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  const toggleRunning = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  return (
    <div className={`relative ${className || ""}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-48 rounded-lg"
        style={{ display: isRunning ? "block" : "none" }}
      />
      
      {!isRunning && (
        <div className="w-full h-48 rounded-lg bg-gray-900 flex items-center justify-center">
          <Play className="h-6 w-6 text-gray-400" />
        </div>
      )}
      
      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={toggleRunning}
          className="flex items-center gap-2 px-3 py-1 text-sm rounded bg-gray-800/50 hover:bg-gray-700 
            text-gray-300 transition-colors pixel-font"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? "Berhentikan" : "Mulakan"}
        </button>
        
        <div className="text-xs text-gray-500 pixel-font">
          <Zap className="h-3 w-3 inline mr-1" />
          {columnsRef.current?.length || 0} Kolum
        </div>
      </div>
    </div>
  );
}

export const useMatrixEffect = (options?: {
  columnCount?: number;
  speed?: number;
  characters?: string;
}) => {
  const [isRunning, setIsRunning] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const columnsRef = useRef<any[]>([]);
  const isClient = useRef(false);

  useEffect(() => {
    isClient.current = true;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const characterArray = (options?.characters || DEFAULT_CHARACTERS).split("");
    const columnCount = options?.columnCount || DEFAULT_COLUMN_COUNT;
    const speed = options?.speed || DEFAULT_SPEED;
    
    const cols: any[] = [];
    for (let i = 0; i < columnCount; i++) {
      cols.push({
        x: i * (canvas.width / columnCount),
        y: 0,
        speed: speed * (0.5 + Math.random()),
        headIndex: 0,
        chars: Array.from({ length: 10 }, () => 
          characterArray[Math.floor(Math.random() * characterArray.length)]
        ),
      });
    }
    columnsRef.current = cols;

    const draw = () => {
      if (!isRunning) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#00ff41";
      ctx.font = "14px monospace";
      
      columnsRef.current.forEach((col) => {
        const char = col.chars[col.headIndex];
        ctx.fillText(char, col.x, col.y);
        
        col.y += col.speed;
        
        if (col.y > canvas.height) {
          col.y = 0;
          col.headIndex = 0;
          col.chars = Array.from({ length: 10 }, () => 
            characterArray[Math.floor(Math.random() * characterArray.length)]
          );
          setCharCount(prev => prev + 1);
        }
        
        col.headIndex = (col.headIndex + 1) % col.chars.length;
      });
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, options?.columnCount, options?.speed, options?.characters]);

  const toggle = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  return {
    isRunning,
    toggle,
    charCount,
    canvasRef,
  };
};

export const createMatrixCanvas = () => {
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const chars = "アァィィウゥウゥエエェエオオゴオグササズズセセソソタタチチツツテテナナニニヌヌヘヘホホママミミムムワワヰヱヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const charArray = chars.split("");
    
    const cols: any[] = [];
    for (let i = 0; i < 20; i++) {
      cols.push({
        x: i * (canvas.width / 20),
        y: 0,
        speed: 2 + Math.random() * 2,
        headIndex: 0,
        chars: Array.from({ length: 15 }, () => charArray[Math.floor(Math.random() * charArray.length)]),
      });
    }

    const draw = () => {
      if (!active) return;
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#00ff41";
      ctx.font = "16px monospace";
      
      cols.forEach((col) => {
        ctx.fillText(col.chars[col.headIndex], col.x, col.y);
        col.y += col.speed;
        
        if (col.y > canvas.height) {
          col.y = 0;
          col.headIndex = 0;
          col.chars = Array.from({ length: 15 }, () => charArray[Math.floor(Math.random() * charArray.length)]);
        }
        
        col.headIndex = (col.headIndex + 1) % col.chars.length;
      });
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active]);

  const start = () => setActive(true);
  const stop = () => setActive(false);

  return {
    canvasRef,
    active,
    start,
    stop,
  };
};