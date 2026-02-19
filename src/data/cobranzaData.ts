// Datos de ejemplo para Cobranza

export interface CuentaPorCobrar {
  id: string;
  clientId: string;
  clientName: string;
  caseId?: string;
  caseTitle?: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: 'current' | 'pending' | 'overdue' | 'collection' | 'legal';
  invoiceCount: number;
  oldestInvoiceDate: string;
  daysOverdue: number;
  lastContact?: string;
  nextAction?: string;
  paymentAgreement?: PaymentAgreement;
  collectionHistory: CollectionRecord[];
}

export interface PaymentAgreement {
  id: string;
  totalAmount: number;
  installmentCount: number;
  installmentAmount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  startDate: string;
  status: 'active' | 'completed' | 'defaulted';
  paymentsMade: number;
  nextPaymentDate?: string;
}

export interface CollectionRecord {
  id: string;
  date: string;
  type: 'call' | 'email' | 'letter' | 'visit' | 'notice';
  madeBy: string;
  result: 'no_answer' | 'promised_payment' | 'refused' | 'negotiating' | 'agreement' | 'other';
  notes: string;
  promisedDate?: string;
  promisedAmount?: number;
}

export interface FacturaVencida {
  id: string;
  clientId: string;
  clientName: string;
  caseId?: string;
  caseTitle?: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  daysOverdue: number;
  status: 'overdue' | 'in_collection' | 'legal_action' | 'uncollectible';
  remindersSent: number;
  lastReminderDate?: string;
}

