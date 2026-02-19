import React, { useCallback, useState, useRef } from 'react';
import { Upload, FileArchive, X } from 'lucide-react';
import { formatFileSize } from '../../utils/compression/fileHelpers';

interface DragAndDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // en bytes
  maxFiles?: number;
  allowMultiple?: boolean;
}

export const DragAndDropZone: React.FC<DragAndDropZoneProps> = ({
  onFilesSelected,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt', '.zip'],
  maxFileSize = 100 * 1024 * 1024, // 100MB
  maxFiles = 50,
  allowMultiple = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `${file.name}: Excede el tamaño máximo (${formatFileSize(maxFileSize)})`;
    }
    
    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedTypes.includes(extension)) {
      return `${file.name}: Tipo de archivo no permitido`;
    }
    
    return null;
  };

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: File[] = [];
    const newErrors: string[] = [];

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        newFiles.push(file);
      }
    });

    if (selectedFiles.length + newFiles.length > maxFiles) {
      newErrors.push(`Solo puedes seleccionar hasta ${maxFiles} archivos`);
    }

    const combinedFiles = [...selectedFiles, ...newFiles].slice(0, maxFiles);
    setSelectedFiles(combinedFiles);
    onFilesSelected(combinedFiles);
    setErrors(newErrors);
  }, [selectedFiles, maxFiles, maxFileSize, acceptedTypes, onFilesSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input para permitir seleccionar el mismo archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFiles]);

  const removeFile = useCallback((index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  }, [selectedFiles, onFilesSelected]);

  const clearAll = useCallback(() => {
    setSelectedFiles([]);
    onFilesSelected([]);
    setErrors([]);
  }, [onFilesSelected]);

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-amber-500 bg-amber-500/10 scale-[1.02]' 
            : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-3">
          <div className={`
            w-16 h-16 mx-auto rounded-full flex items-center justify-center
            transition-colors duration-200
            ${isDragging ? 'bg-amber-500/20' : 'bg-slate-800'}
          `}>
            {isDragging ? (
              <FileArchive className="w-8 h-8 text-amber-500" />
            ) : (
              <Upload className="w-8 h-8 text-slate-500" />
            )}
          </div>
          
          <div>
            <p className="text-white font-medium">
              {isDragging ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí'}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              o haz clic para seleccionar
            </p>
          </div>
          
          <p className="text-xs text-slate-500">
            {acceptedTypes.join(', ')} • Máx {formatFileSize(maxFileSize)} por archivo • Hasta {maxFiles} archivos
          </p>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm font-medium mb-1">Errores:</p>
          <ul className="space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="text-red-400 text-xs">• {error}</li>
            ))}
          </ul>
          <button
            onClick={() => setErrors([])}
            className="text-red-400 text-xs underline mt-2 hover:text-red-300"
          >
            Limpiar errores
          </button>
        </div>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-300">
              {selectedFiles.length} archivo{selectedFiles.length > 1 ? 's' : ''} seleccionado{selectedFiles.length > 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">
                Total: {formatFileSize(totalSize)}
              </span>
              <button
                onClick={clearAll}
                className="text-xs text-red-400 hover:text-red-300 underline"
              >
                Limpiar todo
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-2 bg-slate-800 rounded-lg group"
              >
                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileArchive className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DragAndDropZone;
