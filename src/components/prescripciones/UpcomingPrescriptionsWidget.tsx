import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { getPrescripcionesProximas, getPrioridadColor } from '@/data/prescripcionesData';
import type { Prescripcion } from '@/types/prescripciones';

interface UpcomingPrescriptionsWidgetProps {
  maxItems?: number;
  showViewAll?: boolean;
}

export function UpcomingPrescriptionsWidget({ 
  maxItems = 5,
  showViewAll = true 
}: UpcomingPrescriptionsWidgetProps) {
  const navigate = useNavigate();

  const prescripcionesProximas = useMemo(() => {
    return getPrescripcionesProximas(90).slice(0, maxItems);
  }, [maxItems]);

  const stats = useMemo(() => {
    const criticas = prescripcionesProximas.filter(p => p.prioridad === 'critica').length;
    const altas = prescripcionesProximas.filter(p => p.prioridad === 'alta').length;
    const totales = prescripcionesProximas.length;
    return { criticas, altas, totales };
  }, [prescripcionesProximas]);

  const handleVerTodas = () => {
    navigate('/prescripciones');
  };

  const handleVerExpediente = (expedienteId: string) => {
    navigate(`/expedientes/${expedienteId}`);
  };

  if (prescripcionesProximas.length === 0) {
    return (
      <div className="bg-theme-secondary rounded-xl border border-theme p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Prescripciones Próximas
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-theme-secondary">No hay prescripciones próximas a vencer</p>
          <p className="text-theme-tertiary text-sm mt-1">Todas las prescripciones están al día</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-theme-secondary rounded-xl border border-theme overflow-hidden"
    >
      <div className="p-5 border-b border-theme">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              {(stats.criticas > 0 || stats.altas > 0) && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-pulse">
                  {stats.criticas + stats.altas}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-theme-primary">
                Prescripciones Próximas
              </h3>
              <p className="text-sm text-theme-tertiary">
                {stats.totales} en los próximos 90 días
                {stats.criticas > 0 && (
                  <span className="ml-2 text-red-500 font-medium">
                    ({stats.criticas} críticas)
                  </span>
                )}
              </p>
            </div>
          </div>
          {showViewAll && (
            <button
              onClick={handleVerTodas}
              className="text-accent hover:text-accent/80 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-theme">
        {prescripcionesProximas.map((prescripcion, index) => (
          <PrescripcionItem 
            key={prescripcion.id} 
            prescripcion={prescripcion}
            index={index}
            onClick={() => handleVerExpediente(prescripcion.expedienteId)}
          />
        ))}
      </div>

      {showViewAll && (
        <div className="p-4 border-t border-theme bg-theme-primary/50">
          <button
            onClick={handleVerTodas}
            className="w-full py-2.5 px-4 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            Gestionar todas las prescripciones
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

// Item individual de prescripción
function PrescripcionItem({ 
  prescripcion, 
  index,
  onClick 
}: { 
  prescripcion: Prescripcion; 
  index: number;
  onClick: () => void;
}) {
  const getUrgencyColor = () => {
    if (prescripcion.diasRestantes <= 7) return 'text-red-500';
    if (prescripcion.diasRestantes <= 15) return 'text-amber-500';
    if (prescripcion.diasRestantes <= 30) return 'text-orange-500';
    return 'text-emerald-500';
  };

  const getUrgencyBg = () => {
    if (prescripcion.diasRestantes <= 7) return 'bg-red-500/10 border-red-500/20';
    if (prescripcion.diasRestantes <= 15) return 'bg-amber-500/10 border-amber-500/20';
    if (prescripcion.diasRestantes <= 30) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="p-4 hover:bg-theme-hover cursor-pointer transition-colors group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPrioridadColor(prescripcion.prioridad)}`}>
              {prescripcion.prioridad === 'critica' && <AlertCircle className="w-3 h-3 mr-1" />}
              {prescripcion.prioridad.charAt(0).toUpperCase() + prescripcion.prioridad.slice(1)}
            </span>
            <span className="text-xs text-theme-tertiary font-medium">
              {prescripcion.numeroExpediente}
            </span>
          </div>
          <p className="text-sm text-theme-primary font-medium truncate group-hover:text-accent transition-colors">
            {prescripcion.descripcion}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-theme-secondary flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Vence: {prescripcion.fechaVencimiento.toLocaleDateString('es-ES')}
            </span>
            <span className="text-xs text-theme-tertiary">
              Resp: {prescripcion.responsable}
            </span>
          </div>
        </div>

        <div className={`flex flex-col items-end gap-1 ml-4`}>
          <div className={`px-3 py-1.5 rounded-lg border ${getUrgencyBg()}`}>
            <span className={`text-lg font-bold ${getUrgencyColor()}`}>
              {prescripcion.diasRestantes}
            </span>
            <span className={`text-xs ${getUrgencyColor()} ml-0.5`}>días</span>
          </div>
          <ChevronRight className="w-4 h-4 text-theme-tertiary group-hover:text-accent transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}

// Widget compacto para el sidebar o header
export function PrescripcionesMiniWidget() {
  const navigate = useNavigate();
  const criticas = useMemo(() => {
    return getPrescripcionesProximas(30).filter(p => p.prioridad === 'critica').length;
  }, []);

  if (criticas === 0) return null;

  return (
    <button
      onClick={() => navigate('/prescripciones')}
      className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors"
    >
      <AlertCircle className="w-4 h-4 animate-pulse" />
      <span className="text-sm font-medium">{criticas} prescripción{criticas > 1 ? 'es' : ''} crítica{criticas > 1 ? 's' : ''}</span>
    </button>
  );
}

// Stats cards para el dashboard
export function PrescripcionesStatsCards() {
  const stats = useMemo(() => {
    const todas = getPrescripcionesProximas(365);
    return {
      criticas: todas.filter(p => p.prioridad === 'critica' && p.diasRestantes <= 30).length,
      proximas: todas.filter(p => p.prioridad === 'alta' && p.diasRestantes <= 90).length,
      vigentes: todas.filter(p => p.estado === 'vigente').length,
      atendidas: todas.filter(p => p.estado === 'atendida').length,
    };
  }, []);

  const cards = [
    { label: 'Críticas (< 30d)', value: stats.criticas, color: 'red', icon: AlertCircle },
    { label: 'Próximas (< 90d)', value: stats.proximas, color: 'amber', icon: Clock },
    { label: 'Vigentes', value: stats.vigentes, color: 'emerald', icon: Clock },
    { label: 'Atendidas', value: stats.atendidas, color: 'slate', icon: Clock },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div 
          key={card.label}
          className="bg-theme-secondary rounded-xl border border-theme p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-theme-tertiary">{card.label}</p>
              <p className={`text-2xl font-bold text-${card.color}-500 mt-1`}>
                {card.value}
              </p>
            </div>
            <div className={`w-10 h-10 bg-${card.color}-500/10 rounded-lg flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 text-${card.color}-500`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
