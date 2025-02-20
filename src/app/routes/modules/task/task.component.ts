import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { catchError, finalize } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
    selector: 'selector-name',
    templateUrl: 'task.component.html',
    styleUrls: ['task.component.scss'],
    standalone: false
})
export class TaskComponent implements OnInit {
  @ViewChild(MatDrawer) drawer!: MatDrawer;
  selectedTask: Task;
  updateList: boolean = false;

  constructor(
    private taskService: TaskService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {}

  getNewTask(task: Task) {
    if (task != null) {
      if (task._id == null) {
        this.taskService
          .createTask(task)
          .pipe(
            catchError((err) => {
              this.confirmationService.open({
                title: 'Error',
                icon: {
                  color: 'warn',
                  name: 'error',
                  show: true,
                },
                message:
                  err.error?.err?.message ||
                  err.error?.error ||
                  'something went wrong!',
                dismissible: false,
                actions: {
                  confirm: {
                    label: 'Ok!',
                    color: 'warn',
                    show: true,
                  },
                  cancel: {
                    show: false,
                  },
                },
              });
              throw new Error(err);
            }),
            finalize(() => {
              this.updateList = true;
            })
          )
          .subscribe();
      } else {
        this.taskService
          .updateTask(task._id, task)
          .pipe(
            catchError((err) => {
              this.confirmationService.open({
                title: 'Error',
                icon: {
                  color: 'warn',
                  name: 'error',
                  show: true,
                },
                message:
                  err.error?.err?.message ||
                  err.error?.error ||
                  'something went wrong!',
                dismissible: false,
                actions: {
                  confirm: {
                    label: 'Ok!',
                    color: 'warn',
                    show: true,
                  },
                  cancel: {
                    show: false,
                  },
                },
              });
              throw new Error(err);
            }),
            finalize(() => {
              this.updateList = true;
            })
          )
          .subscribe();
      }
    } else {
      this.updateList = true;
    }
  }

  editTask(ele: Task) {
    this.updateList = false;
    this.selectedTask = ele;
    this.drawer.open();
  }
}
