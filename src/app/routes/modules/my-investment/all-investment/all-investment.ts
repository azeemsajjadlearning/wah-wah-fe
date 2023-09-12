import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Investment } from 'src/app/models/investment';

@Component({
  templateUrl: 'all-investment.html',
})
export class AllInvestment implements OnInit {
  displayedColumns = ['date', 'value', 'amount'];
  totalInvestment: number = 0;
  totalReturn: number = 0;
  totalUnit: number = 0;
  totalNav: number = 0;

  constructor(
    public dialogRef: MatDialogRef<AllInvestment>,
    @Inject(MAT_DIALOG_DATA) public data: Investment[]
  ) {
    this.data = this.data.sort(
      (ele1, ele2) =>
        new Date(ele2.date).getTime() - new Date(ele1.date).getTime()
    );
  }

  ngOnInit() {
    this.data.forEach((ele) => {
      // @ts-ignore
      this.totalReturn += ele.current_value;
      this.totalInvestment += ele.amount;
      this.totalUnit += ele.amount / ele.nav;
      this.totalNav += ele.nav;
    });
  }
}
