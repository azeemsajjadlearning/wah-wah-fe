import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/operators';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { Metadata, PhotoList } from 'src/app/models/photo';
import { PhotosService } from 'src/app/services/photos.service';

@Component({
    selector: 'app-photo',
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.scss'],
    standalone: false
})
export class PhotoComponent implements OnInit {
  imageUrl: string;
  imageDetail: Metadata;
  isSidenavOpen: boolean = false;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: PhotoList,
    private photosService: PhotosService,
    private confirmService: ConfirmationService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    this.photosService.getImage(this.data.file_id).subscribe((res) => {
      this.imageUrl = res.result;
      this.imageDetail = res.image;

      this.form = this.fb.group({
        title: this.imageDetail.title,
        description: this.imageDetail.description,
        uploadDate: this.imageDetail.uploadDate,
      });

      this.form.valueChanges.pipe(debounceTime(1000)).subscribe((val) => {
        this.photosService
          .editImage(this.imageDetail._id, val)
          .subscribe(() => {});
      });
    });
  }

  deleteImage() {
    const confirmDialog = this.confirmService.open({
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
      if (res === 'confirmed') {
        this.photosService
          .deleteImage(this.data.file_id)
          .subscribe((deleteRes) => {
            if (deleteRes.success) {
              this.dialogRef.close('refresh');
            }
          });
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  download() {
    window.open(this.imageUrl, '_blank');
  }

  alterFavorite() {
    this.photosService.alterFavorite(this.imageDetail._id).subscribe(() => {
      this.getDetails();
    });
  }

  comingSoon() {
    this._snackBar.open('Feature coming soon!', undefined, {
      duration: 1000,
    });
  }
}
