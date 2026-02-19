import { useState, useCallback, useMemo } from 'react';
import { useRole } from './useRole';
import type { UserRole } from '@/types/roles';
import type { 
  ParteContraria, 
  RelacionEntidad,
  FiltrosParteContraria,
  ResultadoBusqueda,
  TipoParte,
  TipoRelacion
} from '@/types/conflictos';
import { 
  normalizarTexto,
  calcularSimilitudCombinada,
  generarIdPrefijo,
  obtenerNombreParte,
  obtenerIdentificadorParte
} from '@/types/conflictos';
import {
  partesContrariasData as initialPartesData,
  relacionesEntidadesData as initialRelacionesData,
  getRelacionesByParteId,
  getEntidadesRelacionadas
} from '@/data/partesContrariasData';

// ============================================
// TIPOS DE PERMISOS
// ============================================

interface PermisosPartesContrarias {
  puedeVer: boolean;
  puedeCrear: boolean;
  puedeEditar: boolean;
  puedeEliminar: boolean;
  puedeImportar: boolean;
  puedeExportar: boolean;
  puedeVerRelaciones: boolean;
  puedeCrearRelaciones: boolean;
}

// ============================================
// CONFIGURACIÓN DE PERMISOS POR ROL
// ============================================

const PERMISOS_POR_ROL: Record<UserRole, PermisosPartesContrarias> = {
  super_admin: {
    puedeVer: true,
    puedeCrear: true,
    puedeEditar: true,
    puedeEliminar: true,
    puedeImportar: true,
    puedeExportar: true,
    puedeVerRelaciones: true,
    puedeCrearRelaciones: true
  },
  socio: {
    puedeVer: true,
    puedeCrear: true,
    puedeEditar: true,
    puedeEliminar: true,
    puedeImportar: true,
    puedeExportar: true,
    puedeVerRelaciones: true,
    puedeCrearRelaciones: true
  },
  abogado_senior: {
    puedeVer: true,
    puedeCrear: true,
    puedeEditar: true,
    puedeEliminar: false,
    puedeImportar: true,
    puedeExportar: true,
    puedeVerRelaciones: true,
    puedeCrearRelaciones: true
  },
  abogado_junior: {
    puedeVer: true,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
    puedeImportar: false,
    puedeExportar: true,
    puedeVerRelaciones: true,
    puedeCrearRelaciones: false
  },
  paralegal: {
    puedeVer: true,
    puedeCrear: true,
    puedeEditar: false,
    puedeEliminar: false,
    puedeImportar: false,
    puedeExportar: false,
    puedeVerRelaciones: true,
    puedeCrearRelaciones: false
  },
  secretario: {
    puedeVer: true,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
    puedeImportar: false,
    puedeExportar: false,
    puedeVerRelaciones: false,
    puedeCrearRelaciones: false
  },
  administrador: {
    puedeVer: true,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
    puedeImportar: false,
    puedeExportar: true,
    puedeVerRelaciones: true,
    puedeCrearRelaciones: false
  },
  contador: {
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
    puedeImportar: false,
    puedeExportar: false,
    puedeVerRelaciones: false,
    puedeCrearRelaciones: false
  },
  recepcionista: {
    puedeVer: false,
    puedeCrear: false,
    puedeEditar: false,
    puedeEliminar: false,
    puedeImportar: false,
    puedeExportar: false,
    puedeVerRelaciones: false,
    puedeCrearRelaciones: false
  }
};

// ============================================
// HOOK PRINCIPAL
// ============================================

interface UsePartesContrariasReturn {
  // Datos
  partes: ParteContraria[];
  partesFiltradas: ParteContraria[];
  relaciones: RelacionEntidad[];
  
  // Estados
  isLoading: boolean;
  error: string | null;
  filtros: FiltrosParteContraria;
  
  // Permisos
  permisos: PermisosPartesContrarias;
  
