import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { parseInt } from 'lodash-es';
import { debounceTime } from 'rxjs';
import {
  SearchedTrain,
  StationData,
  StatusStation,
  TrainStatus,
} from 'src/app/models/train';
import { TrainService } from 'src/app/services/train.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss'],
})
export class AvailabilityComponent {
  selectedTab: string = 'availability';
  selectedIndex: number;
  stationList: StationData[];
  searchedTrains: SearchedTrain[];
  filteredSearchedTrains: SearchedTrain[];
  trainList: any;
  trainStations: any;
  trainStatus: TrainStatus;
  today = new Date();
  maxDate = new Date(this.today.getTime() + 120 * 24 * 60 * 60 * 1000);

  form: FormGroup;
  pnrForm: FormGroup;
  statusForm: FormGroup;
  selectQuota: FormControl = new FormControl('GN');

  pnrStatus: any;

  constructor(private fb: FormBuilder, private trainService: TrainService) {}

  ngOnInit() {
    this.form = this.fb.group({
      source: [null, Validators.required],
      destination: [null, Validators.required],
      departureDate: [null, Validators.required],
    });

    this.pnrForm = this.fb.group({
      pnr: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
    });

    this.statusForm = this.fb.group({
      train: null,
      boarding: null,
      departure_date: null,
    });

    this.form
      .get('source')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((val) => {
        this.trainService.getStationSuggestion(val).subscribe((res) => {
          this.stationList = res.result.body[0].stations.map((item: any) => {
            return item.data;
          });
        });
      });

    this.form
      .get('destination')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((val) => {
        this.trainService.getStationSuggestion(val).subscribe((res) => {
          this.stationList = res.result.body[0].stations.map((item: any) => {
            return item.data;
          });
        });
      });

    this.statusForm
      .get('train')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((val) => {
        this.trainService.searchTrain(val).subscribe((res) => {
          this.trainList = res.result.body[0].trains;
          this.trainStations = this.trainList[0].schedule;
        });
      });

    this.selectQuota.valueChanges.subscribe((val) => {
      this.filteredSearchedTrains = this.filterByQuota(
        this.searchedTrains,
        val
      );
    });
  }

  setDate(ele: Date, index: number) {
    this.statusForm
      .get('departure_date')
      ?.setValue(ele.toISOString().slice(0, 10).replace(/-/g, ''));

    this.selectedIndex = index;
  }

  onSubmitForm() {
    this.trainService
      .getTrainsBetweenStation(
        this.form.get('source')?.value,
        this.form.get('destination')?.value,
        (
          parseInt(
            this.form
              .get('departureDate')
              ?.value.toISOString()
              .slice(0, 10)
              .replaceAll('-', '')
          ) + 1
        ).toString()
      )
      .subscribe((res) => {
        this.searchedTrains = res.result.body.trains;
        this.filteredSearchedTrains = this.filterByQuota(
          this.searchedTrains,
          'GN'
        );
      });
  }

  onSubmitPNRForm() {
    this.pnrStatus = null;
    this.trainService
      .getPNRStatus(this.pnrForm.get('pnr')?.value)
      .subscribe((res) => {
        this.pnrStatus = res.result;
      });
  }

  onSubmitStatusForm() {
    this.selectedIndex = -1;

    this.trainService
      .getRunningStatus(
        this.statusForm.get('train')?.value,
        this.statusForm.get('departure_date')?.value
      )
      .subscribe((res) => {
        this.trainStatus = res.result.body;
        this.trainStatus.stations = this.updateDatesWithDayCountChange(
          this.trainStatus.stations.map((ele: any) => {
            ele['date'] = this.statusForm.get('departure_date')?.value;
            return ele;
          })
        );
      });
  }

  getDateObjects() {
    const today = new Date();
    const yesterday = new Date(today);
    const dayBeforeYesterday = new Date(today);
    const tomorrow = new Date(today);

    yesterday.setDate(today.getDate() - 1);
    dayBeforeYesterday.setDate(today.getDate() - 2);
    tomorrow.setDate(today.getDate() + 1);

    return [dayBeforeYesterday, yesterday, today, tomorrow];
  }

  getSortedDays(daysObj: any): any[] {
    const daysOrder = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return daysOrder.map((day) => ({ key: day, value: daysObj[day] }));
  }

  filterByQuota(data: Array<any>, quota: string) {
    const dataCopy = JSON.parse(JSON.stringify(data));

    return dataCopy.filter((ele: any) => {
      ele.availability = ele.availability.filter(
        (element: any) => element.quota === quota
      );
      return ele.availability.length > 0;
    });
  }

  updateDatesWithDayCountChange(stations: StatusStation[]) {
    return stations.map((ele) => {
      ele.date = (parseInt(ele.date) + (parseInt(ele.dayCount) - 1)).toString();
      return ele;
    });
  }

  isTrainLate(data: StatusStation, type: 'arrival' | 'departure') {
    if (type == 'arrival') {
      let arrivalDateTime = this.getDateObj(data.date, data.arrivalTime);
      let actualArrivalDateTime = this.getDateObj(
        data.actual_arrival_date,
        data.actual_arrival_time
      );

      return actualArrivalDateTime.getTime() - arrivalDateTime.getTime() > 0;
    } else {
      let departureDateTime = this.getDateObj(data.date, data.departureTime);
      let actualDepartureDateTime = this.getDateObj(
        data.actual_departure_date,
        data.actual_departure_time
      );

      return (
        actualDepartureDateTime.getTime() - departureDateTime.getTime() > 0
      );
    }
  }

  isTrainLeft(item: StatusStation) {
    let currentTime = new Date();
    let departureDateTime = this.getDateObj(
      item.actual_departure_date,
      item.actual_departure_time
    );
    return currentTime.getTime() - departureDateTime.getTime() > 0;
  }

  getIndex(val: string) {
    return this.trainStatus.stations.findIndex((ele: StatusStation) => {
      return ele.stationCode == val;
    });
  }

  getDateObj(dateStr: string, timeStr: string) {
    const year = parseInt(dateStr.slice(0, 4));
    const month = parseInt(dateStr.slice(4, 6)) - 1;
    const day = parseInt(dateStr.slice(6, 8));

    const [hours, minutes] = timeStr.split(':').map((part) => parseInt(part));

    return new Date(year, month, day, hours, minutes);
  }
}
