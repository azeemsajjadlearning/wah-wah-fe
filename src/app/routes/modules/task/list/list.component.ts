import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { catchError } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnChanges {
  @Output() createNewTask = new EventEmitter<any>();
  @Input() updateList: boolean;

  tasks: Task[] = [];
  selectedTask: Task;
  incomplete: number;

  constructor(
    private taskService: TaskService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getTask();
  }

  ngOnChanges(): void {
    if (this.updateList) this.getTask();
  }

  private getTask() {
    this.taskService.getAllTask().subscribe((res: any) => {
      this.tasks = res;

      this.incomplete =
        this.tasks.length - this.tasks.filter((task) => task.completed).length;
    });
  }

  createTask(task: Task | null) {
    this.createNewTask.emit(task);
  }

  toggleCompleted(task: Task): void {
    task.completed = !task.completed;
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
        })
      )
      .subscribe();
  }
}
