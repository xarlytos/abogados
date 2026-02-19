// Datos de ejemplo para Audiencias y Trámites

export interface Audiencia {
  id: string;
  caseId: string;
  caseTitle: string;
  clientName: string;
  type: string;
  date: string;
  time: string;
  location: string;
  judge?: string;
  lawyer: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
  result?: string;
  notes?: string;
  documents: string[];
  createdAt: string;
}

export interface Tramite {
  id: string;
  caseId?: string;
  caseTitle?: string;
  title: string;
  description: string;
  type: 'judicial' | 'administrativo' | 'notarial' | 'registro';
  assignedTo: string;
  assignedToName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  dueDate: string;
  completedDate?: string;
  entity: string; // Juzgado, Registro, Notaría, etc.
  cost?: number;
  documents: string[];
  observations: string[];
}

export interface Diligencia {
  id: string;
  tramiteId?: string;
  caseId?: string;
  caseTitle?: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  result?: string;
  attachments: string[];
}

// Audiencias de ejemplo
export const audienciasData: Audiencia[] = [
  {
    id: 'AUD-2024-001',
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ',
    clientName: 'Juan Pérez García',
    type: 'Audiencia de juicio',
    date: '2026-02-20',
    time: '09:30',
    location: 'Juzgado 5º de lo Civil, Calle Mayor 123',
    judge: 'Dra. Marta López Sánchez',
    lawyer: 'María González',
    status: 'scheduled',
    notes: 'Traer documentación original y 3 copias',
    documents: ['Demanda', 'Pruebas documentales', 'Listado de testigos'],
    createdAt: '2026-01-15'
  },
  {
    id: 'AUD-2024-002',
    caseId: 'EXP-2024-002',
    caseTitle: 'Divorcio contencioso - Familia Pérez',
    clientName: 'María López Ruiz',
    type: 'Audiencia preliminar',
    date: '2026-03-05',
    time: '10:00',
    location: 'Juzgado de Familia nº 2, Plaza de la Justicia 5',
    judge: 'Dr. Carlos Martínez Vega',
    lawyer: 'Carlos Ruiz',
    status: 'scheduled',
    notes: 'Posibilidad de acuerdo en convenio regulador',
    documents: ['Demanda', 'Propuesta de convenio', 'Inventario de bienes'],
    createdAt: '2026-02-01'
  },
  {
    id: 'AUD-2024-003',
    caseId: 'EXP-2024-003',
    caseTitle: 'Juicio laboral - Despido improcedente',
    clientName: 'Pedro Sánchez Martín',
    type: 'Audiencia conciliación',
    date: '2026-02-18',
    time: '11:30',
    location: 'Servicio de Conciliación, Av. de la Paz 45',
    lawyer: 'María González',
    status: 'completed',
    result: 'No hubo acuerdo. Se procede a juicio.',
    documents: ['Demanda', 'Documentación empresa', 'Ofrecimiento de pruebas'],
    createdAt: '2026-01-20'
  },
  {
    id: 'AUD-2024-004',
    caseId: 'EXP-2024-006',
    caseTitle: 'Delito fiscal - Representación imputado',
    clientName: 'Empresa ABC S.L.',
    type: 'Declaración del imputado',
    date: '2026-02-25',
    time: '09:00',
    location: 'Juzgado de Instrucción nº 3, Calle Legal 78',
    judge: 'Dra. Ana Fernández Ruiz',
    lawyer: 'María González',
    status: 'scheduled',
    notes: 'Preparar declaración previa con cliente',
    documents: ['Escrito de defensa', 'Documentación fiscal', 'Informe pericial'],
    createdAt: '2026-02-10'
  },
  {
    id: 'AUD-2024-005',
    caseId: 'EXP-2024-004',
    caseTitle: 'Reclamación de deuda - Comercial ABC',
    clientName: 'Comercial ABC S.A.',
    type: 'Audiencia de oídas',
    date: '2026-02-12',
    time: '12:00',
    location: 'Juzgado de Primera Instancia nº 8',
    judge: 'Dr. Javier Moreno Pérez',
    lawyer: 'Carlos Ruiz',
    status: 'postponed',
    result: 'Aplazada por enfermedad del juez',
    documents: ['Demanda', 'Facturas pendientes', 'Requerimientos previos'],
    createdAt: '2026-01-25'
  },
  {
    id: 'AUD-2024-006',
    caseId: 'EXP-2023-015',
    caseTitle: 'Reclamación de deuda antiguo',
    clientName: 'Empresa XYZ',
    type: 'Sentencia',
    date: '2025-12-15',
    time: '10:00',
    location: 'Juzgado 3º de lo Mercantil',
    judge: 'Dra. Elena Castro Vidal',
    lawyer: 'María González',
    status: 'completed',
    result: 'Estimación total de la demanda. Condena en costas.',
    notes: 'Sentencia favorable. Proceder a ejecución.',
    documents: ['Sentencia firme'],
    createdAt: '2025-11-01'
  }
];

