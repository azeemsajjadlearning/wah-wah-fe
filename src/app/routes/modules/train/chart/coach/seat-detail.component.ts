import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StationList } from 'src/app/models/train';

@Component({
  selector: 'selector-name',
  templateUrl: 'seat-detail.component.html',
})
export class SeatDetailComponent {
  seatData: any;
  stationList: StationList[];

  constructor(
    public dialogRef: MatDialogRef<SeatDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.seatData = this.data.seat_data;
    this.stationList = this.data.station_list;
  }

  getStationName(val: string) {
    return this.stationList.find((ele) => ele.stationCode == val)?.stationName;
  }
}
