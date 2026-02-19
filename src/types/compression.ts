/**
 * Tipos para la funcionalidad de compresión de archivos
 */

export type CompressionFormat = 'zip' | '7z';

export interface CompressOptions {
  files: File[] | string[];
  format: CompressionFormat;
  password?: string;
  filename: string;
  sendEmail?: boolean;
  recipientEmail?: string;
}

export interface CompressionJob {
  id: string;
  files: string[];
  format: CompressionFormat;
  password?: string;
  filename: string;
  status: CompressionStatus;
  progress: number;
  resultUrl?: string;
  error?: string;
  expiresAt: Date;
  createdAt: Date;
}

export type CompressionStatus = 'pending' | 'processing' | 'completed' | 'error' | 'cancelled';

export interface CompressionProgress {
  jobId: string;
  progress: number;
  processedBytes: number;
  totalBytes: number;
  currentFile?: string;
  estimatedTimeRemaining?: number;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified?: number;
  path?: string;
}

export interface CompressionResult {
  success: boolean;
  jobId?: string;
  downloadUrl?: string;
  filename?: string;
  size?: number;
  error?: string;
}

export interface CompressionLimits {
  maxFileSize: number;
  maxTotalSize: number;
  maxFiles: number;
  allowedFormats: CompressionFormat[];
}
