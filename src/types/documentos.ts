// ============================================
// TIPOS PARA GESTOR DOCUMENTAL POR EXPEDIENTE
// ============================================

export type TipoDocumento = 
  | 'pdf' 
  | 'doc' 
  | 'docx' 
  | 'xls' 
  | 'xlsx' 
  | 'jpg' 
  | 'jpeg' 
  | 'png' 
  | 'gif'
  | 'mp3'
  | 'mp4'
  | 'zip'
  | 'rar'
  | 'txt'
  | 'otro';

export type CategoriaDocumento =
  | 'demanda'
  | 'escritura'
  | 'evidencia'
  | 'prueba'
  | 'correspondencia'
  | 'factura'
  | 'contrato'
  | 'sentencia'
  | 'auto'
  | 'escrito'
  | 'informe'
  | 'acta'
  | 'nota'
  | 'otro';

export type EstadoDocumento =
  | 'borrador'
  | 'revision'
  | 'aprobado'
  | 'ejecutado'
  | 'firmado'
  | 'archivado'
  | 'eliminado';

export type TipoCarpeta =
  | 'demandas'
  | 'escritos'
  | 'pruebas'
  | 'correspondencia'
  | 'facturas'
  | 'sentencias'
  | 'contratos'
  | 'informes'
  | 'otros'
  | 'personalizada';

// ============================================
// INTERFACES
// ============================================

export interface VersionDocumento {
  id: string;
  numeroVersion: number;
  nombreArchivo: string;
  tamaño: number; // bytes
  fechaSubida: string;
  subidoPor: string;
  idUsuario: string;
  comentario?: string;
  hash?: string; // Para integridad
}

export interface DocumentoExpediente {
  id: string;
  idExpediente: string;
  nombre: string;
  nombreOriginal: string;
  descripcion?: string;
  tipo: TipoDocumento;
  categoria: CategoriaDocumento;
  estado: EstadoDocumento;
  
  // Ubicación
  idCarpeta: string | null; // null = raíz
  ruta: string; // Path completo
  
  // Versionado
  versionActual: number;
  versiones: VersionDocumento[];
  
  // Metadatos
  tamaño: number; // bytes
  fechaCreacion: string;
  fechaModificacion: string;
  creadoPor: string;
  idCreador: string;
  modificadoPor: string;
  idModificador: string;
  
  // Firmas y visados
  firmado: boolean;
  fechaFirma?: string;
  firmadoPor?: string;
  idFirmante?: string;
  tipoFirma?: 'electronica' | 'digital' | 'manual' | null;
  
  // Visibilidad
  esConfidencial: boolean;
  visibleParaCliente: boolean;
  
  // Etiquetas
  etiquetas: string[];
  
  // Relaciones
  documentoRelacionadoId?: string; // Documento padre (ej: respuesta a escrito)
  
  // URLs (para mock)
  url?: string;
  thumbnailUrl?: string;
}

export interface CarpetaDocumento {
  id: string;
  idExpediente: string;
  nombre: string;
  descripcion?: string;
  tipo: TipoCarpeta;
  idCarpetaPadre: string | null;
  ruta: string;
  color?: string;
  icono?: string;
  orden: number;
  fechaCreacion: string;
  creadoPor: string;
  documentosCount: number;
  subcarpetasCount: number;
}

export interface FiltrosDocumento {
  categoria?: CategoriaDocumento | null;
  estado?: EstadoDocumento | null;
  tipo?: TipoDocumento | null;
  fechaDesde?: string | null;
  fechaHasta?: string | null;
  etiquetas?: string[];
  busqueda?: string;
  soloFirmados?: boolean;
  soloPendientes?: boolean;
  incluirEliminados?: boolean;
}

export interface OrdenamientoDocumento {
  campo: 'nombre' | 'fecha' | 'tamaño' | 'estado' | 'categoria' | 'autor';
  direccion: 'asc' | 'desc';
}

export interface PermisosDocumento {
  puedeVer: boolean;
  puedeEditar: boolean;
  puedeEliminar: boolean;
  puedeDescargar: boolean;
  puedeCompartir: boolean;
  puedeFirmar: boolean;
  puedeCambiarEstado: boolean;
  puedeVerVersiones: boolean;
  puedeSubirVersion: boolean;
}

export interface EstadisticasDocumentos {
  totalDocumentos: number;
  totalPorCategoria: Record<CategoriaDocumento, number>;
  totalPorEstado: Record<EstadoDocumento, number>;
  totalPorTipo: Record<TipoDocumento, number>;
  totalTamaño: number;
  pendientesFirma: number;
  ultimos30Dias: number;
}

// ============================================
// CONFIGURACIONES
// ============================================

