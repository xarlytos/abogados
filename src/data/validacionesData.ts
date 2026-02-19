import type {
  ValidacionExpediente,
  ItemChecklist
} from '@/types/conflictos';
import { generateId } from '@/lib/utils';

// ============================================
// FECHA BASE
// ============================================
const NOW = new Date();
const haceDias = (dias: number): Date => {
  const fecha = new Date(NOW);
  fecha.setDate(fecha.getDate() - dias);
  return fecha;
};

// ============================================
// CHECKLIST DE EJEMPLO
// ============================================
const checklistEjemplo1: ItemChecklist[] = [
  {
    id: 'CHECK-001',
    categoria: 'parte_contraria',
    descripcion: 'Verificar base de datos de partes contrarias',
    requerido: true,
    completado: true,
    verificadoPor: 'USR-001',
    fechaVerificacion: haceDias(2)
  },
  {
    id: 'CHECK-002',
    categoria: 'cliente',
    descripcion: 'Revisar conflictos con clientes actuales',
    requerido: true,
    completado: true,
    verificadoPor: 'USR-001',
    fechaVerificacion: haceDias(2)
  },
  {
    id: 'CHECK-003',
    categoria: 'abogado',
    descripcion: 'Validar disponibilidad del abogado asignado',
    requerido: true,
    completado: true,
    verificadoPor: 'USR-001',
    fechaVerificacion: haceDias(1)
  },
  {
    id: 'CHECK-004',
    categoria: 'materia',
    descripcion: 'Confirmar competencia en la materia del caso',
    requerido: true,
    completado: false
  },
  {
    id: 'CHECK-005',
    categoria: 'cliente',
    descripcion: 'Revisar honorarios y forma de pago acordada',
    requerido: true,
    completado: false
  },
  {
    id: 'CHECK-006',
    categoria: 'cliente',
    descripcion: 'Verificar documentación completa del cliente',
    requerido: true,
    completado: false
  },
  {
    id: 'CHECK-007',
    categoria: 'materia',
    descripcion: 'Analizar viabilidad del caso y posibilidades de éxito',
    requerido: false,
    completado: false
  },
  {
    id: 'CHECK-008',
    categoria: 'cliente',
    descripcion: 'Confirmar que no existe inhabilitación del cliente',
    requerido: true,
    completado: false
  }
];

const checklistEjemplo2: ItemChecklist[] = [
  {
    id: 'CHECK-009',
    categoria: 'parte_contraria',
    descripcion: 'Verificar base de datos de partes contrarias',
    requerido: true,
    completado: true,
    verificadoPor: 'USR-002',
    fechaVerificacion: haceDias(5)
  },
  {
    id: 'CHECK-010',
    categoria: 'cliente',
    descripcion: 'Revisar conflictos con clientes actuales',
    requerido: true,
    completado: true,
    verificadoPor: 'USR-002',
    fechaVerificacion: haceDias(5)
  },
  {
    id: 'CHECK-011',
    categoria: 'abogado',
    descripcion: 'Validar disponibilidad del abogado asignado',
    requerido: true,
    completado: true,
    verificadoPor: 'USR-002',
    fechaVerificacion: haceDias(4)
  },
  {
    id: 'CHECK-012',
    categoria: 'materia',
    descripcion: 'Confirmar competencia en la materia del caso',
    requerido: true,
    completado: true,
    verificadoPor: 'USR-002',
    fechaVerificacion: haceDias(4)
  },
  {
    id: 'CHECK-013',
    categoria: 'cliente',
    descripcion: 'Revisar honorarios y forma de pago acordada',
    requerido: true,
    completado: true,
    verificadoPor: 'USR-002',
    fechaVerificacion: haceDias(3)
  },
  {
    id: 'CHECK-014',
    categoria: 'cliente',
    descripcion: 'Verificar documentación completa del cliente',
    requerido: true,
    completado: true,
    verificadoPor: 'USR-002',
    fechaVerificacion: haceDias(3)
  },
  {
    id: 'CHECK-015',
    categoria: 'materia',
    descripcion: 'Analizar viabilidad del caso y posibilidades de éxito',
    requerido: false,
    completado: true,
    verificadoPor: 'USR-002',
    fechaVerificacion: haceDias(2)
  },
  {
    id: 'CHECK-016',
    categoria: 'cliente',
    descripcion: 'Confirmar que no existe inhabilitación del cliente',
    requerido: true,
    completado: true,
    verificadoPor: 'USR-002',
    fechaVerificacion: haceDias(2)
  }
];

