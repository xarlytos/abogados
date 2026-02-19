import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, CheckCircle, XCircle, Clock, AlertTriangle,
  Search, Filter, ArrowUpCircle, Eye, CheckSquare
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useValidacion } from '@/hooks/useValidacion';
import { useRole } from '@/hooks/useRole';
import { ValidacionModal } from '@/components/conflictos/ValidacionModal';
import { RiesgoBadge } from '@/components/conflictos/RiesgoBadge';
import type { ValidacionExpediente } from '@/types/conflictos';

const estadoConfig = {
  pendiente: { label: 'Pendiente', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  en_proceso: { label: 'En Proceso', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  aprobado: { label: 'Aprobado', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  rechazado: { label: 'Rechazado', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  escalado: { label: 'Escalado', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' }
};

type FiltroEstado = 'todos' | 'pendientes' | 'aprobadas' | 'rechazadas';
type FiltroRiesgo = 'todos' | 'bajo' | 'medio' | 'alto' | 'critico';

export default function AnalisisConflictos() {
  useRole();
  const {
    validaciones,
    estadisticas,
    permisos,
    iniciarValidacion,
    actualizarChecklist,
    aprobarValidacion,
    rechazarValidacion,
    escalarValidacion,
    checklistCompleto,
    puedeAprobarSegunRiesgo
  } = useValidacion();

  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos');
  const [filtroRiesgo, setFiltroRiesgo] = useState<FiltroRiesgo>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [validacionSeleccionada, setValidacionSeleccionada] = useState<ValidacionExpediente | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filtrar validaciones
  const validacionesFiltradas = useMemo(() => {
    return validaciones.filter(v => {
      if (filtroEstado === 'pendientes' && v.estadoValidacion !== 'pendiente') return false;
      if (filtroEstado === 'aprobadas' && v.estadoValidacion !== 'aprobado') return false;
      if (filtroEstado === 'rechazadas' && v.estadoValidacion !== 'rechazado') return false;
      if (filtroRiesgo !== 'todos' && v.nivelRiesgo !== filtroRiesgo) return false;
      if (busqueda && !v.expedienteId.toLowerCase().includes(busqueda.toLowerCase())) return false;
      return true;
    });
  }, [validaciones, filtroEstado, filtroRiesgo, busqueda]);

  const handleAbrirValidacion = (validacion: ValidacionExpediente) => {
    setValidacionSeleccionada(validacion);
    setModalOpen(true);
    
    if (validacion.estadoValidacion === 'pendiente' && permisos.puedeEjecutarValidacion) {
      iniciarValidacion(validacion.id);
    }
  };

  const handleToggleChecklist = (itemId: string, completado: boolean) => {
    if (validacionSeleccionada) {
      actualizarChecklist(validacionSeleccionada.id, itemId, completado);
    }
  };

  const handleAprobar = (justificacion: string) => {
    if (validacionSeleccionada) {
      aprobarValidacion(validacionSeleccionada.id, justificacion);
      setModalOpen(false);
    }
  };

  const handleRechazar = (justificacion: string) => {
    if (validacionSeleccionada) {
      rechazarValidacion(validacionSeleccionada.id, justificacion);
      setModalOpen(false);
    }
  };

  const handleEscalar = (justificacion: string) => {
    if (validacionSeleccionada) {
      escalarValidacion(validacionSeleccionada.id, justificacion);
      setModalOpen(false);
    }
  };

  return (
    <AppLayout title="Análisis de Conflictos - Validación de Casos">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Validación de Casos</h1>
            <p className="text-gray-400 mt-1">Gestión de aprobaciones y validación de expedientes</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg border border-gray-700 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{estadisticas.pendientes}</p>
                <p className="text-sm text-gray-400">Pendientes</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-lg border border-gray-700 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CheckSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{estadisticas.enProceso}</p>
                <p className="text-sm text-gray-400">En Proceso</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-lg border border-gray-700 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <ArrowUpCircle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{estadisticas.escaladas}</p>
                <p className="text-sm text-gray-400">Escaladas</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-lg border border-gray-700 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{estadisticas.aprobadas}</p>
                <p className="text-sm text-gray-400">Aprobadas</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-lg border border-gray-700 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{estadisticas.rechazadas}</p>
                <p className="text-sm text-gray-400">Rechazadas</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 rounded-lg border border-gray-700 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{estadisticas.requierenAprobacionSocio}</p>
                <p className="text-sm text-gray-400">Req. Socio</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filtros */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por expediente..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as FiltroEstado)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="en_proceso">En Proceso</option>
                <option value="aprobado">Aprobadas</option>
                <option value="rechazado">Rechazadas</option>
                <option value="escalado">Escaladas</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-gray-400" />
              <select
                value={filtroRiesgo}
                onChange={(e) => setFiltroRiesgo(e.target.value as FiltroRiesgo)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="todos">Todos los riesgos</option>
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
                <option value="critico">Crítico</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Validaciones */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50 border-b border-gray-700">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Expediente</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Estado</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Nivel de Riesgo</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Conflictos</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Progreso</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Solicitante</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Fecha</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {validacionesFiltradas.map((validacion) => {
                  const estado = estadoConfig[validacion.estadoValidacion];
                  const progreso = Math.round(
                    (validacion.checklist.filter(i => i.completado).length / validacion.checklist.length) * 100
                  );

                  return (
                    <tr key={validacion.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{validacion.expedienteId}</div>
                        <div className="text-sm text-gray-500">{validacion.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${estado.bg} ${estado.color} border ${estado.border}`}>
                          {estado.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <RiesgoBadge nivel={validacion.nivelRiesgo} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${validacion.conflictosDetectados.length > 0 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
                          {validacion.conflictosDetectados.length} detectados
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 w-24 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-amber-500 h-2 rounded-full transition-all"
                              style={{ width: `${progreso}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-10">{progreso}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">{validacion.solicitadoPor}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {new Date(validacion.fechaSolicitud).toLocaleDateString('es-ES')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleAbrirValidacion(validacion)}
                          className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {validacionesFiltradas.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron validaciones</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Validación */}
      <ValidacionModal
        validacion={validacionSeleccionada}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onToggleChecklist={handleToggleChecklist}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
        onEscalar={handleEscalar}
        puedeAprobar={permisos.puedeAprobar && (validacionSeleccionada ? puedeAprobarSegunRiesgo(validacionSeleccionada) : false)}
        puedeRechazar={permisos.puedeRechazar}
        puedeEscalar={permisos.puedeEscalar}
        checklistCompleto={validacionSeleccionada ? checklistCompleto(validacionSeleccionada) : false}
      />
    </AppLayout>
  );
}
