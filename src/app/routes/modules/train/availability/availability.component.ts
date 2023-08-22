import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { TrainBtwnStnsList, TrainList } from 'src/app/models/train';
import { TrainService } from 'src/app/services/train.service';
import { ScheduleDialogComponent } from './schedule/schedule-dialog.component';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss'],
})
export class AvailabilityComponent {
  allStation: string[];
  trainList: TrainList;

  form: FormGroup;

  today = new Date();
  maxDate = new Date(this.today.getTime() + 120 * 24 * 60 * 60 * 1000);

  quotas: any[] = [
    { viewValue: 'GENERAL', value: 'GN' },
    { viewValue: 'LADIES', value: 'LD' },
    { viewValue: 'LOWER BIRTH/SR. CITIZEN', value: 'SS' },
    { viewValue: 'PERSON WITH DISABILITY', value: 'HP' },
    { viewValue: 'TATKAL', value: 'TQ' },
    { viewValue: 'PREMIUM TATKAL', value: 'PT' },
  ];

  constructor(
    private trainService: TrainService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.trainService.getTrains('LKO', 'NDLS', '20230930').subscribe((res) => {
      this.trainList = res.result;
    });

    this.form = this.fb.group({
      source: [null, Validators.required],
      destination: [null, Validators.required],
      dateOfJourney: [null, Validators.required],
      quota: 'GN',
    });

    this.form
      .get('source')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((val) => {
        this.trainService.searchStation(val).subscribe((res) => {
          this.allStation = res;
        });
      });

    this.form
      .get('destination')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((val) => {
        this.trainService.searchStation(val).subscribe((res) => {
          this.allStation = res;
        });
      });
  }

  onFormSubmit() {
    this.trainService
      .getTrains(
        this.form.get('source')?.value.split(' - ')[1],
        this.form.get('destination')?.value.split(' - ')[1],
        this.formatDate(this.form.get('dateOfJourney')?.value),
        this.form.get('quota')?.value
      )
      .subscribe((res) => {
        this.trainList = res.result;
      });
  }

  getAvailability(train: TrainBtwnStnsList, cls: string) {
    this.trainService
      .getAvailability(
        train.trainNumber,
        train.fromStnCode,
        train.toStnCode,
        this.formatDate(this.form.get('dateOfJourney')?.value),
        cls,
        this.form.get('quota')?.value
      )
      .subscribe((res: any) => {
        if (res.result.errorMessage) {
          this.confirmationService.open({
            title: 'Error',
            icon: {
              color: 'warn',
              name: 'error',
              show: true,
            },
            message: res.result.errorMessage || 'something went wrong!',
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
        } else {
          this.trainList.trainBtwnStnsList.map((ele) => {
            if (ele.trainNumber == res.result.trainNo)
              ele.availability = res.result;
            return ele;
          });
        }
      });
  }

  getRoute(train: TrainBtwnStnsList) {
    this.trainService
      .getTrainSchedule(parseInt(train.trainNumber))
      .subscribe((res) => {
        this.matDialog.open(ScheduleDialogComponent, {
          data: res.result,
        });
      });
  }

  private formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return year + month + day;
  }
}
