import React, { useState, useCallback } from 'react';
import { formatFileSize, getFileExtension } from '../../utils/compression/fileHelpers';

export interface SelectableFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  lastModified?: string;
}

interface FileSelectorProps {
  files: SelectableFile[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

// Iconos según tipo de archivo
const getFileIcon = (filename: string): string => {
  const ext = getFileExtension(filename);
  const iconMap: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '📽️',
    pptx: '📽️',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    zip: '📦',
    rar: '📦',
    '7z': '📦',
    txt: '📃',
    mp4: '🎬',
    mp3: '🎵',
    default: '📎'
  };
  return iconMap[ext] || iconMap.default;
};

export const FileSelector: React.FC<FileSelectorProps> = ({
  files,
  selectedIds,
  onSelectionChange,
  onSelectAll,
  onDeselectAll
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const selectedCount = selectedIds.length;
  const totalCount = files.length;
  const allSelected = selectedCount === totalCount && totalCount > 0;

  // Ordenar archivos
  const sortedFiles = [...files].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'date':
        comparison = new Date(a.lastModified || 0).getTime() - 
                     new Date(b.lastModified || 0).getTime();
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Toggle selección de un archivo
  const toggleSelection = useCallback((fileId: string) => {
    if (selectedIds.includes(fileId)) {
      onSelectionChange(selectedIds.filter(id => id !== fileId));
    } else {
      onSelectionChange([...selectedIds, fileId]);
    }
  }, [selectedIds, onSelectionChange]);

  // Cambiar ordenamiento
  const handleSort = useCallback((newSortBy: 'name' | 'size' | 'date') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-4xl mb-2">📂</p>
        <p>No hay archivos disponibles</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={allSelected ? onDeselectAll : onSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {selectedCount > 0 
                ? `${selectedCount} de ${totalCount} seleccionados` 
                : 'Seleccionar todos'}
            </span>
          </label>

          {/* Ordenamiento */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as 'name' | 'size' | 'date')}
              className="border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Nombre</option>
              <option value="size">Tamaño</option>
              <option value="date">Fecha</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-gray-500 hover:text-gray-700"
              title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de archivos */}
      <div className="max-h-80 overflow-y-auto">
        {sortedFiles.map((file) => {
          const isSelected = selectedIds.includes(file.id);
          return (
            <div
              key={file.id}
              onClick={() => toggleSelection(file.id)}
              className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer
                         transition-colors hover:bg-gray-50 ${
                isSelected ? 'bg-blue-50 hover:bg-blue-100' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}} // Manejado por el onClick del div
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              
              <span className="text-2xl">{getFileIcon(file.name)}</span>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                  {file.name}
                </p>
                {file.lastModified && (
                  <p className="text-xs text-gray-500">
                    {new Date(file.lastModified).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {formatFileSize(file.size)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {selectedCount > 0 ? (
              <>
                <span className="font-medium">{selectedCount}</span> archivo
                {selectedCount > 1 ? 's' : ''} seleccionado
                {selectedCount > 1 ? 's' : ''} ·{' '}
                <span className="font-medium">
                  {formatFileSize(
                    files
                      .filter(f => selectedIds.includes(f.id))
                      .reduce((sum, f) => sum + f.size, 0)
                  )}
                </span>
              </>
            ) : (
              'Selecciona los archivos que deseas comprimir'
            )}
          </span>
          
          {selectedCount > 0 && (
            <button
              onClick={onDeselectAll}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpiar selección
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileSelector;
