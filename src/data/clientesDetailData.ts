import { clientesData, getStatusColor, getStatusText } from './clientesData';

// ============================================
// TIPOS
// ============================================

export interface ExpedienteCliente {
  id: string;
  titulo: string;
  tipo: string;
  estado: string;
  fechaInicio: string;
  valorEstimado: string;
}

export interface DocumentoCliente {
  id: string;
  nombre: string;
  tipo: string;
  fecha: string;
  tamaño: string;
}

export interface FacturaCliente {
  id: string;
  numero: string;
  concepto: string;
  fecha: string;
  importe: string;
  estado: 'pagada' | 'pendiente' | 'vencida';
}

export interface ActividadCliente {
  id: string;
  tipo: 'llamada' | 'email' | 'reunion' | 'documento' | 'expediente' | 'pago';
  descripcion: string;
  fecha: string;
  autor: string;
}

export interface ContactoCliente {
  id: string;
  nombre: string;
  cargo: string;
  email: string;
  telefono: string;
  esPrincipal: boolean;
}

export interface ClienteDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Particular' | 'Empresa';
  status: string;
  cases: number;
  totalBilled: string;
  lastActivity: string;
  address: string;
  joinDate: string;
  // Datos adicionales
  nif: string;
  notas: string;
  categoria: string;
  referidoPor: string;
  // Contactos (para empresas)
  contactos?: ContactoCliente[];
  // Expedientes
  expedientes: ExpedienteCliente[];
  // Documentos
  documentos: DocumentoCliente[];
  // Facturas
  facturas: FacturaCliente[];
  // Actividad
  actividades: ActividadCliente[];
  // Estadísticas
  stats: {
    totalExpedientes: number;
    expedientesActivos: number;
    totalFacturado: string;
    pendienteCobro: string;
    ultimaFactura: string;
    proximaAudiencia: string | null;
  };
}

// ============================================
// DATOS DE EJEMPLO
// ============================================

