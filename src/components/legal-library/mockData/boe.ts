import type { BOEDay, BOEDocument } from '../types';

const ministerios = [
  'Presidencia, Relaciones con las Cortes y Memoria Democrática',
  'Asuntos Exteriores, Unión Europea y Cooperación',
  'Justicia',
  'Defensa',
  'Hacienda',
  'Interior',
  'Transportes, Movilidad y Agenda Urbana',
  'Educación y Formación Profesional',
  'Trabajo y Economía Social',
  'Industria, Comercio y Turismo',
  'Agricultura, Pesca y Alimentación',
  'Sanidad',
  'Derechos Sociales y Agenda 2030',
  'Cultura y Deporte',
  'Política Territorial y Memoria Democrática',
];

const tipos = ['ley', 'real-decreto', 'orden', 'resolucion', 'circular'] as const;

const materias = [
  'Derecho administrativo',
  'Derecho civil',
  'Derecho penal',
  'Derecho laboral',
  'Derecho mercantil',
  'Hacienda pública',
  'Educación',
  'Sanidad',
  'Medio ambiente',
  'Función pública',
];

// Generar documentos BOE para una fecha
function generateBOEDocuments(date: Date, baseNum: number): BOEDocument[] {
  const docs: BOEDocument[] = [];
  const count = Math.floor(Math.random() * 8) + 3; // 3-10 documentos por día

  for (let i = 0; i < count; i++) {
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const ministerio = ministerios[Math.floor(Math.random() * ministerios.length)];
    const materia = materias[Math.floor(Math.random() * materias.length)];
    
    const tipoNombre = {
      'ley': tipo === 'ley' ? 'Ley Orgánica' : 'Ley',
      'real-decreto': 'Real Decreto',
      'orden': 'Orden',
      'resolucion': 'Resolución',
      'circular': 'Circular',
    }[tipo];

    const num = baseNum + i;
    const year = date.getFullYear();

    docs.push({
      id: `BOE-${date.toISOString().split('T')[0]}-${i}`,
      number: `${tipoNombre} ${num}/${year}`,
      date: date.toISOString().split('T')[0],
      title: `${tipoNombre} por la que se ${['regula', 'modifica', 'desarrolla', 'aprueba'][Math.floor(Math.random() * 4)]} ${materia.toLowerCase()} y otras medidas relacionadas con el sector`,
      type: tipo,
      ministry: ministerio,
      summary: `Se regula la normativa aplicable a ${materia.toLowerCase()}, estableciendo las medidas necesarias para su correcta aplicación y desarrollo normativo.`,
      pdfUrl: `https://boe.es/boe/dias/${date.toISOString().split('T')[0].replace(/-/g, '/')}/pdfs/BOE-${num}.pdf`,
    });
  }

  return docs;
}

// Generar 30 días de BOE
export function generateBOEHistory(): BOEDay[] {
  const boeDays: BOEDay[] = [];
  const today = new Date();
  let docNumber = 100;

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // No generar fines de semana (sábado=6, domingo=0)
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dayNum = Math.floor(Math.random() * 50) + 50 + (29 - i);
    
    boeDays.push({
      date: date.toISOString().split('T')[0],
      number: `${dayNum}`,
      documents: generateBOEDocuments(date, docNumber),
    });

    docNumber += 10;
  }

  return boeDays;
}

// BOE de hoy (datos estáticos representativos)
export const boeHoy: BOEDay = {
  date: new Date().toISOString().split('T')[0],
  number: '45',
  documents: [
    {
      id: 'BOE-001',
      number: 'Ley Orgánica 2/2026',
      date: new Date().toISOString().split('T')[0],
      title: 'Ley Orgánica de modificación del Código Penal en materia de ciberseguridad y protección de datos',
      type: 'ley',
      ministry: 'Ministerio de Justicia',
      summary: 'Se modifican los artículos 197, 248 y 270 del Código Penal para tipificar como delitos específicos los ataques a infraestructuras críticas y el robo masivo de datos personales.',
    },
    {
      id: 'BOE-002',
      number: 'Real Decreto 123/2026',
      date: new Date().toISOString().split('T')[0],
      title: 'Real Decreto por el que se desarrolla la Ley 39/2015, de Procedimiento Administrativo Común',
      type: 'real-decreto',
      ministry: 'Ministerio de la Presidencia, Relaciones con las Cortes y Memoria Democrática',
      summary: 'Se establecen las normas de funcionamiento de los registros electrónicos de las administraciones públicas y se regula la firma electrónica en el ámbito administrativo.',
    },
    {
      id: 'BOE-003',
      number: 'Orden ETD/456/2026',
      date: new Date().toISOString().split('T')[0],
      title: 'Orden por la que se regulan las becas y ayudas al estudio para el curso 2026-2027',
      type: 'orden',
      ministry: 'Ministerio de Educación y Formación Profesional',
      summary: 'Se establecen los requisitos, cuantías y procedimiento de concesión de becas y ayudas al estudio para estudiantes de educación postobligatoria.',
    },
    {
      id: 'BOE-004',
      number: 'Resolución 789/2026',
      date: new Date().toISOString().split('T')[0],
      title: 'Resolución de la Dirección General de Tráfico sobre normas de circulación de vehículos',
      type: 'resolucion',
      ministry: 'Ministerio del Interior',
      summary: 'Se modifican las normas de circulación para adaptar la regulación a los nuevos sistemas de conducción automatizada.',
    },
    {
      id: 'BOE-005',
      number: 'Real Decreto 124/2026',
      date: new Date().toISOString().split('T')[0],
      title: 'Real Decreto de medidas urgentes en materia de vivienda y alquiler',
      type: 'real-decreto',
      ministry: 'Ministerio de Transportes, Movilidad y Agenda Urbana',
      summary: 'Se adoptan medidas urgentes para incrementar el parque de vivienda en alquiler asequible y se regula el índice de referencia de precios de alquiler.',
    },
    {
      id: 'BOE-006',
      number: 'Ley 3/2026',
      date: new Date().toISOString().split('T')[0],
      title: 'Ley de impulso a la economía digital y de las startups',
      type: 'ley',
      ministry: 'Ministerio de Economía, Comercio y Empresa',
      summary: 'Se establece un marco normativo favorable para la creación y desarrollo de empresas de base tecnológica, incluyendo beneficios fiscales y simplificación administrativa.',
    },
  ],
};

// Historial de BOE
export const boeHistory: BOEDay[] = generateBOEHistory();

// Función para buscar en el BOE
export function searchBOE(query: string): BOEDocument[] {
  const allDocs = [boeHoy, ...boeHistory].flatMap(day => day.documents);
  const lowerQuery = query.toLowerCase();
  
  return allDocs.filter(doc => 
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.number.toLowerCase().includes(lowerQuery) ||
    doc.summary.toLowerCase().includes(lowerQuery) ||
    doc.ministry.toLowerCase().includes(lowerQuery)
  );
}

export default {
  boeHoy,
  boeHistory,
  searchBOE,
};
