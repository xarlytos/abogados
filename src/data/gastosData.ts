// Datos de ejemplo para Gastos y Egresos

export interface Gasto {
  id: string;
  concept: string;
  description: string;
  category: 'case' | 'operational' | 'administrative' | 'professional' | 'reimbursable';
  amount: number;
  taxAmount: number;
  totalAmount: number;
  date: string;
  provider?: string;
  caseId?: string;
  caseTitle?: string;
  clientId?: string;
  clientName?: string;
  submittedBy: string;
  submittedByName: string;
  status: 'pending' | 'approved' | 'rejected' | 'accounting' | 'paid';
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  deductible: boolean;
  attachments: string[];
  reimbursable: boolean;
  reimbursedDate?: string;
}

export interface Presupuesto {
  id: string;
  category: string;
  year: number;
  month: number;
  budgetedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
}

export interface Proveedor {
  id: string;
  name: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  category: string[];
  status: 'active' | 'inactive';
  totalInvoiced: number;
  lastInvoiceDate?: string;
}

// Gastos de ejemplo
export const gastosData: Gasto[] = [
  {
    id: 'GAS-2024-001',
    concept: 'Tasas judiciales',
    description: 'Pago de tasas para presentación de demanda',
    category: 'case',
    amount: 450.00,
    taxAmount: 0,
    totalAmount: 450.00,
    date: '2026-02-10',
    provider: 'Ministerio de Justicia',
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ',
    clientId: 'CLI-001',
    clientName: 'Juan Pérez García',
    submittedBy: 'abogado_senior',
    submittedByName: 'María González',
    status: 'approved',
    approvedBy: 'socio',
    approvedByName: 'Juan Despacho',
    approvedDate: '2026-02-10',
    invoiceNumber: 'TASA-2024-156',
    invoiceDate: '2026-02-10',
    deductible: true,
    attachments: ['Recibo de pago', 'Justificación judicial'],
    reimbursable: true
  },
  {
    id: 'GAS-2024-002',
    concept: 'Desplazamiento a juzgado',
    description: 'Kilometraje y dietas para audiencia en Barcelona',
    category: 'case',
    amount: 285.50,
    taxAmount: 0,
    totalAmount: 285.50,
    date: '2026-02-08',
    provider: 'Repsol / Hotel Barcelona',
    caseId: 'EXP-2024-006',
    caseTitle: 'Delito fiscal - Representación imputado',
    submittedBy: 'abogado_senior',
    submittedByName: 'María González',
    status: 'approved',
    approvedBy: 'socio',
    approvedByName: 'Juan Despacho',
    approvedDate: '2026-02-09',
    invoiceNumber: 'TKT-78452',
    deductible: true,
    attachments: ['Ticket gasolina', 'Factura hotel', 'Justificación desplazamiento'],
    reimbursable: false
  },
  {
    id: 'GAS-2024-003',
    concept: 'Material de oficina',
    description: 'Compra de papel, tinta y material de archivo',
    category: 'operational',
    amount: 156.80,
    taxAmount: 32.93,
    totalAmount: 189.73,
    date: '2026-02-05',
    provider: 'Carrefour',
    submittedBy: 'secretario',
    submittedByName: 'Luis Martínez',
    status: 'paid',
    approvedBy: 'administrador',
    approvedByName: 'Ana Martínez',
    approvedDate: '2026-02-06',
    invoiceNumber: 'F-7845123',
    invoiceDate: '2026-02-05',
    deductible: true,
    attachments: ['Factura'],
    reimbursable: false
  },
  {
    id: 'GAS-2024-004',
    concept: 'Servicios de perito',
    description: 'Informe pericial de valoración de daños',
    category: 'case',
    amount: 1200.00,
    taxAmount: 252.00,
    totalAmount: 1452.00,
    date: '2026-02-01',
    provider: 'Peritos Asociados S.L.',
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ',
    clientId: 'CLI-001',
    clientName: 'Juan Pérez García',
    submittedBy: 'abogado_senior',
    submittedByName: 'María González',
    status: 'accounting',
    approvedBy: 'socio',
    approvedByName: 'Juan Despacho',
    approvedDate: '2026-02-02',
    invoiceNumber: 'P-2024-089',
    invoiceDate: '2026-02-01',
    deductible: true,
    attachments: ['Factura perito', 'Presupuesto aprobado'],
    reimbursable: true
  },
  {
    id: 'GAS-2024-005',
    concept: 'Software legal',
    description: 'Suscripción mensual sistema de gestión de casos',
    category: 'professional',
    amount: 199.00,
    taxAmount: 41.79,
    totalAmount: 240.79,
    date: '2026-02-01',
    provider: 'LegalTech Solutions',
    submittedBy: 'administrador',
    submittedByName: 'Ana Martínez',
    status: 'paid',
    invoiceNumber: 'LT-2024-02',
    deductible: true,
    attachments: ['Factura recurrente'],
    reimbursable: false
  },
  {
    id: 'GAS-2024-006',
    concept: 'Almuerzo cliente',
    description: 'Reunión con cliente para preparación de juicio',
    category: 'case',
    amount: 85.00,
    taxAmount: 17.85,
    totalAmount: 102.85,
    date: '2026-02-03',
    provider: 'Restaurante El Juzgado',
    caseId: 'EXP-2024-006',
    caseTitle: 'Delito fiscal - Representación imputado',
    submittedBy: 'abogado_senior',
    submittedByName: 'María González',
    status: 'pending',
    deductible: false,
    attachments: ['Ticket'],
    reimbursable: false
  },
  {
    id: 'GAS-2024-007',
    concept: 'Renovación colegiación',
    description: 'Cuota anual colegio de abogados',
    category: 'professional',
    amount: 450.00,
    taxAmount: 0,
    totalAmount: 450.00,
    date: '2026-01-15',
    provider: 'Ilustre Colegio de Abogados',
    submittedBy: 'socio',
    submittedByName: 'Juan Despacho',
    status: 'paid',
    approvedBy: 'socio',
    approvedByName: 'Juan Despacho',
    approvedDate: '2026-01-15',
    invoiceNumber: 'COL-2024-001',
    deductible: true,
    attachments: ['Recibo'],
    reimbursable: false
  },
  {
    id: 'GAS-2024-008',
    concept: 'Reparación ordenador',
    description: 'Mantenimiento equipos informáticos despacho',
    category: 'operational',
    amount: 180.00,
    taxAmount: 37.80,
    totalAmount: 217.80,
    date: '2026-02-12',
    provider: 'TechSupport S.L.',
    submittedBy: 'secretario',
    submittedByName: 'Luis Martínez',
    status: 'pending',
    deductible: true,
    attachments: ['Presupuesto'],
    reimbursable: false
  }
];

