// Datos extendidos para expedientes individuales

export interface Documento {
  id: string;
  nombre: string;
  tipo: 'pdf' | 'doc' | 'docx' | 'jpg' | 'png' | 'xls' | 'xlsx' | 'otro';
  tamaño: string;
  fecha: string;
  autor: string;
  categoria: 'demanda' | 'escritura' | 'evidencia' | 'correspondencia' | 'factura' | 'otro';
  firmado: boolean;
}

export interface Actividad {
  id: string;
  tipo: 'creacion' | 'edicion' | 'documento' | 'tarea' | 'audiencia' | 'nota' | 'estado';
  descripcion: string;
  fecha: string;
  autor: string;
  metadata?: Record<string, string>;
}

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  prioridad: 'alta' | 'media' | 'baja';
  fechaLimite: string;
  asignadoA: string;
  creadoPor: string;
}

export interface Audiencia {
  id: string;
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
  tipo: 'audiencia' | 'mediacion' | 'declaracion' | 'vista' | 'otro';
  estado: 'programada' | 'realizada' | 'cancelada';
  notas?: string;
}

export interface Nota {
  id: string;
  contenido: string;
  fecha: string;
  autor: string;
  tipo: 'general' | 'estrategia' | 'cliente' | 'interna';
}

export interface Equipo {
  abogadoAsignado: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  };
  supervisor?: {
    id: string;
    nombre: string;
    email: string;
  };
  colaboradores: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  }[];
}

export interface Finanzas {
  importeTotal: string;
  gastos: string;
  facturado: string;
  cobrado: string;
  pendienteCobro: string;
  moneda: string;
}

export interface ExpedienteDetail {
  id: string;
  titulo: string;
  cliente: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  estado: 'active' | 'pending' | 'urgent' | 'closed';
  prioridad: 'high' | 'medium' | 'low';
  tipo: string;
  fechaInicio: string;
  fechaActualizacion: string;
  fechaCierre?: string;
  descripcion: string;
  progreso: number;
  equipo: Equipo;
  finanzas: Finanzas;
  documentos: Documento[];
  actividades: Actividad[];
  tareas: Tarea[];
  audiencias: Audiencia[];
  notas: Nota[];
  numeroProcedimiento?: string;
  juzgado?: string;
  antecedentes?: string;
}

