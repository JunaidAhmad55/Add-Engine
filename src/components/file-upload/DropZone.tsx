
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { fileUploadService } from '@/lib/file-upload';

interface DropZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  maxFiles: number;
  selectedFilesCount: number;
}

const DropZone = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  uploading,
  maxFiles,
  selectedFilesCount
}: DropZoneProps) => {
  const isDisabled = uploading || selectedFilesCount >= maxFiles;

  return (
    <Card
      className={`border-2 border-dashed transition-colors ${
        isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <CardContent className="p-8 text-center">
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to browse
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Supports various file types up to 10MB. Max {maxFiles} files.
        </p>
        <input
          type="file"
          multiple
          accept={fileUploadService.allowedTypes.join(',')}
          onChange={onFileSelect}
          className="hidden"
          id="file-upload"
          disabled={isDisabled}
        />
        <label htmlFor="file-upload" className={`inline-block ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <Button variant="outline" asChild={false} disabled={isDisabled}>
            <span>Choose Files</span>
          </Button>
        </label>
      </CardContent>
    </Card>
  );
};

export default DropZone;
