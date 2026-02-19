// Datos de ejemplo para el Portal del Cliente

export interface ClienteCase {
  id: string;
  title: string;
  type: string;
  status: 'active' | 'pending' | 'closed' | 'urgent';
  lawyer: string;
  lawyerAvatar: string;
  progress: number;
  lastUpdate: string;
  nextHearing?: string;
  description: string;
}

export interface ClienteInvoice {
  id: string;
  caseId: string;
  caseTitle: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  concept: string;
}

export interface ClienteDocument {
  id: string;
  title: string;
  type: 'contract' | 'court' | 'evidence' | 'invoice' | 'other';
  caseId?: string;
  caseTitle?: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  url: string;
}

export interface ClienteMessage {
  id: string;
  from: string;
  fromAvatar: string;
  fromRole: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  caseId?: string;
  caseTitle?: string;
}

export interface ClienteHearing {
  id: string;
  caseId: string;
  caseTitle: string;
  date: string;
  time: string;
  location: string;
  type: string;
  lawyer: string;
}

// Casos del cliente
export const clienteCasesData: ClienteCase[] = [
  {
    id: 'EXP-2024-001',
    title: 'Demanda contractual - Constructora XYZ',
    type: 'Civil',
    status: 'active',
    lawyer: 'María González',
    lawyerAvatar: 'MG',
    progress: 65,
    lastUpdate: '2026-02-10',
    nextHearing: '2026-02-20',
    description: 'Reclamación por incumplimiento de contrato de construcción. En fase de pruebas.'
  },
  {
    id: 'EXP-2024-002',
    title: 'Divorcio contencioso',
    type: 'Familiar',
    status: 'pending',
    lawyer: 'Carlos Ruiz',
    lawyerAvatar: 'CR',
    progress: 30,
    lastUpdate: '2026-02-08',
    nextHearing: '2026-03-05',
    description: 'Proceso de divorcio con convenio regulador en negociación.'
  },
  {
    id: 'EXP-2023-015',
    title: 'Reclamación de deuda',
    type: 'Mercantil',
    status: 'closed',
    lawyer: 'María González',
    lawyerAvatar: 'MG',
    progress: 100,
    lastUpdate: '2025-12-15',
    description: 'Recuperación de deuda comercial. Caso resuelto favorablemente.'
  }
];

// Facturas del cliente
export const clienteInvoicesData: ClienteInvoice[] = [
  {
    id: 'FAC-2024-023',
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ',
    amount: 2500,
    status: 'paid',
    issueDate: '2026-01-15',
    dueDate: '2026-02-15',
    paidDate: '2026-01-20',
    concept: 'Honorarios enero 2026'
  },
  {
    id: 'FAC-2024-034',
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ',
    amount: 1800,
    status: 'pending',
    issueDate: '2026-02-10',
    dueDate: '2026-03-10',
    concept: 'Honorarios febrero 2026'
  },
  {
    id: 'FAC-2024-045',
    caseId: 'EXP-2024-002',
    caseTitle: 'Divorcio contencioso',
    amount: 1200,
    status: 'paid',
    issueDate: '2026-02-01',
    dueDate: '2026-03-01',
    paidDate: '2026-02-05',
    concept: 'Anticipo honorarios'
  },
  {
    id: 'FAC-2023-156',
    caseId: 'EXP-2023-015',
    caseTitle: 'Reclamación de deuda',
    amount: 3500,
    status: 'paid',
    issueDate: '2025-11-01',
    dueDate: '2025-12-01',
    paidDate: '2025-11-15',
    concept: 'Honorarios finales'
  }
];

// Documentos compartidos
export const clienteDocumentsData: ClienteDocument[] = [
  {
    id: 'DOC-001',
    title: 'Contrato de servicios legales.pdf',
    type: 'contract',
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ',
    uploadedBy: 'María González',
    uploadedAt: '2026-01-10',
    size: '2.4 MB',
    url: '#'
  },
  {
    id: 'DOC-002',
    title: 'Demanda inicial - Juzgado.pdf',
    type: 'court',
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ',
    uploadedBy: 'María González',
    uploadedAt: '2026-01-15',
    size: '1.8 MB',
    url: '#'
  },
  {
    id: 'DOC-003',
    title: 'Factura #FAC-2024-023.pdf',
    type: 'invoice',
    uploadedBy: 'Sistema',
    uploadedAt: '2026-01-15',
    size: '156 KB',
    url: '#'
  },
  {
    id: 'DOC-004',
    title: 'Escrito de solicitud de divorcio.pdf',
    type: 'court',
    caseId: 'EXP-2024-002',
    caseTitle: 'Divorcio contencioso',
    uploadedBy: 'Carlos Ruiz',
    uploadedAt: '2026-02-01',
    size: '890 KB',
    url: '#'
  },
  {
    id: 'DOC-005',
    title: 'Inventario de bienes matrimoniales.xlsx',
    type: 'evidence',
    caseId: 'EXP-2024-002',
    caseTitle: 'Divorcio contencioso',
    uploadedBy: 'Carlos Ruiz',
    uploadedAt: '2026-02-05',
    size: '45 KB',
    url: '#'
  }
];

