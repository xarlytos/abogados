import type { SeveridadConflicto } from '@/types/conflictos';

interface RiesgoBadgeProps {
  nivel: 'bajo' | 'medio' | 'alto' | 'critico';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const config = {
  bajo: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    label: 'Bajo'
  },
  medio: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    label: 'Medio'
  },
  alto: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    label: 'Alto'
  },
  critico: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    label: 'Crítico'
  }
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base'
};

export function RiesgoBadge({ nivel, showLabel = true, size = 'md' }: RiesgoBadgeProps) {
  const style = config[nivel];
  
  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full border font-medium
      ${style.bg} ${style.text} ${style.border}
      ${sizeClasses[size]}
    `}>
      <span className={`w-2 h-2 rounded-full ${style.text.replace('text-', 'bg-')}`} />
      {showLabel && style.label}
    </span>
  );
}

export function SeveridadBadge({ severidad, showLabel = true, size = 'md' }: { 
  severidad: SeveridadConflicto; 
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const mapSeveridadToNivel: Record<SeveridadConflicto, 'bajo' | 'medio' | 'alto' | 'critico'> = {
    baja: 'bajo',
    media: 'medio',
    alta: 'alto',
    critica: 'critico'
  };
  
  return <RiesgoBadge nivel={mapSeveridadToNivel[severidad]} showLabel={showLabel} size={size} />;
}

export default RiesgoBadge;
