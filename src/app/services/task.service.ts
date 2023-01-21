import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class TaskService {
  constructor(private http: HttpClient) {}

  public getAllTask(): Observable<any> {
    return this.http.get(environment.api_prefix + 'tasks');
  }

  public createTask(task: string | null): Observable<any> {
    return this.http.post(environment.api_prefix + 'tasks', { title: task });
  }

  public updateStatus(id: string) {
    return this.http.put(environment.api_prefix + 'tasks/' + id, {});
  }

  public deleteTask(id: string) {
    return this.http.delete(environment.api_prefix + 'tasks/' + id, {});
  }
}
