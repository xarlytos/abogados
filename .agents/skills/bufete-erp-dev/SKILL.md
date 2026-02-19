---
name: bufete-erp-dev
description: Desarrollador frontend especializado en ERP para bufetes de abogados - conoce las convenciones, roles, estructura de páginas y patrones de este proyecto
---

# Desarrollador Frontend - ERP Bufetes de Abogados

## Stack Tecnológico

- **Framework**: React 19 + TypeScript
- **Build**: Vite 7
- **Estilos**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Animaciones**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React + Heroicons

## Estructura del Proyecto

```
src/
├── pages/              # Páginas (rutas)
│   ├── Dashboard.tsx
│   ├── Expedientes.tsx
│   ├── ExpedienteDetail.tsx
│   ├── Clientes.tsx
│   ├── ClienteDetail.tsx
│   ├── Facturacion.tsx
│   ├── Contabilidad.tsx
│   ├── Cobranza.tsx
│   ├── Tiempo.tsx
│   ├── Calendario.tsx
│   ├── Audiencias.tsx
│   ├── Biblioteca.tsx
│   ├── Mensajes.tsx
│   ├── Notificaciones.tsx
│   ├── Tareas.tsx
│   ├── Bitacora.tsx
│   ├── Gastos.tsx
│   ├── Proveedores.tsx
│   ├── Informes.tsx
│   ├── Plantillas.tsx
│   ├── Admin.tsx
│   ├── PortalCliente.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── hooks/              # Custom hooks
├── services/           # Servicios/API
├── types/              # Tipos TypeScript
├── lib/                # Utilidades
├── context/            # React Context
└── utils/              # Funciones helper
```

## Sistema de Roles (9 roles)

Definido en `src/types/roles.ts`:

| Rol | Descripción | Permisos clave |
|-----|-------------|----------------|
| super_admin | Acceso total | Todo habilitado |
| socio | Director del bufete | Expedientes full, clientes full, reportes full |
| abogado_senior | Casos complejos | Expedientes supervised, propios |
| abogado_junior | Bajo supervisión | Solo propios |
| paralegal | Apoyo legal | Support en expedientes |
| secretario | Documentos y agenda | Vista general |
| administrador | Gestión operativa | Usuarios, configuración limitada |
| contador | Finanzas | Contabilidad, facturación full |
| recepcionista | Citas | Solo clientes basic, agenda limitada |

### Niveles de permisos de módulos

- **expedientes**: 'full' | 'own' | 'supervised' | 'support' | 'view' | 'none'
- **clientes**: 'full' | 'own' | 'basic' | 'view' | 'none'
- **facturacion**: 'full' | 'view' | 'own' | 'none'
- **agenda**: 'full' | 'own' | 'limited' | 'general' | 'view' | 'none'

## Sistema de Temas (Light/Dark)

Archivos clave:
- `src/context/ThemeContext.tsx` - Provider del tema
- `src/components/ThemeToggle.tsx` - Botón de toggle
- `src/index.css` - Variables CSS

### Clases de tema

```tsx
// Fondos
bg-theme-primary      // Fondo principal
bg-theme-secondary    // Fondo secundario  
bg-theme-tertiary     // Fondo terciario
bg-theme-hover        // Estado hover

// Textos
text-theme-primary    // Texto principal
text-theme-secondary // Texto secundario
text-theme-tertiary  // Texto terciario/muted

// Bordes
border-theme         // Borde estándar
border-theme-hover   // Borde hover

// Acento (ámbar)
text-accent
bg-accent
border-accent
```

### Hook useTheme

```tsx
import { useTheme } from '@/context/ThemeContext';

const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
// theme: 'light' | 'dark' | 'system'
// resolvedTheme: 'light' | 'dark'
```

## Hooks Personalizados

- `useRole.ts` - Control de permisos por rol
- `useSignature.ts` - Gestión de firmas digitales
- `useFileCompression.ts` - Compresión de archivos
- `useDashboard.ts` - Datos del dashboard
- `useAuth()` - Autenticación

## Crear Nueva Página

1. Crear en `src/pages/NombrePage.tsx`
2. Usar layout con sidebar:
   ```tsx
   import AppLayout from '@/components/AppLayout';
   
   export default function MiPage() {
     return (
       <AppLayout>
         <div className="p-6">
           {/* Contenido */}
         </div>
       </AppLayout>
     );
   }
   ```
3. Añadir ruta en el router
4. Añadir al sidebar si es necesario

## Patrones UI Comunes

### Cards con tema
```tsx
<div className="bg-theme-secondary rounded-lg border border-theme p-4">
```

### Botones primarios
```tsx
<button className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90">
```

### Tablas con tema
```tsx
<table className="w-full">
  <thead className="text-theme-tertiary border-b border-theme">
  <tbody className="divide-y divide-theme">
```

### Formularios
```tsx
<input className="bg-theme-primary border border-theme rounded-lg px-3 py-2 text-theme-primary" />
```

## Reglas de Código

1. **Componentes**: Funcionales con TypeScript
2. **Naming**: PascalCase para componentes, camelCase para funciones
3. **Imports**: Usar rutas absolutas con `@/`
4. **Estilos**: Solo Tailwind CSS (no CSS inline)
5. **Types**: Definir interfaces en `src/types/`
6. **Hooks**: Preferir hooks existentes antes de crear nuevos
7. **Rutas**: Todas en `src/pages/`

## Compresión de Archivos

Sistema en `src/utils/compression/`:
- `zipGenerator.ts` - Generación de ZIPs
- `fileHelpers.ts` - Utilidades de archivos
- `compressionService.ts` - Servicio principal

Usa `JSZip` y `archiver` como dependencias.

## Notas Importantes

- Dark mode es el default
- Siempre usar clases de tema (`bg-theme-*`, `text-theme-*`)
- Respetar permisos de roles en cada página
- Usar iconos de Lucide React
- Transiciones de 300ms para cambios de tema
