# Nuevas Funcionalidades - ERP Bufete de Abogados

> 📋 **Propuesta de Implementación** - Comprimir Archivos y Biblioteca Legal BOE

---

## 🎯 Funcionalidades Solicitadas

### 1. Comprimir Archivos desde la Plataforma
Los abogados necesitan comprimir documentos y expedientes para facilitar el envío, almacenamiento y descarga de múltiples archivos.

### 2. Biblioteca Legal con Acceso al BOE
Acceso rápido y estructurado a:
- **BOE (Boletín Oficial del Estado)**
- **Constitución Española**
- **Códigos Legales** (Civil, Penal, Procesal, Laboral, Mercantil, etc.)
- **Leyes Vigentes**
- **Jurisprudencia actualizada**
- **Consulta rápida y búsqueda avanzada**

---

## 📊 Análisis de Implementación

### FUNCIONALIDAD 1: Comprimir Archivos

#### ✅ **Recomendación: Funcionalidad Transversal (No requiere página nueva)**

Esta funcionalidad debe implementarse como una **utilidad del sistema** disponible en múltiples módulos que manejan documentos.

#### Dónde Implementar

**Integración en páginas existentes:**

1. **Expedientes** (Prioridad Alta)
   - Comprimir todos los documentos de un expediente
   - Comprimir documentos seleccionados
   - Generar ZIP con toda la documentación del caso

2. **Biblioteca** (Prioridad Media)
   - Descargar múltiples plantillas comprimidas
   - Comprimir colecciones de documentos legales

3. **Portal del Cliente** (Prioridad Alta)
   - Clientes pueden descargar todos sus documentos en ZIP
   - Facilitar envío de múltiples archivos

4. **Documentos/Adjuntos** (Prioridad Alta)
   - En cualquier sección donde se suban archivos múltiples

5. **Informes** (Prioridad Media)
   - Exportar múltiples reportes comprimidos

#### Casos de Uso

| Caso de Uso | Descripción | Roles que lo necesitan |
|-------------|-------------|------------------------|
| **Comprimir expediente completo** | Empaquetar todos los documentos de un caso en un ZIP | Abogados, Socios |
| **Comprimir documentos seleccionados** | Usuario selecciona archivos específicos para comprimir | Todos los roles operativos |
| **Descarga masiva de plantillas** | Descargar múltiples plantillas de una vez | Abogados, Paralegales, Secretarios |
| **Envío a cliente** | Preparar paquete de documentos para enviar al cliente | Abogados, Administrador |
| **Backup de documentos** | Exportar documentos importantes comprimidos | Super Admin, Socios |
| **Adjuntar múltiples archivos** | Enviar varios documentos en un solo ZIP por mensaje | Todos |

#### Roles y Permisos

| Rol | Puede Comprimir | Alcance |
|-----|-----------------|---------|
| **Super Admin** | ✅ | Todo el sistema |
| **Socio / Director** | ✅ | Todos los expedientes y documentos |
| **Abogado Senior** | ✅ | Sus expedientes y documentos de equipo |
| **Abogado Junior** | ✅ | Sus expedientes asignados |
| **Paralegal** | ✅ | Documentos de casos en los que colabora |
| **Secretario/a** | ✅ | Documentos administrativos y archivo |
| **Administrador** | ✅ | Documentos administrativos y financieros |
| **Contador** | ✅ | Documentos financieros y contables |
| **Recepcionista** | ⚠️ Limitado | Solo documentos públicos/generales |
| **Cliente (Portal)** | ✅ | Solo sus propios documentos |

#### Funcionalidades Técnicas

**Opciones de compresión:**
- ✅ Comprimir archivos seleccionados
- ✅ Comprimir carpeta/expediente completo
- ✅ Comprimir con contraseña (para información sensible)
- ✅ Elegir formato (ZIP, RAR, 7Z)
- ✅ Comprimir y enviar por email
- ✅ Generar enlace de descarga temporal
- ✅ Previsualizar contenido antes de comprimir
- ✅ Establecer nombre personalizado del archivo
- ✅ Incluir/excluir tipos de archivos específicos

**Interfaz de Usuario:**
- Botón "Comprimir" en listados de documentos
- Checkbox para selección múltiple
- Modal de opciones de compresión
- Barra de progreso para archivos grandes
- Notificación cuando está listo
- Opción de descarga directa o envío por email

