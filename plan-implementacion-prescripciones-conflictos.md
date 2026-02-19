# Plan de Implementación: Gestión de Prescripciones y Conflictos de Intereses

## Resumen Ejecutivo

Este documento detalla la solución técnica para abordar 5 problemas críticos en el ERP del bufete relacionados con la gestión de prescripciones legales y conflictos de intereses. Cada fase incluye especificaciones técnicas, roles de acceso y dependencias.

**Impacto Financiero Total:** €680K - €2.5M/año en riesgos mitigados

---

## Estructura de Implementación

```
src/
├── pages/
│   ├── Conflictos.tsx                    # Nueva página - Módulo principal conflictos
│   ├── ConflictosPartesContrarias.tsx    # Nueva página - Base de datos partes
│   ├── AnalisisConflictos.tsx            # Nueva página - Análisis detallado
│   └── Prescripciones.tsx                # Nueva página - Gestión de prescripciones
├── types/
│   ├── prescripciones.ts                 # Nuevo - Tipos prescripciones
│   └── conflictos.ts                     # Nuevo - Tipos conflictos
├── data/
│   ├── prescripcionesData.ts             # Nuevo - Datos prescripciones
│   └── conflictosData.ts                 # Nuevo - Datos conflictos
├── components/prescripciones/            # Nueva carpeta
│   └── index.ts
└── components/conflictos/                # Nueva carpeta
    └── index.ts
```

---

## FASE 1: Sistema de Detección de Prescripciones

### Problema: 1.3.2 - Prescripciones no detectadas a tiempo
**Riesgo:** Pérdida de casos, responsabilidad civil  
**Impacto Financiero:** €500K-€2M/año

### Solución Técnica

#### Página a Crear: `Prescripciones.tsx`

**Ubicación:** `src/pages/Prescripciones.tsx`

**Funcionalidades principales:**
1. **Dashboard de alertas** con timeline de prescripciones próximas
2. **Cálculo automático** de plazos según tipo de materia (civil, penal, laboral, contencioso-administrativo)
3. **Notificaciones escalonadas:** 90, 60, 30, 15, 7 y 1 días antes del vencimiento
4. **Histórico de prescripciones** detectadas y atendidas
5. **Integración con calendario** para agregar alertas automáticas

**Estructura del componente:**

```typescript
// Tipos necesarios (src/types/prescripciones.ts)
interface Prescripcion {
  id: string;
  expedienteId: string;
  tipo: 'civil' | 'penal' | 'laboral' | 'administrativo';
  fechaInicio: Date;
  fechaVencimiento: Date;
  plazoMeses: number;
  estado: 'vigente' | 'proxima' | 'vencida' | 'atendida';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  responsable: string;
  descripcion: string;
  diasRestantes: number;
  alertasEnviadas: Alerta[];
}

interface Alerta {
  id: string;
  prescripcionId: string;
  fechaEnvio: Date;
  tipoNotificacion: 'email' | 'push' | 'sms';
  destinatarios: string[];
  leida: boolean;
}
```

#### Actualización de Páginas Existentes

**1. Expedientes.tsx** - Añadir columna de alerta de prescripción:
```typescript
// En la tabla de expedientes, añadir:
{
  key: 'prescripcion',
  header: 'Prescripción',
  render: (exp) => <PrescripcionBadge expedienteId={exp.id} />
}
```

**2. Dashboard.tsx** - Añadir widget de prescripciones urgentes:
```typescript
// En el dashboard, añadir sección:
<UpcomingPrescriptionsWidget />
```

**3. Calendario.tsx** - Sincronizar eventos de prescripción:
```typescript
// En la carga de eventos:
const prescripcionEvents = usePrescripcionEvents();
```

### Roles y Permisos

