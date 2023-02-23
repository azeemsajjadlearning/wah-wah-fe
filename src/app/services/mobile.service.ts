import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class MobileService {
  constructor(private http: HttpClient) {}

  public getPopular(): Observable<any> {
    return this.http.get(environment.api_prefix + 'mobile/get-popular');
  }

  public getBrands(): Observable<any> {
    return this.http.get(environment.api_prefix + 'mobile/get-brands');
  }

  public getBrand(brand: string): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('brand', brand);

    return this.http.get(environment.api_prefix + 'mobile/get-brand', {
      params: queryParams,
    });
  }

  public getDetail(device_id: string): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('device_id', device_id);

    return this.http.get(environment.api_prefix + 'mobile/get-detail', {
      params: queryParams,
    });
  }

  public search(device: string): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('search', device);

    return this.http.get(environment.api_prefix + 'mobile', {
      params: queryParams,
    });
  }
}
