import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
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
  loading = false;
  loadingValue = 0;

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeRouterEvents();
    this.subscribeToProgress();
    this.updateFolderState();
  }

  private initializeRouterEvents(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateFolderState(event.urlAfterRedirects);
      }
    });
  }

  private subscribeToProgress(): void {
    this.cloudStorageService.progress$.subscribe((progress) => {
      if (progress != 100) {
        this.loadingValue = progress;
      } else {
        this.loading = false;
        this.loadingValue = 0;
        this.snackBar.open('Download Complete!', 'X');
      }
    });
  }

  private updateFolderState(url: string = this.router.url): void {
    this.folderId = this.extractFolderIdFromUrl(url);
    this.fetchFilesAndFolders();
  }

  private extractFolderIdFromUrl(url: string): string | null {
    return url.startsWith('/cloud-storage/')
      ? url.replace('/cloud-storage/', '') || null
      : null;
  }

  openCreateFolderDialog(): void {
    this.folderName.reset();
    this.createDialogRef = this.dialog.open(this.createFolderDialog, {
      width: '300px',
      disableClose: true,
    });
  }

  createFolder(): void {
    const folderName = this.folderName.value;
    if (folderName) {
      this.cloudStorageService
        .createFolder(folderName, this.folderId)
        .subscribe((resp) => {
          if (resp.success) {
            this.createDialogRef?.close();
            this.fetchFilesAndFolders();
          }
        });
    }
  }

  alterFolder(folder: FolderList, action: 'rename' | 'delete'): void {
    if (action === 'delete') {
      this.cloudStorageService.deleteFolder(folder._id).subscribe((resp) => {
        if (resp.success) this.fetchFilesAndFolders();
      });
    }
    // Additional 'rename' logic can be implemented here
  }

  openFolder(folder: FolderList): void {
    this.router.navigateByUrl(`/cloud-storage/${folder._id}`);
  }

  private fetchFilesAndFolders(): void {
    forkJoin([
      this.cloudStorageService.getFolders(this.folderId),
      this.cloudStorageService.getFiles(this.folderId || 0),
    ]).subscribe(([foldersResp, filesResp]) => {
      this.folderList = foldersResp.result;
      this.fileList = filesResp.result;
    });
  }

  upload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    if (files.length > 0) {
      this.loading = true;
      files.forEach((file) => {
        this.cloudStorageService
          .upload(file, this.folderId)
          .pipe(finalize(() => this.fetchFilesAndFolders()))
          .subscribe(
            (event) => this.handleUploadProgress(event),
            (error) => console.error('Upload failed:', error)
          );
      });
    }
  }

  download(file: FileList): void {
    this.loading = true;
    this.cloudStorageService.downloadFile(
      file.file_id,
      file.file_name,
      file.mime_type
    );
  }

  deleteFile(file: FileList): void {
    this.cloudStorageService.deleteFile(file.file_id).subscribe((res) => {
      if (res.success) this.fetchFilesAndFolders();
    });
  }

  private handleUploadProgress(event: any): void {
    if (event.type === HttpEventType.UploadProgress && event.total) {
      const progress = Math.round((100 * event.loaded) / event.total);
      console.log(`Upload progress: ${progress}%`);
    } else if (event.type === HttpEventType.Response) {
      const uploadResp = event.body;
      if (uploadResp.uploadProgress === 100) {
        this.snackBar.open('Upload Complete!', 'X');
        this.loading = false;
        this.loadingValue = 0;
      } else {
        this.loadingValue = uploadResp.uploadProgress;
      }
    }
  }
}
