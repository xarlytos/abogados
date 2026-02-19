import { useState, useCallback, useMemo } from 'react';
import { useRole } from './useRole';
import type { UserRole } from '@/types/roles';
import type {
  ValidacionExpediente,
  ItemChecklist,
  Conflicto
} from '@/types/conflictos';
import { validacionesData } from '@/data/validacionesData';
import { generateId } from '@/lib/utils';

// ============================================
// TIPOS DE PERMISOS
// ============================================

interface PermisosValidacion {
  puedeVer: boolean;
  puedeEjecutarValidacion: boolean;
  puedeAprobar: boolean;
  puedeRechazar: boolean;
  puedeEscalar: boolean;
  puedeVerTodas: boolean;
}

// ============================================
// CONFIGURACIÓN DE PERMISOS POR ROL
// ============================================

const PERMISOS_POR_ROL: Record<UserRole, PermisosValidacion> = {
  super_admin: {
    puedeVer: true,
    puedeEjecutarValidacion: true,
    puedeAprobar: true,
    puedeRechazar: true,
    puedeEscalar: true,
    puedeVerTodas: true
  },
  socio: {
    puedeVer: true,
    puedeEjecutarValidacion: true,
    puedeAprobar: true,
    puedeRechazar: true,
    puedeEscalar: false,
    puedeVerTodas: true
  },
  abogado_senior: {
    puedeVer: true,
    puedeEjecutarValidacion: true,
    puedeAprobar: true,
    puedeRechazar: true,
    puedeEscalar: true,
    puedeVerTodas: false
  },
  abogado_junior: {
    puedeVer: true,
    puedeEjecutarValidacion: false,
    puedeAprobar: false,
    puedeRechazar: false,
    puedeEscalar: false,
    puedeVerTodas: false
  },
  paralegal: {
    puedeVer: true,
    puedeEjecutarValidacion: false,
    puedeAprobar: false,
    puedeRechazar: false,
    puedeEscalar: false,
    puedeVerTodas: false
  },
  secretario: {
    puedeVer: false,
    puedeEjecutarValidacion: false,
    puedeAprobar: false,
    puedeRechazar: false,
    puedeEscalar: false,
    puedeVerTodas: false
  },
  administrador: {
    puedeVer: true,
    puedeEjecutarValidacion: false,
    puedeAprobar: false,
    puedeRechazar: false,
    puedeEscalar: false,
    puedeVerTodas: true
  },
  contador: {
    puedeVer: false,
    puedeEjecutarValidacion: false,
    puedeAprobar: false,
    puedeRechazar: false,
    puedeEscalar: false,
    puedeVerTodas: false
  },
  recepcionista: {
    puedeVer: false,
    puedeEjecutarValidacion: false,
    puedeAprobar: false,
    puedeRechazar: false,
    puedeEscalar: false,
    puedeVerTodas: false
  }
};

// ============================================
// CHECKLIST PREDEFINIDO
// ============================================

export const CHECKLIST_PREDEFINIDO: Omit<ItemChecklist, 'id' | 'completado'>[] = [
  {
    categoria: 'parte_contraria',
    descripcion: 'Verificar base de datos de partes contrarias',
    requerido: true
  },
  {
    categoria: 'cliente',
    descripcion: 'Revisar conflictos con clientes actuales',
    requerido: true
  },
  {
    categoria: 'abogado',
    descripcion: 'Validar disponibilidad del abogado asignado',
    requerido: true
  },
  {
    categoria: 'materia',
    descripcion: 'Confirmar competencia en la materia del caso',
    requerido: true
  },
  {
    categoria: 'cliente',
    descripcion: 'Revisar honorarios y forma de pago acordada',
    requerido: true
  },
  {
    categoria: 'cliente',
    descripcion: 'Verificar documentación completa del cliente',
    requerido: true
  },
  {
    categoria: 'materia',
    descripcion: 'Analizar viabilidad del caso y posibilidades de éxito',
    requerido: false
  },
  {
    categoria: 'cliente',
    descripcion: 'Confirmar que no existe inhabilitación del cliente',
    requerido: true
  }
];

