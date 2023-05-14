import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class ThirdPartyService {
  constructor(private http: HttpClient) {}

  public getInShort(category: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'third-party/get-inshorts/' + category
    );
  }

  public getCountry(): Observable<any> {
    return this.http.get(environment.api_prefix + 'third-party/get-csc');
  }

  public getState(country: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'third-party/get-csc/' + country
    );
  }

  public getCity(country: string, state: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'third-party/get-csc/' + country + '/' + state
    );
  }

  public getMyInvestment(): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'third-party/get-my-investment'
    );
  }
}
