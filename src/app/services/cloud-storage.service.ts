import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class CloudStorageService {
  constructor(private http: HttpClient) {}

  public getFiles(folderId: any = 0): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'storage/get-files/' + folderId
    );
  }

  public uploadFile(
    file: any,
    folderId: string | null = null
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Only append folderId if it's not null
    if (folderId !== null) {
      formData.append('folderId', folderId);
    }

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
    const getFileIdListUrl = `${environment.api_prefix}storage/getChunk/${fileId}`;
    const downloadFileUrl = `${environment.api_prefix}storage/downloadFile`;

    return this.http.get<{ fileIdList: string[] }>(getFileIdListUrl).pipe(
      switchMap((response: any) => {
        const fileIdList = response.result.chunk_file_ids;

        return this.http.post(
          downloadFileUrl,
          { fileIdList, originalname: fileName },
          { responseType: 'blob' }
        );
      })
    );
  }

  public createFolder(
    name: string,
    folderParentId: any = null
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'storage/create-folder', {
      folder_name: name,
      parent_folder_id: folderParentId,
    });
  }

  public getFolders(parentFolderId: string | null): Observable<any> {
    return this.http.get(
      environment.api_prefix +
        'storage/get-folder/' +
        (parentFolderId == null ? 0 : parentFolderId)
    );
  }

  public deleteFolder(folderId: string): Observable<any> {
    return this.http.delete(
      environment.api_prefix + 'storage/delete-folder/' + folderId
    );
  }
}
