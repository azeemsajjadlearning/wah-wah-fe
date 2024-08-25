import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
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
    files: File[],
    folderId: string | null = null
  ): Observable<any> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file, file.name);
    });

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

  public deleteFile(fileId: string): Observable<any> {
    return this.http.delete(
      environment.api_prefix + 'storage/delete-file/' + fileId
    );
  }

  public moveFiles(
    fileIds: string[],
    destinationFolderId: string
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'storage/files/move', {
      fileIds,
      destinationFolderId,
    });
  }

  public moveFolder(
    folderId: string,
    destinationFolderId: string
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'storage/folder/move', {
      folderId,
      destinationFolderId,
    });
  }

  public search(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get(environment.api_prefix + 'storage/search', { params });
  }
}
