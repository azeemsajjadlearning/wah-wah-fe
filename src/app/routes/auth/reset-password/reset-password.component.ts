import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    standalone: false
})
export class ResetPasswordComponent {
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) {}

  resetForm: FormGroup;

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  resetFormSubmit() {
    this.confirmationService.open({
      title: 'Success',
      icon: {
        color: 'success',
        name: 'done',
        show: true,
      },
      message: 'Please contact to admin to reset your password!',
      dismissible: false,
      actions: {
        confirm: {
          label: 'Ok!',
          color: 'primary',
          show: true,
        },
        cancel: {
          show: false,
        },
      },
    });
  }
}
