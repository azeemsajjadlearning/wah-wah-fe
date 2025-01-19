import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, finalize, Observable, switchMap, tap } from 'rxjs';
import { FileList, FolderList, FolderPath } from 'src/app/models/cloud-storage';
import { CloudStorageService } from 'src/app/services/cloud-storage.service';
import { CreateFolderComponent } from './create-folder/create-folder.component';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  templateUrl: 'cloud-storage.component.html',
  styleUrls: ['cloud-storage.component.scss'],
})
export class CloudStorageComponent implements OnInit {
  folderId: any = null;
  fileList: FileList[];
  folderList: FolderList[];
  folderPath: FolderPath[];

  displayedColumns: string[] = ['file_name', 'size', 'type', 'action'];

  constructor(
    private cloudStorageService: CloudStorageService,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private snackBar: MatSnackBar
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

  async upload(event: any) {
    const files = Array.from(event.target.files);

    for (const [index, file] of files.entries()) {
      try {
        await this.uploadFileSequentially(file, index, files.length);
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
  }

  download(file: FileList): void {
    this.cloudStorageService.getChunks(file.file_id).subscribe((res) => {
      const chunkUrls: string[] = [];

      res.result.forEach((element: any) => {
        chunkUrls.push(element.metadata.url);
      });

      const chunkBlobs: Blob[] = [];

      this.cloudStorageService.setOperation('Download');
      this.cloudStorageService.showProgress(true);
      this.cloudStorageService.setProgress(0);

      const downloadAllChunks = (index: number): Observable<Blob> => {
        if (index >= chunkUrls.length) {
          const combinedBlob = new Blob(chunkBlobs, {
            type: res.file[0].mime_type,
          });

          this.triggerDownload(combinedBlob, res.file[0].file_name);
          this.cloudStorageService.setProgress(100);
          this.cloudStorageService.showProgress(false);
          return new Observable();
        }

        return this.cloudStorageService.downloadChunk(chunkUrls[index]).pipe(
          tap((chunkBlob: Blob) => {
            chunkBlobs.push(chunkBlob);

            this.cloudStorageService.setProgress(
              +(((index + 1) / chunkUrls.length) * 100).toFixed(2)
            );
          }),
          switchMap(() => downloadAllChunks(index + 1))
        );
      };

      downloadAllChunks(0).subscribe();
    });
  }

  delete(file: FileList) {
    const dialog = this.confirmationService.open({
      title: 'Confirmation !',
      message: 'Are you sure to delete this file?',
      dismissible: true,
      icon: {
        color: 'warn',
        name: 'delete',
        show: true,
      },
      actions: {
        confirm: {
          label: 'Yes!',
          color: 'primary',
          show: true,
        },
        cancel: {
          show: true,
        },
      },
    });

    dialog.afterClosed().subscribe((val) => {
      if (val == 'confirmed') {
        this.cloudStorageService
          .deleteFile(file.file_id)
          .pipe(finalize(() => this.getFilesAndfolders(this.folderId)))
          .subscribe((resp) => {
            if (resp.success)
              this.snackBar.open('Deleted!', 'X', { duration: 3000 });
          });
      }
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
          .createFolder(val, this.folderId == 0 ? null : this.folderId)
          .pipe(finalize(() => this.getFilesAndfolders(this.folderId)))
          .subscribe((resp) => {
            if (resp.success)
              this.snackBar.open('Successful!', 'X', { duration: 3000 });
          });
      }
    });
  }

  alterFolder(folder: FolderList, type: String) {
    if (type == 'rename') {
      const folderDialog: MatDialogRef<any> = this.dialog.open(
        CreateFolderComponent,
        {
          width: '300px',
          data: { folderName: folder.folder_name },
        }
      );

      folderDialog.afterClosed().subscribe((val) => {
        if (val) {
          this.cloudStorageService
            .renameFolder(folder._id, val)
            .pipe(finalize(() => this.getFilesAndfolders(this.folderId)))
            .subscribe((resp) => {
              if (resp.success)
                this.snackBar.open('Successful!', 'X', { duration: 3000 });
            });
        }
      });
    } else if (type == 'delete') {
      this.cloudStorageService
        .deleteFolder(folder._id)
        .pipe(
          catchError((err) => {
            this.snackBar.open(err.error?.error, 'X', { duration: 3000 });
            throw err;
          }),
          finalize(() => this.getFilesAndfolders(this.folderId))
        )
        .subscribe((resp) => {
          if (resp.success)
            this.snackBar.open('Deleted!', 'X', { duration: 3000 });
        });
    }
  }

  openFolder(folder: FolderList): void {
    this.router.navigateByUrl(`/cloud-storage/${folder._id}`);
  }

  goPath(folder: FolderPath): void {
    this.router.navigateByUrl(`/cloud-storage/${folder.folder_id}`);
  }

  private uploadFileSequentially(
    file: any,
    index: number,
    total: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cloudStorageService
        .uploadFile(file, this.folderId === 0 ? null : this.folderId)
        .pipe(finalize(() => this.getFilesAndfolders(this.folderId)))
        .subscribe({
          next: (progressUpdate) => {
            this.cloudStorageService.setOperation(
              'Upload ' + (index + 1) + ' of ' + total
            );
            this.cloudStorageService.showProgress(true);
            this.cloudStorageService.setProgress(0);

            if (progressUpdate.progress !== undefined) {
              this.cloudStorageService.setProgress(
                progressUpdate.progress === 100
                  ? 99.99
                  : progressUpdate.progress.toFixed(2)
              );
            }

            if (progressUpdate.success) {
              this.snackBar.open(progressUpdate.message, 'X', {
                duration: 3000,
              });
              this.cloudStorageService.setProgress(100);
              this.cloudStorageService.showProgress(false);
              resolve(); // Resolve the promise when the upload is successful
            }
          },
          error: (err) => {
            console.error('Upload failed', err);
            reject(err); // Reject the promise if an error occurs
          },
        });
    });
  }

  private triggerDownload(blob: Blob, fileName: string): void {
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(downloadUrl);
  }

  @ViewChild(MatMenuTrigger, { static: true }) menuTrigger!: MatMenuTrigger;
  @ViewChild('menuContainer', { static: true }) menuContainer!: ElementRef;

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    event.preventDefault();

    const menuElement = this.menuContainer.nativeElement;

    menuElement.style.position = 'absolute';
    menuElement.style.left = `${
      event.clientX - (window.screen.width > 768 ? 287 : 0)
    }px`;
    menuElement.style.top = `${event.clientY}px`;

    this.menuTrigger.openMenu();
  }

  onFolderRightClick(event: MouseEvent, folder: any): void {
    event.preventDefault();
    console.log('hello');

    // this.isFolderContext = true;
    // this.selectedItem = folder;
    // this.openContextMenu(event);
  }
}
