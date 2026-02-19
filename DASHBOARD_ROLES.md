# Dashboard por Rol - ERP Bufete de Abogados

Este documento describe la estructura, widgets y funcionalidades específicas del dashboard para cada rol del sistema.

---

## 1. Super Administrador

### Layout
- **3 columnas** en pantallas grandes (widgets principales)
- **Sidebar** con acceso a configuración del sistema
- **Barra superior** con alertas críticas del sistema

### Widgets Principales

| Widget | Descripción | Prioridad |
|--------|-------------|-----------|
| **Estado del Sistema** | Uptime, último backup, errores del sistema | Alta |
| **Usuarios Activos** | Total de usuarios, sesiones activas, últimos accesos | Alta |
| **Logs de Auditoría** | Últimas 10 acciones críticas con timestamp | Alta |
| **Uso de Recursos** | CPU, memoria, almacenamiento, base de datos | Media |
| **Licencias y Suscripciones** | Estado de licencias, renovaciones próximas | Media |
| **Reportes de Errores** | Bugs reportados, tickets de soporte pendientes | Media |
| **Actividad por Módulo** | Heatmap de uso de módulos del sistema | Baja |
| **Integraciones** | Estado de APIs externas (SAT, email, etc.) | Alta |

### Métricas Clave (KPIs)
- Tiempo de respuesta del sistema (< 200ms)
- Porcentaje de uptime (99.9%)
- Usuarios concurrentes máximos
- Espacio de almacenamiento disponible
- Último backup exitoso

### Acciones Rápidas
- [ ] Crear nuevo usuario
- [ ] Ejecutar backup manual
- [ ] Ver logs completos
- [ ] Configurar integraciones
- [ ] Reiniciar servicios
- [ ] Gestionar permisos globales

### Notificaciones/Alertas
- 🔴 Errores críticos del sistema
- 🟡 Backups fallidos o pendientes
- 🔴 Intentos de acceso sospechosos
- 🟡 Licencias próximas a vencer
- 🔴 Espacio de almacenamiento bajo

### Gráficos
- Gráfico de líneas: Uso de recursos (24h)
- Gráfico circular: Distribución de usuarios por rol
- Heatmap: Actividad del sistema por hora/día

---

## 2. Socio / Director

### Layout
- **Vista ejecutiva** con KPIs grandes en la parte superior
- **2 columnas** para widgets operativos
- **Timeline** de actividad reciente a la derecha

### Widgets Principales

| Widget | Descripción | Prioridad |
|--------|-------------|-----------|
| **Dashboard Financiero** | Ingresos, egresos, utilidad del mes, comparativa YoY | Alta |
| **Casos Activos** | Total de casos, por estado, por área de práctica | Alta |
| **Productividad del Equipo** | Horas facturables vs no facturables por abogado | Alta |
| **Facturación Pendiente** | Por cobrar, vencidas, proyección de ingresos | Alta |
| **Clientes Principales** | Top 10 clientes por ingresos, satisfacción | Media |
| **Casos de Alto Valor** | Casos con honorarios > $XXX,XXX | Media |
| **Vencimientos Críticos** | Juicios, plazos procesales próximos a vencer | Alta |
| **Desempeño por Abogado** | Ranking de productividad, efectividad | Media |

### Métricas Clave (KPIs)
- Ingresos del mes (actual vs presupuesto)
- Margen de utilidad del bufete
- Tasa de facturación efectiva (real/cobrada)
- Número de casos nuevos este mes
- Satisfacción del cliente (NPS)
- Horas promedio facturables por abogado

### Acciones Rápidas
- [ ] Crear nuevo caso
- [ ] Aprobar cotización
- [ ] Ver reporte financiero
- [ ] Asignar caso a abogado
- [ ] Autorizar descuento
- [ ] Generar reporte ejecutivo
- [ ] Revisar casos críticos

### Notificaciones/Alertas
- 🔴 Casos con audiencia en < 48h sin preparar
- 🟡 Facturas vencidas > 30 días
- 🔴 Clientes sin contacto > 60 días
- 🟡 Abogados con baja productividad
- 🔴 Presupuesto mensual excedido
- 🟡 Renegociación de contratos próxima