// Presupuestos de ejemplo
export const presupuestosData: Presupuesto[] = [
  { id: 'PRE-001', category: 'Operativos', year: 2026, month: 2, budgetedAmount: 3000, spentAmount: 1897.32, remainingAmount: 1102.68, percentageUsed: 63.2 },
  { id: 'PRE-002', category: 'Profesionales', year: 2026, month: 2, budgetedAmount: 1500, spentAmount: 690.79, remainingAmount: 809.21, percentageUsed: 46.1 },
  { id: 'PRE-003', category: 'Casos - EXP-2024-001', year: 2026, month: 2, budgetedAmount: 5000, spentAmount: 1902.50, remainingAmount: 3097.50, percentageUsed: 38.1 },
  { id: 'PRE-004', category: 'Casos - EXP-2024-006', year: 2026, month: 2, budgetedAmount: 8000, spentAmount: 285.50, remainingAmount: 7714.50, percentageUsed: 3.6 },
  { id: 'PRE-005', category: 'Administrativos', year: 2026, month: 2, budgetedAmount: 2000, spentAmount: 0, remainingAmount: 2000, percentageUsed: 0 },
];

// Proveedores de ejemplo
export const proveedoresData: Proveedor[] = [
  {
    id: 'PROV-001',
    name: 'Peritos Asociados S.L.',
    taxId: 'B-12345678',
    address: 'Calle de los Peritos 45, Madrid',
    phone: '+34 912 345 678',
    email: 'info@peritosasociados.es',
    category: ['Peritajes', 'Informes técnicos'],
    status: 'active',
    totalInvoiced: 15600,
    lastInvoiceDate: '2026-02-01'
  },
  {
    id: 'PROV-002',
    name: 'TechSupport S.L.',
    taxId: 'B-87654321',
    address: 'Av. de la Tecnología 12, Madrid',
    phone: '+34 913 456 789',
    email: 'soporte@techsupport.es',
    category: ['Informática', 'Mantenimiento'],
    status: 'active',
    totalInvoiced: 4500,
    lastInvoiceDate: '2026-02-12'
  },
  {
    id: 'PROV-003',
    name: 'LegalTech Solutions',
    taxId: 'B-11111111',
    address: 'Calle Legal 100, Barcelona',
    phone: '+34 931 234 567',
    email: 'ventas@legaltech.es',
    category: ['Software', 'Tecnología'],
    status: 'active',
    totalInvoiced: 2892,
    lastInvoiceDate: '2026-02-01'
  },
  {
    id: 'PROV-004',
    name: 'Procuradores Madrid',
    taxId: 'B-22222222',
    address: 'Calle de la Justicia 8, Madrid',
    phone: '+34 915 678 901',
    email: 'procuradores@pm.es',
    category: ['Procuradores', 'Judicial'],
    status: 'active',
    totalInvoiced: 8900,
    lastInvoiceDate: '2026-01-20'
  }
];

