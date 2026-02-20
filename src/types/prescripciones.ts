// ============================================
// TIPOS Y DEFINICIONES DE PRESCRIPCIONES
// ============================================

// Tipos de materia legal
export type TipoMateria = 'civil' | 'penal' | 'laboral' | 'administrativo';

// Estados de prescripción
export type EstadoPrescripcion = 'vigente' | 'proxima' | 'vencida' | 'atendida';

// Niveles de prioridad
export type PrioridadPrescripcion = 'baja' | 'media' | 'alta' | 'critica';

// Tipos de notificación
export type TipoNotificacion = 'email' | 'push' | 'sms';

// Interface principal de Prescripción
export interface Prescripcion {
  id: string;
  expedienteId: string;
  numeroExpediente: string;
  tipo: TipoMateria;
  fechaInicio: Date;
  fechaVencimiento: Date;
  plazoMeses: number;
  estado: EstadoPrescripcion;
  prioridad: PrioridadPrescripcion;
  responsable: string;
  responsableId: string;
  descripcion: string;
  diasRestantes: number;
  alertasEnviadas: Alerta[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  notas?: string;
  accionRequerida?: string;
  fechaAtencion?: Date;
  atendidoPor?: string;
}

// Niveles de escalación
export type NivelEscalacion = 'responsable' | 'supervisor' | 'socio' | 'direccion';

// Interface de Alerta
export interface Alerta {
  id: string;
  prescripcionId: string;
  fechaEnvio: Date;
  tipoNotificacion: TipoNotificacion;
  destinatarios: string[];
  leida: boolean;
  diasAntes: number;
  mensaje: string;
  nivelEscalacion: NivelEscalacion;
  accionTomada?: string;
  fechaAccion?: Date;
}

// Configuración de alertas escalonadas
export interface ConfiguracionEscalacion {
  diasAntes: number;
  nivel: NivelEscalacion;
  tipoNotificacion: TipoNotificacion[];
  mensaje: string;
  requiereAccion: boolean;
  tiempoParaEscalar?: number; // horas antes de escalar al siguiente nivel
}

// Interface para crear nueva prescripción
export interface NuevaPrescripcion {
  expedienteId: string;
  numeroExpediente: string;
  tipo: TipoMateria;
  fechaInicio: Date;
  plazoMeses: number;
  responsable: string;
  responsableId: string;
  descripcion: string;
  notas?: string;
  accionRequerida?: string;
}

// Plazos legales por tipo de materia
export interface PlazoLegal {
  tipo: TipoMateria;
  descripcion: string;
  plazoMeses: number;
  plazoDias: number;
  notas?: string;
}

// Configuración de alertas
export interface ConfiguracionAlertas {
  diasAntes: number[];
  tiposNotificacion: TipoNotificacion[];
  activo: boolean;
}

// Estadísticas de prescripciones
export interface EstadisticasPrescripciones {
  total: number;
  vigentes: number;
  proximas: number;
  vencidas: number;
  atendidas: number;
  porTipo: Record<TipoMateria, number>;
  porPrioridad: Record<PrioridadPrescripcion, number>;
  alertasPendientes: number;
}

// Filtros para búsqueda
export interface FiltrosPrescripcion {
  tipo?: TipoMateria;
  estado?: EstadoPrescripcion;
  prioridad?: PrioridadPrescripcion;
  responsable?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  busqueda?: string;
}

// ============================================
// PLAZOS LEGALES POR MATERIA (España)
// ============================================

export const PLAZOS_LEGALES: PlazoLegal[] = [
  {
    tipo: 'civil',
    descripcion: 'Acciones personales (art. 1964 CC)',
    plazoMeses: 60, // 5 años
    plazoDias: 1825,
    notas: 'Contratos, responsabilidad civil extracontractual, etc.',
  },
  {
    tipo: 'civil',
    descripcion: 'Acciones hipotecarias (art. 1964.1 CC)',
    plazoMeses: 180, // 15 años
    plazoDias: 5475,
    notas: 'Reclamación por cláusulas suelo, nulidad de hipotecas',
  },
  {
    tipo: 'civil',
    descripcion: 'Acciones reales (art. 1963 CC)',
    plazoMeses: 360, // 30 años
    plazoDias: 10950,
    notas: 'Propiedad, usufructo, servidumbres',
  },
  {
    tipo: 'penal',
    descripcion: 'Faltas leves (art. 131 CP)',
    plazoMeses: 6, // 6 meses
    plazoDias: 180,
    notas: 'Faltas con pena menor a 1 año',
  },
  {
    tipo: 'penal',
    descripcion: 'Delitos leves (art. 131 CP)',
    plazoMeses: 12, // 1 año
    plazoDias: 365,
    notas: 'Delitos con pena menor a 5 años',
  },
  {
    tipo: 'penal',
    descripcion: 'Delitos graves (art. 131 CP)',
    plazoMeses: 180, // 15 años
    plazoDias: 5475,
    notas: 'Delitos con pena mayor a 5 años',
  },
  {
    tipo: 'penal',
    descripcion: 'Delitos muy graves (art. 131 CP)',
    plazoMeses: 240, // 20 años
    plazoDias: 7300,
    notas: 'Delitos especialmente graves',
  },
  {
    tipo: 'laboral',
    descripcion: 'Acciones laborales generales (art. 59 ET)',
    plazoMeses: 12, // 1 año
    plazoDias: 365,
    notas: 'Despidos, reclamaciones de cantidad',
  },
  {
    tipo: 'laboral',
    descripcion: 'Derechos fundamentales (art. 59 ET)',
    plazoMeses: 240, // 20 años
    plazoDias: 7300,
    notas: 'Discriminación, acoso, derechos fundamentales',
  },
  {
    tipo: 'administrativo',
    descripcion: 'Recurso potestativo (art. 118 LRJPAC)',
    plazoMeses: 1, // 1 mes
    plazoDias: 30,
    notas: 'Recurso ante la misma Administración',
  },
  {
    tipo: 'administrativo',
    descripcion: 'Recurso reposición (art. 118 LRJPAC)',
    plazoMeses: 1, // 1 mes
    plazoDias: 30,
    notas: 'Recurso ante el órgano que dictó el acto',
  },
  {
    tipo: 'administrativo',
    descripcion: 'Recurso contencioso (art. 46 LJCA)',
    plazoMeses: 2, // 2 meses
    plazoDias: 60,
    notas: 'Recurso ante Jurisdicción Contencioso-Administrativa',
  },
  {
    tipo: 'administrativo',
    descripcion: 'Reclamación patrimonial (art. 139 LRJPAC)',
    plazoMeses: 12, // 1 año
    plazoDias: 365,
    notas: 'Responsabilidad patrimonial de la Administración',
  },
];

// ============================================
// CONFIGURACIÓN POR DEFECTO
// ============================================

export const CONFIGURACION_ALERTAS_DEFAULT: ConfiguracionAlertas = {
  diasAntes: [90, 60, 30, 15, 7, 1],
  tiposNotificacion: ['email', 'push'],
  activo: true,
};

// ============================================
// HELPERS
// ============================================

// Calcular fecha de vencimiento
export function calcularFechaVencimiento(
  fechaInicio: Date,
  plazoMeses: number
): Date {
  const fecha = new Date(fechaInicio);
  fecha.setMonth(fecha.getMonth() + plazoMeses);
  return fecha;
}

// Calcular días restantes
export function calcularDiasRestantes(fechaVencimiento: Date): number {
  const hoy = new Date();
  const vencimiento = new Date(fechaVencimiento);
  const diffTime = vencimiento.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Determinar estado basado en días restantes
export function determinarEstado(diasRestantes: number): EstadoPrescripcion {
  if (diasRestantes < 0) return 'vencida';
  if (diasRestantes <= 30) return 'proxima';
  return 'vigente';
}

// Determinar prioridad basada en días restantes
export function determinarPrioridad(diasRestantes: number): PrioridadPrescripcion {
  if (diasRestantes < 0) return 'critica';
  if (diasRestantes <= 7) return 'critica';
  if (diasRestantes <= 30) return 'alta';
  if (diasRestantes <= 90) return 'media';
  return 'baja';
}

// Obtener color para estado
export function getEstadoColor(estado: EstadoPrescripcion): string {
  switch (estado) {
    case 'vigente':
      return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
    case 'proxima':
      return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
    case 'vencida':
      return 'bg-red-500/20 text-red-500 border-red-500/30';
    case 'atendida':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400';
  }
}

// Obtener texto para estado
export function getEstadoTexto(estado: EstadoPrescripcion): string {
  switch (estado) {
    case 'vigente':
      return 'Vigente';
    case 'proxima':
      return 'Próxima a vencer';
    case 'vencida':
      return 'Vencida';
    case 'atendida':
      return 'Atendida';
    default:
      return estado;
  }
}

// Obtener color para prioridad
export function getPrioridadColor(prioridad: PrioridadPrescripcion): string {
  switch (prioridad) {
    case 'baja':
      return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    case 'media':
      return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
    case 'alta':
      return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
    case 'critica':
      return 'bg-red-500/20 text-red-500 border-red-500/30 animate-pulse';
    default:
      return 'bg-slate-500/20 text-slate-400';
  }
}

// Obtener texto para prioridad
export function getPrioridadTexto(prioridad: PrioridadPrescripcion): string {
  switch (prioridad) {
    case 'baja':
      return 'Baja';
    case 'media':
      return 'Media';
    case 'alta':
      return 'Alta';
    case 'critica':
      return 'Crítica';
    default:
      return prioridad;
  }
}

// Obtener color para tipo de materia
export function getTipoMateriaColor(tipo: TipoMateria): string {
  switch (tipo) {
    case 'civil':
      return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    case 'penal':
      return 'bg-red-500/20 text-red-500 border-red-500/30';
    case 'laboral':
      return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
    case 'administrativo':
      return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400';
  }
}

// Obtener texto para tipo de materia
export function getTipoMateriaTexto(tipo: TipoMateria): string {
  switch (tipo) {
    case 'civil':
      return 'Civil';
    case 'penal':
      return 'Penal';
    case 'laboral':
      return 'Laboral';
    case 'administrativo':
      return 'Administrativo';
    default:
      return tipo;
  }
}
