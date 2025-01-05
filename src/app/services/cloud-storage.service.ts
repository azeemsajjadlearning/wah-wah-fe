import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, from, Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';
import { saveAs } from 'file-saver';

@Injectable()
export class CloudStorageService {
  private readonly CHUNK_SIZE = 5 * 1024 * 1024;
  private progressSubject = new Subject<any>();
  progress$ = this.progressSubject.asObservable();

  constructor(private http: HttpClient) {}

  public upload(file: File, folderId: string | null = null): Observable<any> {
    const totalChunks = Math.ceil(file.size / this.CHUNK_SIZE);
    const chunkRequests: Observable<any>[] = [];
    const fileID = (Date.now() + Math.random()).toString();

    for (let start = 0; start < file.size; start += this.CHUNK_SIZE) {
      const chunk = file.slice(start, start + this.CHUNK_SIZE);
      const formData = new FormData();
      formData.append('chunk', chunk, file.name);
      formData.append('chunkIndex', `${Math.floor(start / this.CHUNK_SIZE)}`);
      formData.append('totalChunks', `${totalChunks}`);
      formData.append('fileName', file.name);
      formData.append('fileSize', file.size.toString());
      formData.append('fileID', fileID);

      if (folderId) {
        formData.append('folderId', folderId);
      }

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

      chunkRequests.push(this.http.request(request));
    }

    return from(chunkRequests).pipe(concatMap((chunkRequest) => chunkRequest));
  }

  public downloadFile(
    fileId: string,
    fileName: string,
    mimeType: string
  ): void {
    let chunkIndex = 0;
    let fileChunks: Blob[] = [];

    this.getChunks(fileId).subscribe(
      (response) => {
        if (response.success && response.result) {
          const chunkIds = response.result.chunk_file_ids;

          const downloadNextChunk = (index: number) => {
            if (index < chunkIds.length) {
              this.downloadChunk(chunkIds[index], fileName, mimeType).subscribe(
                (chunkData) => {
                  fileChunks.push(chunkData);

                  downloadNextChunk(index + 1);

                  const progress = ((index + 1) / chunkIds.length) * 100;
                  this.progressSubject.next(progress.toFixed(2));
                },
                (error) => {
                  console.error('Error downloading chunk:', error);
                }
              );
            } else {
              const finalFile = new Blob(fileChunks, { type: mimeType });
              saveAs(finalFile, fileName);
            }
          };

          downloadNextChunk(chunkIndex);
        }
      },
      (error) => {
        console.error('Error fetching chunks:', error);
      }
    );
  }

  public getFiles(folderId: any = 0): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'storage/get-files/' + folderId
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

  private getChunks(fileId: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'storage/get-chunks/' + fileId
    );
  }

  private downloadChunk(
    chunkId: string,
    fileName: string,
    mimeType: string
  ): Observable<Blob> {
    return this.http.post(
      environment.api_prefix + 'storage/download-chunks/',
      { chunk_id: chunkId, file_name: fileName, mime_type: mimeType },
      { responseType: 'blob' }
    );
  }
}