// Estadísticas
export const gastosStats = {
  totalGastos: gastosData.reduce((sum, g) => sum + g.totalAmount, 0),
  totalPendientes: gastosData.filter(g => g.status === 'pending').reduce((sum, g) => sum + g.totalAmount, 0),
  totalAprobados: gastosData.filter(g => g.status === 'approved').reduce((sum, g) => sum + g.totalAmount, 0),
  totalPagados: gastosData.filter(g => g.status === 'paid').reduce((sum, g) => sum + g.totalAmount, 0),
  totalReembolsables: gastosData.filter(g => g.reimbursable).reduce((sum, g) => sum + g.totalAmount, 0),
  totalDeducibles: gastosData.filter(g => g.deductible).reduce((sum, g) => sum + g.totalAmount, 0),
  
  // Por categoría
  porCaso: gastosData.filter(g => g.category === 'case').reduce((sum, g) => sum + g.totalAmount, 0),
  porOperativos: gastosData.filter(g => g.category === 'operational').reduce((sum, g) => sum + g.totalAmount, 0),
  porProfesionales: gastosData.filter(g => g.category === 'professional').reduce((sum, g) => sum + g.totalAmount, 0),
  porAdministrativos: gastosData.filter(g => g.category === 'administrative').reduce((sum, g) => sum + g.totalAmount, 0),
};

// Helpers
export const getGastoCategoryColor = (category: string) => {
  switch (category) {
    case 'case':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'operational':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'administrative':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'professional':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'reimbursable':
      return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getGastoCategoryText = (category: string) => {
  switch (category) {
    case 'case':
      return 'Caso';
    case 'operational':
      return 'Operativo';
    case 'administrative':
      return 'Administrativo';
    case 'professional':
      return 'Profesional';
    case 'reimbursable':
      return 'Reembolsable';
    default:
      return category;
  }
};

export const getGastoStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'approved':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'accounting':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'rejected':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getGastoStatusText = (status: string) => {
  switch (status) {
    case 'paid':
      return 'Pagado';
    case 'approved':
      return 'Aprobado';
    case 'accounting':
      return 'En Contabilidad';
    case 'pending':
      return 'Pendiente';
    case 'rejected':
      return 'Rechazado';
    default:
      return status;
  }
};
