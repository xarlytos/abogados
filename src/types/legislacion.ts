/**
 * Tipos para integración con APIs de Legislación Oficial
 * Basado en esquemas reales del BOE y CENDOJ
 * 
 * Documentación referencia:
 * - BOE API: https://datos.gobie.es/es/catalogo?id=e047d6e9-2166-4ed5-9356-0f5f7b2c6e3e
 * - CENDOJ API: https://www.poderjudicial.es/cgpj/es/Tribunales/CENDOJ/Informacion-tecnica
 */

// ============================================
// TIPOS COMUNES
// ============================================

export type TipoDocumento = 
  | 'constitucion'
  | 'codigo' 
  | 'ley'
  | 'real_decreto'
  | 'real_decreto_ley'
  | 'real_decreto_legislativo'
  | 'orden'
  | 'resolucion'
  | 'circular'
  | 'convenio'
  | 'doctrina'
  | 'jurisprudencia'
  | 'sentencia'
  | 'auto'
  | 'providencia'
  // Tipos específicos de BOE
  | 'disposicion'
  | 'anuncio'
  | 'contrato'
  | 'autoridad'
  // Tipos específicos de CENDOJ
  | 'decreto';

export type Materia = 
  | 'constitucional'
  | 'civil'
  | 'penal'
  | 'mercantil'
  | 'laboral'
  | 'administrativo'
  | 'tributario'
  | 'procesal'
  | 'internacional_privado'
  | 'union_europea'
  | 'derechos_humanos';

export type OrganismoEmisor =
  | 'cortes_generales'
  | 'gobierno'
  | 'ministerio_justicia'
  | 'ministerio_hacienda'
  | 'tribunal_constitucional'
  | 'tribunal_supremo'
  | 'audiencia_nacional'
  | 'tribunal_superior_justicia'
  | 'audiencia_provincial'
  | 'juzgado'
  | 'ue';

export type Vigencia = 'vigente' | 'modificado' | 'derogado' | 'pendiente';

// ============================================
// INTERFACES BASE
// ============================================

export interface LegislacionBase {
  id: string;
  tipo: TipoDocumento;
  titulo: string;
  resumen?: string;
  materia: Materia;
  fechaPublicacion: Date;
  fechaEntradaVigor?: Date;
  fechaDerogacion?: Date;
  vigencia: Vigencia;
  organismoEmisor: OrganismoEmisor;
  urlPdf?: string;
  urlHtml?: string;
  diarioOficial?: string;
  numeroDiario?: string;
  paginaInicio?: number;
  paginaFin?: number;
  seccion?: string;
  departamento?: string;
  palabrasClave: string[];
  numeroLegislacion?: string; // Número de ley/Real Decreto/etc
}

// ============================================
// BOE - BOLETÍN OFICIAL DEL ESTADO
// ============================================

/**
 * Estructura real de respuesta del API del BOE
 * Documentación: https://boe.es/datosabiertos/api/calendario/
 */
export interface BoesearchParams {
  query?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  seccion?: 'I' | 'II' | 'III' | 'IV' | 'V'; // I=Disposiciones, II=Autoridades, III=Otros, IV=Anuncios, V=Contratos
  apartado?: string;
  numeroBoletin?: string;
  departamento?: string;
  materia?: Materia;
  organismo?: string;
  pagina?: number;
  limit?: number;
}

export interface BoeDocumento extends LegislacionBase {
  tipo: 'disposicion' | 'anuncio' | 'contrato' | 'autoridad';
  seccion?: 'I' | 'II' | 'III' | 'IV' | 'V';
  apartado?: string;
  numeroBoletin?: string;
  fechaBoletin?: Date;
  textoCompleto?: string;
  textoXml?: string; // XML original del BOE
  notas?: BoeNota[];
  anexos?: BoeAnexo[];
  imagenes?: BoeImagen[];
}

export interface BoeNota {
  id: string;
  tipo: 'legislacion_anterior' | 'doctrina' | 'jurisprudencia' | 'otra';
  contenido: string;
  url?: string;
}

export interface BoeAnexo {
  id: string;
  nombre: string;
  tipo: 'pdf' | 'doc' | 'xls' | 'img';
  url: string;
  tamano?: number;
}

export interface BoeImagen {
  id: string;
  url: string;
  pagina: number;
  descripcion?: string;
}

export interface BoeSearchResponse {
  total: number;
  pagina: number;
  totalPaginas: number;
  resultados: BoeDocumentoResumen[];
}

export interface BoeDocumentoResumen {
  id: string;
  titulo: string;
  url: string;
  fecha: Date;
  seccion: string;
  apartado: string;
  departamento: string;
  materia?: string;
}

export interface BoeDocumentoCompleto {
  metadata: BoeMetadatos;
  texto: BoeTexto;
  relaciones: BoeRelaciones;
}

export interface BoeMetadatos {
  identificador: string;
  titulo: string;
  departamento: string;
  seccion: string;
  apartado: string;
  numeroBoletin: string;
  fechaBoletin: string;
  numeroPagina: number;
  materias: string[];
  pdf?: {
    url: string;
    nombre: string;
    tamano: number;
  };
}

