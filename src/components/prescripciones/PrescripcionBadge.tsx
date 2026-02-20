import { useMemo } from 'react';
import { Clock, AlertCircle, CheckCircle2, AlertTriangle, Bell } from 'lucide-react';
import { getPrescripcionByExpedienteId, getEstadoColor, getPrioridadColor } from '@/data/prescripcionesData';
import type { PrioridadPrescripcion } from '@/types/prescripciones';
import { CuentaAtrasPrescripcion, TimelineAlertas } from './CuentaAtrasPrescripcion';
import { obtenerEstadoAlertaEscalonada } from '@/services/alertasEscalonadasService';

interface PrescripcionBadgeProps {
  expedienteId: string;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PrescripcionBadge({ 
  expedienteId, 
  showTooltip = true,
  size = 'md' 
}: PrescripcionBadgeProps) {
  const prescripcion = useMemo(() => {
    return getPrescripcionByExpedienteId(expedienteId);
  }, [expedienteId]);

  if (!prescripcion) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-slate-400 bg-slate-500/10 border border-slate-500/20 rounded-full">
        <CheckCircle2 className="w-3 h-3" />
        Sin prescripción
      </span>
    );
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const getIcon = () => {
    if (prescripcion.estado === 'vencida') {
      return <AlertCircle className={iconSizes[size]} />;
    }
    if (prescripcion.estado === 'proxima' || prescripcion.prioridad === 'critica') {
      return <AlertTriangle className={iconSizes[size]} />;
    }
    if (prescripcion.estado === 'atendida') {
      return <CheckCircle2 className={iconSizes[size]} />;
    }
    return <Clock className={iconSizes[size]} />;
  };

  const getText = () => {
    if (prescripcion.estado === 'vencida') {
      return `Vencida (${Math.abs(prescripcion.diasRestantes)}d)`;
    }
    if (prescripcion.estado === 'atendida') {
      return 'Atendida';
    }
    if (prescripcion.diasRestantes <= 30) {
      return `${prescripcion.diasRestantes}d restantes`;
    }
    return `${Math.floor(prescripcion.diasRestantes / 30)}m restantes`;
  };

  const badgeClass = prescripcion.estado === 'vencida' 
    ? getEstadoColor(prescripcion.estado)
    : prescripcion.prioridad === 'critica' || prescripcion.prioridad === 'alta'
      ? getPrioridadColor(prescripcion.prioridad)
      : getEstadoColor(prescripcion.estado);

  // Obtener estado de alerta escalonada
  const estadoAlerta = useMemo(() => {
    return obtenerEstadoAlertaEscalonada(prescripcion);
  }, [prescripcion]);

  return (
    <div className="group relative inline-flex">
      <span className={`inline-flex items-center gap-1.5 border rounded-full font-medium ${badgeClass} ${sizeClasses[size]} ${prescripcion.estado === 'vencida' ? 'animate-pulse' : ''}`}>
        {getIcon()}
        {getText()}
      </span>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none min-w-[280px] z-50">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold">{prescripcion.descripcion}</p>
            <CuentaAtrasPrescripcion 
              diasRestantes={prescripcion.diasRestantes} 
              compact 
              animate={false}
            />
          </div>
          
          <p className="text-slate-300">
            Vence: {prescripcion.fechaVencimiento.toLocaleDateString('es-ES')}
          </p>
          
          {prescripcion.accionRequerida && (
            <p className="text-amber-400 mt-2">
              ⚡ Acción: {prescripcion.accionRequerida}
            </p>
          )}
          
          {/* Timeline de alertas */}
          <div className="mt-3 pt-3 border-t border-slate-600">
            <p className="text-slate-400 mb-2">Alertas programadas:</p>
            <TimelineAlertas alertasEnviadas={prescripcion.alertasEnviadas} />
          </div>
          
          {estadoAlerta.siguienteAlerta && (
            <p className="text-amber-400 mt-2 text-[10px]">
              <Bell className="w-3 h-3 inline mr-1" />
              Siguiente alerta: {estadoAlerta.siguienteAlerta.diasAntes}d
            </p>
          )}
          
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
}

// Version simplificada solo con el icono
export function PrescripcionIcon({ expedienteId }: { expedienteId: string }) {
  const prescripcion = useMemo(() => {
    return getPrescripcionByExpedienteId(expedienteId);
  }, [expedienteId]);

  if (!prescripcion) {
    return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
  }

  if (prescripcion.estado === 'vencida') {
    return <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />;
  }

  if (prescripcion.estado === 'proxima' && prescripcion.diasRestantes <= 7) {
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  }

  if (prescripcion.estado === 'proxima') {
    return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  }

  if (prescripcion.estado === 'atendida') {
    return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  }

  return <Clock className="w-4 h-4 text-emerald-500" />;
}

// Indicador de prioridad
export function PrioridadIndicator({ prioridad }: { prioridad: PrioridadPrescripcion }) {
  const colors = {
    baja: 'bg-blue-500',
    media: 'bg-emerald-500',
    alta: 'bg-amber-500',
    critica: 'bg-red-500',
  };

  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[prioridad]} ${prioridad === 'critica' ? 'animate-pulse' : ''}`} />
  );
}

// Contador de alertas
export function AlertasCounter({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
      {count > 9 ? '9+' : count}
    </span>
  );
}
