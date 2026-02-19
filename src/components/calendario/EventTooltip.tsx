import { motion } from 'framer-motion';
import { Clock, MapPin, FileText, Briefcase, Gavel, AlertTriangle } from 'lucide-react';
import type { EventoCalendario } from '@/data/calendarioData';

interface EventTooltipProps {
  event: EventoCalendario;
  position: { x: number; y: number };
}

const typeConfig: Record<string, { bg: string; border: string; icon: React.ElementType; text: string }> = {
  vista: { bg: 'bg-blue-500', border: 'border-blue-400', icon: Gavel, text: 'Vista/Audiencia' },
  plazo: { bg: 'bg-red-500', border: 'border-red-400', icon: AlertTriangle, text: 'Plazo' },
  reunion: { bg: 'bg-purple-500', border: 'border-purple-400', icon: Briefcase, text: 'Reunión' },
  entrega: { bg: 'bg-emerald-500', border: 'border-emerald-400', icon: FileText, text: 'Entrega' },
};

export function EventTooltip({ event, position }: EventTooltipProps) {
  const config = typeConfig[event.type] || typeConfig.reunion;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="bg-theme-card border border-theme rounded-xl shadow-2xl p-4 w-72">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-bold text-theme-primary truncate">
                {event.title}
              </h4>
              {event.urgent && (
                <span className="px-1.5 py-0.5 bg-red-500/30 text-red-400 text-[10px] font-bold rounded uppercase flex-shrink-0">
                  Urgente
                </span>
              )}
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} text-white`}>
              {config.text}
            </span>
          </div>
        </div>

        {event.caseTitle && (
          <div className="mt-3 pt-3 border-t border-theme">
            <p className="text-xs text-theme-muted truncate">
              {event.caseTitle}
            </p>
          </div>
        )}

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-theme-secondary">
            <Clock className="w-3.5 h-3.5 text-theme-muted" />
            <span>{event.time}{event.duration && ` • ${event.duration}`}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-xs text-theme-secondary">
              <MapPin className="w-3.5 h-3.5 text-theme-muted" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-theme-secondary">
            <svg className="w-3.5 h-3.5 text-theme-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {new Date(event.date).toLocaleDateString('es-ES', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
