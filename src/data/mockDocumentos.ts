import type {
  DocumentoExpediente,
  CarpetaDocumento,
  VersionDocumento,
  CategoriaDocumento,
  TipoCarpeta,
} from '@/types/documentos';
import {
  generateDocumentId,
  generateFolderId,
  generateVersionId,
  getTipoFromNombre,
  CARPETAS_PREDEFINIDAS,
} from '@/types/documentos';
import type { Documento } from './expedientesDetailData';

/**
 * Convierte un documento del formato legacy al nuevo formato completo
 */
export function convertirDocumentoLegacy(
  doc: Documento,
  idExpediente: string
): DocumentoExpediente {
  const tipo = getTipoFromNombre(doc.nombre);
  const fechaISO = new Date().toISOString(); // En producción vendría del doc.fecha parseado
  
  // Parsear tamaño (ej: "2.5 MB" -> bytes)
  const tamañoParseado = parseTamaño(doc.tamaño);

  const version: VersionDocumento = {
    id: generateVersionId(),
    numeroVersion: 1,
    nombreArchivo: doc.nombre,
    tamaño: tamañoParseado,
    fechaSubida: fechaISO,
    subidoPor: doc.autor,
    idUsuario: 'user-legacy',
    comentario: 'Documento migrado',
  };

  return {
    id: doc.id,
    idExpediente,
    nombre: doc.nombre,
    nombreOriginal: doc.nombre,
    descripcion: undefined,
    tipo,
    categoria: doc.categoria as CategoriaDocumento,
    estado: doc.firmado ? 'firmado' : 'borrador',
    idCarpeta: null, // Por defecto en raíz, luego se organizan
    ruta: '/',
    versionActual: 1,
    versiones: [version],
    tamaño: tamañoParseado,
    fechaCreacion: fechaISO,
    fechaModificacion: fechaISO,
    creadoPor: doc.autor,
    idCreador: 'user-legacy',
    modificadoPor: doc.autor,
    idModificador: 'user-legacy',
    firmado: doc.firmado,
    fechaFirma: doc.firmado ? fechaISO : undefined,
    firmadoPor: doc.firmado ? doc.autor : undefined,
    idFirmante: doc.firmado ? 'user-legacy' : undefined,
    tipoFirma: doc.firmado ? 'electronica' : undefined,
    esConfidencial: false,
    visibleParaCliente: doc.categoria === 'demanda' || false,
    etiquetas: [doc.categoria],
    documentoRelacionadoId: undefined,
    url: '#',
  };
}

/**
 * Genera las carpetas por defecto para un expediente
 */
export function generarCarpetasPorDefecto(idExpediente: string): CarpetaDocumento[] {
  const carpetas: CarpetaDocumento[] = [];
  
  CARPETAS_PREDEFINIDAS.forEach((config) => {
    const carpeta: CarpetaDocumento = {
      id: generateFolderId(),
      idExpediente,
      nombre: config.nombre,
      descripcion: config.descripcion,
      tipo: config.tipo,
      idCarpetaPadre: null, // En raíz
      ruta: '/',
      color: config.color,
      icono: config.icono,
      orden: config.orden,
      fechaCreacion: new Date().toISOString(),
      creadoPor: 'Sistema',
      documentosCount: 0,
      subcarpetasCount: 0,
    };
    carpetas.push(carpeta);
  });
  
  return carpetas;
}

/**
 * Parsea un tamaño en formato legible a bytes
 */
function parseTamaño(tamaño: string): number {
  const match = tamaño.match(/^([\d.]+)\s*(B|KB|MB|GB)?$/i);
  if (!match) return 0;
  
  const valor = parseFloat(match[1]);
  const unidad = (match[2] || 'B').toUpperCase();
  
  const multiplicadores: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };
  
  return Math.round(valor * (multiplicadores[unidad] || 1));
}

/**
 * Mock de documentos adicionales para pruebas
 */
