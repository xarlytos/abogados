// Datos de ejemplo para Bitácora de Actividades

export type ActionType = 
  | 'login' | 'logout' | 'view' 
  | 'create' | 'update' | 'delete' 
  | 'export' | 'import' | 'print'
  | 'approve' | 'reject' | 'assign'
  | 'download' | 'upload' | 'share';

export type ModuleType = 
  | 'system' | 'auth'
  | 'expedientes' | 'clientes' | 'calendario'
  | 'facturacion' | 'cobranza' | 'gastos'
  | 'documentos' | 'tareas' | 'audiencias'
  | 'usuarios' | 'configuracion' | 'reportes';

export interface BitacoraEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: ActionType;
  module: ModuleType;
  description: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
  userAgent: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  details?: string;
}

// Registros de bitácora de ejemplo
export const bitacoraData: BitacoraEntry[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-02-12T08:30:15',
    userId: 'user-001',
    userName: 'Juan Despacho',
    userRole: 'socio',
    action: 'login',
    module: 'auth',
    description: 'Inicio de sesión exitoso',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    severity: 'info'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-02-12T08:35:22',
    userId: 'user-002',
    userName: 'María González',
    userRole: 'abogado_senior',
    action: 'view',
    module: 'expedientes',
    description: 'Visualización de expediente',
    entityType: 'expediente',
    entityId: 'EXP-2024-001',
    entityName: 'Demanda contractual - Constructora XYZ',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    severity: 'info'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-02-12T09:15:45',
    userId: 'user-003',
    userName: 'Ana Martínez',
    userRole: 'administrador',
    action: 'create',
    module: 'facturacion',
    description: 'Creación de nueva factura',
    entityType: 'factura',
    entityId: 'FAC-2024-035',
    entityName: 'Factura a Empresa ABC S.L.',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0',
    severity: 'info'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-02-12T09:45:10',
    userId: 'user-002',
    userName: 'María González',
    userRole: 'abogado_senior',
    action: 'update',
    module: 'expedientes',
    description: 'Actualización de estado de expediente',
    entityType: 'expediente',
    entityId: 'EXP-2024-001',
    entityName: 'Demanda contractual - Constructora XYZ',
    oldValue: 'Estado: En trámite',
    newValue: 'Estado: Awaiting evidence',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    severity: 'info'
  },
  {
    id: 'LOG-005',
    timestamp: '2026-02-12T10:20:33',
    userId: 'user-004',
    userName: 'Carlos Ruiz',
    userRole: 'abogado_junior',
    action: 'upload',
    module: 'documentos',
    description: 'Subida de documento al expediente',
    entityType: 'documento',
    entityId: 'DOC-045',
    entityName: 'Escrito de alegaciones.pdf',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/537.36',
    severity: 'info'
  },
  {
    id: 'LOG-006',
    timestamp: '2026-02-12T10:45:18',
    userId: 'user-001',
    userName: 'Juan Despacho',
    userRole: 'socio',
    action: 'approve',
    module: 'gastos',
    description: 'Aprobación de gasto',
    entityType: 'gasto',
    entityId: 'GAS-2024-006',
    entityName: 'Almuerzo cliente - €85.00',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    severity: 'info'
  },
  {
    id: 'LOG-007',
    timestamp: '2026-02-12T11:30:05',
    userId: 'user-005',
    userName: 'Luis Martínez',
    userRole: 'secretario',
    action: 'delete',
    module: 'calendario',
    description: 'Eliminación de evento de calendario',
    entityType: 'evento',
    entityId: 'EVT-023',
    entityName: 'Reunión con cliente (cancelada)',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/118.0',
    severity: 'warning'
  },
  {
    id: 'LOG-008',
    timestamp: '2026-02-12T12:15:40',
    userId: 'user-002',
    userName: 'María González',
    userRole: 'abogado_senior',
    action: 'export',
    module: 'reportes',
    description: 'Exportación de informe de tiempo',
    entityType: 'reporte',
    entityId: 'REP-2024-02',
    entityName: 'Informe horas facturables - Febrero 2026',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    severity: 'info'
  },
  {
    id: 'LOG-009',
    timestamp: '2026-02-12T14:20:12',
    userId: 'user-006',
    userName: 'Ana Torres',
    userRole: 'paralegal',
    action: 'assign',
    module: 'tareas',
    description: 'Asignación de tarea completada',
    entityType: 'tarea',
    entityId: 'TASK-003',
    entityName: 'Investigación de jurisprudencia',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    severity: 'info'
  },
  {
    id: 'LOG-010',
    timestamp: '2026-02-12T15:45:30',
    userId: 'user-001',
    userName: 'Juan Despacho',
    userRole: 'socio',
    action: 'create',
    module: 'usuarios',
    description: 'Creación de nuevo usuario',
    entityType: 'usuario',
    entityId: 'user-007',
    entityName: 'Pedro López - Abogado Junior',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    severity: 'warning'
  },
  {
    id: 'LOG-011',
    timestamp: '2026-02-12T16:30:22',
    userId: 'system',
    userName: 'Sistema',
    userRole: 'system',
    action: 'update',
    module: 'facturacion',
    description: 'Generación automática de factura recurrente',
    entityType: 'factura',
    entityId: 'FAC-2024-035',
    entityName: 'Factura mensual - Empresa ABC S.L.',
    ipAddress: '127.0.0.1',
    userAgent: 'ERP-System/1.0',
    severity: 'info'
  },
  {
    id: 'LOG-012',
    timestamp: '2026-02-12T17:15:48',
    userId: 'user-003',
    userName: 'Ana Martínez',
    userRole: 'administrador',
    action: 'print',
    module: 'documentos',
    description: 'Impresión de contrato',
    entityType: 'documento',
    entityId: 'DOC-032',
    entityName: 'Contrato de honorarios - Juan Pérez.pdf',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0',
    severity: 'info'
  },
  {
    id: 'LOG-013',
    timestamp: '2026-02-12T18:00:00',
    userId: 'user-002',
    userName: 'María González',
    userRole: 'abogado_senior',
    action: 'logout',
    module: 'auth',
    description: 'Cierre de sesión',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    severity: 'info'
  },
  {
    id: 'LOG-014',
    timestamp: '2026-02-11T09:30:15',
    userId: 'user-001',
    userName: 'Juan Despacho',
    userRole: 'socio',
    action: 'reject',
    module: 'gastos',
    description: 'Rechazo de gasto',
    entityType: 'gasto',
    entityId: 'GAS-2024-009',
    entityName: 'Gasto sin justificar - €250.00',
    oldValue: 'Pendiente',
    newValue: 'Rechazado',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    severity: 'warning'
  },
  {
    id: 'LOG-015',
    timestamp: '2026-02-11T14:45:22',
    userId: 'user-007',
    userName: 'Pedro Sánchez',
    userRole: 'contador',
    action: 'update',
    module: 'cobranza',
    description: 'Actualización de estado de cobranza',
    entityType: 'cuenta',
    entityId: 'CC-003',
    entityName: 'Cuenta - María López Ruiz',
    oldValue: 'Estado: Vencida',
    newValue: 'Estado: En Cobranza',
    ipAddress: '192.168.1.106',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    severity: 'warning'
  }
];