// Trámites de ejemplo
export const tramitesData: Tramite[] = [
  {
    id: 'TRAM-001',
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ',
    title: 'Presentación de escritos de prueba',
    description: 'Presentar escritos con las pruebas documentales en el juzgado',
    type: 'judicial',
    assignedTo: 'paralegal',
    assignedToName: 'Ana Torres',
    status: 'in_progress',
    dueDate: '2026-02-16',
    entity: 'Juzgado 5º de lo Civil',
    cost: 0,
    documents: ['Escrito de aportación de pruebas', 'Anexos documentales'],
    observations: ['Revisar que no falte ningún documento']
  },
  {
    id: 'TRAM-002',
    caseId: 'EXP-2024-002',
    caseTitle: 'Divorcio contencioso - Familia Pérez',
    title: 'Solicitud de certificación literal de matrimonio',
    description: 'Solicitar certificación del Registro Civil',
    type: 'administrativo',
    assignedTo: 'secretario',
    assignedToName: 'Luis Martínez',
    status: 'completed',
    dueDate: '2026-02-10',
    completedDate: '2026-02-08',
    entity: 'Registro Civil Central',
    cost: 3.50,
    documents: ['Solicitud', 'Recibo de pago', 'Certificación'],
    observations: []
  },
  {
    id: 'TRAM-003',
    caseId: 'EXP-2024-005',
    caseTitle: 'Infracción de marca registrada',
    title: 'Registro de escritura de poder',
    description: 'Inscribir poder notarial en el Registro de la Propiedad',
    type: 'notarial',
    assignedTo: 'paralegal',
    assignedToName: 'Ana Torres',
    status: 'pending',
    dueDate: '2026-02-28',
    entity: 'Notaría García López',
    cost: 120.00,
    documents: ['Escritura de poder', 'Justificante pago'],
    observations: ['Pedir cita previa']
  },
  {
    id: 'TRAM-004',
    caseId: 'EXP-2024-006',
    caseTitle: 'Delito fiscal - Representación imputado',
    title: 'Solicitud de copias del procedimiento',
    description: 'Solicitar copias de las actuaciones al Juzgado',
    type: 'judicial',
    assignedTo: 'abogado_senior',
    assignedToName: 'María González',
    status: 'completed',
    dueDate: '2026-02-08',
    completedDate: '2026-02-06',
    entity: 'Juzgado de Instrucción nº 3',
    cost: 25.00,
    documents: ['Escrito de solicitud', 'Copias de las actuaciones'],
    observations: ['Importante para preparar defensa']
  },
  {
    id: 'TRAM-005',
    title: 'Renovación certificado digital bufete',
    description: 'Renovar certificado digital de representación del bufete',
    type: 'administrativo',
    assignedTo: 'secretario',
    assignedToName: 'Luis Martínez',
    status: 'delayed',
    dueDate: '2026-01-31',
    entity: 'FNMT - Fábrica Nacional de Moneda y Timbre',
    cost: 15.00,
    documents: ['Solicitud', 'DNI representante'],
    observations: ['Venció el plazo, solicitar urgente']
  },
  {
    id: 'TRAM-006',
    caseId: 'EXP-2024-003',
    caseTitle: 'Juicio laboral - Despido improcedente',
    title: 'Emplazamiento a la parte demandada',
    description: 'Notificar la demanda a la empresa demandada',
    type: 'judicial',
    assignedTo: 'paralegal',
    assignedToName: 'Ana Torres',
    status: 'completed',
    dueDate: '2026-01-20',
    completedDate: '2026-01-18',
    entity: 'Juzgado de lo Social nº 4',
    cost: 50.00,
    documents: ['Demanda', 'Emplazamiento', 'Acuse de recibo'],
    observations: ['Empresa contestó en plazo']
  }
];

