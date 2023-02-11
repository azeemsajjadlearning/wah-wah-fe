import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  resetForm: FormGroup;

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  resetFormSubmit() {
    this.resetForm.disable();

    this.authService
      .resetPassword(this.resetForm.get('email')?.value)
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
              err.error?.err?.message ||
              err.error?.error ||
              'something went wrong!',
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
        }),
        finalize(() => {
          this.resetForm.enable();
        })
      )
      .subscribe((res) => {
        if (res.success) {
          const pop = this.confirmationService.open({
            title: 'Success',
            icon: {
              color: 'success',
              name: 'done',
              show: true,
            },
            message:
              'A reset password link has been sent to your email address. Follow those instructions to confirm your email address and activate your account.',
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

          pop.afterClosed().subscribe(() => {
            this.router.navigateByUrl('/sign-in');
          });
        } else {
          const pop = this.confirmationService.open({
            title: 'Error',
            icon: {
              color: 'warn',
              name: 'error',
              show: true,
            },
            message: res.err.message,
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

          pop.afterClosed().subscribe(() => {
            this.resetForm.enable();
          });
        }
      });
  }
}
