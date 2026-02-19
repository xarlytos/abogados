import React, { useState, useCallback } from 'react';
import type { CompressionFormat } from '../../types/compression';
import { formatFileSize, calculateTotalSize } from '../../utils/compression/fileHelpers';

export interface CompressModalOptions {
  filename: string;
  format: CompressionFormat;
  password?: string;
  includePassword: boolean;
}

interface CompressModalProps {
  isOpen: boolean;
  files: File[];
  onClose: () => void;
  onConfirm: (options: CompressModalOptions) => void;
  defaultFilename?: string;
}

export const CompressModal: React.FC<CompressModalProps> = ({
  isOpen,
  files,
  onClose,
  onConfirm,
  defaultFilename
}) => {
  const [filename, setFilename] = useState(defaultFilename || '');
  const [format, setFormat] = useState<CompressionFormat>('zip');
  const [includePassword, setIncludePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const totalSize = calculateTotalSize(files);
  const fileCount = files.length;

  // Resetear estado al cerrar
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Confirmar compresión
  const handleConfirm = useCallback(() => {
    const finalFilename = filename.trim() || `archivos_${new Date().toISOString().split('T')[0]}`;
    
    onConfirm({
      filename: finalFilename,
      format,
      password: includePassword ? password : undefined,
      includePassword
    });
  }, [filename, format, includePassword, password, onConfirm]);

  // Generar nombre sugerido
  const handleSuggestName = useCallback(() => {
    const date = new Date().toISOString().split('T')[0];
    setFilename(`archivos_${date}`);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              📦 Comprimir Archivos
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-5">
          {/* Resumen de archivos */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {fileCount} {fileCount === 1 ? 'archivo seleccionado' : 'archivos seleccionados'}
                </p>
                <p className="text-sm text-blue-700">
                  Tamaño total: {formatFileSize(totalSize)}
                </p>
              </div>
              <span className="text-3xl">📁</span>
            </div>
          </div>

          {/* Nombre del archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del archivo
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="archivos_2024-01-01"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSuggestName}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 
                           rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap"
                type="button"
              >
                Sugerir
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Se agregará la extensión .{format} automáticamente
            </p>
          </div>

          {/* Formato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de compresión
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormat('zip')}
                className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                  format === 'zip'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">ZIP</span>
                <span className="block text-xs opacity-80">Recomendado</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('7z')}
                className={`flex-1 py-2 px-4 rounded-md border transition-colors ${
                  format === '7z'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">7Z</span>
                <span className="block text-xs opacity-80">Mejor compresión</span>
              </button>
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includePassword}
                onChange={(e) => setIncludePassword(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Proteger con contraseña
              </span>
              <span className="text-xs text-gray-500">(Requiere procesamiento en servidor)</span>
            </label>

            {includePassword && (
              <div className="mt-3">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa una contraseña segura"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-amber-600">
                  ⚠️ No olvides la contraseña. No podremos recuperarla.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md 
                       hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 
                       focus:ring-gray-500 focus:ring-offset-2"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={includePassword && !password}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
            type="button"
          >
            <span>📦</span>
            Comprimir
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompressModal;
