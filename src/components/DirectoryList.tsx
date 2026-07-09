"use client";

import { useState, useMemo } from 'react';

interface Resident {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: string;
  joinDate: string;
  posts: number;
  reputation: number;
}

const residents: Resident[] = [
  {
    id: '1',
    name: 'Cyber Pioneer',
    username: 'cyber-pioneer',
    avatar: 'https://cdn.jsdelivr.net/gh/robbie-clement/retro-music@main/chip-cover.png',
    role: 'Founder',
    joinDate: '2024-01-15',
    posts: 1247,
    reputation: 5420,
  },
  {
    id: '2',
    name: 'Pixel Warrior',
    username: 'pixel-warrior',
    avatar: 'https://via.placeholder.com/64/00ff7f/ffffff?text=🎵',
    role: 'Developer',
    joinDate: '2024-02-20',
    posts: 892,
    reputation: 3890,
  },
  {
    id: '3',
    name: 'Byte Collector',
    username: 'byte-collector',
    avatar: 'https://via.placeholder.com/64/ff007f/ffffff?text=🎶',
    role: 'Archivist',
    joinDate: '2024-03-10',
    posts: 156,
    reputation: 2100,
  },
  {
    id: '4',
    name: 'Retro Hacker',
    username: 'retro-hacker',
    avatar: 'https://via.placeholder.com/64/0066ff/ffffff?text=💻',
    role: 'Security',
    joinDate: '2024-01-25',
    posts: 523,
    reputation: 4560,
  },
  {
    id: '5',
    name: 'Glitch Master',
    username: 'glitch-master',
    avatar: 'https://via.placeholder.com/64/ff6600/ffffff?text=⚡',
    role: 'Artist',
    joinDate: '2024-04-05',
    posts: 342,
    reputation: 2780,
  },
  {
    id: '6',
    name: 'Neon Drifter',
    username: 'neon-drifter',
    avatar: 'https://via.placeholder.com/64/7f00ff/ffffff?text=🌃',
    role: 'Designer',
    joinDate: '2024-02-28',
    posts: 289,
    reputation: 3120,
  },
  {
    id: '7',
    name: 'Terminal Wizard',
    username: 'terminal-wizard',
    avatar: 'https://via.placeholder.com/64/00aa00/ffffff?text=🔮',
    role: 'Moderator',
    joinDate: '2024-01-05',
    posts: 756,
    reputation: 6230,
  },
  {
    id: '8',
    name: 'Code Archaeologist',
    username: 'code-archaeologist',
    avatar: 'https://via.placeholder.com/64/aa5500/ffffff?text=🏺',
    role: 'Historian',
    joinDate: '2024-03-15',
    posts: 431,
    reputation: 2890,
  },
  {
    id: '9',
    name: 'Synth Wave',
    username: 'synth-wave',
    avatar: 'https://via.placeholder.com/64/ff00ff/ffffff?text=🎹',
    role: 'Composer',
    joinDate: '2024-04-01',
    posts: 178,
    reputation: 1980,
  },
  {
    id: '10',
    name: 'Digital Trailblazer',
    username: 'digital-trailblazer',
    avatar: 'https://via.placeholder.com/64/0088ff/ffffff?text=🚀',
    role: 'Explorer',
    joinDate: '2024-02-10',
    posts: 623,
    reputation: 4120,
  },
  {
    id: '11',
    name: 'Analog Dreamer',
    username: 'analog-dreamer',
    avatar: 'https://via.placeholder.com/64/880088/ffffff?text=🌙',
    role: 'Artist',
    joinDate: '2024-03-25',
    posts: 234,
    reputation: 1870,
  },
  {
    id: '12',
    name: 'Floppy Disk',
    username: 'floppy-disk',
    avatar: 'https://via.placeholder.com/64/444444/ffffff?text=💾',
    role: 'Archivist',
    joinDate: '2024-01-18',
    posts: 891,
    reputation: 3450,
  },
  {
    id: '13',
    name: 'Modem Rider',
    username: 'modem-rider',
    avatar: 'https://via.placeholder.com/64/007700/ffffff?text=📞',
    role: 'Networking',
    joinDate: '2024-02-05',
    posts: 456,
    reputation: 2670,
  },
  {
    id: '14',
    name: 'BBS Legend',
    username: 'BBS-legend',
    avatar: 'https://via.placeholder.com/64/660000/ffffff?text=📡',
    role: 'Veteran',
    joinDate: '2024-01-01',
    posts: 1203,
    reputation: 7890,
  },
  {
    id: '15',
    name: 'Phreaker Legend',
    username: 'phreaker-legend',
    avatar: 'https://via.placeholder.com/64/cc0000/ffffff?text=🔊',
    role: 'Voice',
    joinDate: '2024-01-08',
    posts: 934,
    reputation: 5120,
  },
  {
    id: '16',
    name: 'Telnet Navigator',
    username: 'telnet-navigator',
    avatar: 'https://via.placeholder.com/64/004466/ffffff?text=🧭',
    role: 'Explorer',
    joinDate: '2024-02-12',
    posts: 567,
    reputation: 3210,
  },
  {
    id: '17',
    name: 'Gopher Guru',
    username: 'gopher-guru',
    avatar: 'https://via.placeholder.com/64/552200/ffffff?text=🐱',
    role: 'Guide',
    joinDate: '2024-03-08',
    posts: 389,
    reputation: 2450,
  },
  {
    id: '18',
    name: 'Usenet Explorer',
    username: 'usenet-explorer',
    avatar: 'https://via.placeholder.com/64/222266/ffffff?text=🌐',
    role: 'Researcher',
    joinDate: '2024-04-12',
    posts: 287,
    reputation: 2010,
  },
  {
    id: '19',
    name: 'FTP Finder',
    username: 'ftp-finder',
    avatar: 'https://via.placeholder.com/64/333333/ffffff?text=🗂️',
    role: 'Librarian',
    joinDate: '2024-02-22',
    posts: 678,
    reputation: 3670,
  },
  {
    id: '20',
    name: 'IRC Wanderer',
    username: 'irc-wanderer',
    avatar: 'https://via.placeholder.com/64/cc6600/ffffff?text=💬',
    role: 'Chat',
    joinDate: '2024-03-30',
    posts: 812,
    reputation: 4230,
  },
  {
    id: '21',
    name: 'Nostalgia Coder',
    username: 'nostalgia-coder',
    avatar: 'https://via.placeholder.com/64/aa0000/ffffff?text=🎮',
    role: 'Developer',
    joinDate: '2024-01-22',
    posts: 567,
    reputation: 3890,
  },
  {
    id: '22',
    name: 'Pixel Artist',
    username: 'pixel-artist',
    avatar: 'https://via.placeholder.com/64/009999/ffffff?text=🎨',
    role: 'Artist',
    joinDate: '2024-02-18',
    posts: 445,
    reputation: 2980,
  },
  {
    id: '23',
    name: 'Retro Gamer',
    username: 'retro-gamer',
    avatar: 'https://via.placeholder.com/64/ff33aa/ffffff?text=🕹️',
    role: 'Player',
    joinDate: '2024-03-05',
    posts: 378,
    reputation: 2560,
  },
  {
    id: '24',
    name: 'Chiptune DJ',
    username: 'chiptune-dj',
    avatar: 'https://via.placeholder.com/64/00ff00/ffffff?text=🎧',
    role: 'DJ',
    joinDate: '2024-04-08',
    posts: 234,
    reputation: 1890,
  },
  {
    id: '25',
    name: 'Vintage SysOp',
    username: 'vintage-sysop',
    avatar: 'https://via.placeholder.com/64/666666/ffffff?text=🖥️',
    role: 'Admin',
    joinDate: '2024-01-03',
    posts: 1456,
    reputation: 8900,
  },
  {
    id: '26',
    name: 'DOS Commander',
    username: 'dos-commander',
    avatar: 'https://via.placeholder.com/64/000088/ffffff?text=💻',
    role: 'Commander',
    joinDate: '2024-02-14',
    posts: 634,
    reputation: 4340,
  },
  {
    id: '27',
    name: 'RAM Technician',
    username: 'ram-technician',
    avatar: 'https://via.placeholder.com/64/880000/ffffff?text=🔧',
    role: 'Tech',
    joinDate: '2024-03-20',
    posts: 412,
    reputation: 2760,
  },
  {
    id: '28',
    name: 'CPU Overclocker',
    username: 'cpu-overclocker',
    avatar: 'https://via.placeholder.com/64/ff0066/ffffff?text=⚡',
    role: 'Tech',
    joinDate: '2024-04-15',
    posts: 298,
    reputation: 2100,
  },
  {
    id: '29',
    name: 'GPU Artisan',
    username: 'gpu-artisan',
    avatar: 'https://via.placeholder.com/64/330066/ffffff?text=🎨',
    role: 'Artist',
    joinDate: '2024-02-25',
    posts: 389,
    reputation: 2450,
  },
  {
    id: '30',
    name: 'BIOS Explorer',
    username: 'bios-explorer',
    avatar: 'https://via.placeholder.com/64/005500/ffffff?text=🔍',
    role: 'Researcher',
    joinDate: '2024-03-10',
    posts: 156,
    reputation: 1870,
  },
  {
    id: '31',
    name: 'Boot Sector',
    username: 'boot-sector',
    avatar: 'https://via.placeholder.com/64/550055/ffffff?text=🔧',
    role: 'Developer',
    joinDate: '2024-01-28',
    posts: 789,
    reputation: 3560,
  },
  {
    id: '32',
    name: 'Hard Drive',
    username: 'hard-drive',
    avatar: 'https://via.placeholder.com/64/999999/ffffff?text=💾',
    role: 'Storage',
    joinDate: '2024-02-08',
    posts: 534,
    reputation: 2890,
  },
  {
    id: '33',
    name: 'CD-ROM Master',
    username: 'cd-rom-master',
    avatar: 'https://via.placeholder.com/64/444444/ffffff?text=📀',
    role: 'Archivist',
    joinDate: '2024-03-18',
    posts: 623,
    reputation: 3120,
  },
  {
    id: '34',
    name: 'Floppy Wizard',
    username: 'floppy-wizard',
    avatar: 'https://via.placeholder.com/64/777777/ffffff?text=⚡',
    role: 'Magician',
    joinDate: '2024-04-20',
    posts: 189,
    reputation: 1650,
  },
  {
    id: '35',
    name: 'Dial-Up Spirit',
    username: 'dial-up-spirit',
    avatar: 'https://via.placeholder.com/64/008888/ffffff?text=📞',
    role: 'Veteran',
    joinDate: '2024-02-02',
    posts: 845,
    reputation: 3780,
  },
  {
    id: '36',
    name: 'Modem Maven',
    username: 'modem-maven',
    avatar: 'https://via.placeholder.com/64/0066cc/ffffff?text=📡',
    role: 'Networking',
    joinDate: '2024-03-25',
    posts: 456,
    reputation: 2890,
  },
  {
    id: '37',
    name: 'Terminal Sage',
    username: 'terminal-sage',
    avatar: 'https://via.placeholder.com/64/003300/ffffff?text=📜',
    role: 'Mentor',
    joinDate: '2024-04-10',
    posts: 312,
    reputation: 2340,
  },
  {
    id: '38',
    name: 'Shell Scriptor',
    username: 'shell-scriptor',
    avatar: 'https://via.placeholder.com/64/333300/ffffff?text=⚙️',
    role: 'Developer',
    joinDate: '2024-02-15',
    posts: 567,
    reputation: 3120,
  },
  {
    id: '39',
    name: 'Kernel Keeper',
    username: 'kernel-keeper',
    avatar: 'https://via.placeholder.com/64/440044/ffffff?text=🛡️',
    role: 'Security',
    joinDate: '2024-03-05',
    posts: 389,
    reputation: 2670,
  },
  {
    id: '40',
    name: 'Stack Overflower',
    username: 'stack-overflower',
    avatar: 'https://via.placeholder.com/64/662200/ffffff?text=❓',
    role: 'Learner',
    joinDate: '2024-04-05',
    posts: 234,
    reputation: 1980,
  },
  {
    id: '41',
    name: 'Git Guru',
    username: 'git-guru',
    avatar: 'https://via.placeholder.com/64/222222/ffffff?text=📦',
    role: 'Maintainer',
    joinDate: '2024-01-10',
    posts: 678,
    reputation: 4560,
  },
  {
    id: '42',
    name: 'Branch Master',
    username: 'branch-master',
    avatar: 'https://via.placeholder.com/64/334455/ffffff?text=🌿',
    role: 'Developer',
    joinDate: '2024-02-20',
    posts: 412,
    reputation: 2890,
  },
  {
    id: '43',
    name: 'Merge Wizard',
    username: 'merge-wizard',
    avatar: 'https://via.placeholder.com/64/553300/ffffff?text=✨',
    role: 'Developer',
    joinDate: '2024-03-12',
    posts: 356,
    reputation: 2450,
  },
  {
    id: '44',
    name: 'Commit Historian',
    username: 'commit-historian',
    avatar: 'https://via.placeholder.com/64/883300/ffffff?text=📜',
    role: 'Archivist',
    joinDate: '2024-04-18',
    posts: 289,
    reputation: 2100,
  },
];

