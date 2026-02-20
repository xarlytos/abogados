/**
 * Motor de Alertas Escalonadas para Prescripciones
 * 
 * Sistema de alertas progresivas:
 * - 90d, 60d, 30d, 15d, 7d, 1d
 * - Escalación automática al supervisor si no se actúa
 * - Notificaciones multicanal (email, push, sms)
 */

import type {
  Prescripcion,
  Alerta,
  NivelEscalacion,
  ConfiguracionEscalacion,
  TipoNotificacion,
} from '@/types/prescripciones';

// ============================================
// CONFIGURACIÓN DE ALERTAS ESCALONADAS
// ============================================

export const CONFIGURACION_ALERTAS_ESC: ConfiguracionEscalacion[] = [
  {
    diasAntes: 90,
    nivel: 'responsable',
    tipoNotificacion: ['email'],
    mensaje: '🔔 Alerta Preventiva: La prescripción vence en 90 días.',
    requiereAccion: false,
  },
  {
    diasAntes: 60,
    nivel: 'responsable',
    tipoNotificacion: ['email', 'push'],
    mensaje: '⚠️ Alerta: Prescripción próxima a vencer en 60 días. Planifique las acciones necesarias.',
    requiereAccion: false,
  },
  {
    diasAntes: 30,
    nivel: 'responsable',
    tipoNotificacion: ['email', 'push'],
    mensaje: '🚨 Alerta Importante: Solo quedan 30 días para el vencimiento. Se requiere acción.',
    requiereAccion: true,
    tiempoParaEscalar: 72, // 3 días hábiles para actuar antes de escalar
  },
  {
    diasAntes: 15,
    nivel: 'supervisor',
    tipoNotificacion: ['email', 'push'],
    mensaje: '⏰ Escalación a Supervisor: Prescripción crítica en 15 días. El responsable no ha actuado.',
    requiereAccion: true,
    tiempoParaEscalar: 48, // 2 días hábiles
  },
  {
    diasAntes: 7,
    nivel: 'socio',
    tipoNotificacion: ['email', 'push', 'sms'],
    mensaje: '🆘 Escalación a Socio: Prescripción vence en 7 días. Acción inmediata requerida.',
    requiereAccion: true,
    tiempoParaEscalar: 24, // 1 día hábil
  },
  {
    diasAntes: 1,
    nivel: 'direccion',
    tipoNotificacion: ['email', 'push', 'sms'],
    mensaje: '🚨 ALERTA MÁXIMA: La prescripción vence MAÑANA. Intervención inmediata del socio/director.',
    requiereAccion: true,
  },
];

// ============================================
// TIPOS Y ESTADOS
// ============================================

export interface EstadoAlertaEscalonada {
  prescripcionId: string;
  diasRestantes: number;
  alertasEnviadas: Alerta[];
  siguienteAlerta: ConfiguracionEscalacion | null;
  nivelActual: NivelEscalacion;
  requiereEscalacion: boolean;
  tiempoRestanteParaEscalar?: number; // en horas
}

export interface NotificacionPendiente {
  id: string;
  prescripcionId: string;
  numeroExpediente: string;
  titulo: string;
  descripcion: string;
  diasRestantes: number;
  nivelEscalacion: NivelEscalacion;
  destinatarios: string[];
  tipoNotificacion: TipoNotificacion[];
  mensaje: string;
  fechaLimiteEscalacion?: Date;
}

// ============================================
// FUNCIONES DEL MOTOR
// ============================================

/**
 * Calcula qué alerta debe enviarse para una prescripción
 */
export function calcularSiguienteAlerta(
  prescripcion: Prescripcion
): ConfiguracionEscalacion | null {
  // No enviar alertas si ya está atendida o vencida
  if (prescripcion.estado === 'atendida' || prescripcion.diasRestantes <= 0) {
    return null;
  }

  // Buscar la primera configuración de alerta que aplica
  // (que no haya sido enviada aún)
  for (const config of CONFIGURACION_ALERTAS_ESC) {
    const yaEnviada = prescripcion.alertasEnviadas.some(
      (alerta) => alerta.diasAntes === config.diasAntes
    );

    if (!yaEnviada && prescripcion.diasRestantes <= config.diasAntes) {
      return config;
    }
  }

  return null;
}

/**
 * Determina si debe escalarse la alerta por inactividad
 */
export function debeEscalarPorInactividad(
  prescripcion: Prescripcion,
  config: ConfiguracionEscalacion
): boolean {
  if (!config.requiereAccion || !config.tiempoParaEscalar) {
    return false;
  }

  // Buscar la última alerta enviada del nivel anterior
  const alertasOrdenadas = [...prescripcion.alertasEnviadas].sort(
    (a, b) => b.diasAntes - a.diasAntes
  );

  const ultimaAlerta = alertasOrdenadas.find(
    (a) => a.diasAntes > config.diasAntes
  );

  if (!ultimaAlerta || ultimaAlerta.accionTomada) {
    return false;
  }

  // Calcular horas transcurridas desde la última alerta
  const horasTranscurridas =
    (new Date().getTime() - new Date(ultimaAlerta.fechaEnvio).getTime()) /
    (1000 * 60 * 60);

  return horasTranscurridas >= config.tiempoParaEscalar;
}

