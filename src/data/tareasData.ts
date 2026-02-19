// Datos de ejemplo para Tareas y Asignaciones

export interface Tarea {
  id: string;
  title: string;
  description: string;
  expedienteId?: string;
  expedienteTitle?: string;
  assignedTo: string;
  assignedToName: string;
  assignedBy: string;
  assignedByName: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  tags: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export const tareasData: Tarea[] = [
  {
    id: 'TASK-001',
    title: 'Revisar contrato de arrendamiento',
    description: 'Revisar cláusulas del contrato de arrendamiento del caso EXP-2024-001 y preparar informe de observaciones.',
    expedienteId: 'EXP-2024-001',
    expedienteTitle: 'Demanda contractual - Constructora XYZ',
    assignedTo: 'abogado_junior',
    assignedToName: 'Carlos Ruiz',
    assignedBy: 'abogado_senior',
    assignedByName: 'María González',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-02-15',
    createdAt: '2026-02-10',
    tags: ['contrato', 'revisión', 'urgente'],
    comments: [
      { id: 'c1', author: 'María González', content: 'Prioriza las cláusulas de rescisión.', createdAt: '2026-02-10' }
    ]
  },
  {
    id: 'TASK-002',
    title: 'Preparar escritos de demanda',
    description: 'Redactar escritos de demanda para presentación ante el juzgado de primera instancia.',
    expedienteId: 'EXP-2024-003',
    expedienteTitle: 'Juicio laboral - Despido improcedente',
    assignedTo: 'abogado_senior',
    assignedToName: 'María González',
    assignedBy: 'socio',
    assignedByName: 'Juan Despacho',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-02-14',
    createdAt: '2026-02-11',
    tags: ['demanda', 'laboral', 'escrito'],
    comments: []
  },
  {
    id: 'TASK-003',
    title: 'Investigación de jurisprudencia',
    description: 'Buscar casos similares en materia de propiedad intelectual para el caso EXP-2024-005.',
    expedienteId: 'EXP-2024-005',
    expedienteTitle: 'Infracción de marca registrada',
    assignedTo: 'paralegal',
    assignedToName: 'Ana Torres',
    assignedBy: 'abogado_senior',
    assignedByName: 'María González',
    priority: 'medium',
    status: 'completed',
    dueDate: '2026-02-10',
    createdAt: '2026-02-05',
    completedAt: '2026-02-09',
    tags: ['investigación', 'jurisprudencia', 'PI'],
    comments: [
      { id: 'c2', author: 'Ana Torres', content: 'Encontré 3 casos relevantes, adjunto documentación.', createdAt: '2026-02-09' }
    ]
  },
  {
    id: 'TASK-004',
    title: 'Agendar audiencia con cliente',
    description: 'Contactar al cliente Juan Pérez para agendar audiencia de conciliación.',
    expedienteId: 'EXP-2024-002',
    expedienteTitle: 'Divorcio contencioso - Familia Pérez',
    assignedTo: 'secretario',
    assignedToName: 'Luis Martínez',
    assignedBy: 'abogado_junior',
    assignedByName: 'Carlos Ruiz',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2026-02-16',
    createdAt: '2026-02-11',
    tags: ['agenda', 'cliente', 'audiencia'],
    comments: []
  },
  {
    id: 'TASK-005',
    title: 'Preparar documentación para juicio',
    description: 'Organizar y copiar toda la documentación necesaria para el juicio del día 20.',
    expedienteId: 'EXP-2024-001',
    expedienteTitle: 'Demanda contractual - Constructora XYZ',
    assignedTo: 'paralegal',
    assignedToName: 'Ana Torres',
    assignedBy: 'abogado_senior',
    assignedByName: 'María González',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-02-18',
    createdAt: '2026-02-11',
    tags: ['documentación', 'juicio', 'preparación'],
    comments: []
  },
  {
    id: 'TASK-006',
    title: 'Elaborar informe de gastos',
    description: 'Preparar informe detallado de gastos del mes para el expediente EXP-2024-004.',
    expedienteId: 'EXP-2024-004',
    expedienteTitle: 'Reclamación de deuda - Comercial ABC',
    assignedTo: 'abogado_junior',
    assignedToName: 'Carlos Ruiz',
    assignedBy: 'socio',
    assignedByName: 'Juan Despacho',
    priority: 'low',
    status: 'completed',
    dueDate: '2026-02-08',
    createdAt: '2026-02-01',
    completedAt: '2026-02-07',
    tags: ['gastos', 'informe', 'administrativo'],
    comments: []
  },
  {
    id: 'TASK-007',
    title: 'Responder a requerimiento judicial',
    description: 'Responder al requerimiento de información del Juzgado 5º de lo Civil.',
    expedienteId: 'EXP-2024-006',
    expedienteTitle: 'Delito fiscal - Representación imputado',
    assignedTo: 'abogado_senior',
    assignedToName: 'María González',
    assignedBy: 'socio',
    assignedByName: 'Juan Despacho',
    priority: 'high',
    status: 'overdue',
    dueDate: '2026-02-09',
    createdAt: '2026-02-05',
    tags: ['requerimiento', 'penal', 'urgente'],
    comments: [
      { id: 'c3', author: 'Juan Despacho', content: '¡URGENTE! El plazo vence mañana.', createdAt: '2026-02-08' }
    ]
  },
  {
    id: 'TASK-008',
    title: 'Digitalizar documentos del archivo',
    description: 'Escanear y organizar los documentos físicos del archivo del caso EXP-2024-002.',
    expedienteId: 'EXP-2024-002',
    expedienteTitle: 'Divorcio contencioso - Familia Pérez',
    assignedTo: 'secretario',
    assignedToName: 'Luis Martínez',
    assignedBy: 'abogado_junior',
    assignedByName: 'Carlos Ruiz',
    priority: 'low',
    status: 'in_progress',
    dueDate: '2026-02-20',
    createdAt: '2026-02-10',
    tags: ['archivo', 'digitalización', 'documentos'],
    comments: []
  },
  {
    id: 'TASK-009',
    title: 'Revisar pruebas testimoniales',
    description: 'Analizar las declaraciones testimoniales y preparar estrategia de contrainterrogatorio.',
    expedienteId: 'EXP-2024-006',
    expedienteTitle: 'Delito fiscal - Representación imputado',
    assignedTo: 'abogado_senior',
    assignedToName: 'María González',
    assignedBy: 'socio',
    assignedByName: 'Juan Despacho',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-02-17',
    createdAt: '2026-02-12',
    tags: ['pruebas', 'penal', 'estrategia'],
    comments: []
  },
  {
    id: 'TASK-010',
    title: 'Preparar notificación a partes',
    description: 'Redactar y enviar notificaciones a las partes involucradas en el caso EXP-2024-003.',
    expedienteId: 'EXP-2024-003',
    expedienteTitle: 'Juicio laboral - Despido improcedente',
    assignedTo: 'paralegal',
    assignedToName: 'Ana Torres',
    assignedBy: 'abogado_junior',
    assignedByName: 'Carlos Ruiz',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-02-19',
    createdAt: '2026-02-12',
    tags: ['notificación', 'laboral', 'procesal'],
    comments: []
  }
];

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'medium':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'low':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getPriorityText = (priority: string) => {
  switch (priority) {
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

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'in_progress':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'overdue':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completada';
    case 'in_progress':
      return 'En Progreso';
    case 'pending':
      return 'Pendiente';
    case 'overdue':
      return 'Vencida';
    default:
      return status;
  }
};

// Estadísticas para el dashboard de tareas
export const tareasStats = {
  total: tareasData.length,
  completed: tareasData.filter(t => t.status === 'completed').length,
  pending: tareasData.filter(t => t.status === 'pending').length,
  inProgress: tareasData.filter(t => t.status === 'in_progress').length,
  overdue: tareasData.filter(t => t.status === 'overdue').length,
  highPriority: tareasData.filter(t => t.priority === 'high').length,
};
