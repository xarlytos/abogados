import type { 
  ParteContraria, 
  RelacionEntidad, 
  GrupoEmpresarial,
  TipoRelacion 
} from '@/types/conflictos';

// ============================================
// FECHA BASE
// ============================================
const NOW = new Date();
const haceMeses = (meses: number): Date => {
  const fecha = new Date(NOW);
  fecha.setMonth(fecha.getMonth() - meses);
  return fecha;
};

// ============================================
// PARTES CONTRARIAS - PERSONAS FÍSICAS
// ============================================

export const partesFisicasData: ParteContraria[] = [
  {
    id: 'PARTE-001',
    tipo: 'persona_fisica',
    nombreCompleto: 'Antonio García Martínez',
    nombreNormalizado: 'antonio garcia martinez',
    documentoIdentidad: '12345678A',
    direccion: {
      calle: 'Calle Mayor 45, 3º B',
      ciudad: 'Madrid',
      codigoPostal: '28013',
      provincia: 'Madrid',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 612 345 678',
      email: 'antonio.garcia@email.com'
    },
    expedientesRelacionados: ['EXP-2024-001', 'EXP-2024-015'],
    abogadosQueRepresentaron: ['Carlos Méndez', 'Laura Torres'],
    fechaCreacion: haceMeses(18),
    ultimaActualizacion: haceMeses(2),
    etiquetas: ['reincidente', 'deudor', 'madrid'],
    notas: 'Parte contraria recurrente en casos de reclamación de deuda.',
    totalExpedientes: 2,
    expedientesActivos: 1,
    conflictosDetectados: 0
  },
  {
    id: 'PARTE-002',
    tipo: 'persona_fisica',
    nombreCompleto: 'María Teresa Rodríguez López',
    nombreNormalizado: 'maria teresa rodriguez lopez',
    documentoIdentidad: '87654321B',
    direccion: {
      calle: 'Avenida Diagonal 300, 8º',
      ciudad: 'Barcelona',
      codigoPostal: '08013',
      provincia: 'Barcelona',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 623 456 789',
      email: 'mrodriguez@email.com'
    },
    expedientesRelacionados: ['EXP-2024-002'],
    abogadosQueRepresentaron: ['Juan Pérez'],
    fechaCreacion: haceMeses(12),
    ultimaActualizacion: haceMeses(1),
    etiquetas: ['divorcio', 'barcelona'],
    totalExpedientes: 1,
    expedientesActivos: 1,
    conflictosDetectados: 0
  },
  {
    id: 'PARTE-003',
    tipo: 'persona_fisica',
    nombreCompleto: 'Roberto Sánchez Vega',
    nombreNormalizado: 'roberto sanchez vega',
    documentoIdentidad: '23456789C',
    direccion: {
      calle: 'Plaza España 12',
      ciudad: 'Sevilla',
      codigoPostal: '41013',
      provincia: 'Sevilla',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 634 567 890',
      email: 'roberto.sanchez@email.com'
    },
    expedientesRelacionados: ['EXP-2024-003', 'EXP-2024-020'],
    abogadosQueRepresentaron: ['Carlos Méndez', 'Ana López'],
    fechaCreacion: haceMeses(24),
    ultimaActualizacion: haceMeses(3),
    etiquetas: ['laboral', 'sevilla', 'despido'],
    notas: 'Ex-director de TechCorp SL. Caso de despido improcedente.',
    totalExpedientes: 2,
    expedientesActivos: 1,
    conflictosDetectados: 1
  },
  {
    id: 'PARTE-004',
    tipo: 'persona_fisica',
    nombreCompleto: 'Carmen Ruiz Pérez',
    nombreNormalizado: 'carmen ruiz perez',
    documentoIdentidad: '34567890D',
    direccion: {
      calle: 'Calle Alcalá 150, 5º A',
      ciudad: 'Madrid',
      codigoPostal: '28009',
      provincia: 'Madrid',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 645 678 901',
      email: 'carmen.ruiz@email.com'
    },
    expedientesRelacionados: ['EXP-2024-004'],
    abogadosQueRepresentaron: ['Laura Torres'],
    fechaCreacion: haceMeses(8),
    ultimaActualizacion: haceMeses(1),
    etiquetas: ['seguros', 'madrid', 'resuelto'],
    totalExpedientes: 1,
    expedientesActivos: 0,
    conflictosDetectados: 0
  },
  {
    id: 'PARTE-005',
    tipo: 'persona_fisica',
    nombreCompleto: 'Fernando López Martínez',
    nombreNormalizado: 'fernando lopez martinez',
    documentoIdentidad: '45678901E',
    direccion: {
      calle: 'Paseo de Gracia 85, 4º 2ª',
      ciudad: 'Barcelona',
      codigoPostal: '08008',
      provincia: 'Barcelona',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 656 789 012',
      email: 'fernando.lopez@email.com'
    },
    expedientesRelacionados: ['EXP-2024-016'],
    abogadosQueRepresentaron: ['Juan Pérez'],
    fechaCreacion: haceMeses(6),
    ultimaActualizacion: haceMeses(2),
    etiquetas: ['accidente', 'barcelona'],
    notas: 'Víctima de accidente de tráfico. Lesiones graves.',
    totalExpedientes: 1,
    expedientesActivos: 1,
    conflictosDetectados: 0
  },
  {
    id: 'PARTE-006',
    tipo: 'persona_fisica',
    nombreCompleto: 'Isabel Gómez Hernández',
    nombreNormalizado: 'isabel gomez hernandez',
    documentoIdentidad: '56789012F',
    direccion: {
      calle: 'Calle Colón 23',
      ciudad: 'Valencia',
      codigoPostal: '46004',
      provincia: 'Valencia',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 667 890 123',
      email: 'isabel.gomez@email.com'
    },
    expedientesRelacionados: ['EXP-2024-007'],
    abogadosQueRepresentaron: ['Carlos Méndez'],
    fechaCreacion: haceMeses(14),
    ultimaActualizacion: haceMeses(2),
    etiquetas: ['sucesiones', 'valencia', 'herencia'],
    totalExpedientes: 1,
    expedientesActivos: 1,
    conflictosDetectados: 0
  },
  {
    id: 'PARTE-007',
    tipo: 'persona_fisica',
    nombreCompleto: 'Miguel Ángel Torres Ruiz',
    nombreNormalizado: 'miguel angel torres ruiz',
    documentoIdentidad: '67890123G',
    direccion: {
      calle: 'Rúa Nova 45',
      ciudad: 'Santiago de Compostela',
      codigoPostal: '15705',
      provincia: 'La Coruña',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 678 901 234',
      email: 'miguel.torres@email.com'
    },
    expedientesRelacionados: ['EXP-2024-021'],
    abogadosQueRepresentaron: ['Ana López'],
    fechaCreacion: haceMeses(3),
    ultimaActualizacion: haceMeses(1),
    etiquetas: ['galicia', 'familiar'],
    totalExpedientes: 1,
    expedientesActivos: 1,
    conflictosDetectados: 0
  }
];