#### Implementación Técnica Sugerida

**Frontend:**
```typescript
// Componente CompressFiles
interface CompressOptions {
  files: File[];
  format: 'zip' | 'rar' | '7z';
  password?: string;
  filename: string;
  sendEmail?: boolean;
  recipientEmail?: string;
}

// Hook personalizado
const useFileCompression = () => {
  const compressFiles = async (options: CompressOptions) => {
    // Lógica de compresión
  };
  return { compressFiles, isCompressing, progress };
};
```

**Backend:**
- Librería de compresión: `archiver` (Node.js) o similar
- Límite de tamaño: configurable (ej. 500MB)
- Queue para procesar compresiones grandes
- Almacenamiento temporal de ZIPs generados
- Cleanup automático después de 24h

---

### FUNCIONALIDAD 2: Biblioteca Legal BOE

#### ✅ **Recomendación: Ampliar página existente "Biblioteca"**

La página de **Biblioteca** actual ya existe y maneja documentos legales. Debemos expandirla con una sección especializada para consultas legales oficiales.

#### Estructura Propuesta

**Nueva estructura de la página Biblioteca:**

```
Biblioteca (Página Expandida)
├── 📚 Biblioteca Interna (Existente)
│   ├── Plantillas de Documentos
│   ├── Formatos Procesales
│   ├── Contratos Modelo
│   ├── Precedentes del Bufete
│   └── Guías y Procedimientos
│
└── ⚖️ Biblioteca Legal Oficial (NUEVA)
    ├── 🔍 Búsqueda Rápida Legal
    ├── 📜 Constitución Española
    ├── 📖 Códigos Legales
    ├── 📰 BOE (Boletín Oficial del Estado)
    ├── ⚖️ Jurisprudencia (CENDOJ)
    ├── 🇪🇺 Legislación Europea (EUR-Lex)
    └── ⭐ Favoritos y Marcadores
```

#### Secciones Detalladas

##### 1. 🔍 **Búsqueda Rápida Legal**

**Funcionalidades:**
- Buscador unificado en todas las fuentes legales
- Filtros por:
  - Tipo de norma (Ley, Real Decreto, Orden, etc.)
  - Fecha de publicación
  - Ámbito (Estatal, Autonómico, Local)
  - Materia (Civil, Penal, Laboral, etc.)
  - Vigencia (Vigente, Derogada, Modificada)
- Búsqueda por artículo específico
- Búsqueda por palabra clave
- Búsqueda avanzada con operadores booleanos
- Historial de búsquedas
- Sugerencias inteligentes

**Ejemplo de interfaz:**
```
┌─────────────────────────────────────────────────────┐
│ 🔍 Búsqueda Rápida Legal                            │
├─────────────────────────────────────────────────────┤
│ [Buscar leyes, códigos, BOE, jurisprudencia...    ]│
│                                                      │
│ Filtros:                                            │
│ ☐ Constitución  ☐ Códigos  ☑ BOE  ☐ Jurisprudencia│
│ Vigencia: [Vigente ▼]  Materia: [Civil ▼]         │
│                                       [🔍 Buscar]   │
└─────────────────────────────────────────────────────┘
```

##### 2. 📜 **Constitución Española**

**Contenido:**
- Texto completo actualizado
- Navegación por:
  - Título Preliminar
  - Títulos (I-X)
  - Capítulos y Secciones
  - Artículos específicos
- Notas de reforma
- Versiones históricas
- Comentarios y concordancias
- Enlaces a jurisprudencia del Tribunal Constitucional

**Funcionalidades:**
- Vista de artículo individual o completa
- Copiar texto legal
- Citar correctamente (formato APA, Chicago, etc.)
- Exportar a PDF
- Agregar notas personales
- Marcar favoritos
- Compartir con el equipo

##### 3. 📖 **Códigos Legales**

**Códigos disponibles:**

| Código | Descripción | Prioridad |
|--------|-------------|-----------|
| **Código Civil** | Completo y actualizado | Alta |
| **Código Penal** | Con reformas vigentes | Alta |
| **LEC** | Ley de Enjuiciamiento Civil | Alta |
| **LECrim** | Ley de Enjuiciamiento Criminal | Alta |
| **Código de Comercio** | Legislación mercantil | Media |
| **Estatuto de los Trabajadores** | Derecho laboral | Alta |
| **LGT** | Ley General Tributaria | Media |
| **LOPD / RGPD** | Protección de datos | Alta |
| **LAU** | Ley de Arrendamientos Urbanos | Media |
| **Ley Concursal** | Insolvencias | Media |

