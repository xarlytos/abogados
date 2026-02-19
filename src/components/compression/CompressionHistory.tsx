import React, { useState } from 'react';
import { History, Download, Trash2, FileArchive, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatFileSize } from '../../utils/compression/fileHelpers';

export interface CompressionHistoryItem {
  id: string;
  filename: string;
  fileCount: number;
  totalSize: number;
  compressedSize: number;
  status: 'completed' | 'failed' | 'processing';
  createdAt: Date;
  downloadUrl?: string;
  error?: string;
}

interface CompressionHistoryProps {
  history: CompressionHistoryItem[];
  onDownload?: (item: CompressionHistoryItem) => void;
  onDelete?: (id: string) => void;
  onClear?: () => void;
  maxItems?: number;
}

export const CompressionHistory: React.FC<CompressionHistoryProps> = ({
  history,
  onDownload,
  onDelete,
  onClear,
  maxItems = 10
}) => {
  const [,] = useState<string | null>(null); // expandedId - disponible para uso futuro

  const getStatusIcon = (status: CompressionHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-amber-500 animate-pulse" />;
    }
  };

  /* Función disponible para uso futuro
  const getStatusText = (status: CompressionHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'failed':
        return 'Error';
      case 'processing':
        return 'Procesando...';
    }
  };
  */

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-ES');
  };

  const displayHistory = history.slice(0, maxItems);

  if (history.length === 0) {
    return (
      <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-6 text-center">
        <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 text-sm">No hay historial de compresiones</p>
        <p className="text-slate-500 text-xs mt-1">
          Los archivos comprimidos aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" />
          <h3 className="text-white font-medium">Historial de compresiones</h3>
          <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full">
            {history.length}
          </span>
        </div>
        {history.length > 0 && onClear && (
          <button
            onClick={onClear}
            className="text-xs text-red-400 hover:text-red-300 underline"
          >
            Limpiar historial
          </button>
        )}
      </div>

      {/* List */}
      <div className="divide-y divide-slate-800">
        {displayHistory.map((item) => (
          <div
            key={item.id}
            className="p-4 hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.status === 'processing' ? (
                  <Clock className="w-5 h-5 text-amber-500 animate-spin" />
                ) : (
                  <FileArchive className="w-5 h-5 text-slate-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  {getStatusIcon(item.status)}
                </div>

                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>{item.fileCount} archivos</span>
                  <span>•</span>
                  <span>{formatFileSize(item.totalSize)}</span>
                  {item.status === 'completed' && item.compressedSize > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400">
                        Comprimido: {formatFileSize(item.compressedSize)}
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-1">
                  {formatDate(item.createdAt)}
                </p>

                {item.status === 'failed' && item.error && (
                  <p className="text-xs text-red-400 mt-2">{item.error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {item.status === 'completed' && item.downloadUrl && onDownload && (
                  <button
                    onClick={() => onDownload(item)}
                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                    title="Descargar"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Eliminar del historial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {history.length > maxItems && (
        <div className="p-3 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            Mostrando {maxItems} de {history.length} compresiones
          </p>
        </div>
      )}
    </div>
  );
};

export default CompressionHistory;
