import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { StationCode, TrainList } from 'src/app/models/train';
import { TrainService } from 'src/app/services/train.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss'],
})
export class AvailabilityComponent {
  stationList: StationCode[];
  filteredStationList: StationCode[];
  trainList: TrainList[];

  form: FormGroup;

  today = new Date();
  maxDate = new Date(this.today.getTime() + 120 * 24 * 60 * 60 * 1000);

  constructor(private fb: FormBuilder, private trainService: TrainService) {}

  ngOnInit() {
    this.trainService.getStationList().subscribe((res) => {
      this.stationList = res;
      this.filteredStationList = res;
    });

    this.form = this.fb.group({
      source: [null, Validators.required],
      destination: [null, Validators.required],
      departureDate: [null, Validators.required],
    });

    this.form.get('source')?.valueChanges.subscribe((val) => {
      this.filteredStationList = this.stationList.filter((station) => {
        return (
          station.name.toLowerCase().includes(val) ||
          station.code.toLowerCase().includes(val)
        );
      });
    });

    this.form.get('destination')?.valueChanges.subscribe((val) => {
      this.filteredStationList = this.stationList.filter((station) => {
        return (
          station.name.toLowerCase().includes(val) ||
          station.code.toLowerCase().includes(val)
        );
      });
    });
  }

  onSubmitForm() {
    this.trainService
      .getTrainsBetweenStation(
        this.form.get('source')?.value,
        this.form.get('destination')?.value,
        this.form
          .get('departureDate')
          ?.value.toISOString()
          .slice(0, 10)
          .replace(/-/g, '')
      )
      .subscribe((res) => {
        this.trainList = res.result.trainBtwnStnsList;
      });
  }

  getAvailability(train: TrainList, cls: string) {
    let index = this.trainList.findIndex(
      (ele) => ele.trainNumber === train.trainNumber
    );

    this.trainService
      .getAvailability(
        train.trainNumber,
        this.form
          .get('departureDate')
          ?.value.toISOString()
          .slice(0, 10)
          .replace(/-/g, ''),
        train.fromStnCode,
        train.toStnCode,
        cls
      )
      .subscribe((res: any) => {
        this.trainList[index].availability = {
          class: cls,
          availability: res.result,
        };
        console.log(this.trainList[index].availability);
      });
  }

  // filters

  classList = [
    { name: 'Anubhuti Class (EA)', code: 'EA' },
    { name: 'AC First Class (1A)', code: '1A' },
    { name: 'Vistadome AC (EV)', code: 'EV' },
    { name: 'Exec. Chair Car (EC)', code: 'EC' },
    { name: 'AC 2 Tier (2A)', code: '2A' },
    { name: 'First Class (FC)', code: 'FC' },
    { name: 'AC 3 Tier (3A)', code: '3A' },
    { name: 'AC 3 Economy (3E)', code: '3E' },
    { name: 'Vistadome Chair Car (VC)', code: 'VC' },
    { name: 'AC Chair car (CC)', code: 'CC' },
    { name: 'Sleeper (SL)', code: 'SL' },
    { name: 'Vistadome Non AC (VS)', code: 'VS' },
    { name: 'Second Sitting (2S)', code: '2S' },
  ];

  returnStationName(val: string): string {
    const station = this.stationList.find((ele) => ele.code === val);
    return station ? station.name : val;
  }

  returnClassName(code: string): string {
    const classObj = this.classList.find((ele) => ele.code === code);
    return classObj ? classObj.name : '';
  }
}
