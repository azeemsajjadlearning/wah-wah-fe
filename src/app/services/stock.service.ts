import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CollectionType } from '../models/stock';

@Injectable()
export class StockService {
  constructor(private http: HttpClient) {}

  public getPopularMF(): Observable<any> {
    return this.http.get(environment.api_prefix + 'stock/get-popular-mf');
  }

  public searchMF(query: string, page: number = 0): Observable<any> {
    return this.http.post(environment.api_prefix + 'stock/search-mf', {
      query,
      page,
    });
  }

  public getCollection(type: CollectionType): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'stock/get-collections/' + type
    );
  }

  public getMFInfo(searchId: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'stock/get-mf-info/' + searchId
    );
  }

  public getMFGraph(schemeCode: string, months: number = 36): Observable<any> {
    return this.http.post(environment.api_prefix + 'stock/get-mf-graph', {
      scheme_code: schemeCode,
      months,
    });
  }

  public getMFDetails(isin: string, schemeType: string): Observable<any> {
    return this.http.post(environment.api_prefix + 'stock/get-mf-details', {
      isin,
      scheme_type: schemeType,
    });
  }

  public getLatestAggregate(): Observable<any> {
    return this.http.get(environment.api_prefix + 'stock/get-latest-aggregate');
  }

  public getAllIndices(): Observable<any> {
    return this.http.get(environment.api_prefix + 'stock/get-all-indices');
  }
}
