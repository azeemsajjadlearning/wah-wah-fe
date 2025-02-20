import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TrainSchedule } from 'src/app/models/train';
import { TrainService } from 'src/app/services/train.service';

@Component({
    templateUrl: 'schedule-dialog.component.html',
    standalone: false
})
export class ScheduleDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrainSchedule
  ) {}
}
