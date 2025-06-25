
import { type UploadResult } from '@/lib/file-upload';
import { useFileUpload } from '@/hooks/useFileUpload';
import DropZone from './file-upload/DropZone';
import FileList from './file-upload/FileList';

interface FileUploadProps {
  onUploadComplete: (results: UploadResult[]) => void;
  orgId: string;
  maxFiles?: number;
}

const FileUpload = ({ onUploadComplete, orgId, maxFiles = 10 }: FileUploadProps) => {
  const {
    isDragging,
    uploading,
    uploadProgress,
    uploadableFiles,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile,
    uploadFiles,
    clearCompleted,
  } = useFileUpload({ maxFiles, onUploadComplete, orgId });

  return (
    <div className="space-y-4">
      <DropZone
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFileSelect={handleFileSelect}
        uploading={uploading}
        maxFiles={maxFiles}
        selectedFilesCount={uploadableFiles.length}
      />

      <FileList
        uploadableFiles={uploadableFiles}
        onRemoveFile={removeFile}
        onUpload={uploadFiles}
        onClearCompleted={clearCompleted}
        uploading={uploading}
        uploadProgress={uploadProgress}
        maxFiles={maxFiles}
      />
    </div>
  );
};

export default FileUpload;
