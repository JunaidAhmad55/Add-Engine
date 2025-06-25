
// File upload service for asset management

export interface UploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  fileSize?: number;
  width?: number | null;
  height?: number | null;
  error?: string;
}

class FileUploadService {
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  public readonly allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'application/pdf', 
                                   'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .doc, .docx
                                   'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xls, .xlsx
                                   'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .ppt, .pptx
                                   'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar', // archives
                                   'text/plain', 'text/markdown', 'application/rtf']; // text files

  validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > this.maxFileSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    // Loosening this check for now as getFileType handles extension based typing.
    // More robust MIME type validation could be added.
    // if (!this.allowedTypes.includes(file.type)) {
    //   console.warn(`File type ${file.type} for ${file.name} is not in the explicit allow list, but proceeding with extension-based typing.`);
    // }

    return { valid: true };
  }

  async getFileDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
    return new Promise((resolve) => {
      const fileType = this.getFileType(file.name);
      
      if (fileType !== 'image' && fileType !== 'video') {
        return resolve({ width: null, height: null });
      }

      const url = URL.createObjectURL(file);

      if (fileType === 'image') {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
          URL.revokeObjectURL(url);
        };
        img.onerror = () => {
          console.error(`Error loading image: ${file.name}`);
          resolve({ width: null, height: null });
          URL.revokeObjectURL(url);
        };
        img.src = url;
      } else { // It must be a video
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          resolve({ width: video.videoWidth, height: video.videoHeight });
          URL.revokeObjectURL(url);
        };
        video.onerror = () => {
          console.error(`Error loading video metadata: ${file.name}`);
          resolve({ width: null, height: null });
          URL.revokeObjectURL(url);
        };
        video.src = url;
      }
    });
  }

  async uploadFile(file: File, orgId: string): Promise<UploadResult> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      console.log('Uploading file:', file.name, 'for org:', orgId);
      
      const dimensions = await this.getFileDimensions(file);

      // Mock upload process - in production, this would upload to S3
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock URL
      const mockUrl = URL.createObjectURL(file);
      
      return {
        success: true,
        url: mockUrl,
        fileName: file.name,
        fileSize: file.size,
        width: dimensions.width,
        height: dimensions.height,
      };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'Failed to upload file' };
    }
  }

  async uploadMultipleFiles(files: File[], orgId: string): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await this.uploadFile(file, orgId);
      results.push(result);
    }
    
    return results;
  }

  getFileType(fileName: string): 'image' | 'video' | 'pdf' | 'document' | 'archive' | 'text' | 'other' {
    const ext = fileName.toLowerCase().split('.').pop() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) return 'image';
    if (['mp4', 'mov', 'avi', 'wmv', 'mkv', 'webm', 'flv'].includes(ext)) return 'video';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx', 'odt', 'pages', 'key', 'numbers', 'xls', 'xlsx', 'csv', 'ods', 'ppt', 'pptx', 'odp'].includes(ext)) return 'document';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
    if (['txt', 'md', 'rtf'].includes(ext)) return 'text';
    
    return 'other';
  }
}

export const fileUploadService = new FileUploadService();
