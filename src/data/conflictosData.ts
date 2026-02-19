import type {
  Conflicto,
  AnalisisConflicto,
  ReglaConflicto,
  TipoConflicto,
  EstadoConflicto,
  SeveridadConflicto
} from '@/types/conflictos';

// ============================================
// FECHA BASE
// ============================================
const NOW = new Date();
const haceDias = (dias: number): Date => {
  const fecha = new Date(NOW);
  fecha.setDate(fecha.getDate() - dias);
  return fecha;
};

const haceMeses = (meses: number): Date => {
  const fecha = new Date(NOW);
  fecha.setMonth(fecha.getMonth() - meses);
  return fecha;
};

// ============================================
// REGLAS DE DETECCIÓN DE CONFLICTOS
// ============================================

export const reglasConflictoData: ReglaConflicto[] = [
  {
    id: 'REGLA-001',
    nombre: 'Misma Parte Contraria',
    descripcion: 'Detecta si el cliente actual fue parte contraria en expedientes anteriores',
    criterios: [
      {
        id: 'CRIT-001',
        tipo: 'nombre_similar',
        umbralSimilitud: 85,
        ponderacion: 40
      },
      {
        id: 'CRIT-002',
        tipo: 'mismo_documento',
        ponderacion: 60
      }
    ],
    activa: true,
    prioridad: 1,
    fechaCreacion: haceMeses(6)
  },
  {
    id: 'REGLA-002',
    nombre: 'Abogado en Común',
    descripcion: 'Detecta si el mismo abogado representó a ambas partes en diferentes casos',
    criterios: [
      {
        id: 'CRIT-003',
        tipo: 'mismo_abogado',
        ponderacion: 100
      }
    ],
    activa: true,
    prioridad: 2,
    fechaCreacion: haceMeses(6)
  },
  {
    id: 'REGLA-003',
    nombre: 'Relación Familiar',
    descripcion: 'Detecta relaciones familiares entre partes de expedientes diferentes',
    criterios: [
      {
        id: 'CRIT-004',
        tipo: 'relacion_familiar',
        ponderacion: 100
      }
    ],
    activa: true,
    prioridad: 3,
    fechaCreacion: haceMeses(6)
  },
  {
    id: 'REGLA-004',
    nombre: 'Grupo Empresarial',
    descripcion: 'Detecta si las partes pertenecen al mismo grupo empresarial',
    criterios: [
      {
        id: 'CRIT-005',
        tipo: 'grupo_empresarial',
        ponderacion: 100
      }
    ],
    activa: true,
    prioridad: 1,
    fechaCreacion: haceMeses(6)
  },
  {
    id: 'REGLA-005',
    nombre: 'Intereses Opuestos',
    descripcion: 'Detecta clientes con intereses opuestos en materias similares',
    criterios: [
      {
        id: 'CRIT-006',
        tipo: 'mismo_cliente',
        ponderacion: 100
      }
    ],
    activa: true,
    prioridad: 2,
    fechaCreacion: haceMeses(6)
  }
];

// ============================================
// CONFLICTOS DETECTADOS
// ============================================

