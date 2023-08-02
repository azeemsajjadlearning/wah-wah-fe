import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { TrainDetail, TrainList } from 'src/app/models/train';
import { TrainService } from 'src/app/services/train.service';

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss'],
})
export class TrainComponent {
  trainList: TrainList[];
  filteredTrainList: TrainList[];
  trainDetails: TrainDetail | null;

  form: FormGroup;

  constructor(
    private trainService: TrainService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.trainService.getAllTrains().subscribe((res) => {
      this.trainList = res.result;
      this.filteredTrainList = this.trainList.slice();
    });

    this.form = this.fb.group({
      trainNo: [null, Validators.required],
      date: [null, Validators.required],
      boardingStation: [null, Validators.required],
    });

    this.form
      .get('trainNo')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((val) => {
        this.filteredTrainList = this.filterTrainList(val);
        this.form.get('date')?.setValue(null);
      });

    this.form.get('date')?.valueChanges.subscribe((val: Date) => {
      if (
        this.form.get('trainNo')?.value !== null &&
        this.form.get('date')?.value !== null
      ) {
        this.trainService
          .getTrainDetails(
            parseInt(this.form.get('trainNo')?.value.split('-')[0]),
            val.getTime()
          )
          .subscribe((res) => {
            if (res.result?.errorMessage) {
              this.trainDetails = null;
              this.confirmationService.open({
                title: 'ERROR!',
                icon: {
                  color: 'error',
                  name: 'error',
                  show: true,
                },
                message: res.result?.errorMessage,
                actions: {
                  confirm: {
                    label: 'Ok!',
                    color: 'primary',
                    show: true,
                  },
                  cancel: { show: false },
                },
                dismissible: false,
              });
            } else {
              this.trainDetails = res.result;
            }
          });
      }
    });
  }

  formSubmit() {
    this.form
      .get('trainNo')
      ?.setValue(parseInt(this.form.get('trainNo')?.value.split('-')[0]));
    this.form
      .get('date')
      ?.setValue(this.formatDateToYYYYMMDD(this.form.get('date')?.value));

    this.router.navigate(['/train/coach'], { queryParams: this.form.value });
  }

  private filterTrainList(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.trainList.filter((train) => {
      const trainNumber = train.number.toLowerCase();
      const trainName = train.name.toLowerCase();
      return (
        trainNumber.includes(filterValue) || trainName.includes(filterValue)
      );
    });
  }

  private formatDateToYYYYMMDD(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getYesterday(): Date {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }

  getTomorrow(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
}