  // CRUD
  crearParte: (datos: Partial<ParteContraria>) => Promise<ParteContraria>;
  actualizarParte: (id: string, datos: Partial<ParteContraria>) => Promise<ParteContraria>;
  eliminarParte: (id: string) => Promise<void>;
  
  // Búsqueda
  buscarPartes: (query: string, umbral?: number) => ResultadoBusqueda[];
  busquedaAvanzada: (filtros: FiltrosParteContraria) => ParteContraria[];
  setFiltros: (filtros: FiltrosParteContraria) => void;
  limpiarFiltros: () => void;
  
  // Relaciones
  crearRelacion: (entidadAId: string, entidadBId: string, tipo: TipoRelacion, descripcion?: string) => Promise<RelacionEntidad>;
  eliminarRelacion: (id: string) => Promise<void>;
  obtenerRelaciones: (parteId: string) => RelacionEntidad[];
  obtenerEntidadesRelacionadas: (parteId: string, profundidad?: number) => { parte: ParteContraria; nivel: number; tipoRelacion: TipoRelacion }[];
  
  // Utilidades
  normalizarNombre: (nombre: string) => string;
  verificarDuplicado: (nombre: string, documento?: string) => ParteContraria | null;
  obtenerSugerenciasBusqueda: (query: string, limite?: number) => ParteContraria[];
  
  // Import/Export
  exportarCSV: () => string;
  importarCSV: (csvContent: string) => Promise<{ exitosos: number; errores: number; mensajes: string[] }>;
  
  // Estadísticas
  estadisticas: {
    total: number;
    fisicas: number;
    juridicas: number;
    conExpedientes: number;
    conConflictos: number;
  };
}

