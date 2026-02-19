import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertOctagon, AlertTriangle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConflictos } from '@/hooks/useConflictos';
import { getSeveridadColor } from '@/types/conflictos';

export function ConflictosAlertWidget() {
  const { conflictos, estadisticas, permisos } = useConflictos();

  const conflictosRecientes = useMemo(() => {
    return conflictos
      .filter(c => c.estado === 'detectado' || c.estado === 'en_analisis')
      .slice(0, 5);
  }, [conflictos]);

  if (!permisos.puedeVer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-theme-card border border-theme rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/20 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h3 className="font-semibold text-theme-primary">Alertas de Conflictos</h3>
            <p className="text-sm text-theme-secondary">
              {estadisticas.criticos > 0 ? (
                <span className="text-rose-500 font-medium">{estadisticas.criticos} conflicto(s) crítico(s)</span>
              ) : (
                `${conflictosRecientes.length} conflictos pendientes`
              )}
            </p>
          </div>
        </div>
        <Link
          to="/conflictos"
          className="px-3 py-1.5 text-sm text-accent hover:bg-accent/10 rounded-lg transition-colors"
        >
          Ver todos
        </Link>
      </div>

      {estadisticas.criticos > 0 && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-500" />
            <span className="text-sm text-rose-500 font-medium">
              Requieren atención inmediata
            </span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {conflictosRecientes.length === 0 ? (
          <div className="text-center py-4 text-theme-tertiary">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay conflictos pendientes</p>
          </div>
        ) : (
          conflictosRecientes.map((conflicto) => (
            <Link
              key={conflicto.id}
              to={`/conflictos`}
              className="flex items-start gap-3 p-3 bg-theme-tertiary/30 hover:bg-theme-tertiary/50 rounded-xl transition-colors group"
            >
              <div className={`p-1.5 rounded-lg ${getSeveridadColor(conflicto.severidad)}`}>
                {conflicto.severidad === 'critica' ? (
                  <AlertOctagon className="w-4 h-4" />
                ) : conflicto.severidad === 'alta' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-theme-primary font-medium truncate group-hover:text-accent transition-colors">
                  {conflicto.entidadA.nombre} vs {conflicto.entidadB.nombre}
                </p>
                <p className="text-xs text-theme-secondary truncate">
                  {conflicto.descripcion}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-accent">{conflicto.expedienteId}</span>
                  <span className="text-xs text-theme-tertiary">
                    {new Date(conflicto.fechaDeteccion).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {conflictosRecientes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-theme">
          <div className="flex items-center justify-between text-sm">
            <span className="text-theme-tertiary">Resumen</span>
            <div className="flex items-center gap-3">
              {estadisticas.criticos > 0 && (
                <span className="text-rose-500 font-medium">{estadisticas.criticos} Críticos</span>
              )}
              {estadisticas.altos > 0 && (
                <span className="text-orange-500 font-medium">{estadisticas.altos} Altos</span>
              )}
              <span className="text-theme-secondary">{estadisticas.medios + estadisticas.bajos} Otros</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ConflictosAlertWidget;
