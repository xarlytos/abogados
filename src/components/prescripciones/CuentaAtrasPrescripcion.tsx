/**
 * Componente de Cuenta Atras para Prescripciones
 * Muestra visualmente los días restantes con indicadores de color
 */

import { motion } from 'framer-motion';
import { Clock, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { getIndicadorCuentaAtras } from '@/services/alertasEscalonadasService';

interface CuentaAtrasPrescripcionProps {
  diasRestantes: number;
  compact?: boolean;
  showIcon?: boolean;
  animate?: boolean;
}

export function CuentaAtrasPrescripcion({
  diasRestantes,
  compact = false,
  showIcon = true,
  animate = true,
}: CuentaAtrasPrescripcionProps) {
  const indicador = getIndicadorCuentaAtras(diasRestantes);

  // Determinar color de fondo y borde según urgencia
  const getBgColor = () => {
    if (diasRestantes <= 1) return 'bg-red-500/20 border-red-500/50';
    if (diasRestantes <= 7) return 'bg-red-500/15 border-red-500/40';
    if (diasRestantes <= 15) return 'bg-orange-500/15 border-orange-500/40';
    if (diasRestantes <= 30) return 'bg-amber-500/15 border-amber-500/40';
    if (diasRestantes <= 60) return 'bg-yellow-500/10 border-yellow-500/30';
    if (diasRestantes <= 90) return 'bg-blue-500/10 border-blue-500/30';
    return 'bg-emerald-500/10 border-emerald-500/30';
  };

  // Texto descriptivo
  const getTextoTiempo = () => {
    if (diasRestantes < 0) return 'Vencida';
    if (diasRestantes === 0) return 'Vence hoy';
    if (diasRestantes === 1) return '1 día';
    return `${diasRestantes} días`;
  };

  // Icono según urgencia
  const getIcon = () => {
    if (diasRestantes <= 7) return AlertTriangle;
    if (diasRestantes <= 30) return AlertCircle;
    if (diasRestantes < 0) return CheckCircle;
    return Clock;
  };

  const Icon = getIcon();
  const Wrapper = animate ? motion.div : 'div';

  if (compact) {
    return (
      <Wrapper
        {...(animate && {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          whileHover: { scale: 1.05 },
        })}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${getBgColor()} ${indicador.color}`}
        title={`${diasRestantes > 0 ? 'Quedan' : 'Pasaron'} ${Math.abs(diasRestantes)} días`}
      >
        {showIcon && <Icon className="w-3.5 h-3.5" />}
        <span className="text-sm font-semibold">{getTextoTiempo()}</span>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      {...(animate && {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        whileHover: { scale: 1.02 },
      })}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${getBgColor()}`}
    >
      {showIcon && (
        <div className={`p-1 rounded-lg ${indicador.color} bg-white/10`}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className="flex flex-col">
        <span className={`text-lg font-bold ${indicador.color}`}>
          {getTextoTiempo()}
        </span>
        {diasRestantes > 0 && (
          <span className="text-xs text-theme-secondary">
            para vencimiento
          </span>
        )}
      </div>
    </Wrapper>
  );
}

/**
 * Barra de progreso visual para la cuenta atrás
 */
interface BarraCuentaAtrasProps {
  diasRestantes: number;
  diasTotales?: number;
  height?: 'sm' | 'md' | 'lg';
}

export function BarraCuentaAtras({
  diasRestantes,
  diasTotales = 365,
  height = 'md',
}: BarraCuentaAtrasProps) {
  const porcentaje = Math.max(0, Math.min(100, (diasRestantes / diasTotales) * 100));
  
  const getColor = () => {
    if (diasRestantes <= 7) return 'bg-red-500';
    if (diasRestantes <= 30) return 'bg-amber-500';
    if (diasRestantes <= 90) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getHeight = () => {
    switch (height) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };

  return (
    <div className="w-full">
      <div className={`w-full ${getHeight()} bg-theme-tertiary rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${porcentaje}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`${getHeight()} ${getColor()} rounded-full`}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-theme-secondary">
        <span>0d</span>
        <span className={diasRestantes <= 30 ? 'text-amber-400 font-medium' : ''}>
          {diasRestantes}d restantes
        </span>
        <span>{diasTotales}d</span>
      </div>
    </div>
  );
}

/**
 * Badges de alerta escalonada
 */
interface BadgeAlertaEscalonadaProps {
  diasAntes: number;
  enviada?: boolean;
  leida?: boolean;
}

export function BadgeAlertaEscalonada({
  diasAntes,
  enviada = false,
  leida = false,
}: BadgeAlertaEscalonadaProps) {
  const getColor = () => {
    if (!enviada) return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    if (leida) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    
    // Según días
    if (diasAntes <= 1) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (diasAntes <= 7) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (diasAntes <= 30) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${getColor()}`}>
      {diasAntes}d
      {enviada && !leida && <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />}
    </span>
  );
}

/**
 * Timeline de alertas escalonadas para una prescripción
 */
interface TimelineAlertasProps {
  alertasEnviadas: { diasAntes: number; leida: boolean; nivelEscalacion: string }[];
}

export function TimelineAlertas({ alertasEnviadas }: TimelineAlertasProps) {
  const puntos = [90, 60, 30, 15, 7, 1];

  return (
    <div className="flex items-center gap-1">
      {puntos.map((punto) => {
        const alerta = alertasEnviadas.find((a) => a.diasAntes === punto);
        return (
          <BadgeAlertaEscalonada
            key={punto}
            diasAntes={punto}
            enviada={!!alerta}
            leida={alerta?.leida}
          />
        );
      })}
    </div>
  );
}
