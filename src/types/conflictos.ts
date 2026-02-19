// ============================================
// TIPOS Y DEFINICIONES DE CONFLICTOS Y PARTES CONTRARIAS
// ============================================

// ============================================
// TIPOS BÁSICOS
// ============================================

export type TipoParte = 'persona_fisica' | 'persona_juridica';

export type TipoRelacion = 
  | 'grupo_empresarial' 
  | 'matriz_filial' 
  | 'accionista' 
  | 'directivo' 
  | 'familiar' 
  | 'otro';

export type TipoConflicto = 'directo' | 'indirecto' | 'aparente' | 'potencial';

export type EstadoConflicto = 'detectado' | 'en_analisis' | 'resuelto' | 'descartado';

export type SeveridadConflicto = 'baja' | 'media' | 'alta' | 'critica';

export type EstadoValidacion = 'pendiente' | 'en_proceso' | 'aprobado' | 'rechazado' | 'escalado';

export type TipoDocumento = 
  | 'informe_completo' 
  | 'resumen_ejecutivo' 
  | 'checklist' 
  | 'justificacion' 
  | 'decision';

// ============================================
// INTERFACES DE PARTES CONTRARIAS
// ============================================

export interface Direccion {
  calle: string;
  ciudad: string;
  codigoPostal: string;
  provincia: string;
  pais: string;
}

export interface Contacto {
  telefono?: string;
  email?: string;
  fax?: string;
}

export interface ParteContraria {
  id: string;
  tipo: TipoParte;
  
  // Datos persona física
  nombreCompleto?: string;
  nombreNormalizado: string;
  documentoIdentidad?: string;
  
  // Datos persona jurídica
  razonSocial?: string;
  cifNif?: string;
  
  // Datos comunes
  direccion?: Direccion;
  contacto?: Contacto;
  representanteLegal?: string;
  
  // Jerarquía empresarial
  grupoEmpresarialId?: string;
  empresaMatrizId?: string;
  empresasFiliales?: string[];
  
  // Relaciones
  expedientesRelacionados: string[];
  abogadosQueRepresentaron: string[];
  
  // Metadatos
  fechaCreacion: Date;
  ultimaActualizacion: Date;
  notas?: string;
  etiquetas: string[];
  
  // Campos calculados
  totalExpedientes: number;
  expedientesActivos: number;
  conflictosDetectados: number;
}

export interface RelacionEntidad {
  id: string;
  entidadAId: string;
  entidadBId: string;
  tipoRelacion: TipoRelacion;
  descripcion?: string;
  porcentajeParticipacion?: number; // Para accionistas
  fechaInicio?: Date;
  fechaFin?: Date;
  activa: boolean;
}

export interface GrupoEmpresarial {
  id: string;
  nombre: string;
  descripcion?: string;
  empresasIds: string[];
  fechaCreacion: Date;
}

// ============================================
// INTERFACES DE CONFLICTOS
// ============================================

export interface EntidadConflicto {
  tipo: 'cliente' | 'parte_contraria' | 'abogado' | 'tercero';
  id: string;
  nombre: string;
}

export interface Conflicto {
  id: string;
  expedienteId: string;
  tipoConflicto: TipoConflicto;
  estado: EstadoConflicto;
  severidad: SeveridadConflicto;
  entidadA: EntidadConflicto;
  entidadB: EntidadConflicto;
  descripcion: string;
  fechaDeteccion: Date;
  analizadoPor?: string;
  resolucion?: string;
  fechaResolucion?: Date;
  documentosSoporte: string[];
  justificacionResolucion?: string;
}

export interface ReglaConflicto {
  id: string;
  nombre: string;
  descripcion: string;
  criterios: CriterioConflicto[];
  activa: boolean;
  prioridad: number;
  fechaCreacion: Date;
}

export interface CriterioConflicto {
  id: string;
  tipo: 'nombre_similar' | 'mismo_documento' | 'mismo_abogado' | 'mismo_cliente' | 'relacion_familiar' | 'grupo_empresarial';
  umbralSimilitud?: number; // 0-100 para fuzzy matching
  ponderacion: number; // Peso del criterio en el scoring
}

export interface AnalisisConflicto {
  id: string;
  expedienteId: string;
  fechaAnalisis: Date;
  resultado: 'sin_conflictos' | 'conflictos_detectados' | 'requiere_revision';
  conflictosEncontrados: Conflicto[];
  analizadoPor: string;
  tiempoAnalisis: number; // en segundos
  metodologiaUtilizada: string;
  basesDatosConsultadas: string[];
  scoringTotal: number; // 0-100
}

