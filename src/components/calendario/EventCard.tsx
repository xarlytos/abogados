import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, MapPin, FileText, Briefcase, Gavel, 
  CheckCircle2, AlertTriangle, MoreVertical, Trash2, Edit
} from 'lucide-react';
import type { EventoCalendario } from '@/data/calendarioData';

interface EventCardProps {
  event: EventoCalendario;
  onEdit?: (event: EventoCalendario) => void;
  onDelete?: (id: string) => void;
  onToggleComplete?: (id: string) => void;
  compact?: boolean;
  canEdit?: boolean;
}

const typeConfig: Record<string, { bg: string; border: string; icon: React.ElementType }> = {
  vista: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: Gavel },
  plazo: { bg: 'bg-red-500/20', border: 'border-red-500/30', icon: AlertTriangle },
  reunion: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', icon: Briefcase },
  entrega: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', icon: FileText },
};

export function EventCard({
  event,
  onEdit,
  onDelete,
  onToggleComplete,
  compact = false,
  canEdit = false,
}: EventCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const config = typeConfig[event.type] || typeConfig.reunion;
  const Icon = config.icon;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          px-2 py-1.5 rounded-lg text-xs truncate cursor-pointer transition-all hover:scale-[1.02]
          ${event.urgent ? 'bg-red-500/20 text-red-400 border border-red-500/30' : `${config.bg} text-white border ${config.border}`}
          ${event.completed ? 'opacity-50 line-through' : ''}
        `}
        onClick={() => onEdit?.(event)}
      >
        <div className="flex items-center gap-1.5">
          <Icon className="w-3 h-3 flex-shrink-0" />
          <span className="truncate font-medium">{event.time} {event.title}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        p-4 rounded-xl border transition-all cursor-pointer group
        ${event.urgent 
          ? 'bg-red-500/10 border-red-500/20 hover:border-red-500/40' 
          : event.completed
            ? 'bg-theme-tertiary/20 border-theme opacity-60'
            : `${config.bg} border ${config.border} hover:scale-[1.01]`
        }
      `}
      onClick={() => onEdit?.(event)}
    >
      <div className="flex items-start gap-3">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
          ${event.urgent ? 'bg-red-500/30' : `${config.bg.replace('/20', '/30')}`}
        `}>
          <Icon className={`w-4 h-4 ${event.urgent ? 'text-red-400' : 'text-white'}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm font-semibold truncate ${
              event.completed ? 'text-theme-muted line-through' : 'text-theme-primary'
            }`}>
              {event.title}
            </p>
            {event.urgent && !event.completed && (
              <span className="px-1.5 py-0.5 bg-red-500/30 text-red-400 text-[10px] font-bold rounded uppercase">
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
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {event.time}{event.duration && ` (${event.duration})`}
            </span>
            {event.location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate max-w-[100px]">{event.location}</span>
              </span>
            )}
          </div>
        </div>

        {canEdit && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 text-theme-muted hover:text-theme-primary hover:bg-theme-tertiary rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-1 bg-theme-card border border-theme rounded-lg shadow-xl overflow-hidden z-20 min-w-[140px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {onToggleComplete && !event.completed && (
                    <button
                      onClick={() => {
                        onToggleComplete(event.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Completar
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onEdit?.(event);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-theme-secondary hover:bg-theme-tertiary flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                    Editar
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(event.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
