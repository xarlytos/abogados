/**
 * Hook para gestionar la búsqueda y consulta de legislación
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  LegislacionBase,
  BoeDocumento,
  CendojDocumento,
  BusquedaAvanzadaParams,
  BusquedaResponse,
  TipoDocumento,
  Materia,
} from '@/types/legislacion';
import {
  busquedaAvanzada,
  buscarBoe,
  buscarCendoj,
  obtenerCodigos,
  obtenerEstadisticas,
  obtenerEstadoSincronizacion,
  sincronizarFuentes,
} from '@/services/legislacionApiService';

export interface UseLegislacionReturn {
  // Estado
  resultados: LegislacionBase[];
  totalResultados: number;
  pagina: number;
  totalPaginas: number;
  cargando: boolean;
  error: string | null;
  facets?: BusquedaResponse['facets'];

  // Filtros activos
  filtros: BusquedaAvanzadaParams;

  // Acciones
  buscar: (query: string) => Promise<void>;
  buscarAvanzado: (params: BusquedaAvanzadaParams) => Promise<void>;
  setFiltros: (filtros: BusquedaAvanzadaParams) => void;
  limpiarFiltros: () => void;
  cambiarPagina: (pagina: number) => void;
  siguientePagina: () => void;
  anteriorPagina: () => void;

  // Categorías
  codigos: LegislacionBase[];
  constitucion: LegislacionBase | null;

  // Estadísticas
  estadisticas: {
    totalDocumentos: number;
    porTipo: Record<TipoDocumento, number>;
    porMateria: Record<Materia, number>;
    porAnio: Record<string, number>;
    nuevosEstaSemana: number;
    nuevosEsteMes: number;
  } | null;

  // Sincronización
  estadoSync: {
    boe: { estado: string; ultimaActualizacion?: Date; documentosNuevos: number };
    cendoj: { estado: string; ultimaActualizacion?: Date; documentosNuevos: number };
  } | null;
  sincronizando: boolean;
  sincronizar: () => Promise<void>;
}

const DEFAULT_FILTROS: BusquedaAvanzadaParams = {
  pagina: 1,
  limit: 20,
  sortBy: 'fecha_desc',
};

export function useLegislacion(): UseLegislacionReturn {
  // Estado de resultados
  const [resultados, setResultados] = useState<LegislacionBase[]>([]);
  const [totalResultados, setTotalResultados] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facets, setFacets] = useState<BusquedaResponse['facets']>();

  // Estado de filtros
  const [filtros, setFiltrosState] = useState<BusquedaAvanzadaParams>(DEFAULT_FILTROS);

  // Estado de categorías
  const [codigos, setCodigos] = useState<LegislacionBase[]>([]);
  const [constitucion, setConstitucion] = useState<LegislacionBase | null>(null);

  // Estado de estadísticas
  const [estadisticas, setEstadisticas] = useState<UseLegislacionReturn['estadisticas']>(null);

  // Estado de sincronización
  const [estadoSync, setEstadoSync] = useState<UseLegislacionReturn['estadoSync']>(null);
  const [sincronizando, setSincronizando] = useState(false);

  // ============================================
  // BÚSQUEDA
  // ============================================

  const buscar = useCallback(async (query: string) => {
    setCargando(true);
    setError(null);

    try {
      const params: BusquedaAvanzadaParams = {
        ...filtros,
        query: query || undefined,
        pagina: 1,
      };

      const response = await busquedaAvanzada(params);

      setResultados(response.resultados);
      setTotalResultados(response.total);
      setPagina(response.pagina);
      setTotalPaginas(response.totalPaginas);
      setFacets(response.facets);
      setFiltrosState(params);
    } catch (err) {
      setError('Error al realizar la búsqueda');
      console.error(err);
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  const buscarAvanzado = useCallback(async (params: BusquedaAvanzadaParams) => {
    setCargando(true);
    setError(null);

    try {
      const response = await busquedaAvanzada(params);

      setResultados(response.resultados);
      setTotalResultados(response.total);
      setPagina(response.pagina);
      setTotalPaginas(response.totalPaginas);
      setFacets(response.facets);
      setFiltrosState(params);
    } catch (err) {
      setError('Error al realizar la búsqueda avanzada');
      console.error(err);
    } finally {
      setCargando(false);
    }
  }, []);

  const cambiarPagina = useCallback(async (nuevaPagina: number) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;

    const params = { ...filtros, pagina: nuevaPagina };
    await buscarAvanzado(params);
  }, [filtros, totalPaginas, buscarAvanzado]);

  const siguientePagina = useCallback(() => {
    cambiarPagina(pagina + 1);
  }, [cambiarPagina, pagina]);

  const anteriorPagina = useCallback(() => {
    cambiarPagina(pagina - 1);
  }, [cambiarPagina, pagina]);

  const setFiltros = useCallback((nuevosFiltros: BusquedaAvanzadaParams) => {
    setFiltrosState(nuevosFiltros);
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltrosState(DEFAULT_FILTROS);
    buscarAvanzado(DEFAULT_FILTROS);
  }, [buscarAvanzado]);

  // ============================================
  // CARGA INICIAL
  // ============================================

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setCargando(true);

      try {
        // Cargar códigos
        const codigosData = await obtenerCodigos();
        setCodigos(codigosData);

        // Encontrar constitución
        const constData = codigosData.find((c) => c.titulo.includes('Constitución'));
        setConstitucion(constData || null);

        // Cargar estadísticas
        const stats = await obtenerEstadisticas();
        setEstadisticas(stats);

        // Cargar estado de sincronización
        const sync = await obtenerEstadoSincronizacion();
        setEstadoSync(sync);

        // Cargar resultados iniciales (últimos documentos)
        await buscarAvanzado(DEFAULT_FILTROS);
      } catch (err) {
        setError('Error al cargar datos iniciales');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatosIniciales();
  }, [buscarAvanzado]);

  // ============================================
  // SINCRONIZACIÓN
  // ============================================

  const sincronizar = useCallback(async () => {
    setSincronizando(true);
    setError(null);

    try {
      const nuevoEstado = await sincronizarFuentes();
      setEstadoSync(nuevoEstado);

      // Recargar estadísticas
      const stats = await obtenerEstadisticas();
      setEstadisticas(stats);

      // Recargar resultados
      await buscarAvanzado(filtros);
    } catch (err) {
      setError('Error al sincronizar fuentes');
      console.error(err);
    } finally {
      setSincronizando(false);
    }
  }, [filtros, buscarAvanzado]);

  return {
    resultados,
    totalResultados,
    pagina,
    totalPaginas,
    cargando,
    error,
    facets,
    filtros,
    buscar,
    buscarAvanzado,
    setFiltros,
    limpiarFiltros,
    cambiarPagina,
    siguientePagina,
    anteriorPagina,
    codigos,
    constitucion,
    estadisticas,
    estadoSync,
    sincronizando,
    sincronizar,
  };
}

/**
 * Hook específico para búsqueda en BOE
 */
export function useBoeSearch() {
  const [resultados, setResultados] = useState<BoeDocumento[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = useCallback(async (_query: string) => {
    setCargando(true);
    setError(null);

    try {
      await buscarBoe({ query: _query, pagina: 1 });
      // Aquí necesitaríamos mapear los resultados resumidos a documentos completos
      // Por ahora dejamos el array vacío o usamos los mocks
      setResultados([]);
    } catch (err) {
      setError('Error al buscar en BOE');
      console.error(err);
    } finally {
      setCargando(false);
    }
  }, []);

  return { resultados, cargando, error, buscar };
}

/**
 * Hook específico para búsqueda en CENDOJ
 */
export function useCendojSearch() {
  const [resultados, setResultados] = useState<CendojDocumento[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = useCallback(async (_query: string) => {
    setCargando(true);
    setError(null);

    try {
      await buscarCendoj({ query: _query, pagina: 1 });
      // Similar al BOE, necesitaríamos mapear los resultados
      setResultados([]);
    } catch (err) {
      setError('Error al buscar en CENDOJ');
      console.error(err);
    } finally {
      setCargando(false);
    }
  }, []);

  return { resultados, cargando, error, buscar };
}