const clientesDetailData: ClienteDetail[] = [
  {
    id: 'CLI-001',
    name: 'Juan Martínez',
    email: 'juan.martinez@email.com',
    phone: '+34 612 345 678',
    type: 'Particular',
    status: 'active',
    cases: 2,
    totalBilled: '€25,500',
    lastActivity: '15 Ene 2026',
    address: 'Calle Mayor 123, Madrid',
    joinDate: '15 Mar 2024',
    nif: '12345678A',
    notas: 'Cliente preferente. Siempre paga puntualmente. Prefiere comunicación por email.',
    categoria: 'VIP',
    referidoPor: 'Dra. Ana Martínez',
    expedientes: [
      { id: 'EXP-2024-001', titulo: 'Divorcio Mutuo Acuerdo', tipo: 'Familia', estado: 'active', fechaInicio: '15 Mar 2024', valorEstimado: '€15,000' },
      { id: 'EXP-2024-045', titulo: 'Reclamación Laboral', tipo: 'Laboral', estado: 'pending', fechaInicio: '10 Ene 2025', valorEstimado: '€10,500' }
    ],
    documentos: [
      { id: 'DOC-001', nombre: 'DNI.pdf', tipo: 'pdf', fecha: '15 Mar 2024', tamaño: '1.2 MB' },
      { id: 'DOC-002', nombre: 'Contrato Matrimonial.pdf', tipo: 'pdf', fecha: '15 Mar 2024', tamaño: '3.5 MB' },
      { id: 'DOC-003', nombre: 'Nóminas 2024.pdf', tipo: 'pdf', fecha: '10 Ene 2025', tamaño: '2.1 MB' }
    ],
    facturas: [
      { id: 'FAC-001', numero: 'F-2024-001', concepto: 'Honorarios divorcio - Fase 1', fecha: '15 Abr 2024', importe: '€5,000', estado: 'pagada' },
      { id: 'FAC-002', numero: 'F-2024-045', concepto: 'Honorarios divorcio - Fase 2', fecha: '15 Jul 2024', importe: '€5,000', estado: 'pagada' },
      { id: 'FAC-003', numero: 'F-2025-012', concepto: 'Reclamación laboral - Inicio', fecha: '15 Ene 2025', importe: '€3,500', estado: 'pendiente' }
    ],
    actividades: [
      { id: 'ACT-001', tipo: 'reunion', descripcion: 'Reunión inicial para divorcio', fecha: '15 Mar 2024, 10:00', autor: 'Dr. Carlos Rodríguez' },
      { id: 'ACT-002', tipo: 'documento', descripcion: 'Documentación completa recibida', fecha: '18 Mar 2024, 14:30', autor: 'Secretaría' },
      { id: 'ACT-003', tipo: 'email', descripcion: 'Enviado borrador de convenio', fecha: '25 Mar 2024, 09:15', autor: 'Dr. Carlos Rodríguez' },
      { id: 'ACT-004', tipo: 'llamada', descripcion: 'Consulta sobre reclamación laboral', fecha: '08 Ene 2025, 11:00', autor: 'Recepción' },
      { id: 'ACT-005', tipo: 'expediente', descripcion: 'Nuevo expediente laboral abierto', fecha: '10 Ene 2025, 16:00', autor: 'Dr. Carlos Rodríguez' }
    ],
    stats: {
      totalExpedientes: 2,
      expedientesActivos: 2,
      totalFacturado: '€25,500',
      pendienteCobro: '€3,500',
      ultimaFactura: '15 Ene 2025',
      proximaAudiencia: '28 Feb 2026'
    }
  },
  {
    id: 'CLI-004',
    name: 'TechCorp SL',
    email: 'legal@techcorp.com',
    phone: '+34 915 123 456',
    type: 'Empresa',
    status: 'active',
    cases: 3,
    totalBilled: '€125,000',
    lastActivity: '12 Ene 2026',
    address: 'Paseo de la Castellana 100, Madrid',
    joinDate: '15 Ene 2023',
    nif: 'B12345678',
    notas: 'Empresa tecnológica con alto volumen de contratos. Requiere atención prioritaria. Facturación mensual.',
    categoria: 'Corporativo',
    referidoPor: 'Contacto directo',
    contactos: [
      { id: 'CON-001', nombre: 'Roberto García', cargo: 'Director Legal', email: 'roberto.garcia@techcorp.com', telefono: '+34 915 123 457', esPrincipal: true },
      { id: 'CON-002', nombre: 'Laura Méndez', cargo: 'RRHH', email: 'laura.mendez@techcorp.com', telefono: '+34 915 123 458', esPrincipal: false }
    ],
    expedientes: [
      { id: 'EXP-2023-012', titulo: 'Fusión con StartupX', tipo: 'Mercantil', estado: 'closed', fechaInicio: '15 Ene 2023', valorEstimado: '€50,000' },
      { id: 'EXP-2024-023', titulo: 'Auditoría Legal Anual', tipo: 'Mercantil', estado: 'active', fechaInicio: '01 Oct 2024', valorEstimado: '€25,000' },
      { id: 'EXP-2025-008', titulo: 'Conflicto con Proveedor', tipo: 'Mercantil', estado: 'active', fechaInicio: '12 Ene 2025', valorEstimado: '€50,000' }
    ],
    documentos: [
      { id: 'DOC-004', nombre: 'Escrituras Sociales.pdf', tipo: 'pdf', fecha: '15 Ene 2023', tamaño: '8.5 MB' },
      { id: 'DOC-005', nombre: 'Contrato Fusión.pdf', tipo: 'pdf', fecha: '20 Mar 2023', tamaño: '12.3 MB' },
      { id: 'DOC-006', nombre: 'Informe Auditoría 2024.pdf', tipo: 'pdf', fecha: '15 Dic 2024', tamaño: '5.7 MB' }
    ],
    facturas: [
      { id: 'FAC-004', numero: 'F-2023-012', concepto: 'Asesoría fusión', fecha: '15 Mar 2023', importe: '€25,000', estado: 'pagada' },
      { id: 'FAC-005', numero: 'F-2023-045', concepto: 'Cierre fusión', fecha: '15 Jun 2023', importe: '€25,000', estado: 'pagada' },
      { id: 'FAC-006', numero: 'F-2024-078', concepto: 'Auditoría legal Q4', fecha: '15 Ene 2025', importe: '€25,000', estado: 'pagada' },
      { id: 'FAC-007', numero: 'F-2025-023', concepto: 'Conflicto proveedor - Inicio', fecha: '20 Ene 2025', importe: '€15,000', estado: 'pendiente' }
    ],
    actividades: [
      { id: 'ACT-006', tipo: 'reunion', descripcion: 'Reunión inicial - Fusión StartupX', fecha: '15 Ene 2023, 09:00', autor: 'Socio Director' },
      { id: 'ACT-007', tipo: 'documento', descripcion: 'Due diligence completada', fecha: '20 Feb 2023, 18:00', autor: 'Equipo Legal' },
      { id: 'ACT-008', tipo: 'email', descripcion: 'Envío contrato definitivo', fecha: '15 Mar 2023, 10:30', autor: 'Socio Director' },
      { id: 'ACT-009', tipo: 'pago', descripcion: 'Pago recibido - Factura F-2023-012', fecha: '20 Mar 2023, 12:00', autor: 'Contabilidad' },
      { id: 'ACT-010', tipo: 'reunion', descripcion: 'Reunión conflicto proveedor', fecha: '12 Ene 2025, 11:00', autor: 'Dr. Carlos Rodríguez' }
    ],
    stats: {
      totalExpedientes: 3,
      expedientesActivos: 2,
      totalFacturado: '€125,000',
      pendienteCobro: '€15,000',
      ultimaFactura: '20 Ene 2025',
      proximaAudiencia: null
    }
  },
  {
    id: 'CLI-006',
    name: 'Constructora ABC',
    email: 'admin@constructoraabc.es',
    phone: '+34 916 789 012',
    type: 'Empresa',
    status: 'active',
    cases: 4,
    totalBilled: '€180,000',
    lastActivity: '22 Ene 2026',
    address: 'Calle Industria 50, Madrid',
    joinDate: '20 Nov 2022',
    nif: 'B87654321',
    notas: 'Cliente corporativo desde 2022. Alto volumen de litigios. Requiere seguimiento semanal.',
    categoria: 'VIP',
    referidoPor: 'Cámara de Comercio',
    contactos: [
      { id: 'CON-003', nombre: 'Miguel Ángel Torres', cargo: 'CEO', email: 'matorres@constructoraabc.es', telefono: '+34 916 789 013', esPrincipal: true },
      { id: 'CON-004', nombre: 'Carmen Ruiz', cargo: 'Directora Administrativa', email: 'cruiz@constructoraabc.es', telefono: '+34 916 789 014', esPrincipal: false }
    ],
    expedientes: [
      { id: 'EXP-2022-045', titulo: 'Reclamación Subcontratista A', tipo: 'Civil', estado: 'closed', fechaInicio: '20 Nov 2022', valorEstimado: '€45,000' },
      { id: 'EXP-2023-067', titulo: 'Conflicto Licencia Obra', tipo: 'Administrativo', estado: 'closed', fechaInicio: '15 Mar 2023', valorEstimado: '€30,000' },
      { id: 'EXP-2024-089', titulo: 'Reclamación Proveedor B', tipo: 'Mercantil', estado: 'active', fechaInicio: '10 Sep 2024', valorEstimado: '€55,000' },
      { id: 'EXP-2025-015', titulo: 'Defensa Seguro Responsabilidad', tipo: 'Civil', estado: 'active', fechaInicio: '22 Ene 2025', valorEstimado: '€50,000' }
    ],
    documentos: [
      { id: 'DOC-007', nombre: 'Contrato Obra Pública.pdf', tipo: 'pdf', fecha: '20 Nov 2022', tamaño: '15.2 MB' },
      { id: 'DOC-008', nombre: 'Póliza Seguro.pdf', tipo: 'pdf', fecha: '01 Ene 2023', tamaño: '4.8 MB' },
      { id: 'DOC-009', nombre: 'Contratos Subcontratistas.pdf', tipo: 'pdf', fecha: '10 Sep 2024', tamaño: '22.1 MB' }
    ],
    facturas: [
      { id: 'FAC-008', numero: 'F-2022-089', concepto: 'Reclamación subcontratista', fecha: '15 Dic 2022', importe: '€45,000', estado: 'pagada' },
      { id: 'FAC-009', numero: 'F-2023-056', concepto: 'Licencia obra', fecha: '15 Abr 2023', importe: '€30,000', estado: 'pagada' },
      { id: 'FAC-010', numero: 'F-2024-099', concepto: 'Reclamación proveedor Q3', fecha: '15 Oct 2024', importe: '€35,000', estado: 'pagada' },
      { id: 'FAC-011', numero: 'F-2025-034', concepto: 'Defensa seguro - Inicio', fecha: '25 Ene 2025', importe: '€20,000', estado: 'pendiente' }
    ],
    actividades: [
      { id: 'ACT-011', tipo: 'reunion', descripcion: 'Reunión inicial - Reclamación subcontratista', fecha: '20 Nov 2022, 10:00', autor: 'Socio Director' },
      { id: 'ACT-012', tipo: 'email', descripcion: 'Demanda presentada', fecha: '25 Nov 2022, 09:00', autor: 'Dr. Carlos Rodríguez' },
      { id: 'ACT-013', tipo: 'pago', descripcion: 'Pago recibido - Cierre expediente', fecha: '15 Dic 2022, 14:00', autor: 'Contabilidad' },
      { id: 'ACT-014', tipo: 'llamada', descripcion: 'Consulta urgente - Seguro', fecha: '22 Ene 2025, 08:30', autor: 'Recepción' },
      { id: 'ACT-015', tipo: 'expediente', descripcion: 'Nuevo expediente abierto', fecha: '22 Ene 2025, 10:00', autor: 'Dr. Carlos Rodríguez' }
    ],
    stats: {
      totalExpedientes: 4,
      expedientesActivos: 2,
      totalFacturado: '€180,000',
      pendienteCobro: '€20,000',
      ultimaFactura: '25 Ene 2025',
      proximaAudiencia: '15 Mar 2026'
    }
  }
];

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

