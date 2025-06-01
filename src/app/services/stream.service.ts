import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class StreamService {
  constructor(private http: HttpClient) {}

  public getFiles(magnetLink: string): Observable<any> {
    const encodedMagnet = encodeURIComponent(magnetLink);

    return this.http.get(
      environment.api_prefix + `stream/get-files?magnet=${encodedMagnet}`
    );
  }

  public getStreamURL(magnetLink: string, fileName: string): Observable<Blob> {
    return this.http.post(
      environment.api_prefix + 'stream',
      {
        magnet: magnetLink,
        filename: fileName,
      },
      { responseType: 'blob' }
    );
  }
}
