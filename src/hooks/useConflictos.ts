import { useState, useCallback, useMemo } from 'react';
import { useRole } from './useRole';
import type { UserRole } from '@/types/roles';
import type {
  Conflicto,
  AnalisisConflicto,
  TipoConflicto,
  EstadoConflicto,
  SeveridadConflicto,
  ReglaConflicto,
  ParteContraria
} from '@/types/conflictos';
import {
  calcularSimilitudCombinada,
  normalizarTexto,
  generarIdPrefijo,
  obtenerNombreParte
} from '@/types/conflictos';
import {
  conflictosData as initialConflictosData,
  analisisConflictosData as initialAnalisisData,
  reglasConflictoData as initialReglasData,
  getConflictosByExpedienteId
} from '@/data/conflictosData';
import {
  partesContrariasData,
  getEntidadesRelacionadas
} from '@/data/partesContrariasData';
import { expedientesData } from '@/data/expedientesData';
import { clientesData } from '@/data/clientesData';

// ============================================
// TIPOS DE PERMISOS
// ============================================

interface PermisosConflictos {
  puedeVer: boolean;
  puedeEjecutarAnalisis: boolean;
  puedeResolver: boolean;
  puedeConfigurarReglas: boolean;
  puedeVerRelaciones: boolean;
  puedeExportar: boolean;
}

// ============================================
// CONFIGURACIÓN DE PERMISOS POR ROL
// ============================================

const PERMISOS_POR_ROL: Record<UserRole, PermisosConflictos> = {
  super_admin: {
    puedeVer: true,
    puedeEjecutarAnalisis: true,
    puedeResolver: true,
    puedeConfigurarReglas: true,
    puedeVerRelaciones: true,
    puedeExportar: true
  },
  socio: {
    puedeVer: true,
    puedeEjecutarAnalisis: true,
    puedeResolver: true,
    puedeConfigurarReglas: true,
    puedeVerRelaciones: true,
    puedeExportar: true
  },
  abogado_senior: {
    puedeVer: true,
    puedeEjecutarAnalisis: true,
    puedeResolver: true,
    puedeConfigurarReglas: false,
    puedeVerRelaciones: true,
    puedeExportar: true
  },
  abogado_junior: {
    puedeVer: true,
    puedeEjecutarAnalisis: false,
    puedeResolver: false,
    puedeConfigurarReglas: false,
    puedeVerRelaciones: true,
    puedeExportar: false
  },
  paralegal: {
    puedeVer: true,
    puedeEjecutarAnalisis: false,
    puedeResolver: false,
    puedeConfigurarReglas: false,
    puedeVerRelaciones: false,
    puedeExportar: false
  },
  secretario: {
    puedeVer: false,
    puedeEjecutarAnalisis: false,
    puedeResolver: false,
    puedeConfigurarReglas: false,
    puedeVerRelaciones: false,
    puedeExportar: false
  },
  administrador: {
    puedeVer: true,
    puedeEjecutarAnalisis: false,
    puedeResolver: false,
    puedeConfigurarReglas: false,
    puedeVerRelaciones: true,
    puedeExportar: true
  },
  contador: {
    puedeVer: false,
    puedeEjecutarAnalisis: false,
    puedeResolver: false,
    puedeConfigurarReglas: false,
    puedeVerRelaciones: false,
    puedeExportar: false
  },
  recepcionista: {
    puedeVer: false,
    puedeEjecutarAnalisis: false,
    puedeResolver: false,
    puedeConfigurarReglas: false,
    puedeVerRelaciones: false,
    puedeExportar: false
  }
};

// ============================================
// INTERFACES PARA DETECCIÓN
// ============================================

export interface DatosExpedienteParaAnalisis {
  id: string;
  clienteId: string;
  clienteNombre: string;
  parteContrariaId?: string;
  parteContrariaNombre?: string;
  materia: string;
  abogadoAsignadoId: string;
  abogadoAsignadoNombre: string;
}

interface ResultadoDeteccion {
  conflicto: Conflicto;
  score: number;
  criteriosDetectados: string[];
}

interface FiltrosConflicto {
  tipo?: TipoConflicto;
  estado?: EstadoConflicto;
  severidad?: SeveridadConflicto;
  expedienteId?: string;
  busqueda?: string;
}

// ============================================
// HOOK PRINCIPAL
// ============================================

interface UseConflictosReturn {
  // Datos
  conflictos: Conflicto[];
  analisis: AnalisisConflicto[];
  reglas: ReglaConflicto[];
  
  // Estados
  isLoading: boolean;
  isAnalizando: boolean;
  error: string | null;
  
