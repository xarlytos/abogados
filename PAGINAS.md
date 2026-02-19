# Documentación de Páginas del ERP

## Índice

1. [Visión General](#visión-general)
2. [Sistema de Roles](#sistema-de-roles)
3. [Autenticación](#1-autenticación-2-páginas)
4. [Principal](#2-principal-1-página)
5. [Gestión Legal](#3-gestión-legal-8-páginas)
6. [Clientes](#4-clientes-3-páginas)
7. [Tiempo y Agenda](#5-tiempo-y-agenda-3-páginas)
8. [Finanzas](#6-finanzas-4-páginas)
9. [Operaciones](#7-operaciones-4-páginas)
10. [Administración](#8-administración-4-páginas)
11. [Conflictos de Interés](#9-conflictos-de-interés-3-páginas)
12. [Firmas Digitales](#10-firmas-digitales-1-página)
13. [Propuesta de Reorganización](#propuesta-de-reorganización)

---

## Visión General

El proyecto ERP para bufetes de abogados contiene **29 páginas** organizadas en **10 grupos funcionales**. Cada página tiene definidos los roles que pueden acceder a ella según la configuración del sistema de permisos.

### Rutas Principales

Todas las páginas están ubicadas en `src/pages/` y las rutas se definen en `src/App.tsx`.

---

## Sistema de Roles

El sistema cuenta con **9 roles** definidos en `src/types/roles.ts`:

| Rol | Clave | Descripción | Permisos Clave |
|-----|-------|-------------|----------------|
| Super Administrador | `super_admin` | Acceso total al sistema | Todo habilitado |
| Socio/Director | `socio` | Máxima autoridad del bufete | Expedientes full, clientes full, reportes full |
| Abogado Senior | `abogado_senior` | Casos complejos y supervisión | Expedientes supervised, propios |
| Abogado Junior | `abogado_junior` | Casos bajo supervisión | Solo propios |
| Paralegal | `paralegal` | Apoyo legal y documentos | Support en expedientes |
| Secretario/a Jurídico | `secretario` | Gestión documental y agenda | Vista general |
| Administrador | `administrador` | Gestión operativa y RRHH | Usuarios, configuración limitada |
| Contador/Finanzas | `contador` | Contabilidad y finanzas | Contabilidad, facturación full |
| Recepcionista | `recepcionista` | Atención y citas | Solo clientes basic, agenda limitada |

### Niveles de Permisos de Módulos

- **expedientes**: `full` | `own` | `supervised` | `support` | `view` | `none`
- **clientes**: `full` | `own` | `basic` | `view` | `none`
- **facturacion**: `full` | `view` | `own` | `none`
- **agenda**: `full` | `own` | `limited` | `general` | `view` | `none`
- **contabilidad**: `full` | `view` | `own` | `none`
- **tiempo**: `full` | `own` | `view` | `none`

---

## 1. Autenticación (2 páginas)

Páginas de acceso público para la autenticación de usuarios.

### Login.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/login` |
| **Descripción** | Página principal de inicio de sesión al sistema. Permite a los usuarios autenticarse con email/contraseña o mediante proveedores externos (Google). Incluye validación de credenciales, recordatorio de contraseña y enlace a registro. |
| **Acceso** | Público (todos los roles) |
| **Sidebar** | No visible |

### Register.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/register` |
| **Descripción** | Página de registro de nuevos usuarios. Permite crear una cuenta en el sistema. Puede incluir verificación de email y activación de cuenta. |
| **Acceso** | Público (todos los roles) |
| **Sidebar** | No visible |

---

## 2. Principal (1 página)

Página principal del dashboard que muestra métricas y resumen del bufete.

### Dashboard.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/dashboard` |
| **Descripción** | Panel principal del sistema que muestra una visión general del bufete. Incluye métricas clave (expedientes activos, clientes, facturación reciente), gráficos de rendimiento, lista de tareas pendientes, próximos eventos del calendario y notificaciones importantes. Es el punto de entrada principal después del login. |
| **Acceso** | Todos los roles |
| **Sidebar** | ✅ Visible - Icono: `LayoutDashboard` |

---

## 3. Gestión Legal (8 páginas)

Módulos relacionados con la gestión de casos legales, documentos y procedimientos.

### Expedientes.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/expedientes` |
| **Descripción** | Lista central de todos los expedientes legales del bufete. Permite buscar, filtrar y ordenar casos por cliente, tipo de caso, estado, abogado responsable, fecha, etc. Incluye funcionalidades para crear nuevos expedientes, exportar datos y vista rápida de detalles. |
| **Permiso Módulo** | `expedientes: 'full' | 'own' | 'supervised' | 'support' | 'view'` |
| **Sidebar** | ✅ Visible - Icono: `FolderOpen` - Badge: 6 |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal`, `secretario` |

### ExpedienteDetail.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/expedientes/:id` |
| **Descripción** | Vista detallada de un expediente específico. Muestra toda la información del caso incluyendo: datos del cliente, hechos del caso, documentos adjuntos, timeline de actividades, notas internas, fechas importantes, audiencias programadas, tareas relacionadas y historial de facturación. Permite editar información y agregar documentos. |
| **Permiso Módulo** | Hereda de Expedientes |
| **Sidebar** | No visible (acceso desde Expedientes) |
| **Roles** | Same as Expedientes |

### Audiencias.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/audiencias` |
| **Descripción** | Gestión de audiencias y comparecencias judiciales. Lista todas las audiencias programadas con filtros por fecha, tipo, tribunal, expediente y abogado. Permite crear nuevas audiencias, configurar recordatorios, gestionar salas virtuales y seguir el estado de cada comparecencia. |
| **Permiso Módulo** | `agenda` |
| **Sidebar** | ✅ Visible - Icono: `Gavel` - Badge: 4 |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal`, `secretario` |

### Biblioteca.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/biblioteca` |
| **Descripción** | Repositorio central de documentos legales del bufete. Alberga modelos de contratos, escrituras, demandas, resoluciones judiciales, jurisprudencia, doctrinal y otros documentos de referencia. Permite organizar por categorías, búsqueda avanzada, versionado y descarga de documentos. |
| **Permiso Módulo** | `biblioteca: true` |
| **Sidebar** | ✅ Visible - Icono: `BookOpen` |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal`, `secretario`, `administrador`, `contador` |

### Prescripciones.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/prescripciones` |
| **Descripción** | Control y seguimiento de términos de prescripción de acciones legales. Lista todos los plazos legales pendientes con alertas de proximidad, permite calcular fechas de prescripción, configurar notificaciones y gestionar la renovación de términos. Crítico para evitar la pérdida de derechos por vencimiento de plazos. |
| **Permiso Módulo** | `expedientes` |
| **Sidebar** | ✅ Visible - Icono: `Timer` - Badge: 4 |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal`, `secretario` |

---

## 4. Clientes (3 páginas)

Gestión de clientes del bufete y portal de acceso para ellos.

### Clientes.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/clientes` |
| **Descripción** | Directorio de todos los clientes del bufete. Muestra información de contacto, casos activos, facturación total, estado de cuenta y última actividad. Permite buscar, filtrar por tipo (persona/empresa), crear nuevos clientes, exportar listados y acceder a detalles. |
| **Permiso Módulo** | `clientes: 'full' | 'own' | 'basic' | 'view'` |
| **Sidebar** | ✅ Visible - Icono: `Users` |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal`, `secretario`, `administrador`, `recepcionista` |

### ClienteDetail.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/clientes/:id` |
| **Descripción** | Perfil completo de un cliente. Muestra datos de contacto, representación legal, casos asociados con su estado, historial de facturación y pagos, documentos compartidos, comunicaciones, notas privadas y portal de acceso del cliente. Permite editar información y gestionar la relación. |
| **Permiso Módulo** | Hereda de Clientes |
| **Sidebar** | No visible (acceso desde Clientes) |
| **Roles** | Same as Clientes |

### PortalCliente.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/portal-cliente` |
| **Descripción** | Interfaz de acceso restringido para que los clientes consulten sus propios casos. Los clientes pueden ver el estado de sus expedientes, documentos compartidos, facturas, realizar pagos en línea y comunicarse con su abogado asignado. Simula la experiencia del cliente externo. |
| **Permiso Módulo** | `clientes` |
| **Sidebar** | ✅ Visible - Icono: `UserCircle` |
| **Roles** | `super_admin`, `socio`, `administrador` |

---

## 5. Tiempo y Agenda (3 páginas)

Gestión del tiempo, calendario y tareas del bufete.

### Calendario.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/calendario` |
| **Descripción** | Calendario interactivo con todas las actividades del bufete. Muestra audiencias, reuniones, plazos, recordatorios y eventos de todos los abogados. Permite vista diaria, semanal y mensual, crear eventos, configurar notificaciones, gestionar disponibilidad y sincronizar con calendarios externos. |
| **Permiso Módulo** | `agenda: 'full' | 'own' | 'limited' | 'general' | 'view'` |
| **Sidebar** | ✅ Visible - Icono: `Calendar` - Badge: 8 |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal`, `secretario`, `administrador`, `recepcionista` |

### Tiempo.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/tiempo` |
| **Descripción** | Sistema de control de tiempo y gestión de horas trabajadas. Permite registrar tiempo invertido en cada expediente, generar reportes de productividad por abogado, facturar por horas, analizar rentabilidad de casos y gestionar tarifas. Incluye timer en vivo y entrada manual de tiempo. |
| **Permiso Módulo** | `tiempo: 'full' | 'own' | 'view'` |
| **Sidebar** | ✅ Visible - Icono: `Clock` |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal` |

### Tareas.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/tareas` |
| **Descripción** | Gestor de tareas y pendientes del bufete. Lista todas las tareas asignadas con estado, prioridad, fecha límite y responsable. Permite crear tareas, asignar responsables, configurar recordatorios, marcar completadas y visualizar en kanban. Integra con expedientes y calendario. |
| **Permiso Módulo** | `agenda` |
| **Sidebar** | ✅ Visible - Icono: `CheckSquare` - Badge: 3 |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal`, `secretario` |

---

## 6. Finanzas (4 páginas)

Módulos relacionados con la gestión financiera del bufete.

### Facturacion.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/facturacion` |
| **Descripción** | Sistema de generación y gestión de facturas. Permite crear facturas por hora, importe fijo o recurrente, gestionar clientes facturables, enviar facturas por email, configurariva, gestionar series numeración y seguimiento de facturas emitidas. Estados: pendiente, pagada, vencida, cancelada. |
| **Permiso Módulo** | `facturacion: 'full' | 'view' | 'own'` |
| **Sidebar** | ✅ Visible - Icono: `CreditCard` |
| **Roles** | `super_admin`, `socio`, `administrador`, `contador` |

### Contabilidad.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/contabilidad` |
| **Descripción** | Módulo contable completo del bufete. Incluye libro diario, libro mayor, balance de situación, cuenta de resultados, gestión de bancos, conciliación bancaria, activos fijos,报表 financieros y exportación a formatos contables. Integración con facturación y gastos. |
| **Permiso Módulo** | `contabilidad: 'full' | 'view' | 'own'` |
| **Sidebar** | ✅ Visible - Icono: `Calculator` |
| **Roles** | `super_admin`, `socio`, `administrador`, `contador` |

### Cobranza.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/cobranza` |
| **Descripción** | Gestión de cobro de facturas pendientes. Lista facturas vencidas y por vencer, permiteenviar recordatorios automáticos, gestionar planes de pago, registrar cobros, aplicar descuentos, gestionar morosos y estadísticas de cobranza. Incluye acciones de cobranza y seguimiento. |
| **Permiso Módulo** | `facturacion` |
| **Sidebar** | ✅ Visible - Icono: `DollarSign` |
| **Roles** | `super_admin`, `socio`, `administrador`, `contador` |

### Gastos.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/gastos` |
| **Descripción** | Registro y gestión de gastos del bufete. Permite registrar gastos operativos, categorizar por tipo (viajes, matériel, transcripciones, etc.), asociar a expedientes o clientes, solicitar aprobación de gastos, reports de gastos por período y exportar para contabilidad. |
| **Permiso Módulo** | `facturacion` |
| **Sidebar** | ✅ Visible - Icono: `Receipt` |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `administrador`, `contador` |

---

## 7. Operaciones (4 páginas)

Gestión operativa diaria del bufete.

### Mensajes.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/mensajes` |
| **Descripción** | Sistema de mensajería interna del bufete. Permite comunicación directa entre usuarios, chats de equipo, notificaciones de sistema, archivos adjuntos y mensajes broadcast. Similar a un chat corporativo integrado. |
| **Permiso Módulo** | `mensajes: true` |
| **Sidebar** | ✅ Visible - Icono: `MessageSquare` - Badge: 3 |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal`, `secretario`, `administrador`, `contador`, `recepcionista` |

### Notificaciones.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/notificaciones` |
| **Descripción** | Centro de notificaciones del sistema. Lista todas las alertas,recordatorios, avisos de audiencias, cambios en casos, mensajes recibidos y actividades relevantes para el usuario. Permite marcar como leídas, configurar preferencias y filtrar por tipo. |
| **Permiso Módulo** | N/A (todos) |
| **Sidebar** | ✅ Visible - Icono: `Bell` - Badge: 5 |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal`, `secretario`, `administrador`, `contador`, `recepcionista` |

### Bitacora.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/bitacora` |
| **Descripción** | Registro de auditoría de todas las actividades del sistema. Guarda quién hizo qué, cuándo y desde dónde. Permite auditar cambios en expedientes, documentos, usuarios y configuraciones. Esencial para cumplimiento legal y seguridad. |
| **Permiso Módulo** | `canViewAuditLogs` |
| **Sidebar** | ✅ Visible - Icono: `Activity` |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `administrador` |

### Proveedores.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/proveedores` |
| **Descripción** | Directorio de proveedores del bufete (notarios, procuradores,peritos, servicios de mensajería, etc.). Gestiona datos de contacto, servicios contratados, historial de trabajos, pagos realizados y evaluación de proveedores. |
| **Permiso Módulo** | N/A |
| **Sidebar** | ✅ Visible - Icono: `Building2` |
| **Roles** | `super_admin`, `socio`, `administrador`, `contador` |

---

## 8. Administración (4 páginas)

Configuración y gestión administrativa del sistema.

### Admin.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/admin` |
| **Descripción** | Panel de administración general del sistema. Permite gestionar usuarios (crear, editar, desactivar), configurar roles y permisos, ajustar parámetros del bufete, gestionar especialidades, oficinas, configurar integraciones y opciones del sistema. Solo accesible para super_admin. |
| **Permiso Módulo** | `usuarios: 'full'` |
| **Sidebar** | ✅ Visible - Icono: `Shield` |
| **Roles** | `super_admin` |

### Plantillas.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/plantillas` |
| **Descripción** | Gestión de plantillas de documentos del bufete. Permite crear, editar y organizar plantillas para cartas, contratos, demandas, podereros, facturas y otros documentos. Soporta variables dinámicas que se reemplazan al generar documentos. |
| **Permiso Módulo** | `documentos` |
| **Sidebar** | ✅ Visible - Icono: `FileText` |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal`, `secretario`, `administrador` |

### Informes.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/informes` |
| **Descripción** | Centro de reportes y análisis del bufete. Genera informes sobre: rendimiento de abogados, estado de expedientes, facturación por período, rentabilidad de casos, clientes top, tiempos de resolución, productividad y KPIs personalizados. Exporta a PDF/Excel. |
| **Permiso Módulo** | `reportes: 'full' | 'own' | 'financial' | 'basic'` |
| **Sidebar** | ✅ Visible - Icono: `BarChart3` |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `administrador`, `contador` |

---

## 9. Conflictos de Interés (3 páginas)

Sistema de gestión y análisis de conflictos de interés.

### Conflictos.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/conflictos` |
| **Descripción** | Registro y gestión de conflictos de interés potenciales. Lista todos los conflictos detectados o reportados con su estado (pendiente, aprobado, rechazado). Permite crear nuevos conflictos, asociar partes, documentar resolución y generar informes de cumplimiento ético. |
| **Permiso Módulo** | `expedientes` |
| **Sidebar** | ✅ Visible - Icono: `ShieldAlert` - Badge: 3 |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal`, `administrador` |

### AnalisisConflictos.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/conflictos/analisis` |
| **Descripción** | Herramienta de análisis y detección de conflictos de interés. Realiza búsquedas automáticas en bases de datos de clientes, partes contrarias, testigos y profesionales para identificar posibles conflictos antes de aceptar nuevos casos. Incluye alertas y recomendaciones. |
| **Permiso Módulo** | `expedientes` |
| **Sidebar** | ✅ Visible - Icono: `ShieldAlert` - Badge: 5 |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal` |

### ConflictosPartesContrarias.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/conflictos/partes` |
| **Descripción** | Base de datos de partes contrarias y sus representantes legales. Registra información de contrapartes en litigios, empresas demandadas, sus abogados, contactos y historial de casos. Se utiliza para evitar conflictos y preparar estrategias. |
| **Permiso Módulo** | `expedientes` |
| **Sidebar** | ✅ Visible - Icono: `ShieldAlert` |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `paralegal`, `secretario` |

---

## 10. Firmas Digitales (1 página)

Gestión de firmas digitales para documentos legales.

### SignatureManagement.tsx

| 属性 | Valor |
|------|-------|
| **Ruta** | `/firmas` |
| **Descripción** | Sistema de gestión de firmas digitales. Permite crear, administrar y aplicar firmas digitales a documentos. Incluye configuración de certificados, plantillas de firma, registro de firmas aplicadas, validación de documentos firmados y auditoría de firmas. |
| **Permiso Módulo** | N/A |
| **Sidebar** | ✅ Visible - Icono: `FileSignature` - Badge: 2 |
| **Roles** | `super_admin`, `socio`, `abogado_senior`, `abogado_junior`, `administrador`, `contador` |

---

## Resumen por Grupo

| Grupo | Páginas | Roles con Acceso |
|-------|---------|------------------|
| Autenticación | 2 | Público |
| Principal | 1 | Todos |
| Gestión Legal | 5 | Todos excepto recepcionista, contador, administrador |
| Clientes | 3 | Todos excepto contador |
| Tiempo y Agenda | 3 |Todos excepto contador, recepcionista |
| Finanzas | 4 | Super admin, socio, administrador, contador |
| Operaciones | 4 | Variable por página |
| Administración | 3 | Variable por página |
| Conflictos | 3 | Todos excepto contador, recepcionista |
| Firmas | 1 |Todos excepto paralegal, secretario, recepcionista |

---

## Propuesta de Reorganización

### Análisis del Problema Actual

#### Estado Actual
- **Total de páginas**: 29
- **Rutas en App.tsx**: 29 rutas definidas
- **Items en Sidebar**: ~23 visibles por rol
- **Páginas relacionadas separadas**: 3 grupos identificados

#### Problemas Identificados

| # | Problema | Impacto | pages Afectadas |
|---|----------|--------|-----------------|
| 1 | Conflictos fragmentado en 3 páginas | Navegación confusa, duplicación de código | `Conflictos.tsx`, `AnalisisConflictos.tsx`, `ConflictosPartesContrarias.tsx` |
| 2 | Navegación a detalles por ruta separada | UX inconsistente, más rutas | `ExpedienteDetail.tsx`, `ClienteDetail.tsx` |
| 3 | Módulos relacionados分散 en sidebar | Dificultad para encontrar funciones relacionadas | Todas las páginas |
| 4 | Mix de páginas operativas y administrativas | Sobrecarga visual del sidebar | Varias páginas |

---

### Solución Propuesta: Reorganización Integral

#### Fase 1: Unificar Páginas Relacionadas (Reducir 2-4 páginas)

##### 1.1 Unificar Conflictos de Interés

**Problema**: 3 páginas para un mismo módulo lógico.

**Solución**: Crear una página unificada con navegación por pestañas.

```
/conflictos              → Página principal con tabs
  ├── /conflictos        → Tab: Lista General (default)
  ├── /conflictos/analisis → Tab: Análisis y Detección  
  └── /conflictos/partes  → Tab: Partes Contrarias
```

**Implementación**:
```tsx
// src/pages/Conflictos.tsx - Estructura propuesta
export default function Conflictos() {
  const [activeTab, setActiveTab] = useState<'lista' | 'analisis' | 'partes'>('lista');
  
  return (
    <AppLayout>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tab value="lista" label="Conflictos" />
        <Tab value="analisis" label="Análisis" />
        <Tab value="partes" label="Partes Contrarias" />
      </Tabs>
      
      {activeTab === 'lista' && <ConflictosLista />}
      {activeTab === 'analisis' && <ConflictosAnalisis />}
      {activeTab === 'partes' && <ConflictosPartes />}
    </AppLayout>
  );
}
```

**Resultado**: -2 páginas (`AnalisisConflictos.tsx`, `ConflictosPartesContrarias.tsx` eliminadas)

---

##### 1.2 Revisión de Detalles (Mantener o Combinar)

| Página | Ruta Dinámica | Propuesta | Justificación |
|--------|--------------|-----------|---------------|
| `ExpedienteDetail.tsx` | `/expedientes/:id` | **Mantener** | Es necesario para deep linking desde emails, notificaciones |
| `ClienteDetail.tsx` | `/clientes/:id` | **Mantener** | Mismo motivo que arriba |

**Conclusión**: Las páginas de detalle se mantienen por compatibilidad con enlaces externos.

---

#### Fase 2: Reestructurar Sidebar (Mejorar UX)

##### 2.1 Nueva Estructura de Secciones

Crear grupos visuales en el sidebar usando headers de sección:

```
┌─────────────────────────────────────────┐
│ 🏠 INICIO                                │
│   Dashboard                              │
├─────────────────────────────────────────┤
│ ⚖️ LEGAL                                  │
│   📁 Expedientes                         │
│   ⚖️ Conflictos (expandible)            │
│      • Lista                             │
│      • Análisis                          │
│      • Partes Contrarias                 │
│   🔨 Audiencias                          │
│   📚 Biblioteca                          │
│   ⏰ Prescripciones                      │
├─────────────────────────────────────────┤
│ 👥 CLIENTES                              │
│   👥 Clientes                            │
│   🌐 Portal Cliente                      │
├─────────────────────────────────────────┤
│ ⌛ TIEMPO                                │
│   📅 Calendario                          │
│   ⏱️ Tiempo                              │
│   ✅ Tareas                              │
├─────────────────────────────────────────┤
│ 💰 FINANZAS                              │
│   💳 Facturación                         │
│   🧮 Contabilidad                        │
│   💵 Cobranza                            │
│   🧾 Gastos                              │
├─────────────────────────────────────────┤
│ ⚙️ OPERACIONES                          │
│   💬 Mensajes           [3]             │
🔔 Notificaciones         [5]             │
│   🏢 Proveedores                          │
├─────────────────────────────────────────┤
│ 🔧 ADMINISTRACIÓN                        │
│   🛡️ Administración      (solo SA)      │
│   📊 Informes                            │
│   📄 Plantillas                          │
│   ✍️ Firmas                              │
│   📝 Bitácora                            │
└─────────────────────────────────────────┘
```

##### 2.2 Items de Sidebar con Submenús

```tsx
// src/components/layout/Sidebar.tsx - Estructura propuesta

const sidebarSections = [
  {
    title: 'INICIO',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: allRoles }
    ]
  },
  {
    title: 'LEGAL',
    items: [
      { icon: FolderOpen, label: 'Expedientes', path: '/expedientes', roles: ['super_admin', 'socio', ...] },
      { 
        icon: ShieldAlert, 
        label: 'Conflictos', 
        path: '/conflictos',
        expanded: true, // estado local
        submenu: [
          { label: 'Lista', path: '/conflictos' },
          { label: 'Análisis', path: '/conflictos/analisis' },
          { label: 'Partes Contrarias', path: '/conflictos/partes' }
        ],
        roles: ['super_admin', 'socio', 'abogado_senior', ...]
      },
      { icon: Gavel, label: 'Audiencias', path: '/audiencias', ... },
      { icon: BookOpen, label: 'Biblioteca', path: '/biblioteca', ... },
      { icon: Timer, label: 'Prescripciones', path: '/prescripciones', ... },
    ]
  },
  // ... demás secciones
];
```

---

#### Fase 3: Reducción de Rutas (Opcional)

Si se quiere reducir aún más, considerar:

| Cambios Propuestos | Reducción | Riesgo |
|--------------------|-----------|--------|
| Combinar `PortalCliente` dentro de `Clientes` con toggle | -1 página | Bajo - agregar parámetro |
| Combinar `Notificaciones` dentro de `Mensajes` como tab | -1 página | Medio - cambio UX |
| Combinar `Bitácora` dentro de `Admin` como tab | -1 página | Bajo - solo para admins |

**Página Resultante**: 25 páginas (reducción de 4)

---

### Plan de Implementación

#### Paso 1: Reestructurar Sidebar (Día 1)
- [ ] Agregar secciones con headers divisores
- [ ] Implementar menú expandible para Conflictos
- [ ] Aplicar estilos visuales para diferenciación

#### Paso 2: Unificar Conflictos (Día 2)
- [ ] Modificar `Conflictos.tsx` para incluir 3 tabs
- [ ] Mover componentes de páginas eliminadas
- [ ] Actualizar rutas en `App.tsx`
- [ ] Eliminar archivos `AnalisisConflictos.tsx` y `ConflictosPartesContrarias.tsx`

#### Paso 3: Testing y Ajustes (Día 3)
- [ ] Verificar que todos los roles ven las páginas correctas
- [ ] Probar navegación entre tabs
- [ ] Verificar deep links existentes

---

### Comparación Before/After

| Métrica | Antes | Después |
|---------|-------|---------|
| Total páginas | 29 | 27 |
| Items en sidebar (promedio) | 20-23 | 15-18 por sección |
| Secciones en sidebar | 1 (lista plana) | 7 (agrupadas) |
| Páginas Conflictos | 3 | 1 |
| Clics para Conflictos | 1 (directo) | 2 (expand + click) |

---

### Beneficios Esperados

1. **Navegación más intuitiva**: Las páginas relacionadas están agrupadas
2. **Menos contexto-switching**: Los tabs evitan cambiar de página
3. **Sidebar más limpio**: Secciones divididas reducen carga visual
4. **Mantenimiento reducido**: Menos archivos duplicados
5. **Escalabilidad**: Nuevas páginas se pueden agregar a secciones lógicas

---

### Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Confusión con tabs | Baja | Bajo | Agregar indicador visual claro |
| Deep links rotos | Baja | Alto | Mantener rutas existentes con redirect |
| Resistance al cambio | Media | Medio | Involucrar usuarios en testing |

---

## Referencias

- Definición de roles: `src/types/roles.ts`
- Rutas: `src/App.tsx`
- Sidebar: `src/components/layout/Sidebar.tsx`
- Hook de permisos: `src/hooks/useRole.ts`
