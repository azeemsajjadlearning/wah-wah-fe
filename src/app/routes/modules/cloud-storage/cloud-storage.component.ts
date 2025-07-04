import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { catchError, finalize, Observable, switchMap, tap } from 'rxjs';
import { FileList, FolderList, FolderPath } from 'src/app/models/cloud-storage';
import { CloudStorageService } from 'src/app/services/cloud-storage.service';
import { CreateFolderComponent } from './create-folder/create-folder.component';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  templateUrl: 'cloud-storage.component.html',
  styleUrls: ['cloud-storage.component.scss'],
  standalone: false,
})
export class CloudStorageComponent implements OnInit {
  folderId: any = null;
  fileList: FileList[];
  sortedFileList: FileList[];
  folderList: FolderList[];
  sortedFolderList: FolderList[];
  folderPath: FolderPath[];
  fileInSession: boolean = false;
  folderInSession: boolean = false;

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
      this.sortedFileList = this.fileList;
      this.folderList = resp.result.folders;
      this.sortedFolderList = this.folderList;
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
    this.cloudStorageService
      .getChunks(file.origin_file_id ? file.origin_file_id : file.file_id)
      .subscribe((res) => {
        if (res.result.length > 0) {
          const chunkUrls: string[] = [];

          res.result[0].message_ids.forEach((element: any) => {
            chunkUrls.push(element);
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
              this.snackBar.open('Download Completed!', 'X', {
                duration: 3000,
              });
              return new Observable();
            }

            return this.cloudStorageService
              .downloadChunk(chunkUrls[index])
              .pipe(
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
        } else {
          const dialog = this.confirmationService.open({
            title: 'Error !',
            message:
              'The source of this file has been deleted would you like to delete the shortcut also?',
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
            if (val) {
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
      });
  }

  onEnter(event: any) {
    let val = (event.target as HTMLInputElement).value;
    this.cloudStorageService.search(val).subscribe((resp) => {
      this.sortedFileList = resp.result.files;
      this.sortedFolderList = resp.result.folders;
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
            .renameFolder(folder.folder_id, val)
            .pipe(finalize(() => this.getFilesAndfolders(this.folderId)))
            .subscribe((resp) => {
              if (resp.success)
                this.snackBar.open('Successful!', 'X', { duration: 3000 });
            });
        }
      });
    } else if (type == 'delete') {
      this.cloudStorageService
        .deleteFolder(folder.folder_id)
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
    } else if (type == 'cut') {
      if (sessionStorage.getItem('copy_file_id'))
        sessionStorage.removeItem('copy_file_id');
      sessionStorage.setItem('move_file_id', folder.folder_id);
      this.folderInSession = true;
    }
  }

  renameFile(file: FileList) {
    const renameDialog = this.dialog.open(RenameFileDialog, {
      width: '300px',
      data: { fileName: file.file_name },
    });

    renameDialog.afterClosed().subscribe((val) => {
      if (val) {
        this.cloudStorageService
          .renameFile(file.file_id, val)
          .pipe(finalize(() => this.getFilesAndfolders(this.folderId)))
          .subscribe((resp) => {
            if (resp.success)
              this.snackBar.open('Successful!', 'X', { duration: 3000 });
          });
      }
    });
  }

  getDetails(file: FileList) {
    this.dialog.open(FileDetailDialog, { minWidth: '300px', data: { file } });
  }

  openFolder(folder: FolderList): void {
    this.router.navigateByUrl(`/cloud-storage/${folder.folder_id}`);
  }

  goPath(folder: any): void {
    this.router.navigateByUrl(`/cloud-storage/${folder.folder_id}`);
  }

  moveFile(file: FileList) {
    if (sessionStorage.getItem('copy_file_id'))
      sessionStorage.removeItem('copy_file_id');
    sessionStorage.setItem('move_file_id', file.file_id);
    this.fileInSession = true;
  }

  pasteFile() {
    if (this.fileInSession) {
      let file_id: any;

      if (sessionStorage.getItem('move_file_id')) {
        file_id = sessionStorage.getItem('move_file_id');

        this.cloudStorageService
          .moveFile(file_id, this.folderId == 0 ? null : this.folderId)
          .pipe(
            finalize(() => {
              this.fileInSession = false;
              sessionStorage.removeItem('move_file_id');
              this.getFilesAndfolders(this.folderId);
            })
          )
          .subscribe((resp) => {
            if (resp.success) {
              this.snackBar.open(resp.message, 'x', { duration: 3000 });
            }
          });
      } else if (sessionStorage.getItem('copy_file_id')) {
        file_id = sessionStorage.getItem('copy_file_id');

        this.cloudStorageService
          .copyFile(file_id, this.folderId == 0 ? null : this.folderId)
          .pipe(
            finalize(() => {
              this.fileInSession = false;
              sessionStorage.removeItem('copy_file_id');
              this.getFilesAndfolders(this.folderId);
            })
          )
          .subscribe((resp) => {
            if (resp.success) {
              this.snackBar.open(resp.message, 'x', { duration: 3000 });
            }
          });
      }
    } else if (this.folderInSession) {
      let folderId: any;

      if (sessionStorage.getItem('move_file_id')) {
        folderId = sessionStorage.getItem('move_file_id');

        this.cloudStorageService
          .moveFolder(folderId, this.folderId == 0 ? null : this.folderId)
          .pipe(
            finalize(() => {
              this.folderInSession = false;
              sessionStorage.removeItem('copy_file_id');
              this.getFilesAndfolders(this.folderId);
            })
          )
          .subscribe((resp) => {
            if (resp.success) {
              this.snackBar.open(resp.message, 'x', { duration: 3000 });
            }
          });
      }
    }
  }

  copyFile(file: FileList) {
    if (sessionStorage.getItem('move_file_id'))
      sessionStorage.removeItem('move_file_id');
    sessionStorage.setItem('copy_file_id', file.file_id);
    this.fileInSession = true;
  }

  sort(type: 'date' | 'name') {
    if (type === 'name') {
      this.sortedFileList = this.fileList.sort(
        (ele1: FileList, ele2: FileList) => {
          return ele1.file_name.localeCompare(ele2.file_name);
        }
      );

      this.sortedFolderList = this.folderList.sort(
        (ele1: FolderList, ele2: FolderList) => {
          return ele1.folder_name.localeCompare(ele2.folder_name);
        }
      );
    } else if (type === 'date') {
      this.sortedFileList = this.fileList.sort(
        // @ts-ignore
        (ele1, ele2) => new Date(ele1.created_at) - new Date(ele2.created_at)
      );

      this.sortedFolderList = this.folderList.sort(
        // @ts-ignore
        (ele1, ele2) => new Date(ele1.created_at) - new Date(ele2.created_at)
      );
    }
  }

  getFileExtensionClass(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const extensionClasses: { [key: string]: string } = {
      pdf: 'bg-red-600',
      doc: 'bg-blue-600',
      docx: 'bg-blue-600',
      xls: 'bg-green-600',
      xlsx: 'bg-green-600',
      jpg: 'bg-purple-600',
      jpeg: 'bg-purple-600',
      png: 'bg-purple-600',
      txt: 'bg-gray-600',
      mp4: 'bg-teal-600',
      avi: 'bg-teal-600',
      mov: 'bg-teal-600',
      mkv: 'bg-teal-600',
      wmv: 'bg-teal-600',
    };
    return extensionClasses[extension!] || 'bg-amber-600';
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
              resolve();
            }
          },
          error: (err) => {
            console.log(file);
            console.error('Upload failed', err);
            reject(err);
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

  dragableItem: any;
  dragType: 'file' | 'folder' | null;

  onDragStart(ele: FolderList | FileList, type: 'file' | 'folder') {
    this.dragType = type;

    this.dragableItem = ele;
  }

  onDragEnd() {
    this.dragableItem = null;
    this.dragType = null;
  }

  onDrop(folder: FolderList) {
    if (this.dragType === 'file') {
      this.cloudStorageService
        .moveFile(this.dragableItem.file_id, folder.folder_id)
        .subscribe((resp) => {
          if (resp.success) {
            this.snackBar.open(resp.message, 'X');
            this.getFilesAndfolders(this.folderId);
          }
        });
    } else if (this.dragType === 'folder') {
      this.cloudStorageService
        .moveFolder(this.dragableItem.folder_id, folder.folder_id)
        .subscribe((resp) => {
          if (resp.success) {
            this.snackBar.open(resp.message, 'X');
            this.getFilesAndfolders(this.folderId);
          }
        });
    }
  }
}

@Component({
  templateUrl: 'rename-file.component.html',
  standalone: false,
})
export class RenameFileDialog {
  constructor(
    public dialogRef: MatDialogRef<RenameFileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({ fileName: this.data?.fileName || null });
  }

  form: FormGroup;

  formSubmit() {
    this.dialogRef.close(this.form.get('fileName')?.value);
  }
}

@Component({
  templateUrl: 'file-detail.component.html',
  standalone: false,
})
export class FileDetailDialog {
  constructor(
    public dialogRef: MatDialogRef<FileDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.file = data.file;
  }

  file: any;
}
