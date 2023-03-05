import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class QuranService {
  constructor(private http: HttpClient) {}

  public getInfo(): Observable<any> {
    return this.http.get(environment.api_prefix + 'quran');
  }

  public getLanguage(): Observable<any> {
    return this.http.get(environment.api_prefix + 'quran/language');
  }

  public getChapter(chapterId: number, language: string = ''): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('language', language);

    return this.http.get(environment.api_prefix + 'quran/' + chapterId, {
      params: queryParams,
    });
  }
}
