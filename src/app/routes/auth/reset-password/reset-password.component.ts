import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: false,
})
export class ResetPasswordComponent {
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {}

  resetForm: FormGroup;

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  resetFormSubmit() {
    this.authService
      .requestPasswordReset(this.resetForm.value.email)
      .pipe(
        catchError((err) => {
          this.confirmationService.open({
            title: 'Error',
            icon: {
              color: 'warn',
              name: 'error',
              show: true,
            },
            message:
              err.error?.message || err.error?.error || 'something went wrong!',
            dismissible: false,
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

          throw new Error(err);
        })
      )
      .subscribe((resp) => {
        if (resp.success) {
          this.confirmationService.open({
            title: 'Success',
            icon: {
              color: 'success',
              name: 'done',
              show: true,
            },
            message: resp.message || 'Password reset link sent!',
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
      });
  }
}
