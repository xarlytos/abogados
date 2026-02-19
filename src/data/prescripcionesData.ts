import type { 
  Prescripcion, 
  Alerta, 
  EstadisticasPrescripciones,
  TipoMateria,
  EstadoPrescripcion,
  PrioridadPrescripcion 
} from '@/types/prescripciones';
import { 
  calcularDiasRestantes, 
  determinarEstado, 
  determinarPrioridad,
  getEstadoColor,
  getEstadoTexto,
  getPrioridadColor,
  getPrioridadTexto,
  getTipoMateriaColor,
  getTipoMateriaTexto
} from '@/types/prescripciones';

// ============================================
// DATOS DE EJEMPLO - PRESCRIPCIONES
// ============================================

const hoy = new Date();

// Función helper para crear fechas relativas
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// Alertas de ejemplo
const alertasEjemplo: Alerta[] = [
  {
    id: 'ALT-001',
    prescripcionId: 'PRES-001',
    fechaEnvio: addDays(hoy, -60),
    tipoNotificacion: 'email',
    destinatarios: ['carlos.mendez@bufete.com'],
    leida: true,
    diasAntes: 90,
    mensaje: 'Alerta: Prescripción próxima a vencer en 90 días',
  },
  {
    id: 'ALT-002',
    prescripcionId: 'PRES-001',
    fechaEnvio: addDays(hoy, -30),
    tipoNotificacion: 'email',
    destinatarios: ['carlos.mendez@bufete.com'],
    leida: true,
    diasAntes: 60,
    mensaje: 'Alerta: Prescripción próxima a vencer en 60 días',
  },
  {
    id: 'ALT-003',
    prescripcionId: 'PRES-002',
    fechaEnvio: addDays(hoy, -15),
    tipoNotificacion: 'push',
    destinatarios: ['juan.perez@bufete.com'],
    leida: false,
    diasAntes: 30,
    mensaje: 'Alerta URGENTE: Prescripción próxima a vencer en 30 días',
  },
  {
    id: 'ALT-004',
    prescripcionId: 'PRES-003',
    fechaEnvio: addDays(hoy, -5),
    tipoNotificacion: 'email',
    destinatarios: ['laura.torres@bufete.com'],
    leida: true,
    diasAntes: 7,
    mensaje: 'Alerta CRÍTICA: Prescripción vence en 7 días',
  },
  {
    id: 'ALT-005',
    prescripcionId: 'PRES-004',
    fechaEnvio: addDays(hoy, -2),
    tipoNotificacion: 'sms',
    destinatarios: ['+34600123456'],
    leida: false,
    diasAntes: 1,
    mensaje: 'Prescripción vence MAÑANA. Acción inmediata requerida.',
  },
];