  // Permisos
  permisos: PermisosConflictos;
  
  // CRUD Conflictos
  crearConflicto: (datos: Partial<Conflicto>) => Promise<Conflicto>;
  actualizarConflicto: (id: string, datos: Partial<Conflicto>) => Promise<Conflicto>;
  resolverConflicto: (id: string, resolucion: string, justificacion: string) => Promise<Conflicto>;
  
  // Motor de detección
  ejecutarAnalisis: (expedienteId: string) => Promise<AnalisisConflicto>;
  analizarExpedienteEnTiempoReal: (datos: DatosExpedienteParaAnalisis) => Promise<ResultadoDeteccion[]>;
  verificarConflictosExpediente: (expedienteId: string) => Promise<boolean>;
  
  // Búsqueda y filtros
  getConflictosByExpediente: (expedienteId: string) => Conflicto[];
  getAnalisisByExpediente: (expedienteId: string) => AnalisisConflicto | undefined;
  filtrarConflictos: (filtros: FiltrosConflicto) => Conflicto[];
  
  // Relaciones
  obtenerArbolRelaciones: (entidadId: string, profundidad?: number) => { parte: ParteContraria; nivel: number; tipoRelacion: string }[];
  
  // Estadísticas
  estadisticas: {
    total: number;
    detectados: number;
    enAnalisis: number;
    resueltos: number;
    criticos: number;
    altos: number;
    medios: number;
    bajos: number;
  };
  
  // Configuración
  activarRegla: (reglaId: string) => void;
  desactivarRegla: (reglaId: string) => void;
}