// ============================================
// INTERFACES DE VALIDACIÓN
// ============================================

export interface ValidacionExpediente {
  id: string;
  expedienteId: string;
  estadoValidacion: EstadoValidacion;
  fechaSolicitud: Date;
  solicitadoPor: string;
  checklist: ItemChecklist[];
  conflictosDetectados: Conflicto[];
  analisisConflicto?: AnalisisConflicto;
  aprobadoPor?: string;
  fechaAprobacion?: Date;
  justificacionDecision?: string;
  documentacionAdicional?: string[];
  nivelRiesgo: 'bajo' | 'medio' | 'alto' | 'critico';
  requiereAprobacionSocio: boolean;
  fechaLimite?: Date;
}

export interface ItemChecklist {
  id: string;
  categoria: 'cliente' | 'parte_contraria' | 'abogado' | 'materia' | 'otro';
  descripcion: string;
  requerido: boolean;
  completado: boolean;
  verificadoPor?: string;
  fechaVerificacion?: Date;
  notas?: string;
}

export interface DecisionValidacion {
  id: string;
  validacionId: string;
  tipoDecision: 'aprobacion' | 'rechazo' | 'escalado' | 'condicional';
  tomadaPor: string;
  fechaDecision: Date;
  justificacion: string;
  condiciones?: string[];
  aprobadaPorSocio?: boolean;
}

// ============================================
// INTERFACES DE DOCUMENTACIÓN
// ============================================

export interface DocumentacionAnalisis {
  id: string;
  analisisId: string;
  tipoDocumento: TipoDocumento;
  contenido: string;
  generadoPor: string;
  fechaGeneracion: Date;
  version: number;
  firmadoPor?: string[];
  fechaFirma?: Date;
  hashVerificacion: string;
}

export interface RegistroAuditoria {
  id: string;
  entidadTipo: 'conflicto' | 'analisis' | 'validacion' | 'parte_contraria';
  entidadId: string;
  accion: 'creacion' | 'modificacion' | 'eliminacion' | 'consulta' | 'aprobacion' | 'rechazo';
  usuarioId: string;
  usuarioNombre: string;
  rol: string;
  fechaAccion: Date;
  camposModificados?: string[];
  valoresAnteriores?: Record<string, any>;
  valoresNuevos?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface InformeAnalisis {
  id: string;
  expedienteId: string;
  fechaAnalisis: Date;
  responsableAnalisis: string;
  metodologiaUtilizada: string;
  basesDatosConsultadas: string[];
  conflictosIdentificados: Conflicto[];
  conflictosDescartados: ConflictoDescartado[];
  conclusiones: string;
  recomendaciones: string;
  decisionFinal: 'aceptar' | 'rechazar' | 'condicional';
  documentosAdjuntos: string[];
  aprobadoPor?: string;
  fechaAprobacion?: Date;
}

export interface ConflictoDescartado {
  id: string;
  descripcion: string;
  razonDescarte: string;
  descartadoPor: string;
  fechaDescarte: Date;
}

// ============================================
// INTERFACES DE FILTROS Y BÚSQUEDA
// ============================================

export interface FiltrosParteContraria {
  tipo?: TipoParte;
  busqueda?: string;
  etiquetas?: string[];
  grupoEmpresarialId?: string;
  expedienteRelacionado?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  abogadoRelacionado?: string;
  tieneConflictos?: boolean;
}

export interface ResultadoBusqueda {
  parte: ParteContraria;
  scoreSimilitud: number; // 0-100
  camposCoincidentes: string[];
}

export interface ConfiguracionMotor {
  umbralSimilitud: number; // 0-100
  profundidadBusqueda: 1 | 2 | 3; // Niveles de relaciones
  camposAComparar: string[];
  reglasActivas: string[];
}

// ============================================
// HELPERS Y FUNCIONES UTILITARIAS
// ============================================

/**
 * Normaliza un texto para búsquedas:
 * - Minúsculas
 * - Sin acentos
 * - Sin espacios múltiples
 * - Sin caracteres especiales
 */
export function normalizarTexto(texto: string): string {
  if (!texto) return '';
  
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s]/g, '') // Solo letras, números y espacios
    .replace(/\s+/g, ' ') // Espacios múltiples a uno solo
    .trim();
}

