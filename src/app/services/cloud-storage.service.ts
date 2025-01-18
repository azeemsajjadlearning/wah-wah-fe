import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, from, map, Observable } from 'rxjs';
import { environment } from '../environments/environment';
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class CloudStorageService {
  private readonly CHUNK_SIZE = 5 * 1024 * 1024;

  constructor(private http: HttpClient) {}

  public uploadFile(
    selectedFile: File,
    folderId: string | null = null
  ): Observable<any> {
    const chunkRequests: Observable<any>[] = [];
    const uniqueId = uuidv4();
    const totalChunks = Math.ceil(selectedFile.size / this.CHUNK_SIZE);
    let uploadedChunks = 0;
    let progress = 0;

    for (let start = 0; start < selectedFile.size; start += this.CHUNK_SIZE) {
      const file = selectedFile.slice(start, start + this.CHUNK_SIZE);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_id', uniqueId);
      formData.append('file_name', selectedFile.name);
      formData.append('mime_type', selectedFile.type);
      formData.append('file_size', selectedFile.size.toString());
      folderId ? formData.append('folder_id', folderId) : '';

      const headers = new HttpHeaders();
      const request = new HttpRequest(
        'POST',
        environment.api_prefix + 'storage/upload',
        formData,
        {
          headers,
          reportProgress: true,
        }
      );

      chunkRequests.push(
        this.http.request(request).pipe(
          map((event: any) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                if (event.total) {
                  const currentProgress = Math.round(
                    (100 * event.loaded) / event.total
                  );
                  progress =
                    ((uploadedChunks + currentProgress / 100) / totalChunks) *
                    100;
                  return { progress };
                }
                break;
              case HttpEventType.Response:
                uploadedChunks++;
                if (uploadedChunks === totalChunks) {
                  return { progress: 100, success: true };
                }
                break;
            }
            return { progress };
          })
        )
      );
    }

    return from(chunkRequests).pipe(
      concatMap((chunkRequest) => chunkRequest),
      map((result: any) => {
        if (result.success) {
          console.log('All chunks uploaded successfully!');
          return { success: true, message: 'File uploaded successfully' };
        }
        return result;
      })
    );
  }

  public downloadChunk(chunkURL: string): Observable<Blob> {
    const url = environment.api_prefix + 'storage/download-chunk';
    return this.http.post(url, { url: chunkURL }, { responseType: 'blob' });
  }

  public getChunks(file_id: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'storage/get-chunks/' + file_id
    );
  }

  public deleteFile(file_id: string): Observable<any> {
    return this.http.delete(
      environment.api_prefix + 'storage/delete/' + file_id
    );
  }

  public getFiles(folderId: string = '0'): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'storage/get-files/' + folderId
    );
  }

  public createFolder(
    folderName: string,
    parentFolderId: string | null = null
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'storage/create-folder', {
      folder_name: folderName,
      parent_folder_id: parentFolderId,
    });
  }
}
