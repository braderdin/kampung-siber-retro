"use client";

import { useState, useEffect } from 'react';

interface PrayerTime {
  name: string;
  time: string;
}

interface WeatherData {
  condition: string;
  icon: string;
  temperature: number;
}

export default function NostalgicClockWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Set prayer times (sample data - in production would fetch from API)
    const hours = currentTime.getHours();
    const prayerNames = ['Subuh', 'Syuruk', 'Zuhur', 'Asar', 'Maghrib', 'Isyak'];
    const prayerHours = [5, 6, 13, 16, 18, 19];
    
    const todayPrayerTimes: PrayerTime[] = prayerNames.map((name, i) => ({
      name,
      time: `${prayerHours[i]}:${String(30 + i * 5).padStart(2, '0')}`
    }));
    setPrayerTimes(todayPrayerTimes);

    // Set weather (sample data - in production would fetch from API)
    const isNight = hours < 6 || hours > 18;
    const temperature = 26 + Math.sin(hours * 0.1) * 5;
    
    setWeather({
      condition: isNight ? 'malam' : 'hari',
      icon: isNight ? '🌌' : '☀️',
      temperature: Math.round(temperature)
    });

    return () => clearInterval(timeInterval);
  }, [currentTime]);

  const getWeatherIcon = (): string => {
    if (!weather) return '☁️';
    
    const hour = currentTime.getHours();
    
    if (hour >= 20 || hour < 6) {
      return '🌙';
    } else if (hour >= 18 && hour < 20) {
      return '🌆';
    } else if (hour >= 12 && hour < 18) {
      return '☀️';
    } else {
      return '🌤️';
    }
  };

  const getMatrixStars = (): string => {
    const hour = currentTime.getHours();
    
    if (hour < 6 || hour >= 20) {
      return '🌌';
    }
    return '☁️';
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ms-MY', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('ms-MY', options);
  };

  const getDayIcon = (): string => {
    const hour = currentTime.getHours();
    
    if (hour >= 6 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 18) return '☀️';
    if (hour >= 18 && hour < 20) return '🌇';
    return '🌙';
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="retro-clock-widget retro-card">
      {/* Start: Digital Clock Display */}
      <div className="retro-card-header bg-gray-800 dark:bg-gray-700 px-4 py-3 border-b border-gray-600 dark:border-gray-500">
        <div className="text-center">
          <div className="text-2xl pixel-font text-cyan-400 mb-1">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-300 pixel-font">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>
      {/* End: Digital Clock Display */}

      {/* Start: Day Icon */}
      <div className="p-4 text-center">
        <div className="text-4xl mb-2">
          {getDayIcon()}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
          {currentTime.toLocaleTimeString('ms-MY', { weekday: 'long' })}
        </div>
      </div>
      {/* End: Day Icon */}

      {/* Start: Weather Display */}
      <div className="retro-card-footer bg-gray-50 dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-3">
          {/* Weather Section */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font mb-1">
              Cuaca
            </div>
            <div className="text-2xl">
              {getWeatherIcon()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 pixel-font">
              {weather?.temperature || 26}°C
            </div>
          </div>

          {/* Environment Section */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font mb-1">
              Lingkungan
            </div>
            <div className="text-2xl">
              {getMatrixStars()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 pixel-font">
              Malam punya
            </div>
          </div>
        </div>
      </div>
      {/* End: Weather Display */}

      {/* Start: Prayer Times */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font mb-2">
          Waktu Solat
        </div>
        <div className="grid grid-cols-3 gap-1">
          {prayerTimes.slice(0, 3).map((prayer, index) => (
            <div key={prayer.name} className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-300 pixel-font">
                {prayer.name}
              </div>
              <div className="text-sm font-mono text-cyan-400 pixel-font">
                {prayer.time}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1 mt-1">
          {prayerTimes.slice(3).map((prayer, index) => (
            <div key={prayer.name} className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-300 pixel-font">
                {prayer.name}
              </div>
              <div className="text-sm font-mono text-cyan-400 pixel-font">
                {prayer.time}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End: Prayer Times */}
    </div>
  );
}