// Datos de expedientes detallados
export const expedientesDetailData: Record<string, ExpedienteDetail> = {
  'EXP-2024-001': {
    id: 'EXP-2024-001',
    titulo: 'Reclamación deuda Banco Santander',
    cliente: 'Juan Martínez',
    clienteEmail: 'juan.martinez@email.com',
    clienteTelefono: '+34 612 345 678',
    estado: 'active',
    prioridad: 'high',
    tipo: 'Civil',
    fechaInicio: '15 Ene 2026',
    fechaActualizacion: '10 Feb 2026',
    descripcion: 'Reclamación de cantidad por préstamo hipotecario con cláusula suelo. El cliente solicitó la nulidad de la cláusula suelo y la devolución de las cantidades indebidamente cobradas.',
    progreso: 75,
    numeroProcedimiento: '256/2026',
    juzgado: 'Juzgado de Primera Instancia nº 8 de Madrid',
    equipo: {
      abogadoAsignado: {
        id: 'abogado_senior_1',
        nombre: 'Carlos Méndez',
        email: 'cmendez@bufete.com',
        rol: 'Abogado Senior'
      },
      supervisor: {
        id: 'socio_1',
        nombre: 'Dr. García',
        email: 'dgarcia@bufete.com'
      },
      colaboradores: [
        {
          id: 'paralegal_1',
          nombre: 'Ana López',
          email: 'alopez@bufete.com',
          rol: 'Paralegal'
        }
      ]
    },
    finanzas: {
      importeTotal: '€15,000',
      gastos: '€2,500',
      facturado: '€8,000',
      cobrado: '€5,000',
      pendienteCobro: '€3,000',
      moneda: 'EUR'
    },
    documentos: [
      { id: 'doc-001', nombre: 'Demanda inicial.pdf', tipo: 'pdf', tamaño: '2.5 MB', fecha: '15 Ene 2026', autor: 'Carlos Méndez', categoria: 'demanda', firmado: true },
      { id: 'doc-002', nombre: 'Contrato préstamo.pdf', tipo: 'pdf', tamaño: '1.8 MB', fecha: '15 Ene 2026', autor: 'Juan Martínez', categoria: 'escritura', firmado: false },
      { id: 'doc-003', nombre: 'Escrito de alegaciones.docx', tipo: 'docx', tamaño: '450 KB', fecha: '20 Ene 2026', autor: 'Carlos Méndez', categoria: 'demanda', firmado: false },
      { id: 'doc-004', nombre: 'Informe pericial.pdf', tipo: 'pdf', tamaño: '3.2 MB', fecha: '25 Ene 2026', autor: 'Perito Judicial', categoria: 'evidencia', firmado: true },
      { id: 'doc-005', nombre: 'Correspondencia banco.pdf', tipo: 'pdf', tamaño: '850 KB', fecha: '10 Feb 2026', autor: 'Ana López', categoria: 'correspondencia', firmado: false },
    ],
    actividades: [
      { id: 'act-001', tipo: 'creacion', descripcion: 'Expediente creado', fecha: '15 Ene 2026 09:30', autor: 'Carlos Méndez' },
      { id: 'act-002', tipo: 'documento', descripcion: 'Documento subido: Demanda inicial.pdf', fecha: '15 Ene 2026 10:15', autor: 'Carlos Méndez' },
      { id: 'act-003', tipo: 'estado', descripcion: 'Estado cambiado a Activo', fecha: '15 Ene 2026 11:00', autor: 'Carlos Méndez' },
      { id: 'act-004', tipo: 'documento', descripcion: 'Documento subido: Informe pericial.pdf', fecha: '25 Ene 2026 14:20', autor: 'Ana López' },
      { id: 'act-005', tipo: 'tarea', descripcion: 'Tarea completada: Revisión de contrato', fecha: '28 Ene 2026 16:45', autor: 'Carlos Méndez' },
      { id: 'act-006', tipo: 'audiencia', descripcion: 'Audiencia programada para el 15 Mar 2026', fecha: '05 Feb 2026 09:00', autor: 'Dr. García' },
    ],
    tareas: [
      { id: 'task-001', titulo: 'Preparar alegaciones finales', descripcion: 'Redactar escritura de alegaciones para la próxima audiencia', estado: 'en_progreso', prioridad: 'alta', fechaLimite: '12 Feb 2026', asignadoA: 'Carlos Méndez', creadoPor: 'Dr. García' },
      { id: 'task-002', titulo: 'Organizar documentación', descripcion: 'Clasificar y numerar todos los documentos del expediente', estado: 'completada', prioridad: 'media', fechaLimite: '05 Feb 2026', asignadoA: 'Ana López', creadoPor: 'Carlos Méndez' },
      { id: 'task-003', titulo: 'Notificar al cliente', descripcion: 'Informar al cliente sobre la fecha de audiencia', estado: 'pendiente', prioridad: 'media', fechaLimite: '08 Feb 2026', asignadoA: 'Ana López', creadoPor: 'Carlos Méndez' },
    ],
    audiencias: [
      { id: 'aud-001', titulo: 'Audiencia Preparatoria', fecha: '15 Mar 2026', hora: '10:00', lugar: 'Juzgado de Primera Instancia nº 8 de Madrid', tipo: 'audiencia', estado: 'programada', notas: 'Llevar documentación original y copias' },
      { id: 'aud-002', titulo: 'Mediación previa', fecha: '20 Ene 2026', hora: '09:30', lugar: 'Servicio de Mediación de Madrid', tipo: 'mediacion', estado: 'realizada', notas: 'Sin acuerdo alcanzado' },
    ],
    notas: [
      { id: 'nota-001', contenido: 'El cliente está muy satisfecho con el progreso del caso. Quiere que nos centremos en recuperar el máximo dinero posible.', fecha: '20 Ene 2026', autor: 'Carlos Méndez', tipo: 'cliente' },
      { id: 'nota-002', contenido: 'Estrategia: Enfatizar la nulidad de la cláusula suelo por falta de transparencia. Precedentes favorables recientes.', fecha: '25 Ene 2026', autor: 'Dr. García', tipo: 'estrategia' },
    ]
  },
  'EXP-2024-002': {
    id: 'EXP-2024-002',
    titulo: 'Divorcio contencioso',
    cliente: 'María García',
    clienteEmail: 'maria.garcia@email.com',
    clienteTelefono: '+34 623 456 789',
    estado: 'pending',
    prioridad: 'medium',
    tipo: 'Familiar',
    fechaInicio: '18 Ene 2026',
    fechaActualizacion: '08 Feb 2026',
    descripcion: 'Procedimiento de divorcio con disputa sobre pensión compensatoria y régimen de visitas de los hijos menores.',
    progreso: 30,
    equipo: {
      abogadoAsignado: {
        id: 'abogado_junior_1',
        nombre: 'Juan Pérez',
        email: 'jperez@bufete.com',
        rol: 'Abogado Junior'
      },
      supervisor: {
        id: 'abogado_senior_1',
        nombre: 'Carlos Méndez',
        email: 'cmendez@bufete.com'
      },
      colaboradores: []
    },
    finanzas: {
      importeTotal: '€8,500',
      gastos: '€800',
      facturado: '€2,500',
      cobrado: '€2,500',
      pendienteCobro: '€0',
      moneda: 'EUR'
    },
    documentos: [
      { id: 'doc-101', nombre: 'Demanda divorcio.pdf', tipo: 'pdf', tamaño: '1.5 MB', fecha: '18 Ene 2026', autor: 'Juan Pérez', categoria: 'demanda', firmado: true },
      { id: 'doc-102', nombre: 'Acta matrimonio.pdf', tipo: 'pdf', tamaño: '500 KB', fecha: '18 Ene 2026', autor: 'María García', categoria: 'escritura', firmado: false },
      { id: 'doc-103', nombre: 'Informe trabajo social.pdf', tipo: 'pdf', tamaño: '1.2 MB', fecha: '01 Feb 2026', autor: 'Equipo Social', categoria: 'evidencia', firmado: true },
    ],
    actividades: [
      { id: 'act-101', tipo: 'creacion', descripcion: 'Expediente creado', fecha: '18 Ene 2026 10:00', autor: 'Juan Pérez' },
      { id: 'act-102', tipo: 'documento', descripcion: 'Documento subido: Demanda divorcio.pdf', fecha: '18 Ene 2026 11:30', autor: 'Juan Pérez' },
      { id: 'act-103', tipo: 'documento', descripcion: 'Documento subido: Informe trabajo social.pdf', fecha: '01 Feb 2026 15:00', autor: 'Carlos Méndez' },
    ],
    tareas: [
      { id: 'task-101', titulo: 'Solicitar informe económico', descripcion: 'Solicitar informe de bienes gananciales', estado: 'en_progreso', prioridad: 'alta', fechaLimite: '15 Feb 2026', asignadoA: 'Juan Pérez', creadoPor: 'Carlos Méndez' },
      { id: 'task-102', titulo: 'Entrevista con cliente', descripcion: 'Reunión para preparar declaración', estado: 'pendiente', prioridad: 'media', fechaLimite: '12 Feb 2026', asignadoA: 'Juan Pérez', creadoPor: 'Juan Pérez' },
    ],
    audiencias: [
      { id: 'aud-101', titulo: 'Vista previa', fecha: '25 Feb 2026', hora: '11:00', lugar: 'Juzgado de Familia nº 3', tipo: 'vista', estado: 'programada' },
    ],
    notas: [
      { id: 'nota-101', contenido: 'La parte contraria está siendo inflexible con la pensión. Considerar mediación.', fecha: '01 Feb 2026', autor: 'Carlos Méndez', tipo: 'estrategia' },
    ]
  },
  'EXP-2024-003': {
    id: 'EXP-2024-003',
    titulo: 'Despido improcedente TechCorp',
    cliente: 'Carlos López',
    clienteEmail: 'carlos.lopez@email.com',
    clienteTelefono: '+34 634 567 890',
    estado: 'active',
    prioridad: 'high',
    tipo: 'Laboral',
    fechaInicio: '20 Ene 2026',
    fechaActualizacion: '12 Feb 2026',
    descripcion: 'Reclamación por despido improcedente en empresa tecnológica. El cliente lleva 8 años en la empresa y solicita readmisión o indemnización de 45 días por año.',
    progreso: 60,
    numeroProcedimiento: '128/2026',
    juzgado: 'Juzgado de lo Social nº 12 de Madrid',
    equipo: {
      abogadoAsignado: {
        id: 'abogado_senior_1',
        nombre: 'Carlos Méndez',
        email: 'cmendez@bufete.com',
        rol: 'Abogado Senior'
      },
      supervisor: {
        id: 'socio_1',
        nombre: 'Dr. García',
        email: 'dgarcia@bufete.com'
      },
      colaboradores: [
        {
          id: 'paralegal_1',
          nombre: 'Ana López',
          email: 'alopez@bufete.com',
          rol: 'Paralegal'
        },
        {
          id: 'paralegal_2',
          nombre: 'María Ruiz',
          email: 'mruiz@bufete.com',
          rol: 'Paralegal'
        }
      ]
    },
    finanzas: {
      importeTotal: '€45,000',
      gastos: '€3,200',
      facturado: '€20,000',
      cobrado: '€15,000',
      pendienteCobro: '€5,000',
      moneda: 'EUR'
    },
    documentos: [
      { id: 'doc-201', nombre: 'Demanda despido.pdf', tipo: 'pdf', tamaño: '2.8 MB', fecha: '20 Ene 2026', autor: 'Carlos Méndez', categoria: 'demanda', firmado: true },
      { id: 'doc-202', nombre: 'Contrato trabajo.pdf', tipo: 'pdf', tamaño: '1.1 MB', fecha: '20 Ene 2026', autor: 'Carlos López', categoria: 'escritura', firmado: false },
      { id: 'doc-203', nombre: 'Nóminas 2018-2025.pdf', tipo: 'pdf', tamaño: '5.4 MB', fecha: '25 Ene 2026', autor: 'Carlos López', categoria: 'evidencia', firmado: false },
      { id: 'doc-204', nombre: 'Carta despido.pdf', tipo: 'pdf', tamaño: '350 KB', fecha: '20 Ene 2026', autor: 'TechCorp RH', categoria: 'correspondencia', firmado: false },
      { id: 'doc-205', nombre: 'Informe tasas.pdf', tipo: 'pdf', tamaño: '1.5 MB', fecha: '10 Feb 2026', autor: 'Ana López', categoria: 'evidencia', firmado: true },
    ],
    actividades: [
      { id: 'act-201', tipo: 'creacion', descripcion: 'Expediente creado', fecha: '20 Ene 2026 09:00', autor: 'Carlos Méndez' },
      { id: 'act-202', tipo: 'documento', descripcion: 'Documento subido: Demanda despido.pdf', fecha: '20 Ene 2026 10:30', autor: 'Carlos Méndez' },
      { id: 'act-203', tipo: 'estado', descripcion: 'Estado cambiado a Activo', fecha: '20 Ene 2026 11:00', autor: 'Carlos Méndez' },
      { id: 'act-204', tipo: 'documento', descripcion: 'Documento subido: Nóminas 2018-2025.pdf', fecha: '25 Ene 2026 14:00', autor: 'Carlos López' },
      { id: 'act-205', tipo: 'tarea', descripcion: 'Tarea completada: Cálculo de indemnización', fecha: '05 Feb 2026 12:00', autor: 'Ana López' },
      { id: 'act-206', tipo: 'audiencia', descripcion: 'Audiencia programada para el 20 Feb 2026', fecha: '10 Feb 2026 09:00', autor: 'Carlos Méndez' },
    ],
    tareas: [
      { id: 'task-201', titulo: 'Preparar interrogatorio', descripcion: 'Preparar preguntas para el representante de la empresa', estado: 'en_progreso', prioridad: 'alta', fechaLimite: '18 Feb 2026', asignadoA: 'Carlos Méndez', creadoPor: 'Dr. García' },
      { id: 'task-202', titulo: 'Revisar nóminas', descripcion: 'Verificar que todas las nóminas estén correctas', estado: 'completada', prioridad: 'alta', fechaLimite: '30 Ene 2026', asignadoA: 'María Ruiz', creadoPor: 'Carlos Méndez' },
      { id: 'task-203', titulo: 'Preparar informe pericial', descripcion: 'Solicitar informe pericial sobre condiciones de trabajo', estado: 'pendiente', prioridad: 'media', fechaLimite: '15 Feb 2026', asignadoA: 'Ana López', creadoPor: 'Carlos Méndez' },
    ],
    audiencias: [
      { id: 'aud-201', titulo: 'Juicio Oral', fecha: '20 Feb 2026', hora: '09:30', lugar: 'Juzgado de lo Social nº 12 de Madrid', tipo: 'audiencia', estado: 'programada', notas: 'Llevar testigos y documentación' },
    ],
    notas: [
      { id: 'nota-201', contenido: 'El cliente prefiere la indemnización ante la readmisión. La empresa parece dispuesta a negociar.', fecha: '05 Feb 2026', autor: 'Carlos Méndez', tipo: 'estrategia' },
      { id: 'nota-202', contenido: 'El cálculo de la indemnización asciende a €52,000 brutos según las nóminas aportadas.', fecha: '05 Feb 2026', autor: 'Ana López', tipo: 'general' },
    ]
  },
  'EXP-2024-004': {
    id: 'EXP-2024-004',
    titulo: 'Reclamación seguro hogar',
    cliente: 'Ana Rodríguez',
    estado: 'closed',
    prioridad: 'low',
    tipo: 'Civil',
    fechaInicio: '10 Ene 2026',
    fechaActualizacion: '05 Feb 2026',
    fechaCierre: '05 Feb 2026',
    descripcion: 'Reclamación por daños por inundación a aseguradora. Caso resuelto favorablemente al cliente.',
    progreso: 100,
    equipo: {
      abogadoAsignado: {
        id: 'abogado_junior_2',
        nombre: 'Pedro Sánchez',
        email: 'psanchez@bufete.com',
        rol: 'Abogado Junior'
      },
      supervisor: {
        id: 'abogado_senior_2',
        nombre: 'Laura Torres',
        email: 'ltorres@bufete.com'
      },
      colaboradores: []
    },
    finanzas: {
      importeTotal: '€12,000',
      gastos: '€1,200',
      facturado: '€12,000',
      cobrado: '€12,000',
      pendienteCobro: '€0',
      moneda: 'EUR'
    },
    documentos: [
      { id: 'doc-301', nombre: 'Demanda seguro.pdf', tipo: 'pdf', tamaño: '1.8 MB', fecha: '10 Ene 2026', autor: 'Pedro Sánchez', categoria: 'demanda', firmado: true },
      { id: 'doc-302', nombre: 'Póliza seguro.pdf', tipo: 'pdf', tamaño: '2.1 MB', fecha: '10 Ene 2026', autor: 'Ana Rodríguez', categoria: 'escritura', firmado: false },
      { id: 'doc-303', nombre: 'Sentencia favorable.pdf', tipo: 'pdf', tamaño: '850 KB', fecha: '05 Feb 2026', autor: 'Juzgado', categoria: 'demanda', firmado: true },
    ],
    actividades: [
      { id: 'act-301', tipo: 'creacion', descripcion: 'Expediente creado', fecha: '10 Ene 2026 11:00', autor: 'Pedro Sánchez' },
      { id: 'act-302', tipo: 'documento', descripcion: 'Sentencia recibida favorable', fecha: '05 Feb 2026 10:00', autor: 'Laura Torres' },
      { id: 'act-303', tipo: 'estado', descripcion: 'Expediente cerrado - Caso ganado', fecha: '05 Feb 2026 12:00', autor: 'Laura Torres' },
    ],
    tareas: [
      { id: 'task-301', titulo: 'Cobro indemnización', descripcion: 'Verificar cobro de la indemnización por parte del seguro', estado: 'completada', prioridad: 'alta', fechaLimite: '10 Feb 2026', asignadoA: 'Pedro Sánchez', creadoPor: 'Laura Torres' },
    ],
    audiencias: [],
    notas: [
      { id: 'nota-301', contenido: 'Caso cerrado exitosamente. Cliente muy satisfecho.', fecha: '05 Feb 2026', autor: 'Laura Torres', tipo: 'general' },
    ]
  },
  'EXP-2024-005': {
    id: 'EXP-2024-005',
    titulo: 'Constitución SL Innovatech',
    cliente: 'Pedro Sánchez',
    clienteEmail: 'pedro.sanchez@innovatech.com',
    estado: 'active',
    prioridad: 'medium',
    tipo: 'Mercantil',
    fechaInicio: '22 Ene 2026',
    fechaActualizacion: '10 Feb 2026',
    descripcion: 'Constitución de sociedad limitada y redacción de estatutos sociales.',
    progreso: 45,
    equipo: {
      abogadoAsignado: {
        id: 'socio_1',
        nombre: 'Dr. García',
        email: 'dgarcia@bufete.com',
        rol: 'Socio'
      },
      colaboradores: []
    },
    finanzas: {
      importeTotal: '€3,500',
      gastos: '€500',
      facturado: '€1,750',
      cobrado: '€1,750',
      pendienteCobro: '€0',
      moneda: 'EUR'
    },
    documentos: [
      { id: 'doc-401', nombre: 'Estatutos sociales.docx', tipo: 'docx', tamaño: '420 KB', fecha: '22 Ene 2026', autor: 'Dr. García', categoria: 'escritura', firmado: false },
      { id: 'doc-402', nombre: 'Escritura constitución.pdf', tipo: 'pdf', tamaño: '1.5 MB', fecha: '25 Ene 2026', autor: 'Notaría', categoria: 'escritura', firmado: true },
    ],
    actividades: [
      { id: 'act-401', tipo: 'creacion', descripcion: 'Expediente creado', fecha: '22 Ene 2026 10:00', autor: 'Dr. García' },
      { id: 'act-402', tipo: 'documento', descripcion: 'Escritura constitución firmada', fecha: '25 Ene 2026 16:00', autor: 'Dr. García' },
    ],
    tareas: [
      { id: 'task-401', titulo: 'Inscripción Registro Mercantil', descripcion: 'Presentar escritura en el Registro Mercantil', estado: 'en_progreso', prioridad: 'alta', fechaLimite: '15 Feb 2026', asignadoA: 'Dr. García', creadoPor: 'Dr. García' },
    ],
    audiencias: [],
    notas: []
  },
  'EXP-2024-006': {
    id: 'EXP-2024-006',
    titulo: 'Delito fiscal Hacienda',
    cliente: 'Empresa XYZ',
    clienteEmail: 'legal@xyz.com',
    estado: 'urgent',
    prioridad: 'high',
    tipo: 'Penal',
    fechaInicio: '25 Ene 2026',
    fechaActualizacion: '13 Feb 2026',
    descripcion: 'Defensa en procedimiento por presunto delito fiscal.',
    progreso: 15,
    equipo: {
      abogadoAsignado: {
        id: 'abogado_senior_2',
        nombre: 'Laura Torres',
        email: 'ltorres@bufete.com',
        rol: 'Abogado Senior'
      },
      supervisor: {
        id: 'socio_1',
        nombre: 'Dr. García',
        email: 'dgarcia@bufete.com'
      },
      colaboradores: []
    },
    finanzas: {
      importeTotal: '€85,000',
      gastos: '€5,000',
      facturado: '€10,000',
      cobrado: '€10,000',
      pendienteCobro: '€0',
      moneda: 'EUR'
    },
    documentos: [
      { id: 'doc-501', nombre: 'Escrito defensa.pdf', tipo: 'pdf', tamaño: '3.2 MB', fecha: '25 Ene 2026', autor: 'Laura Torres', categoria: 'demanda', firmado: true },
    ],
    actividades: [
      { id: 'act-501', tipo: 'creacion', descripcion: 'Expediente creado - URGENTE', fecha: '25 Ene 2026 08:00', autor: 'Laura Torres' },
    ],
    tareas: [
      { id: 'task-501', titulo: 'Análisis documentación fiscal', descripcion: 'Revisar toda la documentación fiscal de los últimos 5 años', estado: 'en_progreso', prioridad: 'alta', fechaLimite: '15 Feb 2026', asignadoA: 'Laura Torres', creadoPor: 'Dr. García' },
    ],
    audiencias: [],
    notas: [
      { id: 'nota-501', contenido: 'Caso muy sensible. Máxima discreción requerida.', fecha: '25 Ene 2026', autor: 'Dr. García', tipo: 'interna' },
    ]
  },
  'EXP-2024-007': {
    id: 'EXP-2024-007',
    titulo: 'Herencia y testamentaría',
    cliente: 'Familia Ruiz',
    estado: 'active',
    prioridad: 'medium',
    tipo: 'Sucesiones',
    fechaInicio: '28 Ene 2026',
    fechaActualizacion: '11 Feb 2026',
    descripcion: 'Partición de herencia con bienes inmuebles en varias provincias.',
    progreso: 50,
    equipo: {
      abogadoAsignado: {
        id: 'abogado_junior_1',
        nombre: 'Juan Pérez',
        email: 'jperez@bufete.com',
        rol: 'Abogado Junior'
      },
      supervisor: {
        id: 'abogado_senior_1',
        nombre: 'Carlos Méndez',
        email: 'cmendez@bufete.com'
      },
      colaboradores: [
        {
          id: 'paralegal_2',
          nombre: 'María Ruiz',
          email: 'mruiz@bufete.com',
          rol: 'Paralegal'
        }
      ]
    },
    finanzas: {
      importeTotal: '€22,000',
      gastos: '€2,000',
      facturado: '€8,000',
      cobrado: '€5,000',
      pendienteCobro: '€3,000',
      moneda: 'EUR'
    },
    documentos: [
      { id: 'doc-601', nombre: 'Testamento.pdf', tipo: 'pdf', tamaño: '1.2 MB', fecha: '28 Ene 2026', autor: 'Notaría', categoria: 'escritura', firmado: true },
    ],
    actividades: [
      { id: 'act-601', tipo: 'creacion', descripcion: 'Expediente creado', fecha: '28 Ene 2026 14:00', autor: 'Juan Pérez' },
    ],
    tareas: [
      { id: 'task-601', titulo: 'Tasación inmuebles', descripcion: 'Solicitar tasación de todos los inmuebles', estado: 'en_progreso', prioridad: 'media', fechaLimite: '20 Feb 2026', asignadoA: 'María Ruiz', creadoPor: 'Juan Pérez' },
    ],
    audiencias: [],
    notas: []
  },
  'EXP-2024-008': {
    id: 'EXP-2024-008',
    titulo: 'Reclamación deuda comercial',
    cliente: 'Constructora ABC',
    estado: 'pending',
    prioridad: 'high',
    tipo: 'Mercantil',
    fechaInicio: '30 Ene 2026',
    fechaActualizacion: '09 Feb 2026',
    descripcion: 'Reclamación por impago de facturas de obra.',
    progreso: 25,
    equipo: {
      abogadoAsignado: {
        id: 'socio_1',
        nombre: 'Dr. García',
        email: 'dgarcia@bufete.com',
        rol: 'Socio'
      },
      colaboradores: []
    },
    finanzas: {
      importeTotal: '€67,000',
      gastos: '€3,500',
      facturado: '€15,000',
      cobrado: '€10,000',
      pendienteCobro: '€5,000',
      moneda: 'EUR'
    },
    documentos: [],
    actividades: [
      { id: 'act-701', tipo: 'creacion', descripcion: 'Expediente creado', fecha: '30 Ene 2026 09:00', autor: 'Dr. García' },
    ],
    tareas: [
      { id: 'task-701', titulo: 'Búsqueda de bienes', descripcion: 'Investigar bienes del deudor para posible embargo', estado: 'en_progreso', prioridad: 'alta', fechaLimite: '15 Feb 2026', asignadoA: 'Dr. García', creadoPor: 'Dr. García' },
    ],
    audiencias: [],
    notas: []
  },
  'EXP-2024-009': {
    id: 'EXP-2024-009',
    titulo: 'Modificación de medidas',
    cliente: 'Laura Torres',
    estado: 'active',
    prioridad: 'low',
    tipo: 'Familiar',
    fechaInicio: '02 Feb 2026',
    fechaActualizacion: '10 Feb 2026',
    descripcion: 'Modificación de régimen de visitas y pensión alimenticia.',
    progreso: 40,
    equipo: {
      abogadoAsignado: {
        id: 'abogado_junior_2',
        nombre: 'Pedro Sánchez',
        email: 'psanchez@bufete.com',
        rol: 'Abogado Junior'
      },
      supervisor: {
        id: 'abogado_senior_2',
        nombre: 'Laura Torres',
        email: 'ltorres@bufete.com'
      },
      colaboradores: []
    },
    finanzas: {
      importeTotal: '€4,200',
      gastos: '€300',
      facturado: '€2,000',
      cobrado: '€2,000',
      pendienteCobro: '€0',
      moneda: 'EUR'
    },
    documentos: [],
    actividades: [
      { id: 'act-801', tipo: 'creacion', descripcion: 'Expediente creado', fecha: '02 Feb 2026 10:00', autor: 'Pedro Sánchez' },
    ],
    tareas: [],
    audiencias: [],
    notas: []
  },
  'EXP-2024-010': {
    id: 'EXP-2024-010',
    titulo: 'Accidente de tráfico',
    cliente: 'Miguel Ángel Pérez',
    estado: 'urgent',
    prioridad: 'high',
    tipo: 'Civil',
    fechaInicio: '05 Feb 2026',
    fechaActualizacion: '13 Feb 2026',
    descripcion: 'Reclamación por accidente con lesiones graves.',
    progreso: 10,
    equipo: {
      abogadoAsignado: {
        id: 'abogado_senior_1',
        nombre: 'Carlos Méndez',
        email: 'cmendez@bufete.com',
        rol: 'Abogado Senior'
      },
      supervisor: {
        id: 'socio_1',
        nombre: 'Dr. García',
        email: 'dgarcia@bufete.com'
      },
      colaboradores: [
        {
          id: 'paralegal_1',
          nombre: 'Ana López',
          email: 'alopez@bufete.com',
          rol: 'Paralegal'
        }
      ]
    },
    finanzas: {
      importeTotal: '€125,000',
      gastos: '€8,000',
      facturado: '€5,000',
      cobrado: '€5,000',
      pendienteCobro: '€0',
      moneda: 'EUR'
    },
    documentos: [
      { id: 'doc-901', nombre: 'Informe médico.pdf', tipo: 'pdf', tamaño: '2.1 MB', fecha: '05 Feb 2026', autor: 'Hospital', categoria: 'evidencia', firmado: true },
    ],
    actividades: [
      { id: 'act-901', tipo: 'creacion', descripcion: 'Expediente creado - URGENTE', fecha: '05 Feb 2026 15:00', autor: 'Carlos Méndez' },
    ],
    tareas: [
      { id: 'task-901', titulo: 'Solicitar informe médico detallado', descripcion: 'Conseguir informe médico completo con secuelas', estado: 'en_progreso', prioridad: 'alta', fechaLimite: '15 Feb 2026', asignadoA: 'Ana López', creadoPor: 'Carlos Méndez' },
    ],
    audiencias: [],
    notas: [
      { id: 'nota-901', contenido: 'Lesiones muy graves. Posible incapacidad permanente.', fecha: '05 Feb 2026', autor: 'Carlos Méndez', tipo: 'general' },
    ]
  },
  'EXP-2024-011': {
    id: 'EXP-2024-011',
    titulo: 'Contrato de arrendamiento',
    cliente: 'Inmobiliaria Sol',
    estado: 'active',
    prioridad: 'low',
    tipo: 'Civil',
    fechaInicio: '08 Feb 2026',
    fechaActualizacion: '12 Feb 2026',
    descripcion: 'Desahucio por impago de alquiler comercial.',
    progreso: 80,
    equipo: {
      abogadoAsignado: {
        id: 'abogado_junior_1',
        nombre: 'Juan Pérez',
        email: 'jperez@bufete.com',
        rol: 'Abogado Junior'
      },
      supervisor: {
        id: 'abogado_senior_1',
        nombre: 'Carlos Méndez',
        email: 'cmendez@bufete.com'
      },
      colaboradores: []
    },
    finanzas: {
      importeTotal: '€2,800',
      gastos: '€200',
      facturado: '€2,000',
      cobrado: '€2,000',
      pendienteCobro: '€0',
      moneda: 'EUR'
    },
    documentos: [],
    actividades: [
      { id: 'act-1001', tipo: 'creacion', descripcion: 'Expediente creado', fecha: '08 Feb 2026 11:00', autor: 'Juan Pérez' },
    ],
    tareas: [
      { id: 'task-1001', titulo: 'Notificación desahucio', descripcion: 'Notificar al inquilino la resolución del contrato', estado: 'en_progreso', prioridad: 'media', fechaLimite: '15 Feb 2026', asignadoA: 'Juan Pérez', creadoPor: 'Carlos Méndez' },
    ],
    audiencias: [],
    notas: []
  },
  'EXP-2024-012': {
    id: 'EXP-2024-012',
    titulo: 'Reestructuración de deuda',
    cliente: 'PYME Tecnológica SL',
    estado: 'pending',
    prioridad: 'medium',
    tipo: 'Mercantil',
    fechaInicio: '10 Feb 2026',
    fechaActualizacion: '13 Feb 2026',
    descripcion: 'Concurso de acreedores y reestructuración de deuda.',
    progreso: 20,
    equipo: {
      abogadoAsignado: {
        id: 'socio_1',
        nombre: 'Dr. García',
        email: 'dgarcia@bufete.com',
        rol: 'Socio'
      },
      colaboradores: [
        {
          id: 'paralegal_2',
          nombre: 'María Ruiz',
          email: 'mruiz@bufete.com',
          rol: 'Paralegal'
        }
      ]
    },
    finanzas: {
      importeTotal: '€180,000',
      gastos: '€15,000',
      facturado: '€25,000',
      cobrado: '€20,000',
      pendienteCobro: '€5,000',
      moneda: 'EUR'
    },
    documentos: [
      { id: 'doc-1101', nombre: 'Documentación concurso.pdf', tipo: 'pdf', tamaño: '5.8 MB', fecha: '10 Feb 2026', autor: 'Dr. García', categoria: 'demanda', firmado: false },
    ],
    actividades: [
      { id: 'act-1101', tipo: 'creacion', descripcion: 'Expediente creado', fecha: '10 Feb 2026 09:00', autor: 'Dr. García' },
    ],
    tareas: [
      { id: 'task-1101', titulo: 'Elaborar informe administrador concursal', descripcion: 'Preparar documentación para el administrador', estado: 'pendiente', prioridad: 'alta', fechaLimite: '20 Feb 2026', asignadoA: 'María Ruiz', creadoPor: 'Dr. García' },
    ],
    audiencias: [],
    notas: [
      { id: 'nota-1101', contenido: 'Caso complejo. Muchos acreedores involucrados.', fecha: '10 Feb 2026', autor: 'Dr. García', tipo: 'general' },
    ]
  }
};

