import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileType',
    standalone: false
})
export class FileTypePipe implements PipeTransform {
  transform(mimeType: string): string {
    if (!mimeType) return 'Unknown';

    const mimeTypeMap: { [key: string]: string } = {
      'image/jpeg': 'Image',
      'image/png': 'Image',
      'image/gif': 'Image',
      'application/pdf': 'PDF Document',
      'text/plain': 'Text File',
      'application/msword': 'Word Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'Word Document',
      'application/vnd.ms-excel': 'Excel Spreadsheet',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'Excel Spreadsheet',
      'application/zip': 'ZIP Archive',
      'video/mp4': 'Video',
      'video/x-matroska': 'Video',
      'application/octet-stream': 'Video',
      'audio/mpeg': 'Audio',
      // Add more MIME types as needed
    };

    return mimeTypeMap[mimeType] || 'Unknown';
  }
}
