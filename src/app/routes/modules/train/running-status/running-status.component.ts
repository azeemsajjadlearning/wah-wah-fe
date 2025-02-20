import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { LiveStatus, Rake, Station } from 'src/app/models/train';
import { TrainService } from 'src/app/services/train.service';

@Component({
    selector: 'app-running-status',
    templateUrl: './running-status.component.html',
    styleUrls: ['./running-status.component.scss'],
    standalone: false
})
export class RunningStatusComponent {
  form: FormGroup;
  allTrains: string[];
  liveStatus: LiveStatus;
  stations: Station[];
  lastStation: Station | undefined;
  nextStation: Station | undefined;
  dates: Date[];

  showIntermediate: boolean = false;
  indexNumber: number = -1;
  nextStationIndex: number;

  constructor(private fb: FormBuilder, private trainService: TrainService) {}

  ngOnInit() {
    this.dates = this.getConsecutiveDates().reverse();

    this.form = this.fb.group({
      train_no: [null, Validators.required],
      date: this.dates[0],
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
    this.trainService
      .getLiveTrainStatus(
        this.form.get('train_no')?.value.split(' - ')[0],
        this.formatDateToCustomString(this.form.get('date')?.value)
      )
      .subscribe((res) => {
        this.liveStatus = res.result;

        let dateIndex = res.result.rakes.findIndex(
          (ele: Rake) =>
            ele.startDate == this.formatDate(this.form.get('date')?.value)
        );

        let stationCopy = [...res.result.rakes[dateIndex].stations];
        this.lastStation = stationCopy.reverse().find((ele) => ele.dep);

        this.stations = this.convertStationsArray(
          this.liveStatus.rakes[dateIndex].stations
        );

        this.nextStation = this.stations.find((ele) => !ele.dep);
        this.nextStationIndex = this.stations.findIndex((ele) => !ele.dep);
      });
  }

  getIntermediateStation(index: number) {
    if (this.indexNumber === index) {
      this.showIntermediate = false;
      this.indexNumber = -1;
    } else {
      this.showIntermediate = true;
      this.indexNumber = index;
    }
  }

  convertStationsArray(stations: Station[]) {
    const result: Station[] = [];
    let currentGroup: Station | null = null;

    for (const station of stations) {
      if (station.stops === 1) {
        if (currentGroup) {
          result.push(currentGroup);
        }
        currentGroup = { ...station, intermediateStation: [] };
      } else if (currentGroup) {
        currentGroup.intermediateStation!.push(station);
      } else {
        result.push(station);
      }
    }

    if (currentGroup) {
      result.push(currentGroup);
    }

    return result;
  }

  getConsecutiveDates() {
    const currentDate = new Date();
    const dates = [];

    for (let i = 4; i >= 0; i--) {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - i);
      dates.push(newDate);
    }

    return dates;
  }

  formatDateToCustomString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
  }

  formatDate(dateObject: Date) {
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth();
    const day = dateObject.getDate();

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const formattedDate = `${day} ${months[month]} ${year}`;
    return formattedDate;
  }
}
