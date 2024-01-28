import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvestmentService } from 'src/app/services/investment.service';
import { AddInvestment } from './add-investment/add-investment';
import { xirr, convertRate } from 'node-irr';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { AllInvestment } from './all-investment/all-investment';
import { Investment, InvestmentDetail } from 'src/app/models/investment';
import { catchError, finalize } from 'rxjs';
import { StockService } from 'src/app/services/stock.service';
import { ThirdPartyService } from 'src/app/services/third-party.service';

@Component({
  selector: 'app-my-investment',
  templateUrl: './my-investment.component.html',
  styleUrls: ['./my-investment.component.scss'],
})
export class MyInvestmentComponent {
  investment: Investment[];
  totalReturn: number;
  totalInvestment: number;
  totalXIRR: number;
  cashflow: any;

  displayedColumns = ['schema_name', 'day', 'return', 'current', 'options'];

  constructor(
    private investmentService: InvestmentService,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private ss: ThirdPartyService
  ) {}

  ngOnInit() {
    this.getInvestment();

    this.ss.getMyInvestment().subscribe((res) => {
      console.log(res);
    });
  }

  getInvestment() {
    this.investment = [];
    this.totalReturn = 0;
    this.totalInvestment = 0;
    this.totalXIRR = 0;
    this.cashflow = [];

    this.investmentService
      .getAllInvestment()
      .pipe(
        catchError((err) => {
          this.confirmationService.open({
            title: 'Error',
            icon: {
              color: 'warn',
              name: 'error',
              show: true,
            },
            message:
              err.error?.err?.message ||
              err.error?.error ||
              'something went wrong!',
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

          throw new Error(err);
        })
      )
      .subscribe((res) => {
        this.investment = res.result.map((ele: Investment) => {
          let totalAmount = 0;
          let totalValue = 0;

          ele.details.forEach((detail: InvestmentDetail) => {
            detail['current_value'] =
              (ele.current_nav * detail.amount) / detail.nav;
            totalAmount += detail.amount;
            totalValue += detail['current_value'];

            this.cashflow.push({ date: detail.date, amount: detail.amount });
          });

          ele['total_amount'] = totalAmount;
          ele['total_value'] = totalValue;

          this.totalInvestment += ele['total_amount'];
          this.totalReturn += ele['total_value'];

          return ele;
        });

        this.totalXIRR = this.calculateXIRR(this.cashflow);
      });
  }

  createInvestment() {
    const createDialogRef = this.dialog.open(AddInvestment, {
      width: '90%',
      maxWidth: '400px',
    });

    createDialogRef.afterClosed().subscribe((resp) => {
      if (resp.success) {
        this.getInvestment();

        this.confirmationService.open({
          title: 'Successful',
          message: 'Your data has been successfully added!!',
          icon: {
            name: 'done',
            color: 'success',
            show: true,
          },
          actions: {
            confirm: {
              label: 'Ok!',
            },
            cancel: {
              show: false,
            },
          },
          dismissible: true,
        });
      }
    });
  }

  addInvestment(ele: Investment) {
    const addDialogRef = this.dialog.open(AddInvestment, {
      data: { detail: ele, type: 'Add' },
      width: '90%',
      maxWidth: '400px',
    });

    addDialogRef.afterClosed().subscribe((resp) => {
      if (resp.success) {
        this.getInvestment();

        this.confirmationService.open({
          title: 'Successful',
          message: 'Your data has been successfully added!!',
          icon: {
            name: 'done',
            color: 'success',
            show: true,
          },
          actions: {
            confirm: {
              label: 'Ok!',
            },
            cancel: {
              show: false,
            },
          },
          dismissible: true,
        });
      }
    });
  }

  getTransaction(ele: Investment) {
    const detailDialogRef = this.dialog.open(AllInvestment, {
      data: ele,
      width: '90%',
    });

    detailDialogRef.afterClosed().subscribe(() => this.getInvestment());
  }

  deleteInvestment(ele: Investment) {
    const deleteReq = this.confirmationService.open({
      title: 'Confirmation!',
      message: 'Are you sure to delete all the entry of ' + ele.schema_name,
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
        this.investmentService
          .deleteAllInvestment(ele._id)
          .pipe(
            finalize(() => {
              this.getInvestment();
            })
          )
          .subscribe((res) => {
            if (!res.success) {
              this.confirmationService.open({
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
            }
          });
      }
    });
  }

  private calculateXIRR(investmentData: any[]): any {
    const cashFlows = investmentData.map((item) => {
      const date = new Date(item.date);
      const amount = -item.amount;
      return { date, amount };
    });

    cashFlows.push({ date: new Date(), amount: this.totalReturn });

    return convertRate(xirr(cashFlows).rate, 365);
  }
}