| Rol | Permisos | Acceso |
|-----|----------|--------|
| **socio** | Full - Todas las prescripciones | Página completa + Dashboard |
| **abogado_senior** | Supervised - Propias + supervisados | Página completa |
| **abogado_junior** | Own - Solo propias | Página limitada |
| **paralegal** | View - Solo lectura | Vista resumen |
| **secretario** | View - Alertas básicas | Solo notificaciones |

### Campos del Módulo

**Tabla de Prescripciones:**
- ID de prescripción (auto-generado)
- Número de expediente (relación)
- Tipo de materia
- Fecha de inicio del cómputo
- Fecha de vencimiento (calculada)
- Plazo legal aplicable
- Días restantes (calculado automático)
- Estado (vigente/proxima/vencida/atendida)
- Prioridad (baja/media/alta/critica)
- Responsable principal
- Descripción de la acción requerida
- Fecha de última alerta

**Alertas y Notificaciones:**
- Fecha de envío
- Tipo de canal (email/push/SMS)
- Destinatarios
- Estado de lectura
- Acciones tomadas

### Dependencias
- Módulo de expedientes existente
- Sistema de notificaciones (Notificaciones.tsx)
- Calendario para sincronización
- Hook useRole para permisos

### Criterios de Éxito
- [ ] Detección automática con 95% de precisión
- [ ] Alertas enviadas con 7+ días de anticipación mínima
- [ ] Reducción de prescripciones perdidas al 0%

---

## FASE 2: Detección Automatizada de Conflictos de Intereses

### Problema: 6.3.1 - Detección de conflictos de intereses automatizada
**Riesgo:** Sanciones disciplinarias, daño reputacional  
**Impacto Financiero:** €100K-€500K/año

### Solución Técnica

#### Página a Crear: `Conflictos.tsx`

**Ubicación:** `src/pages/Conflictos.tsx`

**Funcionalidades principales:**
1. **Motor de búsqueda avanzada** que escanea automáticamente:
   - Partes contrarias actuales vs. históricas
   - Clientes con intereses opuestos
   - Abogados que representaron a partes contrarias
   - Entidades relacionadas (grupos empresariales)
2. **Algoritmo de matching** con tolerancia a similitudes (fuzzy matching)
3. **Árbol de relaciones** visual entre entidades
4. **Escaneo automático** al crear/actualizar expediente
5. **Reporte de análisis** exportable a PDF

**Estructura del componente:**

```typescript
// Tipos necesarios (src/types/conflictos.ts)
interface Conflicto {
  id: string;
  expedienteId: string;
  tipoConflicto: 'directo' | 'indirecto' | 'aparente' | 'potencial';
  estado: 'detectado' | 'en_analisis' | 'resuelto' | 'descartado';
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  entidadA: {
    tipo: 'cliente' | 'parte_contraria' | 'abogado' | 'tercero';
    id: string;
    nombre: string;
  };
  entidadB: {
    tipo: 'cliente' | 'parte_contraria' | 'abogado' | 'tercero';
    id: string;
    nombre: string;
  };
  descripcion: string;
  fechaDeteccion: Date;
  analizadoPor?: string;
  resolucion?: string;
  documentosSoporte: string[];
}

interface ReglaConflicto {
  id: string;
  nombre: string;
  descripcion: string;
  criterios: CriterioConflicto[];
  activa: boolean;
}

interface AnalisisConflicto {
  id: string;
  expedienteId: string;
  fechaAnalisis: Date;
  resultado: 'sin_conflictos' | 'conflictos_detectados' | 'requiere_revision';
  conflictosEncontrados: Conflicto[];
  analizadoPor: string;
  tiempoAnalisis: number; // en segundos
}
```

#### Actualización de Páginas Existentes

**1. Expedientes.tsx** - Añadir validación automática:
```typescript
// Al crear nuevo expediente:
const validarConflictos = async (expedienteData) => {
  const analisis = await analizarConflictos(expedienteData);
  if (analisis.conflictosEncontrados.length > 0) {
    mostrarAlertaConflicto(analisis);
  }
};
```