// Diligencias de ejemplo
export const diligenciasData: Diligencia[] = [
  {
    id: 'DIL-001',
    tramiteId: 'TRAM-001',
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ',
    title: 'Entrega de escritos en Juzgado',
    description: 'Entregar personalmente los escritos de prueba en Secretaría',
    assignedTo: 'paralegal',
    assignedToName: 'Ana Torres',
    date: '2026-02-16',
    status: 'pending',
    attachments: []
  },
  {
    id: 'DIL-002',
    caseId: 'EXP-2024-006',
    caseTitle: 'Delito fiscal - Representación imputado',
    title: 'Visita a cliente para preparación declaración',
    description: 'Reunión con el cliente para preparar su declaración judicial',
    assignedTo: 'abogado_senior',
    assignedToName: 'María González',
    date: '2026-02-22',
    status: 'pending',
    attachments: []
  },
  {
    id: 'DIL-003',
    tramiteId: 'TRAM-002',
    caseId: 'EXP-2024-002',
    caseTitle: 'Divorcio contencioso - Familia Pérez',
    title: 'Recogida certificación Registro Civil',
    description: 'Recoger documentación solicitada al Registro Civil',
    assignedTo: 'secretario',
    assignedToName: 'Luis Martínez',
    date: '2026-02-08',
    status: 'completed',
    result: 'Certificación obtenida correctamente',
    attachments: ['Certificación literal de matrimonio']
  }
];

// Estadísticas
export const audienciasStats = {
  total: audienciasData.length,
  scheduled: audienciasData.filter(a => a.status === 'scheduled').length,
  completed: audienciasData.filter(a => a.status === 'completed').length,
  cancelled: audienciasData.filter(a => a.status === 'cancelled').length,
  postponed: audienciasData.filter(a => a.status === 'postponed').length,
  thisWeek: audienciasData.filter(a => {
    const date = new Date(a.date);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return date >= now && date <= weekFromNow && a.status === 'scheduled';
  }).length
};

export const tramitesStats = {
  total: tramitesData.length,
  pending: tramitesData.filter(t => t.status === 'pending').length,
  inProgress: tramitesData.filter(t => t.status === 'in_progress').length,
  completed: tramitesData.filter(t => t.status === 'completed').length,
  delayed: tramitesData.filter(t => t.status === 'delayed').length
};

// Helpers
export const getAudienciaStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'cancelled':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'postponed':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getAudienciaStatusText = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'Programada';
    case 'completed':
      return 'Celebrada';
    case 'cancelled':
      return 'Cancelada';
    case 'postponed':
      return 'Aplazada';
    default:
      return status;
  }
};

export const getTramiteStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'in_progress':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'delayed':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getTramiteStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completado';
    case 'in_progress':
      return 'En Progreso';
    case 'pending':
      return 'Pendiente';
    case 'delayed':
      return 'Retrasado';
    default:
      return status;
  }
};

export const getTramiteTypeColor = (type: string) => {
  switch (type) {
    case 'judicial':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'administrativo':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'notarial':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'registro':
      return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getTramiteTypeText = (type: string) => {
  switch (type) {
    case 'judicial':
      return 'Judicial';
    case 'administrativo':
      return 'Administrativo';
    case 'notarial':
      return 'Notarial';
    case 'registro':
      return 'Registro';
    default:
      return type;
  }
};
