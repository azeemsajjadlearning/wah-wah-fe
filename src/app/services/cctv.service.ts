import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class CCTVService {
  constructor(private http: HttpClient) {}

  public startStream(channel: string): Observable<any> {
    const params = new HttpParams().set('channel', channel);

    return this.http.get(environment.api_prefix + 'stream/start-cctv-stream', {
      params,
    });
  }

  public stopStream(channel: string): Observable<any> {
    const params = new HttpParams().set('channel', channel);

    return this.http.get(environment.api_prefix + 'stream/stop-cctv-stream', {
      params,
    });
  }

  public viewRecording(channel: string, datetime: any): Observable<any> {
    const params = new HttpParams()
      .set('channel', channel)
      .set('datetime', datetime);

    return this.http.get(environment.api_prefix + 'stream/view-recording', {
      params,
    });
  }
}
