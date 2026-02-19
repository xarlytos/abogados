import React, { useState, useCallback } from 'react';
import { X, FolderArchive, History, Upload, FileStack } from 'lucide-react';
import { DragAndDropZone } from './DragAndDropZone';
import { FilePreviewGrid } from './FilePreview';
import { CompressionHistory } from './CompressionHistory';
import type { CompressionHistoryItem } from './CompressionHistory';
import { CompressButton } from './CompressButton';
import { CompressionProgress } from './CompressionProgress';
import { useFileCompression } from '../../hooks/useFileCompression';
import type { CompressionFormat } from '../../types/compression';

interface CompressModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  defaultFilename?: string;
  initialFiles?: File[];
  showHistory?: boolean;
  historyItems?: CompressionHistoryItem[];
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}

type TabType = 'upload' | 'history';

export const CompressModalV2: React.FC<CompressModalV2Props> = ({
  isOpen,
  onClose,
  defaultFilename,
  initialFiles = [],
  showHistory = true,
  historyItems = [],
  acceptedTypes,
  maxFileSize,
  maxFiles
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [selectedFiles, setSelectedFiles] = useState<File[]>(initialFiles);
  const [filename, setFilename] = useState(defaultFilename || '');
  const [format, setFormat] = useState<CompressionFormat>('zip');
  const [includePassword, setIncludePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    isCompressing,
    progress,
    currentFile,
    result,
    error,
    compressFiles,
    cancelCompression,
    reset
  } = useFileCompression();

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(files);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleCompress = async () => {
    if (selectedFiles.length === 0) return;

    const finalFilename = filename.trim() || `archivos_${new Date().toISOString().split('T')[0]}`;
    
    await compressFiles(selectedFiles, {
      filename: finalFilename,
      format,
      password: includePassword ? password : undefined
    });
  };

  const handleClose = () => {
    if (!isCompressing) {
      reset();
      setSelectedFiles([]);
      setFilename(defaultFilename || '');
      onClose();
    }
  };

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <FolderArchive className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Comprimir Archivos
                </h2>
                <p className="text-sm text-slate-400">
                  {selectedFiles.length > 0 
                    ? `${selectedFiles.length} archivo(s) listo(s)` 
                    : 'Selecciona archivos para comprimir'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isCompressing}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          {showHistory && historyItems.length > 0 && (
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'text-amber-500 border-b-2 border-amber-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                Subir y comprimir
                {selectedFiles.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-500 text-xs rounded-full">
                    {selectedFiles.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'text-amber-500 border-b-2 border-amber-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
                Historial
                {historyItems.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full">
                    {historyItems.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'upload' ? (
              <div className="space-y-6">
                {/* Drag & Drop Zone */}
                {selectedFiles.length === 0 ? (
                  <DragAndDropZone
                    onFilesSelected={handleFilesSelected}
                    acceptedTypes={acceptedTypes}
                    maxFileSize={maxFileSize}
                    maxFiles={maxFiles}
                    allowMultiple
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <FileStack className="w-4 h-4 text-slate-400" />
                        Archivos seleccionados
                      </h3>
                      <button
                        onClick={() => setSelectedFiles([])}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Limpiar todo
                      </button>
                    </div>
                    <FilePreviewGrid
                      files={selectedFiles}
                      onRemoveFile={handleRemoveFile}
                      maxPreviewItems={8}
                    />
                    <button
                      onClick={() => setSelectedFiles([])}
                      className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-500 hover:text-slate-400 hover:border-slate-600 transition-colors"
                    >
                      + Agregar más archivos
                    </button>
                  </div>
                )}

                {/* Options */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    {/* Filename */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Nombre del archivo
                      </label>
                      <input
                        type="text"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        placeholder="archivos_2024-01-01"
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Se agregará la extensión .{format} automáticamente
                      </p>
                    </div>

                    {/* Format */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Formato
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setFormat('zip')}
                          className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                            format === 'zip'
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <span className="font-medium">ZIP</span>
                          <span className="block text-xs opacity-80">Recomendado</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormat('7z')}
                          className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                            format === '7z'
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <span className="font-medium">7Z</span>
                          <span className="block text-xs opacity-80">Mejor compresión</span>
                        </button>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includePassword}
                          onChange={(e) => setIncludePassword(e.target.checked)}
                          className="w-4 h-4 text-amber-500 bg-slate-800 border-slate-700 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm text-slate-300">
                          Proteger con contraseña
                        </span>
                      </label>

                      {includePassword && (
                        <div className="mt-3">
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Contraseña segura"
                              className="w-full px-4 py-2 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400"
                            >
                              {showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                          </div>
                          <p className="text-xs text-amber-500/80 mt-1">
                            ⚠️ No olvides la contraseña. No podremos recuperarla.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Archivos:</span>
                        <span className="text-white">{selectedFiles.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-slate-400">Tamaño total:</span>
                        <span className="text-white">
                          {(totalSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Success */}
                {result?.success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                    <p className="text-emerald-400 text-sm">
                      ✅ {result.filename} comprimido correctamente
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <CompressionHistory
                history={historyItems}
                onDownload={(item) => console.log('Download', item)}
                onDelete={(id) => console.log('Delete', id)}
              />
            )}
          </div>

          {/* Footer */}
          {activeTab === 'upload' && (
            <div className="p-6 border-t border-slate-800 flex justify-between items-center flex-shrink-0">
              <button
                onClick={handleClose}
                disabled={isCompressing}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCompress}
                disabled={selectedFiles.length === 0 || isCompressing || (includePassword && !password)}
                className="px-6 py-2 bg-amber-500 text-slate-950 font-medium rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCompressing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    Comprimiendo...
                  </>
                ) : (
                  <>
                    <FolderArchive className="w-4 h-4" />
                    Comprimir {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Modal */}
      <CompressionProgress
        isVisible={isCompressing}
        progress={progress}
        currentFile={currentFile}
        onCancel={cancelCompression}
      />
    </>
  );
};

export default CompressModalV2;
