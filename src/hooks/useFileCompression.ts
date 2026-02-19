import { useState, useCallback, useRef } from 'react';
import type { 
  CompressOptions, 
  CompressionResult, 
  CompressionProgress
} from '../types/compression';
import { compressionService } from '../services/compressionService';
import { calculateTotalSize, formatFileSize } from '../utils/compression/fileHelpers';

export interface UseFileCompressionReturn {
  // Estado
  isCompressing: boolean;
  progress: number;
  currentFile: string;
  estimatedTimeRemaining: number | null;
  result: CompressionResult | null;
  error: string | null;
  
  // Acciones
  compressFiles: (files: File[], options?: Partial<CompressOptions>) => Promise<CompressionResult>;
  compressExpediente: (expedienteId: string, fileUrls: string[], filename?: string) => Promise<CompressionResult>;
  cancelCompression: () => void;
  reset: () => void;
  
  // Información
  totalSize: number;
  formattedTotalSize: string;
}

export function useFileCompression(): UseFileCompressionReturn {
  // Estados
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalSize, setTotalSize] = useState(0);
  
  // Ref para control de cancelación
  const currentJobId = useRef<string | null>(null);
  const abortController = useRef<AbortController | null>(null);

  /**
   * Maneja el progreso de la compresión
   */
  const handleProgress = useCallback((progressData: CompressionProgress) => {
    setProgress(progressData.progress);
    
    if (progressData.currentFile) {
      setCurrentFile(progressData.currentFile);
    }
    
    if (progressData.estimatedTimeRemaining) {
      setEstimatedTimeRemaining(progressData.estimatedTimeRemaining);
    }
  }, []);

  /**
   * Comprime un conjunto de archivos
   */
  const compressFiles = useCallback(async (
    files: File[],
    options: Partial<CompressOptions> = {}
  ): Promise<CompressionResult> => {
    if (files.length === 0) {
      const errorResult: CompressionResult = {
        success: false,
        error: 'No se seleccionaron archivos para comprimir'
      };
      setResult(errorResult);
      return errorResult;
    }

    setIsCompressing(true);
    setProgress(0);
    setCurrentFile('Iniciando...');
    setEstimatedTimeRemaining(null);
    setError(null);
    setResult(null);
    setTotalSize(calculateTotalSize(files));

    abortController.current = new AbortController();

    try {
      const defaultFilename = `archivos_${new Date().toISOString().split('T')[0]}`;
      
      const compressOptions: CompressOptions = {
        files,
        format: options.format || 'zip',
        filename: options.filename || defaultFilename,
        password: options.password,
        sendEmail: options.sendEmail,
        recipientEmail: options.recipientEmail
      };

      const compressionResult = await compressionService.compressFiles(
        compressOptions,
        handleProgress
      );

      setResult(compressionResult);
      
      if (!compressionResult.success) {
        setError(compressionResult.error || 'Error desconocido');
      }

      return compressionResult;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en la compresión';
      setError(errorMessage);
      
      const errorResult: CompressionResult = {
        success: false,
        error: errorMessage
      };
      
      setResult(errorResult);
      return errorResult;

    } finally {
      setIsCompressing(false);
      setCurrentFile('');
    }
  }, [handleProgress]);

  /**
   * Comprime todos los archivos de un expediente
   */
  const compressExpediente = useCallback(async (
    expedienteId: string,
    fileUrls: string[],
    filename?: string
  ): Promise<CompressionResult> => {
    if (fileUrls.length === 0) {
      const errorResult: CompressionResult = {
        success: false,
        error: 'El expediente no tiene archivos para comprimir'
      };
      setResult(errorResult);
      return errorResult;
    }

    setIsCompressing(true);
    setProgress(0);
    setCurrentFile('Preparando archivos del expediente...');
    setError(null);
    setResult(null);

    try {
      const compressOptions: CompressOptions = {
        files: fileUrls,
        format: 'zip',
        filename: filename || `Expediente_${expedienteId}_${new Date().toISOString().split('T')[0]}`
      };

      const compressionResult = await compressionService.compressFiles(
        compressOptions,
        handleProgress
      );

      setResult(compressionResult);
      
      if (!compressionResult.success) {
        setError(compressionResult.error || 'Error desconocido');
      }

      return compressionResult;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en la compresión';
      setError(errorMessage);
      
      const errorResult: CompressionResult = {
        success: false,
        error: errorMessage
      };
      
      setResult(errorResult);
      return errorResult;

    } finally {
      setIsCompressing(false);
    }
  }, [handleProgress]);

  /**
   * Cancela la compresión en curso
   */
  const cancelCompression = useCallback(() => {
    if (currentJobId.current) {
      compressionService.cancelCompression(currentJobId.current);
    }
    
    if (abortController.current) {
      abortController.current.abort();
    }
    
    setIsCompressing(false);
    setError('Compresión cancelada por el usuario');
  }, []);

  /**
   * Resetea el estado del hook
   */
  const reset = useCallback(() => {
    setIsCompressing(false);
    setProgress(0);
    setCurrentFile('');
    setEstimatedTimeRemaining(null);
    setResult(null);
    setError(null);
    setTotalSize(0);
    currentJobId.current = null;
    abortController.current = null;
  }, []);

  return {
    // Estado
    isCompressing,
    progress,
    currentFile,
    estimatedTimeRemaining,
    result,
    error,
    
    // Acciones
    compressFiles,
    compressExpediente,
    cancelCompression,
    reset,
    
    // Información
    totalSize,
    formattedTotalSize: formatFileSize(totalSize)
  };
}

export default useFileCompression;
