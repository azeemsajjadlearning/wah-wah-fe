import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, switchMap, tap } from 'rxjs';
import { FileList, FolderList, FolderPath } from 'src/app/models/cloud-storage';
import { CloudStorageService } from 'src/app/services/cloud-storage.service';
import { CreateFolderComponent } from './create-folder/create-folder.component';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

@Component({
  templateUrl: 'cloud-storage.component.html',
  styleUrls: ['cloud-storage.component.scss'],
})
export class CloudStorageComponent implements OnInit {
  folderId: string | null = null;
  fileList: FileList[];
  folderList: FolderList[];
  folderPath: FolderPath[];
  displayedColumns: string[] = ['file_name', 'size', 'type', 'action'];

  constructor(
    private cloudStorageService: CloudStorageService,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.url.subscribe((event: UrlSegment[]) => {
      event[1]?.path ? (this.folderId = event[1]?.path) : (this.folderId = '0');

      this.getFilesAndfolders(this.folderId);
    });
  }

  ngOnInit() {}

  private getFilesAndfolders(folderId: string) {
    this.cloudStorageService.getFiles(folderId).subscribe((resp) => {
      this.fileList = resp.result.files;
      this.folderList = resp.result.folders;
      this.folderPath = resp.result.folderPath;

      this.folderPath.unshift({ folder_id: '', folder_name: 'Home' });
    });
  }

  upload(event: any) {
    this.cloudStorageService
      .uploadFile(event.target.files[0], this.folderId)
      .subscribe({
        next: (progressUpdate) => {
          if (progressUpdate.progress !== undefined) {
            console.log(`Progress: ${progressUpdate.progress}%`);
          }
          if (progressUpdate.success) {
            console.log(progressUpdate.message);
          }
        },
        error: (err) => {
          console.error('Upload failed', err);
        },
      });
  }

  download(file: FileList): void {
    this.cloudStorageService.getChunks(file.file_id).subscribe((res) => {
      const chunkUrls: string[] = [];

      res.result.forEach((element: any) => {
        chunkUrls.push(element.metadata.url);
      });

      const chunkBlobs: Blob[] = [];

      const downloadAllChunks = (index: number): Observable<Blob> => {
        if (index >= chunkUrls.length) {
          const combinedBlob = new Blob(chunkBlobs, {
            type: res.file[0].mime_type,
          });

          this.triggerDownload(combinedBlob, res.file[0].file_name);
          return new Observable();
        }

        return this.cloudStorageService.downloadChunk(chunkUrls[index]).pipe(
          tap((chunkBlob: Blob) => {
            chunkBlobs.push(chunkBlob);
          }),
          switchMap(() => downloadAllChunks(index + 1))
        );
      };

      downloadAllChunks(0).subscribe();
    });
  }

  delete(file: FileList) {
    this.cloudStorageService.deleteFile(file.file_id).subscribe((resp) => {
      console.log(resp);
    });
  }

  createFolder() {
    const folderDialog: MatDialogRef<any> = this.dialog.open(
      CreateFolderComponent,
      {
        width: '300px',
      }
    );

    folderDialog.afterClosed().subscribe((val) => {
      if (val) {
        this.cloudStorageService
          .createFolder(val, this.folderId)
          .subscribe((resp) => console.log(resp));
      }
    });
  }

  openFolder(folder: FolderList): void {
    this.router.navigateByUrl(`/cloud-storage/${folder._id}`);
  }

  goPath(folder: FolderPath): void {
    this.router.navigateByUrl(`/cloud-storage/${folder.folder_id}`);
  }

  private triggerDownload(blob: Blob, fileName: string): void {
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(downloadUrl);
  }
}
