/**
 * EJEMPLOS V2 - Nuevas funcionalidades de compresión
 * 
 * Este archivo muestra cómo usar los nuevos componentes de la Fase 3
 */

// ============================================
// EJEMPLO 1: Uso del nuevo CompressModalV2
// ============================================

import { useState } from 'react';
import { CompressModalV2 } from './index';
import type { CompressionHistoryItem } from './CompressionHistory';

function EjemploCompressModalV2() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Historial de compresiones simulado
  const history: CompressionHistoryItem[] = [
    {
      id: '1',
      filename: 'Expediente_001_Documentos.zip',
      fileCount: 5,
      totalSize: 2500000,
      compressedSize: 1800000,
      status: 'completed',
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      downloadUrl: '/downloads/1'
    },
    {
      id: '2',
      filename: 'Plantillas_Legales.zip',
      fileCount: 12,
      totalSize: 5000000,
      compressedSize: 3500000,
      status: 'completed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      downloadUrl: '/downloads/2'
    },
    {
      id: '3',
      filename: 'Mis_Documentos.zip',
      fileCount: 3,
      totalSize: 1200000,
      compressedSize: 0,
      status: 'processing',
      createdAt: new Date()
    }
  ];

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Abrir Compresor Avanzado
      </button>

      <CompressModalV2
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultFilename="Mis_Archivos"
        showHistory={true}
        historyItems={history}
        acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.png']}
        maxFileSize={50 * 1024 * 1024} // 50MB
        maxFiles={20}
      />
    </div>
  );
}

// ============================================
// EJEMPLO 2: Uso de DragAndDropZone solo
// ============================================

import { DragAndDropZone } from './DragAndDropZone';
import { FilePreviewGrid } from './FilePreview';

function EjemploDragAndDrop() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="space-y-4">
      <DragAndDropZone
        onFilesSelected={setFiles}
        acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.png']}
        maxFileSize={10 * 1024 * 1024} // 10MB
        maxFiles={10}
        allowMultiple
      />
      
      {files.length > 0 && (
        <div>
          <h4>Vista previa:</h4>
          <FilePreviewGrid
            files={files}
            onRemoveFile={(index) => {
              setFiles(files.filter((_, i) => i !== index));
            }}
            maxPreviewItems={6}
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// EJEMPLO 3: Uso del historial de compresiones
// ============================================

import { CompressionHistory } from './CompressionHistory';

function EjemploHistorial() {
  const [history, setHistory] = useState<CompressionHistoryItem[]>([
    {
      id: '1',
      filename: 'Documentos_Caso_123.zip',
      fileCount: 5,
      totalSize: 2500000,
      compressedSize: 1800000,
      status: 'completed',
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      downloadUrl: '/downloads/1'
    }
  ]);

  const handleDownload = (item: CompressionHistoryItem) => {
    console.log('Descargando:', item.filename);
    // Implementar descarga
  };

  const handleDelete = (id: string) => {
    setHistory(history.filter(h => h.id !== id));
  };

  const handleClear = () => {
    setHistory([]);
  };

  return (
    <CompressionHistory
      history={history}
      onDownload={handleDownload}
      onDelete={handleDelete}
      onClear={handleClear}
      maxItems={10}
    />
  );
}

// ============================================
// EJEMPLO 4: Integración completa en página
// ============================================

import { useFileCompression } from '../../hooks/useFileCompression';
import { CompressionProgress } from './CompressionProgress';

function EjemploIntegracionCompleta() {
  const [files, setFiles] = useState<File[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
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

  const handleCompress = async () => {
    if (files.length === 0) return;
    
    await compressFiles(files, {
      filename: 'Mi_Archivo',
      format: 'zip'
    });
  };

  return (
    <div className="space-y-6">
      {/* Zona de arrastre */}
      <DragAndDropZone
        onFilesSelected={setFiles}
        maxFileSize={100 * 1024 * 1024}
        maxFiles={50}
      />

      {/* Vista previa */}
      {files.length > 0 && (
        <FilePreviewGrid
          files={files}
          onRemoveFile={(index) => setFiles(f => f.filter((_, i) => i !== index))}
        />
      )}

      {/* Botón comprimir */}
      <button
        onClick={handleCompress}
        disabled={files.length === 0 || isCompressing}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {isCompressing ? 'Comprimiendo...' : 'Comprimir'}
      </button>

      {/* Progreso */}
      <CompressionProgress
        isVisible={isCompressing}
        progress={progress}
        currentFile={currentFile}
        onCancel={cancelCompression}
      />

      {/* Resultado */}
      {result?.success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg">
          ✅ {result.filename} listo
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Historial */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="text-blue-600 underline"
      >
        {showHistory ? 'Ocultar' : 'Ver'} historial
      </button>

      {showHistory && (
        <CompressionHistory
          history={[]}
          maxItems={5}
        />
      )}
    </div>
  );
}

export {
  EjemploCompressModalV2,
  EjemploDragAndDrop,
  EjemploHistorial,
  EjemploIntegracionCompleta
};