**2. NuevoExpedienteModal** - Validación en tiempo real:
```typescript
// Verificar conflictos al ingresar cliente/parte contraria:
useEffect(() => {
  if (cliente && parteContraria) {
    verificarConflictosEnTiempoReal(cliente, parteContraria);
  }
}, [cliente, parteContraria]);
```

**3. Dashboard.tsx** - Widget de alertas de conflicto:
```typescript
// Añadir al dashboard:
<ConflictosAlertWidget />
```

### Roles y Permisos

| Rol | Permisos | Acceso |
|-----|----------|--------|
| **socio** | Full - Todo el sistema | Página completa + Configuración |
| **abogado_senior** | Full - Ejecutar análisis + Resolver | Página completa |
| **abogado_junior** | View - Ver resultados | Solo visualización |
| **paralegal** | View - Ver conflictos básicos | Vista limitada |
| **administrador** | View - Reportes | Solo reportes |

### Campos del Módulo

**Tabla de Conflictos Detectados:**
- ID del conflicto
- Expediente relacionado
- Tipo de conflicto (directo/indirecto/aparente/potencial)
- Nivel de severidad
- Entidad A (cliente/parte/abogado)
- Entidad B (cliente/parte/abogado)
- Descripción del conflicto
- Fecha de detección
- Estado actual
- Analizado por
- Fecha de resolución
- Documentación de soporte

**Motor de Análisis:**
- Reglas configurables de detección
- Umbrales de similitud (fuzzy matching)
- Profundidad de búsqueda (1°/2°/3° nivel)
- Campos a escanear

### Dependencias
- Base de datos de partes contrarias (Fase 3)
- Módulo de expedientes
- Base de datos de clientes
- Sistema de notificaciones

### Criterios de Éxito
- [ ] Detección automática al crear expediente
- [ ] Precisión del 90%+ en matching de entidades
- [ ] Tiempo de análisis < 5 segundos

---

## FASE 3: Base de Datos de Partes Contrarias

### Problema: 6.3.2 - Ausencia de base de datos de partes contrarias
**Riesgo:** Riesgo de aceptar casos incompatibles  
**Impacto Financiero:** Alto

### Solución Técnica

#### Página a Crear: `ConflictosPartesContrarias.tsx`

**Ubicación:** `src/pages/ConflictosPartesContrarias.tsx`

**Funcionalidades principales:**
1. **CRUD completo** de partes contrarias
2. **Normalización automática** de nombres y datos
3. **Vinculación** con expedientes históricos
4. **Búsqueda avanzada** por múltiples criterios
5. **Importación/Exportación** de datos masivos
6. **Relaciones entre entidades** (personas jurídicas, grupos)

**Estructura del componente:**

```typescript
// Tipos necesarios (src/types/conflictos.ts)
interface ParteContraria {
  id: string;
  tipo: 'persona_fisica' | 'persona_juridica';
  nombreCompleto: string;
  nombreNormalizado: string; // Para búsquedas
  documentoIdentidad?: string;
  razonSocial?: string;
  cifNif?: string;
  direccion?: Direccion;
  contacto?: Contacto;
  representanteLegal?: string;
  grupoEmpresarial?: string;
  expedientesRelacionados: string[];
  abogadosQueRepresentaron: string[];
  fechaCreacion: Date;
  ultimaActualizacion: Date;
  notas: string;
  etiquetas: string[];
}

interface Direccion {
  calle: string;
  ciudad: string;
  codigoPostal: string;
  provincia: string;
  pais: string;
}

interface Contacto {
  telefono?: string;
  email?: string;
  fax?: string;
}

interface RelacionEntidad {
  id: string;
  entidadAId: string;
  entidadBId: string;
  tipoRelacion: 'grupo_empresarial' | 'matriz_filial' | 'accionista' | 'directivo' | 'familiar' | 'otro';
  descripcion?: string;
}
```

#### Actualización de Páginas Existentes

