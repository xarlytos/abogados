import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Plus, Download, 
  Building2, User, AlertCircle, CheckCircle2, ChevronRight, 
  ChevronLeft, MapPin, Phone, Mail, Tag, Briefcase,
  Trash2, Edit2, Eye, X, FileSpreadsheet,
  AlertTriangle, Shield
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePartesContrarias } from '@/hooks/usePartesContrarias';
import type { 
  ParteContraria,
  TipoParte
} from '@/types/conflictos';
import { ETAPAS_WIZARD } from '@/types/conflictos';
import {
  getTipoParteColor,
  getTipoParteTexto,
  getEtiquetaColor,
  obtenerNombreParte,
  obtenerIdentificadorParte,
  PROVINCIAS_ESPANA
} from '@/types/conflictos';
import {
  etiquetasUnicas
} from '@/data/partesContrariasData';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ConflictosPartesContrarias() {
  const {
    partesFiltradas,
    filtros,
    setFiltros,
    limpiarFiltros,
    permisos,
    crearParte,
    eliminarParte,
    exportarCSV,
    estadisticas,
    isLoading
  } = usePartesContrarias();

  // Estados UI
  const [vista, setVista] = useState<'lista' | 'grid'>('lista');
  const [mostrarWizard, setMostrarWizard] = useState(false);
  const [parteSeleccionada, setParteSeleccionada] = useState<ParteContraria | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [parteAEliminar, setParteAEliminar] = useState<ParteContraria | null>(null);

  // Handlers
  const handleCrearParte = useCallback(async (datos: Partial<ParteContraria>) => {
    try {
      await crearParte(datos);
      setMostrarWizard(false);
      setMensajeExito('Parte contraria creada exitosamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (err) {
      // Error ya manejado en el hook
    }
  }, [crearParte]);

  const handleEliminarParte = useCallback(async () => {
    if (!parteAEliminar) return;
    
    try {
      await eliminarParte(parteAEliminar.id);
      setParteAEliminar(null);
      setMensajeExito('Parte contraria eliminada exitosamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (err) {
      // Error ya manejado en el hook
    }
  }, [eliminarParte, parteAEliminar]);

  const handleExportarCSV = useCallback(() => {
    try {
      const csv = exportarCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `partes-contrarias-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      setMensajeExito('Archivo exportado exitosamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (err) {
      // Error ya manejado en el hook
    }
  }, [exportarCSV]);

  // Si no tiene permisos
  if (!permisos.puedeVer) {
    return (
      <AppLayout title="Acceso Restringido">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Shield className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-theme-primary mb-2">
              Acceso Restringido
            </h2>
            <p className="text-theme-secondary">
              No tiene permisos para acceder a la base de datos de partes contrarias.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Partes Contrarias - Conflictos">
      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-theme-secondary mb-2">
            <span>Conflictos</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent font-medium">Partes Contrarias</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-theme-primary mb-1">
                Base de Datos de Partes Contrarias
              </h1>
              <p className="text-theme-secondary">
                Gestión centralizada de partes contrarias históricas y actuales
              </p>
            </div>
            <div className="flex items-center gap-3">
              {permisos.puedeExportar && (
                <button
                  onClick={handleExportarCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary hover:bg-theme-hover transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              )}

              {permisos.puedeCrear && (
                <button
                  onClick={() => {
                    setParteSeleccionada(null);
                    setMostrarWizard(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Nueva Parte Contraria
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mensaje de éxito */}
        <AnimatePresence>
          {mensajeExito && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-3 text-emerald-500"
            >
              <CheckCircle2 className="w-5 h-5" />
              {mensajeExito}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={Users}
            label="Total Partes"
            value={estadisticas.total}
            color="blue"
          />
          <StatCard
            icon={User}
            label="Personas Físicas"
            value={estadisticas.fisicas}
            color="emerald"
          />
          <StatCard
            icon={Building2}
            label="Personas Jurídicas"
            value={estadisticas.juridicas}
            color="purple"
          />
          <StatCard
            icon={Briefcase}
            label="Con Expedientes"
            value={estadisticas.conExpedientes}
            color="amber"
          />
          <StatCard
            icon={AlertTriangle}
            label="Con Conflictos"
            value={estadisticas.conConflictos}
            color="rose"
          />
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-theme-secondary border border-theme rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-tertiary" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, documento, etiquetas..."
                  value={filtros.busqueda || ''}
                  onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            
            <select
              value={filtros.tipo || ''}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value as TipoParte | undefined })}
              className="px-4 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-accent"
            >
              <option value="">Todos los tipos</option>
              <option value="persona_fisica">Persona Física</option>
              <option value="persona_juridica">Persona Jurídica</option>
            </select>

            <select
              value={filtros.tieneConflictos === undefined ? '' : filtros.tieneConflictos ? 'si' : 'no'}
              onChange={(e) => {
                const valor = e.target.value;
                setFiltros({
                  ...filtros,
                  tieneConflictos: valor === '' ? undefined : valor === 'si'
                });
              }}
              className="px-4 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-accent"
            >
              <option value="">Conflictos: Todos</option>
              <option value="si">Con conflictos</option>
              <option value="no">Sin conflictos</option>
            </select>

            <div className="flex items-center gap-2 border-l border-theme pl-4">
              <button
                onClick={() => setVista('lista')}
                className={`p-2 rounded-lg transition-colors ${
                  vista === 'lista' 
                    ? 'bg-accent text-white' 
                    : 'text-theme-tertiary hover:text-theme-primary hover:bg-theme-primary'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5" />
              </button>
              <button
                onClick={() => setVista('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  vista === 'grid' 
                    ? 'bg-accent text-white' 
                    : 'text-theme-tertiary hover:text-theme-primary hover:bg-theme-primary'
                }`}
              >
                <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                  <div className="bg-current rounded-sm" />
                  <div className="bg-current rounded-sm" />
                  <div className="bg-current rounded-sm" />
                  <div className="bg-current rounded-sm" />
                </div>
              </button>
            </div>

            <button
              onClick={limpiarFiltros}
              className="px-4 py-2 text-theme-tertiary hover:text-theme-primary transition-colors"
            >
              Limpiar filtros
            </button>
          </div>

          {/* Filtro de etiquetas */}
          {etiquetasUnicas.length > 0 && (
            <div className="mt-4 pt-4 border-t border-theme">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-theme-tertiary" />
                <span className="text-sm text-theme-tertiary">Filtrar por etiquetas:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {etiquetasUnicas.slice(0, 15).map((etiqueta, index) => {
                  const isSelected = filtros.etiquetas?.includes(etiqueta);
                  return (
                    <button
                      key={etiqueta}
                      onClick={() => {
                        const currentEtiquetas = filtros.etiquetas || [];
                        const nuevasEtiquetas = isSelected
                          ? currentEtiquetas.filter(e => e !== etiqueta)
                          : [...currentEtiquetas, etiqueta];
                        setFiltros({ ...filtros, etiquetas: nuevasEtiquetas });
                      }}
                      className={`px-3 py-1 text-xs rounded-full border transition-all ${
                        isSelected
                          ? getEtiquetaColor(index)
                          : 'bg-theme-primary border-theme text-theme-secondary hover:border-theme-hover'
                      }`}
                    >
                      {etiqueta}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Lista de partes */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
          </div>
        ) : partesFiltradas.length === 0 ? (
          <div className="text-center py-16 bg-theme-secondary border border-theme rounded-lg">
            <Users className="w-16 h-16 text-theme-tertiary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-theme-primary mb-2">
              No se encontraron partes contrarias
            </h3>
            <p className="text-theme-secondary mb-4">
              {filtros.busqueda || filtros.tipo || filtros.etiquetas?.length
                ? 'Prueba ajustando los filtros de búsqueda'
                : 'Comienza creando la primera parte contraria'}
            </p>
            {permisos.puedeCrear && (
              <button
                onClick={() => setMostrarWizard(true)}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity mx-auto"
              >
                <Plus className="w-4 h-4" />
                Crear primera parte
              </button>
            )}
          </div>
        ) : vista === 'lista' ? (
          <TablaPartesContrarias
            partes={partesFiltradas}
            onVerDetalle={(parte) => {
              setParteSeleccionada(parte);
              // TODO: Implementar vista de detalle
              console.log('Ver detalle:', parte);
            }}
            onEditar={(parte) => {
              setParteSeleccionada(parte);
              setMostrarWizard(true);
            }}
            onEliminar={(parte) => setParteAEliminar(parte)}
            permisos={permisos}
          />
        ) : (
          <GridPartesContrarias
            partes={partesFiltradas}
            onVerDetalle={(parte) => {
              setParteSeleccionada(parte);
              // TODO: Implementar vista de detalle
              console.log('Ver detalle:', parte);
            }}
            onEditar={(parte) => {
              setParteSeleccionada(parte);
              setMostrarWizard(true);
            }}
            onEliminar={(parte) => setParteAEliminar(parte)}
            permisos={permisos}
          />
        )}
      </div>

      {/* Wizard Modal */}
      <WizardParteContraria
        isOpen={mostrarWizard}
        onClose={() => setMostrarWizard(false)}
        onSubmit={handleCrearParte}
        parteInicial={parteSeleccionada}
      />

      {/* Modal de confirmación de eliminación */}
      <ModalConfirmacion
        isOpen={!!parteAEliminar}
        onClose={() => setParteAEliminar(null)}
        onConfirm={handleEliminarParte}
        titulo="¿Eliminar parte contraria?"
        mensaje={`¿Estás seguro de que deseas eliminar a ${parteAEliminar ? obtenerNombreParte(parteAEliminar) : ''}? Esta acción no se puede deshacer.`}
        isDestructive
      />
    </AppLayout>
  );
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: number;
  color: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose';
}) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    purple: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
    amber: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    rose: 'bg-rose-500/20 text-rose-500 border-rose-500/30'
  };

  return (
    <div className="bg-theme-secondary border border-theme rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-theme-tertiary mb-1">{label}</p>
          <p className="text-3xl font-bold text-theme-primary">{value}</p>
        </div>
        <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

// Tabla de partes contrarias
function TablaPartesContrarias({
  partes,
  onVerDetalle,
  onEditar,
  onEliminar,
  permisos
}: {
  partes: ParteContraria[];
  onVerDetalle: (parte: ParteContraria) => void;
  onEditar: (parte: ParteContraria) => void;
  onEliminar: (parte: ParteContraria) => void;
  permisos: { puedeVer: boolean; puedeEditar: boolean; puedeEliminar: boolean };
}) {
  return (
    <div className="bg-theme-secondary border border-theme rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-theme">
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-tertiary uppercase">
                Nombre / Razón Social
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-tertiary uppercase">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-tertiary uppercase">
                Documento
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-tertiary uppercase">
                Ubicación
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-tertiary uppercase">
                Expedientes
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-theme-tertiary uppercase">
                Etiquetas
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-theme-tertiary uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            {partes.map((parte) => (
              <tr 
                key={parte.id} 
                className="hover:bg-theme-hover transition-colors group"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${parte.tipo === 'persona_fisica' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
                      {parte.tipo === 'persona_fisica' ? (
                        <User className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Building2 className="w-4 h-4 text-purple-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-theme-primary">
                        {obtenerNombreParte(parte)}
                      </p>
                      {parte.empresaMatrizId && (
                        <p className="text-xs text-theme-tertiary">
                          Filial de grupo empresarial
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getTipoParteColor(parte.tipo)}`}>
                    {getTipoParteTexto(parte.tipo)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-sm text-theme-secondary">
                    {obtenerIdentificadorParte(parte)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-theme-secondary">
                    <MapPin className="w-4 h-4 text-theme-tertiary" />
                    <span className="text-sm">
                      {parte.direccion?.ciudad || 'Sin ubicación'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-theme-tertiary" />
                    <span className="text-sm text-theme-primary">
                      {parte.totalExpedientes}
                    </span>
                    {parte.expedientesActivos > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-500 rounded-full">
                        {parte.expedientesActivos} activos
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {parte.etiquetas.slice(0, 3).map((etiqueta, index) => (
                      <span
                        key={etiqueta}
                        className={`px-2 py-0.5 text-xs rounded-full border ${getEtiquetaColor(index)}`}
                      >
                        {etiqueta}
                      </span>
                    ))}
                    {parte.etiquetas.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-theme-tertiary">
                        +{parte.etiquetas.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onVerDetalle(parte)}
                      className="p-2 text-theme-tertiary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {permisos.puedeEditar && (
                      <button
                        onClick={() => onEditar(parte)}
                        className="p-2 text-theme-tertiary hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {permisos.puedeEliminar && (
                      <button
                        onClick={() => onEliminar(parte)}
                        className="p-2 text-theme-tertiary hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Grid de partes contrarias
function GridPartesContrarias({
  partes,
  onVerDetalle,
  onEditar,
  onEliminar,
  permisos
}: {
  partes: ParteContraria[];
  onVerDetalle: (parte: ParteContraria) => void;
  onEditar: (parte: ParteContraria) => void;
  onEliminar: (parte: ParteContraria) => void;
  permisos: { puedeVer: boolean; puedeEditar: boolean; puedeEliminar: boolean };
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {partes.map((parte) => (
        <motion.div
          key={parte.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-theme-secondary border border-theme rounded-lg p-4 hover:border-accent/50 transition-colors group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${parte.tipo === 'persona_fisica' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
              {parte.tipo === 'persona_fisica' ? (
                <User className="w-5 h-5 text-blue-500" />
              ) : (
                <Building2 className="w-5 h-5 text-purple-500" />
              )}
            </div>
            <span className={`px-2 py-1 text-xs rounded-full border ${getTipoParteColor(parte.tipo)}`}>
              {getTipoParteTexto(parte.tipo)}
            </span>
          </div>

          <h3 className="font-semibold text-theme-primary mb-1">
            {obtenerNombreParte(parte)}
          </h3>
          
          <p className="font-mono text-xs text-theme-secondary mb-3">
            {obtenerIdentificadorParte(parte)}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-theme-secondary">
              <MapPin className="w-4 h-4 text-theme-tertiary" />
              {parte.direccion?.ciudad || 'Sin ubicación'}
            </div>
            <div className="flex items-center gap-2 text-sm text-theme-secondary">
              <Briefcase className="w-4 h-4 text-theme-tertiary" />
              {parte.totalExpedientes} expedientes
              {parte.expedientesActivos > 0 && (
                <span className="text-emerald-500">({parte.expedientesActivos} activos)</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {parte.etiquetas.slice(0, 3).map((etiqueta, index) => (
              <span
                key={etiqueta}
                className={`px-2 py-0.5 text-xs rounded-full border ${getEtiquetaColor(index)}`}
              >
                {etiqueta}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-theme">
            <button
              onClick={() => onVerDetalle(parte)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-theme-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              Ver
            </button>
            {permisos.puedeEditar && (
              <button
                onClick={() => onEditar(parte)}
                className="flex items-center justify-center p-2 text-theme-tertiary hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {permisos.puedeEliminar && (
              <button
                onClick={() => onEliminar(parte)}
                className="flex items-center justify-center p-2 text-theme-tertiary hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// WIZARD DE CREACIÓN/EDICIÓN
// ============================================

function WizardParteContraria({
  isOpen,
  onClose,
  onSubmit,
  parteInicial
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (datos: Partial<ParteContraria>) => void;
  parteInicial: ParteContraria | null;
}) {
  const [pasoActual, setPasoActual] = useState<number>(0);
  const [datos, setDatos] = useState<Partial<ParteContraria>>({
    tipo: 'persona_fisica',
    etiquetas: []
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Resetear al abrir/cerrar
  useState(() => {
    if (isOpen) {
      if (parteInicial) {
        setDatos({ ...parteInicial });
      } else {
        setDatos({ tipo: 'persona_fisica', etiquetas: [] });
      }
      setPasoActual(0);
      setErrores({});
    }
  });

  const etapas = ETAPAS_WIZARD;

  const validarPaso = (paso: number): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (paso === 1) { // Datos básicos
      if (datos.tipo === 'persona_fisica') {
        if (!datos.nombreCompleto?.trim()) {
          nuevosErrores.nombreCompleto = 'El nombre completo es obligatorio';
        }
        if (!datos.documentoIdentidad?.trim()) {
          nuevosErrores.documentoIdentidad = 'El documento de identidad es obligatorio';
        }
      } else {
        if (!datos.razonSocial?.trim()) {
          nuevosErrores.razonSocial = 'La razón social es obligatoria';
        }
        if (!datos.cifNif?.trim()) {
          nuevosErrores.cifNif = 'El CIF/NIF es obligatorio';
        }
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSiguiente = () => {
    if (validarPaso(pasoActual)) {
      setPasoActual(prev => Math.min(prev + 1, etapas.length - 1));
    }
  };

  const handleAnterior = () => {
    setPasoActual(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (validarPaso(pasoActual)) {
      onSubmit(datos);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-theme-primary border border-theme rounded-xl shadow-xl overflow-hidden"
      >
        {/* Header del wizard */}
        <div className="px-6 py-4 border-b border-theme flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-theme-primary">
              {parteInicial ? 'Editar Parte Contraria' : 'Nueva Parte Contraria'}
            </h2>
            <p className="text-sm text-theme-secondary">
              {etapas[pasoActual].descripcion}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-theme-tertiary hover:text-theme-primary hover:bg-theme-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progreso */}
        <div className="px-6 py-4 border-b border-theme">
          <div className="flex items-center justify-between">
            {etapas.map((etapa, index) => (
              <div key={etapa.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index < pasoActual
                      ? 'bg-emerald-500 text-white'
                      : index === pasoActual
                      ? 'bg-accent text-white'
                      : 'bg-theme-secondary text-theme-tertiary'
                  }`}
                >
                  {index < pasoActual ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < etapas.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-colors ${
                      index < pasoActual ? 'bg-emerald-500' : 'bg-theme'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-theme-tertiary">
            {etapas.map((etapa) => (
              <span key={etapa.id} className="w-8 text-center">
                {etapa.titulo}
              </span>
            ))}
          </div>
        </div>

        {/* Contenido del paso */}
        <div className="p-6 min-h-[400px]">
          {pasoActual === 0 && (
            <PasoTipoEntidad
              tipo={datos.tipo || 'persona_fisica'}
              onChange={(tipo) => setDatos({ ...datos, tipo })}
            />
          )}
          {pasoActual === 1 && (
            <PasoDatosBasicos
              datos={datos}
              onChange={(nuevosDatos) => setDatos({ ...datos, ...nuevosDatos })}
              errores={errores}
            />
          )}
          {pasoActual === 2 && (
            <PasoDireccionContacto
              direccion={datos.direccion}
              contacto={datos.contacto}
              onChange={(campo, valor) => setDatos({ ...datos, [campo]: valor })}
            />
          )}
          {pasoActual === 3 && (
            <PasoRelaciones
              parte={datos}
              etiquetas={datos.etiquetas || []}
              onChangeEtiquetas={(etiquetas) => setDatos({ ...datos, etiquetas })}
              representanteLegal={datos.representanteLegal}
              onChangeRepresentante={(valor) => setDatos({ ...datos, representanteLegal: valor })}
            />
          )}
          {pasoActual === 4 && (
            <PasoResumen datos={datos} />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-theme-secondary hover:text-theme-primary transition-colors"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-3">
            {pasoActual > 0 && (
              <button
                onClick={handleAnterior}
                className="flex items-center gap-2 px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary hover:bg-theme-hover transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
            )}
            {pasoActual < etapas.length - 1 ? (
              <button
                onClick={handleSiguiente}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <CheckCircle2 className="w-4 h-4" />
                {parteInicial ? 'Guardar Cambios' : 'Crear Parte Contraria'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// PASOS DEL WIZARD
// ============================================

function PasoTipoEntidad({ 
  tipo, 
  onChange 
}: { 
  tipo: TipoParte; 
  onChange: (tipo: TipoParte) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-theme-primary mb-6">
        ¿Qué tipo de entidad deseas registrar?
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onChange('persona_fisica')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            tipo === 'persona_fisica'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-theme hover:border-blue-500/50 hover:bg-blue-500/5'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            tipo === 'persona_fisica' ? 'bg-blue-500' : 'bg-theme-secondary'
          }`}>
            <User className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-theme-primary mb-1">Persona Física</h4>
          <p className="text-sm text-theme-secondary">
            Individual con DNI/NIE o pasaporte
          </p>
        </button>

        <button
          onClick={() => onChange('persona_juridica')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            tipo === 'persona_juridica'
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-theme hover:border-purple-500/50 hover:bg-purple-500/5'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            tipo === 'persona_juridica' ? 'bg-purple-500' : 'bg-theme-secondary'
          }`}>
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-theme-primary mb-1">Persona Jurídica</h4>
          <p className="text-sm text-theme-secondary">
            Empresa, organización o entidad con CIF/NIF
          </p>
        </button>
      </div>
    </div>
  );
}

function PasoDatosBasicos({
  datos,
  onChange,
  errores
}: {
  datos: Partial<ParteContraria>;
  onChange: (datos: Partial<ParteContraria>) => void;
  errores: Record<string, string>;
}) {
  const isPersonaFisica = datos.tipo === 'persona_fisica';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-theme-primary mb-6">
        {isPersonaFisica ? 'Datos de la Persona' : 'Datos de la Empresa'}
      </h3>

      {isPersonaFisica ? (
        <>
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">
              Nombre completo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={datos.nombreCompleto || ''}
              onChange={(e) => onChange({ nombreCompleto: e.target.value })}
              placeholder="Ej: Juan García Martínez"
              className={`w-full px-4 py-2 bg-theme-secondary border rounded-lg text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:border-accent ${
                errores.nombreCompleto ? 'border-rose-500' : 'border-theme'
              }`}
            />
            {errores.nombreCompleto && (
              <p className="mt-1 text-sm text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errores.nombreCompleto}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">
              Documento de identidad <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={datos.documentoIdentidad || ''}
              onChange={(e) => onChange({ documentoIdentidad: e.target.value })}
              placeholder="Ej: 12345678A"
              className={`w-full px-4 py-2 bg-theme-secondary border rounded-lg text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:border-accent ${
                errores.documentoIdentidad ? 'border-rose-500' : 'border-theme'
              }`}
            />
            {errores.documentoIdentidad && (
              <p className="mt-1 text-sm text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errores.documentoIdentidad}
              </p>
            )}
            <p className="mt-1 text-xs text-theme-tertiary">
              DNI, NIE o pasaporte
            </p>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">
              Razón social <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={datos.razonSocial || ''}
              onChange={(e) => onChange({ razonSocial: e.target.value })}
              placeholder="Ej: Empresa Ejemplo SL"
              className={`w-full px-4 py-2 bg-theme-secondary border rounded-lg text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:border-accent ${
                errores.razonSocial ? 'border-rose-500' : 'border-theme'
              }`}
            />
            {errores.razonSocial && (
              <p className="mt-1 text-sm text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errores.razonSocial}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">
              CIF/NIF <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={datos.cifNif || ''}
              onChange={(e) => onChange({ cifNif: e.target.value })}
              placeholder="Ej: B-12345678"
              className={`w-full px-4 py-2 bg-theme-secondary border rounded-lg text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:border-accent ${
                errores.cifNif ? 'border-rose-500' : 'border-theme'
              }`}
            />
            {errores.cifNif && (
              <p className="mt-1 text-sm text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errores.cifNif}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function PasoDireccionContacto({
  direccion,
  contacto,
  onChange
}: {
  direccion?: { calle?: string; ciudad?: string; provincia?: string; codigoPostal?: string };
  contacto?: { telefono?: string; email?: string };
  onChange: (campo: string, valor: any) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-theme-primary mb-6">
        Dirección y Datos de Contacto
      </h3>

      <div>
        <label className="block text-sm font-medium text-theme-secondary mb-2">
          Dirección
        </label>
        <input
          type="text"
          value={direccion?.calle || ''}
          onChange={(e) => onChange('direccion', { ...direccion, calle: e.target.value })}
          placeholder="Ej: Calle Mayor 45, 3º B"
          className="w-full px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-theme-secondary mb-2">
            Ciudad
          </label>
          <input
            type="text"
            value={direccion?.ciudad || ''}
            onChange={(e) => onChange('direccion', { ...direccion, ciudad: e.target.value })}
            placeholder="Ej: Madrid"
            className="w-full px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-theme-secondary mb-2">
            Código Postal
          </label>
          <input
            type="text"
            value={direccion?.codigoPostal || ''}
            onChange={(e) => onChange('direccion', { ...direccion, codigoPostal: e.target.value })}
            placeholder="Ej: 28013"
            className="w-full px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-theme-secondary mb-2">
          Provincia
        </label>
        <select
          value={direccion?.provincia || ''}
          onChange={(e) => onChange('direccion', { ...direccion, provincia: e.target.value })}
          className="w-full px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary focus:outline-none focus:border-accent"
        >
          <option value="">Selecciona provincia</option>
          {PROVINCIAS_ESPANA.map(provincia => (
            <option key={provincia} value={provincia}>{provincia}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-theme-secondary mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            value={contacto?.telefono || ''}
            onChange={(e) => onChange('contacto', { ...contacto, telefono: e.target.value })}
            placeholder="Ej: +34 612 345 678"
            className="w-full px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-theme-secondary mb-2">
            Email
          </label>
          <input
            type="email"
            value={contacto?.email || ''}
            onChange={(e) => onChange('contacto', { ...contacto, email: e.target.value })}
            placeholder="Ej: contacto@ejemplo.com"
            className="w-full px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:border-accent"
          />
        </div>
      </div>
    </div>
  );
}

function PasoRelaciones({
  parte,
  etiquetas,
  onChangeEtiquetas,
  representanteLegal,
  onChangeRepresentante
}: {
  parte: Partial<ParteContraria>;
  etiquetas: string[];
  onChangeEtiquetas: (etiquetas: string[]) => void;
  representanteLegal?: string;
  onChangeRepresentante: (valor: string) => void;
}) {
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');

  const agregarEtiqueta = () => {
    if (nuevaEtiqueta.trim() && !etiquetas.includes(nuevaEtiqueta.trim())) {
      onChangeEtiquetas([...etiquetas, nuevaEtiqueta.trim()]);
      setNuevaEtiqueta('');
    }
  };

  const eliminarEtiqueta = (etiqueta: string) => {
    onChangeEtiquetas(etiquetas.filter(e => e !== etiqueta));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-theme-primary mb-6">
        Relaciones y Etiquetas
      </h3>

      {parte.tipo === 'persona_juridica' && (
        <div>
          <label className="block text-sm font-medium text-theme-secondary mb-2">
            Representante Legal
          </label>
          <input
            type="text"
            value={representanteLegal || ''}
            onChange={(e) => onChangeRepresentante(e.target.value)}
            placeholder="Ej: María García López"
            className="w-full px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:border-accent"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-theme-secondary mb-2">
          Etiquetas
        </label>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={nuevaEtiqueta}
            onChange={(e) => setNuevaEtiqueta(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarEtiqueta())}
            placeholder="Añadir etiqueta..."
            className="flex-1 px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:border-accent"
          />
          <button
            onClick={agregarEtiqueta}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Añadir
          </button>
        </div>
        
        {etiquetas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {etiquetas.map((etiqueta, index) => (
              <span
                key={etiqueta}
                className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full border ${getEtiquetaColor(index)}`}
              >
                {etiqueta}
                <button
                  onClick={() => eliminarEtiqueta(etiqueta)}
                  className="hover:text-rose-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-theme-tertiary">
            Sin etiquetas. Añade etiquetas para categorizar esta parte contraria.
          </p>
        )}
      </div>

      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-500 mb-1">
              Relaciones entre entidades
            </h4>
            <p className="text-sm text-theme-secondary">
              Las relaciones con otras entidades (grupos empresariales, matrices, filiales) 
              se pueden configurar después de crear la parte contraria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasoResumen({ datos }: { datos: Partial<ParteContraria> }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-theme-primary mb-6">
        Resumen de la información
      </h3>

      <div className="bg-theme-secondary border border-theme rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-theme">
          <div className={`p-2 rounded-lg ${datos.tipo === 'persona_fisica' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
            {datos.tipo === 'persona_fisica' ? (
              <User className="w-5 h-5 text-blue-500" />
            ) : (
              <Building2 className="w-5 h-5 text-purple-500" />
            )}
          </div>
          <div>
            <p className="text-sm text-theme-tertiary">Tipo</p>
            <p className="font-medium text-theme-primary">
              {datos.tipo === 'persona_fisica' ? 'Persona Física' : 'Persona Jurídica'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-theme-tertiary mb-1">
              {datos.tipo === 'persona_fisica' ? 'Nombre' : 'Razón Social'}
            </p>
            <p className="font-medium text-theme-primary">
              {datos.tipo === 'persona_fisica' 
                ? datos.nombreCompleto 
                : datos.razonSocial}
            </p>
          </div>
          <div>
            <p className="text-sm text-theme-tertiary mb-1">
              {datos.tipo === 'persona_fisica' ? 'Documento' : 'CIF/NIF'}
            </p>
            <p className="font-mono text-theme-primary">
              {datos.tipo === 'persona_fisica' 
                ? datos.documentoIdentidad 
                : datos.cifNif}
            </p>
          </div>
        </div>

        {datos.direccion?.calle && (
          <div>
            <p className="text-sm text-theme-tertiary mb-1">Dirección</p>
            <p className="text-theme-primary">
              {datos.direccion.calle}
              {datos.direccion.ciudad && `, ${datos.direccion.ciudad}`}
              {datos.direccion.provincia && ` (${datos.direccion.provincia})`}
            </p>
          </div>
        )}

        {(datos.contacto?.telefono || datos.contacto?.email) && (
          <div className="grid grid-cols-2 gap-4">
            {datos.contacto?.telefono && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-theme-tertiary" />
                <span className="text-theme-primary">{datos.contacto.telefono}</span>
              </div>
            )}
            {datos.contacto?.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-theme-tertiary" />
                <span className="text-theme-primary">{datos.contacto.email}</span>
              </div>
            )}
          </div>
        )}

        {datos.representanteLegal && (
          <div>
            <p className="text-sm text-theme-tertiary mb-1">Representante Legal</p>
            <p className="text-theme-primary">{datos.representanteLegal}</p>
          </div>
        )}

        {datos.etiquetas && datos.etiquetas.length > 0 && (
          <div>
            <p className="text-sm text-theme-tertiary mb-2">Etiquetas</p>
            <div className="flex flex-wrap gap-2">
              {datos.etiquetas.map((etiqueta, index) => (
                <span
                  key={etiqueta}
                  className={`px-2 py-1 text-xs rounded-full border ${getEtiquetaColor(index)}`}
                >
                  {etiqueta}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-theme-tertiary text-center">
        Revisa que toda la información sea correcta antes de continuar.
      </p>
    </div>
  );
}

// ============================================
// MODALES AUXILIARES
// ============================================

function ModalConfirmacion({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  mensaje,
  isDestructive = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  mensaje: string;
  isDestructive?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-theme-primary border border-theme rounded-xl shadow-xl p-6"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-full ${isDestructive ? 'bg-rose-500/20' : 'bg-amber-500/20'}`}>
            <AlertTriangle className={`w-6 h-6 ${isDestructive ? 'text-rose-500' : 'text-amber-500'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-theme-primary mb-1">{titulo}</h3>
            <p className="text-theme-secondary">{mensaje}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-theme-secondary hover:text-theme-primary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity ${
              isDestructive ? 'bg-rose-500' : 'bg-accent'
            }`}
          >
            Confirmar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