/**
 * Algoritmo de distancia de Levenshtein
 * Calcula el número mínimo de operaciones (inserciones, eliminaciones, sustituciones)
 * necesarias para transformar una cadena en otra.
 */
export function calcularDistanciaLevenshtein(str1: string, str2: string): number {
  const s1 = normalizarTexto(str1);
  const s2 = normalizarTexto(str2);
  
  if (s1 === s2) return 0;
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;
  
  // Matriz de distancias
  const matrix: number[][] = [];
  
  // Inicializar primera fila y columna
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }
  
  // Calcular distancias
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // Eliminación
        matrix[i][j - 1] + 1,      // Inserción
        matrix[i - 1][j - 1] + cost // Sustitución
      );
    }
  }
  
  return matrix[s1.length][s2.length];
}

/**
 * Calcula la similitud entre dos textos usando Levenshtein
 * Devuelve un porcentaje (0-100)
 */
export function calcularSimilitud(texto1: string, texto2: string): number {
  const s1 = normalizarTexto(texto1);
  const s2 = normalizarTexto(texto2);
  
  if (!s1 && !s2) return 100;
  if (!s1 || !s2) return 0;
  
  const distancia = calcularDistanciaLevenshtein(s1, s2);
  const longitudMaxima = Math.max(s1.length, s2.length);
  
  return Math.round(((longitudMaxima - distancia) / longitudMaxima) * 100);
}

/**
 * Algoritmo avanzado de búsqueda fuzzy
 * Busca coincidencias en múltiples campos con ponderación
 */
export function busquedaFuzzyAvanzada(
  parte: ParteContraria,
  query: string,
  campos: string[] = ['nombreCompleto', 'razonSocial', 'documentoIdentidad', 'cifNif'],
  umbral: number = 70
): { match: boolean; score: number; campo: string } {
  const queryNormalizada = normalizarTexto(query);
  let mejorScore = 0;
  let mejorCampo = '';
  
  for (const campo of campos) {
    const valorCampo = (parte as any)[campo] || '';
    const score = calcularSimilitud(valorCampo, queryNormalizada);
    
    if (score > mejorScore) {
      mejorScore = score;
      mejorCampo = campo;
    }
  }
  
  return {
    match: mejorScore >= umbral,
    score: mejorScore,
    campo: mejorCampo
  };
}

/**
 * Extrae n-grams de un texto
 * Útil para búsqueda por tokens
 */
export function extraerNGrams(texto: string, n: number = 2): string[] {
  const normalizado = normalizarTexto(texto);
  const ngrams: string[] = [];
  
  for (let i = 0; i <= normalizado.length - n; i++) {
    ngrams.push(normalizado.substring(i, i + n));
  }
  
  return ngrams;
}

/**
 * Calcula la similitud por n-grams (Jaccard similarity)
 */
export function calcularSimilitudNGrams(texto1: string, texto2: string, n: number = 2): number {
  const ngrams1 = new Set(extraerNGrams(texto1, n));
  const ngrams2 = new Set(extraerNGrams(texto2, n));
  
  const interseccion = new Set([...ngrams1].filter(x => ngrams2.has(x)));
  const union = new Set([...ngrams1, ...ngrams2]);
  
  return Math.round((interseccion.size / union.size) * 100);
}

/**
 * Combinación de algoritmos para máxima precisión
 */
export function calcularSimilitudCombinada(
  texto1: string, 
  texto2: string,
  pesoLevenshtein: number = 0.6,
  pesoNGrams: number = 0.4
): number {
  const similitudLev = calcularSimilitud(texto1, texto2);
  const similitudNGram = calcularSimilitudNGrams(texto1, texto2);
  
  return Math.round((similitudLev * pesoLevenshtein) + (similitudNGram * pesoNGrams));
}

// ============================================
// FUNCIONES DE UTILIDAD PARA UI
// ============================================

export function getTipoParteColor(tipo: TipoParte): string {
  switch (tipo) {
    case 'persona_fisica':
      return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    case 'persona_juridica':
      return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400';
  }
}

export function getTipoParteTexto(tipo: TipoParte): string {
  switch (tipo) {
    case 'persona_fisica':
      return 'Persona Física';
    case 'persona_juridica':
      return 'Persona Jurídica';
    default:
      return tipo;
  }
}

