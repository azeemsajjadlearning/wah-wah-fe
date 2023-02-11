import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, finalize } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { LoadingBarService } from 'src/app/common/loading-bar/loading-bar.service';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'selector-name',
  templateUrl: 'task.component.html',
  styleUrls: ['task.component.scss'],
})
export class TaskComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private confirmationService: ConfirmationService
  ) {}

  allTask: any;
  task = new FormControl(null);
  displayedColumns = ['title', 'status', 'createdAt', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getAllTask();
  }

  getAllTask() {
    this.taskService.getAllTask().subscribe((res) => {
      this.allTask = new MatTableDataSource<Task>(res);
      this.allTask.paginator = this.paginator;
    });
  }

  addTask() {
    if (this.task.value != null) {
      this.taskService
        .createTask(this.task.value)
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
            this.getAllTask();
            this.task.setValue(null);
          })
        )
        .subscribe(() => {});
    }
  }

  changeStatus(ele: Task) {
    this.taskService
      .updateStatus(ele._id)
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
        })
      )
      .subscribe(() => {});
  }

  deleteTask(element: Task) {
    this.taskService
      .deleteTask(element._id)
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
          this.getAllTask();
        })
      )
      .subscribe(() => {});
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allTask.filter = filterValue.trim().toLowerCase();

    if (this.allTask.paginator) {
      this.allTask.paginator.firstPage();
    }
  }
}
