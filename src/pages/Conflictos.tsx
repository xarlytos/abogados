import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Search, CheckCircle2, 
  Clock, AlertOctagon, ChevronRight, RefreshCw, 
  FileSearch, CheckSquare, Shield
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useConflictos } from '@/hooks/useConflictos';

import type { 
  Conflicto, 
  TipoConflicto, 
  EstadoConflicto, 
  SeveridadConflicto 
} from '@/types/conflictos';
import {
  getTipoConflictoColor,
  getSeveridadColor
} from '@/types/conflictos';

export default function Conflictos() {
  const { permisos, conflictos, isLoading, isAnalizando, estadisticas, filtrarConflictos, resolverConflicto, ejecutarAnalisis } = useConflictos();
  
  const [filtroTipo, setFiltroTipo] = useState<TipoConflicto | 'todos'>('todos');
  const [filtroEstado, setFiltroEstado] = useState<EstadoConflicto | 'todos'>('todos');
  const [filtroSeveridad, setFiltroSeveridad] = useState<SeveridadConflicto | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModalAnalisis, setMostrarModalAnalisis] = useState(false);
  const [expedienteId, setExpedienteId] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const conflictosFiltrados = useMemo(() => {
    return filtrarConflictos({
      tipo: filtroTipo === 'todos' ? undefined : filtroTipo,
      estado: filtroEstado === 'todos' ? undefined : filtroEstado,
      severidad: filtroSeveridad === 'todos' ? undefined : filtroSeveridad,
      busqueda: busqueda || undefined
    });
  }, [conflictos, filtroTipo, filtroEstado, filtroSeveridad, busqueda, filtrarConflictos]);

  const handleAnalizar = async () => {
    if (!expedienteId) return;
    try {
      await ejecutarAnalisis(expedienteId);
      setMostrarModalAnalisis(false);
      setExpedienteId('');
      setMensajeExito('Análisis completado exitosamente');
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!permisos.puedeVer) {
    return (
      <AppLayout title="Conflictos - Acceso Restringido">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Shield className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-theme-primary mb-2">Acceso Restringido</h2>
            <p className="text-theme-secondary">No tiene permisos para acceder al módulo de conflictos.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Detección de Conflictos">
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-theme-secondary mb-2">
            <span>Conflictos</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent font-medium">Detección Automática</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-theme-primary mb-1">Detección de Conflictos</h1>
              <p className="text-theme-secondary">Motor de análisis automatizado</p>
            </div>
            {permisos.puedeEjecutarAnalisis && (
              <button
                onClick={() => setMostrarModalAnalisis(true)}
                disabled={isAnalizando}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isAnalizando ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
                {isAnalizando ? 'Analizando...' : 'Nuevo Análisis'}
              </button>
            )}
          </div>
        </div>

        {mensajeExito && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-3 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />{mensajeExito}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={ShieldAlert} label="Total" value={estadisticas.total} color="blue" />
          <StatCard icon={AlertOctagon} label="Críticos" value={estadisticas.criticos} color="rose" alert={estadisticas.criticos > 0} />
          <StatCard icon={Clock} label="En Análisis" value={estadisticas.enAnalisis} color="amber" />
          <StatCard icon={CheckCircle2} label="Resueltos" value={estadisticas.resueltos} color="emerald" />
        </div>

        <div className="bg-theme-secondary border border-theme rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-tertiary" />
              <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary" />
            </div>
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value as TipoConflicto | 'todos')}
              className="px-4 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary">
              <option value="todos">Todos los tipos</option>
              <option value="directo">Directo</option>
              <option value="indirecto">Indirecto</option>
              <option value="aparente">Aparente</option>
              <option value="potencial">Potencial</option>
            </select>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as EstadoConflicto | 'todos')}
              className="px-4 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary">
              <option value="todos">Todos los estados</option>
              <option value="detectado">Detectado</option>
              <option value="en_analisis">En Análisis</option>
              <option value="resuelto">Resuelto</option>
              <option value="descartado">Descartado</option>
            </select>
            <select value={filtroSeveridad} onChange={(e) => setFiltroSeveridad(e.target.value as SeveridadConflicto | 'todos')}
              className="px-4 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary">
              <option value="todos">Todas las severidades</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        {estadisticas.criticos > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-6 h-6 text-rose-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-rose-500">{estadisticas.criticos} conflicto(s) crítico(s) detectado(s)</h3>
                <p className="text-sm text-theme-secondary">Requieren atención inmediata.</p>
              </div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
          </div>
        ) : conflictosFiltrados.length === 0 ? (
          <div className="text-center py-16 bg-theme-secondary border border-theme rounded-lg">
            <ShieldAlert className="w-16 h-16 text-theme-tertiary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-theme-primary">No se encontraron conflictos</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {conflictosFiltrados.map((conflicto) => (
              <ConflictCard key={conflicto.id} conflicto={conflicto} permisos={permisos} onResolver={resolverConflicto} />
            ))}
          </div>
        )}

        {mostrarModalAnalisis && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-lg bg-theme-primary border border-theme rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-theme-primary mb-4">Nuevo Análisis</h2>
              <input type="text" value={expedienteId} onChange={(e) => setExpedienteId(e.target.value)}
                placeholder="Ej: EXP-2024-001" className="w-full px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary mb-4" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setMostrarModalAnalisis(false)} className="px-4 py-2 text-theme-secondary">Cancelar</button>
                <button onClick={handleAnalizar} disabled={!expedienteId || isAnalizando}
                  className="px-4 py-2 bg-accent text-white rounded-lg disabled:opacity-50">
                  {isAnalizando ? 'Analizando...' : 'Ejecutar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function StatCard({ icon: Icon, label, value, color, alert }: { icon: any, label: string, value: number, color: string, alert?: boolean }) {
  const colors: any = {
    blue: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    rose: 'bg-rose-500/20 text-rose-500 border-rose-500/30'
  };
  return (
    <div className={`bg-theme-secondary border border-theme rounded-lg p-4 ${alert ? 'ring-2 ring-rose-500' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-theme-tertiary mb-1">{label}</p>
          <p className="text-3xl font-bold text-theme-primary">{value}</p>
        </div>
        <div className={`p-2 rounded-lg border ${colors[color]}`}><Icon className="w-5 h-5" /></div>
      </div>
    </div>
  );
}

function ConflictCard({ conflicto, permisos, onResolver }: { conflicto: Conflicto, permisos: any, onResolver: any }) {
  const [mostrarResolver, setMostrarResolver] = useState(false);
  const [resolucion, setResolucion] = useState('');
  const [justificacion, setJustificacion] = useState('');

  const estados: any = {
    detectado: 'bg-blue-500/20 text-blue-500',
    en_analisis: 'bg-amber-500/20 text-amber-500',
    resuelto: 'bg-emerald-500/20 text-emerald-500',
    descartado: 'bg-slate-500/20 text-slate-400'
  };

  const handleResolver = async () => {
    if (!resolucion || !justificacion) return;
    await onResolver(conflicto.id, resolucion, justificacion);
    setMostrarResolver(false);
  };

  return (
    <>
      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-theme-secondary border border-theme rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs rounded-full border ${getTipoConflictoColor(conflicto.tipoConflicto)}`}>
                {conflicto.tipoConflicto}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full border ${getSeveridadColor(conflicto.severidad)}`}>
                {conflicto.severidad}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${estados[conflicto.estado]}`}>
                {conflicto.estado}
              </span>
            </div>
            <h3 className="font-semibold text-theme-primary mb-1">Conflicto #{conflicto.id}</h3>
            <p className="text-sm text-theme-secondary mb-3">{conflicto.descripcion}</p>
            <div className="flex items-center gap-4 text-xs text-theme-tertiary">
              <span>Expediente: <span className="text-accent">{conflicto.expedienteId}</span></span>
              <span>{conflicto.entidadA.nombre} vs {conflicto.entidadB.nombre}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {permisos.puedeResolver && conflicto.estado !== 'resuelto' && conflicto.estado !== 'descartado' && (
              <button onClick={() => setMostrarResolver(true)} className="p-2 text-theme-tertiary hover:text-emerald-500">
                <CheckSquare className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {mostrarResolver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg bg-theme-primary border border-theme rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-theme-primary mb-4">Resolver Conflicto</h2>
            <select value={resolucion} onChange={(e) => setResolucion(e.target.value)}
              className="w-full px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary mb-4">
              <option value="">Selecciona resolución</option>
              <option value="Conflicto Confirmado">Conflicto Confirmado</option>
              <option value="Sin Conflicto Real">Sin Conflicto Real</option>
              <option value="Conflicto Superado">Conflicto Superado</option>
              <option value="Falso Positivo">Falso Positivo</option>
            </select>
            <textarea value={justificacion} onChange={(e) => setJustificacion(e.target.value)}
              placeholder="Justificación..." rows={4}
              className="w-full px-4 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary mb-4" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setMostrarResolver(false)} className="px-4 py-2 text-theme-secondary">Cancelar</button>
              <button onClick={handleResolver} disabled={!resolucion || !justificacion}
                className="px-4 py-2 bg-accent text-white rounded-lg disabled:opacity-50">Resolver</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