### Gráficos
- Gráfico de barras: Ingresos vs Egresos (últimos 6 meses)
- Gráfico de líneas: Tendencia de casos nuevos
- Gráfico circular: Distribución de ingresos por área
- Gauge: Cumplimiento de metas mensuales

---

## 3. Abogado Senior

### Layout
- **Vista de trabajo** con tareas y casos prioritarios
- **Sidebar** con acceso rápido a casos asignados
- **Calendario semanal** integrado

### Widgets Principales

| Widget | Descripción | Prioridad |
|--------|-------------|-----------|
| **Mis Casos Activos** | Casos bajo su responsabilidad con próximos pasos | Alta |
| **Tareas Pendientes** | Lista de tareas con prioridad y vencimiento | Alta |
| **Casos de Junior a Supervisar** | Casos de abogados junior bajo su mentoría | Alta |
| **Agenda del Día** | Audiencias, citas, reuniones programadas | Alta |
| **Tiempo Registrado** | Horas de esta semana vs meta semanal | Media |
| **Documentos Pendientes** | Escritos, contratos pendientes de revisar | Media |
| **Notificaciones de Clientes** | Mensajes nuevos de clientes | Media |
| **Biblioteca Jurídica** | Últimos precedentes agregados, favoritos | Baja |

### Métricas Clave (KPIs)
- Casos activos bajo su cargo
- Horas facturables esta semana
- Tareas completadas vs pendientes
- Tiempo promedio de respuesta a clientes
- Casos ganados/perdidos (ratio)
- Efectividad en audiencias

### Acciones Rápidas
- [ ] Registrar tiempo
- [ ] Subir documento
- [ ] Crear tarea
- [ ] Enviar mensaje a cliente
- [ ] Programar audiencia
- [ ] Solicitar aprobación de honorarios
- [ ] Revisar trabajo de junior

### Notificaciones/Alertas
- 🔴 Audiencia mañana sin preparación
- 🟡 Plazos procesales en < 72h
- 🔴 Documentos pendientes de entrega
- 🟡 Mensajes de clientes sin responder > 24h
- 🟡 Meta de horas semanal no alcanzada
- 🔴 Revisión de junior pendiente

### Gráficos
- Gráfico de barras: Horas registradas por día (semana actual)
- Gráfico circular: Distribución de tiempo por caso
- Timeline: Próximos eventos y vencimientos
- Progreso: Metas semanales de horas

---

## 4. Abogado Junior / Asociado

### Layout
- **Vista simple y enfocada** en tareas diarias
- **Lista de tareas** prominente
- **Acceso rápido** a casos asignados

### Widgets Principales

| Widget | Descripción | Prioridad |
|--------|-------------|-----------|
| **Mis Tareas de Hoy** | Tareas asignadas ordenadas por prioridad | Alta |
| **Casos Asignados** | Lista de casos con estado y próxima actividad | Alta |
| **Mi Agenda** | Calendario del día/semana con reuniones | Alta |
| **Tiempo de Trabajo** | Timer para registrar horas, resumen diario | Media |
| **Documentos en Revisión** | Borradores enviados a revisión de senior | Media |
| **Investigaciones Pendientes** | Temas legales asignados para investigar | Media |
| **Mensajes y Notas** | Comunicaciones de seniors y clientes | Media |
| **Plantillas Útiles** | Documentos frecuentes, formatos | Baja |

### Métricas Clave (KPIs)
- Tareas completadas hoy
- Horas registradas esta semana
- Casos asignados activos
- Tasa de aprobación de documentos (revisión senior)
- Tiempo promedio por tarea

### Acciones Rápidas
- [ ] Iniciar timer de trabajo
- [ ] Marcar tarea completada
- [ ] Subir borrador para revisión
- [ ] Solicitar ayuda a senior
- [ ] Ver plantilla de documento
- [ ] Registrar gasto de caso
- [ ] Agregar nota a expediente

