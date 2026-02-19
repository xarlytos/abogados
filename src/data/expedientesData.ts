export const expedientesData = [
  { id: 'EXP-2024-001', title: 'Reclamación deuda Banco Santander', client: 'Juan Martínez', status: 'active', date: '15 Ene 2026', amount: '€15,000', priority: 'high', progress: 75, type: 'Civil', description: 'Reclamación de cantidad por préstamo hipotecario con cláusula suelo' },
  { id: 'EXP-2024-002', title: 'Divorcio contencioso', client: 'María García', status: 'pending', date: '18 Ene 2026', amount: '€8,500', priority: 'medium', progress: 30, type: 'Familiar', description: 'Procedimiento de divorcio con disputa sobre pensión compensatoria' },
  { id: 'EXP-2024-003', title: 'Despido improcedente TechCorp', client: 'Carlos López', status: 'active', date: '20 Ene 2026', amount: '€45,000', priority: 'high', progress: 60, type: 'Laboral', description: 'Reclamación por despido improcedente en empresa tecnológica' },
  { id: 'EXP-2024-004', title: 'Reclamación seguro hogar', client: 'Ana Rodríguez', status: 'closed', date: '10 Ene 2026', amount: '€12,000', priority: 'low', progress: 100, type: 'Civil', description: 'Reclamación por daños por inundación a aseguradora' },
  { id: 'EXP-2024-005', title: 'Constitución SL Innovatech', client: 'Pedro Sánchez', status: 'active', date: '22 Ene 2026', amount: '€3,500', priority: 'medium', progress: 45, type: 'Mercantil', description: 'Constitución de sociedad limitada y redacción de estatutos' },
  { id: 'EXP-2024-006', title: 'Delito fiscal Hacienda', client: 'Empresa XYZ', status: 'urgent', date: '25 Ene 2026', amount: '€85,000', priority: 'high', progress: 15, type: 'Penal', description: 'Defensa en procedimiento por presunto delito fiscal' },
  { id: 'EXP-2024-007', title: 'Herencia y testamentaría', client: 'Familia Ruiz', status: 'active', date: '28 Ene 2026', amount: '€22,000', priority: 'medium', progress: 50, type: 'Sucesiones', description: 'Partición de herencia con bienes inmuebles en varias provincias' },
  { id: 'EXP-2024-008', title: 'Reclamación deuda comercial', client: 'Constructora ABC', status: 'pending', date: '30 Ene 2026', amount: '€67,000', priority: 'high', progress: 25, type: 'Mercantil', description: 'Reclamación por impago de facturas de obra' },
  { id: 'EXP-2024-009', title: 'Modificación de medidas', client: 'Laura Torres', status: 'active', date: '02 Feb 2026', amount: '€4,200', priority: 'low', progress: 40, type: 'Familiar', description: 'Modificación de régimen de visitas y pensión alimenticia' },
  { id: 'EXP-2024-010', title: 'Accidente de tráfico', client: 'Miguel Ángel Pérez', status: 'urgent', date: '05 Feb 2026', amount: '€125,000', priority: 'high', progress: 10, type: 'Civil', description: 'Reclamación por accidente con lesiones graves' },
  { id: 'EXP-2024-011', title: 'Contrato de arrendamiento', client: 'Inmobiliaria Sol', status: 'active', date: '08 Feb 2026', amount: '€2,800', priority: 'low', progress: 80, type: 'Civil', description: 'Desahucio por impago de alquiler comercial' },
  { id: 'EXP-2024-012', title: 'Reestructuración de deuda', client: 'PYME Tecnológica SL', status: 'pending', date: '10 Feb 2026', amount: '€180,000', priority: 'medium', progress: 20, type: 'Mercantil', description: 'Concurso de acreedores y reestructuración de deuda' },
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
    case 'pending': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
    case 'closed': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    case 'urgent': return 'bg-red-500/20 text-red-500 border-red-500/30 animate-pulse';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-amber-500';
    case 'low': return 'text-emerald-500';
    default: return 'text-slate-400';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Activo';
    case 'pending': return 'Pendiente';
    case 'closed': return 'Cerrado';
    case 'urgent': return 'Urgente';
    default: return status;
  }
};