export function getTipoRelacionTexto(tipo: TipoRelacion): string {
  const textos: Record<TipoRelacion, string> = {
    grupo_empresarial: 'Grupo Empresarial',
    matriz_filial: 'Matriz - Filial',
    accionista: 'Accionista',
    directivo: 'Directivo',
    familiar: 'Familiar',
    otro: 'Otra relación'
  };
  return textos[tipo] || tipo;
}

export function getTipoRelacionColor(tipo: TipoRelacion): string {
  const colores: Record<TipoRelacion, string> = {
    grupo_empresarial: 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30',
    matriz_filial: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    accionista: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    directivo: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    familiar: 'bg-rose-500/20 text-rose-500 border-rose-500/30',
    otro: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };
  return colores[tipo] || 'bg-slate-500/20 text-slate-400';
}

export function getEtiquetaColor(index: number): string {
  const colores = [
    'bg-blue-500/20 text-blue-500 border-blue-500/30',
    'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    'bg-purple-500/20 text-purple-500 border-purple-500/30',
    'bg-amber-500/20 text-amber-500 border-amber-500/30',
    'bg-rose-500/20 text-rose-500 border-rose-500/30',
    'bg-cyan-500/20 text-cyan-500 border-cyan-500/30',
  ];
  return colores[index % colores.length];
}

export function getTipoConflictoColor(tipo: TipoConflicto): string {
  const colores: Record<TipoConflicto, string> = {
    directo: 'bg-red-500/20 text-red-500 border-red-500/30',
    indirecto: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    aparente: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    potencial: 'bg-blue-500/20 text-blue-500 border-blue-500/30'
  };
  return colores[tipo] || 'bg-slate-500/20 text-slate-400';
}

export function getSeveridadColor(severidad: SeveridadConflicto): string {
  const colores: Record<SeveridadConflicto, string> = {
    baja: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    media: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    alta: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    critica: 'bg-red-500/20 text-red-500 border-red-500/30 animate-pulse'
  };
  return colores[severidad] || 'bg-slate-500/20 text-slate-400';
}

export function generarIdPrefijo(prefijo: string = 'PARTE'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefijo}-${timestamp}-${random}`;
}

export function obtenerNombreParte(parte: ParteContraria): string {
  if (parte.tipo === 'persona_fisica') {
    return parte.nombreCompleto || 'Sin nombre';
  }
  return parte.razonSocial || 'Sin razón social';
}

export function obtenerIdentificadorParte(parte: ParteContraria): string {
  if (parte.tipo === 'persona_fisica') {
    return parte.documentoIdentidad || 'Sin documento';
  }
  return parte.cifNif || 'Sin CIF/NIF';
}

// ============================================
// TIPOS PARA EL WIZARD
// ============================================

export type PasoWizard = 
  | 'tipo' 
  | 'datos_basicos' 
  | 'direccion_contacto' 
  | 'relaciones' 
  | 'resumen';

export interface WizardState {
  pasoActual: PasoWizard;
  datos: Partial<ParteContraria>;
  relaciones: RelacionEntidad[];
  errores: Record<string, string>;
  completado: boolean;
}

// ============================================
// CONSTANTES
// ============================================

export const ETAPAS_WIZARD: { id: PasoWizard; titulo: string; descripcion: string }[] = [
  { id: 'tipo', titulo: 'Tipo de Entidad', descripcion: 'Selecciona el tipo de parte contraria' },
  { id: 'datos_basicos', titulo: 'Datos Básicos', descripcion: 'Información principal de la entidad' },
  { id: 'direccion_contacto', titulo: 'Dirección y Contacto', descripcion: 'Datos de ubicación y comunicación' },
  { id: 'relaciones', titulo: 'Relaciones', descripcion: 'Conexiones con otras entidades' },
  { id: 'resumen', titulo: 'Resumen', descripcion: 'Revisa y confirma la información' }
];

export const TIPOS_DOCUMENTO_IDENTIDAD = [
  { value: 'DNI', label: 'DNI - Documento Nacional de Identidad' },
  { value: 'NIE', label: 'NIE - Número de Identidad de Extranjero' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
  { value: 'OTRO', label: 'Otro documento' }
];

export const PROVINCIAS_ESPANA = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Baleares',
  'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real',
  'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva',
  'Huesca', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lérida', 'Lugo',
  'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Orense', 'Palencia', 'Pontevedra',
  'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona',
  'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
];
