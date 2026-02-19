# 🎨 Guía del Sistema de Temas

## Resumen

Se ha implementado un sistema completo de **modo claro/oscuro** para toda la aplicación Derecho.ERP.

## Características

- ✅ **Tres modos**: Claro, Oscuro, Sistema (detecta preferencia del OS)
- ✅ **Persistencia**: Guarda la preferencia en localStorage
- ✅ **Transiciones suaves**: Animaciones al cambiar entre modos
- ✅ **Toggle en navegación**: Accesible desde la landing y el dashboard

## Archivos creados/modificados

### Core del Tema
| Archivo | Descripción |
|---------|-------------|
| `src/context/ThemeContext.tsx` | Contexto y Provider del tema |
| `src/components/ThemeToggle.tsx` | Componentes de toggle (simple y completo) |
| `src/index.css` | Variables CSS para ambos temas |
| `src/main.tsx` | Integración del ThemeProvider |

### Componentes actualizados
- ✅ Landing Page completa (22+ componentes UI, 25+ secciones)
- ✅ Header del dashboard
- ✅ Sidebar del dashboard  
- ✅ AppLayout principal

## Uso

### Cambiar el tema

1. **En la Landing Page**: Botón de tema en la navegación superior
2. **En el Dashboard**: Botón de tema en el header (junto a notificaciones)

### Usar las clases de tema en nuevos componentes

```tsx
// Fondos
<div className="bg-theme-primary">      // Fondo principal
<div className="bg-theme-secondary">    // Fondo secundario
<div className="bg-theme-tertiary">     // Fondo terciario
<div className="bg-theme-hover">        // Estado hover

// Textos
<span className="text-theme-primary">   // Texto principal
<span className="text-theme-secondary"> // Texto secundario
<span className="text-theme-tertiary">  // Texto terciario/muted

// Bordes
<div className="border-theme">          // Borde estándar
<div className="border-theme-hover">    // Borde hover

// Acento (ámbar)
<span className="text-accent">          // Texto ámbar
<button className="bg-accent">          // Fondo ámbar
<div className="border-accent">         // Borde ámbar
```

## Variables CSS disponibles

```css
/* Fondos */
--bg-primary:     /* Fondo principal */
--bg-secondary:   /* Fondo secundario */
--bg-tertiary:    /* Fondo terciario */
--bg-card:        /* Fondo para cards */
--bg-hover:       /* Color hover */

/* Textos */
--text-primary:   /* Texto principal */
--text-secondary: /* Texto secundario */
--text-tertiary:  /* Texto terciario */
--text-muted:     /* Texto muted */

/* Bordes */
--border-color:   /* Color de borde */
--border-hover:   /* Borde hover */

/* Acentos */
--accent-primary: /* Color ámbar principal */
--accent-secondary: /* Color ámbar secundario */
```

## Hook useTheme

```tsx
import { useTheme } from '@/context/ThemeContext';

function MiComponente() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  
  // theme: 'light' | 'dark' | 'system'
  // resolvedTheme: 'light' | 'dark' (tema actual aplicado)
  // setTheme('light' | 'dark' | 'system')
  // toggleTheme() - alterna entre light/dark
  
  return (
    <button onClick={toggleTheme}>
      Cambiar tema
    </button>
  );
}
```

## Ejemplo visual

### Modo Oscuro (default)
- Fondo: `#020617` (slate-950)
- Texto: `#f8fafc` (slate-100)
- Cards: `#0f172a` (slate-900)

### Modo Claro
- Fondo: `#ffffff`
- Texto: `#0f172a` (slate-900)
- Cards: `#f8fafc` (slate-50)

## Notas importantes

1. **Colores semánticos**: Mantener colores como `text-red-500`, `text-emerald-500`, `text-blue-500` para estados (errores, éxito, info)

2. **Transiciones**: Todas las propiedades de color tienen transición suave de 300ms

3. **Preferencia del sistema**: El modo "Sistema" detecta automáticamente `prefers-color-scheme`

4. **Sin parpadeo**: El tema se aplica antes del primer render para evitar flash de tema incorrecto
