export const financialData = {
  monthlyRevenue: [
    { month: 'Ene', value: 35000, target: 40000 },
    { month: 'Feb', value: 42000, target: 40000 },
    { month: 'Mar', value: 38000, target: 40000 },
    { month: 'Abr', value: 45000, target: 42000 },
    { month: 'May', value: 52000, target: 45000 },
    { month: 'Jun', value: 48000, target: 45000 },
    { month: 'Jul', value: 55000, target: 48000 },
    { month: 'Ago', value: 51000, target: 48000 },
    { month: 'Sep', value: 58000, target: 50000 },
    { month: 'Oct', value: 62000, target: 52000 },
    { month: 'Nov', value: 59000, target: 52000 },
    { month: 'Dic', value: 45200, target: 50000 },
  ],
  caseTypes: [
    { type: 'Civil', count: 45, percentage: 35, color: 'bg-blue-500', amount: '€425,000' },
    { type: 'Laboral', count: 32, percentage: 25, color: 'bg-emerald-500', amount: '€380,000' },
    { type: 'Penal', count: 24, percentage: 19, color: 'bg-red-500', amount: '€290,000' },
    { type: 'Mercantil', count: 18, percentage: 14, color: 'bg-purple-500', amount: '€520,000' },
    { type: 'Familiar', count: 9, percentage: 7, color: 'bg-amber-500', amount: '€95,000' },
  ],
  quarterlyPerformance: [
    { quarter: 'Q1 2025', revenue: 115000, expenses: 45000, profit: 70000 },
    { quarter: 'Q2 2025', revenue: 145000, expenses: 52000, profit: 93000 },
    { quarter: 'Q3 2025', revenue: 164000, expenses: 58000, profit: 106000 },
    { quarter: 'Q4 2025', revenue: 166200, expenses: 61000, profit: 105200 },
  ],
};

export const recentReports = [
  { id: 1, title: 'Informe de Facturación - Enero 2026', type: 'Financiero', date: '01 Feb 2026', size: '2.4 MB', format: 'PDF' },
  { id: 2, title: 'Análisis de Expedientes - Q4 2025', type: 'Operativo', date: '15 Ene 2026', size: '1.8 MB', format: 'PDF' },
  { id: 3, title: 'Resumen de Clientes - 2025', type: 'Clientes', date: '10 Ene 2026', size: '3.2 MB', format: 'XLSX' },
  { id: 4, title: 'Informe de Productividad - Dic 2025', type: 'RRHH', date: '05 Ene 2026', size: '1.5 MB', format: 'PDF' },
  { id: 5, title: 'Estado de Plazos - Semana 4', type: 'Operativo', date: '28 Ene 2026', size: '890 KB', format: 'PDF' },
];

export const kpis = [
  { label: 'Facturación Anual', value: '€590.2K', change: '+18.5%', trend: 'up', icon: 'Euro', color: 'emerald', description: 'vs año anterior' },
  { label: 'Expedientes Resueltos', value: '127', change: '+23', trend: 'up', icon: 'Briefcase', color: 'blue', description: 'este año' },
  { label: 'Tasa de Éxito', value: '94%', change: '+2%', trend: 'up', icon: 'Target', color: 'amber', description: 'casos favorables' },
  { label: 'Horas Facturadas', value: '2,840h', change: '+12%', trend: 'up', icon: 'Clock', color: 'purple', description: 'promedio mensual' },
];