// Prescripciones de ejemplo
export const prescripcionesData: Prescripcion[] = [
  {
    id: 'PRES-001',
    expedienteId: 'EXP-2024-001',
    numeroExpediente: 'EXP-2024-001',
    tipo: 'civil',
    fechaInicio: new Date('2019-03-15'),
    fechaVencimiento: addMonths(new Date('2019-03-15'), 60),
    plazoMeses: 60,
    estado: 'proxima',
    prioridad: 'alta',
    responsable: 'Carlos Méndez',
    responsableId: 'abogado_senior_1',
    descripcion: 'Prescripción acción personal - Reclamación deuda hipotecaria',
    diasRestantes: 45,
    alertasEnviadas: [alertasEjemplo[0], alertasEjemplo[1]],
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-01-15'),
    notas: 'Cliente informado de la situación. Pendiente presentar demanda.',
    accionRequerida: 'Presentar demanda de reclamación de cantidad',
  },
  {
    id: 'PRES-002',
    expedienteId: 'EXP-2024-003',
    numeroExpediente: 'EXP-2024-003',
    tipo: 'laboral',
    fechaInicio: new Date('2023-02-20'),
    fechaVencimiento: addMonths(new Date('2023-02-20'), 12),
    plazoMeses: 12,
    estado: 'proxima',
    prioridad: 'critica',
    responsable: 'Juan Pérez',
    responsableId: 'abogado_junior_1',
    descripcion: 'Prescripción acción laboral - Despido improcedente',
    diasRestantes: 15,
    alertasEnviadas: [alertasEjemplo[2]],
    fechaCreacion: new Date('2024-01-20'),
    fechaActualizacion: new Date('2024-01-20'),
    notas: 'Urgente: Plazo vence en 15 días.',
    accionRequerida: 'Interponer demanda ante Juzgado de lo Social',
  },
  {
    id: 'PRES-003',
    expedienteId: 'EXP-2024-006',
    numeroExpediente: 'EXP-2024-006',
    tipo: 'penal',
    fechaInicio: new Date('2021-06-10'),
    fechaVencimiento: addMonths(new Date('2021-06-10'), 180),
    plazoMeses: 180,
    estado: 'proxima',
    prioridad: 'critica',
    responsable: 'Laura Torres',
    responsableId: 'abogado_senior_2',
    descripcion: 'Prescripción delito fiscal - Defensa penal',
    diasRestantes: 7,
    alertasEnviadas: [alertasEjemplo[3]],
    fechaCreacion: new Date('2024-01-25'),
    fechaActualizacion: new Date('2024-01-25'),
    notas: 'CRÍTICO: Solo quedan 7 días. Audiencia programada.',
    accionRequerida: 'Comparecencia ante el Juzgado',
  },
  {
    id: 'PRES-004',
    expedienteId: 'EXP-2024-010',
    numeroExpediente: 'EXP-2024-010',
    tipo: 'civil',
    fechaInicio: new Date('2021-02-05'),
    fechaVencimiento: addDays(hoy, 1),
    plazoMeses: 36,
    estado: 'proxima',
    prioridad: 'critica',
    responsable: 'Carlos Méndez',
    responsableId: 'abogado_senior_1',
    descripcion: 'Prescripción accidente tráfico - Responsabilidad civil',
    diasRestantes: 1,
    alertasEnviadas: [alertasEjemplo[4]],
    fechaCreacion: new Date('2024-02-05'),
    fechaActualizacion: new Date('2024-02-05'),
    notas: 'VENCE MAÑANA. Demanda lista para presentar.',
    accionRequerida: 'Presentar demanda URGENTE hoy mismo',
  },
  {
    id: 'PRES-005',
    expedienteId: 'EXP-2024-002',
    numeroExpediente: 'EXP-2024-002',
    tipo: 'civil',
    fechaInicio: new Date('2020-01-18'),
    fechaVencimiento: addMonths(new Date('2020-01-18'), 60),
    plazoMeses: 60,
    estado: 'vigente',
    prioridad: 'media',
    responsable: 'María López',
    responsableId: 'abogado_junior_2',
    descripcion: 'Prescripción acción personal - Divorcio contencioso',
    diasRestantes: 365,
    alertasEnviadas: [],
    fechaCreacion: new Date('2024-01-18'),
    fechaActualizacion: new Date('2024-01-18'),
    notas: 'Proceso en marcha. No hay riesgo inmediato.',
    accionRequerida: 'Seguimiento normal del procedimiento',
  },
  {
    id: 'PRES-006',
    expedienteId: 'EXP-2024-005',
    numeroExpediente: 'EXP-2024-005',
    tipo: 'civil',
    fechaInicio: new Date('2023-01-22'),
    fechaVencimiento: addMonths(new Date('2023-01-22'), 180),
    plazoMeses: 180,
    estado: 'vigente',
    prioridad: 'baja',
    responsable: 'Ana Ruiz',
    responsableId: 'abogado_senior_1',
    descripcion: 'Prescripción constitución SL - Responsabilidad social',
    diasRestantes: 1825,
    alertasEnviadas: [],
    fechaCreacion: new Date('2024-01-22'),
    fechaActualizacion: new Date('2024-01-22'),
    notas: 'Plazo muy amplio. Sin riesgo actual.',
  },
  {
    id: 'PRES-007',
    expedienteId: 'EXP-2024-008',
    numeroExpediente: 'EXP-2024-008',
    tipo: 'civil',
    fechaInicio: new Date('2019-01-30'),
    fechaVencimiento: addMonths(new Date('2019-01-30'), 60),
    plazoMeses: 60,
    estado: 'vencida',
    prioridad: 'critica',
    responsable: 'Pedro Sánchez',
    responsableId: 'abogado_junior_1',
    descripcion: 'Prescripción deuda comercial - Reclamación mercantil',
    diasRestantes: -30,
    alertasEnviadas: [
      {
        id: 'ALT-006',
        prescripcionId: 'PRES-007',
        fechaEnvio: addDays(hoy, -120),
        tipoNotificacion: 'email',
        destinatarios: ['pedro.sanchez@bufete.com'],
        leida: true,
        diasAntes: 90,
        mensaje: 'Alerta: Prescripción próxima a vencer',
      },
    ],
    fechaCreacion: new Date('2024-01-30'),
    fechaActualizacion: new Date('2024-03-01'),
    notas: 'VENCIDA. Se está estudiando la posibilidad de interrumpir la prescripción.',
    fechaAtencion: new Date('2024-03-01'),
    atendidoPor: 'Dr. García',
  },
  {
    id: 'PRES-008',
    expedienteId: 'EXP-2024-009',
    numeroExpediente: 'EXP-2024-009',
    tipo: 'civil',
    fechaInicio: new Date('2021-02-02'),
    fechaVencimiento: addMonths(new Date('2021-02-02'), 60),
    plazoMeses: 60,
    estado: 'atendida',
    prioridad: 'baja',
    responsable: 'Laura Torres',
    responsableId: 'abogado_senior_2',
    descripcion: 'Prescripción modificación medidas - Familiar',
    diasRestantes: 1095,
    alertasEnviadas: [],
    fechaCreacion: new Date('2024-02-02'),
    fechaActualizacion: new Date('2024-02-15'),
    notas: 'Demanda presentada correctamente. Prescripción interrumpida.',
    fechaAtencion: new Date('2024-02-15'),
    atendidoPor: 'Laura Torres',
    accionRequerida: 'Demanda presentada',
  },
  {
    id: 'PRES-009',
    expedienteId: 'EXP-2024-007',
    numeroExpediente: 'EXP-2024-007',
    tipo: 'civil',
    fechaInicio: new Date('2016-01-28'),
    fechaVencimiento: addMonths(new Date('2016-01-28'), 180),
    plazoMeses: 180,
    estado: 'proxima',
    prioridad: 'alta',
    responsable: 'Carlos Méndez',
    responsableId: 'abogado_senior_1',
    descripcion: 'Prescripción herencia - Partición de bienes',
    diasRestantes: 60,
    alertasEnviadas: [
      {
        id: 'ALT-007',
        prescripcionId: 'PRES-009',
        fechaEnvio: addDays(hoy, -30),
        tipoNotificacion: 'email',
        destinatarios: ['carlos.mendez@bufete.com'],
        leida: true,
        diasAntes: 90,
        mensaje: 'Alerta: Prescripción próxima',
      },
    ],
    fechaCreacion: new Date('2024-01-28'),
    fechaActualizacion: new Date('2024-01-28'),
    notas: 'Expediente en trámite de partición.',
    accionRequerida: 'Finalizar partición de herencia',
  },
  {
    id: 'PRES-010',
    expedienteId: 'EXP-2024-011',
    numeroExpediente: 'EXP-2024-011',
    tipo: 'civil',
    fechaInicio: new Date('2021-02-08'),
    fechaVencimiento: addMonths(new Date('2021-02-08'), 60),
    plazoMeses: 60,
    estado: 'vigente',
    prioridad: 'baja',
    responsable: 'Ana López',
    responsableId: 'paralegal_1',
    descripcion: 'Prescripción desahucio - Arrendamiento urbano',
    diasRestantes: 730,
    alertasEnviadas: [],
    fechaCreacion: new Date('2024-02-08'),
    fechaActualizacion: new Date('2024-02-08'),
    notas: 'Proceso de desahucio iniciado.',
  },
];

