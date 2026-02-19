import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { CompressionProgress } from '../../types/compression';
import { formatFileSize, sanitizeFileName } from './fileHelpers';

/**
 * Generador de archivos ZIP en el frontend
 * Para compresiones pequeñas (< 50MB) se procesa en el cliente
 */

export interface ZipGenerationOptions {
  files: File[];
  filename: string;
  password?: string;
  onProgress?: (progress: CompressionProgress) => void;
}

/**
 * Genera un archivo ZIP en el navegador
 * @returns Promise con el blob del ZIP generado
 */
export async function generateZipInBrowser(
  options: ZipGenerationOptions
): Promise<Blob> {
  const { files, onProgress } = options;
  // filename está disponible en options pero no se usa directamente aquí
  const zip = new JSZip();
  
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  let processedBytes = 0;

  // Agregar cada archivo al ZIP
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const sanitizedName = sanitizeFileName(file.name);
    
    // Leer el archivo como ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Agregar al ZIP
    zip.file(sanitizedName, arrayBuffer);
    
    // Actualizar progreso
    processedBytes += file.size;
    
    if (onProgress) {
      onProgress({
        jobId: 'browser-zip',
        progress: Math.round((processedBytes / totalBytes) * 100),
        processedBytes,
        totalBytes,
        currentFile: file.name,
        estimatedTimeRemaining: undefined
      });
    }
  }

  // Generar el ZIP
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6 // Nivel medio de compresión
    }
  }, (metadata) => {
    if (onProgress) {
      onProgress({
        jobId: 'browser-zip',
        progress: Math.round(metadata.percent),
        processedBytes,
        totalBytes,
        currentFile: 'Finalizando...',
        estimatedTimeRemaining: undefined
      });
    }
  });

  return zipBlob;
}

/**
 * Descarga un archivo ZIP generado
 */
export async function downloadZip(
  blob: Blob, 
  filename: string
): Promise<void> {
  const sanitizedFilename = sanitizeFileName(filename);
  const finalFilename = sanitizedFilename.endsWith('.zip') 
    ? sanitizedFilename 
    : `${sanitizedFilename}.zip`;
  
  saveAs(blob, finalFilename);
}

/**
 * Comprime y descarga archivos en una sola operación
 */
export async function compressAndDownload(
  options: ZipGenerationOptions
): Promise<void> {
  const blob = await generateZipInBrowser(options);
  await downloadZip(blob, options.filename);
}

/**
 * Verifica si la compresión puede hacerse en el navegador
 * (archivos pequeños, sin contraseña)
 */
export function canCompressInBrowser(
  files: File[], 
  password?: string
): { canCompress: boolean; reason?: string } {
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const BROWSER_LIMIT = 100 * 1024 * 1024; // 100MB
  
  if (totalSize > BROWSER_LIMIT) {
    return {
      canCompress: false,
      reason: `El tamaño total (${formatFileSize(totalSize)}) excede el límite de ${formatFileSize(BROWSER_LIMIT)} para procesamiento en navegador`
    };
  }
  
  // JSZip no soporta contraseña nativamente
  if (password) {
    return {
      canCompress: false,
      reason: 'La compresión con contraseña requiere procesamiento en servidor'
    };
  }
  
  return { canCompress: true };
}
