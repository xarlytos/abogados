// Datos de ejemplo para Notificaciones

export interface Notificacion {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'deadline' | 'task' | 'message' | 'hearing' | 'document' | 'approval' | 'expense';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'read' | 'unread';
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  actionText?: string;
  sender?: string;
  senderAvatar?: string;
  relatedId?: string;
  relatedType?: string;
}

export interface NotificacionConfig {
  type: string;
  label: string;
  enabled: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
}

// Notificaciones de ejemplo
export const notificacionesData: Notificacion[] = [
  {
    id: 'NOT-001',
    title: 'Audiencia próxima',
    message: 'Tiene una audiencia programada para mañana a las 09:30 en el Juzgado 5º de lo Civil. No olvide llevar la documentación original.',
    type: 'hearing',
    priority: 'high',
    status: 'unread',
    createdAt: '2026-02-19T10:00:00',
    actionUrl: '/audiencias',
    actionText: 'Ver detalles',
    relatedId: 'AUD-2024-001',
    relatedType: 'audiencia'
  },
  {
    id: 'NOT-002',
    title: 'Nueva tarea asignada',
    message: 'María González le ha asignado la tarea "Revisar contrato de arrendamiento" con fecha límite 15/02/2026.',
    type: 'task',
    priority: 'medium',
    status: 'unread',
    createdAt: '2026-02-12T09:30:00',
    actionUrl: '/tareas',
    actionText: 'Ver tarea',
    sender: 'María González',
    senderAvatar: 'MG',
    relatedId: 'TASK-001',
    relatedType: 'tarea'
  },
  {
    id: 'NOT-003',
    title: 'Factura vencida',
    message: 'La factura FAC-2024-034 del cliente Juan Pérez García vence hoy. Importe: €1,800.',
    type: 'deadline',
    priority: 'high',
    status: 'unread',
    createdAt: '2026-02-12T08:00:00',
    actionUrl: '/facturacion',
    actionText: 'Ver factura',
    relatedId: 'FAC-2024-034',
    relatedType: 'factura'
  },
  {
    id: 'NOT-004',
    title: 'Nuevo mensaje',
    message: 'Tiene un nuevo mensaje de Carlos Ruiz sobre el caso EXP-2024-002.',
    type: 'message',
    priority: 'medium',
    status: 'read',
    createdAt: '2026-02-11T16:45:00',
    readAt: '2026-02-11T17:00:00',
    actionUrl: '/mensajes',
    actionText: 'Responder',
    sender: 'Carlos Ruiz',
    senderAvatar: 'CR',
    relatedId: 'MSG-005',
    relatedType: 'mensaje'
  },
  {
    id: 'NOT-005',
    title: 'Gasto pendiente de aprobación',
    message: 'Hay un gasto de €85.00 pendiente de su aprobación. Concepto: Almuerzo cliente.',
    type: 'expense',
    priority: 'low',
    status: 'unread',
    createdAt: '2026-02-11T14:20:00',
    actionUrl: '/gastos',
    actionText: 'Revisar',
    sender: 'María González',
    senderAvatar: 'MG',
    relatedId: 'GAS-2024-006',
    relatedType: 'gasto'
  },
  {
    id: 'NOT-006',
    title: 'Documento compartido',
    message: 'Se ha compartido un nuevo documento en el expediente EXP-2024-001: "Informe pericial de valoración".',
    type: 'document',
    priority: 'medium',
    status: 'read',
    createdAt: '2026-02-10T11:30:00',
    readAt: '2026-02-10T12:00:00',
    actionUrl: '/expedientes',
    actionText: 'Ver documento',
    relatedId: 'DOC-006',
    relatedType: 'documento'
  },
  {
    id: 'NOT-007',
    title: 'Plazo crítico',
    message: 'URGENTE: El plazo para responder al requerimiento judicial del caso EXP-2024-006 vence en 24 horas.',
    type: 'deadline',
    priority: 'urgent',
    status: 'unread',
    createdAt: '2026-02-12T00:00:00',
    actionUrl: '/expedientes',
    actionText: 'Ver expediente',
    relatedId: 'EXP-2024-006',
    relatedType: 'expediente'
  },
  {
    id: 'NOT-008',
    title: 'Acuerdo de pago incumplido',
    message: 'El cliente María López Ruiz no ha realizado el pago acordado en el plan de pagos PA-001.',
    type: 'approval',
    priority: 'high',
    status: 'unread',
    createdAt: '2026-02-09T10:00:00',
    actionUrl: '/cobranza',
    actionText: 'Gestionar',
    relatedId: 'PA-001',
    relatedType: 'acuerdo_pago'
  },
  {
    id: 'NOT-009',
    title: 'Mantenimiento programado',
    message: 'El sistema estará en mantenimiento el próximo domingo de 02:00 a 04:00 horas.',
    type: 'system',
    priority: 'low',
    status: 'read',
    createdAt: '2026-02-08T09:00:00',
    readAt: '2026-02-08T09:30:00',
  },
  {
    id: 'NOT-010',
    title: 'Nueva factura generada',
    message: 'Se ha generado automáticamente la factura FAC-2024-035 para el cliente Empresa ABC S.L.',
    type: 'system',
    priority: 'medium',
    status: 'read',
    createdAt: '2026-02-07T00:00:00',
    readAt: '2026-02-07T08:00:00',
    actionUrl: '/facturacion',
    actionText: 'Ver factura',
  },
  {
    id: 'NOT-011',
    title: 'Cumpleaños del cliente',
    message: 'Hoy es el cumpleaños de Juan Pérez García. ¿Desea enviarle una felicitación?',
    type: 'system',
    priority: 'low',
    status: 'unread',
    createdAt: '2026-02-12T00:00:00',
    actionUrl: '/clientes',
    actionText: 'Ver cliente',
  },
  {
    id: 'NOT-012',
    title: 'Trámite completado',
    message: 'El trámite "Presentación de escritos de prueba" ha sido completado por Ana Torres.',
    type: 'task',
    priority: 'medium',
    status: 'read',
    createdAt: '2026-02-06T16:00:00',
    readAt: '2026-02-06T16:30:00',
    sender: 'Ana Torres',
    senderAvatar: 'AT',
    actionUrl: '/audiencias',
    actionText: 'Ver trámite',
  }
];

