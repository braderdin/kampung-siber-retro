"use client";

import { useState, useRef, useEffect } from 'react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  url: string;
  cover: string;
}

const CHIPTUNE_URL = 'https://cdn.jsdelivr.net/gh/robbie-clement/retro-music@main/lofi-chiptune-loop.mp3';

export default function WinampPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const sampleTracks: Track[] = [
    {
      id: 1,
      title: 'Digital Dreams',
      artist: 'Cyber Wave',
      duration: '3:45',
      url: CHIPTUNE_URL,
      cover: 'https://cdn.jsdelivr.net/gh/robbie-clement/retro-music@main/chip-cover.png',
    },
    {
      id: 2,
      title: 'Retro Future',
      artist: '80s Synth',
      duration: '4:12',
      url: '/audio/sample2.mp3',
      cover: 'https://via.placeholder.com/64/00ff7f/ffffff?text=🎵',
    },
    {
      id: 3,
      title: 'Neon Nights',
      artist: 'Pixel Beats',
      duration: '2:58',
      url: '/audio/sample3.mp3',
      cover: 'https://via.placeholder.com/64/ff007f/ffffff?text=🎶',
    },
  ];

  useEffect(() => {
    if (playlist.length > 0) {
      setCurrentTrack(playlist[0]);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    } else {
      loadPlaylist();
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playlist]);

  useEffect(() => {
    if (currentTrack && isPlaying) {
      const audio = audioRef.current;
      if (audio && audio.src !== currentTrack.url) {
        audio.src = currentTrack.url;
        audio.load();
        audio.play().catch((err) => {
          console.error('Playback failed:', err);
        });
      }
    }
  }, [currentTrack]);

  const loadPlaylist = () => {
    setPlaylist(sampleTracks);
    setCurrentTrack(sampleTracks[0]);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  };

  const shufflePlaylist = () => {
    const shuffled = [...playlist];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPlaylist(shuffled);
    setCurrentTrack(shuffled[0]);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  };

  const playPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((err) => {
        console.error('Playback failed:', err);
      });
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (!currentTrack || !playlist.length) return;

    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];

    setCurrentTrack(nextTrack);
    setCurrentTime(0);
    setIsPlaying(true);

    const audio = audioRef.current;
    if (audio) {
      audio.src = nextTrack.url;
      audio.load();
      audio.play().catch((err) => {
        console.error('Playback failed:', err);
      });
    }
  };

  const playPrevious = () => {
    if (!currentTrack || !playlist.length) return;

    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevTrack = playlist[prevIndex];

    setCurrentTrack(prevTrack);
    setCurrentTime(0);
    setIsPlaying(true);

    const audio = audioRef.current;
    if (audio) {
      audio.src = prevTrack.url;
      audio.load();
      audio.play().catch((err) => {
        console.error('Playback failed:', err);
      });
    }
  };

  const handleSeek = (e: React.MouseEvent) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;

    const seekBar = e.currentTarget as HTMLDivElement;
    const rect = seekBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * duration;

    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume / 100;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume / 100;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;

    const seekBar = e.currentTarget as HTMLDivElement;
    const rect = seekBar.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, touchX / rect.width));
    const seekTime = percentage * duration;

    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  useEffect(() => {
    if (currentTrack && !isPlaying) {
      const audio = audioRef.current;
      if (audio && audio.src === currentTrack.url) {
        audio.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (!isPlaying && currentTrack) {
      const audio = audioRef.current;
      if (audio && audio.src === currentTrack.url) {
        audio.play().catch((err) => {
          console.error('Auto-play failed (may be blocked):', err);
        });
        setIsPlaying(true);
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (currentTrack) {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = volume / 100;
      }
    }
  }, [volume]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} preload="auto" />

      <div className="bg-gradient-to-b from-gray-900 to-gray-800 border-4 border-yellow-400 rounded-none shadow-[8px_8px_0_0_rgba(255,255,0,0.5)] w-[400px] sm:w-[320px] xs:w-[280px] max-w-full">
        <div className="bg-yellow-300 h-4 flex">
          <div className="bg-yellow-400 w-2 h-full"></div>
          <div className="bg-yellow-500 w-2 h-full"></div>
          <div className="bg-yellow-600 w-2 h-full"></div>
        </div>

        <div className="p-2 sm:p-1 xs:p-1">
          <div className="flex items-center space-x-2 sm:space-x-1 xs:space-x-1">
            <div className="w-10 h-10 sm:w-8 sm:h-8 xs:w-6 xs:h-6 bg-gray-700 border-2 border-yellow-300 rounded-sm flex-shrink-0">
              {currentTrack?.cover ? (
                <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover rounded-sm" />
              ) : (
                <span className="text-xs text-yellow-300 flex items-center justify-center">🎵</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-yellow-200 font-bold text-sm sm:text-xs xs:text-[10px] truncate">
                {currentTrack?.title || 'No Track'}
              </div>
              <div className="text-yellow-400 text-xs sm:text-[10px] xs:text-[8px] truncate">
                {currentTrack?.artist || 'Artist'}
              </div>
            </div>

            <button
              onClick={playPrevious}
              className="w-6 h-6 sm:w-5 sm:h-5 xs:w-4 xs:h-4 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 rounded-full transition-colors border-2 border-yellow-300"
              title="Previous"
            >
              <span className="text-[8px] sm:text-[6px] xs:text-[5px]">⏮</span>
            </button>

            <button
              onClick={playPause}
              className="w-8 h-8 sm:w-6 sm:h-6 xs:w-5 xs:h-5 flex items-center justify-center bg-red-600 hover:bg-red-500 rounded-full transition-colors border-2 border-yellow-300"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <span className="text-sm sm:text-xs xs:text-[10px] text-white">⏸</span>
              ) : (
                <span className="text-sm sm:text-xs xs:text-[10px] text-white">▶</span>
              )}
            </button>

            <button
              onClick={playNext}
              className="w-6 h-6 sm:w-5 sm:h-5 xs:w-4 xs:h-4 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 rounded-full transition-colors border-2 border-yellow-300"
              title="Next"
            >
              <span className="text-[8px] sm:text-[6px] xs:text-[5px]">⏭</span>
            </button>

            <button
              onClick={shufflePlaylist}
              className="w-5 h-5 sm:w-4 sm:h-4 xs:w-3 xs:h-3 flex items-center justify-center bg-green-500 hover:bg-green-400 rounded-full transition-colors border-2 border-yellow-300"
              title="Shuffle Playlist"
            >
              <span className="text-[8px] sm:text-[6px] xs:text-[5px]">🔀</span>
            </button>
          </div>

          <div className="mt-2">
            <div
              onClick={handleSeek}
              onMouseDown={handleSeek}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              className="relative h-1.5 sm:h-1 xs:h-0.5 bg-yellow-200 rounded-full cursor-pointer touch-pan-x"
            >
              <div 
                className="absolute top-0 left-0 h-full bg-yellow-500 rounded-full"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-yellow-300 mt-0.5 sm:text-[10px] xs:text-[8px]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 sm:mt-1 xs:mt-0.5">
            <button
              onClick={toggleMute}
              className="w-5 h-5 sm:w-4 sm:h-4 xs:w-3 xs:h-3 flex items-center justify-center text-yellow-300 hover:text-yellow-200"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <span className="text-xs">🔇</span>
              ) : volume > 50 ? (
                <span className="text-xs">🔊</span>
              ) : (
                <span className="text-xs">🔉</span>
              )}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 sm:w-12 xs:w-8 text-yellow-400"
              title="Volume"
            />

            <button
              onClick={() => loadPlaylist()}
              className="text-xs text-yellow-300 hover:text-yellow-200 underline"
              title="Load Playlist"
            >
              Playlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}