export default function DirectoryList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedResidents = useMemo(() => {
    const filtered = residents.filter((resident) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        resident.name.toLowerCase().includes(searchLower) ||
        resident.username.toLowerCase().includes(searchLower) ||
        resident.role.toLowerCase().includes(searchLower)
      );
    });

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm]);

  return (
    <div className="w-full">
      {/* Start: Sticky Search Bar Header */}
      <div className="sticky top-16 z-40 bg-gray-50 dark:bg-gray-950 border-b-2 border-cyan-500/30 p-4 mb-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search residents by name, username, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full px-4 py-2 pl-10 
                border-2 border-cyan-500 rounded-none
                bg-white dark:bg-gray-900
                text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400
                font-mono text-sm
                focus:outline-none focus:ring-2 focus:ring-pink-500
                retro-input
              "
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 text-lg">
              🔍
            </span>
          </div>
        </div>
      </div>
      {/* End: Sticky Search Bar Header */}

      {/* Start: Resident Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAndSortedResidents.map((resident) => (
            <div
              key={resident.id}
              className="
                retro-card border-2 border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-900 rounded-none p-3
                hover:shadow-[4px_4px_0_0_rgba(255,255,0,0.3)] 
                transition-all duration-200
              "
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-none border-2 border-gray-400 dark:border-gray-500 overflow-hidden flex-shrink-0">
                  <img 
                    src={resident.avatar} 
                    alt={resident.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm pixel-font truncate">
                    {resident.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                    @{resident.username}
                  </p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono mt-1">
                    {resident.role}
                  </p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-mono">
                  <span>Posts: {resident.posts}</span>
                  <span>Rep: {resident.reputation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End: Resident Grid */}

      {/* Start: No Results */}
      {filteredAndSortedResidents.length === 0 && (
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 pixel-font text-lg">
            No residents found matching "{searchTerm}"
          </p>
        </div>
      )}
      {/* End: No Results */}
    </div>
  );
}