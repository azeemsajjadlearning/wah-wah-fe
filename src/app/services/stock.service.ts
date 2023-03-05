import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class StockService {
  constructor(private http: HttpClient) {}

  public getStock(query: string = '', page: number = 0): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('q', query);
    queryParams = queryParams.append('page', page);

    return this.http.get(environment.api_prefix + 'stock/get-mf', {
      params: queryParams,
    });
  }

  public getLatestNav(schemeCode: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'stock/get-mf-latest/' + schemeCode
    );
  }
}
