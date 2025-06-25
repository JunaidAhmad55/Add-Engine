import { useState, useCallback } from 'react';
import { fileUploadService, type UploadResult } from '@/lib/file-upload';
import { useToast } from '@/hooks/use-toast';

interface UseFileUploadProps {
  maxFiles: number;
  onUploadComplete: (results: UploadResult[]) => void;
  orgId: string;
}

export type UploadStatus = 'selected' | 'uploading' | 'success' | 'error';

export interface UploadableFile {
  id: string;
  file: File;
  status: UploadStatus;
  result?: UploadResult;
  error?: string;
}

export const useFileUpload = ({ maxFiles, onUploadComplete, orgId }: UseFileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadableFiles, setUploadableFiles] = useState<UploadableFile[]>([]);
  const { toast } = useToast();

  const addFiles = useCallback((files: File[]) => {
    const newFilesToAdd: UploadableFile[] = [];
    for (const file of files) {
      const validation = fileUploadService.validateFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid File",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive",
        });
        continue; 
      }
      
      if (!uploadableFiles.some(uf => uf.file.name === file.name && uf.file.size === file.size)) {
        newFilesToAdd.push({
          id: crypto.randomUUID(),
          file,
          status: 'selected',
        });
      } else {
        toast({
          title: "Duplicate File",
          description: `${file.name} is already selected.`,
          variant: "default",
        });
      }
    }

    setUploadableFiles(prev => {
      const combined = [...prev, ...newFilesToAdd];
      if (combined.length > maxFiles) {
        toast({
          title: "File Limit Exceeded",
          description: `You can select a maximum of ${maxFiles} files. ${combined.length - maxFiles} files were not added.`,
          variant: "destructive",
        });
        return combined.slice(0, maxFiles);
      }
      return combined;
    });
  }, [maxFiles, toast, uploadableFiles]);

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
    
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  }, [addFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addFiles(files);
      e.target.value = '';
    }
  };

  const removeFile = (id: string) => {
    setUploadableFiles(prev => prev.filter((uf) => uf.id !== id));
  };

  const clearCompleted = () => {
    setUploadableFiles(prev => prev.filter(f => f.status === 'selected' || f.status === 'uploading'));
    setUploadProgress(0);
  };

  const uploadFiles = async () => {
    const filesToUpload = uploadableFiles.filter(f => f.status === 'selected');
    if (filesToUpload.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    setUploadableFiles(prev => prev.map(uf => 
      filesToUpload.some(f_to_upload => f_to_upload.id === uf.id) 
        ? { ...uf, status: 'uploading' } 
        : uf
    ));

    const progressPerFile = 100 / filesToUpload.length;
    
    for (const [index, uploadable] of filesToUpload.entries()) {
      const result = await fileUploadService.uploadFile(uploadable.file, orgId);
      
      setUploadableFiles(prev => prev.map(uf => 
        uf.id === uploadable.id 
          ? { ...uf, status: result.success ? 'success' : 'error', result, error: result.error }
          : uf
      ));
      
      setUploadProgress(Math.min(100, Math.round(progressPerFile * (index + 1))));
    }
    
    const successfulResults = uploadableFiles
      .filter(f => f.status === 'success' && f.result)
      .map(f => f.result!);

    if (successfulResults.length > 0) {
      onUploadComplete(successfulResults);
    }
    
    const failedCount = filesToUpload.length - successfulResults.length;
    if (failedCount > 0) {
       toast({
        title: "Some Uploads Failed",
        description: `${failedCount} file(s) failed to upload. See details in the list.`,
        variant: "destructive",
      });
    }

    setUploading(false);
  };

  return {
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
  };
};