export const conflictosData: Conflicto[] = [
  {
    id: 'CONF-001',
    expedienteId: 'EXP-2024-025',
    tipoConflicto: 'directo',
    estado: 'en_analisis',
    severidad: 'critica',
    entidadA: {
      tipo: 'cliente',
      id: 'CLI-015',
      nombre: 'TechCorp Innovaciones SL'
    },
    entidadB: {
      tipo: 'parte_contraria',
      id: 'PARTE-003',
      nombre: 'Roberto Sánchez Vega'
    },
    descripcion: 'El cliente actual (TechCorp) demandó previamente a Roberto Sánchez Vega en expediente EXP-2024-003 por despido improcedente. Ahora Roberto Sánchez solicita asesoramiento para demandar a TechCorp por daños y perjuicios derivados del mismo conflicto laboral.',
    fechaDeteccion: haceDias(2),
    documentosSoporte: ['EXP-2024-003', 'demanda_techcorp.pdf']
  },
  {
    id: 'CONF-002',
    expedienteId: 'EXP-2024-026',
    tipoConflicto: 'indirecto',
    estado: 'detectado',
    severidad: 'alta',
    entidadA: {
      tipo: 'cliente',
      id: 'CLI-018',
      nombre: 'Constructora del Norte SA'
    },
    entidadB: {
      tipo: 'parte_contraria',
      id: 'PARTE-102',
      nombre: 'TechCorp Innovaciones SL'
    },
    descripcion: 'Constructora del Norte tiene un litigio pendiente con el Grupo Tecnológico Ibérico (matriz de TechCorp). Aunque son entidades diferentes, existe relación empresarial que podría generar conflicto de intereses indirecto.',
    fechaDeteccion: haceDias(5),
    documentosSoporte: ['contrato_construccion.pdf']
  },
  {
    id: 'CONF-003',
    expedienteId: 'EXP-2024-024',
    tipoConflicto: 'directo',
    estado: 'resuelto',
    severidad: 'media',
    entidadA: {
      tipo: 'cliente',
      id: 'CLI-012',
      nombre: 'María Dolores Ibáñez'
    },
    entidadB: {
      tipo: 'parte_contraria',
      id: 'PARTE-105',
      nombre: 'Grupo Tecnológico Ibérico Holding SL'
    },
    descripcion: 'María Dolores es representante legal del Holding que ahora es parte contraria en un caso de reclamación de deuda. Se ha documentado que no existe conflicto real ya que su participación es como representante legal sin intereses personales.',
    fechaDeteccion: haceMeses(1),
    analizadoPor: 'Carlos Méndez',
    resolucion: 'Descartado - Sin conflicto real',
    fechaResolucion: haceDias(15),
    justificacionResolucion: 'La representación legal no implica conflicto de intereses personal. La Sra. Ibáñez actúa únicamente como administradora sin participación accionaria relevante.',
    documentosSoporte: ['escritura_representacion.pdf', 'informe_conflictos.pdf']
  },
  {
    id: 'CONF-004',
    expedienteId: 'EXP-2024-028',
    tipoConflicto: 'potencial',
    estado: 'detectado',
    severidad: 'baja',
    entidadA: {
      tipo: 'cliente',
      id: 'CLI-020',
      nombre: 'Antonio García Martínez'
    },
    entidadB: {
      tipo: 'tercero',
      id: 'PARTE-101',
      nombre: 'Banco Santander S.A.'
    },
    descripcion: 'Antonio García es cliente habitual del Banco Santander. Se abre expediente de reclamación de cláusulas suelo contra el banco. El bufete ha representado al banco en otros 3 casos similares.',
    fechaDeteccion: haceDias(1),
    documentosSoporte: ['contrato_cuenta_bancaria.pdf']
  },
  {
    id: 'CONF-005',
    expedienteId: 'EXP-2024-027',
    tipoConflicto: 'aparente',
    estado: 'en_analisis',
    severidad: 'media',
    entidadA: {
      tipo: 'abogado',
      id: 'ABG-001',
      nombre: 'Carlos Méndez'
    },
    entidadB: {
      tipo: 'cliente',
      id: 'CLI-022',
      nombre: 'Software Solutions Iberia SL'
    },
    descripcion: 'El abogado Carlos Méndez representó a la empresa matriz (Grupo Tecnológico Ibérico) en proceso concursal. Ahora se solicita representar a una filial en conflicto laboral. Existe riesgo aparente de conflicto.',
    fechaDeteccion: haceDias(3),
    documentosSoporte: ['expediente_concursal_2024-012.pdf']
  },
  {
    id: 'CONF-006',
    expedienteId: 'EXP-2024-021',
    tipoConflicto: 'directo',
    estado: 'detectado',
    severidad: 'critica',
    entidadA: {
      tipo: 'cliente',
      id: 'CLI-025',
      nombre: 'Fernando López Martínez'
    },
    entidadB: {
      tipo: 'parte_contraria',
      id: 'PARTE-005',
      nombre: 'Fernando López Martínez'
    },
    descripcion: '¡CONFLICTO CRÍTICO! El mismo individuo aparece como cliente y parte contraria con el mismo nombre completo y documento de identidad (45678901E). Posible error de registro o intento de fraude.',
    fechaDeteccion: haceDias(1),
    documentosSoporte: ['duplicidad_verificar.pdf']
  },
  {
    id: 'CONF-007',
    expedienteId: 'EXP-2024-029',
    tipoConflicto: 'indirecto',
    estado: 'en_analisis',
    severidad: 'alta',
    entidadA: {
      tipo: 'cliente',
      id: 'CLI-028',
      nombre: 'Inmobiliaria Sol y Mar SL'
    },
    entidadB: {
      tipo: 'parte_contraria',
      id: 'PARTE-104',
      nombre: 'Constructora del Norte SA'
    },
    descripcion: 'Constructora del Norte ha sido parte contraria en múltiples expedientes del bufete. Inmobiliaria Sol y Mar tiene contratos de obra pendientes con Constructora del Norte.',
    fechaDeteccion: haceDias(4),
    documentosSoporte: ['contrato_obra_solymar.pdf', 'EXP-2024-009.pdf']
  },
  {
    id: 'CONF-008',
    expedienteId: 'EXP-2024-030',
    tipoConflicto: 'potencial',
    estado: 'detectado',
    severidad: 'baja',
    entidadA: {
      tipo: 'cliente',
      id: 'CLI-030',
      nombre: 'Isabel Gómez Hernández'
    },
    entidadB: {
      tipo: 'tercero',
      id: 'PARTE-006',
      nombre: 'Isabel Gómez Hernández'
    },
    descripcion: 'Coincidencia de nombre exacto entre cliente actual y parte contraria histórica. Documentos de identidad diferentes (56789012F vs 98765432H) indican que son personas distintas.',
    fechaDeteccion: haceDias(6),
    documentosSoporte: ['verificacion_documentos.pdf']
  }
];