**Funcionalidades por código:**
- Índice navegable
- Búsqueda dentro del código
- Notas de reforma
- Concordancias con otros códigos
- Jurisprudencia relacionada
- Comparar versiones (antes/después de reforma)
- Exportar secciones
- Modo de lectura (oscuro/claro)
- Resaltar texto

##### 4. 📰 **BOE (Boletín Oficial del Estado)**

**Integración con BOE oficial:**

**Opciones de acceso:**

**Opción A: API Oficial BOE**
- Consumir API de BOE.es
- Consultas en tiempo real
- Siempre actualizado
- Descargas directas de PDFs oficiales

**Opción B: Base de datos propia con sync**
- Sincronización diaria con BOE
- Búsqueda más rápida
- Indexación personalizada
- Acceso offline

**Funcionalidades:**
- Consultar BOE por fecha
- Buscar disposiciones por tipo:
  - Leyes Orgánicas
  - Leyes Ordinarias
  - Reales Decretos
  - Órdenes Ministeriales
  - Resoluciones
- Filtrar por ministerio/organismo
- Alertas automáticas:
  - Nueva legislación en materias de interés
  - Modificaciones de leyes seguidas
  - Notificaciones personalizadas
- Descargar PDF oficial
- Ver sumario del día
- Acceso a boletines autonómicos (BOJA, DOGC, BOC, etc.)

**Ejemplo de interfaz:**
```
┌──────────────────────────────────────────────────────┐
│ 📰 Boletín Oficial del Estado                        │
├──────────────────────────────────────────────────────┤
│ 📅 BOE de hoy: 14/02/2026                            │
│ [Ver sumario completo]  [Buscar en BOE histórico]   │
│                                                       │
│ 🔔 Alertas Configuradas (3):                         │
│ • Nueva legislación en Derecho Laboral              │
│ • Cambios en Código Penal                           │
│ • Órdenes del Ministerio de Justicia                │
│                                           [Gestionar]│
│                                                       │
│ 📋 Recientes:                                        │
│ • Real Decreto 123/2026 - Reforma procesal...       │
│ • Ley Orgánica 2/2026 - Modificación CP...          │
└──────────────────────────────────────────────────────┘
```

##### 5. ⚖️ **Jurisprudencia (CENDOJ)**

**Integración con CENDOJ (Centro de Documentación Judicial):**

**Fuentes:**
- Tribunal Supremo
- Audiencia Nacional
- Tribunales Superiores de Justicia
- Audiencias Provinciales
- Tribunal Constitucional

**Funcionalidades:**
- Búsqueda por:
  - Número de resolución
  - Fecha
  - Ponente
  - Materia
  - Palabras clave en el texto
- Filtros avanzados:
  - Tipo de resolución (Sentencia, Auto)
  - Sala
  - Sección
  - Procedimiento
- Lectura de sentencias completas
- Extracto de doctrina legal
- Votos particulares
- Guardar en biblioteca personal
- Vincular con expedientes del bufete

##### 6. 🇪🇺 **Legislación Europea (EUR-Lex)**

**Opcional - Acceso a normativa europea:**
- Reglamentos UE
- Directivas
- Tratados
- Jurisprudencia TJUE
- Búsqueda en español

##### 7. ⭐ **Favoritos y Marcadores**

**Funcionalidades:**
- Guardar artículos frecuentes
- Organizar por carpetas/etiquetas
- Compartir con el equipo
- Notas personales en artículos
- Historial de consultas
- Sincronización entre dispositivos

---

#### Roles y Permisos - Biblioteca Legal BOE

