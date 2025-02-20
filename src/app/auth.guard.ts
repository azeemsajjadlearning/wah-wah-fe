import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environments/environment';

@Injectable()
export class AuthGaurd  {
  constructor(private router: Router) {}
  canActivate(): boolean {
    if (localStorage.getItem(environment.token)) {
      return true;
    } else {
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}