export const CATEGORIAS_DOCUMENTO: { 
  id: CategoriaDocumento; 
  nombre: string; 
  icono: string;
  color: string;
}[] = [
  { id: 'demanda', nombre: 'Demanda/Denuncia', icono: 'Scale', color: 'text-red-400' },
  { id: 'escritura', nombre: 'Escritura Pública', icono: 'FileSignature', color: 'text-blue-400' },
  { id: 'evidencia', nombre: 'Evidencia/Prueba', icono: 'Camera', color: 'text-purple-400' },
  { id: 'prueba', nombre: 'Prueba Documental', icono: 'FileCheck', color: 'text-indigo-400' },
  { id: 'correspondencia', nombre: 'Correspondencia', icono: 'Mail', color: 'text-amber-400' },
  { id: 'factura', nombre: 'Factura/Gasto', icono: 'Receipt', color: 'text-emerald-400' },
  { id: 'contrato', nombre: 'Contrato', icono: 'FileText', color: 'text-cyan-400' },
  { id: 'sentencia', nombre: 'Sentencia/Resolución', icono: 'Gavel', color: 'text-rose-400' },
  { id: 'auto', nombre: 'Auto/Decreto', icono: 'ScrollText', color: 'text-orange-400' },
  { id: 'escrito', nombre: 'Escrito', icono: 'PenTool', color: 'text-teal-400' },
  { id: 'informe', nombre: 'Informe/Pericial', icono: 'ClipboardList', color: 'text-sky-400' },
  { id: 'acta', nombre: 'Acta/Actuación', icono: 'BookOpen', color: 'text-violet-400' },
  { id: 'nota', nombre: 'Nota/Apunte', icono: 'StickyNote', color: 'text-pink-400' },
  { id: 'otro', nombre: 'Otro', icono: 'File', color: 'text-slate-400' },
];

