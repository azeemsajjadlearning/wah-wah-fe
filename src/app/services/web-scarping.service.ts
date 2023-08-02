import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class WebScrapingService {
  constructor(private http: HttpClient) {}

  public getPrice(url: string): Observable<any> {
    return this.http.post(environment.api_prefix + 'scrap', {
      url,
    });
  }

  public trackPrice(
    product: string,
    product_price: string,
    url: string
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'scrap/track', {
      product: product,
      price: product_price,
      url: url,
    });
  }
}
