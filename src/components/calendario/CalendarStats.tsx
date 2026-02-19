import { motion } from 'framer-motion';
import { 
  Calendar, Clock, AlertTriangle, TrendingUp
} from 'lucide-react';
import type { EventoCalendario } from '@/data/calendarioData';

interface CalendarStatsProps {
  events: EventoCalendario[];
}

export function CalendarStats({ events }: CalendarStatsProps) {
  const today = new Date(2026, 1, 11);
  const todayStr = today.toISOString().split('T')[0];
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  const stats = {
    today: events.filter(e => e.date === todayStr).length,
    todayUrgent: events.filter(e => e.date === todayStr && e.urgent && !e.completed).length,
    thisWeek: events.filter(e => e.date >= weekStartStr && e.date <= weekEndStr).length,
    urgent: events.filter(e => e.urgent && !e.completed).length,
    completed: events.filter(e => e.completed).length,
    pending: events.filter(e => !e.completed).length,
  };

  const statCards = [
    {
      label: 'Hoy',
      value: stats.today,
      subtext: stats.todayUrgent > 0 ? `${stats.todayUrgent} urgente${stats.todayUrgent > 1 ? 's' : ''}` : 'Sin urgencia',
      icon: Calendar,
      color: stats.today > 0 ? 'text-amber-500' : 'text-theme-muted',
      bg: stats.today > 0 ? 'bg-amber-500/20' : 'bg-theme-tertiary',
      urgent: stats.todayUrgent > 0,
    },
    {
      label: 'Esta semana',
      value: stats.thisWeek,
      subtext: 'eventos programados',
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-500/20',
    },
    {
      label: 'Pendientes',
      value: stats.pending,
      subtext: `${stats.completed} completados`,
      icon: Clock,
      color: stats.pending > 3 ? 'text-red-500' : 'text-emerald-500',
      bg: stats.pending > 3 ? 'bg-red-500/20' : 'bg-emerald-500/20',
    },
    {
      label: 'Urgentes',
      value: stats.urgent,
      subtext: 'requieren atención',
      icon: AlertTriangle,
      color: stats.urgent > 0 ? 'text-red-500' : 'text-theme-muted',
      bg: stats.urgent > 0 ? 'bg-red-500/20' : 'bg-theme-tertiary',
      urgent: stats.urgent > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            p-4 rounded-xl border transition-all
            ${stat.urgent 
              ? 'bg-red-500/10 border-red-500/30' 
              : 'bg-theme-card/60 border-theme hover:border-amber-500/30'
            }
          `}
        >
          <div className="flex items-start justify-between mb-2">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            {stat.urgent && (
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <div className="text-2xl font-bold text-theme-primary mb-0.5">
            {stat.value}
          </div>
          <div className="text-xs text-theme-muted">
            {stat.label}
          </div>
          <div className={`text-[10px] mt-1 ${stat.urgent ? 'text-red-400' : 'text-theme-tertiary'}`}>
            {stat.subtext}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
