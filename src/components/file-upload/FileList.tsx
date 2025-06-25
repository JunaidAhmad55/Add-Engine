
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import FilePreview from './FilePreview';
import type { UploadableFile } from '@/hooks/useFileUpload';

interface FileListProps {
  uploadableFiles: UploadableFile[];
  onRemoveFile: (id: string) => void;
  onUpload: () => void;
  onClearCompleted: () => void;
  uploading: boolean;
  uploadProgress: number;
  maxFiles: number;
}

const FileList = ({
  uploadableFiles,
  onRemoveFile,
  onUpload,
  onClearCompleted,
  uploading,
  uploadProgress,
  maxFiles
}: FileListProps) => {
  if (uploadableFiles.length === 0) return null;

  const filesToUploadCount = uploadableFiles.filter(f => f.status === 'selected').length;
  const completedFilesCount = uploadableFiles.filter(f => f.status === 'success' || f.status === 'error').length;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h4 className="font-medium">Selected Files ({uploadableFiles.length}/{maxFiles})</h4>
          <div className="flex gap-2">
            {completedFilesCount > 0 && !uploading && (
              <Button onClick={onClearCompleted} variant="ghost" size="sm">
                Clear Completed
              </Button>
            )}
            <Button 
              onClick={onUpload} 
              disabled={uploading || filesToUploadCount === 0}
              size="sm"
            >
              {uploading ? `Uploading...` : `Upload ${filesToUploadCount} File(s)`}
            </Button>
          </div>
        </div>

        {uploading && (
          <Progress value={uploadProgress} className="mb-4 h-2" />
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {uploadableFiles.map((uploadableFile) => (
            <FilePreview
              key={uploadableFile.id}
              uploadableFile={uploadableFile}
              onRemove={onRemoveFile}
              disabled={uploading}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileList;
