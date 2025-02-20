import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { finalize } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: false,
})
export class DetailComponent implements OnInit, OnChanges {
  taskForm: FormGroup;
  today: Date = new Date();

  @Output() onSubmit = new EventEmitter<any>();
  @Input() task: Task;

  constructor(
    private _formBuilder: FormBuilder,
    private taskService: TaskService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(): void {
    this.createForm();
  }

  private createForm() {
    this.taskForm = this._formBuilder.group({
      _id: this.task?._id || null,
      title: this.task?.title || null,
      notes: this.task?.notes || null,
      completed: this.task?.completed || false,
      dueDate: this.task?.dueDate || null,
      priority: this.task?.priority || 1,
    });
  }

  toggleCompleted() {
    this.taskForm
      .get('completed')
      ?.setValue(!this.taskForm.get('completed')?.value);
  }

  submitTask(type: string | null) {
    this.onSubmit.emit(type == 'create' ? this.taskForm.value : null);
    this.taskForm.reset();
  }

  deleteTask() {
    const confirm = this.confirmationService.open({
      title: 'Delete Task',
      message:
        'Are you sure you want to delete this task? This action cannot be undone!',
      icon: {
        color: 'warn',
        name: 'warning',
        show: true,
      },
      dismissible: false,
      actions: {
        confirm: {
          label: 'Delete',
          color: 'warn',
          show: true,
        },
        cancel: {
          label: 'Cancel',
          show: true,
        },
      },
    });

    confirm.afterClosed().subscribe((res: string) => {
      if (res == 'confirmed') {
        this.taskService
          .deleteTask(this.task._id)
          .pipe(
            finalize(() => {
              this.onSubmit.emit(null);
            })
          )
          .subscribe();
      }
    });
    //
  }

  setTaskPriority(priority: any): void {
    this.taskForm.get('priority')?.setValue(priority);
  }

  isOverdue(): boolean {
    return moment(this.taskForm.value.dueDate, moment.ISO_8601).isBefore(
      moment(),
      'days'
    );
  }
}
