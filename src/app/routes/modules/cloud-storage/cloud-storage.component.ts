import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FileList, FolderList } from 'src/app/models/cloud-storage';
import { CloudStorageService } from 'src/app/services/cloud-storage.service';

@Component({
  templateUrl: 'cloud-storage.component.html',
  styleUrls: ['cloud-storage.component.scss'],
})
export class CloudStorageComponent implements OnInit {
  folderId: string | null = null;
  folderList: FolderList[] = [];
  fileList: FileList[] = [];
  folderName: FormControl = new FormControl(null);
  viewMode: string = 'tiles';

  createDialogRef: MatDialogRef<any> | undefined;

  displayedColumns: string[] = [
    'file_name',
    'file_size',
    'file_type',
    'actions',
  ];

  @ViewChild('createFolderDialog') createFolderDialog!: TemplateRef<any>;

  constructor(
    private cloudStorageService: CloudStorageService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initializeUrlHandling();
  }

  private initializeUrlHandling(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateFolderIdFromUrl(event.urlAfterRedirects);
        this.getFilesFolder(this.folderId);
      }
    });

    this.updateFolderIdFromUrl(this.router.url);
    this.getFilesFolder(this.folderId);
  }

  private updateFolderIdFromUrl(url: string): void {
    this.folderId = url.startsWith('/cloud-storage/')
      ? url.replace('/cloud-storage/', '') || null
      : null;
  }

  openCreateFolderDialog(): void {
    this.folderName.setValue(null);
    this.createDialogRef = this.dialog.open(this.createFolderDialog, {
      width: '300px',
      disableClose: true,
    });
  }

  createFolder(): void {
    if (this.folderName.value) {
      this.cloudStorageService
        .createFolder(this.folderName.value, this.folderId)
        .subscribe((resp) => {
          if (resp.success) {
            this.createDialogRef?.close();
            this.getFilesFolder(this.folderId);
          }
        });
    }
  }

  alterFolder(folder: FolderList, type: 'rename' | 'delete'): void {
    if (type === 'delete') {
      this.cloudStorageService.deleteFolder(folder._id).subscribe((resp) => {
        if (resp.success) this.getFilesFolder(this.folderId);
      });
    }
    // Handle 'rename' logic if needed
  }

  openFolder(folder: FolderList): void {
    this.router.navigateByUrl(`/cloud-storage/${folder._id}`);
  }

  private getFilesFolder(folderId: string | null): void {
    forkJoin([
      this.cloudStorageService.getFolders(folderId),
      this.cloudStorageService.getFiles(folderId || 0),
    ]).subscribe(([foldersResp, filesResp]) => {
      this.folderList = foldersResp.result;
      this.fileList = filesResp.result;
    });
  }

  upload(event: any): void {
    const files: File[] = Array.from(event.target.files);

    if (files && files.length > 0) {
      this.cloudStorageService.uploadFile(files, this.folderId).subscribe(
        (event) => this.handleUploadProgress(event),
        (error) => console.error('Upload failed:', error)
      );
    }
  }

  private handleUploadProgress(event: any): void {
    if (event.type === HttpEventType.UploadProgress) {
      if (event.total) {
        const percent = Math.round((100 * event.loaded) / event.total);
        console.log(`Upload is ${percent}% done.`);
      }
    } else if (event.type === HttpEventType.Response) {
      this.getFilesFolder(this.folderId);
    }
  }

  download(file: FileList): void {
    this.cloudStorageService
      .downloadFile(file.file_name, file.file_id)
      .subscribe(
        (blob) => this.handleFileDownload(blob, file.file_name),
        (error) => console.error('Download error:', error)
      );
  }

  deleteFile(file: FileList): void {
    this.cloudStorageService.deleteFile(file.file_id).subscribe((res) => {
      if (res.success) {
        this.getFilesFolder(this.folderId);
      }
    });
  }

  private handleFileDownload(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  moveFiles(): void {
    let filesIds = ['1724479668378.9565'];
    let folderId = '66c978b9a4cc7bdf55ccd049';

    this.cloudStorageService.moveFiles(filesIds, folderId).subscribe((res) => {
      console.log(res);
    });
  }

  moveFolder(): void {
    let folderId = '66c97cecb5477b7d8a544b1d';
    let destinationFolderId = '66c3f1555230714ee587af1e';

    this.cloudStorageService
      .moveFolder(folderId, destinationFolderId)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
