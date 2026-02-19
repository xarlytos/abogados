// Datos de ejemplo para Proveedores

export interface Proveedor {
  id: string;
  name: string;
  legalName: string;
  taxId: string;
  taxType: 'IVA' | 'IRPF' | 'exento';
  address: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  categories: string[];
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  paymentTerms: string;
  paymentMethod: 'transfer' | 'cash' | 'check' | 'card';
  bankAccount?: string;
  bankName?: string;
  creditLimit: number;
  currentBalance: number;
  rating: number;
  totalInvoiced: number;
  totalPaid: number;
  pendingAmount: number;
  lastInvoiceDate?: string;
  lastPaymentDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FacturaProveedor {
  id: string;
  providerId: string;
  providerName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  baseAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  concept: string;
  caseId?: string;
  caseTitle?: string;
  category: string;
  attachments: string[];
  paidDate?: string;
  paidAmount?: number;
}

export interface ContratoProveedor {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  renewalDate?: string;
  monthlyAmount?: number;
  annualAmount?: number;
  status: 'active' | 'expired' | 'terminated' | 'pending';
  services: string[];
  clauses: string[];
  attachments: string[];
}

export interface EvaluacionProveedor {
  id: string;
  providerId: string;
  providerName: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluationDate: string;
  quality: number;
  punctuality: number;
  price: number;
  service: number;
  communication: number;
  overall: number;
  comments?: string;
  wouldRecommend: boolean;
}

// Proveedores de ejemplo
export const proveedoresData: Proveedor[] = [
  {
    id: 'PROV-001',
    name: 'Peritos Asociados S.L.',
    legalName: 'Peritos Asociados Consultores S.L.',
    taxId: 'B-12345678',
    taxType: 'IVA',
    address: 'Calle de los Peritos 45, Planta 3',
    city: 'Madrid',
    postalCode: '28001',
    province: 'Madrid',
    country: 'España',
    phone: '+34 912 345 678',
    email: 'info@peritosasociados.es',
    website: 'www.peritosasociados.es',
    contactName: 'Dr. Antonio Pérez',
    contactPhone: '+34 612 345 678',
    contactEmail: 'a.perez@peritosasociados.es',
    categories: ['Peritajes', 'Informes técnicos', 'Valoraciones'],
    status: 'active',
    paymentTerms: '30 días',
    paymentMethod: 'transfer',
    bankAccount: 'ES91 1234 5678 9012 3456 7890',
    bankName: 'Banco Santander',
    creditLimit: 50000,
    currentBalance: 1200,
    rating: 4.8,
    totalInvoiced: 156000,
    totalPaid: 154800,
    pendingAmount: 1200,
    lastInvoiceDate: '2026-02-01',
    lastPaymentDate: '2026-01-15',
    notes: 'Especialistas en peritajes judiciales. Excelente calidad.',
    createdAt: '2020-03-15',
    updatedAt: '2026-02-01'
  },
  {
    id: 'PROV-002',
    name: 'TechSupport S.L.',
    legalName: 'Technology Support Solutions S.L.',
    taxId: 'B-87654321',
    taxType: 'IVA',
    address: 'Av. de la Tecnología 12, Edificio Beta',
    city: 'Madrid',
    postalCode: '28036',
    province: 'Madrid',
    country: 'España',
    phone: '+34 913 456 789',
    email: 'soporte@techsupport.es',
    website: 'www.techsupport.es',
    contactName: 'Laura García',
    contactPhone: '+34 623 456 789',
    contactEmail: 'l.garcia@techsupport.es',
    categories: ['Informática', 'Mantenimiento', 'Software'],
    status: 'active',
    paymentTerms: '15 días',
    paymentMethod: 'transfer',
    bankAccount: 'ES45 9876 5432 1098 7654 3210',
    bankName: 'BBVA',
    creditLimit: 10000,
    currentBalance: 0,
    rating: 4.2,
    totalInvoiced: 45000,
    totalPaid: 45000,
    pendingAmount: 0,
    lastInvoiceDate: '2026-02-12',
    notes: 'Servicio técnico informático. Respuesta rápida.',
    createdAt: '2021-06-20',
    updatedAt: '2026-02-12'
  },
  {
    id: 'PROV-003',
    name: 'LegalTech Solutions',
    legalName: 'Legal Technology Solutions S.A.',
    taxId: 'A-11111111',
    taxType: 'IVA',
    address: 'Calle Legal 100, Torre A',
    city: 'Barcelona',
    postalCode: '08029',
    province: 'Barcelona',
    country: 'España',
    phone: '+34 931 234 567',
    email: 'ventas@legaltech.es',
    website: 'www.legaltech.es',
    contactName: 'Marta Sánchez',
    contactPhone: '+34 631 234 567',
    contactEmail: 'm.sanchez@legaltech.es',
    categories: ['Software', 'Tecnología', 'Cloud'],
    status: 'active',
    paymentTerms: '30 días',
    paymentMethod: 'card',
    creditLimit: 5000,
    currentBalance: 240.79,
    rating: 4.5,
    totalInvoiced: 28920,
    totalPaid: 28679.21,
    pendingAmount: 240.79,
    lastInvoiceDate: '2026-02-01',
    notes: 'Software de gestión legal. Suscripción mensual.',
    createdAt: '2022-01-10',
    updatedAt: '2026-02-01'
  },
  {
    id: 'PROV-004',
    name: 'Procuradores Madrid',
    legalName: 'Ilustre Colegio de Procuradores de Madrid',
    taxId: 'S-22222222',
    taxType: 'IVA',
    address: 'Calle de la Justicia 8',
    city: 'Madrid',
    postalCode: '28004',
    province: 'Madrid',
    country: 'España',
    phone: '+34 915 678 901',
    email: 'procuradores@pm.es',
    website: 'www.procuradoresmadrid.es',
    contactName: 'Dña. Carmen Ruiz',
    contactPhone: '+34 615 678 901',
    contactEmail: 'c.ruiz@pm.es',
    categories: ['Procuradores', 'Judicial', 'Representación'],
    status: 'active',
    paymentTerms: 'Inmediato',
    paymentMethod: 'transfer',
    bankAccount: 'ES78 1234 5678 9012 3456 7891',
    bankName: 'CaixaBank',
    creditLimit: 0,
    currentBalance: 0,
    rating: 4.9,
    totalInvoiced: 89000,
    totalPaid: 89000,
    pendingAmount: 0,
    lastInvoiceDate: '2026-01-20',
    notes: 'Procuradores oficiales. Servicio impecable.',
    createdAt: '2019-09-01',
    updatedAt: '2026-01-20'
  },
  {
    id: 'PROV-005',
    name: 'Detectives Privados Alfa',
    legalName: 'Alfa Investigaciones S.L.',
    taxId: 'B-33333333',
    taxType: 'IVA',
    address: 'Calle Secreto 42',
    city: 'Madrid',
    postalCode: '28010',
    province: 'Madrid',
    country: 'España',
    phone: '+34 916 789 012',
    email: 'info@detectivesalfa.es',
    contactName: 'Juan López',
    contactPhone: '+34 616 789 012',
    contactEmail: 'j.lopez@detectivesalfa.es',
    categories: ['Investigación', 'Detectives', 'Pruebas'],
    status: 'active',
    paymentTerms: '50% anticipo, 50% entrega',
    paymentMethod: 'transfer',
    creditLimit: 10000,
    currentBalance: 0,
    rating: 4.0,
    totalInvoiced: 25000,
    totalPaid: 25000,
    pendingAmount: 0,
    notes: 'Servicios de investigación. Confidencial.',
    createdAt: '2021-03-15',
    updatedAt: '2025-12-01'
  },
  {
    id: 'PROV-006',
    name: 'Traducciones Jurídicas Pro',
    legalName: 'Pro Traducciones S.L.',
    taxId: 'B-44444444',
    taxType: 'IVA',
    address: 'Calle de las Lenguas 15',
    city: 'Madrid',
    postalCode: '28014',
    province: 'Madrid',
    country: 'España',
    phone: '+34 917 890 123',
    email: 'info@traduccionespro.es',
    website: 'www.traduccionespro.es',
    contactName: 'Ana Martínez',
    contactPhone: '+34 617 890 123',
    contactEmail: 'a.martinez@traduccionespro.es',
    categories: ['Traducción', 'Interpretación', 'Legal'],
    status: 'active',
    paymentTerms: '15 días',
    paymentMethod: 'transfer',
    creditLimit: 5000,
    currentBalance: 850,
    rating: 4.7,
    totalInvoiced: 15000,
    totalPaid: 14150,
    pendingAmount: 850,
    lastInvoiceDate: '2026-02-05',
    notes: 'Traductores jurados. Especializados en derecho.',
    createdAt: '2022-05-10',
    updatedAt: '2026-02-05'
  },
  {
    id: 'PROV-007',
    name: 'Material de Oficina Plus',
    legalName: 'Oficina Plus S.A.',
    taxId: 'A-55555555',
    taxType: 'IVA',
    address: 'Av. de la Industria 200',
    city: 'Alcorcón',
    postalCode: '28923',
    province: 'Madrid',
    country: 'España',
    phone: '+34 918 901 234',
    email: 'ventas@oficinaplus.es',
    contactName: 'Pedro Gómez',
    contactPhone: '+34 618 901 234',
    contactEmail: 'p.gomez@oficinaplus.es',
    categories: ['Material oficina', 'Consumibles', 'Papelería'],
    status: 'active',
    paymentTerms: '30 días',
    paymentMethod: 'transfer',
    creditLimit: 3000,
    currentBalance: 456.80,
    rating: 3.8,
    totalInvoiced: 12000,
    totalPaid: 11543.20,
    pendingAmount: 456.80,
    lastInvoiceDate: '2026-02-05',
    notes: 'Suministros de oficina. Entrega rápida.',
    createdAt: '2020-11-20',
    updatedAt: '2026-02-05'
  }
];

// Facturas de proveedores
export const facturasProveedorData: FacturaProveedor[] = [
  {
    id: 'FP-001',
    providerId: 'PROV-001',
    providerName: 'Peritos Asociados S.L.',
    invoiceNumber: 'P-2024-089',
    issueDate: '2026-02-01',
    dueDate: '2026-03-03',
    baseAmount: 1200.00,
    taxRate: 21,
    taxAmount: 252.00,
    totalAmount: 1452.00,
    status: 'pending',
    concept: 'Informe pericial de valoración de daños',
    caseId: 'EXP-2024-001',
    caseTitle: 'Demanda contractual - Constructora XYZ',
    category: 'Peritajes',
    attachments: ['Factura.pdf']
  },
  {
    id: 'FP-002',
    providerId: 'PROV-002',
    providerName: 'TechSupport S.L.',
    invoiceNumber: 'TS-2024-045',
    issueDate: '2026-02-12',
    dueDate: '2026-02-27',
    baseAmount: 180.00,
    taxRate: 21,
    taxAmount: 37.80,
    totalAmount: 217.80,
    status: 'pending',
    concept: 'Reparación ordenador y mantenimiento',
    category: 'Mantenimiento',
    attachments: ['Presupuesto.pdf', 'Factura.pdf']
  },
  {
    id: 'FP-003',
    providerId: 'PROV-003',
    providerName: 'LegalTech Solutions',
    invoiceNumber: 'LT-2024-02',
    issueDate: '2026-02-01',
    dueDate: '2026-03-03',
    baseAmount: 199.00,
    taxRate: 21,
    taxAmount: 41.79,
    totalAmount: 240.79,
    status: 'pending',
    concept: 'Suscripción mensual software legal',
    category: 'Software',
    attachments: ['Factura recurrente']
  },
  {
    id: 'FP-004',
    providerId: 'PROV-006',
    providerName: 'Traducciones Jurídicas Pro',
    invoiceNumber: 'TJ-2024-012',
    issueDate: '2026-02-05',
    dueDate: '2026-02-20',
    baseAmount: 702.48,
    taxRate: 21,
    taxAmount: 147.52,
    totalAmount: 850.00,
    status: 'pending',
    concept: 'Traducción jurada de documentos',
    caseId: 'EXP-2024-005',
    caseTitle: 'Infracción de marca registrada',
    category: 'Traducción',
    attachments: ['Factura.pdf']
  },
  {
    id: 'FP-005',
    providerId: 'PROV-007',
    providerName: 'Material de Oficina Plus',
    invoiceNumber: 'OP-2024-089',
    issueDate: '2026-02-05',
    dueDate: '2026-03-07',
    baseAmount: 377.52,
    taxRate: 21,
    taxAmount: 79.28,
    totalAmount: 456.80,
    status: 'pending',
    concept: 'Material de oficina - Febrero',
    category: 'Material oficina',
    attachments: ['Albarán.pdf', 'Factura.pdf']
  },
  {
    id: 'FP-006',
    providerId: 'PROV-001',
    providerName: 'Peritos Asociados S.L.',
    invoiceNumber: 'P-2024-078',
    issueDate: '2026-01-15',
    dueDate: '2026-02-14',
    baseAmount: 2500.00,
    taxRate: 21,
    taxAmount: 525.00,
    totalAmount: 3025.00,
    status: 'paid',
    concept: 'Informe pericial complejo',
    caseId: 'EXP-2024-006',
    caseTitle: 'Delito fiscal - Representación imputado',
    category: 'Peritajes',
    attachments: ['Factura.pdf'],
    paidDate: '2026-01-20',
    paidAmount: 3025.00
  }
];

// Contratos con proveedores
export const contratosProveedorData: ContratoProveedor[] = [
  {
    id: 'CONT-001',
    providerId: 'PROV-002',
    providerName: 'TechSupport S.L.',
    title: 'Contrato de mantenimiento informático',
    description: 'Mantenimiento preventivo y correctivo de equipos informáticos',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    renewalDate: '2026-11-01',
    monthlyAmount: 150.00,
    annualAmount: 1800.00,
    status: 'active',
    services: ['Mantenimiento servidores', 'Soporte técnico', 'Actualizaciones de software'],
    clauses: ['Respuesta en 24h', 'Copias de seguridad semanales', 'Actualizaciones de seguridad'],
    attachments: ['Contrato firmado.pdf']
  },
  {
    id: 'CONT-002',
    providerId: 'PROV-003',
    providerName: 'LegalTech Solutions',
    title: 'Licencia software ERP Legal',
    description: 'Suscripción anual al sistema de gestión de bufete',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    renewalDate: '2024-11-01',
    monthlyAmount: 199.00,
    annualAmount: 2388.00,
    status: 'active',
    services: ['ERP Legal', 'Soporte técnico', 'Actualizaciones'],
    clauses: ['Soporte 24/7', 'Backup diario', 'Garantía SLA 99.9%'],
    attachments: ['Contrato suscripción.pdf']
  }
];

// Evaluaciones de proveedores
export const evaluacionesProveedorData: EvaluacionProveedor[] = [
  {
    id: 'EVAL-001',
    providerId: 'PROV-001',
    providerName: 'Peritos Asociados S.L.',
    evaluatorId: 'user-001',
    evaluatorName: 'Juan Despacho',
    evaluationDate: '2025-12-15',
    quality: 5,
    punctuality: 4,
    price: 4,
    service: 5,
    communication: 5,
    overall: 4.6,
    comments: 'Excelente calidad en los informes. Muy profesionales.',
    wouldRecommend: true
  },
  {
    id: 'EVAL-002',
    providerId: 'PROV-002',
    providerName: 'TechSupport S.L.',
    evaluatorId: 'user-003',
    evaluatorName: 'Ana Martínez',
    evaluationDate: '2025-12-20',
    quality: 4,
    punctuality: 4,
    price: 3,
    service: 4,
    communication: 4,
    overall: 3.8,
    comments: 'Buen servicio, aunque los precios podrían ser más competitivos.',
    wouldRecommend: true
  },
  {
    id: 'EVAL-003',
    providerId: 'PROV-004',
    providerName: 'Procuradores Madrid',
    evaluatorId: 'user-001',
    evaluatorName: 'Juan Despacho',
    evaluationDate: '2025-11-10',
    quality: 5,
    punctuality: 5,
    price: 5,
    service: 5,
    communication: 5,
    overall: 5.0,
    comments: 'Impecables. Profesionales de confianza.',
    wouldRecommend: true
  }
];

// Estadísticas
export const proveedoresStats = {
  total: proveedoresData.length,
  active: proveedoresData.filter(p => p.status === 'active').length,
  inactive: proveedoresData.filter(p => p.status === 'inactive').length,
  pending: proveedoresData.filter(p => p.status === 'pending').length,
  totalInvoiced: proveedoresData.reduce((sum, p) => sum + p.totalInvoiced, 0),
  totalPending: proveedoresData.reduce((sum, p) => sum + p.pendingAmount, 0),
  byCategory: {
    peritajes: proveedoresData.filter(p => p.categories.includes('Peritajes')).length,
    informatica: proveedoresData.filter(p => p.categories.includes('Informática')).length,
    software: proveedoresData.filter(p => p.categories.includes('Software')).length,
    judicial: proveedoresData.filter(p => p.categories.includes('Judicial')).length,
  }
};

// Helpers
export const getProveedorStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'inactive':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'blocked':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getProveedorStatusText = (status: string) => {
  const translations: Record<string, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
    blocked: 'Bloqueado',
  };
  return translations[status] || status;
};

export const getFacturaStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'overdue':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'cancelled':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getFacturaStatusText = (status: string) => {
  const translations: Record<string, string> = {
    paid: 'Pagada',
    pending: 'Pendiente',
    overdue: 'Vencida',
    cancelled: 'Cancelada',
  };
  return translations[status] || status;
};
