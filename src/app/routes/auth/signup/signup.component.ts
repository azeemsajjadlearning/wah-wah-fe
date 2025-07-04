import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.scss'],
  standalone: false,
})
export class SignUpComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  signUpForm: FormGroup;

  ngOnInit() {
    this.signUpForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  signUpFormSubmit() {
    this.signUpForm.disable();
    this.authService
      .signUp(this.signUpForm.value)
      .pipe(
        catchError((err) => {
          this.confirmationService.open({
            title: 'Error',
            icon: {
              color: 'warn',
              name: 'error',
              show: true,
            },
            message: 'something went wrong',
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
        finalize(() => this.signUpForm.enable())
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
            message: 'User Created! Please verify your email!',
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
            this.signUpForm.enable();
          });
        }
      });
  }
}