| Rol | Acceso a Biblioteca Legal | Puede hacer |
|-----|---------------------------|-------------|
| **Super Admin** | ✅ Completo + Configuración | • Acceso total<br>• Configurar alertas del sistema<br>• Administrar fuentes<br>• Gestionar API keys<br>• Ver estadísticas de uso |
| **Socio / Director** | ✅ Completo | • Consultar todas las fuentes<br>• Configurar alertas personales<br>• Compartir con equipo<br>• Guardar favoritos<br>• Exportar documentos |
| **Abogado Senior** | ✅ Completo | • Consultar todas las fuentes<br>• Búsqueda avanzada<br>• Guardar favoritos<br>• Compartir con equipo<br>• Alertas personales<br>• Vincular con expedientes |
| **Abogado Junior** | ✅ Completo | • Consultar todas las fuentes<br>• Búsqueda básica y avanzada<br>• Guardar favoritos<br>• Exportar documentos<br>• Ver compartidos por seniors |
| **Paralegal** | ✅ Consulta | • Consultar fuentes<br>• Búsqueda básica<br>• Guardar favoritos personales<br>• Exportar documentos<br>• Copiar citas legales |
| **Secretario/a** | ✅ Limitado | • Consultar códigos básicos<br>• Buscar BOE<br>• Consultar plantillas legales<br>• Exportar formatos |
| **Administrador** | ✅ Consulta | • Acceso a legislación administrativa<br>• BOE relacionado con gestión<br>• Normativa laboral y fiscal |
| **Contador** | ✅ Especializado | • Acceso a legislación fiscal<br>• Normativa contable<br>• BOE tributario<br>• Alertas fiscales |
| **Recepcionista** | ❌ Sin acceso | N/A |
| **Cliente (Portal)** | ❌ Sin acceso | N/A (información profesional) |

#### Qué puede hacer cada rol

**Super Admin:**
```
✅ Configurar integración con API de BOE
✅ Administrar fuentes de datos legales
✅ Configurar alertas automáticas del sistema
✅ Ver estadísticas de consultas
✅ Gestionar caché de documentos
✅ Exportar reportes de uso
✅ Configurar límites de consultas (si aplica API de pago)
```

**Socios / Directores:**
```
✅ Consulta ilimitada a todas las fuentes
✅ Configurar alertas personalizadas por materias
✅ Crear colecciones temáticas
✅ Compartir recursos con todo el equipo
✅ Acceso prioritario a nuevas funcionalidades
✅ Exportar documentos sin límite
```

**Abogados (Senior/Junior):**
```
✅ Búsqueda en todas las fuentes legales
✅ Guardar favoritos ilimitados
✅ Crear carpetas temáticas personales
✅ Vincular jurisprudencia/leyes a sus expedientes
✅ Configurar alertas en sus áreas de práctica
✅ Compartir hallazgos con el equipo
✅ Exportar a PDF/Word
✅ Copiar con formato de cita legal
✅ Historial de búsquedas (últimos 90 días)
```

**Paralegales:**
```
✅ Consultar códigos y leyes
✅ Buscar en BOE
✅ Consultar jurisprudencia básica
✅ Guardar favoritos personales
✅ Exportar documentos (límite diario: 50)
✅ Copiar citas legales
✅ Ver compartidos por sus abogados
```

**Secretarios:**
```
✅ Consultar códigos principales
✅ Buscar en BOE por fecha/tipo
✅ Acceso a formatos procesales
✅ Descargar plantillas oficiales
✅ Exportar formatos (límite: 20/día)
```

**Administradores:**
```
✅ Acceso a legislación administrativa
✅ BOE relacionado con RR.HH., contratos, etc.
✅ Normativa laboral actualizada
✅ Alertas de cambios normativos administrativos
```

**Contadores:**
```
✅ Acceso especializado a legislación fiscal
✅ Normativa contable vigente
✅ BOE de temas tributarios
✅ Alertas de cambios fiscales
✅ Consulta de doctrina de AEAT
```

---

#### Implementación Técnica

##### Frontend

**Componentes principales:**
```
BibliotecaLegal/
├── SearchBar.tsx          # Buscador unificado
├── Filters.tsx            # Filtros avanzados
├── ResultsList.tsx        # Lista de resultados
├── DocumentViewer.tsx     # Visor de documentos
├── Favorites.tsx          # Gestión de favoritos
├── Alerts.tsx             # Configuración de alertas
└── Sections/
    ├── Constitucion.tsx
    ├── Codigos.tsx
    ├── BOE.tsx
    ├── Jurisprudencia.tsx
    └── Europa.tsx
```

