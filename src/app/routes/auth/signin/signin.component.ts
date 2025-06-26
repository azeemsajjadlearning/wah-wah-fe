import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { environment } from 'src/app/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'selector-name',
  templateUrl: 'signin.component.html',
  styleUrls: ['signin.component.scss'],
  standalone: false,
})
export class SignInComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  signInForm: FormGroup;

  ngOnInit() {
    this.signInForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  signInFormSubmit() {
    this.signInForm.disable();

    this.authService
      .signIn(this.signInForm.value)
      .pipe(
        catchError((err) => {
          console.log(err.error.message);

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
        }),
        finalize(() => {
          this.signInForm.enable();
        })
      )
      .subscribe((res) => {
        if (res.success) {
          localStorage.setItem(environment.token, res.result.token);
          this.router.navigateByUrl('/task');
        } else {
          this.confirmationService.open({
            title: 'Error',
            icon: {
              color: 'warn',
              name: 'error',
              show: true,
            },
            message: res.error || 'something went wrong',
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
        }
      });
  }
}