### Notificaciones/Alertas
- 🟡 Tareas vencidas o por vencer hoy
- 🟢 Documentos aprobados por senior
- 🔴 Documentos rechazados (correcciones)
- 🟡 Citas programadas para mañana
- 🟡 Meta de horas diaria no alcanzada

### Gráficos
- Gráfico de progreso: Tareas completadas (semana)
- Gráfico simple: Horas por día
- Lista visual: Estado de casos asignados

---

## 5. Paralegal / Asistente Legal

### Layout
- **Vista organizativa** con enfoque en documentos y trámites
- **Tablero de trámites** con estados
- **Acceso rápido** a plantillas

### Widgets Principales

| Widget | Descripción | Prioridad |
|--------|-------------|-----------|
| **Trámites en Curso** | Lista de trámites con fechas y estados | Alta |
| **Documentos para Organizar** | Pendientes de clasificar y archivar | Alta |
| **Casos de Apoyo** | Casos donde colabora con próximas entregas | Alta |
| **Tareas Administrativas** | Pendientes de secretario o administrativas | Media |
| **Biblioteca de Plantillas** | Formularios frecuentes, acceso rápido | Media |
| **Calendario de Vencimientos** | Fechas límite de trámites | Alta |
| **Investigaciones Asignadas** | Temas pendientes de investigar | Media |
| **Solicitudes de Clientes** | Pedidos de información/documentos | Media |

### Métricas Clave (KPIs)
- Trámites completados esta semana
- Documentos organizados/archivados
- Tareas pendientes de trámites
- Tiempo promedio por trámite
- Trámites próximos a vencer (< 48h)

### Acciones Rápidas
- [ ] Subir documento a expediente
- [ ] Actualizar estado de trámite
- [ ] Descargar plantilla
- [ ] Programar cita
- [ ] Enviar recordatorio a cliente
- [ ] Registrar entrega de documento
- [ ] Solicitar firma

### Notificaciones/Alertas
- 🔴 Trámites con vencimiento < 24h
- 🟡 Documentos sin organizar > 3 días
- 🟡 Respuestas pendientes de clientes
- 🟢 Trámites completados/aprobados
- 🟡 Citas confirmadas para mañana

### Gráficos
- Gráfico de barras: Trámites completados por semana
- Estado visual: Trámites por etapa (pendiente, en proceso, completado)
- Lista prioritaria: Vencimientos próximos

---

## 6. Secretario/a Jurídico

### Layout
- **Vista de agenda** con calendario prominente
- **Panel de actividad** del bufete
- **Gestión documental** accesible

### Widgets Principales

| Widget | Descripción | Prioridad |
|--------|-------------|-----------|
| **Agenda General del Bufete** | Calendario completo con todas las citas | Alta |
| **Audiencias de la Semana** | Listado de audiencias con preparación | Alta |
| **Llamadas y Mensajes** | Registro de llamadas pendientes de atender | Alta |
| **Documentos para Archivar** | Papel físico pendiente de digitalizar | Media |
| **Correspondencia** | Entrada/salida de documentos oficiales | Media |
| **Salas de Juntas** | Disponibilidad y reservas | Baja |
| **Directorio de Contactos** | Acceso rápido a clientes, juzgados, contrapartes | Media |
| **Recordatorios del Día** | Citas, llamadas, entregas programadas | Alta |

### Métricas Clave (KPIs)
- Citas programadas hoy
- Llamadas atendidas/registradas
- Documentos digitalizados esta semana
- Audiencias preparadas (checklist)
- Tiempo de respuesta a llamadas

### Acciones Rápidas
- [ ] Programar nueva cita
- [ ] Registrar llamada entrante
- [ ] Digitalizar documento
- [ ] Enviar recordatorio
- [ ] Preparar expediente para audiencia
- [ ] Reservar sala de juntas
- [ ] Actualizar directorio

