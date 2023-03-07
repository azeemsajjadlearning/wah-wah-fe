import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class MenuService {
  constructor(private http: HttpClient) {}

  public getAllMenu(): Observable<any> {
    return this.http.get(environment.api_prefix + 'menu/all');
  }

  public givePermission(userId: string, menuId: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + `menu/give-permission/${userId}/${menuId}`
    );
  }

  public deletePermission(userId: string, menuId: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + `menu/remove-permission/${userId}/${menuId}`
    );
  }

  public getPermission(): Observable<any> {
    return this.http.get(environment.api_prefix + 'menu');
  }

  public getAllPermissions(): Observable<any> {
    return this.http.get(environment.api_prefix + 'menu/all-permission');
  }
}
