
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { X, File as FileIconLucide, ImageIcon, VideoIcon, FileText, Archive as ArchiveIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { fileUploadService } from '@/lib/file-upload';
import type { UploadableFile } from '@/hooks/useFileUpload';

interface FilePreviewProps {
  uploadableFile: UploadableFile;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

const FilePreview = ({ uploadableFile, onRemove, disabled = false }: FilePreviewProps) => {
  const { file, status, id, error } = uploadableFile;

  const getFileIcon = (file: File) => {
    const type = fileUploadService.getFileType(file.name);
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4 text-blue-500" />;
      case 'video': return <VideoIcon className="h-4 w-4 text-purple-500" />;
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'document': return <FileText className="h-4 w-4 text-sky-500" />;
      case 'text': return <FileText className="h-4 w-4 text-gray-600" />;
      case 'archive': return <ArchiveIcon className="h-4 w-4 text-yellow-600" />;
      case 'other':
      default: return <FileIconLucide className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle className="h-5 w-5 text-red-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{error || 'An unknown error occurred'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
      <div className="flex items-center gap-3 overflow-hidden">
        {getFileIcon(file)}
        <span className="text-sm font-medium truncate" title={file.name}>{file.name}</span>
        <Badge variant="secondary" className="text-xs flex-shrink-0">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        {renderStatusIcon()}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(id)}
          disabled={disabled || status === 'uploading'}
          aria-label={`Remove ${file.name}`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FilePreview;