// Helper para obtener expediente por ID
export const getExpedienteById = (id: string): ExpedienteDetail | undefined => {
  return expedientesDetailData[id];
};

// Iconos y colores para tipos de documentos
export const getDocumentIcon = (tipo: string): string => {
  switch (tipo) {
    case 'pdf': return 'PDF';
    case 'doc':
    case 'docx': return 'DOC';
    case 'xls':
    case 'xlsx': return 'XLS';
    case 'jpg':
    case 'png': return 'IMG';
    default: return 'FILE';
  }
};

export const getDocumentColor = (tipo: string): string => {
  switch (tipo) {
    case 'pdf': return 'text-red-400 bg-red-500/10';
    case 'doc':
    case 'docx': return 'text-blue-400 bg-blue-500/10';
    case 'xls':
    case 'xlsx': return 'text-emerald-400 bg-emerald-500/10';
    case 'jpg':
    case 'png': return 'text-purple-400 bg-purple-500/10';
    default: return 'text-slate-400 bg-slate-500/10';
  }
};

// Iconos para tipos de actividad
export const getActivityIcon = (tipo: string): string => {
  switch (tipo) {
    case 'creacion': return 'Plus';
    case 'edicion': return 'Edit';
    case 'documento': return 'FileText';
    case 'tarea': return 'CheckSquare';
    case 'audiencia': return 'Calendar';
    case 'nota': return 'MessageSquare';
    case 'estado': return 'RefreshCw';
    default: return 'Activity';
  }
};

export const getActivityColor = (tipo: string): string => {
  switch (tipo) {
    case 'creacion': return 'text-emerald-400 bg-emerald-500/10';
    case 'edicion': return 'text-blue-400 bg-blue-500/10';
    case 'documento': return 'text-amber-400 bg-amber-500/10';
    case 'tarea': return 'text-purple-400 bg-purple-500/10';
    case 'audiencia': return 'text-cyan-400 bg-cyan-500/10';
    case 'nota': return 'text-pink-400 bg-pink-500/10';
    case 'estado': return 'text-orange-400 bg-orange-500/10';
    default: return 'text-slate-400 bg-slate-500/10';
  }
};