### Notificaciones/Alertas
- 🔴 Audiencia mañana sin preparar expediente
- 🟡 Citas en < 1 hora
- 🟡 Llamadas perdidas sin devolver
- 🟡 Documentos urgentes para entregar
- 🟡 Recordatorios de cumpleaños clientes

### Gráficos
- Calendario semanal visual
- Lista timeline: Actividad del día
- Contadores: Pendientes por categoría

---

## 7. Administrador / Gerente

### Layout
- **Vista administrativa** con KPIs operativos
- **Panel financiero** simplificado
- **Gestión de recursos** prominente

### Widgets Principales

| Widget | Descripción | Prioridad |
|--------|-------------|-----------|
| **Resumen Financiero** | Ingresos, egresos, saldo del mes | Alta |
| **Facturación y Cobranza** | Facturas pendientes, vencidas, cobradas | Alta |
| **Nómina y Personal** | Pagos pendientes, vacaciones, incidencias | Alta |
| **Proveedores y Gastos** | Pagos por realizar, facturas por recibir | Media |
| **Inventario del Bufete** | Recursos, equipos, materiales de oficina | Baja |
| **Contratos y Servicios** | Renovaciones próximas, servicios contratados | Media |
| **Reportes Operativos** | Eficiencia, costos por área | Media |
| **Presupuesto vs Real** | Comparativa mensual de gastos | Alta |

### Métricas Clave (KPIs)
- Facturación del mes
- Cuentas por cobrar totales
- Gastos operativos mensuales
- Nómina total
- Costo por caso promedio
- Ocupación de oficinas/recursos

### Acciones Rápidas
- [ ] Generar factura
- [ ] Registrar pago recibido
- [ ] Aprobar gasto
- [ ] Generar nómina
- [ ] Ver reporte financiero
- [ ] Gestionar proveedor
- [ ] Configurar tarifa

### Notificaciones/Alertas
- 🔴 Nómina por pagar (próximo corte)
- 🟡 Facturas vencidas > 15 días
- 🔴 Gastos sin comprobante > 7 días
- 🟡 Contratos por renovar (< 30 días)
- 🟡 Presupuesto de área al 80%
- 🔴 Pagos a proveedores urgentes

### Gráficos
- Gráfico de barras: Ingresos vs Gastos (últimos 6 meses)
- Gráfico circular: Distribución de gastos
- Línea de tiempo: Vencimientos de pagos
- Gauge: Cumplimiento presupuestal

---

## 8. Contador / Finanzas

### Layout
- **Vista contable** con libros y estados financieros
- **Panel de cumplimiento fiscal** prominente
- **Reportes detallados** accesibles

### Widgets Principales

| Widget | Descripción | Prioridad |
|--------|-------------|-----------|
| **Estados Financieros** | Balance, estado de resultados preliminar | Alta |
| **Cuentas por Cobrar/Pagar** | Antigüedad de saldos, vencimientos | Alta |
| **Facturación Electrónica** | CFDIs emitidos, cancelaciones, errores | Alta |
| **Cumplimiento Fiscal** | Declaraciones próximas, obligaciones | Alta |
| **Flujo de Caja** | Proyección a 30 días, entradas/salidas | Alta |
| **Conciliaciones Bancarias** | Estado de conciliaciones pendientes | Media |
| **Gastos Deducibles** | Clasificación, topes fiscales | Media |
| **Auditoría y Ajustes** | Asientos pendientes, pólizas por revisar | Media |

### Métricas Clave (KPIs)
- Ingresos acumulados del mes
- Egresos acumulados del mes
- Utilidad neta
- Cuentas por cobrar totales
- Días promedio de cobro
- Impuestos por pagar (aproximado)
- Efectivo disponible

### Acciones Rápidas
- [ ] Generar póliza
- [ ] Emitir factura electrónica
- [ ] Registrar asiento contable
- [ ] Conciliar cuenta bancaria
- [ ] Generar declaración
- [ ] Exportar balanza
- [ ] Calcular impuestos

