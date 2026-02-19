import React, { useState, useCallback } from 'react';
import { useFileCompression } from '../../hooks/useFileCompression';
import { CompressModal, type CompressModalOptions } from './CompressModal';
import { CompressionProgress } from './CompressionProgress';
// Importación preservada para referencia de tipos
// type CompressionFormat = 'zip' | '7z';

interface CompressButtonProps {
  files: File[];
  fileUrls?: string[];
  defaultFilename?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onSuccess?: (downloadUrl?: string) => void;
  onError?: (error: string) => void;
  label?: string;
  showCount?: boolean;
  expedienteId?: string;
}

export const CompressButton: React.FC<CompressButtonProps> = ({
  files,
  fileUrls,
  defaultFilename,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onSuccess,
  onError,
  label,
  showCount = true,
  expedienteId
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    isCompressing,
    progress,
    currentFile,
    result,
    error,
    compressFiles,
    compressExpediente,
    cancelCompression,
    reset
  } = useFileCompression();

  const fileCount = files.length;
  const hasFiles = fileCount > 0;

  // Abrir modal
  const handleOpenModal = useCallback(() => {
    if (!hasFiles) return;
    setIsModalOpen(true);
  }, [hasFiles]);

  // Cerrar modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Confirmar compresión desde modal
  const handleConfirmCompression = useCallback(async (options: CompressModalOptions) => {
    setIsModalOpen(false);
    
    let compressionResult;
    
    if (expedienteId && fileUrls && fileUrls.length > 0) {
      // Comprimir expediente (archivos del servidor)
      compressionResult = await compressExpediente(expedienteId, fileUrls, options.filename);
    } else {
      // Comprimir archivos locales
      compressionResult = await compressFiles(files, {
        filename: options.filename,
        format: options.format,
        password: options.password
      });
    }

    if (compressionResult.success) {
      onSuccess?.(compressionResult.downloadUrl);
    } else {
      onError?.(compressionResult.error || 'Error desconocido');
    }
  }, [expedienteId, fileUrls, files, compressFiles, compressExpediente, onSuccess, onError]);

  // Cancelar compresión
  const handleCancel = useCallback(() => {
    cancelCompression();
  }, [cancelCompression]);

  // Resetear después de completar/cancelar
  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  // Estilos según variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 border-transparent';
      case 'secondary':
        return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
      case 'ghost':
        return 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent';
      case 'icon':
        return 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent p-2';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  // Estilos según tamaño
  const getSizeStyles = () => {
    if (variant === 'icon') return '';
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  // Texto del botón
  const getButtonLabel = () => {
    if (label) return label;
    if (variant === 'icon') return '📦';
    return showCount && hasFiles 
      ? `📦 Comprimir (${fileCount})` 
      : '📦 Comprimir';
  };

  const isDisabled = disabled || !hasFiles || isCompressing;

  return (
    <>
      <button
        onClick={handleOpenModal}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center gap-2 rounded-md border font-medium 
                    transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                    ${getVariantStyles()} ${getSizeStyles()}`}
        title={!hasFiles ? 'No hay archivos para comprimir' : 'Comprimir archivos'}
        type="button"
      >
        {variant === 'icon' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        ) : (
          getButtonLabel()
        )}
      </button>

      {/* Modal de opciones */}
      <CompressModal
        isOpen={isModalOpen}
        files={files}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCompression}
        defaultFilename={defaultFilename}
      />

      {/* Progreso de compresión */}
      <CompressionProgress
        isVisible={isCompressing}
        progress={progress}
        currentFile={currentFile}
        onCancel={handleCancel}
      />

      {/* Mensaje de éxito */}
      {result?.success && !isCompressing && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-medium text-green-900">¡Compresión exitosa!</p>
              <p className="text-sm text-green-700">
                {result.filename} listo para descargar
              </p>
            </div>
            <button 
              onClick={handleReset}
              className="ml-4 text-green-600 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && !isCompressing && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <p className="font-medium text-red-900">Error al comprimir</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button 
              onClick={handleReset}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CompressButton;
