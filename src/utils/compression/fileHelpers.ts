import type { FileInfo } from '../../types/compression';

/**
 * Utilidades para manejo de archivos en compresión
 */

/**
 * Formatea el tamaño de archivo a unidades legibles
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
}

/**
 * Obtiene la extensión de un archivo
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

/**
 * Obtiene el nombre de archivo sin extensión
 */
export function getFileNameWithoutExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
}

/**
 * Genera un nombre único para el archivo comprimido
 */
export function generateCompressedFileName(
  baseName: string, 
  format: 'zip' | '7z' = 'zip'
): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitized = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${sanitized}_${timestamp}.${format}`;
}

/**
 * Calcula el tamaño total de una lista de archivos
 */
export function calculateTotalSize(files: File[] | FileInfo[]): number {
  return files.reduce((total, file) => total + (file.size || 0), 0);
}

/**
 * Verifica si el tamaño total excede el límite
 */
export function checkSizeLimit(
  files: File[] | FileInfo[], 
  maxSizeBytes: number
): { valid: boolean; excess: number } {
  const totalSize = calculateTotalSize(files);
  return {
    valid: totalSize <= maxSizeBytes,
    excess: Math.max(0, totalSize - maxSizeBytes)
  };
}

/**
 * Filtra archivos por extensiones permitidas
 */
export function filterFilesByExtension(
  files: File[], 
  allowedExtensions: string[]
): { valid: File[]; invalid: File[] } {
  const valid: File[] = [];
  const invalid: File[] = [];
  
  files.forEach(file => {
    const ext = getFileExtension(file.name);
    if (allowedExtensions.includes(ext)) {
      valid.push(file);
    } else {
      invalid.push(file);
    }
  });
  
  return { valid, invalid };
}

/**
 * Convierte archivos de File[] a FileInfo[]
 */
export function mapFilesToInfo(files: File[]): FileInfo[] {
  return files.map(file => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  }));
}

/**
 * Sanitiza un nombre de archivo para uso seguro
 */
export function sanitizeFileName(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 255);
}

/**
 * Verifica si un archivo es comprimido
 */
export function isCompressedFile(filename: string): boolean {
  const compressedExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
  return compressedExtensions.includes(getFileExtension(filename));
}

/**
 * Configuración por defecto de límites
 */
export const DEFAULT_COMPRESSION_LIMITS = {
  maxFileSize: 100 * 1024 * 1024, // 100 MB por archivo
  maxTotalSize: 500 * 1024 * 1024, // 500 MB total
  maxFiles: 100,
  allowedFormats: ['zip', '7z'] as const
};
