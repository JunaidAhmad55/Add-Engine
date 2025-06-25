import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { googleApiService, type GoogleFile } from '@/lib/google-api';
import { Loader2, FileImage, FileVideo, FileArchive, FileQuestion } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { useGoogleDriveAutoSync } from "@/hooks/useGoogleDriveAutoSync";

interface GoogleDrivePickerProps {
  onFilesSelected: (files: GoogleFile[]) => void;
  onClose: () => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <FileImage className="h-5 w-5 text-blue-500" />;
  if (mimeType.startsWith('video/')) return <FileVideo className="h-5 w-5 text-green-500" />;
  if (mimeType === 'application/zip') return <FileArchive className="h-5 w-5 text-orange-500" />;
  return <FileQuestion className="h-5 w-5 text-gray-500" />;
};

const SYNC_INTERVAL_OPTIONS = [
  { label: "1 min", value: 1 },
  { label: "5 min", value: 5 },
  { label: "15 min", value: 15 },
];

const GoogleDrivePicker: React.FC<GoogleDrivePickerProps> = ({ onFilesSelected, onClose }) => {
  const [files, setFiles] = useState<GoogleFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<GoogleFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-sync hook!
  const {
    enabled: autoSyncEnabled,
    setEnabled: setAutoSyncEnabled,
    intervalMinutes,
    setIntervalMinutes,
    lastSync,
    isSyncing,
    forceSync
  } = useGoogleDriveAutoSync(newFiles => {
    setFiles(newFiles);
  });

  useEffect(() => {
    // Only load on mount or if not auto syncing
    if (autoSyncEnabled) {
      setIsLoading(false);
      return;
    }
    const fetchFiles = async () => {
      setIsLoading(true);
      setError(null);
      // Attempt to authenticate if not connected
      if (!googleApiService.isConnected()) {
        // Try to use stored token first
        const storedToken = googleApiService.getStoredToken();
        if (!storedToken) {
          // If no stored token, attempt mock authentication
          const authResult = await googleApiService.authenticateWithGoogle();
          if (!authResult.success) {
            setError(authResult.error || 'Failed to authenticate with Google.');
            setIsLoading(false);
            return;
          }
        }
      }
      
      const result = await googleApiService.getDriveFiles();
      if (result.success && result.files) {
        setFiles(result.files);
      } else {
        setError(result.error || 'Failed to fetch files from Google Drive.');
      }
      setIsLoading(false);
    };

    fetchFiles();
  }, [autoSyncEnabled]);

  const handleFileToggle = (file: GoogleFile) => {
    setSelectedFiles(prev =>
      prev.find(f => f.id === file.id)
        ? prev.filter(f => f.id !== file.id)
        : [...prev, file]
    );
  };

  const handleImport = () => {
    onFilesSelected(selectedFiles);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2">Loading Google Drive files...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error}</p>
        <Button onClick={onClose} variant="outline" className="mt-4">Close</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={autoSyncEnabled}
            onChange={e => setAutoSyncEnabled(e.target.checked)}
            className="accent-blue-600"
          />
          <span>Auto-Sync with Google Drive</span>
        </label>
        <select
          value={intervalMinutes}
          onChange={e => setIntervalMinutes(Number(e.target.value) as 1 | 5 | 15)}
          disabled={!autoSyncEnabled}
          className="border rounded px-2 py-1 text-sm bg-gray-50"
        >
          {SYNC_INTERVAL_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <Button size="sm" disabled={isSyncing} onClick={forceSync} className="ml-2">
          {isSyncing ? "Syncing..." : "Sync Now"}
        </Button>
        {lastSync && (
          <span className="text-xs text-gray-500 ml-2">
            Last auto-sync: {lastSync.toLocaleTimeString()}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">Select files to import from your Google Drive.</p>
      <ScrollArea className="h-72 w-full rounded-md border p-4">
        {files.length === 0 ? (
          <p className="text-center text-gray-500">No files found in Google Drive.</p>
        ) : (
          <ul className="space-y-2">
            {files.map(file => (
              <li
                key={file.id}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => handleFileToggle(file)}
              >
                <Checkbox
                  id={`file-${file.id}`}
                  checked={selectedFiles.some(f => f.id === file.id)}
                  onCheckedChange={() => handleFileToggle(file)}
                />
                {getFileIcon(file.mimeType)}
                <label htmlFor={`file-${file.id}`} className="flex-grow text-sm font-medium truncate cursor-pointer">
                  {file.name}
                </label>
                {file.size && <span className="text-xs text-gray-400">{file.size}</span>}
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleImport} disabled={selectedFiles.length === 0}>
          Import {selectedFiles.length > 0 ? `${selectedFiles.length} file(s)` : ''}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default GoogleDrivePicker;