export function getClienteById(id: string): ClienteDetail | null {
  // Primero buscar en los datos detallados
  const clienteDetail = clientesDetailData.find(c => c.id === id);
  if (clienteDetail) return clienteDetail;
  
  // Si no existe, crear uno a partir de los datos básicos
  const clienteBasico = clientesData.find(c => c.id === id);
  if (!clienteBasico) return null;
  
  // Crear datos de detalle a partir del cliente básico
  return {
    ...clienteBasico,
    type: clienteBasico.type as 'Particular' | 'Empresa',
    nif: clienteBasico.type === 'Empresa' ? 'B' + Math.random().toString(36).substring(2, 10).toUpperCase() : Math.random().toString(36).substring(2, 10).toUpperCase(),
    notas: 'Sin notas adicionales.',
    categoria: 'Estándar',
    referidoPor: 'No especificado',
    expedientes: Array.from({ length: clienteBasico.cases }, (_, i) => ({
      id: `EXP-${2024 - i}-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      titulo: `Expediente ${i + 1} de ${clienteBasico.name}`,
      tipo: ['Civil', 'Mercantil', 'Laboral', 'Familia'][Math.floor(Math.random() * 4)],
      estado: i === 0 ? 'active' : ['active', 'pending', 'closed'][Math.floor(Math.random() * 3)],
      fechaInicio: new Date(2024 - i, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      valorEstimado: `€${(Math.floor(Math.random() * 50) + 5) * 1000}`
    })),
    documentos: [
      { id: `DOC-${id}-1`, nombre: 'DNI_NIF.pdf', tipo: 'pdf', fecha: clienteBasico.joinDate, tamaño: '1.5 MB' },
      { id: `DOC-${id}-2`, nombre: 'Contrato_Servicios.pdf', tipo: 'pdf', fecha: clienteBasico.joinDate, tamaño: '2.3 MB' }
    ],
    facturas: [
      { id: `FAC-${id}-1`, numero: `F-2024-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`, concepto: 'Honorarios iniciales', fecha: clienteBasico.joinDate, importe: `€${Math.floor(Math.random() * 10) + 1},000`, estado: 'pagada' }
    ],
    actividades: [
      { id: `ACT-${id}-1`, tipo: 'reunion', descripcion: 'Reunión inicial con el cliente', fecha: `${clienteBasico.joinDate}, 10:00`, autor: 'Dr. Carlos Rodríguez' },
      { id: `ACT-${id}-2`, tipo: 'documento', descripcion: 'Documentación recibida', fecha: `${clienteBasico.joinDate}, 14:30`, autor: 'Secretaría' }
    ],
    stats: {
      totalExpedientes: clienteBasico.cases,
      expedientesActivos: Math.max(1, clienteBasico.cases - 1),
      totalFacturado: clienteBasico.totalBilled,
      pendienteCobro: `€${Math.floor(Math.random() * 5) * 1000}`,
      ultimaFactura: clienteBasico.lastActivity,
      proximaAudiencia: Math.random() > 0.5 ? '15 Mar 2026' : null
    }
  };
}

export function getExpedienteColor(tipo: string): string {
  const colors: Record<string, string> = {
    'Civil': 'bg-blue-500/20 text-blue-400',
    'Mercantil': 'bg-purple-500/20 text-purple-400',
    'Laboral': 'bg-amber-500/20 text-amber-400',
    'Familia': 'bg-pink-500/20 text-pink-400',
    'Administrativo': 'bg-emerald-500/20 text-emerald-400',
    'Penal': 'bg-red-500/20 text-red-400'
  };
  return colors[tipo] || 'bg-slate-500/20 text-slate-400';
}

export function getActividadColor(tipo: string): string {
  const colors: Record<string, string> = {
    'llamada': 'bg-emerald-500/20 text-emerald-400',
    'email': 'bg-blue-500/20 text-blue-400',
    'reunion': 'bg-purple-500/20 text-purple-400',
    'documento': 'bg-amber-500/20 text-amber-400',
    'expediente': 'bg-pink-500/20 text-pink-400',
    'pago': 'bg-emerald-500/20 text-emerald-400'
  };
  return colors[tipo] || 'bg-slate-500/20 text-slate-400';
}

export function getFacturaEstadoColor(estado: string): string {
  const colors: Record<string, string> = {
    'pagada': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'pendiente': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'vencida': 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  return colors[estado] || 'bg-slate-500/20 text-slate-400';
}

export { getStatusColor, getStatusText };