// ============================================
// PARTES CONTRARIAS - PERSONAS JURÍDICAS
// ============================================

export const partesJuridicasData: ParteContraria[] = [
  {
    id: 'PARTE-101',
    tipo: 'persona_juridica',
    razonSocial: 'Banco Santander S.A.',
    nombreNormalizado: 'banco santander sa',
    cifNif: 'A-39000013',
    direccion: {
      calle: 'Paseo de Pereda 9-12',
      ciudad: 'Santander',
      codigoPostal: '39004',
      provincia: 'Cantabria',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 915 123 456',
      email: 'legal@bancosantander.es',
      fax: '+34 915 123 457'
    },
    representanteLegal: 'Ana Botín Sanz de Sautuola',
    grupoEmpresarialId: 'GRUPO-001',
    expedientesRelacionados: ['EXP-2024-001', 'EXP-2024-008', 'EXP-2024-017'],
    abogadosQueRepresentaron: ['Garrigues Abogados', 'Uría Menéndez'],
    fechaCreacion: haceMeses(36),
    ultimaActualizacion: haceMeses(1),
    etiquetas: ['banca', 'reincidente', 'grande', 'cantabria'],
    notas: 'Entidad bancaria recurrente en litigios de cláusulas suelo.',
    totalExpedientes: 3,
    expedientesActivos: 2,
    conflictosDetectados: 2
  },
  {
    id: 'PARTE-102',
    tipo: 'persona_juridica',
    razonSocial: 'TechCorp Innovaciones SL',
    nombreNormalizado: 'techcorp innovaciones sl',
    cifNif: 'B-12345678',
    direccion: {
      calle: 'Calle Tecnología 100, Edificio Innova',
      ciudad: 'Madrid',
      codigoPostal: '28050',
      provincia: 'Madrid',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 916 789 012',
      email: 'legal@techcorp.es'
    },
    representanteLegal: 'Roberto Sánchez Vega',
    empresaMatrizId: 'PARTE-105', // Pertenece al Grupo Tecnológico Ibérico
    expedientesRelacionados: ['EXP-2024-003', 'EXP-2024-012'],
    abogadosQueRepresentaron: ['Cuatrecasas'],
    fechaCreacion: haceMeses(20),
    ultimaActualizacion: haceMeses(2),
    etiquetas: ['tecnología', 'madrid', 'despido', 'concursal'],
    notas: 'Empresa tecnológica en proceso de reestructuración.',
    totalExpedientes: 2,
    expedientesActivos: 2,
    conflictosDetectados: 1
  },
  {
    id: 'PARTE-103',
    tipo: 'persona_juridica',
    razonSocial: 'Aseguradora La Estrella S.A.',
    nombreNormalizado: 'aseguradora la estrella sa',
    cifNif: 'A-87654321',
    direccion: {
      calle: 'Paseo de la Castellana 200',
      ciudad: 'Madrid',
      codigoPostal: '28046',
      provincia: 'Madrid',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 917 890 123',
      email: 'juridico@laestrella.es'
    },
    representanteLegal: 'José María García',
    expedientesRelacionados: ['EXP-2024-004', 'EXP-2024-022'],
    abogadosQueRepresentaron: ['CMS Albiñana'],
    fechaCreacion: haceMeses(15),
    ultimaActualizacion: haceMeses(3),
    etiquetas: ['seguros', 'madrid', 'reincidente'],
    totalExpedientes: 2,
    expedientesActivos: 1,
    conflictosDetectados: 0
  },
  {
    id: 'PARTE-104',
    tipo: 'persona_juridica',
    razonSocial: 'Constructora del Norte SA',
    nombreNormalizado: 'constructora del norte sa',
    cifNif: 'A-98765432',
    direccion: {
      calle: 'Avenida de la Industria 500',
      ciudad: 'Bilbao',
      codigoPostal: '48004',
      provincia: 'Vizcaya',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 918 901 234',
      email: 'legal@constructoranorte.es'
    },
    representanteLegal: 'Pedro Bilbao Martínez',
    expedientesRelacionados: ['EXP-2024-009', 'EXP-2024-018', 'EXP-2024-023'],
    abogadosQueRepresentaron: ['Ramón y Cajal Abogados'],
    fechaCreacion: haceMeses(28),
    ultimaActualizacion: haceMeses(1),
    etiquetas: ['construcción', 'país vasco', 'reincidente', 'deudas'],
    notas: 'Empresa constructora con múltiples litigios de impago.',
    totalExpedientes: 3,
    expedientesActivos: 2,
    conflictosDetectados: 1
  },
  {
    id: 'PARTE-105',
    tipo: 'persona_juridica',
    razonSocial: 'Grupo Tecnológico Ibérico Holding SL',
    nombreNormalizado: 'grupo tecnologico iberico holding sl',
    cifNif: 'B-11111111',
    direccion: {
      calle: 'Torre Empresarial, Paseo de la Castellana 250',
      ciudad: 'Madrid',
      codigoPostal: '28046',
      provincia: 'Madrid',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 919 012 345',
      email: 'holding@gtiiberico.es'
    },
    representanteLegal: 'María Dolores Ibáñez',
    empresasFiliales: ['PARTE-102', 'PARTE-106', 'PARTE-107'],
    grupoEmpresarialId: 'GRUPO-002',
    expedientesRelacionados: ['EXP-2024-012'],
    abogadosQueRepresentaron: ['Cuatrecasas', 'Gómez-Acebo & Pombo'],
    fechaCreacion: haceMeses(30),
    ultimaActualizacion: haceMeses(2),
    etiquetas: ['holding', 'tecnología', 'madrid', 'grupo empresarial'],
    notas: 'Matriz del grupo empresarial tecnológico. Proceso concursal en curso.',
    totalExpedientes: 1,
    expedientesActivos: 1,
    conflictosDetectados: 1
  },
  {
    id: 'PARTE-106',
    tipo: 'persona_juridica',
    razonSocial: 'Software Solutions Iberia SL',
    nombreNormalizado: 'software solutions iberia sl',
    cifNif: 'B-22222222',
    direccion: {
      calle: 'Edificio Central, Calle Serrano 55',
      ciudad: 'Madrid',
      codigoPostal: '28006',
      provincia: 'Madrid',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 910 123 456',
      email: 'info@softwareiberia.es'
    },
    representanteLegal: 'Carlos Hernández Ruiz',
    empresaMatrizId: 'PARTE-105',
    expedientesRelacionados: ['EXP-2024-024'],
    abogadosQueRepresentaron: ['Pérez-Llorca'],
    fechaCreacion: haceMeses(10),
    ultimaActualizacion: haceMeses(1),
    etiquetas: ['software', 'madrid', 'filial'],
    totalExpedientes: 1,
    expedientesActivos: 1,
    conflictosDetectados: 0
  },
  {
    id: 'PARTE-107',
    tipo: 'persona_juridica',
    razonSocial: 'Data Analytics Partners SL',
    nombreNormalizado: 'data analytics partners sl',
    cifNif: 'B-33333333',
    direccion: {
      calle: 'Calle Orense 58, 6º',
      ciudad: 'Madrid',
      codigoPostal: '28020',
      provincia: 'Madrid',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 911 234 567',
      email: 'contacto@datapartners.es'
    },
    representanteLegal: 'Laura Martínez Sanz',
    empresaMatrizId: 'PARTE-105',
    expedientesRelacionados: [],
    abogadosQueRepresentaron: [],
    fechaCreacion: haceMeses(4),
    ultimaActualizacion: haceMeses(1),
    etiquetas: ['big data', 'madrid', 'filial'],
    totalExpedientes: 0,
    expedientesActivos: 0,
    conflictosDetectados: 0
  },
  {
    id: 'PARTE-108',
    tipo: 'persona_juridica',
    razonSocial: 'Inmobiliaria Sol y Mar SL',
    nombreNormalizado: 'inmobiliaria sol y mar sl',
    cifNif: 'B-44444444',
    direccion: {
      calle: 'Avenida del Mar 120',
      ciudad: 'Málaga',
      codigoPostal: '29016',
      provincia: 'Málaga',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 912 345 678',
      email: 'admin@solymar.es'
    },
    representanteLegal: 'Antonio Ruiz García',
    expedientesRelacionados: ['EXP-2024-011'],
    abogadosQueRepresentaron: ['Bufete Rodríguez'],
    fechaCreacion: haceMeses(8),
    ultimaActualizacion: haceMeses(2),
    etiquetas: ['inmobiliaria', 'málaga', 'arrendamiento'],
    totalExpedientes: 1,
    expedientesActivos: 1,
    conflictosDetectados: 0
  },
  {
    id: 'PARTE-109',
    tipo: 'persona_juridica',
    razonSocial: 'Hacienda Pública - Agencia Tributaria',
    nombreNormalizado: 'hacienda publica agencia tributaria',
    cifNif: 'S-2800370',
    direccion: {
      calle: 'Calle Lérida 32-36',
      ciudad: 'Madrid',
      codigoPostal: '28020',
      provincia: 'Madrid',
      pais: 'España'
    },
    contacto: {
      telefono: '+34 901 200 345',
      email: 'atencion.publica@hacienda.es'
    },
    representanteLegal: 'Delegación Especial de Madrid',
    expedientesRelacionados: ['EXP-2024-006'],
    abogadosQueRepresentaron: ['Abogacía del Estado'],
    fechaCreacion: haceMeses(40),
    ultimaActualizacion: haceMeses(5),
    etiquetas: ['administración', 'madrid', 'fiscal', 'penal'],
    notas: 'Parte contraria en procedimientos fiscales y penales.',
    totalExpedientes: 1,
    expedientesActivos: 1,
    conflictosDetectados: 0
  }
];

