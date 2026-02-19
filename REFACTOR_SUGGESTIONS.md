# Sugerencias de Refactorización - Dashboard

> **Análisis del archivo:** `src/pages/Dashboard.tsx` (895 líneas)
> 
> Este documento propone una estructura modular para mejorar la mantenibilidad y escalabilidad del código.

---

## 📁 Estructura Propuesta

```
src/
├── pages/
│   └── Dashboard.tsx                 # Página principal (lógica de layout)
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx               # Navegación lateral
│   │   ├── Header.tsx                # Header con notificaciones y perfil
│   │   └── SearchModal.tsx           # Modal de búsqueda global
│   └── dashboard/
│       ├── WelcomeBanner.tsx         # Banner de bienvenida
│       ├── StatsGrid.tsx             # Grid de estadísticas principales
│       ├── RecentCasesTable.tsx      # Tabla de expedientes recientes
│       ├── FinancialChart.tsx        # Gráfico de facturación
│       ├── TeamSection.tsx           # Sección del equipo
│       ├── UpcomingDeadlines.tsx     # Plazos próximos
│       ├── TasksWidget.tsx           # Widget de tareas
│       ├── CaseTypesChart.tsx        # Distribución por tipo de caso
│       ├── ActivityFeed.tsx          # Feed de actividad reciente
│       └── QuickActions.tsx          # Acciones rápidas
├── hooks/
│   └── useDashboard.ts               # Hook con estado y lógica del dashboard
├── lib/
│   └── utils.ts                      # Funciones utilitarias (getStatusColor, etc.)
└── data/
    └── dashboardData.ts              # Datos de ejemplo/mock data
```

---

## 📄 Archivos a Crear

### 1. `src/data/dashboardData.ts`
**Responsabilidad:** Todos los datos de ejemplo/mock data.

```typescript
// Contendría: stats, recentCases, upcomingDeadlines, notifications, 
// tasks, recentActivity, financialData, teamMembers, quickStats, sidebarItems
```

**Líneas a extraer:** ~100 líneas (líneas 17-113)

---

### 2. `src/lib/utils.ts` (o `src/utils/dashboard.ts`)
**Responsabilidad:** Funciones auxiliares reutilizables.

```typescript
// Contendría: getStatusColor, getPriorityColor, getStatusText
```

**Líneas a extraer:** ~30 líneas (líneas 143-170)

---

### 3. `src/components/layout/Sidebar.tsx`
**Responsabilidad:** Navegación lateral con animaciones.

**Características:**
- Props: `isOpen`, `onToggle`
- Colapsable con animaciones
- Links de navegación con badges
- Botones de configuración y logout

**Líneas a extraer:** ~80 líneas (líneas 174-253)

---

### 4. `src/components/layout/Header.tsx`
**Responsabilidad:** Header superior con búsqueda, notificaciones y menú de usuario.

**Características:**
- Toggle de sidebar
- Barra de búsqueda (abre modal)
- Botón "Nuevo"
- Dropdown de notificaciones
- Dropdown de menú de usuario

**Líneas a extraer:** ~140 líneas (líneas 258-395)

---

### 5. `src/components/layout/SearchModal.tsx`
**Responsabilidad:** Modal de búsqueda global.

**Características:**
- Props: `isOpen`, `onClose`
- Atajo de teclado (Ctrl+K)
- Historial de búsquedas

**Líneas a extraer:** ~50 líneas (líneas 849-892)

---

### 6. `src/components/dashboard/WelcomeBanner.tsx`
**Responsabilidad:** Banner de bienvenida personalizado.

**Líneas a extraer:** ~25 líneas (líneas 400-421)

---

### 7. `src/components/dashboard/StatsGrid.tsx`
**Responsabilidad:** Grid de 6 tarjetas de estadísticas.

**Props:** `stats: StatItem[]`

**Líneas a extraer:** ~40 líneas (líneas 424-464)

---

### 8. `src/components/dashboard/RecentCasesTable.tsx`
**Responsabilidad:** Tabla de expedientes recientes con tabs.

**Características:**
- Tabs: Vista general / Expedientes / Finanzas
- Tabla con estado y progreso
- Stats rápidos (Ganados/Perdidos/Pendientes)

**Líneas a extraer:** ~100 líneas (líneas 474-591)

---

### 9. `src/components/dashboard/FinancialChart.tsx`
**Responsabilidad:** Gráfico de barras de facturación anual.

**Props:** `data: MonthlyRevenue[]`

**Líneas a extraer:** ~45 líneas (líneas 594-633)

---

### 10. `src/components/dashboard/TeamSection.tsx`
**Responsabilidad:** Grid de miembros del equipo.

**Props:** `members: TeamMember[]`