**1. Expedientes.tsx** - Selector de partes contrarias:
```typescript
// Reemplazar input libre por:
<ParteContrariaSelector 
  onSelect={(parte) => setParteContraria(parte)}
  allowCreateNew={permissions.canCreate}
/>
```

**2. Clientes.tsx** - Relación cliente-parte:
```typescript
// Añadir pestaña de conflictos:
<Tab label="Conflictos">
  <ConflictosCliente clienteId={cliente.id} />
</Tab>
```

**3. Sidebar.tsx** - Añadir nueva sección:
```typescript
// Añadir al menú:
{
  label: 'Conflictos',
  icon: Shield,
  path: '/conflictos',
  roles: ['socio', 'abogado_senior', 'abogado_junior', 'paralegal']
}
```

### Roles y Permisos

| Rol | Permisos | Acceso |
|-----|----------|--------|
| **socio** | Full - CRUD completo | Página completa |
| **abogado_senior** | Full - CRUD | Página completa |
| **abogado_junior** | View - Solo lectura | Vista consulta |
| **paralegal** | Create/View - Crear y ver | Crear y consultar |
| **secretario** | View - Solo lectura | Vista consulta |

### Campos del Módulo

**Formulario de Parte Contraria:**

*Persona Física:*
- Nombre completo
- Documento de identidad (DNI/NIE/Pasaporte)
- Domicilio completo
- Teléfono de contacto
- Email

*Persona Jurídica:*
- Razón social
- CIF/NIF
- Domicilio social
- Teléfono/email corporativo
- Representante legal
- Grupo empresarial (si aplica)

*Campos Comunes:*
- Etiquetas/Tags
- Notas adicionales
- Expedientes relacionados (auto)
- Abogados que la representaron
- Fecha de alta en sistema

### Dependencias
- Módulo de expedientes
- Normalización de texto (fuzzy matching)
- Integración con motor de conflictos (Fase 2)

### Criterios de Éxito
- [ ] Cobertura del 100% de partes contrarias en expedientes
- [ ] Tasa de duplicados < 5%
- [ ] Búsqueda funcional con coincidencias parciales

---

## FASE 4: Sistema de Validación de Casos Incompatibles

### Problema: 6.3.4 - Riesgo de aceptar casos incompatibles
**Riesgo:** Responsabilidad civil, sanciones  
**Impacto Financiero:** Alto

### Solución Técnica

#### Página a Crear: `AnalisisConflictos.tsx`

**Ubicación:** `src/pages/AnalisisConflictos.tsx`

**Funcionalidades principales:**
1. **Workflow de aprobación** para nuevos expedientes
2. **Checklist de validación** obligatoria antes de aceptar caso
3. **Bloqueo preventivo** de expedientes conflictivos
4. **Escalado automático** a socios para aprobación
5. **Histórico de decisiones** con justificación
6. **Reporte de cumplimiento** para auditorías

**Estructura del componente:**

```typescript
// Tipos necesarios (src/types/conflictos.ts)
interface ValidacionExpediente {
  id: string;
  expedienteId: string;
  estadoValidacion: 'pendiente' | 'en_proceso' | 'aprobado' | 'rechazado' | 'escalado';
  fechaSolicitud: Date;
  solicitadoPor: string;
  checklist: ItemChecklist[];
  conflictosDetectados: Conflicto[];
  aprobadoPor?: string;
  fechaAprobacion?: Date;
  justificacionDecision?: string;
  documentacionAdicional?: string[];
  nivelRiesgo: 'bajo' | 'medio' | 'alto' | 'critico';
  requiereAprobacionSocio: boolean;
}

interface ItemChecklist {
  id: string;
  categoria: 'cliente' | 'parte_contraria' | 'abogado' | 'materia' | 'otro';
  descripcion: string;
  requerido: boolean;
  completado: boolean;
  verificadoPor?: string;
  fechaVerificacion?: Date;
  notas?: string;
}

interface DecisionValidacion {
  id: string;
  validacionId: string;
  tipoDecision: 'aprobacion' | 'rechazo' | 'escalado' | 'condicional';
  tomadaPor: string;
  fechaDecision: Date;
  justificacion: string;
  condiciones?: string[];
  aprobadaPorSocio?: boolean;
}
```