// Cuentas por cobrar
export const cuentasPorCobrarData: CuentaPorCobrar[] = [
  {
    id: 'CC-001',
    clientId: 'CLI-001',
    clientName: 'Juan Pérez García',
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ',
    totalAmount: 8500,
    paidAmount: 5000,
    pendingAmount: 3500,
    status: 'current',
    invoiceCount: 3,
    oldestInvoiceDate: '2026-01-15',
    daysOverdue: 0,
    lastContact: '2026-02-10',
    nextAction: 'Seguimiento de pago programado',
    collectionHistory: [
      { id: 'CH-001', date: '2026-01-20', type: 'call', madeBy: 'Ana Martínez', result: 'promised_payment', notes: 'Cliente prometió pagar la próxima semana', promisedDate: '2026-01-27', promisedAmount: 2500 },
      { id: 'CH-002', date: '2026-02-05', type: 'email', madeBy: 'Sistema', result: 'other', notes: 'Recordatorio automático enviado' }
    ]
  },
  {
    id: 'CC-002',
    clientId: 'CLI-002',
    clientName: 'Empresa ABC S.L.',
    caseId: 'EXP-2024-006',
    caseTitle: 'Delito fiscal - Representación imputado',
    totalAmount: 15000,
    paidAmount: 7500,
    pendingAmount: 7500,
    status: 'pending',
    invoiceCount: 4,
    oldestInvoiceDate: '2025-12-01',
    daysOverdue: 15,
    lastContact: '2026-02-05',
    nextAction: 'Llamada de seguimiento',
    collectionHistory: [
      { id: 'CH-003', date: '2026-01-10', type: 'call', madeBy: 'Carlos López', result: 'negotiating', notes: 'Cliente solicita plan de pagos' },
      { id: 'CH-004', date: '2026-01-25', type: 'email', madeBy: 'Sistema', result: 'other', notes: 'Recordatorio de vencimiento' }
    ]
  },
  {
    id: 'CC-003',
    clientId: 'CLI-003',
    clientName: 'María López Ruiz',
    caseId: 'EXP-2024-002',
    caseTitle: 'Divorcio contencioso',
    totalAmount: 4200,
    paidAmount: 1200,
    pendingAmount: 3000,
    status: 'overdue',
    invoiceCount: 2,
    oldestInvoiceDate: '2025-11-15',
    daysOverdue: 45,
    lastContact: '2026-01-28',
    nextAction: 'Carta de requerimiento formal',
    paymentAgreement: {
      id: 'PA-001',
      totalAmount: 3000,
      installmentCount: 3,
      installmentAmount: 1000,
      frequency: 'monthly',
      startDate: '2026-01-01',
      status: 'defaulted',
      paymentsMade: 0,
      nextPaymentDate: '2026-01-01'
    },
    collectionHistory: [
      { id: 'CH-005', date: '2025-12-20', type: 'call', madeBy: 'Ana Martínez', result: 'promised_payment', notes: 'Prometió pagar antes de fin de año', promisedDate: '2025-12-30' },
      { id: 'CH-006', date: '2026-01-05', type: 'call', madeBy: 'Ana Martínez', result: 'no_answer', notes: 'No contestó' },
      { id: 'CH-007', date: '2026-01-15', type: 'letter', madeBy: 'Bufete', result: 'other', notes: 'Carta certificada enviada' },
      { id: 'CH-008', date: '2026-01-28', type: 'call', madeBy: 'Carlos López', result: 'negotiating', notes: 'Acuerdo de pago en 3 plazos planteado' }
    ]
  },
  {
    id: 'CC-004',
    clientId: 'CLI-004',
    clientName: 'Comercial XYZ S.A.',
    totalAmount: 28000,
    paidAmount: 14000,
    pendingAmount: 14000,
    status: 'collection',
    invoiceCount: 6,
    oldestInvoiceDate: '2025-09-01',
    daysOverdue: 120,
    lastContact: '2026-02-08',
    nextAction: 'Valorar acciones legales',
    collectionHistory: [
      { id: 'CH-009', date: '2025-10-15', type: 'call', madeBy: 'Juan Despacho', result: 'promised_payment', notes: 'Prometió liquidar deuda', promisedDate: '2025-11-01' },
      { id: 'CH-010', date: '2025-11-10', type: 'email', madeBy: 'Sistema', result: 'other', notes: 'Recordatorio de vencimiento' },
      { id: 'CH-011', date: '2025-12-01', type: 'letter', madeBy: 'Bufete', result: 'other', notes: 'Requerimiento formal de pago' },
      { id: 'CH-012', date: '2026-01-15', type: 'call', madeBy: 'Carlos López', result: 'refused', notes: 'Cliente se niega a pagar, disputa los servicios' },
      { id: 'CH-013', date: '2026-02-08', type: 'visit', madeBy: 'Juan Despacho', result: 'other', notes: 'Visita a las oficinas, no recibieron' }
    ]
  },
  {
    id: 'CC-005',
    clientId: 'CLI-005',
    clientName: 'Constructora del Norte S.L.',
    caseId: 'EXP-2023-025',
    caseTitle: 'Arbitraje mercantil',
    totalAmount: 50000,
    paidAmount: 50000,
    pendingAmount: 0,
    status: 'current',
    invoiceCount: 5,
    oldestInvoiceDate: '2023-06-01',
    daysOverdue: 0,
    collectionHistory: [
      { id: 'CH-014', date: '2023-06-15', type: 'call', madeBy: 'Sistema', result: 'agreement', notes: 'Pago puntual conforme a acuerdo' }
    ]
  }
];

// Facturas vencidas
export const facturasVencidasData: FacturaVencida[] = [
  {
    id: 'FAC-2025-089',
    clientId: 'CLI-004',
    clientName: 'Comercial XYZ S.A.',
    amount: 5000,
    issueDate: '2025-09-01',
    dueDate: '2025-10-01',
    daysOverdue: 135,
    status: 'in_collection',
    remindersSent: 4,
    lastReminderDate: '2026-01-15'
  },
  {
    id: 'FAC-2025-102',
    clientId: 'CLI-004',
    clientName: 'Comercial XYZ S.A.',
    amount: 4500,
    issueDate: '2025-10-01',
    dueDate: '2025-11-01',
    daysOverdue: 105,
    status: 'in_collection',
    remindersSent: 3,
    lastReminderDate: '2026-01-15'
  },
  {
    id: 'FAC-2025-156',
    clientId: 'CLI-003',
    clientName: 'María López Ruiz',
    caseId: 'EXP-2024-002',
    caseTitle: 'Divorcio contencioso',
    amount: 2000,
    issueDate: '2025-11-15',
    dueDate: '2025-12-15',
    daysOverdue: 60,
    status: 'overdue',
    remindersSent: 3,
    lastReminderDate: '2026-01-28'
  },
  {
    id: 'FAC-2026-012',
    clientId: 'CLI-003',
    clientName: 'María López Ruiz',
    caseId: 'EXP-2024-002',
    caseTitle: 'Divorcio contencioso',
    amount: 1000,
    issueDate: '2026-01-15',
    dueDate: '2026-02-15',
    daysOverdue: 0,
    status: 'overdue',
    remindersSent: 1,
    lastReminderDate: '2026-02-10'
  },
  {
    id: 'FAC-2025-178',
    clientId: 'CLI-008',
    clientName: 'Empresa Fantasma S.A.',
    amount: 8500,
    issueDate: '2025-08-01',
    dueDate: '2025-09-01',
    daysOverdue: 165,
    status: 'legal_action',
    remindersSent: 5,
    lastReminderDate: '2026-01-01'
  }
];

