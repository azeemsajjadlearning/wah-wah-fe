import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { User } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService } from '../confirmation/confirmation.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [AuthService],
})
export class LayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  currentUser: User;

  isScreenSmall: boolean;
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  ngOnInit() {
    this.authService.getUser().subscribe((res) => {
      this.currentUser = res.result;
    });

    window.innerWidth > 768
      ? (this.isScreenSmall = true)
      : (this.isScreenSmall = false);

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((evt: any) => {
      evt['currentTarget']['innerWidth'] > 768
        ? (this.isScreenSmall = true)
        : (this.isScreenSmall = false);
    });
  }

  logout() {
    this.authService.logOut().subscribe((res) => {
      if (res.success) {
        localStorage.removeItem(environment.token);
        this.router.navigateByUrl('sign-in');
      } else {
        this.confirmationService.open({
          title: 'Error',
          icon: {
            color: 'warn',
            name: 'block',
            show: true,
          },
          message: res.err.message || 'something went wrong!',
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
