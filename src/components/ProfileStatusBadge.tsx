"use client";

import { useState, useEffect } from 'react';

interface ProfileStatusBadgeProps {
  initialStatus?: 'online' | 'coding' | 'makan';
  onStatusChange?: (status: string) => void;
  className?: string;
}

type UserStatus = 'online' | 'coding' | 'makan';

interface StatusOption {
  id: UserStatus;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    id: 'online',
    label: 'Online',
    icon: '🟢',
    color: 'text-green-500',
    bgColor: 'bg-green-500'
  },
  {
    id: 'coding',
    label: 'Koding',
    icon: '💻',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500'
  },
  {
    id: 'makan',
    label: 'Makan',
    icon: '☕',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500'
  }
];

export default function ProfileStatusBadge({ 
  initialStatus = 'online',
  onStatusChange,
  className
}: ProfileStatusBadgeProps) {
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>(initialStatus);
  const [showOptions, setShowOptions] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedStatus = localStorage.getItem('user_status') as UserStatus;
    if (savedStatus && STATUS_OPTIONS.some(s => s.id === savedStatus)) {
      setSelectedStatus(savedStatus);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('user_status', selectedStatus);
    if (onStatusChange) {
      onStatusChange(selectedStatus);
    }
  }, [selectedStatus, onStatusChange]);

  const handleStatusSelect = (status: UserStatus) => {
    setSelectedStatus(status);
    setShowOptions(false);
  };

  const getStatusEmoji = (status: UserStatus): string => {
    const option = STATUS_OPTIONS.find(s => s.id === status);
    return option?.icon || '🟢';
  };

  const getStatusLabel = (status: UserStatus): string => {
    const option = STATUS_OPTIONS.find(s => s.id === status);
    return option?.label || 'Online';
  };

  const getCurrentStatus = () => STATUS_OPTIONS.find(s => s.id === selectedStatus);

  return (
    <div className={`profile-status-badge ${className || ''}`}>
      {/* Start: Status Display */}
      <div className="retro-window retro-window-sm">
        <div className="retro-window-header bg-gray-100 dark:bg-gray-800 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 pixel-font">
            Live Status
          </span>
        </div>
        <div className="p-3">
          {/* Start: Radio Selector Buttons */}
          <div className="space-y-2">
            {STATUS_OPTIONS.map((option) => (
              <label 
                key={option.id}
                className="flex items-center cursor-pointer transition-all duration-200 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <input
                  type="radio"
                  name="status"
                  checked={selectedStatus === option.id}
                  onChange={() => handleStatusSelect(option.id)}
                  className="sr-only peer"
                />
                <div className={`
                  flex items-center gap-2 w-full
                  ${selectedStatus === option.id ? 'ring-2 ring-purple-500' : ''}
                `}>
                  <span className={`
                    text-xl
                    ${selectedStatus === option.id ? 'scale-110' : ''}
                  `}>
                    {option.icon}
                  </span>
                  <span className={`
                    text-sm font-medium
                    ${selectedStatus === option.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}
                  `}>
                    {option.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {/* End: Radio Selector Buttons */}

          {/* Start: Current Status Indicator */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex items-center gap-2">
            <span className="text-2xl">{mounted ? getStatusEmoji(selectedStatus) : STATUS_OPTIONS[0].icon}</span>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                Status Anda
              </div>
              <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {mounted ? getStatusLabel(selectedStatus) : STATUS_OPTIONS[0].label}
              </div>
            </div>
          </div>
          {/* End: Current Status Indicator */}
        </div>
      </div>
      {/* End: Status Display */}
    </div>
  );
}
