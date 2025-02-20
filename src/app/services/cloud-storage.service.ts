import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  from,
  map,
  Observable,
  of,
  retry,
} from 'rxjs';
import { environment } from '../environments/environment';
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class CloudStorageService {
  private readonly CHUNK_SIZE = 3 * 1024 * 1024;

  private progressSubject = new BehaviorSubject<number>(0);
  private showSubject = new BehaviorSubject<boolean>(false);
  private operationSubject = new BehaviorSubject<string>('');

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

      const chunkRequest = this.http.request(request).pipe(
        retry(3),
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
        }),
        catchError((error) => {
          console.error('Chunk upload failed for file:', selectedFile);
          console.error('Error:', error);
          return of({
            progress,
            success: false,
            message: 'Upload failed, retrying...',
          });
        })
      );

      chunkRequests.push(chunkRequest);
    }

    return from(chunkRequests).pipe(
      concatMap((chunkRequest) => chunkRequest),
      map((result: any) => {
        if (result.success) {
          return { success: true, message: 'File uploaded successfully' };
        }
        return result;
      })
    );
  }

  public downloadChunk(chunkURL: string): Observable<Blob> {
    const url = environment.api_prefix + 'storage/download-chunk';
    return this.http.post(
      url,
      { message_id: chunkURL },
      { responseType: 'blob' }
    );
  }

  public getChunks(file_id: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'storage/get-chunks/' + file_id
    );
  }

  public search(query: string): Observable<any> {
    return this.http.get(environment.api_prefix + 'storage/search/' + query);
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

  public renameFile(file_id: string, file_name: string): Observable<any> {
    return this.http.put(
      environment.api_prefix + 'storage/rename-file/' + file_id,
      { file_name }
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

  public renameFolder(folderId: string, folderName: string): Observable<any> {
    return this.http.put(
      environment.api_prefix + 'storage/rename-folder/' + folderId,
      { folder_name: folderName }
    );
  }

  public deleteFolder(folder_id: string): Observable<any> {
    return this.http.delete(
      environment.api_prefix + 'storage/delete-folder/' + folder_id
    );
  }

  public moveFile(
    file_id: string,
    target_folder_id: string | null
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'storage/move-file', {
      file_id: file_id,
      target_folder: target_folder_id,
    });
  }

  public copyFile(
    file_id: string,
    target_folder_id: string | null
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'storage/copy-file', {
      file_id: file_id,
      target_folder: target_folder_id,
      new_file_id: uuidv4(),
    });
  }

  public moveFolder(
    folder_id: string,
    target_folder_id: string | null
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'storage/move-folder', {
      folder_id: folder_id,
      target_folder: target_folder_id,
    });
  }

  setProgress(progress: number) {
    this.progressSubject.next(progress);
  }

  showProgress(show: boolean) {
    this.showSubject.next(show);
  }

  setOperation(operation: string) {
    this.operationSubject.next(operation);
  }

  get progress$() {
    return this.progressSubject.asObservable();
  }

  get show$() {
    return this.showSubject.asObservable();
  }

  get operation$() {
    return this.operationSubject.asObservable();
  }
}
