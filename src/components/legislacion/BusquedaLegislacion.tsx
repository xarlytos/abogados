/**
 * Componente de búsqueda avanzada de legislación
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  Calendar,
  BookOpen,
  Scale,
  SlidersHorizontal,
} from 'lucide-react';
import type { TipoDocumento, Materia, BusquedaAvanzadaParams } from '@/types/legislacion';

interface BusquedaLegislacionProps {
  onBuscar: (params: BusquedaAvanzadaParams) => void;
  filtros: BusquedaAvanzadaParams;
  cargando?: boolean;
}

const TIPOS_DOCUMENTO: { value: TipoDocumento; label: string }[] = [
  { value: 'ley', label: 'Leyes' },
  { value: 'real_decreto', label: 'Reales Decretos' },
  { value: 'real_decreto_ley', label: 'Reales Decretos-Ley' },
  { value: 'real_decreto_legislativo', label: 'Reales Decretos Legislativos' },
  { value: 'orden', label: 'Órdenes' },
  { value: 'resolucion', label: 'Resoluciones' },
  { value: 'sentencia', label: 'Sentencias' },
  { value: 'auto', label: 'Autos' },
  { value: 'codigo', label: 'Códigos' },
  { value: 'constitucion', label: 'Constitución' },
];

const MATERIAS: { value: Materia; label: string }[] = [
  { value: 'constitucional', label: 'Derecho Constitucional' },
  { value: 'civil', label: 'Derecho Civil' },
  { value: 'penal', label: 'Derecho Penal' },
  { value: 'mercantil', label: 'Derecho Mercantil' },
  { value: 'laboral', label: 'Derecho Laboral' },
  { value: 'administrativo', label: 'Derecho Administrativo' },
  { value: 'tributario', label: 'Derecho Tributario' },
  { value: 'procesal', label: 'Derecho Procesal' },
  { value: 'union_europea', label: 'Derecho de la UE' },
  { value: 'derechos_humanos', label: 'Derechos Humanos' },
];

export function BusquedaLegislacion({ onBuscar, filtros, cargando }: BusquedaLegislacionProps) {
  const [query, setQuery] = useState(filtros.query || '');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtrosLocales, setFiltrosLocales] = useState<BusquedaAvanzadaParams>(filtros);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onBuscar({ ...filtrosLocales, query, pagina: 1 });
  }, [query, filtrosLocales, onBuscar]);

  const handleFiltroChange = useCallback(<K extends keyof BusquedaAvanzadaParams>(
    key: K,
    value: BusquedaAvanzadaParams[K]
  ) => {
    setFiltrosLocales(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayValue = useCallback(<T extends string>(
    array: T[] | undefined,
    value: T
  ): T[] => {
    if (!array) return [value];
    if (array.includes(value)) {
      return array.filter(v => v !== value);
    }
    return [...array, value];
  }, []);

  const limpiarFiltros = useCallback(() => {
    setQuery('');
    setFiltrosLocales({});
    onBuscar({ pagina: 1 });
  }, [onBuscar]);

  const hayFiltrosActivos = query || 
    filtrosLocales.tipo?.length || 
    filtrosLocales.materia?.length ||
    filtrosLocales.fechaDesde ||
    filtrosLocales.fechaHasta;

  return (
    <div className="bg-theme-secondary border border-theme rounded-xl overflow-hidden">
      {/* Búsqueda principal */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-tertiary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en legislación, jurisprudencia, códigos..."
            className="w-full pl-12 pr-32 py-3 bg-theme-primary border border-theme rounded-xl text-theme-primary placeholder-theme-tertiary focus:outline-none focus:border-amber-500 transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {hayFiltrosActivos && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="p-2 text-theme-tertiary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Limpiar filtros"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`p-2 rounded-lg transition-colors ${
                mostrarFiltros 
                  ? 'text-amber-400 bg-amber-500/10' 
                  : 'text-theme-tertiary hover:text-theme-primary hover:bg-theme-tertiary'
              }`}
              title="Filtros avanzados"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-4 py-2 bg-accent text-slate-950 font-medium rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {cargando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Chips de filtros activos */}
        {hayFiltrosActivos && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filtrosLocales.tipo?.map(tipo => (
              <span
                key={tipo}
                className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full border border-amber-500/30"
              >
                {TIPOS_DOCUMENTO.find(t => t.value === tipo)?.label}
                <button
                  type="button"
                  onClick={() => handleFiltroChange('tipo', filtrosLocales.tipo?.filter(t => t !== tipo))}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filtrosLocales.materia?.map(mat => (
              <span
                key={mat}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/30"
              >
                {MATERIAS.find(m => m.value === mat)?.label}
                <button
                  type="button"
                  onClick={() => handleFiltroChange('materia', filtrosLocales.materia?.filter(m => m !== mat))}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </form>

      {/* Filtros avanzados */}
      <AnimatePresence>
        {mostrarFiltros && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-theme overflow-hidden"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tipos de documento */}
              <div>
                <h4 className="text-sm font-medium text-theme-primary mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Tipo de documento
                </h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {TIPOS_DOCUMENTO.map(tipo => (
                    <label
                      key={tipo.value}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-theme-tertiary/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filtrosLocales.tipo?.includes(tipo.value) || false}
                        onChange={() => handleFiltroChange('tipo', toggleArrayValue(filtrosLocales.tipo, tipo.value))}
                        className="rounded border-theme text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-theme-secondary">{tipo.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Materias */}
              <div>
                <h4 className="text-sm font-medium text-theme-primary mb-2 flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Materia
                </h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {MATERIAS.map(mat => (
                    <label
                      key={mat.value}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-theme-tertiary/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filtrosLocales.materia?.includes(mat.value) || false}
                        onChange={() => handleFiltroChange('materia', toggleArrayValue(filtrosLocales.materia, mat.value))}
                        className="rounded border-theme text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-theme-secondary">{mat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fechas */}
              <div>
                <h4 className="text-sm font-medium text-theme-primary mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Rango de fechas
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-theme-tertiary">Desde</label>
                    <input
                      type="date"
                      value={filtrosLocales.fechaDesde?.toISOString().split('T')[0] || ''}
                      onChange={(e) => handleFiltroChange('fechaDesde', e.target.value ? new Date(e.target.value) : undefined)}
                      className="w-full px-3 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-theme-tertiary">Hasta</label>
                    <input
                      type="date"
                      value={filtrosLocales.fechaHasta?.toISOString().split('T')[0] || ''}
                      onChange={(e) => handleFiltroChange('fechaHasta', e.target.value ? new Date(e.target.value) : undefined)}
                      className="w-full px-3 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Ordenamiento */}
              <div>
                <h4 className="text-sm font-medium text-theme-primary mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Ordenar por
                </h4>
                <select
                  value={filtrosLocales.sortBy || 'fecha_desc'}
                  onChange={(e) => handleFiltroChange('sortBy', e.target.value as BusquedaAvanzadaParams['sortBy'])}
                  className="w-full px-3 py-2 bg-theme-primary border border-theme rounded-lg text-theme-primary text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="fecha_desc">Fecha (más reciente)</option>
                  <option value="fecha_asc">Fecha (más antigua)</option>
                  <option value="titulo">Título (A-Z)</option>
                  <option value="relevancia">Relevancia</option>
                </select>

                <button
                  type="button"
                  onClick={() => onBuscar({ ...filtrosLocales, query, pagina: 1 })}
                  className="w-full mt-4 px-4 py-2 bg-accent text-slate-950 font-medium rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