#### Actualización de Páginas Existentes

**1. Expedientes.tsx** - Flujo de aprobación:
```typescript
// Al intentar cambiar estado a "activo":
const handleActivarExpediente = async (expId) => {
  const validacion = await obtenerValidacion(expId);
  if (validacion.estado !== 'aprobado') {
    mostrarModalValidacion(expId);
    return;
  }
  activarExpediente(expId);
};
```

**2. NuevoExpedienteModal** - Validación obligatoria:
```typescript
// Bloquear creación sin validación:
const puedeCrear = validacionCompletada && conflictosRevisados;
<button disabled={!puedeCrear}>
  Crear Expediente
</button>
```

**3. Dashboard.tsx** - Widget de validaciones pendientes:
```typescript
// Añadir:
<ValidacionesPendientesWidget />
```

### Roles y Permisos

| Rol | Permisos | Acceso |
|-----|----------|--------|
| **socio** | Aprobar/Rechazar - Decisión final | Página completa + Aprobaciones |
| **abogado_senior** | Ejecutar validación - Puede escalar | Página completa |
| **abogado_junior** | Ver validaciones - Solo propias | Vista limitada |
| **paralegal** | View - Información básica | Solo consulta |

### Campos del Módulo

**Checklist de Validación:**
- [ ] Verificar base de datos partes contrarias
- [ ] Revisar conflictos con clientes actuales
- [ ] Validar disponibilidad de abogado
- [ ] Confirmar competencia en materia
- [ ] Revisar honorarios y forma de pago
- [ ] Verificar documentación del cliente
- [ ] Analizar viabilidad del caso
- [ ] Confirmar no hay inhabilitación del cliente

**Proceso de Validación:**
- Fecha de solicitud
- Solicitante
- Resultado del análisis automático
- Nivel de riesgo identificado
- Requiere aprobación de socio (si/no)
- Aprobado por
- Fecha de decisión
- Justificación documentada
- Condiciones especiales (si aplica)

### Dependencias
- Motor de detección de conflictos (Fase 2)
- Base de datos de partes contrarias (Fase 3)
- Módulo de aprobaciones/notificaciones

### Criterios de Éxito
- [ ] 100% de expedientes validados antes de aceptar
- [ ] Tiempo promedio de validación < 24h
- [ ] Documentación del 100% de decisiones

---

## FASE 5: Documentación de Análisis de Conflictos

### Problema: 6.3.5 - Documentación insuficiente de análisis de conflictos
**Riesgo:** Falta de prueba de debida diligencia  
**Impacto Financiero:** Medio

### Solución Técnica

#### Página a Actualizar: `Conflictos.tsx` + Nuevos Componentes

**Funcionalidades principales:**
1. **Generación automática** de informes de análisis
2. **Plantillas de documentación** estandarizadas
3. **Registro de timestamps** de todas las acciones
4. **Versionado de análisis** (histórico completo)
5. **Firma digital** de responsables
6. **Exportación a PDF** para archivo físico
7. **Auditoría completa** (quién, qué, cuándo)

**Estructura del componente:**

