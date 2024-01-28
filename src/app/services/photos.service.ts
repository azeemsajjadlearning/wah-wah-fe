import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class PhotosService {
  constructor(private http: HttpClient) {}

  public getAllImages(): Observable<any> {
    return this.http.get(environment.api_prefix + 'telegram');
  }

  public uploadImages(formData: any): Observable<any> {
    return this.http.post(environment.api_prefix + 'telegram', formData);
  }

  public getImage(file_id: string): Observable<any> {
    return this.http.get(environment.api_prefix + 'telegram/' + file_id);
  }

  public deleteImage(file_id: string): Observable<any> {
    return this.http.delete(environment.api_prefix + 'telegram/' + file_id);
  }
}
