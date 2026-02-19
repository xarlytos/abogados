/**
 * EJEMPLO DE USO - Integración de Compresión de Archivos
 * 
 * Este archivo muestra cómo integrar los componentes de compresión
 * en las diferentes páginas del sistema.
 */

// ============================================
// EJEMPLO 1: Expedientes - Comprimir documentos del caso
// ============================================

import { CompressButton } from './CompressButton';
import { FileSelector, type SelectableFile } from './FileSelector';
import { useState } from 'react';

// En la página de Expedientes (dentro del modal de documentos)
function ExpedienteDocumentosExample() {
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  
  // Archivos del expediente (normalmente vendrían de la API)
  const expedienteFiles: SelectableFile[] = [
    { id: '1', name: 'Demanda.pdf', size: 2500000, type: 'application/pdf', lastModified: '2024-01-15' },
    { id: '2', name: 'Escritura.docx', size: 1800000, type: 'application/docx', lastModified: '2024-01-14' },
    { id: '3', name: 'Evidencia.jpg', size: 3200000, type: 'image/jpeg', lastModified: '2024-01-13' },
  ];

  // Convertir archivos seleccionados a File[] para el botón
  const getSelectedFiles = (): File[] => {
    // En una implementación real, esto obtendría los archivos reales
    return [];
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Documentos del Expediente</h3>
      
      {/* Selector de archivos con checkboxes */}
      <FileSelector
        files={expedienteFiles}
        selectedIds={selectedFileIds}
        onSelectionChange={setSelectedFileIds}
        onSelectAll={() => setSelectedFileIds(expedienteFiles.map(f => f.id))}
        onDeselectAll={() => setSelectedFileIds([])}
      />

      {/* Botón de compresión */}
      <div className="mt-4 flex justify-end">
        <CompressButton
          files={getSelectedFiles()}
          defaultFilename={`Expediente_DOC_${new Date().toISOString().split('T')[0]}`}
          variant="primary"
          onSuccess={(url) => console.log('Descargar:', url)}
          onError={(err) => console.error('Error:', err)}
        />
      </div>
    </div>
  );
}

// ============================================
// EJEMPLO 2: Biblioteca - Descargar múltiples plantillas
// ============================================

function BibliotecaExample() {
  const [selectedTemplates, setSelectedTemplates] = useState<File[]>([]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Plantillas Legales</h3>
        
        {/* Botón para comprimir plantillas seleccionadas */}
        <CompressButton
          files={selectedTemplates}
          defaultFilename="Plantillas_Legales"
          variant="secondary"
          label="📦 Descargar seleccionadas"
        />
      </div>
      
      {/* Lista de plantillas... */}
    </div>
  );
}

// ============================================
// EJEMPLO 3: Portal del Cliente - Descargar mis documentos
// ============================================

function PortalClienteExample() {
  const clienteFiles: File[] = []; // Archivos del cliente desde la API

  return (
    <div className="p-4">
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-900">Mis Documentos</h3>
        <p className="text-sm text-blue-700">
          Descarga todos tus documentos en un solo archivo ZIP
        </p>
      </div>

      {/* Botón para descargar todo */}
      <CompressButton
        files={clienteFiles}
        defaultFilename={`Mis_Documentos_${new Date().toISOString().split('T')[0]}`}
        variant="primary"
        label="📦 Descargar todos mis documentos"
      />
    </div>
  );
}

// ============================================
// EJEMPLO 4: Modal de subida de documentos con compresión
// ============================================

import { useFileCompression } from '../../hooks/useFileCompression';
import { CompressionProgress } from './CompressionProgress';

function ModalCompresionExample() {
  const {
    isCompressing,
    progress,
    currentFile,
    compressFiles,
    cancelCompression,
    error,
    result
  } = useFileCompression();

  const handleCompressAll = async (files: File[]) => {
    const compressionResult = await compressFiles(files, {
      filename: 'Documentos_Comprimidos',
      format: 'zip'
    });

    if (compressionResult.success) {
      console.log('Compresión exitosa:', compressionResult.filename);
    }
  };

  return (
    <>
      {/* Contenido del modal... */}
      
      {/* Barra de progreso durante la compresión */}
      <CompressionProgress
        isVisible={isCompressing}
        progress={progress}
        currentFile={currentFile}
        onCancel={cancelCompression}
      />

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mt-4">
          ❌ Error: {error}
        </div>
      )}

      {/* Mensaje de éxito */}
      {result?.success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mt-4">
          ✅ {result.filename} descargado correctamente
        </div>
      )}
    </>
  );
}

// ============================================
// EJEMPLO 5: Uso directo del hook
// ============================================

function HookDirectoExample() {
  const { compressExpediente, isCompressing, progress } = useFileCompression();

  const handleDownloadExpediente = async (expedienteId: string) => {
    // URLs de los archivos del expediente en el servidor
    const fileUrls = [
      '/api/files/expediente_001/demanda.pdf',
      '/api/files/expediente_001/anexos.pdf',
      '/api/files/expediente_001/evidencias.jpg'
    ];

    await compressExpediente(
      expedienteId,
      fileUrls,
      `Expediente_${expedienteId}_Completo`
    );
  };

  return (
    <button 
      onClick={() => handleDownloadExpediente('EXP-2024-001')}
      disabled={isCompressing}
    >
      {isCompressing ? `Comprimiendo ${progress}%...` : '📦 Descargar Expediente'}
    </button>
  );
}

// ============================================
// RESUMEN DE IMPORTACIONES
// ============================================

/**
 * Importaciones necesarias:
 * 
 * // Componentes
 * import { CompressButton } from '@/components/compression/CompressButton';
 * import { FileSelector } from '@/components/compression/FileSelector';
 * import { CompressionProgress } from '@/components/compression/CompressionProgress';
 * import { CompressModal } from '@/components/compression/CompressModal';
 * 
 * // Hook
 * import { useFileCompression } from '@/hooks/useFileCompression';
 * 
 * // Servicio (para casos avanzados)
 * import { compressionService } from '@/services/compressionService';
 * 
 * // Utilidades
 * import { formatFileSize, calculateTotalSize } from '@/utils/compression/fileHelpers';
 * 
 * // Tipos
 * import type { CompressOptions, CompressionResult } from '@/types/compression';
 */

export {
  ExpedienteDocumentosExample,
  BibliotecaExample,
  PortalClienteExample,
  ModalCompresionExample,
  HookDirectoExample
};