// Estadísticas de cobranza
export const cobranzaStats = {
  totalPending: cuentasPorCobrarData.reduce((sum, c) => sum + c.pendingAmount, 0),
  totalOverdue: cuentasPorCobrarData.filter(c => c.daysOverdue > 0).reduce((sum, c) => sum + c.pendingAmount, 0),
  totalCurrent: cuentasPorCobrarData.filter(c => c.status === 'current').reduce((sum, c) => sum + c.pendingAmount, 0),
  inCollection: cuentasPorCobrarData.filter(c => c.status === 'collection').reduce((sum, c) => sum + c.pendingAmount, 0),
  legalAction: cuentasPorCobrarData.filter(c => c.status === 'legal').reduce((sum, c) => sum + c.pendingAmount, 0),
  activeAgreements: cuentasPorCobrarData.filter(c => c.paymentAgreement?.status === 'active').length,
  defaultedAgreements: cuentasPorCobrarData.filter(c => c.paymentAgreement?.status === 'defaulted').length,
  
  // Por antigüedad
  overdue0to30: cuentasPorCobrarData.filter(c => c.daysOverdue > 0 && c.daysOverdue <= 30).reduce((sum, c) => sum + c.pendingAmount, 0),
  overdue31to60: cuentasPorCobrarData.filter(c => c.daysOverdue > 30 && c.daysOverdue <= 60).reduce((sum, c) => sum + c.pendingAmount, 0),
  overdue61to90: cuentasPorCobrarData.filter(c => c.daysOverdue > 60 && c.daysOverdue <= 90).reduce((sum, c) => sum + c.pendingAmount, 0),
  overdueOver90: cuentasPorCobrarData.filter(c => c.daysOverdue > 90).reduce((sum, c) => sum + c.pendingAmount, 0),
};

// Helpers
export const getCuentaStatusColor = (status: string) => {
  switch (status) {
    case 'current':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'overdue':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'collection':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'legal':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getCuentaStatusText = (status: string) => {
  switch (status) {
    case 'current':
      return 'Al Día';
    case 'pending':
      return 'Pendiente';
    case 'overdue':
      return 'Vencida';
    case 'collection':
      return 'En Cobranza';
    case 'legal':
      return 'Acción Legal';
    default:
      return status;
  }
};

export const getCollectionTypeText = (type: string) => {
  switch (type) {
    case 'call':
      return 'Llamada';
    case 'email':
      return 'Email';
    case 'letter':
      return 'Carta';
    case 'visit':
      return 'Visita';
    case 'notice':
      return 'Notificación';
    default:
      return type;
  }
};

export const getCollectionResultText = (result: string) => {
  switch (result) {
    case 'no_answer':
      return 'Sin respuesta';
    case 'promised_payment':
      return 'Promesa de pago';
    case 'refused':
      return 'Rechazado';
    case 'negotiating':
      return 'En negociación';
    case 'agreement':
      return 'Acuerdo alcanzado';
    case 'other':
      return 'Otro';
    default:
      return result;
  }
};

export const getAgreementStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'completed':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'defaulted':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getAgreementStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'completed':
      return 'Completado';
    case 'defaulted':
      return 'Incumplido';
    default:
      return status;
  }
};
