/**
 * Componentes de compresión de archivos
 * 
 * Esta carpeta contiene todos los componentes relacionados con la funcionalidad
 * de compresión de archivos del ERP de bufete de abogados.
 */

export { CompressButton } from './CompressButton';
export { CompressModal } from './CompressModal';
export { CompressModalV2 } from './CompressModalV2';
export { CompressionProgress } from './CompressionProgress';
export { FileSelector } from './FileSelector';
export { DragAndDropZone } from './DragAndDropZone';
export { CompressionHistory } from './CompressionHistory';
export { FilePreview, FilePreviewGrid } from './FilePreview';

// Re-exportar tipos
export type { CompressModalOptions } from './CompressModal';
export type { SelectableFile } from './FileSelector';
export type { CompressionHistoryItem } from './CompressionHistory';
