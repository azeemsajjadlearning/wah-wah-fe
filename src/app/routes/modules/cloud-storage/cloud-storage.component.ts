import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FileList } from 'src/app/models/cloud-storage';
import { CloudStorageService } from 'src/app/services/cloud-storage.service';

@Component({
  templateUrl: 'cloud-storage.component.html',
  styleUrls: ['cloud-storage.component.scss'],
})
export class CloudStorageComponent implements OnInit {
  fileList: FileList[];

  displayedColumns: string[] = [
    'file_name',
    'file_size',
    'file_type',
    'actions',
  ];

  constructor(private cloudStorageService: CloudStorageService) {}

  ngOnInit() {
    this.cloudStorageService
      .getFiles()
      .subscribe((resp) => (this.fileList = resp.result));
  }

  upload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.cloudStorageService.uploadFile(file).subscribe(
        (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              const percent = Math.round((100 * event.loaded) / event.total);
              console.log(`Upload is ${percent}% done.`);
            }
          } else if (event.type === HttpEventType.Response) {
            console.log('Upload complete:', event.body);
          }
        },
        (error) => {
          console.error('Upload failed:', error);
        }
      );
    }
  }

  download(file: FileList) {
    this.cloudStorageService
      .downloadFile(file.file_name, file.file_id)
      .subscribe(
        (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.file_name;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Download error:', error);
        }
      );
  }
}
