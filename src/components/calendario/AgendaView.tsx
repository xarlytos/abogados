import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { EventoCalendario } from '@/data/calendarioData';

interface AgendaViewProps {
  events: EventoCalendario[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onEditEvent: (event: EventoCalendario) => void;
}

const typeConfig: Record<string, { bg: string; border: string }> = {
  vista: { bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  plazo: { bg: 'bg-red-500/20', border: 'border-red-500/30' },
  reunion: { bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
  entrega: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
};

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function formatDateES(date: Date): string {
  const dayName = diasSemana[date.getDay()];
  const monthName = meses[date.getMonth()];
  return `${dayName}, ${date.getDate()} de ${monthName}`;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getDate() === d2.getDate() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getFullYear() === d2.getFullYear();
}

const today = new Date(2026, 1, 11);

function isTodayDate(date: Date): boolean {
  return isSameDay(date, today);
}

export function AgendaView({ events, selectedDate, onSelectDate, onEditEvent }: AgendaViewProps) {
  const groupedEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    const groups: Record<string, EventoCalendario[]> = {};
    sorted.forEach(event => {
      if (!groups[event.date]) {
        groups[event.date] = [];
      }
      groups[event.date].push(event);
    });

    return groups;
  }, [events]);

  const dates = Object.keys(groupedEvents).sort();

  if (dates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-theme-tertiary rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-theme-muted" />
        </div>
        <p className="text-theme-secondary">No hay eventos programados</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {dates.map((dateStr, groupIndex) => {
        const date = new Date(dateStr + 'T00:00:00');
        const dayEvents = groupedEvents[dateStr];
        const isSelected = isSameDay(date, selectedDate);
        const isTodayDateFlag = isTodayDate(date);

        return (
          <motion.div
            key={dateStr}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.05 }}
          >
            <button
              onClick={() => onSelectDate(date)}
              className={`
                w-full flex items-center gap-4 mb-3 p-3 rounded-xl transition-all
                ${isSelected ? 'bg-amber-500/20' : 'hover:bg-theme-tertiary/50'}
              `}
            >
              <div className={`
                w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0
                ${isTodayDateFlag ? 'bg-amber-500 text-slate-950' : 'bg-theme-tertiary text-theme-primary'}
              `}>
                <span className="text-[10px] font-medium uppercase opacity-80">
                  {diasSemana[date.getDay()].substring(0, 3)}
                </span>
                <span className="text-xl font-bold">
                  {date.getDate()}
                </span>
              </div>
              <div className="flex-1 text-left">
                <h3 className={`font-semibold ${isSelected ? 'text-amber-400' : 'text-theme-primary'}`}>
                  {formatDateES(date)}
                </h3>
                <p className="text-sm text-theme-muted">
                  {dayEvents.length} evento{dayEvents.length !== 1 ? 's' : ''}
                </p>
              </div>
              {dayEvents.some(e => e.urgent && !e.completed) && (
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
              )}
            </button>

            {isSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2 ml-2 pl-14 border-l-2 border-theme"
              >
                {dayEvents.map((event, index) => {
                  const config = typeConfig[event.type] || typeConfig.reunion;
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => onEditEvent(event)}
                      className={`
                        p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01]
                        ${event.urgent 
                          ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50' 
                          : event.completed
                            ? 'bg-theme-tertiary/20 border-theme opacity-60'
                            : `${config.bg} border ${config.border} hover:border-amber-500/30`
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0
                          ${event.urgent ? 'bg-red-500/30 text-red-400' : 'bg-theme-card text-theme-secondary'}
                        `}>
                          {event.time}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-medium truncate ${
                              event.completed ? 'text-theme-muted line-through' : 'text-theme-primary'
                            }`}>
                              {event.title}
                            </h4>
                            {event.urgent && !event.completed && (
                              <span className="px-1.5 py-0.5 bg-red-500/20 text-red-500 text-[10px] font-bold rounded uppercase">
                                Urgente
                              </span>
                            )}
                            {event.completed && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          {event.caseTitle && (
                            <p className="text-xs text-theme-muted mt-1 truncate">
                              {event.caseTitle}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 mt-2 text-xs text-theme-tertiary">
                            {event.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {event.duration}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
