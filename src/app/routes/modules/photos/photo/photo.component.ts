import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { PhotoList } from 'src/app/models/photo';
import { PhotosService } from 'src/app/services/photos.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent {
  imageUrl: string;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: PhotoList,
    private photosService: PhotosService,
    private confirmService: ConfirmationService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.photosService.getImage(this.data.file_id).subscribe((res) => {
      this.imageUrl = res.result;
    });
  }

  deleteImage() {
    let confirmDialog = this.confirmService.open({
      title: 'Confirmation',
      message: 'Are you sure to delete this photo?',
      actions: {
        confirm: {
          label: 'Yes',
          color: 'warn',
          show: true,
        },
        cancel: {
          label: 'Cancel',
          show: true,
        },
      },
    });

    confirmDialog.afterClosed().subscribe((res) => {
      if (res == 'confirmed') {
        this.photosService.deleteImage(this.data.file_id).subscribe((res) => {
          if (res.success) this.dialogRef.close('refresh');
        });
      }
    });
  }

  comingSoon() {
    this._snackBar.open('Feature coming soon!', undefined, {
      duration: 1000,
    });
  }
}
