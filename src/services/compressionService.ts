import type { 
  CompressOptions, 
  CompressionJob, 
  CompressionResult,
  CompressionProgress 
} from '../types/compression';
import { canCompressInBrowser, compressAndDownload, generateZipInBrowser } from '../utils/compression/zipGenerator';

/**
 * Servicio de compresión de archivos
 * Maneja tanto compresión en navegador como en servidor
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class CompressionService {
  private abortControllers: Map<string, AbortController> = new Map();

  /**
   * Comprime archivos (decide si en navegador o servidor)
   */
  async compressFiles(
    options: CompressOptions,
    onProgress?: (progress: CompressionProgress) => void
  ): Promise<CompressionResult> {
    const { files, password, filename } = options;

    // Si files es array de strings (URLs), siempre ir al servidor
    if (typeof files[0] === 'string') {
      return this.compressOnServer(options, onProgress);
    }

    // Convertir a File[]
    const fileArray = files as File[];

    // Verificar si podemos comprimir en navegador
    const browserCheck = canCompressInBrowser(fileArray, password);
    
    if (browserCheck.canCompress) {
      try {
        await compressAndDownload({
          files: fileArray,
          filename,
          onProgress
        });
        
        return {
          success: true,
          filename: filename.endsWith('.zip') ? filename : `${filename}.zip`
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Error al comprimir archivos'
        };
      }
    }

    // Si no se puede en navegador, ir al servidor
    return this.compressOnServer(options, onProgress);
  }

  /**
   * Comprime archivos en el servidor
   */
  private async compressOnServer(
    options: CompressOptions,
    onProgress?: (progress: CompressionProgress) => void
  ): Promise<CompressionResult> {
    const { files, format, password, filename, sendEmail, recipientEmail } = options;

    const formData = new FormData();
    
    // Agregar archivos
    files.forEach((file, index) => {
      if (typeof file === 'string') {
        formData.append(`urls[${index}]`, file);
      } else {
        formData.append(`files[${index}]`, file);
      }
    });

    formData.append('format', format);
    formData.append('filename', filename);
    
    if (password) {
      formData.append('password', password);
    }
    
    if (sendEmail && recipientEmail) {
      formData.append('sendEmail', 'true');
      formData.append('recipientEmail', recipientEmail);
    }

    const abortController = new AbortController();
    
    try {
      const response = await fetch(`${API_BASE_URL}/compress`, {
        method: 'POST',
        body: formData,
        signal: abortController.signal
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en la compresión');
      }

      const result: CompressionJob = await response.json();
      
      this.abortControllers.set(result.id, abortController);

      // Si se completó inmediatamente, retornar
      if (result.status === 'completed' && result.resultUrl) {
        return {
          success: true,
          jobId: result.id,
          downloadUrl: result.resultUrl,
          filename: result.filename
        };
      }

      // Si está procesándose, esperar a que termine
      if (result.status === 'processing') {
        return this.waitForCompletion(result.id, onProgress);
      }

      return {
        success: false,
        error: 'Estado de compresión desconocido'
      };

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Compresión cancelada por el usuario'
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Espera a que una compresión se complete
   */
  private async waitForCompletion(
    jobId: string,
    onProgress?: (progress: CompressionProgress) => void
  ): Promise<CompressionResult> {
    const maxAttempts = 60; // 60 intentos = 2 minutos (con 2s de delay)
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const status = await this.getJobStatus(jobId);
        
        if (status.status === 'completed') {
          return {
            success: true,
            jobId,
            downloadUrl: status.resultUrl,
            filename: status.filename,
            size: status.files?.length
          };
        }

        if (status.status === 'error') {
          return {
            success: false,
            jobId,
            error: status.error || 'Error en la compresión'
          };
        }

        if (status.status === 'cancelled') {
          return {
            success: false,
            jobId,
            error: 'Compresión cancelada'
          };
        }

        // Reportar progreso
        if (onProgress) {
          onProgress({
            jobId,
            progress: status.progress,
            processedBytes: 0,
            totalBytes: 0
          });
        }

        // Esperar 2 segundos antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;

      } catch (error) {
        return {
          success: false,
          jobId,
          error: 'Error al verificar estado de la compresión'
        };
      }
    }

    return {
      success: false,
      jobId,
      error: 'Tiempo de espera agotado'
    };
  }

  /**
   * Obtiene el estado de un job de compresión
   */
  async getJobStatus(jobId: string): Promise<CompressionJob> {
    const response = await fetch(`${API_BASE_URL}/compress/${jobId}`);
    
    if (!response.ok) {
      throw new Error('No se pudo obtener el estado de la compresión');
    }

    return response.json();
  }

  /**
   * Cancela una compresión en curso
   */
  cancelCompression(jobId: string): void {
    const controller = this.abortControllers.get(jobId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(jobId);
    }
  }

  /**
   * Descarga un archivo comprimido
   */
  async downloadCompressedFile(downloadUrl: string, filename: string): Promise<void> {
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      throw new Error('Error al descargar el archivo');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    window.URL.revokeObjectURL(url);
  }

  /**
   * Genera un ZIP en el navegador y retorna el Blob
   * Útil para previsualizar antes de descargar
   */
  async generateZipBlob(
    files: File[],
    onProgress?: (progress: CompressionProgress) => void
  ): Promise<Blob> {
    return generateZipInBrowser({
      files,
      filename: 'temp.zip',
      onProgress
    });
  }
}

export const compressionService = new CompressionService();
export default compressionService;