export function useConflictos(): UseConflictosReturn {
  const { role } = useRole();
  
  // Estados
  const [conflictos, setConflictos] = useState<Conflicto[]>(initialConflictosData);
  const [analisis, setAnalisis] = useState<AnalisisConflicto[]>(initialAnalisisData);
  const [reglas, setReglas] = useState<ReglaConflicto[]>(initialReglasData);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalizando, setIsAnalizando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Permisos del rol actual
  const permisos = PERMISOS_POR_ROL[role];
  
  // ============================================
  // ALGORITMOS DE DETECCIÓN
  // ============================================
  
  /**
   * Detecta si hay coincidencia de nombre entre entidades usando fuzzy matching
   */
  const detectarNombreSimilar = useCallback((
    nombre1: string,
    nombre2: string,
    umbral: number = 85
  ): { match: boolean; score: number } => {
    const score = calcularSimilitudCombinada(nombre1, nombre2);
    return {
      match: score >= umbral,
      score
    };
  }, []);
  
  /**
   * Detecta relaciones familiares o empresariales
   */
  const detectarRelaciones = useCallback((entidadId: string): {
    tieneRelaciones: boolean;
    entidadesRelacionadas: { parte: ParteContraria; nivel: number; tipoRelacion: string }[];
  } => {
    const entidadesRelacionadas = getEntidadesRelacionadas(entidadId, 2);
    
    return {
      tieneRelaciones: entidadesRelacionadas.length > 0,
      entidadesRelacionadas
    };
  }, []);
  
  /**
   * Motor principal de detección de conflictos
   */
  const motorDeteccion = useCallback((datos: DatosExpedienteParaAnalisis): ResultadoDeteccion[] => {
    const resultados: ResultadoDeteccion[] = [];
    
    // 1. Verificar si el cliente fue parte contraria anteriormente
    partesContrariasData.forEach(parte => {
      const nombreParte = obtenerNombreParte(parte);
      const { match, score } = detectarNombreSimilar(datos.clienteNombre, nombreParte, 85);
      
      if (match && score >= 85) {
        // Detectar si hay expedientes en común
        const expedientesComunes = parte.expedientesRelacionados.filter(expId => 
          expedientesData.some(exp => exp.id === expId)
        );
        
        if (expedientesComunes.length > 0) {
          resultados.push({
            conflicto: {
              id: generarIdPrefijo('CONF'),
              expedienteId: datos.id,
              tipoConflicto: 'directo',
              estado: 'detectado',
              severidad: score >= 95 ? 'critica' : 'alta',
              entidadA: {
                tipo: 'cliente',
                id: datos.clienteId,
                nombre: datos.clienteNombre
              },
              entidadB: {
                tipo: 'parte_contraria',
                id: parte.id,
                nombre: nombreParte
              },
              descripcion: `El cliente actual (${datos.clienteNombre}) coincide con una parte contraria registrada (${nombreParte}). Se detectaron ${expedientesComunes.length} expediente(s) en común.`,
              fechaDeteccion: new Date(),
              documentosSoporte: expedientesComunes
            },
            score,
            criteriosDetectados: ['nombre_similar', 'mismo_documento']
          });
        }
      }
    });
    
    // 2. Verificar si la parte contraria fue cliente anteriormente
    if (datos.parteContrariaId && datos.parteContrariaNombre) {
      clientesData.forEach(cliente => {
        const { match, score } = detectarNombreSimilar(datos.parteContrariaNombre!, cliente.name, 85);
        
        if (match && score >= 85) {
          resultados.push({
            conflicto: {
              id: generarIdPrefijo('CONF'),
              expedienteId: datos.id,
              tipoConflicto: 'directo',
              estado: 'detectado',
              severidad: 'alta',
              entidadA: {
                tipo: 'cliente',
                id: datos.clienteId,
                nombre: datos.clienteNombre
              },
              entidadB: {
                tipo: 'parte_contraria',
                id: datos.parteContrariaId!,
                nombre: datos.parteContrariaNombre!
              },
              descripcion: `La parte contraria actual (${datos.parteContrariaNombre}) coincide con un cliente anterior (${cliente.name}). Esto representa un conflicto directo de intereses.`,
              fechaDeteccion: new Date(),
              documentosSoporte: [cliente.id]
            },
            score,
            criteriosDetectados: ['nombre_similar', 'mismo_cliente']
          });
        }
      });
    }
    
    // 3. Verificar relaciones empresariales
    if (datos.parteContrariaId) {
      const parteContraria = partesContrariasData.find(p => p.id === datos.parteContrariaId);
      if (parteContraria?.grupoEmpresarialId) {
        const entidadesRelacionadas = getEntidadesRelacionadas(parteContraria.id, 2);
        
        // Verificar si alguna entidad relacionada fue cliente
        entidadesRelacionadas.forEach(rel => {
          const fueCliente = clientesData.some(c => 
            normalizarTexto(c.name) === normalizarTexto(obtenerNombreParte(rel.parte))
          );
          
          if (fueCliente) {
            resultados.push({
              conflicto: {
                id: generarIdPrefijo('CONF'),
                expedienteId: datos.id,
                tipoConflicto: 'indirecto',
                estado: 'detectado',
                severidad: 'media',
                entidadA: {
                  tipo: 'cliente',
                  id: datos.clienteId,
                  nombre: datos.clienteNombre
                },
                entidadB: {
                  tipo: 'parte_contraria',
                  id: parteContraria.id,
                  nombre: parteContraria.razonSocial || parteContraria.nombreCompleto || ''
                },
                descripcion: `La parte contraria pertenece al grupo empresarial "${rel.parte.razonSocial}" que tiene relación con un cliente anterior del bufete.`,
                fechaDeteccion: new Date(),
                documentosSoporte: []
              },
              score: 75,
              criteriosDetectados: ['grupo_empresarial']
            });
          }
        });
      }
    }
    
    // 4. Verificar abogado en común
    if (datos.parteContrariaId) {
      const parteContraria = partesContrariasData.find(p => p.id === datos.parteContrariaId);
      if (parteContraria) {
        const abogadosParte = parteContraria.abogadosQueRepresentaron;
        
        if (abogadosParte.includes(datos.abogadoAsignadoNombre)) {
          resultados.push({
            conflicto: {
              id: generarIdPrefijo('CONF'),
              expedienteId: datos.id,
              tipoConflicto: 'aparente',
              estado: 'detectado',
              severidad: 'media',
              entidadA: {
                tipo: 'abogado',
                id: datos.abogadoAsignadoId,
                nombre: datos.abogadoAsignadoNombre
              },
              entidadB: {
                tipo: 'parte_contraria',
                id: datos.parteContrariaId,
                nombre: datos.parteContrariaNombre!
              },
              descripcion: `El abogado asignado (${datos.abogadoAsignadoNombre}) representó previamente a la parte contraria en otros expedientes.`,
              fechaDeteccion: new Date(),
              documentosSoporte: []
            },
            score: 80,
            criteriosDetectados: ['mismo_abogado']
          });
        }
      }
    }
    
    return resultados;
  }, [detectarNombreSimilar, detectarRelaciones]);
  
  // ============================================
  // CRUD OPERACIONES
  // ============================================
  
  const crearConflicto = useCallback(async (datos: Partial<Conflicto>): Promise<Conflicto> => {
    if (!permisos.puedeEjecutarAnalisis) {
      throw new Error('No tiene permisos para crear conflictos');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const nuevoConflicto: Conflicto = {
        id: generarIdPrefijo('CONF'),
        expedienteId: datos.expedienteId || '',
        tipoConflicto: datos.tipoConflicto || 'potencial',
        estado: datos.estado || 'detectado',
        severidad: datos.severidad || 'baja',
        entidadA: datos.entidadA || { tipo: 'cliente', id: '', nombre: '' },
        entidadB: datos.entidadB || { tipo: 'parte_contraria', id: '', nombre: '' },
        descripcion: datos.descripcion || '',
        fechaDeteccion: new Date(),
        documentosSoporte: datos.documentosSoporte || []
      };
      
      setConflictos(prev => [nuevoConflicto, ...prev]);
      return nuevoConflicto;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear conflicto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [permisos.puedeEjecutarAnalisis]);
  
  const actualizarConflicto = useCallback(async (
    id: string,
    datos: Partial<Conflicto>
  ): Promise<Conflicto> => {
    if (!permisos.puedeResolver) {
      throw new Error('No tiene permisos para actualizar conflictos');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const conflictoIndex = conflictos.findIndex(c => c.id === id);
      if (conflictoIndex === -1) {
        throw new Error('Conflicto no encontrado');
      }
      
      const conflictoActualizado: Conflicto = {
        ...conflictos[conflictoIndex],
        ...datos
      };
      
      const nuevosConflictos = [...conflictos];
      nuevosConflictos[conflictoIndex] = conflictoActualizado;
      setConflictos(nuevosConflictos);
      
      return conflictoActualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar conflicto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [conflictos, permisos.puedeResolver]);
  
  const resolverConflicto = useCallback(async (
    id: string,
    resolucion: string,
    justificacion: string
  ): Promise<Conflicto> => {
    if (!permisos.puedeResolver) {
      throw new Error('No tiene permisos para resolver conflictos');
    }
    
    return actualizarConflicto(id, {
      estado: 'resuelto',
      resolucion,
      justificacionResolucion: justificacion,
      fechaResolucion: new Date()
    });
  }, [actualizarConflicto, permisos.puedeResolver]);
  
  // ============================================
  // MOTOR DE ANÁLISIS
  // ============================================
  
  const ejecutarAnalisis = useCallback(async (expedienteId: string): Promise<AnalisisConflicto> => {
    if (!permisos.puedeEjecutarAnalisis) {
      throw new Error('No tiene permisos para ejecutar análisis');
    }
    
    setIsAnalizando(true);
    setError(null);
    
    try {
      const inicio = Date.now();
      
      // Obtener datos del expediente
      const expediente = expedientesData.find(e => e.id === expedienteId);
      if (!expediente) {
        throw new Error('Expediente no encontrado');
      }
      
      // Simular búsqueda de datos completos del expediente
      const datosAnalisis: DatosExpedienteParaAnalisis = {
        id: expedienteId,
        clienteId: 'CLI-' + expedienteId.split('-')[2],
        clienteNombre: expediente.client,
        materia: expediente.type,
        abogadoAsignadoId: 'ABG-001',
        abogadoAsignadoNombre: 'Carlos Méndez'
      };
      
      // Ejecutar motor de detección
      const resultadosDeteccion = motorDeteccion(datosAnalisis);
      const conflictosDetectados = resultadosDeteccion.map(r => r.conflicto);
      
      // Guardar conflictos detectados
      if (conflictosDetectados.length > 0) {
        setConflictos(prev => [...conflictosDetectados, ...prev]);
      }
      
      // Crear análisis
      const analisisResult: AnalisisConflicto = {
        id: generarIdPrefijo('ANAL'),
        expedienteId,
        fechaAnalisis: new Date(),
        resultado: conflictosDetectados.length > 0 ? 'conflictos_detectados' : 'sin_conflictos',
        conflictosEncontrados: conflictosDetectados,
        analizadoPor: datosAnalisis.abogadoAsignadoNombre,
        tiempoAnalisis: (Date.now() - inicio) / 1000,
        metodologiaUtilizada: 'Búsqueda completa con fuzzy matching + verificación de relaciones',
        basesDatosConsultadas: ['partes_contrarias', 'clientes', 'expedientes_historicos', 'relaciones_entidades'],
        scoringTotal: conflictosDetectados.length > 0
          ? Math.max(...resultadosDeteccion.map(r => r.score))
          : 5
      };
      
      // Guardar análisis
      setAnalisis(prev => [analisisResult, ...prev]);
      
      return analisisResult;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al ejecutar análisis');
      throw err;
    } finally {
      setIsAnalizando(false);
    }
  }, [permisos.puedeEjecutarAnalisis, motorDeteccion]);
  
  const analizarExpedienteEnTiempoReal = useCallback(async (
    datos: DatosExpedienteParaAnalisis
  ): Promise<ResultadoDeteccion[]> => {
    if (!permisos.puedeEjecutarAnalisis) {
      throw new Error('No tiene permisos para ejecutar análisis');
    }
    
    setIsAnalizando(true);
    
    try {
      // Simular delay de análisis
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const resultados = motorDeteccion(datos);
      return resultados;
    } finally {
      setIsAnalizando(false);
    }
  }, [permisos.puedeEjecutarAnalisis, motorDeteccion]);
  
  const verificarConflictosExpediente = useCallback(async (expedienteId: string): Promise<boolean> => {
    const conflictosExp = getConflictosByExpedienteId(expedienteId);
    return conflictosExp.length > 0;
  }, []);
  
  // ============================================
  // BÚSQUEDA Y FILTROS
  // ============================================
  
  const getConflictosByExpediente = useCallback((expedienteId: string): Conflicto[] => {
    return conflictos.filter(c => c.expedienteId === expedienteId);
  }, [conflictos]);
  
  const getAnalisisByExpediente = useCallback((expedienteId: string): AnalisisConflicto | undefined => {
    return analisis.find(a => a.expedienteId === expedienteId);
  }, [analisis]);
  
  const filtrarConflictos = useCallback((filtros: FiltrosConflicto): Conflicto[] => {
    return conflictos.filter(c => {
      if (filtros.tipo && c.tipoConflicto !== filtros.tipo) return false;
      if (filtros.estado && c.estado !== filtros.estado) return false;
      if (filtros.severidad && c.severidad !== filtros.severidad) return false;
      if (filtros.expedienteId && c.expedienteId !== filtros.expedienteId) return false;
      if (filtros.busqueda) {
        const query = normalizarTexto(filtros.busqueda);
        const matchDescripcion = normalizarTexto(c.descripcion).includes(query);
        const matchEntidadA = normalizarTexto(c.entidadA.nombre).includes(query);
        const matchEntidadB = normalizarTexto(c.entidadB.nombre).includes(query);
        if (!matchDescripcion && !matchEntidadA && !matchEntidadB) return false;
      }
      return true;
    });
  }, [conflictos]);
  
  // ============================================
  // RELACIONES
  // ============================================
  
  const obtenerArbolRelaciones = useCallback((entidadId: string, profundidad: number = 2) => {
    return getEntidadesRelacionadas(entidadId, profundidad);
  }, []);
  
  // ============================================
  // CONFIGURACIÓN DE REGLAS
  // ============================================
  
  const activarRegla = useCallback((reglaId: string) => {
    if (!permisos.puedeConfigurarReglas) {
      throw new Error('No tiene permisos para configurar reglas');
    }
    
    setReglas(prev => prev.map(r => 
      r.id === reglaId ? { ...r, activa: true } : r
    ));
  }, [permisos.puedeConfigurarReglas]);
  
  const desactivarRegla = useCallback((reglaId: string) => {
    if (!permisos.puedeConfigurarReglas) {
      throw new Error('No tiene permisos para configurar reglas');
    }
    
    setReglas(prev => prev.map(r => 
      r.id === reglaId ? { ...r, activa: false } : r
    ));
  }, [permisos.puedeConfigurarReglas]);
  
  // ============================================
  // ESTADÍSTICAS
  // ============================================
  
  const estadisticas = useMemo(() => ({
    total: conflictos.length,
    detectados: conflictos.filter(c => c.estado === 'detectado').length,
    enAnalisis: conflictos.filter(c => c.estado === 'en_analisis').length,
    resueltos: conflictos.filter(c => c.estado === 'resuelto').length,
    criticos: conflictos.filter(c => c.severidad === 'critica').length,
    altos: conflictos.filter(c => c.severidad === 'alta').length,
    medios: conflictos.filter(c => c.severidad === 'media').length,
    bajos: conflictos.filter(c => c.severidad === 'baja').length
  }), [conflictos]);
  
  return {
    conflictos,
    analisis,
    reglas,
    isLoading,
    isAnalizando,
    error,
    permisos,
    crearConflicto,
    actualizarConflicto,
    resolverConflicto,
    ejecutarAnalisis,
    analizarExpedienteEnTiempoReal,
    verificarConflictosExpediente,
    getConflictosByExpediente,
    getAnalisisByExpediente,
    filtrarConflictos,
    obtenerArbolRelaciones,
    estadisticas,
    activarRegla,
    desactivarRegla
  };
}

export default useConflictos;
