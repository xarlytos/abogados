/**
 * Hook para gestionar Alertas Escalonadas de Prescripciones
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Prescripcion, Alerta } from '@/types/prescripciones';
import { prescripcionesData } from '@/data/prescripcionesData';
import {
  calcularSiguienteAlerta,
  debeEscalarPorInactividad,
  obtenerEstadoAlertaEscalonada,
  generarNotificacionesPendientes,
  simularEnvioAlerta,
  registrarAccion,
  calcularEstadisticasAlertas,
  getIndicadorCuentaAtras,
  CONFIGURACION_ALERTAS_ESC,
  type EstadoAlertaEscalonada,
} from '@/services/alertasEscalonadasService';

export interface AlertaConPrescripcion extends Alerta {
  prescripcion: Prescripcion;
}

export function useAlertasEscalonadas() {
  // Estado de prescripciones (en producción vendría de una API)
  const [prescripciones, setPrescripciones] = useState<Prescripcion[]>(prescripcionesData);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date>(new Date());

  // Calcular estados de alerta para todas las prescripciones
  const estadosAlertas = useMemo(() => {
    return prescripciones.map((p) => obtenerEstadoAlertaEscalonada(p));
  }, [prescripciones, ultimaActualizacion]);

  // Notificaciones pendientes
  const notificacionesPendientes = useMemo(() => {
    return generarNotificacionesPendientes(
      prescripciones.filter((p) => p.estado !== 'atendida' && p.diasRestantes > 0)
    );
  }, [prescripciones, ultimaActualizacion]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    return calcularEstadisticasAlertas(
      prescripciones.filter((p) => p.estado !== 'atendida' && p.diasRestantes > 0)
    );
  }, [prescripciones]);

  // Alertas por nivel de escalación
  const alertasPorNivel = useMemo(() => {
    const resultado: Record<string, AlertaConPrescripcion[]> = {
      responsable: [],
      supervisor: [],
      socio: [],
      direccion: [],
    };

    for (const prescripcion of prescripciones) {
      for (const alerta of prescripcion.alertasEnviadas) {
        if (!alerta.leida) {
          resultado[alerta.nivelEscalacion].push({
            ...alerta,
            prescripcion,
          });
        }
      }
    }

    return resultado;
  }, [prescripciones]);

  // Prescripciones que requieren atención inmediata
  const prescripcionesCriticas = useMemo(() => {
    return prescripciones
      .filter((p) => p.diasRestantes <= 7 && p.diasRestantes > 0 && p.estado !== 'atendida')
      .sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [prescripciones]);

  // ============================================
  // ACCIONES
  // ============================================

  /**
   * Envía una alerta manualmente
   */
  const enviarAlerta = useCallback(
    (prescripcionId: string, diasAntes: number) => {
      const prescripcion = prescripciones.find((p) => p.id === prescripcionId);
      if (!prescripcion) return;

      const config = CONFIGURACION_ALERTAS_ESC.find((c) => c.diasAntes === diasAntes);
      if (!config) return;

      const nuevaAlerta = simularEnvioAlerta(prescripcion, config);

      setPrescripciones((prev) =>
        prev.map((p) =>
          p.id === prescripcionId
            ? {
                ...p,
                alertasEnviadas: [...p.alertasEnviadas, nuevaAlerta],
                fechaActualizacion: new Date(),
              }
            : p
        )
      );

      setUltimaActualizacion(new Date());
    },
    [prescripciones]
  );

  /**
   * Marca una alerta como leída y registra acción
   */
  const marcarAlertaLeida = useCallback(
    (prescripcionId: string, alertaId: string, accion?: string) => {
      setPrescripciones((prev) =>
        prev.map((p) => {
          if (p.id !== prescripcionId) return p;

          return {
            ...p,
            alertasEnviadas: p.alertasEnviadas.map((a) => {
              if (a.id !== alertaId) return a;
              return registrarAccion(
                a,
                accion || 'Alerta revisada',
                'usuario_actual'
              );
            }),
            fechaActualizacion: new Date(),
          };
        })
      );

      setUltimaActualizacion(new Date());
    },
    []
  );

  /**
   * Marca una prescripción como atendida
   */
  const atenderPrescripcion = useCallback(
    (prescripcionId: string, accion: string, atendidoPor: string) => {
      setPrescripciones((prev) =>
        prev.map((p) =>
          p.id === prescripcionId
            ? {
                ...p,
                estado: 'atendida',
                fechaAtencion: new Date(),
                atendidoPor,
                accionRequerida: accion,
                fechaActualizacion: new Date(),
              }
            : p
        )
      );

      setUltimaActualizacion(new Date());
    },
    []
  );

  /**
   * Verifica y procesa alertas automáticas
   */
  const verificarAlertasAutomaticas = useCallback(() => {
    let alertasEnviadas = 0;

    for (const prescripcion of prescripciones) {
      // No procesar si ya está atendida o vencida
      if (prescripcion.estado === 'atendida' || prescripcion.diasRestantes <= 0) {
        continue;
      }

      const siguienteAlerta = calcularSiguienteAlerta(prescripcion);
      
      if (siguienteAlerta) {
        // Verificar si debe enviarse esta alerta
        const yaEnviada = prescripcion.alertasEnviadas.some(
          (a) => a.diasAntes === siguienteAlerta.diasAntes
        );

        if (!yaEnviada) {
          // Simular envío de alerta
          const nuevaAlerta = simularEnvioAlerta(prescripcion, siguienteAlerta);
          
          setPrescripciones((prev) =>
            prev.map((p) =>
              p.id === prescripcion.id
                ? {
                    ...p,
                    alertasEnviadas: [...p.alertasEnviadas, nuevaAlerta],
                    fechaActualizacion: new Date(),
                  }
                : p
            )
          );
          
          alertasEnviadas++;
        }
      }

      // Verificar escalaciones por inactividad
      for (const config of CONFIGURACION_ALERTAS_ESC) {
        if (debeEscalarPorInactividad(prescripcion, config)) {
          const yaEscalada = prescripcion.alertasEnviadas.some(
            (a) =>
              a.diasAntes === config.diasAntes &&
              a.nivelEscalacion === config.nivel
          );

          if (!yaEscalada) {
            const alertaEscalacion = simularEnvioAlerta(prescripcion, config);
            
            setPrescripciones((prev) =>
              prev.map((p) =>
                p.id === prescripcion.id
                  ? {
                      ...p,
                      alertasEnviadas: [...p.alertasEnviadas, alertaEscalacion],
                      fechaActualizacion: new Date(),
                    }
                  : p
              )
            );
            
            alertasEnviadas++;
          }
        }
      }
    }

    if (alertasEnviadas > 0) {
      setUltimaActualizacion(new Date());
    }

    return alertasEnviadas;
  }, [prescripciones]);

  /**
   * Obtiene el indicador visual para la cuenta atrás
   */
  const getIndicadorPrescripcion = useCallback((prescripcion: Prescripcion) => {
    return getIndicadorCuentaAtras(prescripcion.diasRestantes);
  }, []);

  /**
   * Obtiene el estado de alerta para una prescripción específica
   */
  const getEstadoPrescripcion = useCallback(
    (prescripcionId: string): EstadoAlertaEscalonada | null => {
      const prescripcion = prescripciones.find((p) => p.id === prescripcionId);
      if (!prescripcion) return null;
      return obtenerEstadoAlertaEscalonada(prescripcion);
    },
    [prescripciones]
  );

  // Efecto para actualización periódica (simulación del motor)
  useEffect(() => {
    const interval = setInterval(() => {
      verificarAlertasAutomaticas();
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [verificarAlertasAutomaticas]);

  return {
    // Datos
    prescripciones,
    estadosAlertas,
    notificacionesPendientes,
    estadisticas,
    alertasPorNivel,
    prescripcionesCriticas,
    
    // Acciones
    enviarAlerta,
    marcarAlertaLeida,
    atenderPrescripcion,
    verificarAlertasAutomaticas,
    
    // Helpers
    getIndicadorPrescripcion,
    getEstadoPrescripcion,
  };
}