```typescript
// Tipos necesarios (src/types/conflictos.ts)
interface DocumentacionAnalisis {
  id: string;
  analisisId: string;
  tipoDocumento: 'informe_completo' | 'resumen_ejecutivo' | 'checklist' | 'justificacion' | 'decision';
  contenido: string;
  generadoPor: string;
  fechaGeneracion: Date;
  version: number;
  firmadoPor?: string[];
  fechaFirma?: Date;
  hashVerificacion: string; // Para integridad
}

interface RegistroAuditoria {
  id: string;
  entidadTipo: 'conflicto' | 'analisis' | 'validacion' | 'parte_contraria';
  entidadId: string;
  accion: 'creacion' | 'modificacion' | 'eliminacion' | 'consulta' | 'aprobacion' | 'rechazo';
  usuarioId: string;
  usuarioNombre: string;
  rol: string;
  fechaAccion: Date;
  camposModificados?: string[];
  valoresAnteriores?: Record<string, any>;
  valoresNuevos?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

interface InformeAnalisis {
  id: string;
  expedienteId: string;
  fechaAnalisis: Date;
  responsableAnalisis: string;
  metodologiaUtilizada: string;
  basesDatosConsultadas: string[];
  conflictosIdentificados: Conflicto[];
  conflictosDescartados: ConflictoDescartado[];
  conclusiones: string;
  recomendaciones: string;
  decisionFinal: 'aceptar' | 'rechazar' | 'condicional';
  documentosAdjuntos: string[];
  aprobadoPor?: string;
  fechaAprobacion?: Date;
}

interface ConflictoDescartado {
  id: string;
  descripcion: string;
  razonDescarte: string;
  descartadoPor: string;
  fechaDescarte: Date;
}
```

#### Actualización de Páginas Existentes

**1. Conflictos.tsx** - Añadir sección de documentación:
```typescript
// Nueva sección en la página:
<DocumentacionSection>
  <GenerarInformeButton />
  <HistorialVersiones />
  <AuditoriaLog />
</DocumentacionSection>
```

**2. ExpedienteDetail.tsx** - Pestaña de conflictos documentados:
```typescript
// Añadir pestaña:
<Tab label="Análisis de Conflictos">
  <DocumentacionConflictos expedienteId={id} />
</Tab>
```

**3. SignatureManagement.tsx** - Integración con firmas:
```typescript
// Añadir tipo de documento:
tipoDocumento: 'informe_conflicto' | 'justificacion_conflicto'
```

### Roles y Permisos

| Rol | Permisos | Acceso |
|-----|----------|--------|
| **socio** | Full - Ver todo + Firmar | Acceso total |
| **abogado_senior** | Create/View - Crear informes | Crear y ver |
| **abogado_junior** | View - Solo lectura | Ver informes |
| **administrador** | View - Auditoría | Logs de auditoría |
| **paralegal** | View - Básico | Informes resumidos |

### Campos del Módulo

**Informe de Análisis:**
- Identificador único
- Expediente relacionado
- Fecha y hora del análisis
- Responsable que realizó el análisis
- Metodología utilizada
- Bases de datos consultadas
- Conflictos identificados (detalle)
- Conflictos descartados y por qué
- Conclusiones del análisis
- Recomendaciones
- Decisión final fundamentada
- Documentos de soporte adjuntos
- Firmas de responsables
- Timestamp de cada acción

**Registro de Auditoría:**
- Tipo de entidad modificada
- ID de la entidad
- Tipo de acción
- Usuario que realizó la acción
- Rol del usuario
- Fecha y hora exacta
- Campos modificados
- Valores anteriores y nuevos
- IP y dispositivo (opcional)

### Dependencias
- Módulo de firmas electrónicas (SignatureManagement.tsx)
- Motor de conflictos (Fase 2)
- Sistema de plantillas

### Criterios de Éxito
- [ ] 100% de análisis documentados
- [ ] Registro completo de auditoría
- [ ] Exportación a PDF funcional
- [ ] Integridad verificable (hash)

---

## Dependencias entre Fases

```
FASE 1: Prescripciones
    ↓ (independiente, puede ir primero)

FASE 3: Base de Datos Partes Contrarias
    ↓ (requerido para)

FASE 2: Motor de Conflictos
    ↓ (requerido para)

FASE 4: Validación de Casos
    ↓ (requerido para)

FASE 5: Documentación
```

