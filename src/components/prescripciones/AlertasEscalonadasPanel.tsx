/**
 * Panel de Alertas Escalonadas para Dashboard
 * Muestra las alertas activas con opciones de acción rápida
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Eye,
  AlertOctagon,
  User,
  Users,
  Building2,
} from 'lucide-react';
import { useAlertasEscalonadas } from '@/hooks/useAlertasEscalonadas';
import { CuentaAtrasPrescripcion } from './CuentaAtrasPrescripcion';
import {
  getNivelEscalacionColor,
  getNivelEscalacionTexto,
} from '@/services/alertasEscalonadasService';
import type { NivelEscalacion } from '@/types/prescripciones';

interface AlertasEscalonadasPanelProps {
  compact?: boolean;
  maxItems?: number;
}

export function AlertasEscalonadasPanel({
  compact = false,
  maxItems = 5,
}: AlertasEscalonadasPanelProps) {
  const {
    estadisticas,
    alertasPorNivel,
    prescripcionesCriticas,
    marcarAlertaLeida,
  } = useAlertasEscalonadas();

  const [filtroNivel, setFiltroNivel] = useState<NivelEscalacion | 'todos'>('todos');
  const [expanded, setExpanded] = useState(false);

  // Obtener alertas filtradas
  const alertasFiltradas =
    filtroNivel === 'todos'
      ? Object.values(alertasPorNivel).flat()
      : alertasPorNivel[filtroNivel] || [];

  const alertasMostradas = expanded
    ? alertasFiltradas
    : alertasFiltradas.slice(0, maxItems);

  // Icono según nivel
  const getNivelIcon = (nivel: NivelEscalacion) => {
    switch (nivel) {
      case 'responsable':
        return User;
      case 'supervisor':
        return Users;
      case 'socio':
        return Building2;
      case 'direccion':
        return AlertOctagon;
      default:
        return Bell;
    }
  };

  if (compact) {
    return (
      <div className="bg-theme-secondary border border-theme rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-theme-primary">Alertas Escalonadas</h3>
              <p className="text-xs text-theme-secondary">
                {estadisticas.totalPendientes} prescripciones pendientes
              </p>
            </div>
          </div>
          {estadisticas.criticas > 0 && (
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full animate-pulse">
              {estadisticas.criticas} críticas
            </span>
          )}
        </div>

        {/* Stats rápidos */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(['responsable', 'supervisor', 'socio', 'direccion'] as NivelEscalacion[]).map(
            (nivel) => {
              const count = alertasPorNivel[nivel]?.length || 0;
              const Icon = getNivelIcon(nivel);
              return (
                <button
                  key={nivel}
                  onClick={() => setFiltroNivel(nivel)}
                  className={`p-2 rounded-lg border transition-colors ${
                    filtroNivel === nivel
                      ? 'bg-amber-500/20 border-amber-500/50'
                      : 'bg-theme-tertiary/50 border-theme hover:border-amber-500/30'
                  }`}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1 text-theme-secondary" />
                  <p className="text-lg font-bold text-theme-primary">{count}</p>
                  <p className="text-[10px] text-theme-secondary capitalize">{nivel}</p>
                </button>
              );
            }
          )}
        </div>

        {/* Lista de alertas críticas */}
        <div className="space-y-2">
          {prescripcionesCriticas.slice(0, 3).map((prescripcion) => (
            <div
              key={prescripcion.id}
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-theme-primary truncate">
                    {prescripcion.numeroExpediente}
                  </p>
                  <p className="text-xs text-theme-secondary truncate">
                    {prescripcion.descripcion}
                  </p>
                </div>
                <CuentaAtrasPrescripcion
                  diasRestantes={prescripcion.diasRestantes}
                  compact
                  showIcon={false}
                />
              </div>
            </div>
          ))}

          {prescripcionesCriticas.length === 0 && (
            <div className="p-4 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <p className="text-sm text-theme-secondary">
                No hay prescripciones críticas
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista completa
  return (
    <div className="bg-theme-secondary border border-theme rounded-xl">
      {/* Header */}
      <div className="p-6 border-b border-theme">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-theme-primary">
                Sistema de Alertas Escalonadas
              </h3>
              <p className="text-sm text-theme-secondary">
                {estadisticas.totalPendientes} prescripciones con seguimiento activo
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            {estadisticas.criticas > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">
                  {estadisticas.criticas} críticas
                </span>
              </div>
            )}
            {estadisticas.requierenEscalacion > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 rounded-lg">
                <AlertOctagon className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-400">
                  {estadisticas.requierenEscalacion} por escalar
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filtros por nivel */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setFiltroNivel('todos')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filtroNivel === 'todos'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-theme-tertiary/50 text-theme-secondary hover:text-theme-primary'
            }`}
          >
            Todas ({alertasFiltradas.length})
          </button>
          {(['responsable', 'supervisor', 'socio', 'direccion'] as NivelEscalacion[]).map(
            (nivel) => {
              const count = alertasPorNivel[nivel]?.length || 0;
              if (count === 0) return null;
              return (
                <button
                  key={nivel}
                  onClick={() => setFiltroNivel(nivel)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    filtroNivel === nivel
                      ? getNivelEscalacionColor(nivel)
                      : 'bg-theme-tertiary/50 text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  {getNivelEscalacionTexto(nivel)} ({count})
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="p-6">
        <AnimatePresence mode="popLayout">
          {alertasMostradas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
              <h4 className="text-lg font-medium text-theme-primary mb-2">
                No hay alertas pendientes
              </h4>
              <p className="text-theme-secondary">
                Todas las prescripciones están bajo control
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {alertasMostradas.map((alerta) => (
                <motion.div
                  key={alerta.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-xl border ${getNivelEscalacionColor(
                    alerta.nivelEscalacion
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        {(() => {
                          const Icon = getNivelIcon(alerta.nivelEscalacion);
                          return <Icon className="w-5 h-5" />;
                        })()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-theme-primary">
                            {alerta.prescripcion.numeroExpediente}
                          </h4>
                          <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full">
                            {getNivelEscalacionTexto(alerta.nivelEscalacion)}
                          </span>
                        </div>
                        <p className="text-sm text-theme-secondary mt-1">
                          {alerta.prescripcion.descripcion}
                        </p>
                        <p className="text-xs text-theme-muted mt-1">
                          Responsable: {alerta.prescripcion.responsable}
                        </p>
                        {alerta.mensaje && (
                          <p className="text-sm text-amber-400 mt-2 p-2 bg-amber-500/10 rounded-lg">
                            {alerta.mensaje.split('\n')[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <CuentaAtrasPrescripcion
                        diasRestantes={alerta.prescripcion.diasRestantes}
                        compact
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            marcarAlertaLeida(alerta.prescripcionId, alerta.id)
                          }
                          className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="Marcar como atendida"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Ver más */}
        {alertasFiltradas.length > maxItems && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-4 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
          >
            {expanded
              ? 'Ver menos'
              : `Ver ${alertasFiltradas.length - maxItems} más`}
          </button>
        )}
      </div>
    </div>
  );
}
