// Datos de ejemplo para Plantillas de Documentos

export interface Plantilla {
  id: string;
  title: string;
  description: string;
  category: 'contract' | 'court' | 'administrative' | 'communication' | 'corporate';
  type: 'word' | 'pdf' | 'excel';
  size: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  variables: Variable[];
  tags: string[];
  isPublic: boolean;
  downloadUrl: string;
}

export interface Variable {
  name: string;
  description: string;
  type: 'text' | 'date' | 'number' | 'boolean' | 'select';
  required: boolean;
  defaultValue?: string;
  options?: string[];
}

export interface CategoriaPlantilla {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

// Categorías
export const categoriasPlantillas: CategoriaPlantilla[] = [
  { id: 'contract', name: 'Contratos', description: 'Contratos tipo y acuerdos legales', icon: 'FileSignature', count: 12 },
  { id: 'court', name: 'Escritos Judiciales', description: 'Demandas, recursos y escritos procesales', icon: 'Gavel', count: 25 },
  { id: 'administrative', name: 'Administrativos', description: 'Formularios y documentos de gestión', icon: 'ClipboardList', count: 8 },
  { id: 'communication', name: 'Comunicaciones', description: 'Cartas, emails y notificaciones', icon: 'Mail', count: 15 },
  { id: 'corporate', name: 'Corporativos', description: 'Documentos de la firma', icon: 'Building', count: 6 },
];

// Plantillas de ejemplo
export const plantillasData: Plantilla[] = [
  {
    id: 'PLANT-001',
    title: 'Contrato de Arrendamiento',
    description: 'Contrato estándar de arrendamiento de vivienda conforme a LAU',
    category: 'contract',
    type: 'word',
    size: '45 KB',
    createdBy: 'super_admin',
    createdByName: 'Admin Sistema',
    createdAt: '2025-01-15',
    updatedAt: '2026-01-10',
    usageCount: 45,
    variables: [
      { name: 'numero_expediente', description: 'Número de expediente', type: 'text', required: true },
      { name: 'nombre_cliente', description: 'Nombre del arrendador (cliente)', type: 'text', required: true },
      { name: 'arrendador_dni', description: 'DNI/NIE del arrendador', type: 'text', required: true },
      { name: 'arrendatario_nombre', description: 'Nombre completo del arrendatario', type: 'text', required: true },
      { name: 'arrendatario_dni', description: 'DNI/NIE del arrendatario', type: 'text', required: true },
      { name: 'direccion_inmueble', description: 'Dirección completa del inmueble', type: 'text', required: true },
      { name: 'renta_mensual', description: 'Importe de la renta mensual', type: 'number', required: true },
      { name: 'fianza', description: 'Importe de la fianza', type: 'number', required: true },
      { name: 'duracion_años', description: 'Duración del contrato en años', type: 'number', required: true },
      { name: 'fecha_inicio', description: 'Fecha de inicio del contrato', type: 'date', required: true },
      { name: 'fecha_hoy', description: 'Fecha actual', type: 'date', required: true },
      { name: 'nombre_abogado', description: 'Abogado que redacta el contrato', type: 'text', required: false },
    ],
    tags: ['arrendamiento', 'LAU', 'vivienda', 'inmobiliario'],
    isPublic: true,
    downloadUrl: '#'
  },
  {
    id: 'PLANT-002',
    title: 'Demanda de Despido Improcedente',
    description: 'Modelo de demanda ante Juzgado de lo Social por despido',
    category: 'court',
    type: 'word',
    size: '38 KB',
    createdBy: 'socio',
    createdByName: 'Juan Despacho',
    createdAt: '2025-02-20',
    updatedAt: '2026-02-01',
    usageCount: 28,
    variables: [
      { name: 'numero_expediente', description: 'Número de expediente', type: 'text', required: true },
      { name: 'juzgado', description: 'Juzgado de lo Social', type: 'text', required: true },
      { name: 'numero_procedimiento', description: 'Número de procedimiento', type: 'text', required: false },
      { name: 'nombre_demandante', description: 'Nombre del trabajador (cliente)', type: 'text', required: true },
      { name: 'dni_demandante', description: 'DNI del trabajador', type: 'text', required: true },
      { name: 'nombre_demandado', description: 'Nombre de la empresa demandada', type: 'text', required: true },
      { name: 'cif_demandado', description: 'CIF de la empresa', type: 'text', required: true },
      { name: 'fecha_alta', description: 'Fecha de alta en la empresa', type: 'date', required: true },
      { name: 'fecha_despido', description: 'Fecha del despido', type: 'date', required: true },
      { name: 'fecha_hoy', description: 'Fecha actual', type: 'date', required: true },
      { name: 'salario_bruto_anual', description: 'Salario bruto anual', type: 'number', required: true },
      { name: 'cantidad_reclamada', description: 'Importe total reclamado', type: 'number', required: true },
      { name: 'categoria_profesional', description: 'Categoría profesional', type: 'text', required: true },
      { name: 'abogado_asignado', description: 'Abogado que presenta la demanda', type: 'text', required: true },
      { name: 'hechos', description: 'Relación de hechos', type: 'text', required: true },
    ],
    tags: ['laboral', 'despido', 'social', 'demanda'],
    isPublic: true,
    downloadUrl: '#'
  },
  {
    id: 'PLANT-003',
    title: 'Escrito de Demanda Civil',
    description: 'Modelo base para demanda en procedimiento civil ordinario',
    category: 'court',
    type: 'word',
    size: '42 KB',
    createdBy: 'abogado_senior',
    createdByName: 'María González',
    createdAt: '2025-03-10',
    updatedAt: '2025-12-15',
    usageCount: 67,
    variables: [
      { name: 'numero_expediente', description: 'Número de expediente', type: 'text', required: true },
      { name: 'juzgado', description: 'Juzgado al que se dirige', type: 'text', required: true },
      { name: 'numero_procedimiento', description: 'Número de procedimiento', type: 'text', required: false },
      { name: 'nombre_demandante', description: 'Nombre del demandante (cliente)', type: 'text', required: true },
      { name: 'nombre_demandado', description: 'Nombre del demandado', type: 'text', required: true },
      { name: 'nombre_cliente', description: 'Nombre del cliente', type: 'text', required: true },
      { name: 'fecha_hoy', description: 'Fecha actual', type: 'date', required: true },
      { name: 'cantidad_reclamada', description: 'Cantidad reclamada', type: 'number', required: true },
      { name: 'objeto_proceso', description: 'Objeto del proceso', type: 'text', required: true },
      { name: 'pretensiones', description: 'Pretensiones concretas', type: 'text', required: true },
      { name: 'fundamentos_derecho', description: 'Fundamentos de derecho', type: 'text', required: true },
      { name: 'pruebas', description: 'Relación de pruebas', type: 'text', required: true },
      { name: 'abogado_asignado', description: 'Abogado que presenta la demanda', type: 'text', required: true },
    ],
    tags: ['civil', 'demanda', 'ordinario', 'procesal'],
    isPublic: true,
    downloadUrl: '#'
  },
  {
    id: 'PLANT-004',
    title: 'Poder Notarial General',
    description: 'Poder general para pleitos con administración y disposición',
    category: 'contract',
    type: 'word',
    size: '28 KB',
    createdBy: 'socio',
    createdByName: 'Juan Despacho',
    createdAt: '2025-01-05',
    updatedAt: '2025-01-05',
    usageCount: 89,
    variables: [
      { name: 'nombre_otorgante', description: 'Nombre del otorgante', type: 'text', required: true },
      { name: 'dni_otorgante', description: 'DNI del otorgante', type: 'text', required: true },
      { name: 'nombre_apoderado', description: 'Nombre del apoderado', type: 'text', required: true },
      { name: 'dni_apoderado', description: 'DNI del apoderado', type: 'text', required: true },
      { name: 'fecha_otorgamiento', description: 'Fecha de otorgamiento', type: 'date', required: true },
    ],
    tags: ['poder', 'notarial', 'general', 'representación'],
    isPublic: true,
    downloadUrl: '#'
  },
  {
    id: 'PLANT-005',
    title: 'Carta de Despido',
    description: 'Modelo de carta de despido con preaviso',
    category: 'communication',
    type: 'word',
    size: '22 KB',
    createdBy: 'abogado_senior',
    createdByName: 'María González',
    createdAt: '2025-04-12',
    updatedAt: '2025-08-20',
    usageCount: 15,
    variables: [
      { name: 'nombre_trabajador', description: 'Nombre del trabajador', type: 'text', required: true },
      { name: 'dni_trabajador', description: 'DNI del trabajador', type: 'text', required: true },
      { name: 'nombre_empresa', description: 'Nombre de la empresa', type: 'text', required: true },
      { name: 'fecha_efectiva', description: 'Fecha efectiva del despido', type: 'date', required: true },
      { name: 'causa_despido', description: 'Causa del despido', type: 'text', required: true },
      { name: 'indemnizacion', description: 'Importe de la indemnización', type: 'number', required: false },
    ],
    tags: ['laboral', 'despido', 'carta', 'comunicación'],
    isPublic: true,
    downloadUrl: '#'
  },
  {
    id: 'PLANT-006',
    title: 'Hoja de Gastos',
    description: 'Plantilla para justificación de gastos del bufete',
    category: 'administrative',
    type: 'excel',
    size: '18 KB',
    createdBy: 'administrador',
    createdByName: 'Ana Martínez',
    createdAt: '2025-01-20',
    updatedAt: '2025-06-10',
    usageCount: 156,
    variables: [
      { name: 'nombre_abogado', description: 'Nombre del abogado', type: 'text', required: true },
      { name: 'mes', description: 'Mes de los gastos', type: 'select', required: true, options: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] },
      { name: 'año', description: 'Año', type: 'number', required: true },
    ],
    tags: ['gastos', 'administrativo', 'justificación', 'contabilidad'],
    isPublic: true,
    downloadUrl: '#'
  },
  {
    id: 'PLANT-007',
    title: 'Membrete Corporativo',
    description: 'Membrete oficial del bufete para documentos',
    category: 'corporate',
    type: 'word',
    size: '35 KB',
    createdBy: 'socio',
    createdByName: 'Juan Despacho',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-15',
    usageCount: 234,
    variables: [
      { name: 'fecha_documento', description: 'Fecha del documento', type: 'date', required: true },
      { name: 'numero_ref', description: 'Número de referencia', type: 'text', required: false },
    ],
    tags: ['membrete', 'corporativo', 'identidad', 'marca'],
    isPublic: true,
    downloadUrl: '#'
  },
  {
    id: 'PLANT-008',
    title: 'Recurso de Apelación',
    description: 'Modelo de recurso de apelación civil',
    category: 'court',
    type: 'word',
    size: '40 KB',
    createdBy: 'abogado_senior',
    createdByName: 'María González',
    createdAt: '2025-05-15',
    updatedAt: '2025-11-20',
    usageCount: 19,
    variables: [
      { name: 'nombre_recurrente', description: 'Nombre del recurrente', type: 'text', required: true },
      { name: 'nombre_recurredo', description: 'Nombre del recurrido', type: 'text', required: true },
      { name: 'numero_resolucion', description: 'Número de resolución apelada', type: 'text', required: true },
      { name: 'fecha_resolucion', description: 'Fecha de la resolución', type: 'date', required: true },
      { name: 'fundamentos_apelacion', description: 'Fundamentos de la apelación', type: 'text', required: true },
    ],
    tags: ['apelación', 'recurso', 'civil', 'procesal'],
    isPublic: true,
    downloadUrl: '#'
  },
  {
    id: 'PLANT-009',
    title: 'Carta de Aviso de Vencimiento',
    description: 'Carta de recordatorio de vencimiento de plazo',
    category: 'communication',
    type: 'word',
    size: '20 KB',
    createdBy: 'secretario',
    createdByName: 'Luis Martínez',
    createdAt: '2025-02-28',
    updatedAt: '2025-09-05',
    usageCount: 78,
    variables: [
      { name: 'nombre_cliente', description: 'Nombre del cliente', type: 'text', required: true },
      { name: 'concepto_vencimiento', description: 'Concepto que vence', type: 'text', required: true },
      { name: 'fecha_vencimiento', description: 'Fecha de vencimiento', type: 'date', required: true },
      { name: 'accion_requerida', description: 'Acción requerida', type: 'text', required: true },
    ],
    tags: ['carta', 'vencimiento', 'recordatorio', 'plazo'],
    isPublic: true,
    downloadUrl: '#'
  },
  {
    id: 'PLANT-010',
    title: 'Contrato de Honorarios',
    description: 'Contrato de prestación de servicios legales',
    category: 'contract',
    type: 'word',
    size: '52 KB',
    createdBy: 'socio',
    createdByName: 'Juan Despacho',
    createdAt: '2024-11-15',
    updatedAt: '2026-01-05',
    usageCount: 112,
    variables: [
      { name: 'numero_expediente', description: 'Número de expediente', type: 'text', required: true },
      { name: 'nombre_cliente', description: 'Nombre del cliente', type: 'text', required: true },
      { name: 'dni_cliente', description: 'DNI del cliente', type: 'text', required: true },
      { name: 'cliente_email', description: 'Email del cliente', type: 'text', required: false },
      { name: 'cliente_telefono', description: 'Teléfono del cliente', type: 'text', required: false },
      { name: 'materia_servicio', description: 'Materia del servicio (tipo de expediente)', type: 'text', required: true },
      { name: 'titulo_expediente', description: 'Descripción del caso', type: 'text', required: true },
      { name: 'honorarios_fijos', description: 'Honorarios fijos', type: 'number', required: false },
      { name: 'importe_total', description: 'Importe total del contrato', type: 'number', required: true },
      { name: 'porcentaje_exito', description: 'Porcentaje éxito', type: 'number', required: false },
      { name: 'forma_pago', description: 'Forma de pago', type: 'select', required: true, options: ['Mensual', 'Trimestral', 'A la conclusión', 'Por fases'] },
      { name: 'fecha_hoy', description: 'Fecha actual', type: 'date', required: true },
      { name: 'nombre_abogado', description: 'Abogado responsable', type: 'text', required: true },
      { name: 'email_abogado', description: 'Email del abogado', type: 'text', required: false },
    ],
    tags: ['honorarios', 'contrato', 'cliente', 'servicios'],
    isPublic: true,
    downloadUrl: '#'
  }
];

