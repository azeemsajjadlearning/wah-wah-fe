import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Car, TrainComposition, VacantBerth } from 'src/app/models/train';
import { TrainService } from 'src/app/services/train.service';
import { SeatMapComponent } from '../seat-map/seat-map.component';

interface CompositionQuery {
  train_no: string;
  date: string;
  station: string;
}

interface ClassVacancy {
  classCode: string;
  vacantBerths: string;
}

interface ClassInfo {
  code: string;
  value: string;
}

@Component({
    selector: 'app-coach',
    templateUrl: './coach.component.html',
    styleUrls: ['./coach.component.scss'],
    standalone: false
})
export class CoachComponent implements OnInit {
  query: CompositionQuery;
  trainComposition: TrainComposition;
  trainCar: Car[];
  classVacancy: ClassVacancy[];
  vacantBerth: VacantBerth[];
  seatMap: any;

  displayedColumns = [
    'from',
    'to',
    'coachName',
    'berthNumber',
    'berthCode',
    'cabinCoupe',
    'cabinCoupeNo',
  ];

  classData = [
    { code: 'UR', value: 'General Class' },
    { code: '2S', value: '2 Class Sitting' },
    { code: 'SL', value: 'Sleeper' },
    { code: '1A', value: 'First AC' },
    { code: '2A', value: 'Second AC' },
    { code: '3A', value: 'Third AC' },
    { code: 'CC', value: 'Chair Car' },
    { code: '3E', value: 'AC Economy' },
    { code: 'FC', value: 'AC First Class' },
    { code: 'EC', value: 'AC Executive Class' },
    { code: 'EA', value: 'Executive Anubhuti' },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private trainService: TrainService,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((resp) => {
      this.query = resp as CompositionQuery;
    });

    this.trainService
      .getTrainComposition(
        this.query.train_no,
        this.query.date,
        this.query.station
      )
      .subscribe((res) => {
        this.trainComposition = res.result;
        this.trainCar = this.sortAndPrependEngine(this.trainComposition.cdd);
        this.classVacancy = this.calculateTotalVacancy(this.trainCar);
      });

    this.trainService
      .getCoachChart('12392', 'NDLS', 'NDLS', 'NDLS', '2023-08-27', 'A2', '2A')
      .subscribe((res) => {
        this.matDialog.open(SeatMapComponent, {
          data: {
            car: res.result,
            cls: '2A',
          },
        });
      });
  }

  getCoach(ele: Car) {
    this.trainService
      .getCoachChart(
        this.trainComposition.trainNo,
        this.query.station,
        this.trainComposition.remote,
        this.trainComposition.from,
        this.query.date,
        ele.coachName,
        ele.classCode
      )
      .subscribe((res) => {
        this.matDialog.open(SeatMapComponent, {
          data: res.result,
        });
      });
  }

  getClass(ele: ClassVacancy) {
    this.trainService
      .getClassChart(
        this.trainComposition.trainNo,
        this.query.station,
        this.trainComposition.remote,
        this.trainComposition.from,
        this.query.date,
        ele.classCode
      )
      .subscribe((res) => {
        this.vacantBerth = res.result.vbd.sort(
          (ele1: VacantBerth, ele2: VacantBerth) =>
            ele1.berthNumber - ele2.berthNumber
        );
      });
  }

  private sortAndPrependEngine(coaches: Car[]): Car[] {
    const sortedCoaches = [...coaches].sort(
      (ele1, ele2) => ele1.positionFromEngine - ele2.positionFromEngine
    );
    sortedCoaches.unshift({
      coachName: 'Engine',
      classCode: 'E',
      positionFromEngine: 0,
      vacantBerths: 0,
    });
    return sortedCoaches;
  }

  private calculateTotalVacancy(coaches: Car[]): ClassVacancy[] {
    const vacantBerthsPerClass: { [key: string]: number } = {};

    for (const coach of coaches) {
      if (coach.classCode !== 'E') {
        vacantBerthsPerClass[coach.classCode] =
          (vacantBerthsPerClass[coach.classCode] || 0) + coach.vacantBerths;
      }
    }

    return Object.keys(vacantBerthsPerClass).map((classCode) => ({
      classCode,
      vacantBerths: vacantBerthsPerClass[classCode].toString(),
    }));
  }

  getFullClass(code: string): string | undefined {
    return this.classData.find((ele) => ele.code === code)?.value;
  }
}