export const ESTADOS_DOCUMENTO: {
  id: EstadoDocumento;
  nombre: string;
  color: string;
  bgColor: string;
  icono: string;
}[] = [
  { id: 'borrador', nombre: 'Borrador', color: 'text-slate-400', bgColor: 'bg-slate-500/10', icono: 'FileEdit' },
  { id: 'revision', nombre: 'En Revisión', color: 'text-amber-400', bgColor: 'bg-amber-500/10', icono: 'Eye' },
  { id: 'aprobado', nombre: 'Aprobado', color: 'text-blue-400', bgColor: 'bg-blue-500/10', icono: 'CheckCircle' },
  { id: 'ejecutado', nombre: 'Ejecutado', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', icono: 'FileCheck' },
  { id: 'firmado', nombre: 'Firmado', color: 'text-purple-400', bgColor: 'bg-purple-500/10', icono: 'Signature' },
  { id: 'archivado', nombre: 'Archivado', color: 'text-slate-400', bgColor: 'bg-slate-500/10', icono: 'Archive' },
  { id: 'eliminado', nombre: 'Eliminado', color: 'text-red-400', bgColor: 'bg-red-500/10', icono: 'Trash2' },
];

export const TIPOS_ARCHIVO_PERMITIDOS: {
  tipo: TipoDocumento;
  extensiones: string[];
  mimeTypes: string[];
  icono: string;
  color: string;
}[] = [
  { tipo: 'pdf', extensiones: ['.pdf'], mimeTypes: ['application/pdf'], icono: 'FileText', color: 'text-red-400' },
  { tipo: 'doc', extensiones: ['.doc'], mimeTypes: ['application/msword'], icono: 'FileType', color: 'text-blue-400' },
  { tipo: 'docx', extensiones: ['.docx'], mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'], icono: 'FileType', color: 'text-blue-400' },
  { tipo: 'xls', extensiones: ['.xls'], mimeTypes: ['application/vnd.ms-excel'], icono: 'Table', color: 'text-emerald-400' },
  { tipo: 'xlsx', extensiones: ['.xlsx'], mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], icono: 'Table', color: 'text-emerald-400' },
  { tipo: 'jpg', extensiones: ['.jpg', '.jpeg'], mimeTypes: ['image/jpeg'], icono: 'Image', color: 'text-purple-400' },
  { tipo: 'png', extensiones: ['.png'], mimeTypes: ['image/png'], icono: 'Image', color: 'text-purple-400' },
  { tipo: 'gif', extensiones: ['.gif'], mimeTypes: ['image/gif'], icono: 'Image', color: 'text-purple-400' },
  { tipo: 'mp3', extensiones: ['.mp3'], mimeTypes: ['audio/mpeg'], icono: 'Headphones', color: 'text-pink-400' },
  { tipo: 'mp4', extensiones: ['.mp4'], mimeTypes: ['video/mp4'], icono: 'Video', color: 'text-pink-400' },
  { tipo: 'zip', extensiones: ['.zip'], mimeTypes: ['application/zip'], icono: 'Archive', color: 'text-amber-400' },
  { tipo: 'rar', extensiones: ['.rar'], mimeTypes: ['application/x-rar-compressed'], icono: 'Archive', color: 'text-amber-400' },
  { tipo: 'txt', extensiones: ['.txt'], mimeTypes: ['text/plain'], icono: 'FileText', color: 'text-slate-400' },
  { tipo: 'otro', extensiones: [], mimeTypes: [], icono: 'File', color: 'text-slate-400' },
];

export const CARPETAS_PREDEFINIDAS: {
  tipo: TipoCarpeta;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  orden: number;
}[] = [
  { tipo: 'demandas', nombre: 'Demandas y Escritos de Inicio', descripcion: 'Demandas iniciales, denuncias, demandas de reconvención', icono: 'Scale', color: '#ef4444', orden: 1 },
  { tipo: 'escritos', nombre: 'Escritos y Alegaciones', descripcion: 'Escritos de alegaciones, providencias, recursos', icono: 'PenTool', color: '#06b6d4', orden: 2 },
  { tipo: 'pruebas', nombre: 'Pruebas y Evidencias', descripcion: 'Documentos probatorios, informes periciales, testigos', icono: 'FileCheck', color: '#8b5cf6', orden: 3 },
  { tipo: 'correspondencia', nombre: 'Correspondencia', descripcion: 'Cartas, emails, notificaciones, burofax', icono: 'Mail', color: '#f59e0b', orden: 4 },
  { tipo: 'facturas', nombre: 'Facturas y Gastos', descripcion: 'Facturas, recibos, justificantes de gastos', icono: 'Receipt', color: '#10b981', orden: 5 },
  { tipo: 'sentencias', nombre: 'Sentencias y Resoluciones', descripcion: 'Sentencias firmes, autos definitivos, providencias', icono: 'Gavel', color: '#e11d48', orden: 6 },
  { tipo: 'contratos', nombre: 'Contratos y Escrituras', descripcion: 'Contratos, escrituras públicas, acuerdos', icono: 'FileSignature', color: '#0ea5e9', orden: 7 },
  { tipo: 'informes', nombre: 'Informes y Dictámenes', descripcion: 'Informes periciales, dictámenes, valoraciones', icono: 'ClipboardList', color: '#3b82f6', orden: 8 },
  { tipo: 'otros', nombre: 'Otros Documentos', descripcion: 'Documentos misceláneos', icono: 'File', color: '#64748b', orden: 99 },
];

// ============================================
// HELPERS
// ============================================

export function getExtensionFromNombre(nombre: string): string {
  const parts = nombre.split('.');
  return parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : '';
}

export function getTipoFromExtension(extension: string): TipoDocumento {
  const ext = extension.toLowerCase();
  const tipoEncontrado = TIPOS_ARCHIVO_PERMITIDOS.find(t => 
    t.extensiones.includes(ext)
  );
  return tipoEncontrado?.tipo || 'otro';
}

export function getTipoFromNombre(nombre: string): TipoDocumento {
  return getTipoFromExtension(getExtensionFromNombre(nombre));
}

export function getIconoDocumento(tipo: TipoDocumento): string {
  const tipoEncontrado = TIPOS_ARCHIVO_PERMITIDOS.find(t => t.tipo === tipo);
  return tipoEncontrado?.icono || 'File';
}

export function getColorDocumento(tipo: TipoDocumento): string {
  const tipoEncontrado = TIPOS_ARCHIVO_PERMITIDOS.find(t => t.tipo === tipo);
  return tipoEncontrado?.color || 'text-slate-400';
}

export function getCategoriaNombre(categoria: CategoriaDocumento): string {
  const cat = CATEGORIAS_DOCUMENTO.find(c => c.id === categoria);
  return cat?.nombre || 'Otro';
}

export function getCategoriaIcono(categoria: CategoriaDocumento): string {
  const cat = CATEGORIAS_DOCUMENTO.find(c => c.id === categoria);
  return cat?.icono || 'File';
}

export function getCategoriaColor(categoria: CategoriaDocumento): string {
  const cat = CATEGORIAS_DOCUMENTO.find(c => c.id === categoria);
  return cat?.color || 'text-slate-400';
}

export function getEstadoConfig(estado: EstadoDocumento) {
  return ESTADOS_DOCUMENTO.find(e => e.id === estado) || ESTADOS_DOCUMENTO[0];
}

export function formatTamaño(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function generateDocumentId(): string {
  return `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateFolderId(): string {
  return `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateVersionId(): string {
  return `ver-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