export interface BoeTexto {
  parrafos: BoeParrafo[];
  articulos: BoeArticulo[];
  disposiciones: BoeDisposicion[];
}

export interface BoeParrafo {
  id: string;
  tipo: 'titulo' | 'capitulo' | 'seccion' | 'articulo' | 'disposicion' | 'anexo' | 'nota';
  numero?: string;
  contenido: string;
  nivel: number; // Para jerarquía visual
}

export interface BoeArticulo {
  id: string;
  numero: string;
  titulo?: string;
  contenido: string;
  parrafos: BoeParrafo[];
}

export interface BoeDisposicion {
  tipo: 'transitoria' | 'derogatoria' | 'adicional' | 'final';
  numero: string;
  contenido: string;
}

export interface BoeRelaciones {
  deroga?: LegislacionRef[];
  derogadoPor?: LegislacionRef[];
  modifica?: LegislacionRef[];
  modificadoPor?: LegislacionRef[];
  anade?: LegislacionRef[];
  anadidoPor?: LegislacionRef[];
  concordancias?: LegislacionRef[];
}

export interface LegislacionRef {
  id: string;
  titulo: string;
  url: string;
  fecha: Date;
  tipo: TipoDocumento;
}

// ============================================
// CENDOJ - CENTRO DE DOCUMENTACIÓN JUDICIAL
// ============================================

/**
 * Estructura de respuesta del CENDOJ
 * Documentación: https://www.poderjudicial.es/cgpj/es/Tribunales/CENDOJ/
 */
export interface CendojSearchParams {
  query?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  tribunal?: string;
  tipoResolucion?: 'sentencia' | 'auto' | 'providencia' | 'decreto';
  ponente?: string;
  numeroProcedimiento?: string;
  procedimiento?: string;
  materia?: Materia;
  submateria?: string;
  pagina?: number;
  limit?: number;
}

export interface CendojDocumento extends LegislacionBase {
  tipo: 'sentencia' | 'auto' | 'providencia' | 'decreto';
  tribunal: TribunalInfo;
  ponente: string;
  numeroResolucion: string;
  numeroProcedimiento: string;
  procedimiento: string;
  sala?: string;
  seccion?: string;
  tipoProcedimiento?: string;
  
  // Contenido estructurado
  antecedentes?: string;
  hechosProbados?: string;
  fundamentosDeDerecho?: string;
  fallo?: string;
  costas?: string;
  
  // Metadatos de jurisprudencia
  jurisprudenciaCita?: string; // Ej: "STS 1234/2023"
  doctrinaAplicable?: string[];
  leyesAplicables?: string[];
  precedentes?: JurisprudenciaRef[];
  citadoPor?: JurisprudenciaRef[];
  
  // Recursos
  recurso?: RecursoInfo;
  resolucionRecurrida?: LegislacionRef;
  
  // Ejecutividad
  firmeza?: 'firme' | 'recurrida' | 'ejecutoriada';
  fechaFirmeza?: Date;
}

export interface TribunalInfo {
  id: string;
  nombre: string;
  tipo: 'supremo' | 'nacional' | 'superior' | 'provincial' | 'juzgado' | 'constitucional' | 'ue';
  codigo?: string;
  provincia?: string;
  comunidadAutonoma?: string;
}

export interface JurisprudenciaRef {
  id: string;
  cita: string;
  tribunal: string;
  fecha: Date;
  resumen: string;
  url: string;
}

export interface RecursoInfo {
  tipo: 'casacion' | 'apelacion' | 'suplicacion' | 'revision' | 'queja' | 'extrordinario';
  numero?: string;
  estado: 'pendiente' | 'admitido' | 'inadmitido' | 'desestimado' | 'estimado';
  fechaInterposicion?: Date;
  fechaResolucion?: Date;
}

export interface CendojSearchResponse {
  total: number;
  pagina: number;
  totalPaginas: number;
  resultados: CendojDocumentoResumen[];
}

export interface CendojDocumentoResumen {
  id: string;
  cita: string;
  fecha: Date;
  tribunal: string;
  tipo: string;
  materia: string;
  resumen: string;
  url: string;
}

// ============================================
// CONSTITUCIÓN Y CÓDIGOS
// ============================================

export interface CodigoLegislacion extends LegislacionBase {
  tipo: 'codigo';
  numeroLibros?: number;
  numeroTitulos?: number;
  numeroCapitulos?: number;
  numeroArticulos?: number;
  
  // Estructura
  libros: LibroCodigo[];
  
  // Estado
  numeroReformas?: number;
  fechaUltimaReforma?: Date;
  modificacionesPendientes?: ModificacionPendiente[];
}

export interface LibroCodigo {
  numero: number;
  titulo: string;
  titulos: TituloCodigo[];
}

export interface TituloCodigo {
  numero: string;
  titulo: string;
  capitulos?: CapituloCodigo[];
  articulos: Articulo[];
}