**Tecnologías:**
```
- React + TypeScript
- TailwindCSS (estilos)
- React Query (caché de consultas)
- PDF.js (visor de PDFs del BOE)
- Lunr.js o Fuse.js (búsqueda local)
- React Virtuoso (listas largas optimizadas)
```

##### Backend / APIs

**Opción 1: Integración directa con APIs oficiales**

| Fuente | API | Documentación |
|--------|-----|---------------|
| **BOE** | API REST oficial | https://boe.es/datosabiertos/ |
| **CENDOJ** | Web scraping + API (si disponible) | https://cendoj.es |
| **EUR-Lex** | API REST | https://eur-lex.europa.eu/api |

**Ventajas:**
- Siempre actualizado
- Sin mantenimiento de contenido
- Datos oficiales

**Desventajas:**
- Depende de disponibilidad externa
- Puede tener límites de consultas
- Requiere conexión a internet

**Opción 2: Base de datos propia + Sincronización**

```
- Base de datos PostgreSQL con índices full-text
- Sync diario con fuentes oficiales
- Búsqueda más rápida
- Acceso offline
- Sin límites de consultas
```

**Ventajas:**
- Rendimiento superior
- Sin dependencias externas
- Búsqueda personalizada
- Acceso offline

**Desventajas:**
- Requiere espacio de almacenamiento
- Necesita mantenimiento
- Actualización no inmediata

**Opción 3: Híbrida (Recomendada)**

```
- Caché local de documentos frecuentes
- Búsqueda en caché primero
- Fallback a API oficial si no está en caché
- Actualización automática nocturna
- Best of both worlds
```

##### Base de Datos

**Tablas necesarias:**

```sql
-- Documentos legales cacheados
CREATE TABLE legal_documents (
  id UUID PRIMARY KEY,
  type VARCHAR(50), -- 'constitucion', 'codigo', 'boe', 'jurisprudencia'
  title TEXT,
  content TEXT,
  metadata JSONB,
  source_url TEXT,
  publication_date DATE,
  vigency_status VARCHAR(20), -- 'vigente', 'derogada', 'modificada'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Favoritos de usuarios
CREATE TABLE user_legal_favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  document_id UUID REFERENCES legal_documents(id),
  folder VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP
);

-- Alertas configuradas
CREATE TABLE legal_alerts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50), -- 'new_legislation', 'jurisprudence', 'boe'
  keywords TEXT[],
  materia VARCHAR(100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP
);

-- Historial de búsquedas
CREATE TABLE legal_search_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  query TEXT,
  filters JSONB,
  results_count INTEGER,
  searched_at TIMESTAMP
);

-- Vínculos entre expedientes y documentos legales
CREATE TABLE case_legal_references (
  id UUID PRIMARY KEY,
  case_id UUID REFERENCES cases(id),
  document_id UUID REFERENCES legal_documents(id),
  relevance TEXT,
  added_by UUID REFERENCES users(id),
  created_at TIMESTAMP
);
```

##### APIs Endpoints

```typescript
// GET - Buscar en todas las fuentes
GET /api/legal/search?q=term&type=boe&filters={...}

// GET - Obtener documento específico
GET /api/legal/documents/:id

// GET - BOE del día
GET /api/legal/boe/today

// GET - Artículo de código
GET /api/legal/codes/:code/article/:number

// POST - Guardar favorito
POST /api/legal/favorites
{
  documentId: uuid,
  folder: string,
  notes: string
}

// GET - Obtener favoritos del usuario
GET /api/legal/favorites

// POST - Configurar alerta
POST /api/legal/alerts
{
  type: string,
  keywords: string[],
  materia: string
}

// GET - Jurisprudencia relacionada
GET /api/legal/jurisprudence?article=art123&code=penal

// POST - Vincular doc legal a expediente
POST /api/cases/:id/legal-references
{
  documentId: uuid,
  relevance: string
}
```

---

#### Interfaz de Usuario Propuesta

##### Vista Principal

