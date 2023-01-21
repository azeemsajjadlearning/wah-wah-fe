import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { SignInUser, SignUpUser } from '../models/auth';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  public signUp(user: SignUpUser): Observable<any> {
    return this.http.post(environment.api_prefix + 'users/register', user);
  }

  public signIn(user: SignInUser): Observable<any> {
    return this.http.post(environment.api_prefix + 'users/login', user);
  }

  public logOut(): Observable<any> {
    return this.http.get(environment.api_prefix + 'users/logout');
  }

  public getUser(): Observable<any> {
    return this.http.get(environment.api_prefix + 'users');
  }

  public resetPassword(email: string): Observable<any> {
    return this.http.post(environment.api_prefix + 'users/reset-password', {
      email,
    });
  }
}