const checklistEjemplo3: ItemChecklist[] = checklistEjemplo1.map(item => ({
  ...item,
  id: `CHECK-${generateId()}`,
  completado: false,
  verificadoPor: undefined,
  fechaVerificacion: undefined
}));

// ============================================
// VALIDACIONES DE EJEMPLO
// ============================================

export const validacionesData: ValidacionExpediente[] = [
  {
    id: 'VAL-001',
    expedienteId: 'EXP-2024-025',
    estadoValidacion: 'en_proceso',
    fechaSolicitud: haceDias(5),
    solicitadoPor: 'USR-001',
    checklist: checklistEjemplo1,
    conflictosDetectados: [
      {
        id: 'CONF-001',
        expedienteId: 'EXP-2024-025',
        tipoConflicto: 'directo',
        estado: 'en_analisis',
        severidad: 'critica',
        entidadA: {
          tipo: 'cliente',
          id: 'CLI-015',
          nombre: 'TechCorp Innovaciones SL'
        },
        entidadB: {
          tipo: 'parte_contraria',
          id: 'PARTE-003',
          nombre: 'Roberto Sánchez Vega'
        },
        descripcion: 'El cliente actual fue parte contraria en expediente anterior.',
        fechaDeteccion: haceDias(5),
        documentosSoporte: ['EXP-2024-003']
      }
    ],
    nivelRiesgo: 'critico',
    requiereAprobacionSocio: true,
    fechaLimite: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'VAL-002',
    expedienteId: 'EXP-2024-028',
    estadoValidacion: 'pendiente',
    fechaSolicitud: haceDias(3),
    solicitadoPor: 'USR-002',
    checklist: checklistEjemplo3,
    conflictosDetectados: [],
    nivelRiesgo: 'bajo',
    requiereAprobacionSocio: false,
    fechaLimite: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'VAL-003',
    expedienteId: 'EXP-2024-022',
    estadoValidacion: 'aprobado',
    fechaSolicitud: haceDias(10),
    solicitadoPor: 'USR-001',
    checklist: checklistEjemplo2,
    conflictosDetectados: [
      {
        id: 'CONF-005',
        expedienteId: 'EXP-2024-022',
        tipoConflicto: 'potencial',
        estado: 'descartado',
        severidad: 'baja',
        entidadA: {
          tipo: 'cliente',
          id: 'CLI-010',
          nombre: 'María González López'
        },
        entidadB: {
          tipo: 'parte_contraria',
          id: 'PARTE-008',
          nombre: 'Inmobiliaria Centro S.A.'
        },
        descripcion: 'Posible conflicto indirecto detectado inicialmente.',
        fechaDeteccion: haceDias(10),
        documentosSoporte: [],
        resolucion: 'El conflicto fue descartado tras análisis detallado.',
        fechaResolucion: haceDias(7),
        justificacionResolucion: 'No existe conflicto real, las partes operan en mercados diferentes.'
      }
    ],
    aprobadoPor: 'USR-003',
    fechaAprobacion: haceDias(2),
    justificacionDecision: 'Todos los checks completados. El conflicto potencial fue debidamente analizado y descartado con justificación documentada.',
    nivelRiesgo: 'bajo',
    requiereAprobacionSocio: false
  },
  {
    id: 'VAL-004',
    expedienteId: 'EXP-2024-030',
    estadoValidacion: 'escalado',
    fechaSolicitud: haceDias(2),
    solicitadoPor: 'USR-002',
    checklist: checklistEjemplo1.map(item => ({
      ...item,
      id: `CHECK-${generateId()}`,
      completado: true,
      verificadoPor: 'USR-002',
      fechaVerificacion: haceDias(1)
    })),
    conflictosDetectados: [
      {
        id: 'CONF-008',
        expedienteId: 'EXP-2024-030',
        tipoConflicto: 'indirecto',
        estado: 'detectado',
        severidad: 'alta',
        entidadA: {
          tipo: 'cliente',
          id: 'CLI-020',
          nombre: 'Industrial del Sur SL'
        },
        entidadB: {
          tipo: 'parte_contraria',
          id: 'PARTE-012',
          nombre: 'Comercial Norte SA'
        },
        descripcion: 'Ambas empresas pertenecen al mismo grupo empresarial.',
        fechaDeteccion: haceDias(2),
        documentosSoporte: []
      }
    ],
    justificacionDecision: 'Se detecta conflicto indirecto de alta severidad entre empresas del mismo grupo. Requiere evaluación del socio por la complejidad del caso.',
    nivelRiesgo: 'alto',
    requiereAprobacionSocio: true,
    fechaLimite: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'VAL-005',
    expedienteId: 'EXP-2024-018',
    estadoValidacion: 'rechazado',
    fechaSolicitud: haceDias(15),
    solicitadoPor: 'USR-001',
    checklist: checklistEjemplo2.map(item => ({
      ...item,
      id: `CHECK-${generateId()}`,
      completado: item.categoria !== 'materia' || item.requerido,
      verificadoPor: item.categoria !== 'materia' || item.requerido ? 'USR-001' : undefined,
      fechaVerificacion: item.categoria !== 'materia' || item.requerido ? haceDias(10) : undefined
    })),
    conflictosDetectados: [
      {
        id: 'CONF-012',
        expedienteId: 'EXP-2024-018',
        tipoConflicto: 'directo',
        estado: 'resuelto',
        severidad: 'critica',
        entidadA: {
          tipo: 'cliente',
          id: 'CLI-005',
          nombre: 'Banco Financiero SA'
        },
        entidadB: {
          tipo: 'parte_contraria',
          id: 'PARTE-001',
          nombre: 'Gestora Inmobiliaria SL'
        },
        descripcion: 'Conflicto directo: Ya representamos a la parte contraria en otro caso activo.',
        fechaDeteccion: haceDias(15),
        documentosSoporte: ['EXP-2024-005'],
        resolucion: 'Caso rechazado por conflicto de intereses directo.',
        fechaResolucion: haceDias(12),
        justificacionResolucion: 'Imposible representar a ambas partes simultáneamente.'
      }
    ],
    aprobadoPor: 'USR-003',
    fechaAprobacion: haceDias(12),
    justificacionDecision: 'Se rechaza el caso por conflicto de intereses directo e irresoluble. Ya representamos a la parte contraria en expediente activo EXP-2024-005.',
    nivelRiesgo: 'critico',
    requiereAprobacionSocio: true
  }
];

// ============================================
// FUNCIONES AUXILIARES
// ============================================

export function getValidacionById(id: string): ValidacionExpediente | undefined {
  return validacionesData.find(v => v.id === id);
}

export function getValidacionByExpedienteId(expedienteId: string): ValidacionExpediente | undefined {
  return validacionesData.find(v => v.expedienteId === expedienteId);
}

export function getValidacionesByEstado(estado: ValidacionExpediente['estadoValidacion']): ValidacionExpediente[] {
  return validacionesData.filter(v => v.estadoValidacion === estado);
}

export function getValidacionesPendientes(): ValidacionExpediente[] {
  return validacionesData.filter(v => 
    v.estadoValidacion === 'pendiente' || v.estadoValidacion === 'en_proceso' || v.estadoValidacion === 'escalado'
  );
}

export function getValidacionesRequierenAprobacionSocio(): ValidacionExpediente[] {
  return validacionesData.filter(v => 
    v.requiereAprobacionSocio && v.estadoValidacion !== 'aprobado' && v.estadoValidacion !== 'rechazado'
  );
}

export default validacionesData;