/**
 * Obtiene el estado de alerta escalonada para una prescripción
 */
export function obtenerEstadoAlertaEscalonada(
  prescripcion: Prescripcion
): EstadoAlertaEscalonada {
  const siguienteAlerta = calcularSiguienteAlerta(prescripcion);
  const ultimaAlerta = [...prescripcion.alertasEnviadas].sort(
    (a, b) => b.diasAntes - a.diasAntes
  )[0];

  const nivelActual = ultimaAlerta?.nivelEscalacion || 'responsable';
  
  let requiereEscalacion = false;
  let tiempoRestanteParaEscalar: number | undefined;

  if (siguienteAlerta && siguienteAlerta.requiereAccion && siguienteAlerta.tiempoParaEscalar) {
    requiereEscalacion = debeEscalarPorInactividad(prescripcion, siguienteAlerta);
    
    if (ultimaAlerta && !ultimaAlerta.accionTomada) {
      const horasTranscurridas =
        (new Date().getTime() - new Date(ultimaAlerta.fechaEnvio).getTime()) /
        (1000 * 60 * 60);
      tiempoRestanteParaEscalar = Math.max(
        0,
        (siguienteAlerta.tiempoParaEscalar || 0) - horasTranscurridas
      );
    }
  }

  return {
    prescripcionId: prescripcion.id,
    diasRestantes: prescripcion.diasRestantes,
    alertasEnviadas: prescripcion.alertasEnviadas,
    siguienteAlerta,
    nivelActual,
    requiereEscalacion,
    tiempoRestanteParaEscalar,
  };
}

/**
 * Genera las notificaciones pendientes para todas las prescripciones
 */
export function generarNotificacionesPendientes(
  prescripciones: Prescripcion[]
): NotificacionPendiente[] {
  const notificaciones: NotificacionPendiente[] = [];

  for (const prescripcion of prescripciones) {
    // Alerta normal programada
    const siguienteAlerta = calcularSiguienteAlerta(prescripcion);
    if (siguienteAlerta) {
      notificaciones.push({
        id: `NOT-${prescripcion.id}-${siguienteAlerta.diasAntes}`,
        prescripcionId: prescripcion.id,
        numeroExpediente: prescripcion.numeroExpediente,
        titulo: `Prescripción ${prescripcion.numeroExpediente}`,
        descripcion: prescripcion.descripcion,
        diasRestantes: prescripcion.diasRestantes,
        nivelEscalacion: siguienteAlerta.nivel,
        destinatarios: calcularDestinatarios(prescripcion, siguienteAlerta.nivel),
        tipoNotificacion: siguienteAlerta.tipoNotificacion,
        mensaje: siguienteAlerta.mensaje,
      });
    }

    // Verificar si debe escalarse
    const configEscalacion = CONFIGURACION_ALERTAS_ESC.find(
      (c) => c.diasAntes < prescripcion.diasRestantes
    );
    
    if (configEscalacion && debeEscalarPorInactividad(prescripcion, configEscalacion)) {
      notificaciones.push({
        id: `ESC-${prescripcion.id}-${Date.now()}`,
        prescripcionId: prescripcion.id,
        numeroExpediente: prescripcion.numeroExpediente,
        titulo: `ESCALACIÓN: Prescripción ${prescripcion.numeroExpediente}`,
        descripcion: prescripcion.descripcion,
        diasRestantes: prescripcion.diasRestantes,
        nivelEscalacion: configEscalacion.nivel,
        destinatarios: calcularDestinatarios(prescripcion, configEscalacion.nivel),
        tipoNotificacion: configEscalacion.tipoNotificacion,
        mensaje: `ESCALACIÓN AUTOMÁTICA: ${configEscalacion.mensaje}`,
      });
    }
  }

  return notificaciones.sort((a, b) => a.diasRestantes - b.diasRestantes);
}

/**
 * Calcula los destinatarios según el nivel de escalación
 */
function calcularDestinatarios(
  prescripcion: Prescripcion,
  nivel: NivelEscalacion
): string[] {
  const destinatarios: string[] = [];

  switch (nivel) {
    case 'responsable':
      destinatarios.push(prescripcion.responsableId);
      break;
    case 'supervisor':
      // Incluir al responsable y su supervisor
      destinatarios.push(prescripcion.responsableId);
      // Aquí se buscaría el supervisor del responsable
      destinatarios.push('supervisor_1'); // Placeholder
      break;
    case 'socio':
      // Incluir a todos los anteriores + socio
      destinatarios.push(prescripcion.responsableId);
      destinatarios.push('supervisor_1');
      destinatarios.push('socio_1');
      break;
    case 'direccion':
      // Todos + dirección
      destinatarios.push(prescripcion.responsableId);
      destinatarios.push('supervisor_1');
      destinatarios.push('socio_1');
      destinatarios.push('direccion');
      break;
  }

  return [...new Set(destinatarios)]; // Eliminar duplicados
}