// ============================================
// ANÁLISIS REALIZADOS
// ============================================

export const analisisConflictosData: AnalisisConflicto[] = [
  {
    id: 'ANAL-001',
    expedienteId: 'EXP-2024-025',
    fechaAnalisis: haceDias(2),
    resultado: 'conflictos_detectados',
    conflictosEncontrados: [conflictosData[0]],
    analizadoPor: 'Carlos Méndez',
    tiempoAnalisis: 3.2,
    metodologiaUtilizada: 'Búsqueda completa con fuzzy matching + verificación de relaciones',
    basesDatosConsultadas: ['partes_contrarias', 'clientes', 'expedientes_historicos', 'relaciones_entidades'],
    scoringTotal: 95
  },
  {
    id: 'ANAL-002',
    expedienteId: 'EXP-2024-026',
    fechaAnalisis: haceDias(5),
    resultado: 'conflictos_detectados',
    conflictosEncontrados: [conflictosData[1]],
    analizadoPor: 'Laura Torres',
    tiempoAnalisis: 4.1,
    metodologiaUtilizada: 'Detección de grupos empresariales + análisis de relaciones',
    basesDatosConsultadas: ['partes_contrarias', 'grupos_empresariales', 'relaciones_entidades'],
    scoringTotal: 78
  },
  {
    id: 'ANAL-003',
    expedienteId: 'EXP-2024-024',
    fechaAnalisis: haceMeses(1),
    resultado: 'conflictos_detectados',
    conflictosEncontrados: [conflictosData[2]],
    analizadoPor: 'Carlos Méndez',
    tiempoAnalisis: 2.8,
    metodologiaUtilizada: 'Verificación de conflictos directos',
    basesDatosConsultadas: ['partes_contrarias', 'clientes', 'expedientes_activos'],
    scoringTotal: 45
  },
  {
    id: 'ANAL-004',
    expedienteId: 'EXP-2024-031',
    fechaAnalisis: haceDias(1),
    resultado: 'sin_conflictos',
    conflictosEncontrados: [],
    analizadoPor: 'Ana López',
    tiempoAnalisis: 2.5,
    metodologiaUtilizada: 'Búsqueda completa en bases de datos',
    basesDatosConsultadas: ['partes_contrarias', 'clientes', 'expedientes_historicos'],
    scoringTotal: 5
  },
  {
    id: 'ANAL-005',
    expedienteId: 'EXP-2024-028',
    fechaAnalisis: haceDias(1),
    resultado: 'conflictos_detectados',
    conflictosEncontrados: [conflictosData[3]],
    analizadoPor: 'Sistema Automático',
    tiempoAnalisis: 1.2,
    metodologiaUtilizada: 'Detección automática al crear expediente',
    basesDatosConsultadas: ['partes_contrarias', 'clientes'],
    scoringTotal: 62
  }
];