```
┌────────────────────────────────────────────────────────────────┐
│ ⚖️ Biblioteca Legal                              [Usuario ▼]   │
├────────────────────────────────────────────────────────────────┤
│ 🔍 [Buscar leyes, códigos, BOE, jurisprudencia...          ] │
│    📁 Biblioteca Interna  |  ⚖️ Legislación Oficial         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ⚡ Acceso Rápido                                               │
│ ┌────────────┬────────────┬────────────┬────────────┐         │
│ │ 📜         │ 📖         │ 📰         │ ⚖️         │         │
│ │ Const.     │ Códigos    │ BOE        │ Jurisp.    │         │
│ │ Española   │ Legales    │ Actual     │ CENDOJ     │         │
│ └────────────┴────────────┴────────────┴────────────┘         │
│                                                                 │
│ 🔔 Alertas Activas (5)                     [Configurar]       │
│ • Nueva legislación en Derecho Laboral - Hoy, 09:00           │
│ • BOE: Real Decreto 45/2026... - Ayer                         │
│                                                                 │
│ ⭐ Mis Favoritos Recientes                                     │
│ • Art. 1089 Código Civil - Obligaciones                       │
│ • STS 234/2025 - Responsabilidad civil                        │
│ • Ley 39/2015 - Procedimiento Administrativo                  │
│                                                     [Ver todo]  │
│                                                                 │
│ 📊 Estadísticas de Uso (Socio/Admin)                          │
│ • Consultas del mes: 1,247                                    │
│ • Documento más consultado: Código Penal                      │
└────────────────────────────────────────────────────────────────┘
```

##### Vista de Códigos

```
┌────────────────────────────────────────────────────────────────┐
│ 📖 Códigos Legales                                             │
├────────────────────────────────────────────────────────────────┤
│ 🔍 [Buscar en códigos...]              Código: [Civil    ▼]   │
├──────────────────┬─────────────────────────────────────────────┤
│ Índice           │ Código Civil                                │
│                  │                                             │
│ ▼ Libro I        │ Artículo 1089                               │
│   ▼ Título II    │                                             │
│     • Art. 1088  │ Las obligaciones nacen de la ley, de los   │
│     • Art. 1089 ✓│ contratos y cuasi contratos, y de los      │
│     • Art. 1090  │ actos y omisiones ilícitos o en que        │
│                  │ intervenga cualquier género de culpa o     │
│ ▶ Libro II       │ negligencia.                                │
│ ▶ Libro III      │                                             │
│ ▶ Libro IV       │ [📋 Copiar]  [⭐ Favorito]  [📤 Exportar]  │
│                  │                                             │
│                  │ 📎 Jurisprudencia relacionada (12)          │
│                  │ • STS 456/2024 - Interpretación...         │
│                  │ • SAP Madrid 234/2023...                   │
│                  │                                [Ver todas]  │
└──────────────────┴─────────────────────────────────────────────┘
```

##### Vista de BOE

