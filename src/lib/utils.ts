// Función para generar IDs únicos
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Funciones de utilidad para colores de estado
export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'en_curso':
    case 'completado':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'pending':
    case 'pendiente':
    case 'pausado':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'closed':
    case 'cerrado':
    case 'rechazado':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    case 'urgent':
    case 'urgente':
    case 'critico':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case 'active':
    case 'en_curso':
      return 'En Curso';
    case 'pending':
    case 'pendiente':
      return 'Pendiente';
    case 'closed':
    case 'cerrado':
      return 'Cerrado';
    case 'completado':
      return 'Completado';
    case 'pausado':
      return 'Pausado';
    case 'urgente':
      return 'Urgente';
    case 'rechazado':
      return 'Rechazado';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export function getColorClass(color: string, type: 'bg' | 'text' | 'border' = 'bg'): string {
  const colorMap: Record<string, Record<string, string>> = {
    emerald: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30'
    },
    amber: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/30'
    },
    blue: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30'
    },
    red: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30'
    },
    purple: {
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
      border: 'border-purple-500/30'
    },
    slate: {
      bg: 'bg-slate-500/20',
      text: 'text-slate-400',
      border: 'border-slate-500/30'
    }
  };

  return colorMap[color]?.[type] || colorMap.blue[type];
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'text-red-400';
    case 'medium':
      return 'text-amber-400';
    case 'low':
      return 'text-emerald-400';
    default:
      return 'text-slate-400';
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'high':
      return 'Alta';
    case 'medium':
      return 'Media';
    case 'low':
      return 'Baja';
    default:
      return priority;
  }
}