// ============================================
// FUNCIONES AUXILIARES
// ============================================

export function getConflictosByExpedienteId(expedienteId: string): Conflicto[] {
  return conflictosData.filter(c => c.expedienteId === expedienteId);
}

export function getAnalisisByExpedienteId(expedienteId: string): AnalisisConflicto | undefined {
  return analisisConflictosData.find(a => a.expedienteId === expedienteId);
}

export function getConflictosByEstado(estado: EstadoConflicto): Conflicto[] {
  return conflictosData.filter(c => c.estado === estado);
}

export function getConflictosBySeveridad(severidad: SeveridadConflicto): Conflicto[] {
  return conflictosData.filter(c => c.severidad === severidad);
}

export function getConflictosByTipo(tipo: TipoConflicto): Conflicto[] {
  return conflictosData.filter(c => c.tipoConflicto === tipo);
}

// ============================================
// ESTADÍSTICAS
// ============================================

export const estadisticasConflictos = {
  total: conflictosData.length,
  detectados: conflictosData.filter(c => c.estado === 'detectado').length,
  enAnalisis: conflictosData.filter(c => c.estado === 'en_analisis').length,
  resueltos: conflictosData.filter(c => c.estado === 'resuelto').length,
  descartados: conflictosData.filter(c => c.estado === 'descartado').length,
  criticos: conflictosData.filter(c => c.severidad === 'critica').length,
  altos: conflictosData.filter(c => c.severidad === 'alta').length,
  medios: conflictosData.filter(c => c.severidad === 'media').length,
  bajos: conflictosData.filter(c => c.severidad === 'baja').length,
  directos: conflictosData.filter(c => c.tipoConflicto === 'directo').length,
  indirectos: conflictosData.filter(c => c.tipoConflicto === 'indirecto').length,
  aparentes: conflictosData.filter(c => c.tipoConflicto === 'aparente').length,
  potenciales: conflictosData.filter(c => c.tipoConflicto === 'potencial').length,
  totalAnalisis: analisisConflictosData.length,
  analisisConConflictos: analisisConflictosData.filter(a => a.resultado === 'conflictos_detectados').length,
  analisisSinConflictos: analisisConflictosData.filter(a => a.resultado === 'sin_conflictos').length,
  promedioTiempoAnalisis: analisisConflictosData.reduce((acc, a) => acc + a.tiempoAnalisis, 0) / analisisConflictosData.length
};

// ============================================
// DATOS PARA DETECCIÓN
// ============================================

export interface DatosExpedienteParaAnalisis {
  id: string;
  clienteId: string;
  clienteNombre: string;
  parteContrariaId?: string;
  parteContrariaNombre?: string;
  materia: string;
  abogadoAsignadoId: string;
  abogadoAsignadoNombre: string;
}

// Expedientes simulados para detección
export const expedientesParaAnalisis: DatosExpedienteParaAnalisis[] = [
  {
    id: 'EXP-2024-025',
    clienteId: 'CLI-015',
    clienteNombre: 'TechCorp Innovaciones SL',
    parteContrariaId: 'PARTE-003',
    parteContrariaNombre: 'Roberto Sánchez Vega',
    materia: 'Laboral',
    abogadoAsignadoId: 'ABG-001',
    abogadoAsignadoNombre: 'Carlos Méndez'
  },
  {
    id: 'EXP-2024-026',
    clienteId: 'CLI-018',
    clienteNombre: 'Constructora del Norte SA',
    parteContrariaId: 'PARTE-102',
    parteContrariaNombre: 'TechCorp Innovaciones SL',
    materia: 'Mercantil',
    abogadoAsignadoId: 'ABG-002',
    abogadoAsignadoNombre: 'Laura Torres'
  },
  {
    id: 'EXP-2024-028',
    clienteId: 'CLI-020',
    clienteNombre: 'Antonio García Martínez',
    parteContrariaId: 'PARTE-101',
    parteContrariaNombre: 'Banco Santander S.A.',
    materia: 'Bancario',
    abogadoAsignadoId: 'ABG-003',
    abogadoAsignadoNombre: 'Ana López'
  }
];
