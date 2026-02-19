# Estructura de Páginas del ERP - Bufete de Abogados

## Resumen Total: 29 páginas

---

## Propuesta de Agrupación

### 1. Autenticación (3 páginas)
| Página | Ruta | Descripción |
|--------|------|-------------|
| LandingPage | `/` | Página de inicio/promoción |
| Login | `/login` | Inicio de sesión |
| Register | `/register` | Registro de usuarios |

### 2. Gestión Principal (4 páginas)
| Página | Ruta | Descripción |
|--------|------|-------------|
| Dashboard | `/dashboard` | Panel principal según rol |
| Admin | `/admin` | Administración del sistema |
| Tiempo | `/tiempo` | Control de tiempo/horas |
| Bitacora | `/bitacora` | Registro de actividades |

### 3. Expedientes Legales (4 páginas)
| Página | Ruta | Descripción |
|--------|------|-------------|
| Expedientes | `/expedientes` | Lista de expedientes |
| ExpedienteDetail | `/expedientes/:id` | Detalle de expediente |
| Audiencias | `/audiencias` | Gestión de audiencias |
| Prescripciones | `/prescripciones` | Control de prescripciones |

### 4. Conflictos e Interés (3 páginas)
| Página | Ruta | Descripción |
|--------|------|-------------|
| Conflictos | `/conflictos` | Gestión de conflictos |
| ConflictosPartesContrarias | `/conflictos/partes` | Partes contrarias |
| AnalisisConflictos | `/conflictos/analisis` | Análisis de conflictos |

### 5. Clientes (2 páginas)
| Página | Ruta | Descripción |
|--------|------|-------------|
| Clientes | `/clientes` | Lista de clientes |
| ClienteDetail | `/clientes/:id` | Detalle del cliente |

### 6. Financiera (4 páginas)
| Página | Ruta | Descripción |
|--------|------|-------------|
| Facturación | `/facturacion` | Facturación y cobros |
| Cobranza | `/cobranza` | Gestión de cobranza |
| Contabilidad | `/contabilidad` | Contabilidad general |
| Gastos | `/gastos` | Registro de gastos |

### 7. Agenda y Tareas (2 páginas)
| Página | Ruta | Descripción |
|--------|------|-------------|
| Calendario | `/calendario` | Calendario de eventos |
| Tareas | `/tareas` | Gestión de tareas |

### 8. Comunicación (3 páginas)
| Página | Ruta | Descripción |
|--------|------|-------------|
| Mensajes | `/mensajes` | Sistema de mensajería |
| Notificaciones | `/notificaciones` | Centro de notificaciones |
| PortalCliente | `/portal-cliente` | Portal para clientes |

### 9. Documentos y Recursos (3 páginas)
| Página | Ruta | Descripción |
|--------|------|-------------|
| Biblioteca | `/biblioteca` | Biblioteca legal |
| Plantillas | `/plantillas` | Plantillas de documentos |
| Firmas | `/firmas` | Gestión de firmas digitales |

### 10. Informes y Análisis (1 página)
| Página | Ruta | Descripción |
|--------|------|-------------|
| Informes | `/informes` | Reportes y estadísticas |

### 11. Configuración (1 página)
| Página | Ruta | Descripción |
|--------|------|-------------|
| Proveedores | `/proveedores` | Gestión de proveedores |

---

## Vistas Actuales en Sidebar

La sidebar actual muestra 14 elementos principales:
1. Dashboard
2. Expedientes
3. Calendario
4. Clientes
5. Informes
6. Mensajes
7. Facturación
8. Biblioteca
9. Tareas
10. Portal Cliente
11. Audiencias
12. Cobranza
13. Gastos
14. Plantillas
15. Notificaciones
16. Bitácora
17. Proveedores

**Páginas NO visibles en sidebar actual:**
- Contabilidad (`/contabilidad`)
- Admin (`/admin`)
- Tiempo (`/tiempo`)
- Firmas (`/firmas`)
- Prescripciones (`/prescripciones`)
- Conflictos (`/conflictos`, `/conflictos/partes`, `/conflictos/analisis`)

---

## Sugerencia de Reorganización

Considera usar **submenús** en la sidebar para reducir la lista visible:

```
├── Principal
│   ├── Dashboard
│   ├── Admin
│   └── Bitácora
├── Expedientes
│   ├── Expedientes
│   ├── Expediente Detail
│   ├── Audiencias
│   └── Prescripciones
├── Conflictos
│   ├── Conflictos
│   ├── Partes Contrarias
│   └── Análisis
├── Clientes
│   ├── Clientes
│   └── Cliente Detail
├── Financiera
│   ├── Facturación
│   ├── Cobranza
│   ├── Contabilidad
│   └── Gastos
├── Agenda
│   ├── Calendario
│   ├── Tareas
│   └── Tiempo
├── Comunicación
│   ├── Mensajes
│   ├── Notificaciones
│   └── Portal Cliente
├── Documentos
│   ├── Biblioteca
│   ├── Plantillas
│   └── Firmas
├── Informes
│   └── Informes
└── Configuración
    └── Proveedores
```