// ============================================
// FUNCIONES HELPER PARA DATOS
// ============================================

// Obtener prescripciones por estado
export function getPrescripcionesPorEstado(estado: EstadoPrescripcion): Prescripcion[] {
  return prescripcionesData.filter(p => p.estado === estado);
}

// Obtener prescripciones por prioridad
export function getPrescripcionesPorPrioridad(prioridad: PrioridadPrescripcion): Prescripcion[] {
  return prescripcionesData.filter(p => p.prioridad === prioridad);
}

// Obtener prescripciones por tipo
export function getPrescripcionesPorTipo(tipo: TipoMateria): Prescripcion[] {
  return prescripcionesData.filter(p => p.tipo === tipo);
}

// Obtener prescripciones por responsable
export function getPrescripcionesPorResponsable(responsableId: string): Prescripcion[] {
  return prescripcionesData.filter(p => p.responsableId === responsableId);
}

// Obtener prescripciones próximas a vencer (en los próximos X días)
export function getPrescripcionesProximas(dias: number): Prescripcion[] {
  return prescripcionesData
    .filter(p => p.diasRestantes <= dias && p.diasRestantes > 0)
    .sort((a, b) => a.diasRestantes - b.diasRestantes);
}

// Obtener prescripciones críticas (menos de 30 días)
export function getPrescripcionesCriticas(): Prescripcion[] {
  return prescripcionesData
    .filter(p => p.diasRestantes <= 30 && p.estado !== 'atendida')
    .sort((a, b) => a.diasRestantes - b.diasRestantes);
}

