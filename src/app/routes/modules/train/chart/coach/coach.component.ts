import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Cdd, CoachDetail, StationList } from 'src/app/models/train';
import { TrainService } from 'src/app/services/train.service';
import { SeatDetailComponent } from './seat-detail.component';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.scss'],
})
export class CoachComponent {
  trainNo: string;
  date: string;
  boardingStation: string;
  coachDetail: CoachDetail;
  berthDetail: any;
  coachLayout: any;
  stationList: StationList[];
  totalVacantSeats: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private trainService: TrainService,
    private dialog: MatDialog
  ) {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.trainNo = res.trainNo;
      this.date = res.date;
      this.boardingStation = res.boardingStation;
    });
  }

  ngOnInit() {
    this.trainService
      .getTrainCoach(parseInt(this.trainNo), this.date, this.boardingStation)
      .subscribe((res) => {
        this.coachDetail = res.result;
        this.totalVacantSeats = this.arrangeByDistinctClassCode(
          this.coachDetail.cdd
        );
      });

    this.trainService
      .getTrainDetails(parseInt(this.trainNo), new Date(this.date).getTime())
      .subscribe((res) => {
        this.stationList = res.result.stationList;
      });
  }

  getDetails(ele: Cdd) {
    this.trainService
      .getCoachComposition(
        parseInt(this.trainNo),
        this.boardingStation,
        this.coachDetail.remote,
        this.coachDetail.from,
        this.coachDetail.trainStartDate.toString(),
        ele.coachName,
        ele.classCode
      )
      .subscribe((res) => {
        this.berthDetail = res.result;

        const berthCodeOrder = ['L', 'M', 'U', 'R', 'L', 'M', 'U', 'P'];

        const cabinCoupeNameNoSet = new Set(
          this.berthDetail.bdd.map((item: any) => item.cabinCoupeNameNo)
        );
        const distinctCabinCoupeNameNoArray = Array.from(cabinCoupeNameNoSet);

        const resultArray: any = [];

        distinctCabinCoupeNameNoArray.forEach((cabinCoupeNameNo) => {
          const filteredData = this.berthDetail.bdd
            .filter((item: any) => item.cabinCoupeNameNo === cabinCoupeNameNo)
            .sort((a: any, b: any) => {
              const indexA = berthCodeOrder.indexOf(a.berthCode);
              const indexB = berthCodeOrder.indexOf(b.berthCode);
              return indexA - indexB;
            });

          const newObj = {
            cabinCoupeNameNo: cabinCoupeNameNo,
            data: filteredData,
          };
          resultArray.push(newObj);
        });

        this.coachLayout = resultArray;
      });
  }

  getSeatDetail(ele: any) {
    this.dialog.open(SeatDetailComponent, {
      data: {
        seat_data: ele,
        station_list: this.stationList,
      },
    });
  }

  hasSingleFalseOccupancy(bsd: any[]): boolean {
    return (
      bsd.some((item) => item.occupancy === false) &&
      bsd.every((item) => item.occupancy === false)
    );
  }

  hasMultipleOccupancyWithFalse(bsd: any[]): boolean {
    return (
      bsd.some((item) => item.occupancy === false) &&
      bsd.some((item) => item.occupancy === true)
    );
  }

  arrangeByDistinctClassCode(coaches: any) {
    const distinctClassCodes = [
      ...new Set(coaches.map((coach: any) => coach.classCode)),
    ];
    const result = distinctClassCodes.map((classCode) => {
      const vacantBerths = coaches
        .filter((coach: any) => coach.classCode === classCode)
        .map((coach: any) => coach.vacantBerths)
        .reduce((acc: any, curr: any) => acc + curr, 0);

      return { classCode, vacantBerths };
    });

    return result;
  }
}
