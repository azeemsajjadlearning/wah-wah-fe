import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filesize',
})
export class FileSizePipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 1024 * 1024 * 1024) {
      // Convert to GB
      return (value / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    } else if (value >= 1024 * 1024) {
      // Convert to MB
      return (value / (1024 * 1024)).toFixed(2) + ' MB';
    } else if (value >= 1024) {
      // Convert to KB
      return (value / 1024).toFixed(2) + ' KB';
    } else {
      // Bytes
      return value + ' B';
    }
  }
}