// Obtener prescripción por ID de expediente
export function getPrescripcionByExpedienteId(expedienteId: string): Prescripcion | undefined {
  return prescripcionesData.find(p => p.expedienteId === expedienteId);
}

// Calcular estadísticas
export function calcularEstadisticas(): EstadisticasPrescripciones {
  const porTipo: Record<TipoMateria, number> = {
    civil: prescripcionesData.filter(p => p.tipo === 'civil').length,
    penal: prescripcionesData.filter(p => p.tipo === 'penal').length,
    laboral: prescripcionesData.filter(p => p.tipo === 'laboral').length,
    administrativo: prescripcionesData.filter(p => p.tipo === 'administrativo').length,
  };

  const porPrioridad: Record<PrioridadPrescripcion, number> = {
    baja: prescripcionesData.filter(p => p.prioridad === 'baja').length,
    media: prescripcionesData.filter(p => p.prioridad === 'media').length,
    alta: prescripcionesData.filter(p => p.prioridad === 'alta').length,
    critica: prescripcionesData.filter(p => p.prioridad === 'critica').length,
  };

  // Contar alertas no leídas de prescripciones próximas
  const alertasPendientes = prescripcionesData
    .filter(p => p.estado === 'proxima' || p.estado === 'vencida')
    .reduce((acc, p) => acc + p.alertasEnviadas.filter(a => !a.leida).length, 0);

  return {
    total: prescripcionesData.length,
    vigentes: prescripcionesData.filter(p => p.estado === 'vigente').length,
    proximas: prescripcionesData.filter(p => p.estado === 'proxima').length,
    vencidas: prescripcionesData.filter(p => p.estado === 'vencida').length,
    atendidas: prescripcionesData.filter(p => p.estado === 'atendida').length,
    porTipo,
    porPrioridad,
    alertasPendientes,
  };
}

// Exportar helpers de colores
export {
  getEstadoColor,
  getEstadoTexto,
  getPrioridadColor,
  getPrioridadTexto,
  getTipoMateriaColor,
  getTipoMateriaTexto,
  calcularDiasRestantes,
  determinarEstado,
  determinarPrioridad,
};
