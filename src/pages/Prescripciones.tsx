import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, Plus, Search, AlertCircle, 
  CheckCircle2, Eye, Edit2, 
  Trash2, X,
  FileText, AlertTriangle
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePrescripciones } from '@/hooks/usePrescripciones';
import { useRole } from '@/hooks/useRole';
import { 
  getEstadoColor, 
  getEstadoTexto, 
  getPrioridadColor, 
  getPrioridadTexto,
  getTipoMateriaColor,
  getTipoMateriaTexto 
} from '@/data/prescripcionesData';
import type { Prescripcion, TipoMateria, EstadoPrescripcion, PrioridadPrescripcion } from '@/types/prescripciones';


// ============================================
// PÁGINA: Prescripciones
// ============================================

export default function Prescripciones() {
  const navigate = useNavigate();
  const { role } = useRole();
  const {
    prescripcionesFiltradas,
    estadisticas,
    filtros,
    setFiltros,
    limpiarFiltros,

  } = usePrescripciones();

  const [vistaActual, setVistaActual] = useState<'lista' | 'calendario' | 'timeline'>('lista');
  const [searchQuery, setSearchQuery] = useState('');

  // Verificar permisos
  const canCreate = role === 'super_admin' || role === 'socio' || role === 'abogado_senior';
  const canEdit = role === 'super_admin' || role === 'socio' || role === 'abogado_senior' || role === 'abogado_junior';
  const canDelete = role === 'super_admin' || role === 'socio';

  // Stats para las cards
  const stats = useMemo(() => [
    { 
      label: 'Críticas', 
      value: estadisticas.porPrioridad.critica, 
      color: 'red',
      icon: AlertCircle,
      filter: () => setFiltros({ ...filtros, prioridad: 'critica' })
    },
    { 
      label: 'Próximas', 
      value: estadisticas.proximas, 
      color: 'amber',
      icon: Clock,
      filter: () => setFiltros({ ...filtros, estado: 'proxima' })
    },
    { 
      label: 'Vigentes', 
      value: estadisticas.vigentes, 
      color: 'emerald',
      icon: CheckCircle2,
      filter: () => setFiltros({ ...filtros, estado: 'vigente' })
    },
    { 
      label: 'Vencidas', 
      value: estadisticas.vencidas, 
      color: 'slate',
      icon: AlertTriangle,
      filter: () => setFiltros({ ...filtros, estado: 'vencida' })
    },
  ], [estadisticas, filtros, setFiltros]);

  const setShowModal = (value: boolean) => {
    console.log('Modal:', value);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFiltros({ ...filtros, busqueda: query });
  };

  const handleVerDetalle = (prescripcion: Prescripcion) => {
    navigate(`/expedientes/${prescripcion.expedienteId}`);
  };

  return (
    <AppLayout title="Prescripciones">
      <div className="min-h-screen bg-theme-primary">
        {/* Header */}
        <div className="px-6 py-6 border-b border-theme">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-theme-primary">Prescripciones</h1>
                <p className="text-theme-secondary">Gestión de plazos legales y alertas</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
                <input
                  type="text"
                  placeholder="Buscar prescripción..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-accent w-64"
                />
              </div>

              {/* Filtros activos */}
              {(filtros.tipo || filtros.estado || filtros.prioridad) && (
                <button
                  onClick={limpiarFiltros}
                  className="px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Limpiar filtros
                </button>
              )}

              {/* Nueva prescripción */}
              {canCreate && (
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nueva Prescripción
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={stat.filter}
                className="bg-theme-secondary rounded-xl border border-theme p-5 cursor-pointer hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-theme-tertiary">{stat.label}</p>
                    <p className={`text-3xl font-bold text-${stat.color}-500 mt-1`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filtros y controles */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <select
                value={filtros.tipo || ''}
                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value as TipoMateria || undefined })}
                className="px-3 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary text-sm focus:outline-none focus:border-accent"
              >
                <option value="">Todos los tipos</option>
                <option value="civil">Civil</option>
                <option value="penal">Penal</option>
                <option value="laboral">Laboral</option>
                <option value="administrativo">Administrativo</option>
              </select>

              <select
                value={filtros.estado || ''}
                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value as EstadoPrescripcion || undefined })}
                className="px-3 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary text-sm focus:outline-none focus:border-accent"
              >
                <option value="">Todos los estados</option>
                <option value="vigente">Vigente</option>
                <option value="proxima">Próxima</option>
                <option value="vencida">Vencida</option>
                <option value="atendida">Atendida</option>
              </select>

              <select
                value={filtros.prioridad || ''}
                onChange={(e) => setFiltros({ ...filtros, prioridad: e.target.value as PrioridadPrescripcion || undefined })}
                className="px-3 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary text-sm focus:outline-none focus:border-accent"
              >
                <option value="">Todas las prioridades</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setVistaActual('lista')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  vistaActual === 'lista' 
                    ? 'bg-accent text-white' 
                    : 'bg-theme-secondary text-theme-secondary hover:text-theme-primary'
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setVistaActual('timeline')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  vistaActual === 'timeline' 
                    ? 'bg-accent text-white' 
                    : 'bg-theme-secondary text-theme-secondary hover:text-theme-primary'
                }`}
              >
                Timeline
              </button>
            </div>
          </div>

          {/* Tabla de prescripciones */}
          <div className="bg-theme-secondary rounded-xl border border-theme overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-theme-primary border-b border-theme">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-theme-tertiary uppercase tracking-wider">
                      Expediente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-theme-tertiary uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-theme-tertiary uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-theme-tertiary uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-theme-tertiary uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-theme-tertiary uppercase tracking-wider">
                      Prioridad
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-theme-tertiary uppercase tracking-wider">
                      Responsable
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-theme-tertiary uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme">
                  {prescripcionesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-theme-tertiary" />
                          </div>
                          <p className="text-theme-secondary font-medium">No se encontraron prescripciones</p>
                          <p className="text-theme-tertiary text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    prescripcionesFiltradas.map((prescripcion, index) => (
                      <motion.tr
                        key={prescripcion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-theme-hover transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium text-theme-primary">
                              {prescripcion.numeroExpediente}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-theme-primary max-w-xs truncate">
                            {prescripcion.descripcion}
                          </p>
                          {prescripcion.accionRequerida && (
                            <p className="text-xs text-amber-500 mt-1 truncate">
                              Acción: {prescripcion.accionRequerida}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTipoMateriaColor(prescripcion.tipo)}`}>
                            {getTipoMateriaTexto(prescripcion.tipo)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-theme-primary">
                              {prescripcion.fechaVencimiento.toLocaleDateString('es-ES')}
                            </span>
                            <span className={`text-xs ${
                              prescripcion.diasRestantes < 0 ? 'text-red-500' :
                              prescripcion.diasRestantes <= 7 ? 'text-red-500' :
                              prescripcion.diasRestantes <= 30 ? 'text-amber-500' :
                              'text-emerald-500'
                            }`}>
                              {prescripcion.diasRestantes < 0 
                                ? `${Math.abs(prescripcion.diasRestantes)} días vencida`
                                : prescripcion.diasRestantes === 0
                                ? 'Vence hoy'
                                : `${prescripcion.diasRestantes} días restantes`
                              }
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEstadoColor(prescripcion.estado)}`}>
                            {getEstadoTexto(prescripcion.estado)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPrioridadColor(prescripcion.prioridad)}`}>
                            {getPrioridadTexto(prescripcion.prioridad)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-theme-secondary">
                            {prescripcion.responsable}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleVerDetalle(prescripcion)}
                              className="p-1.5 text-theme-tertiary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                              title="Ver expediente"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {canEdit && (
                              <button
                                className="p-1.5 text-theme-tertiary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                className="p-1.5 text-theme-tertiary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timeline View */}
          {vistaActual === 'timeline' && (
            <TimelineView prescripciones={prescripcionesFiltradas} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// Componente de Timeline
function TimelineView({ prescripciones }: { prescripciones: Prescripcion[] }) {
  const sortedPrescripciones = useMemo(() => {
    return [...prescripciones].sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [prescripciones]);

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-semibold text-theme-primary">Timeline de Prescripciones</h3>
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-theme" />
        
        {sortedPrescripciones.map((prescripcion, index) => (
          <motion.div
            key={prescripcion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start gap-6 mb-6"
          >
            <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 ${
              prescripcion.diasRestantes < 0 ? 'bg-red-500 border-red-500' :
              prescripcion.diasRestantes <= 7 ? 'bg-red-500 border-red-500' :
              prescripcion.diasRestantes <= 30 ? 'bg-amber-500 border-amber-500' :
              'bg-emerald-500 border-emerald-500'
            }`}>
              <span className="text-white font-bold text-sm">
                {prescripcion.diasRestantes < 0 ? '!' : prescripcion.diasRestantes}
              </span>
            </div>
            
            <div className="flex-1 bg-theme-secondary rounded-xl border border-theme p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-theme-primary">{prescripcion.descripcion}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(prescripcion.prioridad)}`}>
                  {getPrioridadTexto(prescripcion.prioridad)}
                </span>
              </div>
              <p className="text-sm text-theme-secondary mb-2">
                Expediente: {prescripcion.numeroExpediente} | Responsable: {prescripcion.responsable}
              </p>
              <p className="text-xs text-theme-tertiary">
                Vence: {prescripcion.fechaVencimiento.toLocaleDateString('es-ES')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