// Estadísticas
export const bitacoraStats = {
  total: bitacoraData.length,
  today: bitacoraData.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length,
  bySeverity: {
    info: bitacoraData.filter(l => l.severity === 'info').length,
    warning: bitacoraData.filter(l => l.severity === 'warning').length,
    error: bitacoraData.filter(l => l.severity === 'error').length,
    critical: bitacoraData.filter(l => l.severity === 'critical').length,
  },
  byAction: {
    login: bitacoraData.filter(l => l.action === 'login').length,
    view: bitacoraData.filter(l => l.action === 'view').length,
    create: bitacoraData.filter(l => l.action === 'create').length,
    update: bitacoraData.filter(l => l.action === 'update').length,
    delete: bitacoraData.filter(l => l.action === 'delete').length,
  },
  byModule: {
    auth: bitacoraData.filter(l => l.module === 'auth').length,
    expedientes: bitacoraData.filter(l => l.module === 'expedientes').length,
    facturacion: bitacoraData.filter(l => l.module === 'facturacion').length,
    gastos: bitacoraData.filter(l => l.module === 'gastos').length,
    documentos: bitacoraData.filter(l => l.module === 'documentos').length,
  }
};

// Helpers
export const getActionColor = (action: string) => {
  switch (action) {
    case 'login':
    case 'logout':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    case 'create':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'update':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'delete':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'view':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    case 'approve':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'reject':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'export':
    case 'download':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'upload':
    case 'import':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getActionText = (action: string) => {
  const translations: Record<string, string> = {
    login: 'Inicio sesión',
    logout: 'Cierre sesión',
    view: 'Visualización',
    create: 'Creación',
    update: 'Actualización',
    delete: 'Eliminación',
    export: 'Exportación',
    import: 'Importación',
    print: 'Impresión',
    approve: 'Aprobación',
    reject: 'Rechazo',
    assign: 'Asignación',
    download: 'Descarga',
    upload: 'Subida',
    share: 'Compartir',
  };
  return translations[action] || action;
};

export const getModuleText = (module: string) => {
  const translations: Record<string, string> = {
    system: 'Sistema',
    auth: 'Autenticación',
    expedientes: 'Expedientes',
    clientes: 'Clientes',
    calendario: 'Calendario',
    facturacion: 'Facturación',
    cobranza: 'Cobranza',
    gastos: 'Gastos',
    documentos: 'Documentos',
    tareas: 'Tareas',
    audiencias: 'Audiencias',
    usuarios: 'Usuarios',
    configuracion: 'Configuración',
    reportes: 'Reportes',
  };
  return translations[module] || module;
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'info':
      return 'bg-blue-500 text-white';
    case 'warning':
      return 'bg-amber-500 text-slate-950';
    case 'error':
      return 'bg-red-500 text-white';
    case 'critical':
      return 'bg-purple-500 text-white';
    default:
      return 'bg-slate-500 text-white';
  }
};

export const getSeverityText = (severity: string) => {
  const translations: Record<string, string> = {
    info: 'Info',
    warning: 'Advertencia',
    error: 'Error',
    critical: 'Crítico',
  };
  return translations[severity] || severity;
};