// ============================================
// CONSOLIDADO DE TODAS LAS PARTES
// ============================================

export const partesContrariasData: ParteContraria[] = [
  ...partesFisicasData,
  ...partesJuridicasData
];

// ============================================
// RELACIONES ENTRE ENTIDADES
// ============================================

export const relacionesEntidadesData: RelacionEntidad[] = [
  // Grupo Empresarial: Grupo Tecnológico Ibérico
  {
    id: 'REL-001',
    entidadAId: 'PARTE-105', // Holding
    entidadBId: 'PARTE-102', // TechCorp
    tipoRelacion: 'matriz_filial',
    descripcion: 'TechCorp es filial al 100% del Holding',
    activa: true,
    fechaInicio: haceMeses(24)
  },
  {
    id: 'REL-002',
    entidadAId: 'PARTE-105', // Holding
    entidadBId: 'PARTE-106', // Software Solutions
    tipoRelacion: 'matriz_filial',
    descripcion: 'Software Solutions es filial al 75%',
    activa: true,
    fechaInicio: haceMeses(15)
  },
  {
    id: 'REL-003',
    entidadAId: 'PARTE-105', // Holding
    entidadBId: 'PARTE-107', // Data Analytics
    tipoRelacion: 'matriz_filial',
    descripcion: 'Data Analytics es filial al 60%',
    activa: true,
    fechaInicio: haceMeses(8)
  },
  {
    id: 'REL-004',
    entidadAId: 'PARTE-105',
    entidadBId: 'GRUPO-002',
    tipoRelacion: 'grupo_empresarial',
    descripcion: 'Pertenece al Grupo Tecnológico Ibérico',
    activa: true,
    fechaInicio: haceMeses(30)
  },
  // Relaciones de accionistas
  {
    id: 'REL-005',
    entidadAId: 'PARTE-003', // Roberto Sánchez
    entidadBId: 'PARTE-102', // TechCorp
    tipoRelacion: 'directivo',
    descripcion: 'Ex-director general de TechCorp',
    activa: false,
    fechaInicio: haceMeses(36),
    fechaFin: haceMeses(6)
  },
  {
    id: 'REL-006',
    entidadAId: 'PARTE-003', // Roberto Sánchez
    entidadBId: 'PARTE-105', // Holding
    tipoRelacion: 'accionista',
    descripcion: 'Accionista minoritario del 5%',
    porcentajeParticipacion: 5,
    activa: true,
    fechaInicio: haceMeses(36)
  },
  // Relaciones familiares (ejemplo)
  {
    id: 'REL-007',
    entidadAId: 'PARTE-001', // Antonio García
    entidadBId: 'PARTE-101', // Banco Santander
    tipoRelacion: 'otro',
    descripcion: 'Cliente habitual del banco',
    activa: true
  }
];

