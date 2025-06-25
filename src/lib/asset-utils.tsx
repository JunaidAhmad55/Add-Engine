import React from 'react';
import { ImageIcon, VideoIcon, FileText, Archive as ArchiveIcon } from 'lucide-react';
import type { AssetDisplayType } from '@/types/asset-types';

export const getFileIcon = (displayType: AssetDisplayType['displayType']) => {
  switch (displayType) {
    case 'image': return <ImageIcon className="h-5 w-5 text-blue-500" />;
    case 'video': return <VideoIcon className="h-5 w-5 text-purple-500" />;
    case 'document': 
    case 'pdf':
    case 'text': return <FileText className="h-5 w-5 text-green-500" />;
    case 'archive': return <ArchiveIcon className="h-5 w-5 text-orange-500" />;
    default: return <FileText className="h-5 w-5 text-gray-500" />; 
  }
};

export const getAspectRatioGroup = (width?: number | null, height?: number | null): string => {
  if (!width || !height) return 'Other';
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) < 0.05) return '16:9 (Landscape)';
  if (Math.abs(ratio - 1) < 0.05) return '1:1 (Square)';
  if (Math.abs(ratio - 9 / 16) < 0.05) return '9:16 (Vertical)';
  if (Math.abs(ratio - 4 / 5) < 0.05) return '4:5 (Vertical)';
  return 'Other';
};
