import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { StatusStation, TrainStatus } from 'src/app/models/train';
import { TrainService } from 'src/app/services/train.service';

@Component({
  selector: 'app-running-status',
  templateUrl: './running-status.component.html',
  styleUrls: ['./running-status.component.scss'],
})
export class RunningStatusComponent {
  statusForm: FormGroup;
  trainList: any;
  trainStations: any;
  selectedIndex: number;
  trainStatus: TrainStatus;

  constructor(private fb: FormBuilder, private trainService: TrainService) {}

  ngOnInit() {
    this.statusForm = this.fb.group({
      train: null,
      boarding: null,
      departure_date: null,
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
  }

  setDate(ele: Date, index: number) {
    this.statusForm
      .get('departure_date')
      ?.setValue(ele.toISOString().slice(0, 10).replace(/-/g, ''));

    this.selectedIndex = index;
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

  updateDatesWithDayCountChange(stations: StatusStation[]) {
    return stations.map((ele) => {
      ele.date = (parseInt(ele.date) + (parseInt(ele.dayCount) - 1)).toString();
      return ele;
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

  isTrainLeft(item: StatusStation) {
    let currentTime = new Date();
    let departureDateTime = this.getDateObj(
      item.actual_departure_date,
      item.actual_departure_time
    );
    return currentTime.getTime() - departureDateTime.getTime() > 0;
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

  getDateObj(dateStr: string, timeStr: string) {
    const year = parseInt(dateStr.slice(0, 4));
    const month = parseInt(dateStr.slice(4, 6)) - 1;
    const day = parseInt(dateStr.slice(6, 8));

    const [hours, minutes] = timeStr.split(':').map((part) => parseInt(part));

    return new Date(year, month, day, hours, minutes);
  }
}
