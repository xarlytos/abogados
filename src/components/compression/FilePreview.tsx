import React, { useState } from 'react';
import { FileText, Image, FileSpreadsheet, FileCode, File, X, Eye } from 'lucide-react';
import { getFileExtension, formatFileSize } from '../../utils/compression/fileHelpers';

interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
  showPreview?: boolean;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  showPreview = true
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const extension = getFileExtension(file.name);

  const getFileIcon = () => {
    switch (extension) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-400" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <Image className="w-6 h-6 text-purple-400" />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="w-6 h-6 text-emerald-400" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-6 h-6 text-blue-400" />;
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'html':
      case 'css':
      case 'json':
        return <FileCode className="w-6 h-6 text-amber-400" />;
      default:
        return <File className="w-6 h-6 text-slate-400" />;
    }
  };

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handlePreview = async () => {
    if (isImage && showPreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setIsPreviewOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg group hover:bg-slate-800 transition-colors">
        {/* Icon */}
        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
          {getFileIcon()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate" title={file.name}>
            {file.name}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{extension.toUpperCase()}</span>
            <span>•</span>
            <span>{formatFileSize(file.size)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isImage && showPreview && (
            <button
              onClick={handlePreview}
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              title="Vista previa"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Eliminar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {isPreviewOpen && imagePreview && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-slate-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={imagePreview}
              alt={file.name}
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-slate-400 text-sm">{formatFileSize(file.size)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface FilePreviewGridProps {
  files: File[];
  onRemoveFile?: (index: number) => void;
  maxPreviewItems?: number;
}

export const FilePreviewGrid: React.FC<FilePreviewGridProps> = ({
  files,
  onRemoveFile,
  maxPreviewItems = 6
}) => {
  const displayFiles = files.slice(0, maxPreviewItems);
  const remainingCount = files.length - maxPreviewItems;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2">
        {displayFiles.map((file, index) => (
          <FilePreview
            key={`${file.name}-${index}`}
            file={file}
            onRemove={onRemoveFile ? () => onRemoveFile(index) : undefined}
          />
        ))}
      </div>
      {remainingCount > 0 && (
        <p className="text-center text-sm text-slate-500 py-2">
          y {remainingCount} archivo{remainingCount > 1 ? 's' : ''} más...
        </p>
      )}
    </div>
  );
};

export default FilePreview;
