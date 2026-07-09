"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface ArcadeGameProps {
  className?: string;
}

export default function ArcadeGame({ className }: ArcadeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const animationFrameRef = useRef<number | null>(null);

  // Game state
  const [paddle, setPaddle] = useState({ x: 0, y: 0, width: 80, height: 10 });
  const [ball, setBall] = useState({ x: 0, y: 0, dx: 2, dy: -2, radius: 5 });
  const [bricks, setBricks] = useState<Array<{ x: number; y: number; width: number; height: number; hits: number }>>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);

  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 300;

  const initGame = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize paddle
    setPaddle({
      x: (CANVAS_WIDTH - 80) / 2,
      y: CANVAS_HEIGHT - 20,
      width: 80,
      height: 10
    });

    // Initialize ball
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: 2 + Math.random() * 2,
      dy: -2 - Math.random() * 2,
      radius: 5
    });

    // Initialize bricks
    const initialBricks = [];
    const rows = 5;
    const cols = 8;
    const brickWidth = 45;
    const brickHeight = 15;
    const brickPadding = 5;
    const offsetTop = 40;
    const offsetLeft = 15;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const brickX = offsetLeft + col * (brickWidth + brickPadding);
        const brickY = offsetTop + row * (brickHeight + brickPadding);
        initialBricks.push({
          x: brickX,
          y: brickY,
          width: brickWidth,
          height: brickHeight,
          hits: 1
        });
      }
    }
    setBricks(initialBricks);

    setScore(0);
    setLives(3);
    setGameState('playing');
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    initGame();

    const gameLoop = () => {
      if (gameState !== 'playing') return;

      update();
      draw();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isClient, gameState, initGame]);

  const update = () => {
    setBall(prev => {
      let newX = prev.x + prev.dx;
      let newY = prev.y + prev.dy;

      // Wall collisions
      if (newX - prev.radius < 0 || newX + prev.radius > CANVAS_WIDTH) {
        prev.dx = -prev.dx;
      }
      if (newY - prev.radius < 0) {
        prev.dy = -prev.dy;
      }

      // Bottom collision (lose a life)
      if (newY + prev.radius > CANVAS_HEIGHT) {
        setLives(l => l - 1);
        if (lives <= 1) {
          setGameState('gameOver');
        } else {
          // Reset ball
          newX = CANVAS_WIDTH / 2;
          newY = CANVAS_HEIGHT / 2;
          prev.dx = 2 + Math.random() * 2;
          prev.dy = -2 - Math.random() * 2;
        }
      }

      // Paddle collision
      const paddleY = paddle.y;
      if (
        newY + prev.radius > paddleY &&
        newY - prev.radius < paddleY + paddle.height &&
        newX > paddle.x &&
        newX < paddle.x + paddle.width
      ) {
        prev.dy = -Math.abs(prev.dy) * 1.1;
        // Add some spin based on where ball hits paddle
        const hitPos = (newX - paddle.x - paddle.width / 2) / (paddle.width / 2);
        prev.dx = prev.dx + hitPos * 2;
      }

      return { ...prev, x: newX, y: newY };
    });

    // Check brick collisions
    setBricks(prev => {
      return prev.map(brick => {
        const collided = (
          ball.x + ball.radius > brick.x &&
          ball.x - ball.radius < brick.x + brick.width &&
          ball.y + ball.radius > brick.y &&
          ball.y - ball.radius < brick.y + brick.height
        );

        if (collided) {
          setScore(s => s + 10);
          setBall(b => ({ ...b, dy: -b.dy * 1.1 }));
          return { ...brick, hits: brick.hits - 1 };
        }
        return brick;
      }).filter(brick => brick.hits > 0);
    });
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw paddle
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff00ff';
    ctx.fill();

    // Draw bricks
    bricks.forEach(brick => {
      ctx.fillStyle = brick.hits > 1 ? '#ff6600' : '#00ff00';
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    });

    // Draw score and lives
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Lives: ${lives}`, 10, 40);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (gameState !== 'playing') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    setPaddle(p => ({
      ...p,
      x: Math.max(0, Math.min(x - p.width / 2, CANVAS_WIDTH - p.width))
    }));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState !== 'playing') return;
    const touch = e.touches[0];
    if (touch) {
      setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState !== 'playing' || !touchStartPos) return;
    const touch = e.touches[0];
    if (touch) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const deltaX = touch.clientX - touchStartPos.x;
      const newX = paddle.x + deltaX;
      setPaddle(p => ({
        ...p,
        x: Math.max(0, Math.min(newX - p.width / 2, CANVAS_WIDTH - p.width))
      }));
      setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    }
  };

  useEffect(() => {
    if (!isClient) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove as any);
      canvas.addEventListener('touchstart', handleTouchStart as any, { passive: true });
      canvas.addEventListener('touchmove', handleTouchMove as any, { passive: true });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove as any);
        canvas.removeEventListener('touchstart', handleTouchStart as any);
        canvas.removeEventListener('touchmove', handleTouchMove as any);
      }
    };
  }, [isClient, gameState, paddle.x, touchStartPos]);

  const handleRestart = () => {
    initGame();
  };

  if (!isClient) {
    return (
      <div className={`w-full ${className || ''}`}>
        <div className="retro-card">
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`game-container ${className || ''}`}>
      {gameState === 'menu' && (
        <div className="retro-card mb-4">
          <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font">
              🕹️ Brick Breaker Classic
            </h3>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 pixel-font mb-4">
              Klik atau ketuk untuk mula. Usahakan untuk pecahkan semua blok!
            </p>
            <button
              onClick={handleRestart}
              className="retro-btn-primary text-sm px-4 py-2"
            >
              Mula
            </button>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-gray-400 dark:border-gray-500 rounded-pixel bg-black"
        style={{ display: gameState === 'playing' ? 'block' : 'none' }}
      />

      {gameState === 'menu' && (
        <div className="w-full h-32" />
      )}

      {gameState === 'gameOver' && (
        <div className="retro-card mt-4">
          <div className="retro-card-header bg-red-100 dark:bg-red-900 px-4 py-2 border-b border-red-300 dark:border-red-600">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200 pixel-font">
              Game Over
            </h3>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 pixel-font mb-4">
              Skor akhir: {score}
            </p>
            <button
              onClick={handleRestart}
              className="retro-btn-primary text-sm px-4 py-2"
            >
              Cuba Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}