**Orden recomendado de implementación:**
1. Fase 1 (Prescripciones) - Independiente, alta prioridad
2. Fase 3 (Base de Datos) - Base para las siguientes
3. Fase 2 (Motor de Conflictos) - Dependiente de Fase 3
4. Fase 4 (Validación) - Dependiente de Fases 2 y 3
5. Fase 5 (Documentación) - Dependiente de todas las anteriores

---

## Actualizaciones Comunes a Todas las Fases

### 1. Tipos TypeScript (`src/types/`)

Crear archivos:
- `src/types/prescripciones.ts`
- `src/types/conflictos.ts`

### 2. Datos de Ejemplo (`src/data/`)

Crear archivos:
- `src/data/prescripcionesData.ts`
- `src/data/conflictosData.ts`
- `src/data/partesContrariasData.ts`

### 3. Hooks Personalizados (`src/hooks/`)

Crear hooks:
- `usePrescripciones.ts` - Gestión de prescripciones
- `useConflictos.ts` - Detección y validación
- `usePartesContrarias.ts` - CRUD partes

### 4. Router (`src/App.tsx`)

Añadir rutas:
```typescript
import Prescripciones from './pages/Prescripciones'
import Conflictos from './pages/Conflictos'
import ConflictosPartesContrarias from './pages/ConflictosPartesContrarias'
import AnalisisConflictos from './pages/AnalisisConflictos'

// En Routes:
<Route path="/prescripciones" element={<Prescripciones />} />
<Route path="/conflictos" element={<Conflictos />} />
<Route path="/conflictos/partes" element={<ConflictosPartesContrarias />} />
<Route path="/conflictos/analisis" element={<AnalisisConflictos />} />
```

### 5. Sidebar (`src/components/layout/Sidebar.tsx`)

Añadir menús:
```typescript
{
  label: 'Prescripciones',
  icon: Clock,
  path: '/prescripciones',
  roles: ['socio', 'abogado_senior', 'abogado_junior', 'paralegal']
},
{
  label: 'Conflictos',
  icon: ShieldAlert,
  path: '/conflictos',
  roles: ['socio', 'abogado_senior', 'abogado_junior', 'paralegal', 'secretario']
},
{
  label: 'Partes Contrarias',
  icon: Users,
  path: '/conflictos/partes',
  roles: ['socio', 'abogado_senior', 'abogado_junior', 'paralegal']
}
```

---

## Resumen de Permisos por Rol

| Funcionalidad | socio | abogado_senior | abogado_junior | paralegal | secretario | administrador |
|---------------|-------|----------------|----------------|-----------|------------|---------------|
| **Prescripciones** | Full | Supervised | Own | View | View | View |
| **Motor Conflictos** | Full | Full | View | View | - | View |
| **Partes Contrarias** | Full | Full | View | Create/View | View | - |
| **Validación Casos** | Aprobar | Ejecutar | View | - | - | - |
| **Documentación** | Firmar | Create | View | View | - | Auditoría |

**Leyenda:**
- **Full**: Crear, leer, actualizar, eliminar
- **Supervised**: Propios + supervisados
- **Own**: Solo propios
- **Create/View**: Crear y ver (no editar ni eliminar)
- **View**: Solo lectura
- **-**: Sin acceso

---

## Métricas de Éxito Globales

- **Reducción de prescripciones perdidas:** 100% (objetivo: 0 casos/año)
- **Tasa de detección de conflictos:** > 95%
- **Cobertura de base de datos partes:** 100%
- **Expedientes validados antes de aceptar:** 100%
- **Análisis documentados:** 100%
- **Tiempo de validación promedio:** < 24 horas
- **Satisfacción de usuarios:** > 8/10

---

## Próximos Pasos

1. **Priorizar Fase 1** (Prescripciones) por impacto financiero más alto
2. **Revisar con stakeholders** cada fase antes de implementación
3. **Definir sprint planning** para cada fase
4. **Preparar datos de prueba** para validación
5. **Capacitar usuarios** antes del lanzamiento de cada fase

---

*Documento creado: Febrero 2026*  
*Versión: 1.0*  
*Estado: Planificación*
