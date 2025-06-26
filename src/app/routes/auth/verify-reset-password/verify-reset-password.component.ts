import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: 'verify-reset-password.component.html',
  standalone: false,
})
export class VerifyResetPasswordComponent implements OnInit {
  token: string | null = null;
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  state: 'loading' | 'success' | 'error' | 'form' = 'loading';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token');
      if (!this.token) {
        this.state = 'error';
        this.errorMessage = 'Invalid password reset link';
      } else {
        this.state = 'form';
      }
    });
  }

  ngOnInit() {}

  async resetPassword() {
    if (this.password.invalid || !this.token) return;

    this.state = 'loading';
    this.authService
      .resetPassword(this.token, this.password.value)
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
          throw err;
        }),
        finalize(() => {
          this.state = 'form';
        })
      )
      .subscribe((resp) => {
        if (resp?.success) {
          this.state = 'success';
          const pop = this.confirmationService.open({
            title: 'Success',
            icon: {
              color: 'success',
              name: 'done',
              show: true,
            },
            message: resp?.message || 'Success!',
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
          this.state = 'error';
          this.errorMessage =
            resp?.message || 'Something went wrong. Please try again.';
        }
      });
  }
}
