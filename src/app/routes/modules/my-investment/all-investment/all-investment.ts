import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { Investment, InvestmentDetail } from 'src/app/models/investment';
import { InvestmentService } from 'src/app/services/investment.service';
import { AddInvestment } from '../add-investment/add-investment';

@Component({
    templateUrl: 'all-investment.html',
    standalone: false
})
export class AllInvestment implements OnInit {
  avgNav: number = 0;
  balancedUnit: number = 0;
  displayedColumns = ['date', 'value', 'amount', 'option'];

  constructor(
    public dialogRef: MatDialogRef<AllInvestment>,
    @Inject(MAT_DIALOG_DATA) public data: Investment,
    private investmentService: InvestmentService,
    private confirmationService: ConfirmationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.data.details.forEach((ele: InvestmentDetail) => {
      this.avgNav += ele.nav;
      this.balancedUnit += ele.amount / ele.nav;
    });

    this.avgNav = this.avgNav / this.data.details.length;
  }

  deleteInvestment(ele: InvestmentDetail) {
    const deleteReq = this.confirmationService.open({
      title: 'Confirmation!',
      message: 'Are you sure to delete this entry of date ' + ele.date,
      icon: {
        name: 'recommend',
        color: 'basic',
        show: true,
      },
      actions: {
        confirm: {
          label: 'Yes!',
          color: 'warn',
        },
        cancel: {
          label: 'Cancel',
        },
      },
      dismissible: false,
    });

    deleteReq.afterClosed().subscribe((res) => {
      if (res == 'confirmed') {
        this.data.details = this.data.details.filter(
          (item) => item._id !== ele._id
        );
        this.investmentService.deleteInvestment(ele._id).subscribe((res) => {
          if (!res.success) {
            const confirm = this.confirmationService.open({
              title: 'Error',
              icon: {
                color: 'warn',
                name: 'error',
                show: true,
              },
              message: 'something went wrong!',
              dismissible: false,
              actions: {
                confirm: {
                  label: 'Ok!',
                  color: 'warn',
                  show: true,
                },
                cancel: {
                  show: false,
                },
              },
            });

            confirm.afterClosed().subscribe(() => {
              this.dialogRef.close();
            });
          }
        });
      }
    });
  }

  editInvestment(ele: InvestmentDetail) {
    let data = JSON.parse(JSON.stringify(ele));
    data['schema_code'] = this.data.schema_code;

    const dialog = this.dialog.open(AddInvestment, {
      data: { detail: data, type: 'Edit' },
      width: '90%',
      maxWidth: '400px',
    });

    dialog.afterClosed().subscribe(() => this.dialogRef.close());
  }
}