// Estadísticas
export const plantillasStats = {
  total: plantillasData.length,
  byCategory: {
    contract: plantillasData.filter(p => p.category === 'contract').length,
    court: plantillasData.filter(p => p.category === 'court').length,
    administrative: plantillasData.filter(p => p.category === 'administrative').length,
    communication: plantillasData.filter(p => p.category === 'communication').length,
    corporate: plantillasData.filter(p => p.category === 'corporate').length,
  },
  totalUsage: plantillasData.reduce((sum, p) => sum + p.usageCount, 0),
  mostUsed: plantillasData.sort((a, b) => b.usageCount - a.usageCount).slice(0, 3),
  recentlyUpdated: plantillasData.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5),
};

// Helpers
export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'contract':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'court':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'administrative':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'communication':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'corporate':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const getCategoryText = (category: string) => {
  switch (category) {
    case 'contract':
      return 'Contrato';
    case 'court':
      return 'Judicial';
    case 'administrative':
      return 'Administrativo';
    case 'communication':
      return 'Comunicación';
    case 'corporate':
      return 'Corporativo';
    default:
      return category;
  }
};

export const getFileIcon = (type: string) => {
  switch (type) {
    case 'word':
      return 'file-text';
    case 'excel':
      return 'table';
    case 'pdf':
      return 'file';
    default:
      return 'file';
  }
};
