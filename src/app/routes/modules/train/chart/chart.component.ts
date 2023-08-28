import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import {
  StationList,
  TrainComposition,
  TrainSchedule,
} from 'src/app/models/train';
import { TrainService } from 'src/app/services/train.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  form: FormGroup;
  allTrains: string[];
  trainSchedule: TrainSchedule;
  stationList: StationList[];

  minDate: Date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  maxDate: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  displayedColumns = [
    'position',
    'stationName',
    'arrivalTime',
    'departureTime',
    'haltTime',
    'distance',
    'dayCount',
  ];

  constructor(
    private fb: FormBuilder,
    private trainService: TrainService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      train_no: [null, Validators.required],
      station: [null, Validators.required],
      date: [new Date(), Validators.required],
    });

    this.form
      .get('train_no')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((val) => {
        this.trainService.searchTrain(val).subscribe((res) => {
          this.allTrains = res;
        });
      });
  }

  onFormSubmit() {
    this.form
      .get('train_no')
      ?.setValue(this.form.get('train_no')?.value.split(' - ')[0]);

    this.form
      .get('date')
      ?.setValue(this.formatDateToYYYYMMDD(this.form.get('date')?.value));

    this.router.navigate(['train/coach'], { queryParams: this.form.value });
  }

  getTrainSchedule(event: any): void {
    this.trainService
      .getTrainSchedule(event.option.value.split(' - ')[0])
      .subscribe((resp) => {
        this.trainSchedule = resp.result;
        this.stationList = this.trainSchedule.stationList;
      });
  }

  formatDateToYYYYMMDD(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