// ============================================
// GRUPOS EMPRESARIALES
// ============================================

export const gruposEmpresarialesData: GrupoEmpresarial[] = [
  {
    id: 'GRUPO-001',
    nombre: 'Grupo Banco Santander',
    descripcion: 'Grupo financiero multinacional español',
    empresasIds: ['PARTE-101'],
    fechaCreacion: haceMeses(48)
  },
  {
    id: 'GRUPO-002',
    nombre: 'Grupo Tecnológico Ibérico',
    descripcion: 'Holding tecnológico con múltiples filiales',
    empresasIds: ['PARTE-105', 'PARTE-102', 'PARTE-106', 'PARTE-107'],
    fechaCreacion: haceMeses(30)
  }
];

// ============================================
// FUNCIONES AUXILIARES
// ============================================

export function getParteById(id: string): ParteContraria | undefined {
  return partesContrariasData.find(p => p.id === id);
}

export function getRelacionesByParteId(parteId: string): RelacionEntidad[] {
  return relacionesEntidadesData.filter(
    r => r.entidadAId === parteId || r.entidadBId === parteId
  );
}

export function getGrupoEmpresarialById(id: string): GrupoEmpresarial | undefined {
  return gruposEmpresarialesData.find(g => g.id === id);
}

export function getPartesByGrupoEmpresarial(grupoId: string): ParteContraria[] {
  const grupo = getGrupoEmpresarialById(grupoId);
  if (!grupo) return [];
  return partesContrariasData.filter(p => grupo.empresasIds.includes(p.id));
}

