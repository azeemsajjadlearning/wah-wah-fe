import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class CloudStorageService {
  constructor(private http: HttpClient) {}

  public getFiles(): Observable<any> {
    return this.http.get(environment.api_prefix + 'storage');
  }

  //   public getChunk(fileId: string): Observable<any> {
  //     return this.http.get(environment.api_prefix + 'storage/' + fileId);
  //   }

  public uploadFile(file: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders();
    const request = new HttpRequest(
      'POST',
      environment.api_prefix + 'storage/upload',
      formData,
      {
        headers: headers,
        reportProgress: true,
      }
    );

    return this.http.request(request);
  }

  public downloadFile(fileName: string, fileId: string): Observable<Blob> {
    const getFileIdListUrl = `${environment.api_prefix}storage/${fileId}`;
    const downloadFileUrl = `${environment.api_prefix}storage/downloadFile`;

    // Step 1: Get the list of fileIdList from the first API
    return this.http.get<{ fileIdList: string[] }>(getFileIdListUrl).pipe(
      switchMap((response: any) => {
        const fileIdList = response.result.chunk_file_ids;

        // Step 2: Use fileIdList to get the download URL
        return this.http.post(
          downloadFileUrl,
          { fileIdList, originalname: fileName },
          { responseType: 'blob' }
        );
      })
    );
  }

  //   public downloadFile(
  //     fileIdList: string[],
  //     originalname: string
  //   ): Observable<Blob> {
  //     const body = { fileIdList, originalname };
  //     return this.http.post(
  //       environment.api_prefix + 'storage/downloadFile',
  //       body,
  //       {
  //         responseType: 'blob',
  //       }
  //     );
  //   }

  //   public downloadFile(
  //     fileIds: Array<any>,
  //     originalname: string
  //   ): Observable<any> {
  //     return this.http.post(environment.api_prefix + 'storage/downloadFile', {
  //       fileIdList: fileIds,
  //       originalname,
  //     });
  //   }
}