### Notificaciones/Alertas
- 🔴 Declaración fiscal próxima (< 5 días)
- 🟡 Facturas con errores de timbrado
- 🔴 Cuentas por cobrar > 90 días
- 🟡 Conciliaciones pendientes > 15 días
- 🔴 Topes deducibles próximos a exceder
- 🟡 Variaciones inusuales en gastos

### Gráficos
- Gráfico de líneas: Flujo de caja proyectado
- Gráfico de barras: Ingresos y egresos por mes
- Gráfico circular: Composición de egresos
- Tabla: Antigüedad de saldos

---

## 9. Recepcionista

### Layout
- **Vista sencilla** enfocada en atención
- **Agenda del día** prominente
- **Panel de visitantes**

### Widgets Principales

| Widget | Descripción | Prioridad |
|--------|-------------|-----------|
| **Agenda de Hoy** | Citas programadas con hora y cliente | Alta |
| **Sala de Espera** | Visitantes presentes, tiempo de espera | Alta |
| **Llamadas Pendientes** | Mensajes para devolver | Alta |
| **Abogados Disponibles** | Estado de ocupación del equipo legal | Media |
| **Clientes Potenciales** | Nuevos contactos por dar seguimiento | Media |
| **Calendario Semanal** | Vista rápida de disponibilidad | Baja |
| **Directorio Rápido** | Búsqueda de contactos frecuentes | Media |
| **Notificaciones Recientes** | Mensajes del equipo para clientes | Baja |

### Métricas Clave (KPIs)
- Citas programadas hoy
- Visitantes atendidos hoy
- Llamadas atendidas hoy
- Tiempo promedio de espera
- Clientes potenciales registrados

### Acciones Rápidas
- [ ] Registrar visita
- [ ] Programar cita
- [ ] Registrar llamada
- [ ] Agregar cliente potencial
- [ ] Notificar llegada de visitante
- [ ] Enviar confirmación de cita
- [ ] Actualizar datos de contacto

### Notificaciones/Alertas
- 🟡 Cliente en sala de espera > 15 min
- 🟡 Cita en 15 minutos
- 🟡 Llamada urgente en espera
- 🟢 Confirmación de cita recibida
- 🟡 Abogado solicitado no disponible

### Gráficos
- Lista simple: Agenda del día
- Indicadores visuales: Disponibilidad de abogados
- Contadores: Visitas del día

---

## Componentes Compartidos

### Header (todos los roles)
- Logo y navegación principal
- Buscador global
- Notificaciones (campana con contador)
- Perfil de usuario (foto, nombre, rol)
- Botón de ayuda/acceso a soporte

### Sidebar (según rol)
- Menú de navegación contextual al rol
- Accesos directos a módulos permitidos
- Indicadores de estado (online/offline)
- Toggle de modo compacto/extendido

### Footer (todos los roles)
- Información de versión
- Enlaces a términos y privacidad
- Soporte técnico

---

## Responsive Design

### Desktop (> 1200px)
- Layout completo con sidebar expandido
- Múltiples columnas de widgets
- Gráficos interactivos completos

### Tablet (768px - 1199px)
- Sidebar colapsable
- 2 columnas de widgets máximo
- Gráficos simplificados

### Mobile (< 768px)
- Sidebar como menú hamburguesa
- 1 columna de widgets
- Vista lista prioritaria
- Acciones rápidas en bottom sheet

---

## Personalización por Usuario

Cada usuario puede configurar:
1. **Widgets visibles** (mostrar/ocultar)
2. **Orden de widgets** (drag & drop)
3. **Tema visual** (claro/oscuro/auto)
4. **Densidad de información** (compacta/normal/espaciada)
5. **Notificaciones** (qué alertas recibe y cómo)
6. **Accesos directos personalizados**

---

## Notas de Implementación

1. **Lazy Loading**: Cargar widgets bajo demanda para optimizar rendimiento
2. **WebSockets**: Actualizar datos en tiempo real para notificaciones
3. **Caching**: Guardar preferencias de dashboard en localStorage
4. **Permisos**: Validar acceso a widgets según matriz de permisos
5. **Analytics**: Trackear uso de widgets para optimización