export function usePartesContrarias(): UsePartesContrariasReturn {
  const { role } = useRole();
  
  // Estados
  const [partes, setPartes] = useState<ParteContraria[]>(initialPartesData);
  const [relaciones, setRelaciones] = useState<RelacionEntidad[]>(initialRelacionesData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltrosState] = useState<FiltrosParteContraria>({});
  
  // Permisos del rol actual
  const permisos = PERMISOS_POR_ROL[role];
  
  // ============================================
  // FILTRADO
  // ============================================
  
  const partesFiltradas = useMemo(() => {
    let resultado = [...partes];
    
    if (filtros.tipo) {
      resultado = resultado.filter(p => p.tipo === filtros.tipo);
    }
    
    if (filtros.busqueda) {
      const query = normalizarTexto(filtros.busqueda);
      resultado = resultado.filter(p => {
        const nombre = obtenerNombreParte(p);
        const documento = obtenerIdentificadorParte(p);
        return normalizarTexto(nombre).includes(query) || 
               normalizarTexto(documento).includes(query) ||
               p.etiquetas.some(e => normalizarTexto(e).includes(query));
      });
    }
    
    if (filtros.etiquetas && filtros.etiquetas.length > 0) {
      resultado = resultado.filter(p => 
        filtros.etiquetas!.some(et => p.etiquetas.includes(et))
      );
    }
    
    if (filtros.grupoEmpresarialId) {
      resultado = resultado.filter(p => 
        p.grupoEmpresarialId === filtros.grupoEmpresarialId ||
        p.empresaMatrizId === filtros.grupoEmpresarialId
      );
    }
    
    if (filtros.expedienteRelacionado) {
      resultado = resultado.filter(p => 
        p.expedientesRelacionados.includes(filtros.expedienteRelacionado!)
      );
    }
    
    if (filtros.abogadoRelacionado) {
      resultado = resultado.filter(p => 
        p.abogadosQueRepresentaron.includes(filtros.abogadoRelacionado!)
      );
    }
    
    if (filtros.tieneConflictos !== undefined) {
      resultado = resultado.filter(p => 
        filtros.tieneConflictos ? p.conflictosDetectados > 0 : p.conflictosDetectados === 0
      );
    }
    
    if (filtros.fechaDesde) {
      resultado = resultado.filter(p => p.fechaCreacion >= filtros.fechaDesde!);
    }
    
    if (filtros.fechaHasta) {
      resultado = resultado.filter(p => p.fechaCreacion <= filtros.fechaHasta!);
    }
    
    return resultado;
  }, [partes, filtros]);
  
  // ============================================
  // CRUD OPERACIONES
  // ============================================
  
  const crearParte = useCallback(async (datos: Partial<ParteContraria>): Promise<ParteContraria> => {
    if (!permisos.puedeCrear) {
      throw new Error('No tiene permisos para crear partes contrarias');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar duplicados
      const nombre = datos.tipo === 'persona_fisica' 
        ? datos.nombreCompleto 
        : datos.razonSocial;
      const documento = datos.tipo === 'persona_fisica'
        ? datos.documentoIdentidad
        : datos.cifNif;
        
      const duplicado = verificarDuplicado(nombre || '', documento);
      if (duplicado) {
        throw new Error(`Ya existe una parte contraria similar: ${obtenerNombreParte(duplicado)}`);
      }
      
      // Crear nueva parte
      const nuevaParte: ParteContraria = {
        id: generarIdPrefijo('PARTE'),
        tipo: datos.tipo || 'persona_fisica',
        nombreNormalizado: normalizarTexto(nombre || ''),
        nombreCompleto: datos.nombreCompleto,
        documentoIdentidad: datos.documentoIdentidad,
        razonSocial: datos.razonSocial,
        cifNif: datos.cifNif,
        direccion: datos.direccion,
        contacto: datos.contacto,
        representanteLegal: datos.representanteLegal,
        grupoEmpresarialId: datos.grupoEmpresarialId,
        empresaMatrizId: datos.empresaMatrizId,
        expedientesRelacionados: [],
        abogadosQueRepresentaron: [],
        fechaCreacion: new Date(),
        ultimaActualizacion: new Date(),
        notas: datos.notas,
        etiquetas: datos.etiquetas || [],
        totalExpedientes: 0,
        expedientesActivos: 0,
        conflictosDetectados: 0
      };
      
      setPartes(prev => [...prev, nuevaParte]);
      return nuevaParte;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la parte contraria');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [permisos.puedeCrear]);
  
  const actualizarParte = useCallback(async (id: string, datos: Partial<ParteContraria>): Promise<ParteContraria> => {
    if (!permisos.puedeEditar) {
      throw new Error('No tiene permisos para editar partes contrarias');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const parteIndex = partes.findIndex(p => p.id === id);
      if (parteIndex === -1) {
        throw new Error('Parte contraria no encontrada');
      }
      
      const parteActual = partes[parteIndex];
      
      // Normalizar nombre si cambió
      let nombreNormalizado = parteActual.nombreNormalizado;
      if (datos.nombreCompleto || datos.razonSocial) {
        const nuevoNombre = parteActual.tipo === 'persona_fisica'
          ? (datos.nombreCompleto || parteActual.nombreCompleto)
          : (datos.razonSocial || parteActual.razonSocial);
        nombreNormalizado = normalizarTexto(nuevoNombre || '');
      }
      
      const parteActualizada: ParteContraria = {
        ...parteActual,
        ...datos,
        nombreNormalizado,
        ultimaActualizacion: new Date()
      };
      
      const nuevasPartes = [...partes];
      nuevasPartes[parteIndex] = parteActualizada;
      setPartes(nuevasPartes);
      
      return parteActualizada;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la parte contraria');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [partes, permisos.puedeEditar]);
  
  const eliminarParte = useCallback(async (id: string): Promise<void> => {
    if (!permisos.puedeEliminar) {
      throw new Error('No tiene permisos para eliminar partes contrarias');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const parte = partes.find(p => p.id === id);
      if (!parte) {
        throw new Error('Parte contraria no encontrada');
      }
      
      // Verificar si tiene expedientes activos
      if (parte.expedientesActivos > 0) {
        throw new Error('No se puede eliminar una parte con expedientes activos');
      }
      
      setPartes(prev => prev.filter(p => p.id !== id));
      
      // Eliminar relaciones asociadas
      setRelaciones(prev => prev.filter(r => r.entidadAId !== id && r.entidadBId !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la parte contraria');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [partes, permisos.puedeEliminar]);
  
  // ============================================
  // BÚSQUEDA AVANZADA
  // ============================================
  
  const buscarPartes = useCallback((query: string, umbral: number = 70): ResultadoBusqueda[] => {
    if (!query.trim()) return [];
    
    const resultados: ResultadoBusqueda[] = [];
    
    for (const parte of partes) {
      const nombre = obtenerNombreParte(parte);
      const documento = obtenerIdentificadorParte(parte);
      
      // Buscar en nombre
      const scoreNombre = calcularSimilitudCombinada(query, nombre);
      
      // Buscar en documento (coincidencia exacta o parcial)
      const scoreDocumento = documento !== 'Sin documento' && documento !== 'Sin CIF/NIF'
        ? calcularSimilitudCombinada(query, documento)
        : 0;
      
      // Buscar en etiquetas
      let scoreEtiquetas = 0;
      for (const etiqueta of parte.etiquetas) {
        const score = calcularSimilitudCombinada(query, etiqueta);
        if (score > scoreEtiquetas) scoreEtiquetas = score;
      }
      
      // Score combinado
      const scoreMaximo = Math.max(scoreNombre, scoreDocumento, scoreEtiquetas);
      
      if (scoreMaximo >= umbral) {
        const camposCoincidentes: string[] = [];
        if (scoreNombre >= umbral) camposCoincidentes.push('nombre');
        if (scoreDocumento >= umbral) camposCoincidentes.push('documento');
        if (scoreEtiquetas >= umbral) camposCoincidentes.push('etiquetas');
        
        resultados.push({
          parte,
          scoreSimilitud: scoreMaximo,
          camposCoincidentes
        });
      }
    }
    
    // Ordenar por score descendente
    return resultados.sort((a, b) => b.scoreSimilitud - a.scoreSimilitud);
  }, [partes]);
  
  const busquedaAvanzada = useCallback((nuevosFiltros: FiltrosParteContraria): ParteContraria[] => {
    setFiltrosState(nuevosFiltros);
    return partesFiltradas;
  }, [partesFiltradas]);
  
  const setFiltros = useCallback((nuevosFiltros: FiltrosParteContraria) => {
    setFiltrosState(nuevosFiltros);
  }, []);
  
  const limpiarFiltros = useCallback(() => {
    setFiltrosState({});
  }, []);
  
  // ============================================
  // RELACIONES
  // ============================================
  
  const crearRelacion = useCallback(async (
    entidadAId: string, 
    entidadBId: string, 
    tipo: TipoRelacion,
    descripcion?: string
  ): Promise<RelacionEntidad> => {
    if (!permisos.puedeCrearRelaciones) {
      throw new Error('No tiene permisos para crear relaciones');
    }
    
    // Verificar que ambas entidades existen
    const entidadA = partes.find(p => p.id === entidadAId);
    const entidadB = partes.find(p => p.id === entidadBId);
    
    if (!entidadA || !entidadB) {
      throw new Error('Una o ambas entidades no existen');
    }
    
    // Verificar que no existe ya la relación
    const existeRelacion = relaciones.some(r =>
      r.activa &&
      ((r.entidadAId === entidadAId && r.entidadBId === entidadBId) ||
       (r.entidadAId === entidadBId && r.entidadBId === entidadAId))
    );
    
    if (existeRelacion) {
      throw new Error('Ya existe una relación activa entre estas entidades');
    }
    
    const nuevaRelacion: RelacionEntidad = {
      id: generarIdPrefijo('REL'),
      entidadAId,
      entidadBId,
      tipoRelacion: tipo,
      descripcion,
      activa: true,
      fechaInicio: new Date()
    };
    
    setRelaciones(prev => [...prev, nuevaRelacion]);
    
    // Actualizar jerarquía si es matriz-filial
    if (tipo === 'matriz_filial') {
      await actualizarParte(entidadBId, { empresaMatrizId: entidadAId });
      
      // Actualizar lista de filiales de la matriz
      const matriz = partes.find(p => p.id === entidadAId);
      if (matriz) {
        const filiales = [...(matriz.empresasFiliales || []), entidadBId];
        await actualizarParte(entidadAId, { empresasFiliales: filiales });
      }
    }
    
    return nuevaRelacion;
  }, [partes, relaciones, permisos.puedeCrearRelaciones, actualizarParte]);
  
  const eliminarRelacion = useCallback(async (id: string): Promise<void> => {
    if (!permisos.puedeCrearRelaciones) {
      throw new Error('No tiene permisos para eliminar relaciones');
    }
    
    const relacion = relaciones.find(r => r.id === id);
    if (!relacion) {
      throw new Error('Relación no encontrada');
    }
    
    // Marcar como inactiva en lugar de eliminar (soft delete)
    setRelaciones(prev => prev.map(r => 
      r.id === id ? { ...r, activa: false, fechaFin: new Date() } : r
    ));
  }, [relaciones, permisos.puedeCrearRelaciones]);
  
  const obtenerRelaciones = useCallback((parteId: string): RelacionEntidad[] => {
    return getRelacionesByParteId(parteId).filter(r => r.activa);
  }, []);
  
  const obtenerEntidadesRelacionadasWrapper = useCallback((parteId: string, profundidad: number = 2) => {
    return getEntidadesRelacionadas(parteId, profundidad);
  }, []);
  
  // ============================================
  // UTILIDADES
  // ============================================
  
  const normalizarNombre = useCallback((nombre: string): string => {
    return normalizarTexto(nombre);
  }, []);
  
  const verificarDuplicado = useCallback((nombre: string, documento?: string): ParteContraria | null => {
    // Buscar por documento (coincidencia exacta)
    if (documento) {
      const porDocumento = partes.find(p => {
        const idParte = p.tipo === 'persona_fisica' 
          ? p.documentoIdentidad 
          : p.cifNif;
        return idParte?.toLowerCase() === documento.toLowerCase();
      });
      if (porDocumento) return porDocumento;
    }
    
    // Buscar por nombre con fuzzy matching
    const resultados = buscarPartes(nombre, 85); // Umbral alto para duplicados
    return resultados.length > 0 ? resultados[0].parte : null;
  }, [partes, buscarPartes]);
  
  const obtenerSugerenciasBusqueda = useCallback((query: string, limite: number = 5): ParteContraria[] => {
    if (!query.trim()) return [];
    const resultados = buscarPartes(query, 60);
    return resultados.slice(0, limite).map(r => r.parte);
  }, [buscarPartes]);
  
  // ============================================
  // IMPORT/EXPORT CSV
  // ============================================
  
  const exportarCSV = useCallback((): string => {
    if (!permisos.puedeExportar) {
      throw new Error('No tiene permisos para exportar');
    }
    
    const headers = [
      'ID',
      'Tipo',
      'Nombre/Razón Social',
      'Documento/CIF',
      'Dirección',
      'Ciudad',
      'Provincia',
      'Teléfono',
      'Email',
      'Representante Legal',
      'Etiquetas',
      'Expedientes',
      'Conflictos',
      'Fecha Creación'
    ];
    
    const rows = partes.map(p => [
      p.id,
      p.tipo,
      obtenerNombreParte(p),
      obtenerIdentificadorParte(p),
      p.direccion?.calle || '',
      p.direccion?.ciudad || '',
      p.direccion?.provincia || '',
      p.contacto?.telefono || '',
      p.contacto?.email || '',
      p.representanteLegal || '',
      p.etiquetas.join(', '),
      p.totalExpedientes.toString(),
      p.conflictosDetectados.toString(),
      p.fechaCreacion.toISOString()
    ]);
    
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');
    
    return csvContent;
  }, [partes, permisos.puedeExportar]);
  
  const importarCSV = useCallback(async (csvContent: string): Promise<{ exitosos: number; errores: number; mensajes: string[] }> => {
    if (!permisos.puedeImportar) {
      throw new Error('No tiene permisos para importar');
    }
    
    const lineas = csvContent.split('\n').filter(l => l.trim());
    const mensajes: string[] = [];
    let exitosos = 0;
    let errores = 0;
    
    // Saltar header
    for (let i = 1; i < lineas.length; i++) {
      try {
        const campos = lineas[i].split(';');
        
        if (campos.length < 4) {
          mensajes.push(`Línea ${i + 1}: Formato incorrecto`);
          errores++;
          continue;
        }
        
        const tipo = campos[1]?.trim() as TipoParte;
        const nombre = campos[2]?.trim();
        const documento = campos[3]?.trim();
        
        if (!tipo || !nombre) {
          mensajes.push(`Línea ${i + 1}: Tipo y nombre son obligatorios`);
          errores++;
          continue;
        }
        
        // Verificar duplicado
        const duplicado = verificarDuplicado(nombre, documento);
        if (duplicado) {
          mensajes.push(`Línea ${i + 1}: Duplicado encontrado - ${obtenerNombreParte(duplicado)}`);
          errores++;
          continue;
        }
        
        const datos: Partial<ParteContraria> = {
          tipo,
          ...(tipo === 'persona_fisica' 
            ? { nombreCompleto: nombre, documentoIdentidad: documento }
            : { razonSocial: nombre, cifNif: documento }
          ),
          direccion: campos[4] ? {
            calle: campos[4],
            ciudad: campos[5] || '',
            provincia: campos[6] || '',
            codigoPostal: '',
            pais: 'España'
          } : undefined,
          contacto: {
            telefono: campos[7] || '',
            email: campos[8] || ''
          },
          representanteLegal: campos[9] || '',
          etiquetas: campos[10] ? campos[10].split(',').map(e => e.trim()) : []
        };
        
        await crearParte(datos);
        exitosos++;
        
      } catch (err) {
        mensajes.push(`Línea ${i + 1}: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        errores++;
      }
    }
    
    return { exitosos, errores, mensajes };
  }, [permisos.puedeImportar, verificarDuplicado, crearParte]);
  
  // ============================================
  // ESTADÍSTICAS
  // ============================================
  
  const estadisticas = useMemo(() => ({
    total: partes.length,
    fisicas: partes.filter(p => p.tipo === 'persona_fisica').length,
    juridicas: partes.filter(p => p.tipo === 'persona_juridica').length,
    conExpedientes: partes.filter(p => p.totalExpedientes > 0).length,
    conConflictos: partes.filter(p => p.conflictosDetectados > 0).length
  }), [partes]);
  
  return {
    partes,
    partesFiltradas,
    relaciones,
    isLoading,
    error,
    filtros,
    permisos,
    crearParte,
    actualizarParte,
    eliminarParte,
    buscarPartes,
    busquedaAvanzada,
    setFiltros,
    limpiarFiltros,
    crearRelacion,
    eliminarRelacion,
    obtenerRelaciones,
    obtenerEntidadesRelacionadas: obtenerEntidadesRelacionadasWrapper,
    normalizarNombre,
    verificarDuplicado,
    obtenerSugerenciasBusqueda,
    exportarCSV,
    importarCSV,
    estadisticas
  };
}
