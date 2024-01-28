import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, finalize } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { PhotoList } from 'src/app/models/photo';
import { PhotosService } from 'src/app/services/photos.service';
import { PhotoComponent } from './photo/photo.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  photos: PhotoList[];
  selectedFiles: File[] = [];

  constructor(
    private photosService: PhotosService,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getPhotos();
  }

  private getPhotos() {
    this.photosService.getAllImages().subscribe((res) => {
      this.photos = res.result;
      console.log(this.photos);
    });
  }

  onFilesSelected(event: any): void {
    this.selectedFiles = [];

    for (let i = 0; i < event.target.files.length; i++) {
      this.selectedFiles.push(event.target.files[i]);
    }

    this.upload();
  }

  upload(): void {
    if (this.selectedFiles.length > 0) {
      const formData = new FormData();

      for (const file of this.selectedFiles) {
        formData.append('files', file);
      }

      this.photosService
        .uploadImages(formData)
        .pipe(
          catchError((error) => {
            this.confirmationService.open({
              title: 'ERROR!!',
              icon: {
                color: 'warn',
                name: 'ban',
                show: true,
              },
              message: error || 'something went wrong!',
              dismissible: true,
              actions: {
                confirm: {
                  label: 'Ok!',
                  color: 'warn',
                  show: true,
                },
                cancel: {
                  show: false,
                },
              },
            });
            throw error;
          }),
          finalize(() => {
            this.getPhotos();
          })
        )
        .subscribe(() => {});
    } else {
      console.error('No files selected');
    }
  }

  openImage(image: PhotoList) {
    const dialogRef = this.dialog.open(PhotoComponent, {
      data: image,
      height: '100%',
      width: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res == 'refresh') this.getPhotos();
    });
  }

  addAlbum() {
    this._snackBar.open('Feature coming soon!', undefined, {
      duration: 1000,
    });
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }
}
