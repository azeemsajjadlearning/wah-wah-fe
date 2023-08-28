import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Bdd, Coach } from 'src/app/models/train';

@Component({
  selector: 'app-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.scss'],
})
export class SeatMapComponent implements OnInit {
  cls: string;
  coach: Coach;
  seats: Bdd[][];

  constructor(
    public dialogRef: MatDialogRef<SeatMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.coach = this.data.car;
    this.cls = this.data.cls;
    this.seats = this.transformData(this.coach?.bdd);
  }

  getToolTip(index: number): string {
    const berth = this.coach.bdd.find((ele) => ele.berthNo === index);

    if (berth) {
      const messages = berth.bsd.map((segment) => {
        const occupancyStatus = segment.occupancy ? 'occupied' : 'vacant';
        return `${segment.from} to ${segment.to} ${occupancyStatus}`;
      });

      return messages.join(',');
    } else {
      return '';
    }
  }

  getBg(index: number): string {
    const berth = this.coach.bdd.find((ele) => ele.berthNo === index);

    if (!berth) {
      return 'bg-gray-400';
    }

    const allTrue = berth.bsd.every((ele) => ele.occupancy === true);
    const anyTrue = berth.bsd.some((ele) => ele.occupancy === true);

    return allTrue ? 'bg-red-400' : anyTrue ? 'bg-cyan-400' : 'bg-green-400';
  }

  private transformData(data: Bdd[]): Bdd[][] {
    const result: { [key: string]: Bdd[] } = {};

    data.forEach((item) => {
      const key = item.cabinCoupeNameNo;
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
    });

    return Object.values(result);
  }
}