```
┌────────────────────────────────────────────────────────────────┐
│ 📰 Boletín Oficial del Estado                                 │
├────────────────────────────────────────────────────────────────┤
│ 📅 [14/02/2026 ▼]    Tipo: [Todos ▼]    Ministerio: [Todos ▼]│
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 📋 Sumario del BOE núm. 45 - 14 de febrero de 2026            │
│                                                                 │
│ I. Disposiciones Generales                                     │
│ ───────────────────────────────────────────────────────────    │
│ 🏛️ JEFATURA DEL ESTADO                                        │
│ • Ley Orgánica 2/2026 - Modificación del Código Penal...      │
│   [📄 PDF]  [👁️ Ver]  [⭐ Guardar]                            │
│                                                                 │
│ ⚖️ MINISTERIO DE JUSTICIA                                      │
│ • Real Decreto 123/2026 - Reforma procesal civil...           │
│   [📄 PDF]  [👁️ Ver]  [⭐ Guardar]                            │
│                                                                 │
│ II. Autoridades y Personal                                     │
│ ───────────────────────────────────────────────────────────    │
│ • Resolución 456/2026 - Nombramientos judiciales...           │
│                                                                 │
│ [Cargar más...]                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 📋 Resumen de Recomendaciones

### ✅ **Funcionalidad 1: Comprimir Archivos**

| Aspecto | Recomendación |
|---------|---------------|
| **Ubicación** | Funcionalidad transversal (no página nueva) |
| **Implementar en** | Expedientes, Biblioteca, Portal Cliente, Documentos |
| **Prioridad** | Alta |
| **Roles con acceso** | Todos los operativos (10/10 roles) |
| **Esfuerzo desarrollo** | 2-3 semanas (Frontend + Backend) |
| **Impacto** | Alto - mejora significativa en productividad |

### ✅ **Funcionalidad 2: Biblioteca Legal BOE**

| Aspecto | Recomendación |
|---------|---------------|
| **Ubicación** | Ampliar página "Biblioteca" existente |
| **Nueva sección** | "Biblioteca Legal Oficial" con 6 subsecciones |
| **Prioridad** | Muy Alta |
| **Roles con acceso** | 8/10 roles (excepto Recepcionista y Cliente) |
| **Esfuerzo desarrollo** | 6-8 semanas (Frontend + Backend + Integraciones) |
| **Impacto** | Muy Alto - valor diferencial del ERP |

---

## 🎯 Plan de Implementación

### Fase 1: Comprimir Archivos (Sprint 1-2)
**Semanas 1-3**

- ✅ Implementar utilidad de compresión en backend
- ✅ Crear componente `CompressFiles.tsx`
- ✅ Integrar en página Expedientes
- ✅ Integrar en Portal del Cliente
- ✅ Testing de archivos grandes
- ✅ Documentación de uso

### Fase 2: Biblioteca Legal - Core (Sprint 3-5)
**Semanas 4-8**

- ✅ Diseño de interfaz de Biblioteca Legal
- ✅ Implementar búsqueda unificada
- ✅ Integración con API del BOE
- ✅ Módulo de Constitución Española
- ✅ Módulo de Códigos Legales (top 5)
- ✅ Sistema de favoritos
- ✅ Testing y ajustes

### Fase 3: Biblioteca Legal - Avanzado (Sprint 6-8)
**Semanas 9-12**

- ✅ Integración CENDOJ (Jurisprudencia)
- ✅ Sistema de alertas automáticas
- ✅ Historial de búsquedas
- ✅ Vinculación con expedientes
- ✅ Ampliar códigos (10+ códigos)
- ✅ Optimización de rendimiento
- ✅ Testing completo

### Fase 4: Optimizaciones (Sprint 9)
**Semanas 13-14**

- ✅ Caché de documentos frecuentes
- ✅ Exportación avanzada
- ✅ Estadísticas de uso
- ✅ Mobile responsive
- ✅ Documentación final

---

## 💰 Estimación de Costos

### Desarrollo

| Componente | Horas | Costo estimado |
|------------|-------|----------------|
| **Comprimir archivos** | 80h | €4,000 - €6,000 |
| **Biblioteca Legal - Frontend** | 120h | €6,000 - €9,000 |
| **Biblioteca Legal - Backend** | 100h | €5,000 - €7,500 |
| **Integración APIs BOE/CENDOJ** | 60h | €3,000 - €4,500 |
| **Testing y QA** | 40h | €2,000 - €3,000 |
| **TOTAL** | 400h | **€20,000 - €30,000** |

### Costos Operativos

| Servicio | Costo mensual |
|----------|---------------|
| **API BOE** (si aplica) | Gratis (datos abiertos) |
| **Almacenamiento adicional** | €20-50/mes |
| **CDN para PDFs** | €30-100/mes |
| **TOTAL mensual** | **€50-150/mes** |

---

## 📊 Impacto Esperado

### Beneficios Cuantitativos

- ⏱️ **Ahorro de tiempo:** 30% en búsquedas legales (de 10min a 7min)
- 📦 **Eficiencia en documentos:** 50% menos tiempo en preparar envíos
- 📈 **Productividad:** 2-3 horas/semana ahorradas por abogado
- 💾 **Reducción de almacenamiento:** 40% con compresión

### Beneficios Cualitativos

- ✅ Acceso inmediato a legislación actualizada
- ✅ Menor dependencia de recursos externos
- ✅ Mejor servicio al cliente (entregas más rápidas)
- ✅ Valor diferencial vs competidores
- ✅ Cumplimiento normativo (legislación siempre al día)

---

## 🚀 Próximos Pasos

1. ✅ **Aprobar este documento**
2. ✅ **Priorizar funcionalidades** (¿ambas en paralelo o secuencial?)
3. ✅ **Asignar equipo de desarrollo**
4. ✅ **Definir mockups finales de UI**
5. ✅ **Iniciar Sprint 1** (Comprimir archivos)

---

*Documento creado: 14 de febrero de 2026*
*Versión: 1.0*
*Autor: Equipo de Producto*
