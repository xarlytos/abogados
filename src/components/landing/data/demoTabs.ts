import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  CreditCard,
  Brain
} from 'lucide-react';

export const demoTabs = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    title: 'Tu bufete, unificado',
    description: 'Visualiza toda la actividad de tu bufete en un solo lugar. Métricas clave, próximos vencimientos y tareas pendientes.',
    features: [
      'KPIs en tiempo real',
      'Gráficos de productividad',
      'Alertas inteligentes',
      'Acceso rápido a favoritos'
    ]
  },
  {
    id: 'expedientes',
    label: 'Expedientes',
    icon: FolderOpen,
    title: 'Gestión integral de casos',
    description: 'Organiza todos tus expedientes con información detallada, documentos, actuaciones y comunicaciones.',
    features: [
      'Vista kanban o lista',
      'Búsqueda avanzada',
      'Historial completo',
      'Colaboración en equipo'
    ]
  },
  {
    id: 'calendario',
    label: 'Calendario',
    icon: Calendar,
    title: 'Nunca pierdas un plazo',
    description: 'Calendario judicial inteligente con sincronización automática de audiencias y vencimientos.',
    features: [
      'Sincronización bidireccional',
      'Recordatorios automáticos',
      'Vistas múltiples',
      'Integración LexNet'
    ]
  },
  {
    id: 'facturacion',
    label: 'Facturación',
    icon: CreditCard,
    title: 'Facturación simplificada',
    description: 'Genera facturas profesionales, controla pagos y gestiona la contabilidad de tu bufete.',
    features: [
      'Plantillas personalizables',
      'Facturación electrónica',
      'Pagos online',
      'Reportes financieros'
    ]
  },
  {
    id: 'ia',
    label: 'IA Legal',
    icon: Brain,
    title: 'Inteligencia artificial a tu servicio',
    description: 'Asistente de IA que analiza documentos, predice resultados y sugiere estrategias legales.',
    features: [
      'Análisis de documentos',
      'Predicción de sentencias',
      'Generación de escritos',
      'Research legal automático'
    ]
  }
];
