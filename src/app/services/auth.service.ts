import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { SignInUser, SignUpUser, User } from '../models/auth';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  public signUp(user: SignUpUser): Observable<any> {
    return this.http.post(environment.api_prefix + 'auth/create-user', user);
  }

  public verfiyEmail(token: any): Observable<any> {
    const params = new HttpParams().set('token', token);

    return this.http.get(environment.api_prefix + 'auth/verify-email', {
      params,
    });
  }

  public signIn(user: SignInUser): Observable<any> {
    return this.http.post(environment.api_prefix + 'auth/login', user);
  }

  public requestPasswordReset(email: string): Observable<any> {
    return this.http.post(
      environment.api_prefix + 'auth/request-password-reset',
      { email }
    );
  }

  public resetPassword(
    token: string,
    newPassword: string | null
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'auth/reset-password', {
      token,
      newPassword,
    });
  }

  public getUser(): Observable<any> {
    return this.http.get(environment.api_prefix + 'auth');
  }

  public getAllUser(): Observable<any> {
    return this.http.get(environment.api_prefix + 'auth/all');
  }

  public updateUser(user: User) {
    return this.http.post(environment.api_prefix + 'auth', user);
  }
}
