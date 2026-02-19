# Mejoras Adicionales - ERP Bufete de Abogados

> 🚀 **Propuesta de Nuevas Mejoras** - Funcionalidades complementarias para llevar el sistema al siguiente nivel
>
> *Documento complementario a `FUNCIONALIDADES_AVANZADAS.md` y `NUEVAS_FUNCIONALIDADES.md`*

---

## 📊 Índice de Mejoras Propuestas

### Experiencia de Usuario y Productividad
1. [Sistema de Atajos de Teclado y Comandos Rápidos](#1-sistema-de-atajos-de-teclado-y-comandos-rápidos)
2. [Centro de Notificaciones Inteligente](#2-centro-de-notificaciones-inteligente)
3. [Modo Oscuro y Personalización Visual por Rol](#3-modo-oscuro-y-personalización-visual-por-rol)

### Gestión de Clientes y Comercial
4. [CRM Legal - Pipeline de Clientes Potenciales](#4-crm-legal---pipeline-de-clientes-potenciales)
5. [Encuestas de Satisfacción Automatizadas (NPS)](#5-encuestas-de-satisfacción-automatizadas-nps)
6. [Portal de Captación Web (Landing + Formularios)](#6-portal-de-captación-web-landing--formularios)

### Automatización y Eficiencia
7. [Motor de Plantillas Inteligentes con Variables Dinámicas](#7-motor-de-plantillas-inteligentes-con-variables-dinámicas)
8. [Sistema de Macros y Automatizaciones Personalizadas](#8-sistema-de-macros-y-automatizaciones-personalizadas)
9. [Dictado por Voz y Transcripción Automática](#9-dictado-por-voz-y-transcripción-automática)

### Colaboración y Comunicación
10. [Tablero Kanban para Gestión Visual de Expedientes](#10-tablero-kanban-para-gestión-visual-de-expedientes)
11. [Sala de Datos Virtual (Data Room)](#11-sala-de-datos-virtual-data-room)
12. [Sistema de Turnos de Guardia y Disponibilidad](#12-sistema-de-turnos-de-guardia-y-disponibilidad)

### Financiero y Reporting
13. [Presupuestos y Propuestas Comerciales Interactivas](#13-presupuestos-y-propuestas-comerciales-interactivas)
14. [Sistema de Honorarios Condicionales (Pacto de Quota Litis)](#14-sistema-de-honorarios-condicionales-pacto-de-quota-litis)
15. [Dashboard Comparativo Multi-Periodo con Exportación BI](#15-dashboard-comparativo-multi-periodo-con-exportación-bi)

---

# EXPERIENCIA DE USUARIO Y PRODUCTIVIDAD

## 1. Sistema de Atajos de Teclado y Comandos Rápidos

### 📋 Descripción
Barra de comandos tipo **Cmd+K / Ctrl+K** (estilo Spotlight, VS Code, Notion) que permite al usuario navegar, buscar y ejecutar acciones desde el teclado sin usar el ratón.

### 🎯 Tipo de Implementación
**⚡ WIDGET GLOBAL** - Accesible desde cualquier página con `Ctrl+K`

### 🔧 Funcionalidades Clave

**Barra de Comandos:**
```
┌──────────────────────────────────────────────────────┐
│ 🔍 ¿Qué quieres hacer?                  [Ctrl+K]    │
├──────────────────────────────────────────────────────┤
│                                                       │
│ 📄 RECIENTES                                         │
│ • Expediente 234/2025 - García vs. López             │
│ • Factura FAC-2026-0045                              │
│                                                       │
│ ⚡ ACCIONES RÁPIDAS                                  │
│ • Nuevo Expediente                    [Ctrl+N]       │
│ • Nueva Tarea                         [Ctrl+T]       │
│ • Registrar Tiempo                    [Ctrl+Shift+T] │
│ • Nuevo Mensaje                       [Ctrl+M]       │
│                                                       │
│ 🔎 BUSCAR                                            │
│ • Buscar en Expedientes...                           │
│ • Buscar Cliente...                                  │
│ • Buscar Documento...                                │
│                                                       │
│ 🧭 NAVEGAR                                           │
│ • Ir a Dashboard                      [Alt+1]       │
│ • Ir a Expedientes                    [Alt+2]       │
│ • Ir a Calendario                     [Alt+3]       │
└──────────────────────────────────────────────────────┘
```

**Atajos Predefinidos:**

| Atajo | Acción | Contexto |
|-------|--------|----------|
| `Ctrl+K` | Abrir barra de comandos | Global |
| `Ctrl+N` | Nuevo expediente / Nuevo registro | Según página activa |
| `Ctrl+T` | Nueva tarea rápida | Global |
| `Ctrl+Shift+T` | Iniciar temporizador | Global |
| `Ctrl+S` | Guardar formulario activo | Formularios |
| `Alt+1-9` | Navegar a módulo | Global |
| `Ctrl+F` | Buscar en página actual | Global |
| `Esc` | Cerrar modal / Volver atrás | Global |
| `Ctrl+Enter` | Enviar formulario | Formularios |

### 👥 Roles Afectados
Todos los roles internos. Los atajos disponibles se adaptan según los permisos del rol.

### 💡 Mejoras al Sistema
- ⚡ **Velocidad:** 50% más rápido para usuarios avanzados
- 🧠 **Productividad:** Usuarios experimentados no necesitan ratón
- 🔍 **Búsqueda global:** Todo accesible desde un solo punto
- 🎯 **Accesibilidad:** Mejora UX para todos los usuarios

### 🛠️ Implementación Técnica

```typescript
// Hook de atajos
const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { role } = useAuth();

  const commands = useMemo(() =>
    getCommandsForRole(role)
      .filter(cmd => cmd.label.toLowerCase().includes(query.toLowerCase())),
    [role, query]
  );

  useHotkeys('ctrl+k', () => setIsOpen(true));
  useHotkeys('escape', () => setIsOpen(false));

  return { isOpen, query, setQuery, commands, setIsOpen };
};
```

**Esfuerzo estimado:** 2-3 semanas
**Costo:** €3,000-5,000

---

## 2. Centro de Notificaciones Inteligente

### 📋 Descripción
Evolución del sistema de notificaciones actual con agrupación inteligente, priorización automática, canales múltiples (in-app, email, push, SMS) y resúmenes diarios personalizados.

### 🎯 Tipo de Implementación
**📊 MEJORA DE PÁGINA EXISTENTE** (Notificaciones) + **Widget global**

### 🔧 Funcionalidades Clave

**Agrupación Inteligente:**
- ✅ Agrupar notificaciones por expediente
- ✅ Agrupar notificaciones por tipo (tareas, mensajes, plazos)
- ✅ Priorización automática (urgente > importante > informativo)
- ✅ "No molestar" con excepciones para urgentes
- ✅ Resumen diario por email a las 8:00 AM

**Canales Configurables por Tipo:**

| Tipo de Notificación | In-App | Email | Push | SMS |
|----------------------|--------|-------|------|-----|
| Plazo vence mañana | ✅ | ✅ | ✅ | ✅ |
| Nuevo mensaje | ✅ | ✅ | ✅ | ❌ |
| Tarea asignada | ✅ | ✅ | ❌ | ❌ |
| Documento subido | ✅ | ❌ | ❌ | ❌ |
| Firma solicitada | ✅ | ✅ | ✅ | ❌ |
| Audiencia en 1h | ✅ | ✅ | ✅ | ✅ |

**Resumen Diario Personalizado:**
```
Buenos días, María García ☀️

📋 TU DÍA - 17/02/2026

⚠️ URGENTE (2)
• Plazo recurso Exp. 234/2025 - Vence HOY
• Audiencia a las 11:00 - Juzgado 1ª Instancia nº 5

📌 PENDIENTE (5)
• 3 tareas sin completar
• 2 documentos por revisar

📧 SIN LEER (8)
• 3 mensajes de clientes
• 5 notificaciones del sistema

📅 AGENDA
• 09:30 - Reunión equipo
• 11:00 - Audiencia (Exp. 234/2025)
• 16:00 - Cita cliente nuevo
```

### 💡 Mejoras al Sistema
- 🔔 **Relevancia:** Solo lo importante llega con urgencia
- 📊 **Productividad:** Resumen diario ahorra 20 min/día
- 🎯 **Personalización:** Cada usuario configura sus canales
- 😌 **Menos ruido:** Agrupación reduce notificaciones redundantes

**Esfuerzo estimado:** 3-4 semanas
**Costo:** €5,000-8,000

---

## 3. Modo Oscuro y Personalización Visual por Rol

### 📋 Descripción
Sistema de temas visuales con modo oscuro nativo, personalización de colores por rol y preferencias de interfaz guardadas en perfil.

### 🎯 Tipo de Implementación
**⚡ UTILIDAD TRANSVERSAL** - Configuración en perfil de usuario

### 🔧 Funcionalidades Clave

- ✅ **Modo Oscuro** completo (toggle light/dark/auto)
- ✅ **Colores del sidebar** según rol (ej. azul para abogados, verde para admin)
- ✅ **Densidad de información** (compacta, normal, espaciada)
- ✅ **Tamaño de fuente** configurable
- ✅ **Layout del Dashboard** personalizable (drag & drop de widgets)
- ✅ **Tema del Portal del Cliente** personalizable por bufete (white-label)
- ✅ **Guardado automático** de preferencias por usuario

### 💡 Mejoras al Sistema
- 👁️ **Fatiga visual:** Modo oscuro reduce cansancio
- 🎨 **Identidad:** Cada rol se "siente" diferente
- 😍 **Satisfacción:** Usuarios prefieren apps personalizables
- 🏢 **Branding:** Portal del Cliente refleja imagen del bufete

**Esfuerzo estimado:** 3-4 semanas
**Costo:** €4,000-7,000

---

# GESTIÓN DE CLIENTES Y COMERCIAL

## 4. CRM Legal - Pipeline de Clientes Potenciales

### 📋 Descripción
Módulo CRM especializado en el ciclo de vida del cliente legal: desde la primera consulta hasta la conversión en cliente y fidelización posterior.

### 🎯 Tipo de Implementación
**📄 NUEVA PÁGINA** - "CRM / Captación" accesible para Socios, Administradores y Abogados Senior

### 🔧 Funcionalidades Clave

**Pipeline Visual:**
```
┌──────────────────────────────────────────────────────────────┐
│ 📊 Pipeline de Clientes                                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  CONSULTA     EVALUACIÓN    PRESUPUESTO    ACEPTADO    CASO  │
│  INICIAL      VIABILIDAD    ENVIADO        FIRMADO     ABIERTO│
│  ─────────    ──────────    ───────────    ─────────   ──────│
│  │ Juan P. │  │ María L.│  │ Carlos R.│  │ Ana S.  │  │    ││
│  │ Laboral │  │ Civil   │  │ €3,500   │  │ €5,000  │  │    ││
│  │ 2 días  │  │ 5 días  │  │ 3 días   │  │ Hoy     │  │    ││
│  ├─────────┤  ├─────────┤  ├──────────┤  ├─────────┤  │    ││
│  │ Pedro M.│  │         │  │ Laura G. │  │         │  │    ││
│  │ Penal   │  │         │  │ €8,000   │  │         │  │    ││
│  │ Hoy     │  │         │  │ 7 días   │  │         │  │    ││
│  └─────────┘  └─────────┘  └──────────┘  └─────────┘  └────┘│
│                                                               │
│  📊 Tasa de conversión: 45%  |  💰 Pipeline total: €124,500  │
└──────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Pipeline visual tipo kanban (drag & drop entre etapas)
- ✅ Registro de consultas iniciales (formulario rápido)
- ✅ Evaluación de viabilidad del caso
- ✅ Generación automática de presupuesto
- ✅ Seguimiento de propuestas enviadas
- ✅ Conversión automática a Expediente al aceptar
- ✅ Motivos de rechazo (estadísticas)
- ✅ Fuente de captación (Google, referido, colegio abogados, etc.)
- ✅ Seguimiento automatizado (recordatorios de seguimiento)
- ✅ Métricas: tasa de conversión, tiempo medio de cierre, ticket medio

### 👥 Roles Afectados

| Rol | Acceso | Funcionalidad |
|-----|--------|---------------|
| **Super Admin / Socio** | ✅ Total | Todas las métricas, configuración pipeline |
| **Abogado Senior** | ✅ Completo | Gestionar su pipeline, evaluar viabilidad |
| **Administrador** | ✅ Vista | Métricas comerciales, presupuestos |
| **Recepcionista** | ✅ Limitado | Registrar consultas iniciales |
| **Resto** | ❌ | Sin acceso |

### 💡 Mejoras al Sistema
- 📈 **Conversión:** +30% en conversión de leads a clientes
- 📊 **Visibilidad:** Pipeline comercial claro y medible
- ⏱️ **Seguimiento:** Ningún lead se pierde
- 💰 **Revenue:** Predicción de ingresos futuros

**Esfuerzo estimado:** 4-6 semanas
**Costo:** €8,000-15,000

---

## 5. Encuestas de Satisfacción Automatizadas (NPS)

### 📋 Descripción
Sistema de encuestas automáticas enviadas a clientes al cerrar expedientes o tras hitos importantes para medir satisfacción y detectar problemas.

### 🎯 Tipo de Implementación
**⚡ AUTOMATIZACIÓN** + Panel de resultados en Dashboard

### 🔧 Funcionalidades Clave

- ✅ Encuesta NPS automática al cerrar expediente
- ✅ Encuestas de satisfacción parciales (tras audiencia, tras reunión)
- ✅ Personalización de preguntas por tipo de caso
- ✅ Envío por email / SMS / Portal del Cliente
- ✅ Dashboard de NPS con evolución temporal
- ✅ Alertas cuando NPS < 7 (detractor detectado)
- ✅ Vinculación con abogado responsable
- ✅ Testimonios autorizados (para marketing)
- ✅ Comparativa NPS por área de práctica / abogado

**Flujo:**
```
Expediente Cerrado
       ↓
Esperar 24-48 horas
       ↓
Enviar encuesta al cliente
       ↓
Cliente responde (1-10 + comentario)
       ↓
┌─────────────┬──────────────┬──────────────┐
│ NPS 9-10    │ NPS 7-8      │ NPS 0-6      │
│ PROMOTOR    │ PASIVO       │ DETRACTOR    │
│             │              │              │
│ Solicitar   │ Registrar    │ Alerta a     │
│ testimonio  │              │ Socio/Abogado│
│ + reseña    │              │ Acción       │
│ Google      │              │ correctiva   │
└─────────────┴──────────────┴──────────────┘
```

### 💡 Mejoras al Sistema
- ⭐ **Calidad:** Medir y mejorar satisfacción continuamente
- 🔔 **Detección temprana:** Problemas detectados antes de perder cliente
- 📣 **Marketing:** Testimonios reales de clientes satisfechos
- 📊 **KPIs:** NPS como métrica clave del bufete

**Esfuerzo estimado:** 2-3 semanas
**Costo:** €3,000-5,000

---

## 6. Portal de Captación Web (Landing + Formularios)

### 📋 Descripción
Landing pages y formularios de contacto integrados con el ERP para captar clientes directamente desde la web del bufete. Las consultas se convierten automáticamente en leads del CRM.

### 🎯 Tipo de Implementación
**📄 NUEVA SECCIÓN** en Administración + Widgets embeddables

### 🔧 Funcionalidades Clave

- ✅ Constructor de formularios de contacto (drag & drop)
- ✅ Widget de chat en vivo embebido en web del bufete
- ✅ Formulario "Consulta gratuita" con campos configurables
- ✅ Auto-asignación de leads por área de práctica
- ✅ Respuesta automática al cliente (email de confirmación)
- ✅ Integración directa con Pipeline CRM (nueva entrada automática)
- ✅ Tracking de fuente (UTM, Google Ads, SEO)
- ✅ Cita online (calendario público con disponibilidad)
- ✅ Código embed para sitio web externo del bufete

### 💡 Mejoras al Sistema
- 🌐 **Captación 24/7:** Leads entran incluso fuera de horario
- 🤖 **Automatización:** De formulario web → CRM sin intervención manual
- 📊 **Tracking:** Saber de dónde vienen los clientes
- 💰 **ROI Marketing:** Medir retorno de inversión publicitaria

**Esfuerzo estimado:** 4-5 semanas
**Costo:** €6,000-10,000

---

# AUTOMATIZACIÓN Y EFICIENCIA

## 7. Motor de Plantillas Inteligentes con Variables Dinámicas

### 📋 Descripción
Evolución del módulo de Plantillas actual para que los documentos se generen automáticamente rellenando variables desde datos del expediente, cliente y caso.

### 🎯 Tipo de Implementación
**📊 MEJORA DE PÁGINA EXISTENTE** (Plantillas de Documentos)

### 🔧 Funcionalidades Clave

**Auto-rellenado de Variables:**
```
Plantilla "Demanda Civil":

En [CIUDAD], a [FECHA_ACTUAL]

AL JUZGADO DE PRIMERA INSTANCIA DE [JUZGADO_CIUDAD]

D./Dña. [CLIENTE_NOMBRE], con DNI [CLIENTE_DNI],
domiciliado en [CLIENTE_DIRECCION], representado
por el/la Letrado/a D./Dña. [ABOGADO_NOMBRE],
colegiado nº [ABOGADO_COLEGIADO], del Ilustre
Colegio de Abogados de [ABOGADO_COLEGIO],

FORMULA DEMANDA DE [TIPO_PROCEDIMIENTO] contra
D./Dña. [DEMANDADO_NOMBRE], con domicilio en
[DEMANDADO_DIRECCION]...
```

**Variables Disponibles:**
- ✅ **Datos del cliente:** nombre, DNI, dirección, email, teléfono
- ✅ **Datos del expediente:** número, tipo, juzgado, procedimiento
- ✅ **Datos del abogado:** nombre, colegiado, colegio
- ✅ **Datos de la contraparte:** nombre, DNI, dirección
- ✅ **Fechas:** actual, de notificación, de vencimiento
- ✅ **Importes:** reclamación, costas, intereses calculados
- ✅ **Condicionales:** `{{SI tipo_caso == 'civil'}}...{{FIN}}`
- ✅ **Tablas dinámicas:** listar documentos adjuntos, pruebas, testigos

**Editor Visual de Plantillas:**
- WYSIWYG con inserción de variables via menú contextual
- Preview en tiempo real con datos reales del expediente
- Exportación a DOCX, PDF y formato Lexnet

### 💡 Mejoras al Sistema
- ⏱️ **Ahorro:** 80% menos tiempo en redacción de escritos estándar
- ✅ **Calidad:** Documentos sin errores de transcripción
- 📄 **Consistencia:** Todos los documentos siguen el formato del bufete
- 🔄 **Reutilización:** Un expediente alimenta múltiples plantillas

**Esfuerzo estimado:** 4-5 semanas
**Costo:** €7,000-12,000

---

## 8. Sistema de Macros y Automatizaciones Personalizadas

### 📋 Descripción
Permitir a los usuarios (sobre todo Socios y Super Admin) crear automatizaciones tipo "Si pasa X, entonces haz Y" sin necesidad de programar, similar a Zapier/Make pero interno.

### 🎯 Tipo de Implementación
**📄 NUEVA SECCIÓN** en Administración

### 🔧 Funcionalidades Clave

**Automatizaciones Predefinidas:**
```
📋 Mis Automatizaciones:

1. ✅ "Al crear expediente → Crear carpeta de documentos estándar"
2. ✅ "Al recibir pago → Enviar recibo por email al cliente"
3. ✅ "Al vencer plazo sin completar → Escalar a Socio"
4. ✅ "Al cerrar expediente → Enviar encuesta NPS"
5. ✅ "Al asignar tarea → Notificar por email y push"
6. ✅ "Cada lunes 8AM → Enviar resumen semanal a Socios"
7. ✅ "Al subir factura de proveedor → Crear gasto pendiente"
```

**Constructor Visual:**
```
DISPARADOR (Cuando...)
├── Se crea un expediente nuevo
├── Un plazo está a X días de vencer
├── Se sube un documento
├── Se registra un pago
├── Es un día/hora específico
└── Un campo cambia de valor

CONDICIÓN (Si...)
├── El expediente es de tipo X
├── El importe es mayor a Y
├── El abogado asignado es Z
└── El cliente es VIP

ACCIÓN (Entonces...)
├── Enviar notificación
├── Crear tarea
├── Enviar email
├── Cambiar estado
├── Asignar a persona
└── Crear registro
```

### 💡 Mejoras al Sistema
- 🤖 **Automatización:** Procesos repetitivos eliminados
- ⚡ **Personalización:** Cada bufete automatiza según sus procesos
- 📊 **Escalabilidad:** Sin necesidad de desarrollador para nuevos flujos
- 🎯 **Consistencia:** Procesos siempre se ejecutan igual

**Esfuerzo estimado:** 6-8 semanas
**Costo:** €12,000-20,000

---

## 9. Dictado por Voz y Transcripción Automática

### 📋 Descripción
Funcionalidad de dictado por voz para crear notas, registrar actividades y redactar documentos usando la voz, con transcripción automática e integración con IA para formato legal.

### 🎯 Tipo de Implementación
**⚡ UTILIDAD TRANSVERSAL** - Botón de micrófono en formularios de texto

### 🔧 Funcionalidades Clave

- ✅ Botón de dictado en todos los campos de texto largo (notas, descripciones)
- ✅ Transcripción en tiempo real (speech-to-text)
- ✅ Soporte multiidioma (español, catalán, gallego, euskera, inglés)
- ✅ Puntuación automática y formato
- ✅ Vocabulario legal personalizado (términos jurídicos)
- ✅ Dictado de notas rápidas en expedientes
- ✅ Transcripción de grabaciones de reuniones
- ✅ Comandos de voz: "nuevo párrafo", "punto y aparte", "entre comillas"
- ✅ Revisión y edición post-dictado

**Casos de Uso Principales:**
1. **Abogado tras audiencia:** Dictar notas rápidas sobre resultado
2. **En desplazamiento:** Registrar actividades desde móvil por voz
3. **Reunión con cliente:** Transcribir notas al momento
4. **Redacción de escritos:** Primer borrador dictado

### 💡 Mejoras al Sistema
- ⏱️ **Velocidad:** 3x más rápido que escribir
- 📱 **Movilidad:** Registrar información desde cualquier lugar
- 📝 **Completitud:** Más detalles capturados al momento
- ♿ **Accesibilidad:** Útil para usuarios con dificultades de escritura

**Implementación:** Web Speech API (gratis) + Whisper API (alta precisión, ~$0.006/min)

**Esfuerzo estimado:** 2-3 semanas
**Costo:** €4,000-6,000

---

# COLABORACIÓN Y COMUNICACIÓN

## 10. Tablero Kanban para Gestión Visual de Expedientes

### 📋 Descripción
Vista Kanban alternativa para gestionar expedientes, además de la vista de lista/tabla actual. Permite arrastrar expedientes entre columnas de estado para una gestión más visual e intuitiva.

### 🎯 Tipo de Implementación
**📊 MEJORA DE PÁGINA EXISTENTE** (Expedientes) - Nueva vista "Kanban"

### 🔧 Funcionalidades Clave

**Vista Kanban:**
```
┌─────────────────────────────────────────────────────────────────┐
│ 📋 Expedientes - Vista Kanban          [Lista] [Kanban ✓] [Cal]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ 📥 NUEVO   📝 EN ESTUDIO  ⚖️ EN PROCESO  📊 SENTENCIA  ✅ CERRADO│
│ ────────   ───────────   ────────────   ──────────   ─────────│
│ ┌────────┐ ┌───────────┐ ┌────────────┐ ┌──────────┐          │
│ │García  │ │López vs.  │ │Martínez    │ │Ruiz S.L. │          │
│ │Laboral │ │Banco X    │ │Divorcio    │ │Mercantil │          │
│ │€2,500  │ │€15,000    │ │€3,000      │ │€25,000   │          │
│ │🔴 Urg. │ │🟡 Normal  │ │🟢 Normal   │ │🟡 Pte.   │          │
│ └────────┘ └───────────┘ └────────────┘ └──────────┘          │
│ ┌────────┐               ┌────────────┐                        │
│ │Sánchez │               │Pérez       │                        │
│ │Civil   │               │Penal       │                        │
│ │€5,000  │               │€10,000     │                        │
│ └────────┘               └────────────┘                        │
│                                                                  │
│ Arrastrar para cambiar estado    📊 Total pipeline: €60,500     │
└─────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Drag & drop entre columnas de estado
- ✅ Columnas configurables (personalizar estados)
- ✅ Filtros por abogado, tipo de caso, prioridad
- ✅ Tarjetas con información resumida (cliente, importe, prioridad)
- ✅ Quick actions (abrir, asignar, cambiar prioridad) desde la tarjeta
- ✅ Contador de expedientes y valor por columna
- ✅ Límites WIP (Work In Progress) por columna
- ✅ Color de tarjeta según prioridad o tipo

### 💡 Mejoras al Sistema
- 👁️ **Visibilidad:** Estado de todos los casos de un vistazo
- 🎯 **Gestión ágil:** Mover expedientes entre estados intuitivamente
- 📊 **Bottlenecks:** Identificar cuellos de botella visualmente
- ⚡ **Eficiencia:** Reorganizar prioridades arrastrando

**Esfuerzo estimado:** 3-4 semanas
**Costo:** €5,000-8,000

---

## 11. Sala de Datos Virtual (Data Room)

### 📋 Descripción
Espacio seguro y controlado para compartir documentos confidenciales con terceros (clientes, contrapartes, peritos) con permisos granulares, marca de agua, y auditoría de acceso.

### 🎯 Tipo de Implementación
**📄 NUEVA FUNCIONALIDAD** integrada en Expedientes y Portal del Cliente

### 🔧 Funcionalidades Clave

- ✅ Crear "sala de datos" por expediente o transacción
- ✅ Invitar participantes externos con email (sin necesidad de cuenta)
- ✅ Permisos granulares: solo ver, descargar, comentar
- ✅ Marca de agua automática con nombre del que visualiza
- ✅ Expiración de acceso configurable
- ✅ Log de acceso: quién vio qué y cuándo
- ✅ Prevención de captura de pantalla (best-effort)
- ✅ Organización por carpetas dentro de la sala
- ✅ Preguntas y respuestas (Q&A) entre participantes
- ✅ NDAs digitales antes de acceder

**Casos de Uso:**
1. **Due Diligence** en operaciones M&A
2. **Compartir documentación** con peritos
3. **Intercambio seguro** con contraparte en negociación
4. **Entrega de documentación** a clientes al cerrar caso

### 💡 Mejoras al Sistema
- 🔒 **Seguridad:** Documentos confidenciales bajo control
- 📊 **Trazabilidad:** Saber exactamente quién vio qué
- ⚡ **Eficiencia:** Elimina emails con adjuntos sensibles
- 🏢 **Profesionalidad:** Imagen premium ante clientes

**Esfuerzo estimado:** 5-7 semanas
**Costo:** €10,000-18,000

---

## 12. Sistema de Turnos de Guardia y Disponibilidad

### 📋 Descripción
Módulo para gestionar turnos de guardia del bufete, disponibilidad de abogados y rotaciones, especialmente para bufetes con servicio de guardia (penal, extranjería, etc.).

### 🎯 Tipo de Implementación
**📄 NUEVA SECCIÓN** en Calendario + Administración

### 🔧 Funcionalidades Clave

- ✅ Calendario de guardias (vista mensual)
- ✅ Asignación automática de turnos (rotación equitativa)
- ✅ Intercambio de turnos entre abogados (con aprobación)
- ✅ Disponibilidad en tiempo real (quién está de guardia ahora)
- ✅ Notificaciones de turno entrante (24h antes, 1h antes)
- ✅ Registro de actuaciones durante guardia
- ✅ Estadísticas: guardias por abogado, actuaciones, compensaciones
- ✅ Integración con turno de oficio (si aplica)
- ✅ Número de contacto de guardia (redirección automática)

### 💡 Mejoras al Sistema
- 📅 **Organización:** Turnos claros y sin conflictos
- ⚖️ **Equidad:** Rotación justa y medible
- 📱 **Disponibilidad:** Siempre se sabe quién está disponible
- 📊 **Compensación:** Datos objetivos para compensar guardias

**Esfuerzo estimado:** 3-4 semanas
**Costo:** €5,000-8,000

---

# FINANCIERO Y REPORTING

## 13. Presupuestos y Propuestas Comerciales Interactivas

### 📋 Descripción
Sistema de generación de presupuestos profesionales e interactivos que el cliente puede aceptar digitalmente, con diferentes modalidades de honorarios y desglose de servicios.

### 🎯 Tipo de Implementación
**📊 MEJORA DE PÁGINA EXISTENTE** (Facturación) + Integración con Portal del Cliente

### 🔧 Funcionalidades Clave

**Tipos de Presupuesto:**
- ✅ **Honorarios fijos:** Precio cerrado por servicio
- ✅ **Por horas:** Estimación de horas × tarifa
- ✅ **Mixto:** Base fija + horas adicionales
- ✅ **Éxito (quota litis):** Porcentaje sobre resultado
- ✅ **Paquetes:** Servicios agrupados con descuento

**Presupuesto Interactivo:**
```
┌──────────────────────────────────────────────────────────┐
│ 📋 Presupuesto PRE-2026-0045                              │
│ Para: Juan García López                                   │
│ Asunto: Reclamación por despido improcedente              │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ 📦 OPCIÓN A - Servicio Básico              €2,500        │
│ ☑ Estudio del caso                                       │
│ ☑ Redacción papeleta conciliación                        │
│ ☑ Asistencia a acto de conciliación                      │
│ ☐ Demanda judicial (+ €1,500)                            │
│                                                           │
│ 📦 OPCIÓN B - Servicio Completo            €4,500        │
│ ☑ Todo lo de Opción A                                    │
│ ☑ Demanda judicial                                       │
│ ☑ Asistencia a juicio oral                               │
│ ☑ Recurso de suplicación (si procede)                    │
│                                                           │
│ 📦 OPCIÓN C - Premium                      €6,000        │
│ ☑ Todo lo de Opción B                                    │
│ ☑ Ejecución de sentencia                                │
│ ☑ Seguimiento hasta cobro efectivo                       │
│                                                           │
│ 💳 Forma de pago: [ Único ▼ | 2 plazos | 3 plazos ]     │
│                                                           │
│ ✍️ [Aceptar y Firmar]    📄 [Descargar PDF]              │
│                                                           │
│ Válido hasta: 28/02/2026                                  │
└──────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Constructor de presupuestos con plantillas por tipo de caso
- ✅ Opciones múltiples (el cliente elige)
- ✅ Aceptación digital con firma electrónica
- ✅ Planes de pago configurables
- ✅ Conversión automática a factura al aceptar
- ✅ Seguimiento: visto, pendiente, aceptado, rechazado
- ✅ Recordatorios automáticos si no responde en X días
- ✅ Estadísticas de conversion rate por tipo de presupuesto

### 💡 Mejoras al Sistema
- 💰 **Conversión:** +25% al ofrecer opciones claras
- ⏱️ **Velocidad:** Presupuesto en 5 minutos, no en 1 hora
- 📊 **Tracking:** Saber cuándo el cliente ve el presupuesto
- 🏢 **Profesionalidad:** Impresión profesional ante el cliente

**Esfuerzo estimado:** 4-5 semanas
**Costo:** €7,000-12,000

---

## 14. Sistema de Honorarios Condicionales (Pacto de Quota Litis)

### 📋 Descripción
Módulo especializado para gestionar casos con honorarios basados en resultado (porcentaje sobre lo obtenido), con tracking de importes, cálculos automáticos y facturación condicionada.

### 🎯 Tipo de Implementación
**📊 MEJORA DE PÁGINA EXISTENTE** (Facturación + Expedientes)

### 🔧 Funcionalidades Clave

- ✅ **Configurar pacto de cuota litis** en expediente:
  - Porcentaje acordado (ej. 15%, 20%, 30%)
  - Importe reclamado
  - Honorarios mínimos garantizados (si aplica)
  - Gastos cubiertos por el bufete vs. cliente
- ✅ **Cálculo automático de honorarios** según resultado:
  - Sentencia favorable: % sobre lo obtenido
  - Acuerdo/transacción: % sobre acuerdo
  - Sentencia parcialmente favorable: % sobre lo concedido
  - Sentencia desfavorable: mínimo o nada
- ✅ **Seguimiento de ejecución:** Tracking del cobro efectivo
- ✅ **Proyección financiera:** Estimación de ingresos por quota litis
- ✅ **Facturación automática** al cobrar el cliente
- ✅ **Informes:** Casos activos con quota litis, importes estimados

### 💡 Mejoras al Sistema
- 💰 **Control financiero:** Visibilidad de ingresos potenciales
- 📊 **Proyección:** Estimar ingresos futuros por quota litis
- ⚡ **Automatización:** Factura se genera al cobrar, sin intervención
- ⚖️ **Compliance:** Registro documental del pacto (obligatorio por normativa)

**Esfuerzo estimado:** 3-4 semanas
**Costo:** €5,000-8,000

---

## 15. Dashboard Comparativo Multi-Periodo con Exportación BI

### 📋 Descripción
Mejora del Dashboard para permitir comparaciones entre periodos (mes actual vs. anterior, trimestre vs. trimestre, año vs. año) y exportación de datos hacia herramientas de Business Intelligence.

### 🎯 Tipo de Implementación
**📊 MEJORA DE PÁGINA EXISTENTE** (Dashboard + Informes)

### 🔧 Funcionalidades Clave

**Comparativas:**
```
┌────────────────────────────────────────────────────────┐
│ 📊 Comparativa Q1 2026 vs Q1 2025                       │
├────────────────────────────────────────────────────────┤
│                                                         │
│ Ingresos          │  €145,000  │  €112,000  │  +29% ↑ │
│ Casos Nuevos      │     45     │     38     │  +18% ↑ │
│ Casos Ganados     │     32     │     28     │  +14% ↑ │
│ Tasa de Cobro     │    87%     │    82%     │   +5% ↑ │
│ NPS               │    8.4     │    7.9     │  +0.5 ↑ │
│ Tiempo Facturado  │  1,200h    │  1,050h    │  +14% ↑ │
│ Ticket Medio      │  €3,222    │  €2,947    │   +9% ↑ │
│                                                         │
│ 📈 [Ver gráficas]  📄 [Exportar PDF]  📊 [Enviar a BI]│
└────────────────────────────────────────────────────────┘
```

**Integración BI:**
- ✅ Exportación a **CSV/Excel** con datos estructurados
- ✅ Conector para **Power BI** (datos en tiempo real)
- ✅ Conector para **Google Data Studio / Looker**
- ✅ API de datos para integración con cualquier herramienta BI
- ✅ Reportes programados (enviar informe PDF cada lunes)
- ✅ Dashboards embebidos compartibles (link seguro)

### 💡 Mejoras al Sistema
- 📊 **Tendencias:** Detectar patrones y evolución del negocio
- 🎯 **Objetivos:** Medir progreso contra metas anuales
- 📈 **Decisiones:** Datos para decisiones estratégicas de los Socios
- 🔗 **Integración:** Datos del ERP en el ecosistema BI del bufete

**Esfuerzo estimado:** 4-6 semanas
**Costo:** €8,000-14,000

---

# 📊 RESUMEN EJECUTIVO

## Matriz de Prioridad vs Impacto

| # | Funcionalidad | Prioridad | Impacto | Esfuerzo | ROI |
|---|---------------|-----------|---------|----------|-----|
| 1 | Atajos de Teclado / Cmd+K | 🟠 Media | 🟡 Medio | 🟢 Bajo | ⭐⭐⭐ |
| 2 | Notificaciones Inteligentes | 🔴 Alta | 🟢 Alto | 🟡 Medio | ⭐⭐⭐⭐ |
| 3 | Modo Oscuro / Personalización | 🟡 Media-Baja | 🟡 Medio | 🟢 Bajo | ⭐⭐⭐ |
| 4 | CRM Legal / Pipeline | 🔴 Alta | 🟢 Muy Alto | 🟡 Medio | ⭐⭐⭐⭐⭐ |
| 5 | Encuestas NPS | 🟠 Media | 🟢 Alto | 🟢 Bajo | ⭐⭐⭐⭐ |
| 6 | Portal Captación Web | 🟠 Media-Alta | 🟢 Alto | 🟡 Medio | ⭐⭐⭐⭐ |
| 7 | Plantillas Inteligentes | 🔴 Alta | 🟢 Muy Alto | 🟡 Medio | ⭐⭐⭐⭐⭐ |
| 8 | Macros / Automatizaciones | 🟠 Media | 🟢 Alto | 🔴 Alto | ⭐⭐⭐⭐ |
| 9 | Dictado por Voz | 🟡 Media-Baja | 🟡 Medio | 🟢 Bajo | ⭐⭐⭐ |
| 10 | Kanban Expedientes | 🟠 Media-Alta | 🟢 Alto | 🟢 Bajo | ⭐⭐⭐⭐ |
| 11 | Sala de Datos Virtual | 🟡 Media | 🟢 Alto | 🟡 Medio | ⭐⭐⭐⭐ |
| 12 | Turnos de Guardia | 🟡 Baja-Media | 🟡 Medio | 🟢 Bajo | ⭐⭐⭐ |
| 13 | Presupuestos Interactivos | 🔴 Alta | 🟢 Muy Alto | 🟡 Medio | ⭐⭐⭐⭐⭐ |
| 14 | Honorarios Quota Litis | 🟠 Media | 🟡 Medio | 🟢 Bajo | ⭐⭐⭐ |
| 15 | Dashboard Comparativo + BI | 🟠 Media-Alta | 🟢 Alto | 🟡 Medio | ⭐⭐⭐⭐ |

---

## Plan de Implementación Sugerido

### FASE 1: QUICK WINS (0-3 meses)
**Objetivo: Mejoras de alto impacto con esfuerzo bajo-medio**

```
Mes 1:    Plantillas Inteligentes (variables dinámicas)
Mes 1-2:  Kanban de Expedientes (nueva vista)
Mes 2:    Notificaciones Inteligentes
Mes 2-3:  Atajos de Teclado / Cmd+K
```

**Inversión:** €15K-28K
**ROI esperado:** 200-300% en 6 meses

### FASE 2: CRECIMIENTO COMERCIAL (3-6 meses)
**Objetivo: Captación y conversión de clientes**

```
Mes 4:    CRM Legal / Pipeline
Mes 4-5:  Presupuestos Interactivos
Mes 5:    Portal de Captación Web
Mes 6:    Encuestas NPS
```

**Inversión:** €24K-42K
**ROI esperado:** 250-400% en 12 meses

### FASE 3: AUTOMATIZACIÓN AVANZADA (6-9 meses)
**Objetivo: Eliminar trabajo manual repetitivo**

```
Mes 7-8:  Macros y Automatizaciones
Mes 8:    Dictado por Voz
Mes 8-9:  Sala de Datos Virtual
```

**Inversión:** €26K-44K
**ROI esperado:** 150-250% en 12 meses

### FASE 4: POLISH & ANALYTICS (9-12 meses)
**Objetivo: Refinamiento y análisis de datos**

```
Mes 10:    Dashboard Comparativo + BI
Mes 10-11: Modo Oscuro / Personalización
Mes 11:    Turnos de Guardia
Mes 12:    Honorarios Quota Litis
```

**Inversión:** €22K-37K
**ROI esperado:** 120-180% en 18 meses

---

## Estimación de Costos Totales

| Categoría | Rango de Inversión |
|-----------|-------------------|
| **Desarrollo (15 funcionalidades)** | €87K - €151K |
| **Licencias y APIs (anual)** | €3K - €8K/año |
| **Mantenimiento (anual)** | €15K - €25K/año |
| **TOTAL Primer Año** | €105K - €184K |
| **TOTAL Años Siguientes** | €18K - €33K/año |

---

## Impacto Esperado Global

### Productividad
- ⚡ **+50%** en eficiencia de redacción de documentos
- ⏱️ **-30%** en tiempo de gestión administrativa
- 🤖 **70%** de procesos repetitivos automatizados

### Comercial
- 📈 **+30%** en conversión de leads a clientes
- 💰 **+20%** en ingresos (mejor captación y seguimiento)
- ⭐ **+40%** en satisfacción de clientes (NPS)

### Operativo
- 👁️ **100%** visibilidad del estado de todos los casos
- 🔒 **Seguridad** mejorada en compartición de documentos
- 📊 **Decisiones** basadas en datos con analytics avanzado

---

*Documento creado: 16 de febrero de 2026*
*Versión: 1.0*
*Complemento de FUNCIONALIDADES_AVANZADAS.md y NUEVAS_FUNCIONALIDADES.md*
*Equipo de Producto - ERP Bufete de Abogados*