export const mockDocumentosExpediente: Partial<DocumentoExpediente>[] = [
  {
    nombre: 'Demanda inicial v2.pdf',
    categoria: 'demanda',
    estado: 'revision',
    descripcion: 'Segunda versión de la demanda con correcciones',
    etiquetas: ['urgente', 'revisar'],
    esConfidencial: true,
  },
  {
    nombre: 'Contrato de servicios.docx',
    categoria: 'contrato',
    estado: 'firmado',
    firmado: true,
    tipoFirma: 'electronica',
    visibleParaCliente: true,
  },
  {
    nombre: 'Informe pericial.pdf',
    categoria: 'informe',
    estado: 'aprobado',
    esConfidencial: false,
  },
  {
    nombre: 'Escrito de alegaciones.docx',
    categoria: 'escrito',
    estado: 'borrador',
    etiquetas: ['pendiente'],
  },
  {
    nombre: 'Factura proforma.pdf',
    categoria: 'factura',
    estado: 'ejecutado',
    visibleParaCliente: true,
  },
  {
    nombre: 'Correspondencia notificación.pdf',
    categoria: 'correspondencia',
    estado: 'archivado',
  },
  {
    nombre: 'Sentencia firme.pdf',
    categoria: 'sentencia',
    estado: 'firmado',
    firmado: true,
    visibleParaCliente: true,
  },
  {
    nombre: 'Auto de admisión.pdf',
    categoria: 'auto',
    estado: 'aprobado',
  },
];

/**
 * Genera un documento de ejemplo completo
 */
export function generarDocumentoEjemplo(
  idExpediente: string,
  overrides: Partial<DocumentoExpediente> = {}
): DocumentoExpediente {
  const id = generateDocumentId();
  const ahora = new Date().toISOString();
  const tipo = getTipoFromNombre(overrides.nombre || 'documento.pdf');
  
  const version: VersionDocumento = {
    id: generateVersionId(),
    numeroVersion: 1,
    nombreArchivo: overrides.nombre || 'documento.pdf',
    tamaño: overrides.tamaño || 1024 * 1024,
    fechaSubida: ahora,
    subidoPor: 'Usuario Demo',
    idUsuario: 'user-demo',
    comentario: 'Versión inicial',
  };

  return {
    id,
    idExpediente,
    nombre: overrides.nombre || 'documento.pdf',
    nombreOriginal: overrides.nombreOriginal || overrides.nombre || 'documento.pdf',
    descripcion: overrides.descripcion,
    tipo,
    categoria: overrides.categoria || 'otro',
    estado: overrides.estado || 'borrador',
    idCarpeta: overrides.idCarpeta || null,
    ruta: '/',
    versionActual: 1,
    versiones: [version],
    tamaño: overrides.tamaño || 1024 * 1024,
    fechaCreacion: ahora,
    fechaModificacion: ahora,
    creadoPor: 'Usuario Demo',
    idCreador: 'user-demo',
    modificadoPor: 'Usuario Demo',
    idModificador: 'user-demo',
    firmado: overrides.firmado || false,
    esConfidencial: overrides.esConfidencial || false,
    visibleParaCliente: overrides.visibleParaCliente || false,
    etiquetas: overrides.etiquetas || [],
    ...overrides,
  };
}

/**
 * Asigna documentos a carpetas según su categoría
 */
export function organizarDocumentosEnCarpetas(
  documentos: DocumentoExpediente[],
  carpetas: CarpetaDocumento[]
): DocumentoExpediente[] {
  const mapaCategoriasACarpetas: Record<CategoriaDocumento, TipoCarpeta[]> = {
    demanda: ['demandas'],
    escritura: ['contratos'],
    evidencia: ['pruebas'],
    prueba: ['pruebas'],
    correspondencia: ['correspondencia'],
    factura: ['facturas'],
    contrato: ['contratos'],
    sentencia: ['sentencias'],
    auto: ['sentencias'],
    escrito: ['escritos'],
    informe: ['informes'],
    acta: ['otros'],
    nota: ['otros'],
    otro: ['otros'],
  };

  return documentos.map((doc) => {
    const tiposCarpeta = mapaCategoriasACarpetas[doc.categoria];
    if (!tiposCarpeta) return doc;

    const carpetaDestino = carpetas.find((c) => tiposCarpeta.includes(c.tipo));
    if (!carpetaDestino) return doc;

    return {
      ...doc,
      idCarpeta: carpetaDestino.id,
      ruta: `/${carpetaDestino.nombre}`,
    };
  });
}

/**
 * Calcula estadísticas de documentos para mostrar
 */
export function calcularEstadisticas(documentos: DocumentoExpediente[]) {
  const activos = documentos.filter((d) => d.estado !== 'eliminado');
  
  return {
    total: activos.length,
    firmados: activos.filter((d) => d.firmado).length,
    pendientes: activos.filter((d) => d.estado === 'borrador' || d.estado === 'revision').length,
    tamanioTotal: activos.reduce((acc, d) => acc + d.tamaño, 0),
    porCategoria: activos.reduce((acc, d) => {
      acc[d.categoria] = (acc[d.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    porEstado: activos.reduce((acc, d) => {
      acc[d.estado] = (acc[d.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}
