import { useState, useMemo, useCallback } from 'react';
import type { 
  Prescripcion, 
  NuevaPrescripcion, 
  FiltrosPrescripcion,
  EstadisticasPrescripciones,
  TipoMateria,
  EstadoPrescripcion,
  PrioridadPrescripcion
} from '@/types/prescripciones';
import { 
  calcularFechaVencimiento,
  calcularDiasRestantes,
  determinarEstado,
  determinarPrioridad
} from '@/types/prescripciones';
import { 
  prescripcionesData,
  getPrescripcionesProximas,
  getPrescripcionesCriticas,
  getPrescripcionByExpedienteId,
  calcularEstadisticas
} from '@/data/prescripcionesData';
import type { UserRole } from '@/types/roles';

// ============================================
// HOOK PRINCIPAL: usePrescripciones
// ============================================

export interface UsePrescripcionesReturn {
  prescripciones: Prescripcion[];
  prescripcionesFiltradas: Prescripcion[];
  estadisticas: EstadisticasPrescripciones;
  filtros: FiltrosPrescripcion;
  setFiltros: (filtros: FiltrosPrescripcion) => void;
  limpiarFiltros: () => void;
  crearPrescripcion: (data: NuevaPrescripcion) => Prescripcion;
  actualizarPrescripcion: (id: string, data: Partial<Prescripcion>) => Prescripcion | null;
  eliminarPrescripcion: (id: string) => boolean;
  marcarComoAtendida: (id: string, atendidoPor: string) => Prescripcion | null;
  getPrescripcionById: (id: string) => Prescripcion | undefined;
  getPrescripcionByExpediente: (expedienteId: string) => Prescripcion | undefined;
  getProximas: (dias: number) => Prescripcion[];
  getCriticas: () => Prescripcion[];
  getPorEstado: (estado: EstadoPrescripcion) => Prescripcion[];
  getPorPrioridad: (prioridad: PrioridadPrescripcion) => Prescripcion[];
  getPorTipo: (tipo: TipoMateria) => Prescripcion[];
  filtrarPorRol: (role: UserRole, userId: string) => Prescripcion[];
  isLoading: boolean;
}