// Mensajes del cliente
export const clienteMessagesData: ClienteMessage[] = [
  {
    id: 'MSG-001',
    from: 'María González',
    fromAvatar: 'MG',
    fromRole: 'Abogado Senior',
    subject: 'Actualización caso Constructora XYZ',
    content: 'Buenas tardes, le informo que hemos recibido respuesta de la parte contraria. Adjunto el documento para su revisión. Quedamos a la espera de sus instrucciones.',
    timestamp: '2026-02-10T14:30:00',
    read: true,
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ'
  },
  {
    id: 'MSG-002',
    from: 'Carlos Ruiz',
    fromAvatar: 'CR',
    fromRole: 'Abogado Junior',
    subject: 'Próxima audiencia - Divorcio',
    content: 'Estimado cliente, le confirmo que la audiencia preliminar está programada para el 5 de marzo a las 10:00 horas en el Juzgado de Primera Instancia.',
    timestamp: '2026-02-08T09:15:00',
    read: true,
    caseId: 'EXP-2024-002',
    caseTitle: 'Divorcio contencioso'
  },
  {
    id: 'MSG-003',
    from: 'María González',
    fromAvatar: 'MG',
    fromRole: 'Abogado Senior',
    subject: 'Recordatorio de pago',
    content: 'Le recordamos que tiene pendiente la factura #FAC-2024-034 con vencimiento el 10 de marzo. Si ya realizó el pago, por favor ignore este mensaje.',
    timestamp: '2026-02-11T16:00:00',
    read: false,
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ'
  },
  {
    id: 'MSG-004',
    from: 'Sistema',
    fromAvatar: 'SY',
    fromRole: 'Automático',
    subject: 'Documento compartido',
    content: 'Se ha compartido un nuevo documento en su caso EXP-2024-001. Puede acceder a él desde la sección de documentos.',
    timestamp: '2026-02-10T10:00:00',
    read: false,
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ'
  }
];

// Audiencias programadas
export const clienteHearingsData: ClienteHearing[] = [
  {
    id: 'HEAR-001',
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ',
    date: '2026-02-20',
    time: '09:30',
    location: 'Juzgado 5º de lo Civil, Calle Mayor 123',
    type: 'Audiencia de juicio',
    lawyer: 'María González'
  },
  {
    id: 'HEAR-002',
    caseId: 'EXP-2024-002',
    caseTitle: 'Divorcio contencioso',
    date: '2026-03-05',
    time: '10:00',
    location: 'Juzgado de Familia nº 2, Plaza de la Justicia 5',
    type: 'Audiencia preliminar',
    lawyer: 'Carlos Ruiz'
  }
];

// Resumen financiero
export const clienteFinancialSummary = {
  totalBilled: 9000,
  totalPaid: 7200,
  totalPending: 1800,
  totalOverdue: 0,
  pendingInvoices: 1,
  paidInvoices: 3
};

// Información del cliente
export const clienteInfo = {
  name: 'Juan Pérez García',
  email: 'juan.perez@email.com',
  phone: '+34 612 345 678',
  address: 'Calle Principal 45, 28001 Madrid',
  clientSince: '2023-05-15',
  totalCases: 3,
  activeCases: 2,
  avatar: 'JP'
};

// Helpers
export const getCaseStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'closed':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    case 'urgent':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getCaseStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'pending':
      return 'Pendiente';
    case 'closed':
      return 'Cerrado';
    case 'urgent':
      return 'Urgente';
    default:
      return status;
  }
};

export const getInvoiceStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'overdue':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getInvoiceStatusText = (status: string) => {
  switch (status) {
    case 'paid':
      return 'Pagada';
    case 'pending':
      return 'Pendiente';
    case 'overdue':
      return 'Vencida';
    default:
      return status;
  }
};

export const getDocumentTypeIcon = (type: string) => {
  switch (type) {
    case 'contract':
      return 'file-contract';
    case 'court':
      return 'gavel';
    case 'evidence':
      return 'folder-open';
    case 'invoice':
      return 'file-invoice';
    default:
      return 'file';
  }
};
