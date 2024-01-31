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
  uniqueDates: Date[];
  groupedPhotos: PhotoList[][] = [];

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
      this.uniqueDates = this.getUniqueDates(this.photos);

      this.uniqueDates.forEach((date) => {
        const photosForDate = this.photos.filter((photo) => {
          return (
            new Date(this.formatDate(photo.metadata.uploadDate)).getTime() ===
            date.getTime()
          );
        });

        this.groupedPhotos.push(photosForDate);
      });
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
            console.log(error);

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

  private getUniqueDates(photos: PhotoList[]): Date[] {
    const uniqueDatesSet = new Set<Date>();

    photos.forEach((ele) => {
      const formattedDate = new Date(this.formatDate(ele.metadata.uploadDate));

      if (!this.isDateInSet(uniqueDatesSet, formattedDate)) {
        uniqueDatesSet.add(formattedDate);
      }
    });

    const uniqueDatesArray = Array.from(uniqueDatesSet);

    return uniqueDatesArray;
  }

  private formatDate(val: any) {
    const date = new Date(val);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private isDateInSet(dateSet: Set<Date>, date: Date): boolean {
    for (const existingDate of dateSet) {
      if (existingDate.getTime() === date.getTime()) {
        return true;
      }
    }
    return false;
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }
}
