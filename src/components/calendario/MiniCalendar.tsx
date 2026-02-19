import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { meses } from '@/data/calendarioData';

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date | null;
  eventsCount: Record<string, number>;
  onSelectDate: (date: Date) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function MiniCalendar({
  currentDate,
  selectedDate,
  eventsCount,
  onSelectDate,
  onNavigate,
}: MiniCalendarProps) {
  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const result: { date: number; fullDate: Date; hasEvents: boolean; isToday: boolean; isSelected: boolean }[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const fullDate = new Date(year, month - 1, d);
      const dateStr = fullDate.toISOString().split('T')[0];
      result.push({
        date: d,
        fullDate,
        hasEvents: eventsCount[dateStr] > 0,
        isToday: false,
        isSelected: selectedDate?.toDateString() === fullDate.toDateString(),
      });
    }

    // Current month days
    const today = new Date(2026, 1, 11);
    for (let i = 1; i <= daysInMonth; i++) {
      const fullDate = new Date(year, month, i);
      const dateStr = fullDate.toISOString().split('T')[0];
      result.push({
        date: i,
        fullDate,
        hasEvents: eventsCount[dateStr] > 0,
        isToday: fullDate.toDateString() === today.toDateString(),
        isSelected: selectedDate?.toDateString() === fullDate.toDateString(),
      });
    }

    // Next month days
    const remaining = 42 - result.length;
    for (let i = 1; i <= remaining; i++) {
      const fullDate = new Date(year, month + 1, i);
      const dateStr = fullDate.toISOString().split('T')[0];
      result.push({
        date: i,
        fullDate,
        hasEvents: eventsCount[dateStr] > 0,
        isToday: false,
        isSelected: selectedDate?.toDateString() === fullDate.toDateString(),
      });
    }

    return result;
  }, [currentDate, selectedDate, eventsCount]);

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <div className="bg-theme-card border border-theme rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => onNavigate('prev')}
          className="p-1.5 text-theme-tertiary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-theme-primary">
          {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button
          onClick={() => onNavigate('next')}
          className="p-1.5 text-theme-tertiary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-[10px] font-medium text-theme-muted text-center py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectDate(day.fullDate)}
            className={`
              relative w-7 h-7 text-xs rounded-lg transition-all
              ${day.isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-theme-tertiary'}
              ${day.fullDate.getMonth() !== currentDate.getMonth() ? 'text-theme-muted' : 'text-theme-primary'}
              ${day.isToday && !day.isSelected ? 'bg-amber-500/20 text-amber-500 font-medium' : ''}
            `}
          >
            {day.date}
            {day.hasEvents && (
              <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                day.isSelected ? 'bg-slate-950' : 'bg-amber-500'
              }`} />
            )}
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => onSelectDate(new Date(2026, 1, 11))}
        className="w-full mt-3 py-1.5 text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors"
      >
        Hoy
      </button>
    </div>
  );
}
