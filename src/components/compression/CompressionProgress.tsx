import React from 'react';
import { formatFileSize } from '../../utils/compression/fileHelpers';

interface CompressionProgressProps {
  progress: number;
  currentFile?: string;
  totalSize?: number;
  isVisible: boolean;
  onCancel?: () => void;
  estimatedTimeRemaining?: number | null;
}

export const CompressionProgress: React.FC<CompressionProgressProps> = ({
  progress,
  currentFile,
  totalSize,
  isVisible,
  onCancel,
  estimatedTimeRemaining
}) => {
  if (!isVisible) return null;

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Comprimiendo archivos...
          </h3>
          <span className="text-2xl">📦</span>
        </div>

        {/* Barra de progreso */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{progress}%</span>
            {totalSize && totalSize > 0 && (
              <span>{formatFileSize(totalSize)}</span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Archivo actual */}
        {currentFile && (
          <div className="mb-3">
            <p className="text-sm text-gray-500">Procesando:</p>
            <p className="text-sm text-gray-700 truncate" title={currentFile}>
              {currentFile}
            </p>
          </div>
        )}

        {/* Tiempo estimado */}
        {estimatedTimeRemaining && estimatedTimeRemaining > 0 && (
          <p className="text-xs text-gray-500 mb-4">
            Tiempo restante estimado: {formatTime(estimatedTimeRemaining)}
          </p>
        )}

        {/* Botón cancelar */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 
                       hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 
                       focus:ring-gray-500 focus:ring-offset-2"
            type="button"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

export default CompressionProgress;
