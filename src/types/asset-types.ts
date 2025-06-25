
// Asset display types for the frontend
export interface AssetDisplayType {
  id: string;
  name: string;
  type: import('@/lib/db-types').AssetFileType;
  displayType: 'image' | 'video' | 'pdf' | 'document' | 'archive' | 'text' | 'other';
  size: string;
  tags: string[];
  uploadDate: string;
  preview: string;
  width?: number | null;
  height?: number | null;
  folder_id?: string | null;
  angle?: string; // added
  hook?: string; // added
  notes?: string; // added
}

export type FileServiceType = 'image' | 'video' | 'pdf' | 'document' | 'archive' | 'text' | 'other';

