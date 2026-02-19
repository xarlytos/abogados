export const clientesData = [
  { id: 'CLI-001', name: 'Juan Martínez', email: 'juan.martinez@email.com', phone: '+34 612 345 678', type: 'Particular', status: 'active', cases: 2, totalBilled: '€25,500', lastActivity: '15 Ene 2026', address: 'Calle Mayor 123, Madrid', joinDate: '2024-03-15' },
  { id: 'CLI-002', name: 'María García', email: 'maria.garcia@email.com', phone: '+34 623 456 789', type: 'Particular', status: 'active', cases: 1, totalBilled: '€8,500', lastActivity: '18 Ene 2026', address: 'Av. Libertad 45, Barcelona', joinDate: '2024-06-22' },
  { id: 'CLI-003', name: 'Carlos López', email: 'carlos.lopez@email.com', phone: '+34 634 567 890', type: 'Particular', status: 'active', cases: 1, totalBilled: '€45,000', lastActivity: '20 Ene 2026', address: 'Calle Sol 78, Valencia', joinDate: '2024-08-10' },
  { id: 'CLI-004', name: 'TechCorp SL', email: 'legal@techcorp.com', phone: '+34 915 123 456', type: 'Empresa', status: 'active', cases: 3, totalBilled: '€125,000', lastActivity: '12 Ene 2026', address: 'Paseo de la Castellana 100, Madrid', joinDate: '2023-01-15' },
  { id: 'CLI-005', name: 'Ana Rodríguez', email: 'ana.rodriguez@email.com', phone: '+34 645 678 901', type: 'Particular', status: 'inactive', cases: 1, totalBilled: '€12,000', lastActivity: '10 Ene 2026', address: 'Plaza Nueva 12, Sevilla', joinDate: '2024-09-05' },
  { id: 'CLI-006', name: 'Constructora ABC', email: 'admin@constructoraabc.es', phone: '+34 916 789 012', type: 'Empresa', status: 'active', cases: 4, totalBilled: '€180,000', lastActivity: '22 Ene 2026', address: 'Calle Industria 50, Madrid', joinDate: '2022-11-20' },
  { id: 'CLI-007', name: 'Pedro Sánchez', email: 'pedro.sanchez@email.com', phone: '+34 656 789 012', type: 'Particular', status: 'active', cases: 1, totalBilled: '€3,500', lastActivity: '22 Ene 2026', address: 'Calle Luna 33, Madrid', joinDate: '2024-12-01' },
  { id: 'CLI-008', name: 'Empresa XYZ', email: 'info@xyz.com', phone: '+34 917 890 123', type: 'Empresa', status: 'active', cases: 2, totalBilled: '€95,000', lastActivity: '25 Ene 2026', address: 'Av. Diagonal 200, Barcelona', joinDate: '2023-05-18' },
  { id: 'CLI-009', name: 'Laura Torres', email: 'laura.torres@email.com', phone: '+34 667 890 123', type: 'Particular', status: 'active', cases: 1, totalBilled: '€4,200', lastActivity: '02 Feb 2026', address: 'Calle Mar 15, Málaga', joinDate: '2025-01-10' },
  { id: 'CLI-010', name: 'Inmobiliaria Sol', email: 'contacto@inmosol.es', phone: '+34 918 901 234', type: 'Empresa', status: 'active', cases: 5, totalBilled: '€45,000', lastActivity: '08 Feb 2026', address: 'Calle Real 88, Madrid', joinDate: '2023-08-30' },
  { id: 'CLI-011', name: 'Miguel Ángel Pérez', email: 'maperez@email.com', phone: '+34 678 901 234', type: 'Particular', status: 'active', cases: 1, totalBilled: '€35,000', lastActivity: '05 Feb 2026', address: 'Av. América 77, Madrid', joinDate: '2025-01-15' },
  { id: 'CLI-012', name: 'PYME Tecnológica SL', email: 'admin@pymetec.es', phone: '+34 919 012 345', type: 'Empresa', status: 'pending', cases: 1, totalBilled: '€15,000', lastActivity: '10 Feb 2026', address: 'Calle Tecnología 25, Barcelona', joinDate: '2025-02-01' },
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
    case 'pending': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
    case 'inactive': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Activo';
    case 'pending': return 'Pendiente';
    case 'inactive': return 'Inactivo';
    default: return status;
  }
};
