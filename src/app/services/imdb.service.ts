import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class IMDbService {
  constructor(private http: HttpClient) {}

  public getPopular(): Observable<any> {
    return this.http.get(environment.api_prefix + 'imdb');
  }

  public getDetails(content_type: string, id: number) {
    return this.http.get(
      environment.api_prefix + 'imdb/get-details/' + content_type + '/' + id
    );
  }
}