/**
 * Genera el mensaje de alerta personalizado
 */
export function generarMensajeAlerta(
  prescripcion: Prescripcion,
  config: ConfiguracionEscalacion
): string {
  const base = config.mensaje;
  const detalles = `

📋 Detalles:
• Expediente: ${prescripcion.numeroExpediente}
• Descripción: ${prescripcion.descripcion}
• Días restantes: ${prescripcion.diasRestantes}
• Responsable: ${prescripcion.responsable}
• Tipo: ${prescripcion.tipo}

⚡ Acción requerida: ${prescripcion.accionRequerida || 'Consultar expediente'}

🔗 Enlace: /expedientes/${prescripcion.expedienteId}
  `;

  return base + detalles;
}

/**
 * Simula el envío de una alerta (en producción se conectaría con el servicio de notificaciones)
 */
export function simularEnvioAlerta(
  prescripcion: Prescripcion,
  config: ConfiguracionEscalacion
): Alerta {
  const alerta: Alerta = {
    id: `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    prescripcionId: prescripcion.id,
    fechaEnvio: new Date(),
    tipoNotificacion: config.tipoNotificacion[0],
    destinatarios: calcularDestinatarios(prescripcion, config.nivel),
    leida: false,
    diasAntes: config.diasAntes,
    mensaje: generarMensajeAlerta(prescripcion, config),
    nivelEscalacion: config.nivel,
  };

  console.log(`[ALERTA] Enviada alerta ${config.diasAntes}d a nivel ${config.nivel}:`, alerta);
  
  return alerta;
}

/**
 * Registra una acción tomada sobre una alerta
 */
export function registrarAccion(
  alerta: Alerta,
  accion: string,
  _usuarioId: string
): Alerta {
  return {
    ...alerta,
    accionTomada: accion,
    fechaAccion: new Date(),
    leida: true,
  };
}

/**
 * Obtiene el color según el nivel de escalación
 */
export function getNivelEscalacionColor(nivel: NivelEscalacion): string {
  switch (nivel) {
    case 'responsable':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'supervisor':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'socio':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'direccion':
      return 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse';
    default:
      return 'bg-slate-500/20 text-slate-400';
  }
}

/**
 * Obtiene el texto según el nivel de escalación
 */
export function getNivelEscalacionTexto(nivel: NivelEscalacion): string {
  switch (nivel) {
    case 'responsable':
      return 'Responsable';
    case 'supervisor':
      return 'Supervisor';
    case 'socio':
      return 'Socio';
    case 'direccion':
      return 'Dirección';
    default:
      return nivel;
  }
}

/**
 * Obtiene el icono/indicador visual para la cuenta atrás
 */
export function getIndicadorCuentaAtras(diasRestantes: number): {
  color: string;
  icono: string;
  urgencia: 'baja' | 'media' | 'alta' | 'critica';
} {
  if (diasRestantes <= 1) {
    return { color: 'text-red-500', icono: '🚨', urgencia: 'critica' };
  }
  if (diasRestantes <= 7) {
    return { color: 'text-red-400', icono: '⏰', urgencia: 'critica' };
  }
  if (diasRestantes <= 15) {
    return { color: 'text-orange-400', icono: '⚠️', urgencia: 'alta' };
  }
  if (diasRestantes <= 30) {
    return { color: 'text-amber-400', icono: '🔔', urgencia: 'alta' };
  }
  if (diasRestantes <= 60) {
    return { color: 'text-yellow-400', icono: '⚡', urgencia: 'media' };
  }
  if (diasRestantes <= 90) {
    return { color: 'text-blue-400', icono: 'ℹ️', urgencia: 'baja' };
  }
  return { color: 'text-emerald-400', icono: '✅', urgencia: 'baja' };
}

/**
 * Calcula las estadísticas de alertas escalonadas
 */
export function calcularEstadisticasAlertas(
  prescripciones: Prescripcion[]
): {
  totalPendientes: number;
  porNivel: Record<NivelEscalacion, number>;
  requierenEscalacion: number;
  criticas: number;
} {
  const porNivel: Record<NivelEscalacion, number> = {
    responsable: 0,
    supervisor: 0,
    socio: 0,
    direccion: 0,
  };

  let requierenEscalacion = 0;
  let criticas = 0;

  for (const prescripcion of prescripciones) {
    const estado = obtenerEstadoAlertaEscalonada(prescripcion);
    
    if (estado.siguienteAlerta) {
      porNivel[estado.siguienteAlerta.nivel]++;
    }
    
    if (estado.requiereEscalacion) {
      requierenEscalacion++;
    }
    
    if (prescripcion.diasRestantes <= 7 && prescripcion.diasRestantes > 0) {
      criticas++;
    }
  }

  return {
    totalPendientes: prescripciones.filter(
      (p) => p.estado !== 'atendida' && p.diasRestantes > 0
    ).length,
    porNivel,
    requierenEscalacion,
    criticas,
  };
}