**Líneas a extraer:** ~30 líneas (líneas 636-660)

---

### 11. `src/components/dashboard/UpcomingDeadlines.tsx`
**Responsabilidad:** Lista de plazos próximos.

**Props:** `deadlines: Deadline[]`

**Líneas a extraer:** ~60 líneas (líneas 667-724)

---

### 12. `src/components/dashboard/TasksWidget.tsx`
**Responsabilidad:** Widget de tareas interactivo.

**Características:**
- Props: `tasks`, `onToggleTask`
- Checkboxes interactivos
- Contador de completadas

**Líneas a extraer:** ~50 líneas (líneas 727-772)

---

### 13. `src/components/dashboard/CaseTypesChart.tsx`
**Responsabilidad:** Barras de progreso de tipos de casos.

**Props:** `caseTypes: CaseType[]`

**Líneas a extraer:** ~25 líneas (líneas 775-793)

---

### 14. `src/components/dashboard/ActivityFeed.tsx`
**Responsabilidad:** Feed de actividad reciente.

**Props:** `activities: Activity[]`

**Líneas a extraer:** ~25 líneas (líneas 796-815)

---

### 15. `src/components/dashboard/QuickActions.tsx`
**Responsabilidad:** Grid de botones de acciones rápidas.

**Líneas a extraer:** ~30 líneas (líneas 818-841)

---

### 16. `src/hooks/useDashboard.ts`
**Responsabilidad:** Estado y lógica del dashboard.

```typescript
// Contendría:
// - Estado de sidebar, notificaciones, user menu, tabs, tareas, search modal
// - useEffect para atajo de teclado
// - handleLogout, toggleTask
// - Cálculos derivados
```

---

## 📦 Dashboard.tsx Final

El archivo principal quedaría así:

```typescript
import { useDashboard } from '@/hooks/useDashboard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SearchModal } from '@/components/layout/SearchModal';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentCasesTable } from '@/components/dashboard/RecentCasesTable';
import { FinancialChart } from '@/components/dashboard/FinancialChart';
import { TeamSection } from '@/components/dashboard/TeamSection';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { TasksWidget } from '@/components/dashboard/TasksWidget';
import { CaseTypesChart } from '@/components/dashboard/CaseTypesChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { dashboardData } from '@/data/dashboardData';

export default function Dashboard() {
  const {
    sidebarOpen,
    setSidebarOpen,
    showNotifications,
    setShowNotifications,
    // ... más estado
  } = useDashboard();

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          notifications={dashboardData.notifications}
        />
        
        <main className="flex-1 overflow-y-auto">
          <WelcomeBanner />
          <StatsGrid stats={dashboardData.stats} />
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <RecentCasesTable cases={dashboardData.recentCases} />
              <FinancialChart data={dashboardData.financialData.monthlyRevenue} />
              <TeamSection members={dashboardData.teamMembers} />
            </div>
            
            <div className="space-y-6">
              <UpcomingDeadlines deadlines={dashboardData.upcomingDeadlines} />
              <TasksWidget 
                tasks={taskList} 
                onToggle={toggleTask}
              />
              <CaseTypesChart types={dashboardData.financialData.caseTypes} />
              <ActivityFeed activities={dashboardData.recentActivity} />
              <QuickActions />
            </div>
          </div>
        </main>
      </div>
      
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </div>
  );
}
```

**Líneas estimadas:** ~50-60 líneas (vs 895 actuales)

---

## ✅ Beneficios

| Aspecto | Mejora |
|---------|--------|
| **Mantenibilidad** | Cada componente tiene una sola responsabilidad |
| **Testing** | Fácil de testear componentes individuales |
| **Reutilización** | Componentes como `Sidebar`, `Header` pueden usarse en otras páginas |
| **Colaboración** | Múltiples desarrolladores pueden trabajar en paralelo |
| **Code Review** | PRs más pequeños y enfocados |
| **Performance** | Posibilidad de lazy loading de secciones |

---

## 🚀 Implementación Gradual

1. **Fase 1:** Crear `data/dashboardData.ts` y `lib/utils.ts`
2. **Fase 2:** Extraer componentes de layout (`Sidebar`, `Header`, `SearchModal`)
3. **Fase 3:** Extraer componentes del dashboard uno por uno
4. **Fase 4:** Crear hook `useDashboard`
5. **Fase 5:** Limpiar `Dashboard.tsx` final

---

## 📝 Notas Adicionales

- Considerar usar **React Context** para el estado global del layout (sidebar, tema)
- Evaluar **Zustand** o **Redux Toolkit** si el estado crece
- Los tipos TypeScript deben ir en `src/types/dashboard.ts`
- Crear barrel exports (`index.ts`) para facilitar imports