export function getPartesByExpediente(expedienteId: string): ParteContraria[] {
  return partesContrariasData.filter(p => 
    p.expedientesRelacionados.includes(expedienteId)
  );
}

// Obtener todas las entidades relacionadas (jerarquía completa)
export function getEntidadesRelacionadas(
  parteId: string, 
  profundidad: number = 2
): { parte: ParteContraria; nivel: number; tipoRelacion: TipoRelacion }[] {
  const resultado: { parte: ParteContraria; nivel: number; tipoRelacion: TipoRelacion }[] = [];
  const visitados = new Set<string>();
  
  function buscarRecursivo(id: string, nivel: number) {
    if (nivel > profundidad || visitados.has(id)) return;
    visitados.add(id);
    
    const relaciones = relacionesEntidadesData.filter(
      r => r.activa && (r.entidadAId === id || r.entidadBId === id)
    );
    
    for (const rel of relaciones) {
      const otraParteId = rel.entidadAId === id ? rel.entidadBId : rel.entidadAId;
      const otraParte = getParteById(otraParteId);
      
      if (otraParte && !visitados.has(otraParteId)) {
        resultado.push({
          parte: otraParte,
          nivel,
          tipoRelacion: rel.tipoRelacion
        });
        buscarRecursivo(otraParteId, nivel + 1);
      }
    }
  }
  
  buscarRecursivo(parteId, 1);
  return resultado;
}

// Exportar lista única de etiquetas
export const etiquetasUnicas: string[] = Array.from(
  new Set(partesContrariasData.flatMap(p => p.etiquetas))
).sort();

// Estadísticas
export const estadisticasPartes = {
  total: partesContrariasData.length,
  fisicas: partesFisicasData.length,
  juridicas: partesJuridicasData.length,
  conExpedientesActivos: partesContrariasData.filter(p => p.expedientesActivos > 0).length,
  conConflictos: partesContrariasData.filter(p => p.conflictosDetectados > 0).length,
  gruposEmpresariales: gruposEmpresarialesData.length,
  totalRelaciones: relacionesEntidadesData.length
};
