"use client";

import { useRouter } from 'next/navigation';

const ACTIVE_SIBER_USERNAMES: string[] = [
  'cyber-pioneer',
  'pixel-warrior',
  'byte-collector',
  'retro-hacker',
  'glitch-master',
  'neon-drifter',
  'terminal-wizard',
  'code-archaeologist',
  'synth-wave',
  'digital-trailblazer',
  'analog-dreamer',
  'floppy-disk',
  'modem-rider',
  'BBS-legend',
  'phreaker-legend',
  'telnet-navigator',
  'gopher-guru',
  'usenet-explorer',
  'ftp-finder',
  'irc-wanderer'
];

interface RandomExplorerBtnProps {
  className?: string;
  label?: string;
}

export default function RandomExplorerBtn({ className, label = '🌐' }: RandomExplorerBtnProps) {
  const router = useRouter();

  const getRandomUsername = (): string => {
    const randomIndex = Math.floor(Math.random() * ACTIVE_SIBER_USERNAMES.length);
    return ACTIVE_SIBER_USERNAMES[randomIndex];
  };

  const handleRandomExplore = () => {
    const randomUser = getRandomUsername();
    router.push('/site/' + randomUser);
  };

  return (
    <button
      onClick={handleRandomExplore}
      className={`retro-btn-secondary ${className || ''}`}
      aria-label="Jelajah rawak laman 90s-style"
    >
      {label}
    </button>
  );
}