export interface CapituloCodigo {
  numero: string;
  titulo: string;
  articulos: Articulo[];
}

export interface Articulo {
  id: string;
  numero: string;
  titulo?: string;
  contenido: string;
  vigencia: Vigencia;
  derogadoPor?: string;
  modificadoPor?: string;
  notas?: string[];
}

export interface ModificacionPendiente {
  id: string;
  titulo: string;
  descripcion: string;
  fechaPrevista: Date;
  estado: 'propuesta' | 'tramite_parlamentario' | 'aprobada' | 'pendiente_publicacion';
}

// ============================================
// BÚSQUEDA Y FILTROS
// ============================================

export interface BusquedaAvanzadaParams {
  query?: string;
  tipo?: TipoDocumento[];
  materia?: Materia[];
  organismo?: OrganismoEmisor[];
  vigencia?: Vigencia[];
  fechaDesde?: Date;
  fechaHasta?: Date;
  tienePdf?: boolean;
  enVigor?: boolean;
  sortBy?: 'relevancia' | 'fecha_desc' | 'fecha_asc' | 'titulo';
  pagina?: number;
  limit?: number;
}

export interface BusquedaResponse {
  total: number;
  pagina: number;
  totalPaginas: number;
  tiempoBusqueda: number; // ms
  resultados: LegislacionBase[];
  facets?: {
    tipos: { valor: string; count: number }[];
    materias: { valor: string; count: number }[];
    organismo: { valor: string; count: number }[];
    vigencia: { valor: string; count: number }[];
    anios: { valor: string; count: number }[];
  };
}

// ============================================
// FAVORITOS Y NOTAS DEL BUFETE
// ============================================

export interface LegislacionFavorito {
  id: string;
  legislacionId: string;
  legislacion: LegislacionBase;
  usuarioId: string;
  fechaGuardado: Date;
  carpeta?: string;
  notas?: string;
  etiquetas?: string[];
}

export interface LegislacionNotaBufete {
  id: string;
  legislacionId: string;
  contenido: string;
  autor: string;
  fecha: Date;
  expedientesRelacionados?: string[];
  visibilidad: 'privada' | 'equipo' | 'bufete';
}

// ============================================
// CONFIGURACIÓN Y ESTADO
// ============================================

export interface ConfiguracionLegislacion {
  apiBoe: {
    endpoint: string;
    apiKey?: string;
    rateLimit: number; // requests per minute
    ultimaSincronizacion?: Date;
  };
  apiCendoj: {
    endpoint: string;
    apiKey?: string;
    rateLimit: number;
    ultimaSincronizacion?: Date;
  };
  notificaciones: {
    nuevasDisposiciones: boolean;
    modificacionesVigentes: boolean;
    jurisprudenciaRelevante: boolean;
    materiasSeguidas: Materia[];
  };
}

export interface EstadoSincronizacion {
  boe: {
    estado: 'idle' | 'syncing' | 'error' | 'success';
    ultimaActualizacion?: Date;
    documentosNuevos: number;
    errores?: string[];
  };
  cendoj: {
    estado: 'idle' | 'syncing' | 'error' | 'success';
    ultimaActualizacion?: Date;
    documentosNuevos: number;
    errores?: string[];
  };
}

// ============================================
// HELPERS Y UTILIDADES
// ============================================

export interface LegislacionStats {
  totalDocumentos: number;
  porTipo: Record<TipoDocumento, number>;
  porMateria: Record<Materia, number>;
  porAnio: Record<string, number>;
  nuevosEstaSemana: number;
  nuevosEsteMes: number;
  documentosSinPdf: number;
  documentosSinResumen: number;
}

// Helper para formatear citas
export function formatearCita(doc: LegislacionBase): string {
  switch (doc.tipo) {
    case 'sentencia':
      return `STS ${doc.fechaPublicacion.getFullYear()}/${doc.numeroLegislacion || 'XXXX'}`;
    case 'ley':
      return `Ley ${doc.numeroLegislacion}/${doc.fechaPublicacion.getFullYear()}`;
    case 'real_decreto':
      return `RD ${doc.numeroLegislacion}/${doc.fechaPublicacion.getFullYear()}`;
    case 'real_decreto_ley':
      return `RDL ${doc.numeroLegislacion}/${doc.fechaPublicacion.getFullYear()}`;
    default:
      return `${doc.tipo.toUpperCase()} ${doc.numeroLegislacion || ''}`;
  }
}

// Helper para obtener URL de consulta pública
export function getUrlConsultaPublica(doc: LegislacionBase): string {
  if (doc.urlHtml) return doc.urlHtml;
  if (doc.diarioOficial?.includes('BOE')) {
    return `https://boe.es/buscar/doc.php?id=${doc.id}`;
  }
  if (doc.tipo === 'sentencia' || doc.tipo === 'auto') {
    return `https://www.poderjudicial.es/search/indexAN.jsp`;
  }
  return '#';
}
