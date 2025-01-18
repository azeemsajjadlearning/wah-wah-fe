import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: 'create-folder.component.html',
})
export class CreateFolderComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({ folderName: null });
  }

  formSubmit() {
    this.dialogRef.close(this.form.get('folderName')?.value);
  }
}