export function usePrescripciones(): UsePrescripcionesReturn {
  const [prescripciones, setPrescripciones] = useState<Prescripcion[]>(prescripcionesData);
  const [filtros, setFiltrosState] = useState<FiltrosPrescripcion>({});
  const [isLoading] = useState(false);

  const prescripcionesFiltradas = useMemo(() => {
    return prescripciones.filter(p => {
      if (filtros.tipo && p.tipo !== filtros.tipo) return false;
      if (filtros.estado && p.estado !== filtros.estado) return false;
      if (filtros.prioridad && p.prioridad !== filtros.prioridad) return false;
      if (filtros.responsable && p.responsableId !== filtros.responsable) return false;
      if (filtros.fechaDesde && p.fechaVencimiento < filtros.fechaDesde) return false;
      if (filtros.fechaHasta && p.fechaVencimiento > filtros.fechaHasta) return false;
      
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        const matchNumero = p.numeroExpediente.toLowerCase().includes(busqueda);
        const matchDescripcion = p.descripcion.toLowerCase().includes(busqueda);
        const matchResponsable = p.responsable.toLowerCase().includes(busqueda);
        if (!matchNumero && !matchDescripcion && !matchResponsable) return false;
      }
      
      return true;
    });
  }, [prescripciones, filtros]);

  const estadisticas = useMemo(() => {
    return calcularEstadisticas();
  }, [prescripciones]);

  const setFiltros = useCallback((nuevosFiltros: FiltrosPrescripcion) => {
    setFiltrosState(nuevosFiltros);
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltrosState({});
  }, []);

  const crearPrescripcion = useCallback((data: NuevaPrescripcion): Prescripcion => {
    const fechaVencimiento = calcularFechaVencimiento(data.fechaInicio, data.plazoMeses);
    const diasRestantes = calcularDiasRestantes(fechaVencimiento);
    const estado = determinarEstado(diasRestantes);
    const prioridad = determinarPrioridad(diasRestantes);

    const nuevaPrescripcion: Prescripcion = {
      id: `PRES-${Date.now()}`,
      expedienteId: data.expedienteId,
      numeroExpediente: data.numeroExpediente,
      tipo: data.tipo,
      fechaInicio: data.fechaInicio,
      fechaVencimiento,
      plazoMeses: data.plazoMeses,
      estado,
      prioridad,
      responsable: data.responsable,
      responsableId: data.responsableId,
      descripcion: data.descripcion,
      diasRestantes,
      alertasEnviadas: [],
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      notas: data.notas,
      accionRequerida: data.accionRequerida,
    };

    setPrescripciones(prev => [...prev, nuevaPrescripcion]);
    return nuevaPrescripcion;
  }, []);

  const actualizarPrescripcion = useCallback((id: string, data: Partial<Prescripcion>): Prescripcion | null => {
    let prescripcionActualizada: Prescripcion | null = null;
    
    setPrescripciones(prev => prev.map(p => {
      if (p.id === id) {
        let diasRestantes = p.diasRestantes;
        let estado = p.estado;
        let prioridad = p.prioridad;
        
        if (data.fechaVencimiento) {
          diasRestantes = calcularDiasRestantes(data.fechaVencimiento);
          estado = determinarEstado(diasRestantes);
          prioridad = determinarPrioridad(diasRestantes);
        }
        
        prescripcionActualizada = {
          ...p,
          ...data,
          diasRestantes,
          estado,
          prioridad,
          fechaActualizacion: new Date(),
        };
        return prescripcionActualizada;
      }
      return p;
    }));
    
    return prescripcionActualizada;
  }, []);

  const eliminarPrescripcion = useCallback((id: string): boolean => {
    const index = prescripciones.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    setPrescripciones(prev => prev.filter(p => p.id !== id));
    return true;
  }, [prescripciones]);

  const marcarComoAtendida = useCallback((id: string, atendidoPor: string): Prescripcion | null => {
    return actualizarPrescripcion(id, {
      estado: 'atendida',
      prioridad: 'baja',
      fechaAtencion: new Date(),
      atendidoPor,
    });
  }, [actualizarPrescripcion]);

  const getPrescripcionById = useCallback((id: string): Prescripcion | undefined => {
    return prescripciones.find(p => p.id === id);
  }, [prescripciones]);

  const getPrescripcionByExpediente = useCallback((expedienteId: string): Prescripcion | undefined => {
    return getPrescripcionByExpedienteId(expedienteId);
  }, []);

  const getProximas = useCallback((dias: number): Prescripcion[] => {
    return getPrescripcionesProximas(dias);
  }, []);

  const getCriticas = useCallback((): Prescripcion[] => {
    return getPrescripcionesCriticas();
  }, []);

  const getPorEstado = useCallback((estado: EstadoPrescripcion): Prescripcion[] => {
    return prescripciones.filter(p => p.estado === estado);
  }, [prescripciones]);

  const getPorPrioridad = useCallback((prioridad: PrioridadPrescripcion): Prescripcion[] => {
    return prescripciones.filter(p => p.prioridad === prioridad);
  }, [prescripciones]);

  const getPorTipo = useCallback((tipo: TipoMateria): Prescripcion[] => {
    return prescripciones.filter(p => p.tipo === tipo);
  }, [prescripciones]);

  const filtrarPorRol = useCallback((role: UserRole, userId: string): Prescripcion[] => {
    switch (role) {
      case 'super_admin':
      case 'socio':
        return prescripciones;
      case 'abogado_senior':
        return prescripciones.filter(p => 
          p.responsableId === userId || 
          p.responsableId.startsWith('abogado_junior')
        );
      case 'abogado_junior':
        return prescripciones.filter(p => p.responsableId === userId);
      case 'paralegal':
      case 'secretario':
        return prescripciones.filter(p => p.estado !== 'atendida');
      default:
        return [];
    }
  }, [prescripciones]);

  return {
    prescripciones,
    prescripcionesFiltradas,
    estadisticas,
    filtros,
    setFiltros,
    limpiarFiltros,
    crearPrescripcion,
    actualizarPrescripcion,
    eliminarPrescripcion,
    marcarComoAtendida,
    getPrescripcionById,
    getPrescripcionByExpediente,
    getProximas,
    getCriticas,
    getPorEstado,
    getPorPrioridad,
    getPorTipo,
    filtrarPorRol,
    isLoading,
  };
}

// ============================================
// HOOK: usePrescripcionAlertas
// ============================================

export interface UsePrescripcionAlertasReturn {
  alertasPendientes: number;
  enviarAlerta: (prescripcionId: string, diasAntes: number) => void;
  marcarAlertaLeida: (alertaId: string) => void;
}

export function usePrescripcionAlertas(): UsePrescripcionAlertasReturn {
  const [alertasPendientes, setAlertasPendientes] = useState(3);

  const enviarAlerta = useCallback((prescripcionId: string, diasAntes: number) => {
    console.log(`Enviando alerta para ${prescripcionId} - ${diasAntes} dias antes`);
  }, []);

  const marcarAlertaLeida = useCallback((alertaId: string) => {
    setAlertasPendientes(prev => Math.max(0, prev - 1));
  }, []);

  return {
    alertasPendientes,
    enviarAlerta,
    marcarAlertaLeida,
  };
}
