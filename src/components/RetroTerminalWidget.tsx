'use client';

import { useState, useEffect, useRef } from 'react';

interface RetroTerminalWidgetProps {
  title?: string;
  className?: string;
}

interface MatrixOption {
  enabled: boolean;
  chars: string;
  speed: number;
  opacity: number;
}

const MATRIX_CHARS = 'アァカサタナハマヤラワガザダバパイィキシチニヒミュリヰグズデブプウゥクスツヌフムユルグズデブプエェケセテネヘメヱレゲゼデベペオォコソトノホマヨロワゴゾドボポ';

export default function RetroTerminalWidget({ title = 'Coretan Terminal', className }: RetroTerminalWidgetProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Coretan Terminal aktif.',
    "Taip 'help' untuk melihat arahan.",
  ]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [matrixState, setMatrixState] = useState<MatrixOption>({
    enabled: false,
    chars: MATRIX_CHARS,
    speed: 50,
    opacity: 0.8,
  });
  const matrixRef = useRef<number | null>(null);
  const [isMatrixActive, setIsMatrixActive] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'auto' });
    }
  }, [history]);

  const handleCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase();

    if (!command) {
      return;
    }

    if (command === 'matrix') {
      if (!matrixState.enabled) {
        setMatrixState(prev => ({ ...prev, enabled: true }));
        setIsMatrixActive(true);
        setHistory(prev => [...prev, '> matrix', 'Mode Matrix diaktifkan! Tekan ESC untuk kembali.']);
      } else {
        setMatrixState(prev => ({ ...prev, enabled: false }));
        setIsMatrixActive(false);
        setHistory(prev => [...prev, '> matrix', 'Mode Matrix dimatikan.']);
      }
      setInput('');
      return;
    }

    if (isMatrixActive && command === 'esc') {
      setMatrixState(prev => ({ ...prev, enabled: false }));
      setIsMatrixActive(false);
      setHistory(prev => [...prev, '> esc', 'Kembali ke mod normal.']);
      setInput('');
      return;
    }

    if (isMatrixActive) {
      setHistory(prev => [...prev, '> ' + rawCommand, 'Arahan tidak sah di mod Matrix.']);
      setInput('');
      return;
    }

    const responses: Record<string, string> = {
      help: 'Arahan tersedia: help, siri, tetapan, papan pemuka, clear, matrix.',
      siri: 'Siri Tutorial sedang disusun untuk modul baharu.',
      tetapan: 'Tetapan mod retro kini aktif dan stabil.',
      'papan pemuka': 'Papan Pemuka komuniti dikemas kini setiap jam.',
      clear: '',
      matrix: 'Aktifkan mod Matrix! Tekan "matrix" lagi untuk matikan.',
    };

    const response = responses[command] ?? `Arahan tidak dikenali: ${rawCommand}`;

    setHistory((current) => {
      const nextEntries = command === 'clear' ? [] : [...current, `> ${rawCommand}`, response];
      return nextEntries;
    });
    setInput('');
  };

  useEffect(() => {
    if (!isMatrixActive) return;

    const generateMatrixLine = (): string => {
      let line = '';
      for (let i = 0; i < 80; i++) {
        if (Math.random() < 0.3) {
          line += matrixState.chars.charAt(Math.floor(Math.random() * matrixState.chars.length));
        } else {
          line += ' ';
        }
      }
      return line;
    };

    const matrixInterval = setInterval(() => {
      setHistory(prev => [...prev.slice(-50), generateMatrixLine()]);
    }, matrixState.speed);

    return () => clearInterval(matrixInterval);
  }, [isMatrixActive, matrixState.speed, matrixState.chars]);

  const TypingLine = ({ text }: { text: string }) => {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
      let i = 0;
      const speed = 20;
      const timer = setInterval(() => {
        setDisplayed((prev) => prev + text.charAt(i));
        i++;
        if (i >= text.length) clearInterval(timer);
      }, speed);
      return () => clearInterval(timer);
    }, [text]);
    return <div className="whitespace-pre-wrap matrix-line">{displayed}</div>;
  };

  return (
    <div className={`retro-window border-2 border-pink-500 bg-[#0e1330] p-3 text-sm text-green-200 retro-shadow ${className || ''}`}>
      <div className="mb-2 flex items-center justify-between border-b border-green-800 pb-2">
        <span className="font-bold uppercase tracking-wide text-green-300">{title}</span>
        <span className={`rounded px-2 py-1 text-[10px] ${isMatrixActive ? 'bg-red-500' : 'bg-green-900/70'} text-green-100`}>
          {isMatrixActive ? 'MATRIX' : 'Live'}
        </span>
      </div>
       <div
          ref={containerRef}
          className="mb-2 max-h-[70vh] overflow-y-auto rounded border border-green-900 bg-black/80 p-2 font-mono text-xs leading-5"
        >
          {history.map((line, index) => (
            <TypingLine key={`${line}-${index}`} text={line} />
          ))}
        </div>
       <div className="flex items-center gap-2 font-mono text-xs">
         <span className="text-green-300">retro@kampung:~$</span>
         <input
           value={input}
           onChange={(event) => setInput(event.target.value)}
           onKeyDown={(event) => {
             if (event.key === 'Enter') {
               handleCommand(input);
             }
             if (event.key === 'Escape' && isMatrixActive) {
               handleCommand('esc');
             }
           }}
           className="w-full bg-transparent text-green-100 outline-none"
           placeholder={isMatrixActive ? "ESC untuk kembali..." : "masukkan arahan"}
           aria-label="terminal command input"
         />
       </div>
     </div>
  );
}