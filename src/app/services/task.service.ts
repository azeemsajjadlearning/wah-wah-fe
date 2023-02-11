import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ConfirmationService } from '../common/confirmation/confirmation.service';
import { environment } from '../environments/environment';

@Injectable()
export class TaskService {
  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService
  ) {}

  public getAllTask(): Observable<any> {
    return this.http.get(environment.api_prefix + 'tasks').pipe(
      tap((res: any) => {
        if (!res.success) {
          this.confirmationService.open({
            title: 'ERROR!',
            message: 'Something went wrong!',
            icon: {
              name: 'error',
              color: 'error',
              show: true,
            },
            actions: {
              confirm: {
                label: 'Ok!',
                color: 'primary',
                show: true,
              },
              cancel: {
                show: false,
              },
            },
          });
        }
      }),
      map((res: any) => res.result)
    );
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