// Usuario actual simulado
const CURRENT_USER_ID = 'USR-001';

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useValidacion() {
  const { role } = useRole();
  const [validaciones, setValidaciones] = useState<ValidacionExpediente[]>(validacionesData);

  // Permisos basados en rol
  const permisos = useMemo(() => {
    return PERMISOS_POR_ROL[role];
  }, [role]);

  // Filtrar validaciones según permisos
  const validacionesFiltradas = useMemo(() => {
    if (permisos.puedeVerTodas) {
      return validaciones;
    }
    
    return validaciones.filter(v => 
      v.solicitadoPor === CURRENT_USER_ID || 
      v.aprobadoPor === CURRENT_USER_ID
    );
  }, [validaciones, permisos]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const pendientes = validaciones.filter(v => v.estadoValidacion === 'pendiente').length;
    const enProceso = validaciones.filter(v => v.estadoValidacion === 'en_proceso').length;
    const aprobadas = validaciones.filter(v => v.estadoValidacion === 'aprobado').length;
    const rechazadas = validaciones.filter(v => v.estadoValidacion === 'rechazado').length;
    const escaladas = validaciones.filter(v => v.estadoValidacion === 'escalado').length;
    const requierenAprobacionSocio = validaciones.filter(v => v.requiereAprobacionSocio && v.estadoValidacion !== 'aprobado').length;

    return {
      pendientes,
      enProceso,
      aprobadas,
      rechazadas,
      escaladas,
      requierenAprobacionSocio,
      total: validaciones.length
    };
  }, [validaciones]);

  // Obtener validación por ID
  const obtenerValidacion = useCallback((id: string): ValidacionExpediente | undefined => {
    return validaciones.find(v => v.id === id);
  }, [validaciones]);

  // Obtener validación por expediente
  const obtenerValidacionPorExpediente = useCallback((expedienteId: string): ValidacionExpediente | undefined => {
    return validaciones.find(v => v.expedienteId === expedienteId);
  }, [validaciones]);

  // Crear nueva validación
  const crearValidacion = useCallback((expedienteId: string, conflictos: Conflicto[] = []): ValidacionExpediente => {
    const checklist: ItemChecklist[] = CHECKLIST_PREDEFINIDO.map((item) => ({
      ...item,
      id: `CHECK-${generateId()}`,
      completado: false
    }));

    // Determinar nivel de riesgo basado en conflictos
    let nivelRiesgo: 'bajo' | 'medio' | 'alto' | 'critico' = 'bajo';
    if (conflictos.length > 0) {
      const tieneCritico = conflictos.some(c => c.severidad === 'critica');
      const tieneAlta = conflictos.some(c => c.severidad === 'alta');
      
      if (tieneCritico) nivelRiesgo = 'critico';
      else if (tieneAlta) nivelRiesgo = 'alto';
      else nivelRiesgo = 'medio';
    }

    // Determinar si requiere aprobación de socio
    const requiereAprobacionSocio = nivelRiesgo === 'alto' || nivelRiesgo === 'critico';

    const nuevaValidacion: ValidacionExpediente = {
      id: `VAL-${generateId()}`,
      expedienteId,
      estadoValidacion: 'pendiente',
      fechaSolicitud: new Date(),
      solicitadoPor: CURRENT_USER_ID,
      checklist,
      conflictosDetectados: conflictos,
      nivelRiesgo,
      requiereAprobacionSocio,
      fechaLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    setValidaciones(prev => [nuevaValidacion, ...prev]);
    return nuevaValidacion;
  }, []);

  // Iniciar validación (cambiar estado a en_proceso)
  const iniciarValidacion = useCallback((validacionId: string) => {
    setValidaciones(prev => prev.map(v => {
      if (v.id === validacionId) {
        return {
          ...v,
          estadoValidacion: 'en_proceso'
        };
      }
      return v;
    }));
  }, []);

  // Actualizar item del checklist
  const actualizarChecklist = useCallback((validacionId: string, itemId: string, completado: boolean, notas?: string) => {
    setValidaciones(prev => prev.map(v => {
      if (v.id === validacionId) {
        return {
          ...v,
          checklist: v.checklist.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                completado,
                verificadoPor: completado ? CURRENT_USER_ID : undefined,
                fechaVerificacion: completado ? new Date() : undefined,
                notas: notas || item.notas
              };
            }
            return item;
          })
        };
      }
      return v;
    }));
  }, []);

  // Verificar si todos los items requeridos están completados
  const checklistCompleto = useCallback((validacion: ValidacionExpediente): boolean => {
    const itemsRequeridos = validacion.checklist.filter(item => item.requerido);
    return itemsRequeridos.every(item => item.completado);
  }, []);

  // Calcular progreso del checklist
  const progresoChecklist = useCallback((validacion: ValidacionExpediente): number => {
    const total = validacion.checklist.length;
    const completados = validacion.checklist.filter(item => item.completado).length;
    return Math.round((completados / total) * 100);
  }, []);

  // Aprobar validación
  const aprobarValidacion = useCallback((validacionId: string, justificacion: string) => {
    setValidaciones(prev => prev.map(v => {
      if (v.id === validacionId) {
        return {
          ...v,
          estadoValidacion: 'aprobado',
          aprobadoPor: CURRENT_USER_ID,
          fechaAprobacion: new Date(),
          justificacionDecision: justificacion
        };
      }
      return v;
    }));
  }, []);

  // Rechazar validación
  const rechazarValidacion = useCallback((validacionId: string, justificacion: string) => {
    setValidaciones(prev => prev.map(v => {
      if (v.id === validacionId) {
        return {
          ...v,
          estadoValidacion: 'rechazado',
          aprobadoPor: CURRENT_USER_ID,
          fechaAprobacion: new Date(),
          justificacionDecision: justificacion
        };
      }
      return v;
    }));
  }, []);

  // Escalar a socio
  const escalarValidacion = useCallback((validacionId: string, justificacion: string) => {
    setValidaciones(prev => prev.map(v => {
      if (v.id === validacionId) {
        return {
          ...v,
          estadoValidacion: 'escalado',
          justificacionDecision: justificacion,
          requiereAprobacionSocio: true
        };
      }
      return v;
    }));
  }, []);

  // Determinar si se puede aprobar según rol y nivel de riesgo
  const puedeAprobarSegunRiesgo = useCallback((validacion: ValidacionExpediente): boolean => {
    if (role === 'socio' || role === 'super_admin') return true;
    if (role === 'abogado_senior') {
      return validacion.nivelRiesgo === 'bajo' || validacion.nivelRiesgo === 'medio';
    }
    return false;
  }, [role]);

  return {
    validaciones: validacionesFiltradas,
    todasLasValidaciones: validaciones,
    permisos,
    estadisticas,
    obtenerValidacion,
    obtenerValidacionPorExpediente,
    crearValidacion,
    iniciarValidacion,
    actualizarChecklist,
    checklistCompleto,
    progresoChecklist,
    aprobarValidacion,
    rechazarValidacion,
    escalarValidacion,
    puedeAprobarSegunRiesgo
  };
}

export default useValidacion;
