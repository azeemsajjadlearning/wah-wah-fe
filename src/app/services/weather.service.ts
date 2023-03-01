import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class WeatherService {
  constructor(private http: HttpClient) {}

  public getCurrentWeatherByLocation(
    latitude: number,
    longitude: number
  ): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'weather/' + latitude + '/' + longitude
    );
  }
}