// Configuración de notificaciones por tipo
export const notificacionesConfigData: NotificacionConfig[] = [
  { type: 'deadline', label: 'Vencimientos y plazos', enabled: true, email: true, push: true, sms: true },
  { type: 'hearing', label: 'Audiencias', enabled: true, email: true, push: true, sms: false },
  { type: 'task', label: 'Tareas', enabled: true, email: true, push: true, sms: false },
  { type: 'message', label: 'Mensajes', enabled: true, email: true, push: true, sms: false },
  { type: 'document', label: 'Documentos', enabled: true, email: false, push: true, sms: false },
  { type: 'expense', label: 'Gastos', enabled: true, email: true, push: true, sms: false },
  { type: 'approval', label: 'Aprobaciones', enabled: true, email: true, push: true, sms: true },
  { type: 'system', label: 'Sistema', enabled: true, email: false, push: true, sms: false },
];

// Estadísticas
export const notificacionesStats = {
  total: notificacionesData.length,
  unread: notificacionesData.filter(n => n.status === 'unread').length,
  read: notificacionesData.filter(n => n.status === 'read').length,
  byPriority: {
    urgent: notificacionesData.filter(n => n.priority === 'urgent').length,
    high: notificacionesData.filter(n => n.priority === 'high').length,
    medium: notificacionesData.filter(n => n.priority === 'medium').length,
    low: notificacionesData.filter(n => n.priority === 'low').length,
  },
  byType: {
    deadline: notificacionesData.filter(n => n.type === 'deadline').length,
    hearing: notificacionesData.filter(n => n.type === 'hearing').length,
    task: notificacionesData.filter(n => n.type === 'task').length,
    message: notificacionesData.filter(n => n.type === 'message').length,
    document: notificacionesData.filter(n => n.type === 'document').length,
    expense: notificacionesData.filter(n => n.type === 'expense').length,
    approval: notificacionesData.filter(n => n.type === 'approval').length,
    system: notificacionesData.filter(n => n.type === 'system').length,
  }
};

// Helpers
export const getNotificacionTypeColor = (type: string) => {
  switch (type) {
    case 'deadline':
      return 'bg-red-500/10 text-red-400';
    case 'hearing':
      return 'bg-blue-500/10 text-blue-400';
    case 'task':
      return 'bg-amber-500/10 text-amber-400';
    case 'message':
      return 'bg-purple-500/10 text-purple-400';
    case 'document':
      return 'bg-teal-500/10 text-teal-400';
    case 'expense':
      return 'bg-orange-500/10 text-orange-400';
    case 'approval':
      return 'bg-pink-500/10 text-pink-400';
    case 'system':
      return 'bg-slate-500/10 text-slate-400';
    default:
      return 'bg-slate-500/10 text-slate-400';
  }
};

export const getNotificacionTypeText = (type: string) => {
  switch (type) {
    case 'deadline':
      return 'Vencimiento';
    case 'hearing':
      return 'Audiencia';
    case 'task':
      return 'Tarea';
    case 'message':
      return 'Mensaje';
    case 'document':
      return 'Documento';
    case 'expense':
      return 'Gasto';
    case 'approval':
      return 'Aprobación';
    case 'system':
      return 'Sistema';
    default:
      return type;
  }
};

export const getNotificacionTypeIcon = (type: string) => {
  switch (type) {
    case 'deadline':
      return 'alert-circle';
    case 'hearing':
      return 'gavel';
    case 'task':
      return 'check-square';
    case 'message':
      return 'message-square';
    case 'document':
      return 'file-text';
    case 'expense':
      return 'dollar-sign';
    case 'approval':
      return 'check-circle';
    case 'system':
      return 'settings';
    default:
      return 'bell';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'text-red-400 bg-red-500/10';
    case 'high':
      return 'text-orange-400 bg-orange-500/10';
    case 'medium':
      return 'text-amber-400 bg-amber-500/10';
    case 'low':
      return 'text-slate-400 bg-slate-500/10';
    default:
      return 'text-slate-400 bg-slate-500/10';
  }
};

export const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'Urgente';
    case 'high':
      return 'Alta';
    case 'medium':
      return 'Media';
    case 'low':
      return 'Baja';
    default:
      return priority;
  }
};
