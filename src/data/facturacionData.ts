export const facturasData = [
  { id: 'FAC-2024-240', client: 'TechCorp SL', concept: 'Servicios legales - Asesoramiento continuo Q4', date: '15 Ene 2026', dueDate: '15 Feb 2026', amount: 15000, status: 'paid', method: 'Transferencia', type: 'Empresa', expedition: 'EXP-2024-004' },
  { id: 'FAC-2024-239', client: 'María García', concept: 'Divorcio contencioso - Honorarios', date: '12 Ene 2026', dueDate: '12 Feb 2026', amount: 4250, status: 'pending', method: '-', type: 'Particular', expedition: 'EXP-2024-002' },
  { id: 'FAC-2024-238', client: 'Constructora ABC', concept: 'Reclamación deuda comercial - Éxito', date: '10 Ene 2026', dueDate: '10 Feb 2026', amount: 25500, status: 'overdue', method: '-', type: 'Empresa', expedition: 'EXP-2024-008' },
  { id: 'FAC-2024-237', client: 'Juan Martínez', concept: 'Reclamación cláusula suelo - 2ª cuota', date: '08 Ene 2026', dueDate: '08 Feb 2026', amount: 5000, status: 'paid', method: 'Tarjeta', type: 'Particular', expedition: 'EXP-2024-001' },
  { id: 'FAC-2024-236', client: 'Empresa XYZ', concept: 'Defensa delito fiscal - Anticipo', date: '05 Ene 2026', dueDate: '05 Feb 2026', amount: 15000, status: 'paid', method: 'Transferencia', type: 'Empresa', expedition: 'EXP-2024-006' },
  { id: 'FAC-2024-235', client: 'Carlos López', concept: 'Despido improcedente - Honorarios', date: '02 Ene 2026', dueDate: '02 Feb 2026', amount: 12500, status: 'pending', method: '-', type: 'Particular', expedition: 'EXP-2024-003' },
  { id: 'FAC-2024-234', client: 'Inmobiliaria Sol', concept: 'Desahucio comercial - Servicios', date: '28 Dic 2025', dueDate: '28 Ene 2026', amount: 3200, status: 'paid', method: 'Transferencia', type: 'Empresa', expedition: 'EXP-2024-011' },
  { id: 'FAC-2024-233', client: 'PYME Tecnológica SL', concept: 'Concurso acreedores - Inicio', date: '25 Dic 2025', dueDate: '25 Ene 2026', amount: 8500, status: 'pending', method: '-', type: 'Empresa', expedition: 'EXP-2024-012' },
  { id: 'FAC-2024-232', client: 'Miguel Ángel Pérez', concept: 'Accidente tráfico - Anticipo', date: '22 Dic 2025', dueDate: '22 Ene 2026', amount: 7000, status: 'paid', method: 'Tarjeta', type: 'Particular', expedition: 'EXP-2024-010' },
  { id: 'FAC-2024-231', client: 'Laura Torres', concept: 'Modificación medidas - Honorarios', date: '20 Dic 2025', dueDate: '20 Ene 2026', amount: 2100, status: 'overdue', method: '-', type: 'Particular', expedition: 'EXP-2024-009' },
  { id: 'FAC-2024-230', client: 'Ana Rodríguez', concept: 'Reclamación seguro - Éxito', date: '18 Dic 2025', dueDate: '18 Ene 2026', amount: 6000, status: 'paid', method: 'Transferencia', type: 'Particular', expedition: 'EXP-2024-004' },
  { id: 'FAC-2024-229', client: 'Pedro Sánchez', concept: 'Constitución SL - Servicios', date: '15 Dic 2025', dueDate: '15 Ene 2026', amount: 3500, status: 'paid', method: 'Tarjeta', type: 'Particular', expedition: 'EXP-2024-005' },
];

export const monthlyData = [
  { month: 'Ene', current: 38450, previous: 35000, expenses: 15000 },
  { month: 'Feb', current: 42000, previous: 38000, expenses: 16500 },
  { month: 'Mar', current: 0, previous: 42000, expenses: 18000 },
  { month: 'Abr', current: 0, previous: 45000, expenses: 17500 },
  { month: 'May', current: 0, previous: 52000, expenses: 22000 },
  { month: 'Jun', current: 0, previous: 48000, expenses: 20000 },
  { month: 'Jul', current: 0, previous: 55000, expenses: 23000 },
  { month: 'Ago', current: 0, previous: 51000, expenses: 21000 },
  { month: 'Sep', current: 0, previous: 58000, expenses: 24000 },
  { month: 'Oct', current: 0, previous: 62000, expenses: 25000 },
  { month: 'Nov', current: 0, previous: 59000, expenses: 23000 },
  { month: 'Dic', current: 0, previous: 45200, expenses: 19000 },
];

export const byTypeData = [
  { type: 'Civil', amount: 125000, count: 45, percentage: 35, color: 'bg-blue-500' },
  { type: 'Laboral', amount: 98000, count: 32, percentage: 28, color: 'bg-emerald-500' },
  { type: 'Mercantil', amount: 87000, count: 28, percentage: 25, color: 'bg-purple-500' },
  { type: 'Penal', amount: 42000, count: 12, percentage: 12, color: 'bg-red-500' },
];

export const byClientType = [
  { type: 'Empresas', amount: 168200, count: 5, percentage: 62 },
  { type: 'Particulares', amount: 103150, count: 7, percentage: 38 },
];

export const upcomingAlerts = [
  { id: 1, client: 'María García', invoice: 'FAC-2024-239', amount: 4250, daysLeft: 2, type: 'warning' },
  { id: 2, client: 'Carlos López', invoice: 'FAC-2024-235', amount: 12500, daysLeft: 0, type: 'due' },
  { id: 3, client: 'PYME Tecnológica', invoice: 'FAC-2024-233', amount: 8500, daysLeft: 5, type: 'warning' },
];

export const recentPayments = [
  { id: 1, client: 'TechCorp SL', amount: 15000, date: 'Hoy, 10:30', method: 'Transferencia' },
  { id: 2, client: 'Juan Martínez', amount: 5000, date: 'Ayer, 16:45', method: 'Tarjeta' },
  { id: 3, client: 'Empresa XYZ', amount: 15000, date: '05 Ene, 09:20', method: 'Transferencia' },
  { id: 4, client: 'Inmobiliaria Sol', amount: 3200, date: '28 Dic, 14:15', method: 'Transferencia' },
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
    case 'pending': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
    case 'overdue': return 'bg-red-500/20 text-red-500 border-red-500/30';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'paid': return 'Pagada';
    case 'pending': return 'Pendiente';
    case 'overdue': return 'Vencida';
    default: return status;
  }
};
