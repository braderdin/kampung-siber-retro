"use client";

import { useState, useEffect, useRef } from 'react';

interface CalendarEvent {
  date: string;
  title: string;
}

interface RetroCalendarProps {
  events?: CalendarEvent[];
  month?: number;
  year?: number;
}

export default function RetroCalendar({ 
  events, 
  month, 
  year 
}: RetroCalendarProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(month ?? new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(year ?? new Date().getFullYear());
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simple date formatting without external libraries
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('ms-MY', options);
  };

  const getMonthName = (month: number): string => {
    const monthNames = [
      'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
      'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
    ];
    return monthNames[month] || 'Unknown';
  };

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (day: number): CalendarEvent[] => {
    if (!events || events.length === 0) return [];
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const goToPreviousMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const goToNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  if (!isClient) {
    return (
      <div className="retro-calendar bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-pixel p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
        </div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const dayNames = ['Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab', 'Ahd'];

  return (
    <div className="retro-calendar bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-pixel" ref={calendarRef}>
      {/* Start: Calendar Header */}
      <div className="retro-calendar-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="retro-btn-secondary text-sm px-2 py-1"
        >
          ◀
        </button>
        <h3 className="font-bold text-gray-800 dark:text-gray-200 pixel-font">
          {getMonthName(currentMonth)} {currentYear}
        </h3>
        <button
          onClick={goToNextMonth}
          className="retro-btn-secondary text-sm px-2 py-1"
        >
          ▶
        </button>
      </div>
      {/* End: Calendar Header */}

      {/* Start: Day Names */}
      <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900">
        {dayNames.map((day, idx) => (
          <div 
            key={idx} 
            className="border-r border-gray-200 dark:border-gray-700 p-2 text-center"
          >
            <div className="text-xs font-bold text-gray-600 dark:text-gray-400 pixel-font">
              {day}
            </div>
          </div>
        ))}
      </div>
      {/* End: Day Names */}

      {/* Start: Calendar Days */}
      <div className="grid grid-cols-7">
        {/* Empty cells for days before first of month */}
        {Array.from({ length: firstDay }).map((_, idx) => (
          <div 
            key={`empty-${idx}`} 
            className="border-r border-gray-200 dark:border-gray-700 p-2"
          />
        ))}
        
        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const dayEvents = getEventsForDate(day);
          const isToday = 
            day === new Date().getDate() && 
            currentMonth === new Date().getMonth() && 
            currentYear === new Date().getFullYear();
          
          return (
            <div 
              key={day}
              className={`
                border-r border-gray-200 dark:border-gray-700 p-2 min-h-[60px]
                ${isToday ? 'bg-cyan-100 dark:bg-cyan-900/30 font-bold' : 'bg-white dark:bg-gray-800'}
              `}
            >
              <div className="text-xs text-gray-600 dark:text-gray-400 pixel-font mb-1">
                {day}
              </div>
              {dayEvents.length > 0 && (
                <div className="mt-1">
                  {dayEvents.slice(0, 2).map((event, eIdx) => (
                    <div 
                      key={eIdx}
                      className="text-xs bg-cyan-100 dark:bg-cyan-900/50 px-1 rounded pixel-font truncate"
                      title={event.title}
                    >
                      • {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                      +{dayEvents.length - 2} lagi
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* End: Calendar Days */}

      {/* Start: Event Legend */}
      {events && events.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            <span className="text-cyan-400">•</span> = Aktiviti pada hari ini
          </div>
        </div>
      )}
      {/* End: Event Legend */}
    </div>
  );
}